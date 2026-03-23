from sqlalchemy import text
from database import engine

def view_customers():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, first_name, email, gender, country, age, created_at FROM customers"))
        customers = result.fetchall()
        
        if not customers:
            print("Aucun client trouvé dans la base de données.")
            return

        print(f"{'ID':<5} | {'PRÉNOM':<15} | {'EMAIL':<25} | {'SEXE':<5} | {'PAYS':<15} | {'ÂGE':<5} | {'CRÉÉ LE'}")
        print("-" * 100)
        for c in customers:
            print(f"{c[0]:<5} | {str(c[1]):<15} | {c[2]:<25} | {str(c[3]):<5} | {str(c[4]):<15} | {str(c[5]):<5} | {c[6]}")

if __name__ == "__main__":
    view_customers()
