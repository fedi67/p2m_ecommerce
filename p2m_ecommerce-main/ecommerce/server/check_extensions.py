import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_extensions():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            database=os.getenv("DB_NAME", "smart_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "admin"),
            port=os.getenv("DB_PORT", "5432")
        )
        cur = conn.cursor()
        cur.execute("SELECT * FROM pg_available_extensions WHERE name = 'vector';")
        ext = cur.fetchone()
        if ext:
            print(f"Extension 'vector' is available: {ext}")
        else:
            print("Extension 'vector' is NOT available in pg_available_extensions.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error checking extensions: {e}")

if __name__ == "__main__":
    check_extensions()
