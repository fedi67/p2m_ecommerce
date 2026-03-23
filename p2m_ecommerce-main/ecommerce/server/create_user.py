from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Customer
from database import SQLALCHEMY_DATABASE_URL
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_user():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        email = "az@az.com"
        existing = db.query(Customer).filter(Customer.email == email).first()
        if not existing:
            user = Customer(
                first_name="azaz",
                email=email,
                password_hash=pwd_context.hash("azaz"),
                gender="F",
                age=25,
                country="Tunisie",
                is_admin=False
            )
            db.add(user)
            db.commit()
            print(f"✅ User {email} created!")
        else:
            print(f"ℹ️ User {email} already exists.")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
