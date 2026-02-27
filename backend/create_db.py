import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_db():
    try:
        # Connect to default postgres database
        con = psycopg2.connect(dbname='postgres', user='postgres', host='localhost', password='alvin14210')
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Create database
        cur.execute('CREATE DATABASE sme_predictor')
        print("Database sme_predictor created successfully.")
        
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_db()
