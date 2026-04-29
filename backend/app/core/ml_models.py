"""
Machine Learning models for predictive customer analytics.
Includes: Churn prediction, LTV forecasting, feature importance extraction.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Any
from datetime import datetime, timedelta
import logging
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
import warnings

warnings.filterwarnings('ignore')
logger = logging.getLogger(__name__)


class ChurnPredictor:
    """
    Predicts customer churn probability based on RFM features.
    Uses Random Forest classifier trained on historical behavior patterns.
    """
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = ['Recency', 'Frequency', 'Monetary']
    
    def _create_training_data(self, rfm: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Create synthetic training labels for churn prediction.
        Logic: High recency (inactive) + low frequency/monetary → likely churned.
        """
        # Normalize RFM for comparison
        X = rfm[self.feature_names].copy()
        
        # Churn label: High recency (>60 days) AND (low frequency OR low monetary)
        recency_threshold = rfm['Recency'].quantile(0.75)
        frequency_threshold = rfm['Frequency'].quantile(0.25)
        monetary_threshold = rfm['Monetary'].quantile(0.25)
        
        churn_labels = ((rfm['Recency'] > recency_threshold) & 
                        ((rfm['Frequency'] < frequency_threshold) | 
                         (rfm['Monetary'] < monetary_threshold))).astype(int)
        
        return X, churn_labels
    
    def train(self, rfm: pd.DataFrame) -> None:
        """Train the churn model on RFM data."""
        try:
            X, y = self._create_training_data(rfm)
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            logger.info(f"Churn model trained. Churn rate in sample: {y.mean():.2%}")
        except Exception as e:
            logger.error(f"Churn model training failed: {e}")
            self.is_trained = False
    
    def predict(self, rfm: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Predict churn probability for each customer.
        Returns: (churn_probabilities, churn_labels)
        """
        if not self.is_trained:
            logger.warning("Churn model not trained. Training now...")
            self.train(rfm)
        
        try:
            X = rfm[self.feature_names].copy()
            X_scaled = self.scaler.transform(X)
            churn_probs = self.model.predict_proba(X_scaled)[:, 1]  # Prob of churn (class 1)
            churn_labels = (churn_probs > 0.5).astype(int)
            return churn_probs, churn_labels
        except Exception as e:
            logger.error(f"Churn prediction failed: {e}")
            # Return neutral predictions if model fails
            return np.full(len(rfm), 0.5), np.zeros(len(rfm))
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance scores."""
        if not self.is_trained:
            return {name: 0.0 for name in self.feature_names}
        
        importances = self.model.feature_importances_
        return {
            name: float(imp) 
            for name, imp in zip(self.feature_names, importances)
        }


class LTVPredictor:
    """
    Predicts future Customer Lifetime Value (LTV).
    Uses historical monetary value and frequency patterns.
    """
    
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, rfm: pd.DataFrame, df: pd.DataFrame = None) -> None:
        """Train LTV model on frequency and monetary patterns."""
        try:
            # Features: Frequency, Recency (inverse), Monetary history
            X = rfm[['Frequency', 'Monetary']].copy()
            
            # Target: Projected LTV based on average value per transaction
            y = rfm['Monetary'].copy()
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            logger.info(f"LTV model trained. R² score: {self.model.score(X_scaled, y):.3f}")
        except Exception as e:
            logger.error(f"LTV model training failed: {e}")
            self.is_trained = False
    
    def predict(self, rfm: pd.DataFrame, months_ahead: int = 12) -> np.ndarray:
        """
        Predict LTV for next N months.
        Simple approach: Project based on frequency and current value.
        """
        if not self.is_trained:
            logger.warning("LTV model not trained. Training now...")
            self.train(rfm)
        
        try:
            X = rfm[['Frequency', 'Monetary']].copy()
            X_scaled = self.scaler.transform(X)
            
            # Base LTV prediction
            base_ltv = self.model.predict(X_scaled)
            
            # Adjust for projected time period
            # Assume: LTV = (Avg value per transaction) * (Expected frequency in N months)
            avg_value = rfm['Monetary'] / (rfm['Frequency'] + 1)
            projected_frequency = rfm['Frequency'] * (months_ahead / 12)
            projected_ltv = avg_value * projected_frequency
            
            return np.maximum(projected_ltv, 0)  # Ensure non-negative
        except Exception as e:
            logger.error(f"LTV prediction failed: {e}")
            return rfm['Monetary'].values  # Fallback to current monetary value
    
    def get_avg_ltv_by_segment(self, rfm: pd.DataFrame, segments: List[str]) -> Dict[str, float]:
        """Get average LTV by segment."""
        if len(rfm) != len(segments):
            return {}
        
        rfm_copy = rfm.copy()
        rfm_copy['Segment'] = segments
        return {
            segment: float(rfm_copy[rfm_copy['Segment'] == segment]['Monetary'].mean())
            for segment in set(segments)
        }


