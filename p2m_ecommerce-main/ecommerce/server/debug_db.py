import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    print("Trying direct connection...")
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        database=os.getenv("DB_NAME", "smart_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "admin"),
        port=os.getenv("DB_PORT", "5432")
    )
    print("✅ Connection succcessful!")
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM products;")
    print(f"Count: {cur.fetchone()[0]}")
    conn.close()
except Exception as e:
    print(f"❌ Error: {e}")
