
from database import SessionLocal
from models import Product
from sqlalchemy import text

def check_embeddings():
    db = SessionLocal()
    try:
        # Check if vectors are populated and their dimensions
        products = db.query(Product).all()
        print(f"Total products: {len(products)}")
        
        for p in products:
            if p.embedding is None:
                print(f"ID {p.id}: {p.name} -> Embedding is NULL")
            else:
                # Use SQL to get the dimension (pgvector function)
                dim = db.execute(text("SELECT vector_dims(embedding) FROM products WHERE id = :id"), {"id": p.id}).scalar()
                print(f"ID {p.id}: {p.name} -> Embedding OK (Dim: {dim})")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_embeddings()