class CohortAnalyzer:
    """
    Analyzes customer cohorts and retention patterns.
    Useful for understanding repeat purchase behavior by cohort.
    """
    
    @staticmethod
    def analyze_retention(df: pd.DataFrame, mapping: Any) -> Dict[str, Any]:
        """
        Analyze retention rates by cohort (acquisition month).
        Returns: cohort_data for visualization
        """
        try:
            # Create cohort by acquisition month
            df_copy = df.copy()
            df_copy[mapping.transaction_date] = pd.to_datetime(df_copy[mapping.transaction_date])
            
            # First purchase month (cohort)
            cohort_data = df_copy.groupby(mapping.customer_id)[mapping.transaction_date].agg([
                ('first_purchase', 'min'),
                ('last_purchase', 'max'),
                ('purchase_count', 'count'),
                ('total_value', mapping.amount)
            ]).reset_index()
            
            cohort_data['cohort_month'] = cohort_data['first_purchase'].dt.to_period('M')
            cohort_data['months_active'] = (
                (cohort_data['last_purchase'] - cohort_data['first_purchase']).dt.days / 30
            ).astype(int) + 1
            
            # Summary by cohort
            cohort_summary = cohort_data.groupby('cohort_month').agg({
                mapping.customer_id: 'count',
                'purchase_count': 'mean',
                'total_value': ['mean', 'sum'],
                'months_active': 'mean'
            }).reset_index()
            
            return {
                'cohorts': cohort_summary.to_dict(orient='records'),
                'avg_retention_months': float(cohort_data['months_active'].mean())
            }
        except Exception as e:
            logger.error(f"Cohort analysis failed: {e}")
            return {'cohorts': [], 'avg_retention_months': 0}
    
    @staticmethod
    def get_repeat_purchase_rate(df: pd.DataFrame, mapping: Any) -> float:
        """Calculate percentage of customers with repeat purchases."""
        try:
            purchase_counts = df.groupby(mapping.customer_id).size()
            repeat_rate = (purchase_counts > 1).sum() / len(purchase_counts) if len(purchase_counts) > 0 else 0
            return float(repeat_rate)
        except Exception as e:
            logger.error(f"Repeat purchase calculation failed: {e}")
            return 0.0


