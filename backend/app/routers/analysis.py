from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any

import logging
import os
import traceback

# Simplified logging
logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.ml_models import run_full_ml_pipeline
from app.models.db import User, Analysis
from app.models.schemas import (
    ColumnMapping, AnalysisResult, SegmentSummary,
    ChurnPredictionData, LTVPredictionData, CohortRetentionData,
    FeatureImportanceItem
)

router = APIRouter(prefix="/analysis", tags=["Analysis"])

UPLOAD_DIR = "uploads"

def calculate_rfm(df: pd.DataFrame, mapping: ColumnMapping) -> List[SegmentSummary]:
    """
    Perform RFM analysis and return segment summaries.
    Assumes df is already cleaned.
    """
    # 1. RFM Calculation
    # Reference date (today or max date in dataset)
    reference_date = df[mapping.transaction_date].max()
    
    # Group by customer
    rfm = df.groupby(mapping.customer_id).agg({
        mapping.transaction_date: lambda x: (reference_date - x.max()).days,
        mapping.customer_id: 'count',
        mapping.amount: 'sum'
    })

    rfm.columns = ['Recency', 'Frequency', 'Monetary']
    
    # 2. Scoring (Quantiles)
    try:
        # Recency: Smaller is better
        rfm['R'] = pd.qcut(rfm['Recency'], 5, labels=[5, 4, 3, 2, 1], duplicates='drop')
        # Frequency: Larger is better
        rfm['F'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
        # Monetary: Larger is better
        rfm['M'] = pd.qcut(rfm['Monetary'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
        
        rfm['R'] = pd.to_numeric(rfm['R'])
        rfm['F'] = pd.to_numeric(rfm['F'])
        rfm['M'] = pd.to_numeric(rfm['M'])
    except Exception:
        rfm['R'] = 3
        rfm['F'] = 3
        rfm['M'] = 3

    rfm['RFM_Score'] = rfm[['R', 'F', 'M']].sum(axis=1)

    # 3. Simple Segmentation
    def segment_user(score):
        if score >= 13: return "Champions", "Wateja Wakuu", "low", "Keep them happy with loyalty rewards and early access."
        if score >= 10: return "Loyal Customers", "Wateja Waaminifu", "low", "Upsell higher value products. Ask for reviews."
        if score >= 7: return "At Risk", "Hatari ya Kuondoka", "medium", "Send personalized emails or discounts to re-engage."
        return "Hibernating", "Wasiojishughulisha", "high", "Offer a massive 'Welcome Back' discount."

    segmented_data = rfm['RFM_Score'].apply(segment_user)
    rfm['Segment'] = [x[0] for x in segmented_data]
    rfm['Segment_SW'] = [x[1] for x in segmented_data]
    rfm['Risk'] = [x[2] for x in segmented_data]
    rfm['Rec'] = [x[3] for x in segmented_data]

    # 4. Summarize
    segments = []
    total_rev = rfm['Monetary'].sum()
    
    print(f"DEBUG: Summarizing {len(rfm)} rows into segments...")
    summary = rfm.groupby(['Segment', 'Segment_SW', 'Risk', 'Rec']).agg({
        'Monetary': ['mean', 'sum'],
        'Recency': 'mean',
        'Frequency': 'mean',
        'RFM_Score': 'count'
    }).reset_index()
    
    print(f"DEBUG: Summary columns: {summary.columns.tolist()}")
    summary.columns = ['Segment', 'Segment_SW', 'Risk', 'Recommendation', 'Avg_M', 'Total_M', 'Avg_R', 'Avg_F', 'Count']
    
    for i, row in summary.iterrows():
        segments.append(SegmentSummary(
            segment_id=i,
            segment_name=str(row['Segment']),
            segment_name_sw=str(row['Segment_SW']),
            customer_count=int(row['Count']),
            avg_monetary=float(row['Avg_M']),
            total_monetary=float(row['Total_M']),
            avg_recency_days=int(row['Avg_R']),
            avg_frequency=float(row['Avg_F']),
            revenue_share=(row['Total_M'] / total_rev) * 100 if total_rev > 0 else 0,
            churn_risk=str(row['Risk']),
            recommendation=str(row['Recommendation'])
        ))
        
    return segments

@router.post("/run", response_model=AnalysisResult)
async def run_analysis(
    upload_id: str,
    mapping: ColumnMapping,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Load the uploaded CSV, perform RFM segmentation, and save results.
    """
    logger.info(f"STARTING ANALYSIS: upload_id={upload_id}, user={current_user.email}")
    # 1. Verify Analysis record
    analysis = db.query(Analysis).filter(Analysis.id == uuid.UUID(upload_id), Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis/Upload not found")

    # 2. Find file
    filename = f"{upload_id}_{analysis.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        analysis.status = "failed"
        analysis.error_message = "Source file missing"
        db.commit()
        raise HTTPException(status_code=404, detail="Source file missing")

    try:
        # 3. Load & Clean
        print(f"DEBUG: Loading file: {filepath}")
        logger.info(f"Loading file: {filepath}")
        df = pd.read_csv(filepath)
        
        # Verify columns exist
        missing = [c for c in [mapping.customer_id, mapping.transaction_date, mapping.amount] if c not in df.columns]
        if missing:
            print(f"DEBUG: Missing columns: {missing}")
            logger.error(f"Missing columns: {missing}")
            raise ValueError(f"Missing columns in CSV: {', '.join(missing)}")

        # Date cleaning
        print("DEBUG: Cleaning dates...")
        logger.info("Cleaning dates...")
        df[mapping.transaction_date] = pd.to_datetime(df[mapping.transaction_date], errors='coerce')
        
        # Amount cleaning
        print("DEBUG: Cleaning amounts...")
        logger.info("Cleaning amounts...")
        if df[mapping.amount].dtype == object:
            df[mapping.amount] = df[mapping.amount].str.replace(r'[^\d.]', '', regex=True)
        df[mapping.amount] = pd.to_numeric(df[mapping.amount], errors='coerce')

        # Drop invalid rows
        old_count = len(df)
        df = df.dropna(subset=[mapping.customer_id, mapping.transaction_date, mapping.amount])
        logger.info(f"Rows after cleaning: {len(df)} (was {old_count})")
        
        if df.empty:
            logger.error("No valid data after cleaning")
            raise ValueError("No valid data remaining after cleaning. Please check your column mapping.")

        analysis.status = "processing"
        db.commit()

        # 4. Process RFM
        logger.info("Calculating RFM...")
        segments = calculate_rfm(df.copy(), mapping)
        logger.info(f"RFM Done. Segments found: {len(segments)}")
        
        # 4.5 Run ML Pipeline (NEW)
        logger.info("Running ML prediction pipeline...")
        segment_names = [s.segment_name for s in segments]
        rfm_for_ml = df.groupby(mapping.customer_id).agg({
            mapping.transaction_date: lambda x: (df[mapping.transaction_date].max() - x.max()).days,
            mapping.customer_id: 'count',
            mapping.amount: 'sum'
        }).copy()
        rfm_for_ml.columns = ['Recency', 'Frequency', 'Monetary']
        rfm_for_ml.reset_index(drop=True, inplace=True)
        
        ml_results = run_full_ml_pipeline(df, rfm_for_ml, segment_names, mapping)
        logger.info(f"ML pipeline completed. Churn high-risk: {ml_results.get('churn', {}).get('high_risk_count', 0)}")
        
        # 5. Save results
        total_customers = df[mapping.customer_id].nunique()
        total_revenue = df[mapping.amount].sum()
        
        # Handle date range safely
        min_date = df[mapping.transaction_date].min()
        max_date = df[mapping.transaction_date].max()
        
        # Parse ML results
        churn_pred = None
        if 'churn' in ml_results and ml_results['churn']:
            churn_pred = ChurnPredictionData(
                high_risk_count=ml_results['churn'].get('high_risk_count', 0),
                medium_risk_count=ml_results['churn'].get('medium_risk_count', 0),
                low_risk_count=ml_results['churn'].get('low_risk_count', 0),
                avg_churn_probability=ml_results['churn'].get('avg_churn_probability', 0)
            )
        
        ltv_pred = None
        if 'ltv' in ml_results and ml_results['ltv']:
            ltv_pred = LTVPredictionData(
                avg_projected_ltv=ml_results['ltv'].get('avg_projected_ltv', 0),
                high_value_customers=ml_results['ltv'].get('high_value_customers', 0),
                ltv_by_segment=ml_results['ltv'].get('ltv_by_segment', {})
            )
        
        feature_importance = None
        if 'feature_importance' in ml_results and ml_results['feature_importance']:
            global_features = ml_results['feature_importance'].get('global', [])
            feature_importance = [
                FeatureImportanceItem(
                    feature=f.get('feature', ''),
                    importance=f.get('importance', 0),
                    interpretation=f.get('interpretation', ''),
                    action=f.get('action', '')
                )
                for f in global_features
            ]
        
        cohort_ret = None
        if 'cohort' in ml_results and ml_results['cohort']:
            cohort_ret = CohortRetentionData(
                repeat_purchase_rate=ml_results['cohort'].get('repeat_purchase_rate', 0),
                avg_retention_months=ml_results['cohort'].get('avg_retention_months', 0)
            )
        
        result = AnalysisResult(
            analysis_id=upload_id,
            filename=analysis.filename,
            created_at=analysis.created_at,
            total_customers=int(total_customers),
            total_revenue=float(total_revenue),
            date_range={
                "start": str(min_date.date()) if pd.notnull(min_date) else "Unknown",
                "end": str(max_date.date()) if pd.notnull(max_date) else "Unknown"
            },
            segments=segments,
            churn_risk_count=sum(s.customer_count for s in segments if s.churn_risk == "high"),
            avg_ltv=float(total_revenue / total_customers) if total_customers > 0 else 0,
            rfm_chart_data=[], 
            segment_chart_data=[{"name": s.segment_name, "value": s.customer_count} for s in segments],
            churn_prediction=churn_pred,
            ltv_prediction=ltv_pred,
            feature_importance=feature_importance,
            cohort_retention=cohort_ret
        )

        analysis.status = "done"
        analysis.result_json = result.model_dump(mode='json')
        analysis.column_mapping = mapping.model_dump(mode='json')
        db.commit()
        logger.info("ANALYSIS COMPLETED SUCCESSFULLY")

        return result

    except Exception as e:
        print(f"!!! ANALYSIS CRASHED !!!")
        traceback.print_exc()
        analysis.status = "failed"
        analysis.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("", response_model=List[Dict[str, Any]])
async def list_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all analyses for the current user."""
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    return [
        {
            "id": str(a.id),
            "filename": a.filename,
            "status": a.status,
            "created_at": a.created_at,
            "row_count": a.row_count,
            "error_message": a.error_message
        } for a in analyses
    ]

@router.get("/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_details(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full details/results of a specific analysis."""
    analysis = db.query(Analysis).filter(Analysis.id == uuid.UUID(analysis_id), Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    if analysis.status != "done":
        raise HTTPException(status_code=400, detail=f"Analysis is in state: {analysis.status}")

    return analysis.result_json
