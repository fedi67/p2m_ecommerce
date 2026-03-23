
from database import SessionLocal
from models import Product, ProductVariant
from sqlalchemy import or_, and_
import re

def test_search(message):
    db = SessionLocal()
    print(f"Testing search for: '{message}'")
    
    clean_msg = re.sub(r'[^\w\s]', '', message.lower())
    all_keywords = [w for w in clean_msg.split() if len(w) > 2]
    
    stop_words = {
        "bonjour", "salut", "cherche", "vouloir", "besoin", "merci", "quelle", "votre",
        "pour", "avec", "dans", "sur", "mais", "quel", "quelles", "cette", "ces",
        "une", "des", "les", "aux", "est", "sont", "fait", "faire", "veux", "voudrais",
        "coucou", "hello", "bonjouur", "bonjoir", "hey", "estce", "avez", "vous"
    }
    original_keywords = [w for w in all_keywords if w not in stop_words]
    
    synonyms = {
        "baskets": ["sneakers", "jordan", "chaussures", "sport"],
        "robe": ["soiree", "cocktail", "vêtement"],
        "costume": ["mariage", "veste", "pantalon"],
        "jean": ["denim", "pantalon"]
    }
    
    keywords = []
    for kw in original_keywords:
        keywords.append(kw)
        if kw in synonyms:
            keywords.extend(synonyms[kw])
    
    print(f"Effective keywords: {keywords}")
    
    final_filters = []
    if keywords:
        for kw in keywords[:5]:
            final_filters.append(or_(
                Product.name.ilike(f"%{kw}%"),
                Product.category.ilike(f"%{kw}%"),
                Product.description.ilike(f"%{kw}%"),
                ProductVariant.color.ilike(f"%{kw}%"),
                ProductVariant.size.ilike(f"%{kw}%")
            ))
    
    if final_filters:
        results = db.query(Product).distinct().join(ProductVariant).filter(or_(*final_filters)).limit(10).all()
        ids = [p.id for p in results]
        print(f"Classical IDs found: {ids}")
        for p in results:
            print(f"- ID {p.id}: {p.name}")
    else:
        print("No filters generated.")
    
    db.close()

if __name__ == "__main__":
    test_search("je veux des baskets")
