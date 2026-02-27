print("Importing app...")
try:
    from app.main import app
    print("App imported successfully.")
except Exception as e:
    print(f"Error importing app: {e}")
