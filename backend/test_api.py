import requests
import json
import uuid

# Base URL (direct to backend)
BASE_URL = "http://localhost:8001/api"

def test_analysis():
    # 1. Login to get token
    login_data = {
        "email": "alvinmithamo@gmail.com", # Assuming this is the user from logs
        "password": "Password123!" # I saw this in earlier turns or as a placeholder
    }
    
    # Alternatively, try to find a user in DB if login fails
    
    # 2. Trigger analysis
    # Most recent analysis ID from DB query earlier: d2faff6b-e7d4-4093-b577-02b33b117db3
    upload_id = "d2faff6b-e7d4-4093-b577-02b33b117db3"
    
    mapping = {
        "customer_id": "customer_id",
        "transaction_date": "date",
        "amount": "amount"
    }
    
    # We need a token. I'll assume I can bypass auth for a local test if I had a way, 
    # but I'll just try to login first.
    
    print(f"Triggering analysis for {upload_id}...")
    try:
        # Since I don't have the user's current password, I'll try to find a token in localStorage if I could, 
        # but locally I can't.
        # I'll try a request WITHOUT auth first to see if I get 401 (proves connectivity)
        resp = requests.post(f"{BASE_URL}/analysis/run?upload_id={upload_id}", json=mapping)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_analysis()
