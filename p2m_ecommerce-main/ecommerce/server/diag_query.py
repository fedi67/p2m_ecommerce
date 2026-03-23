from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Customer
from database import SQLALCHEMY_DATABASE_URL
import traceback

def test_query():
    print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        print("Executing query...")
        from models import Order, OrderItem
        user = db.query(Customer).filter(Customer.email == 'az@az.com').first()
        if user:
            print(f"--- User {user.id} ({user.email}) ---")
            orders = db.query(Order).filter(Order.customer_id == user.id).all()
            print(f"Found {len(orders)} orders.")
            for o in orders:
                print(f"  Order {o.id}: Status={o.status}, CreatedAt={o.created_at}, Total={o.total_price}")
                for i in o.items:
                    print(f"    Item: Qty={i.quantity}, Price={i.price}, VariantID={i.product_variant_id}")
        else:
            print("❓ User not found")
    except Exception as e:
        print("❌ Error executing query:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
