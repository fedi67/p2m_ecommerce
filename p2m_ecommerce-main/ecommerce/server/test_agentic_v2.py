import requests
import json

BASE_URL = "http://localhost:8007"

def test_agentic_chat_v2():
    print("--- Test: Agentic Chat (Preference & Cart) ---")
    
    # Message qui devrait déclencher les DEUX actions
    payload = {
        "message": "En fait j'adore le style minimaliste et les couleurs sobres comme le beige. Peux-tu l'ajouter à mon profil et me proposer une pièce ?",
        "history": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Reply: {data.get('reply')}")
        print(f"Actions: {json.dumps(data.get('actions'), indent=2, ensure_ascii=False)}")
        
        actions = data.get("actions", [])
        types = [a.get("type") for a in actions]
        
        if "update_preferences" in types:
            print("✅ Preference update action found!")
        if "add_to_cart" in types:
            print("✅ Cart addition action found!")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_agentic_chat_v2()
