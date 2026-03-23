
import os
from google import genai
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product

load_dotenv()

def seed_embeddings():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    db = SessionLocal()
    try:
        products = db.query(Product).all()
        print(f"Generating embeddings for {len(products)} products...")
        
        for p in products:
            # Combine relevant info for embedding
            text_to_embed = f"Nom: {p.name}. Categorie: {p.category}. Description: {p.description}"
            
            try:
                embedding_response = client.models.embed_content(
                    model="models/gemini-embedding-001",
                    contents=text_to_embed
                )
                
                # Update the product with the vector
                p.embedding = embedding_response.embeddings[0].values
                db.add(p)
                print(f"✓ Embedded: {p.name}")
            except Exception as e:
                print(f"✗ Failed: {p.name} - {e}")
        
        db.commit()
        print("Committing changes to database...")
        
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_embeddings()
