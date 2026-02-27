import urllib.request
import json
import time

def test_connection():
    url = "http://localhost:8001/health"
    print(f"Testing connection to {url}...")
    for i in range(5):
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                status = response.getcode()
                data = json.loads(response.read().decode())
                print(f"Response: {status}, {data}")
                return True
        except Exception as e:
            print(f"Attempt {i+1} failed: {e}")
            time.sleep(1)
    return False

if __name__ == "__main__":
    test_connection()
