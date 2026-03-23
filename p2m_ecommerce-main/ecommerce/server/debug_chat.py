import os
import json
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

def debug_chat_logic():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    message = "Je cherche une veste élégante"
    
    try:
        print("1. Generating embedding...")
        embedding_response = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=message,
            config={"task_type": "retrieval_query"}
        )
        query_embedding = embedding_response.embeddings[0].values
        print(f"Embedding generated (length: {len(query_embedding)})")
        
        print("2. Connecting to DB...")
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', '127.0.0.1'),
            database=os.getenv('DB_NAME', 'smart_db'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'admin'),
            port=os.getenv('DB_PORT', '5432')
        )
        cur = conn.cursor()
        
        print("3. Executing vector search...")
        cur.execute("""
            SELECT id, name FROM products 
            ORDER BY embedding <=> %s 
            LIMIT 3
        """, (str(query_embedding),))
        
        results = cur.fetchall()
        print("Results found:")
        for r in results:
            print(f"- {r}")
            
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ DEBUG ERROR: {e}")

if __name__ == "__main__":
    debug_chat_logic()
