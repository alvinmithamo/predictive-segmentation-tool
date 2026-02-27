import pandas as pd
import numpy as np
import os
import sys

# Mocking ColumnMapping for the script
class MockMapping:
    def __init__(self):
        self.customer_id = 'Customer_ID'
        self.transaction_date = 'Timestamp'
        self.amount = 'Price_Per_Item'

def calculate_rfm_debug(df, mapping):
    print(f"Initial DF shape: {df.shape}")
    
    # 1. Clean data
    print("1. Cleaning date...")
    df[mapping.transaction_date] = pd.to_datetime(df[mapping.transaction_date], errors='coerce')
    print(f"Date count after to_datetime: {df[mapping.transaction_date].count()}")
    
    print("2. Cleaning amount...")
    if df[mapping.amount].dtype == object:
        df[mapping.amount] = df[mapping.amount].str.replace(r'[^\d.]', '', regex=True)
    df[mapping.amount] = pd.to_numeric(df[mapping.amount], errors='coerce')
    print(f"Amount count after numeric: {df[mapping.amount].count()}")
    
    print("3. Dropping na...")
    df = df.dropna(subset=[mapping.customer_id, mapping.transaction_date, mapping.amount])
    print(f"DF shape after dropna: {df.shape}")
    
    if df.empty:
        print("ERROR: DF is empty after cleaning!")
        return
        
    # 2. RFM Calculation
    print("4. Calculating RFM...")
    reference_date = df[mapping.transaction_date].max()
    print(f"Reference date: {reference_date}")
    
    rfm = df.groupby(mapping.customer_id).agg({
        mapping.transaction_date: lambda x: (reference_date - x.max()).days,
        mapping.customer_id: 'count',
        mapping.amount: 'sum'
    })
    print(f"RFM table shape: {rfm.shape}")
    
    rfm.columns = ['Recency', 'Frequency', 'Monetary']
    
    # 3. Scoring
    print("5. Scoring...")
    try:
        print("Scoring R...")
        rfm['R'] = pd.qcut(rfm['Recency'], 5, labels=[5, 4, 3, 2, 1], duplicates='drop')
        print("Scoring F...")
        rfm['F'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
        print("Scoring M...")
        rfm['M'] = pd.qcut(rfm['Monetary'], 5, labels=[1, 2, 3, 4, 5], duplicates='drop')
        
        rfm['R'] = pd.to_numeric(rfm['R'])
        rfm['F'] = pd.to_numeric(rfm['F'])
        rfm['M'] = pd.to_numeric(rfm['M'])
    except Exception as e:
        print(f"Scoring failed (expected if few data points): {e}")
        rfm['R'] = 3
        rfm['F'] = 3
        rfm['M'] = 3

    rfm['RFM_Score'] = rfm[['R', 'F', 'M']].sum(axis=1)
    
    # 4. Segmenting
    print("6. Segmenting...")
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
    print("Segmentation done.")

    # 5. Summary
    print("7. Summarizing...")
    summary = rfm.groupby(['Segment', 'Segment_SW', 'Risk', 'Rec']).agg({
        'Monetary': ['mean', 'sum'],
        'Recency': 'mean',
        'Frequency': 'mean',
        'RFM_Score': 'count'
    }).reset_index()
    print(f"Summary shape before column rename: {summary.shape}")
    print(f"Columns: {summary.columns.tolist()}")
    
    summary.columns = ['Segment', 'Segment_SW', 'Risk', 'Recommendation', 'Avg_M', 'Total_M', 'Avg_R', 'Avg_F', 'Count']
    print("Summary done.")
    print(summary)

if __name__ == "__main__":
    filepath = "uploads/1d20d5f1-6779-433c-909e-2a586164c8d8_SIMULATED_POS_DATA_WITH_SEASONAL_TRENDS.CSV"
    if not os.path.exists(filepath):
        print(f"File {filepath} not found!")
    else:
        df = pd.read_csv(filepath)
        calculate_rfm_debug(df, MockMapping())
