from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import pandas as pd
import io
import uuid
import os
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db import User, Analysis
from app.models.schemas import UploadResponse, ColumnMapping

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def suggest_mapping(columns: List[str]) -> ColumnMapping:
    """Basic logic to suggest column mapping based on common names."""
    mapping = {
        "customer_id": "",
        "transaction_date": "",
        "amount": "",
        "product": None
    }
    
    cols_lower = [c.lower() for c in columns]
    
    # ─── Customer ID ────────────────────────────────────────────────────────
    for target in ["customer", "client", "user", "phone", "number", "id", "msisdn"]:
        for i, c in enumerate(cols_lower):
            if target in c:
                mapping["customer_id"] = columns[i]
                break
        if mapping["customer_id"]: break
        
    # ─── Date ───────────────────────────────────────────────────────────────
    for target in ["date", "time", "timestamp", "period"]:
        for i, c in enumerate(cols_lower):
            if target in c:
                mapping["transaction_date"] = columns[i]
                break
        if mapping["transaction_date"]: break
        
    # ─── Amount ─────────────────────────────────────────────────────────────
    for target in ["amount", "value", "price", "total", "ksh", "paid"]:
        for i, c in enumerate(cols_lower):
            if target in c:
                mapping["amount"] = columns[i]
                break
        if mapping["amount"]: break
        
    return ColumnMapping(**mapping)

@router.post("", response_model=UploadResponse)
async def upload_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Handle CSV upload, store it, and return a preview with suggested mappings.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed"
        )

    contents = await file.read()
    try:
        # Load into pandas to validate and get preview
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse CSV: {str(e)}"
        )

    if df.empty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV is empty"
        )

    # Save file
    file_id = str(uuid.uuid4())
    filename = f"{file_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as f:
        f.write(contents)

    # Create Analysis record (pending state)
    analysis = Analysis(
        id=uuid.UUID(file_id),
        user_id=current_user.id,
        filename=file.filename,
        row_count=len(df),
        status="pending"
    )
    db.add(analysis)
    db.commit()

    # Prepare preview
    preview_df = df.head(10).fillna("")
    preview_data = preview_df.to_dict(orient="records")
    
    return UploadResponse(
        upload_id=file_id,
        filename=file.filename,
        rows=len(df),
        columns=list(df.columns),
        preview=preview_data,
        detected_format="generic", # Simplify for now
        mapping_suggestion=suggest_mapping(list(df.columns))
    )
