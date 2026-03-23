import requests
import json

def test_chat():
    url = "http://localhost:8000/api/chat"
    payload = {
        "message": "Je cherche une robe pour une soirée élégante",
        "history": []
    }
    
    try:
        print(f"🚀 Sending request to {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("\n🤖 AI Reply:")
        print(data.get("reply"))
        
        print("\n📦 Products Suggested:")
        for p in data.get("products", []):
            print(f"- {p['name']} ({p['price']}€)")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    test_chat()
