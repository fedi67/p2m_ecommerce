from database import SessionLocal
from sqlalchemy import text

def update_db():
    db = SessionLocal()
    try:
        print("🔧 Mise à jour du schéma...")
        
        # Add is_admin to customers if not exists
        db.execute(text("ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;"))
        
        # Create reviews table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """))
        
        # Create orders table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
                total_price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'En cours',
                created_at TIMESTAMP DEFAULT NOW()
            );
        """))

        # Create order_items table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_variant_id INTEGER REFERENCES product_variants(id),
                quantity INTEGER DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL
            );
        """))

        # Create global_feedback table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS global_feedback (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """))
        
        # Admin rule: any @shop.com email is an admin
        db.execute(text("UPDATE customers SET is_admin = TRUE WHERE email ILIKE '%@shop.com';"))
        
        # Ensure others are not admins (unless explicitly set, but here we follow the domain rule)
        # db.execute(text("UPDATE customers SET is_admin = FALSE WHERE email NOT ILIKE '%@shop.com';"))
        
        db.commit()
        print("✅ Schéma mis à jour avec succès !")
    except Exception as e:
        print(f"❌ Erreur migration : {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_db()