class FeatureImportanceExtractor:
    """
    Extracts and explains feature importance for churn prediction.
    Helps users understand which RFM factors drive churn risk.
    """
    
    @staticmethod
    def extract_from_churn_model(churn_predictor: ChurnPredictor) -> List[Dict[str, Any]]:
        """Extract feature importance from trained churn model."""
        importance = churn_predictor.get_feature_importance()
        
        features_list = [
            {
                'feature': 'Recency (Days since purchase)',
                'importance': importance.get('Recency', 0),
                'interpretation': 'Higher importance = recent activity strongly predicts retention',
                'action': 'Increase engagement frequency'
            },
            {
                'feature': 'Frequency (Purchase count)',
                'importance': importance.get('Frequency', 0),
                'interpretation': 'Higher importance = repeat customers are reliable',
                'action': 'Build loyalty programs'
            },
            {
                'feature': 'Monetary (Total spent)',
                'importance': importance.get('Monetary', 0),
                'interpretation': 'Higher importance = high-value customers are strategic',
                'action': 'VIP treatment for top spenders'
            }
        ]
        
        # Sort by importance
        features_list.sort(key=lambda x: x['importance'], reverse=True)
        return features_list
    
    @staticmethod
    def get_segment_churn_drivers(rfm: pd.DataFrame, segments: List[str], 
                                  churn_predictor: ChurnPredictor) -> Dict[str, List[str]]:
        """Identify top churn drivers per segment."""
        segment_drivers = {}
        
        for segment in set(segments):
            segment_rfm = rfm[np.array(segments) == segment]
            if len(segment_rfm) == 0:
                continue
            
            # Analyze patterns in this segment
            drivers = []
            
            # Check if recency is high (risky)
            if segment_rfm['Recency'].mean() > rfm['Recency'].median():
                drivers.append('High inactivity (recency)')
            
            # Check if frequency is low (risky)
            if segment_rfm['Frequency'].mean() < rfm['Frequency'].median():
                drivers.append('Low repeat purchases')
            
            # Check if monetary is low (risky)
            if segment_rfm['Monetary'].mean() < rfm['Monetary'].median():
                drivers.append('Low spending power')
            
            segment_drivers[segment] = drivers if drivers else ['Stable segment']
        
        return segment_drivers


def run_full_ml_pipeline(df: pd.DataFrame, rfm: pd.DataFrame, 
                         segments: List[str], mapping: Any) -> Dict[str, Any]:
    """
    Execute the complete ML pipeline.
    Returns all prediction results in a structured format.
    """
    results = {}
    
    try:
        # 1. Churn prediction
        logger.info("Running churn prediction...")
        churn_predictor = ChurnPredictor()
        churn_predictor.train(rfm)
        churn_probs, churn_labels = churn_predictor.predict(rfm)
        
        results['churn'] = {
            'probabilities': churn_probs.tolist(),
            'labels': churn_labels.tolist(),
            'high_risk_count': int((churn_probs > 0.7).sum()),
            'medium_risk_count': int(((churn_probs >= 0.5) & (churn_probs <= 0.7)).sum()),
            'low_risk_count': int((churn_probs < 0.5).sum()),
            'avg_churn_probability': float(churn_probs.mean())
        }
        
        # 2. LTV prediction
        logger.info("Running LTV prediction...")
        ltv_predictor = LTVPredictor()
        ltv_predictor.train(rfm, df)
        projected_ltv = ltv_predictor.predict(rfm, months_ahead=12)
        
        results['ltv'] = {
            'projected_ltv': projected_ltv.tolist(),
            'avg_projected_ltv': float(projected_ltv.mean()),
            'ltv_by_segment': ltv_predictor.get_avg_ltv_by_segment(rfm, segments),
            'high_value_customers': int((projected_ltv > np.percentile(projected_ltv, 75)).sum())
        }
        
        # 3. Cohort analysis
        logger.info("Running cohort analysis...")
        cohort_analyzer = CohortAnalyzer()
        cohort_data = cohort_analyzer.analyze_retention(df, mapping)
        repeat_rate = cohort_analyzer.get_repeat_purchase_rate(df, mapping)
        
        results['cohort'] = {
            'repeat_purchase_rate': repeat_rate,
            'avg_retention_months': cohort_data.get('avg_retention_months', 0),
            'cohorts': cohort_data.get('cohorts', [])
        }
        
        # 4. Feature importance
        logger.info("Extracting feature importance...")
        importance_extractor = FeatureImportanceExtractor()
        feature_importance = importance_extractor.extract_from_churn_model(churn_predictor)
        segment_drivers = importance_extractor.get_segment_churn_drivers(rfm, segments, churn_predictor)
        
        results['feature_importance'] = {
            'global': feature_importance,
            'by_segment': segment_drivers
        }
        
        logger.info("ML pipeline completed successfully")
        return results
    
    except Exception as e:
        logger.error(f"ML pipeline failed: {e}")
        return {
            'churn': {},
            'ltv': {},
            'cohort': {},
            'feature_importance': {},
            'error': str(e)
        }
