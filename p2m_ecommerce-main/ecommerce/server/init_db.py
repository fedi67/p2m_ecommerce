import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def init_db():
    try:
        # 1. Initialisation des produits et variantes
        sql_file_path = os.path.join(os.path.dirname(__file__), "..", "base2.sql")
        
        # 2. Initialisation de la table customers
        customer_sql_path = os.path.join(os.path.dirname(__file__), "..", "custommer.sql")

        # 3. Initialisation des autres tables (orders, etc.)
        others_sql_path = os.path.join(os.path.dirname(__file__), "..", "others.sql")
        
        # Connexion à la BDD
        print("🔌 Connexion à PostgreSQL...")
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            database=os.getenv("DB_NAME", "smart_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "admin"),
            port=os.getenv("DB_PORT", "5432")
        )
        conn.autocommit = True
        cur = conn.cursor()

        # Exécution du script base2.sql
        print(f"📖 Lecture de {sql_file_path}...")
        with open(sql_file_path, "r", encoding="utf-8") as f:
            sql_script = f.read()
        
        print("⚡ Exécution du script base2.sql...")
        for statement in sql_script.split(';'):
            if statement.strip():
                try:
                    cur.execute(statement)
                except Exception as stmt_err:
                    print(f"⚠️ Erreur sur instruction: {statement[:50]}... \n -> {stmt_err}")

        # Exécution du script custommer.sql
        if os.path.exists(customer_sql_path):
            print(f"📖 Lecture de {customer_sql_path}...")
            with open(customer_sql_path, "r", encoding="utf-8") as f:
                customer_sql = f.read()
            
            print("⚡ Exécution du script custommer.sql...")
            for statement in customer_sql.split(';'):
                if statement.strip():
                    try:
                        cur.execute(statement)
                    except Exception as stmt_err:
                        print(f"⚠️ Erreur sur instruction: {statement[:50]}... \n -> {stmt_err}")

        # Exécution du script others.sql
        if os.path.exists(others_sql_path):
            print(f"📖 Lecture de {others_sql_path}...")
            with open(others_sql_path, "r", encoding="utf-8") as f:
                others_sql = f.read()
            
            print("⚡ Exécution du script others.sql...")
            for statement in others_sql.split(';'):
                if statement.strip():
                    try:
                        cur.execute(statement)
                    except Exception as stmt_err:
                        print(f"⚠️ Erreur sur instruction: {statement[:50]}... \n -> {stmt_err}")
        
        print("✅ Base de données initialisée avec succès !")
        conn.close()

    except FileNotFoundError:
        print("❌ Fichier base2.sql introuvable !")
    except Exception as e:
        print(f"❌ Erreur : {e}")
        print("💡 Astuce : Vérifiez que PostgreSQL est bien lancé (Service Windows).")

if __name__ == "__main__":
    init_db()
