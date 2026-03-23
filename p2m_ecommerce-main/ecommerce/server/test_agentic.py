import requests
import json

BASE_URL = "http://localhost:8000"

def test_agentic_chat():
    print("--- Test: Agentic Chat with Preference Update ---")
    # We need a valid token for a real user to test the DB update, 
    # but we can at least test the AI response structure.
    
    payload = {
        "message": "J'adore les vêtements en coton bio et le style minimaliste. Peux-tu t'en souvenir ?",
        "history": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Reply: {data.get('reply')}")
        print(f"Actions: {data.get('actions')}")
        
        # Check if update_preferences is in actions
        actions = data.get("actions", [])
        has_pref_update = any(a.get("type") == "update_preferences" for a in actions)
        if has_pref_update:
            print("✅ Success: AI triggered preference update!")
        else:
            print("⚠️ Warning: AI did not trigger preference update. Check prompt.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_agentic_chat()
