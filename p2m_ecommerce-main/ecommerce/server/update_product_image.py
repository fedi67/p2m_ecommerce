
import sys
from database import SessionLocal
from models import Product

def update_image(product_id, new_url):
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            print(f"❌ Produit avec l'ID {product_id} non trouvé.")
            return
        
        old_url = product.image_url
        product.image_url = new_url
        db.commit()
        print(f"✅ Image mise à jour pour '{product.name}' (ID: {product_id})")
        print(f"   Ancienne URL: {old_url}")
        print(f"   Nouvelle URL: {new_url}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python update_product_image.py <id_produit> <nouvelle_url>")
    else:
        update_image(int(sys.argv[1]), sys.argv[2])
