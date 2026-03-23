import requests
import json

BASE_URL = "http://localhost:8000"

# Note: This is a pseudo-test because we don't have a real valid JWT for a customer with preferences easily.
# But we can test if the endpoint still works without token, and then try to mock the behavior if needed.

def test_chat_personalization():
    print("--- Test 1: Chat without token (Should still work) ---")
    payload = {
        "message": "Bonjour, que me conseillez-vous ?",
        "history": []
    }
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=30)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Reply: {data.get('reply')[:100]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

    print("\n--- Test 2: Chat with invalid token (Should still work as guest) ---")
    headers = {"Authorization": "Bearer invalid_token"}
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, headers=headers, timeout=30)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Reply: {data.get('reply')[:100]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_chat_personalization()
