from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    business_name: str = Field(..., min_length=2, max_length=255)
    business_type: Optional[str] = None  # retail, tourism, fashion, etc.


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    business_name: str
    business_type: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str


# ─── Upload Schemas ───────────────────────────────────────────────────────────

class ColumnMapping(BaseModel):
    customer_id: str = Field(..., description="CSV column name that identifies the customer")
    transaction_date: str = Field(..., description="CSV column name for transaction date")
    amount: str = Field(..., description="CSV column name for transaction amount (KSh)")
    product: Optional[str] = Field(None, description="Optional column for product/category")


class DataPreviewRow(BaseModel):
    row_number: int
    data: Dict[str, Any]


class UploadResponse(BaseModel):
    upload_id: str
    filename: str
    rows: int
    columns: List[str]
    preview: List[Dict[str, Any]]    # first 10 rows
    detected_format: str             # "mpesa" | "pos" | "generic"
    mapping_suggestion: ColumnMapping | None  # auto-detected column mapping


# ─── Analysis Schemas ─────────────────────────────────────────────────────────

class SegmentSummary(BaseModel):
    segment_id: int
    segment_name: str         # e.g., "Champions"
    segment_name_sw: str      # Swahili label e.g., "Wateja Wakuu"
    customer_count: int
    avg_monetary: float       # KSh
    total_monetary: float     # KSh
    avg_recency_days: int
    avg_frequency: float
    revenue_share: float      # % of total revenue
    churn_risk: str           # "low" | "medium" | "high"
    recommendation: str       # actionable advice


class AnalysisSummary(BaseModel):
    id: uuid.UUID
    filename: str
    row_count: int
    status: str
    created_at: datetime
    total_customers: Optional[int] = None
    total_revenue: Optional[float] = None

    class Config:
        from_attributes = True


class AnalysisResult(BaseModel):
    analysis_id: str
    filename: str
    created_at: datetime
    total_customers: int
    total_revenue: float         # KSh
    date_range: Dict[str, str]   # {"start": "2024-01-01", "end": "2024-12-31"}
    segments: List[SegmentSummary]
    churn_risk_count: int
    avg_ltv: float               # KSh
    rfm_chart_data: List[Dict]   # for scatter plot
    segment_chart_data: List[Dict]  # for bar/pie charts
