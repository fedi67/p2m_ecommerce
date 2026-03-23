import requests
import json

def test_chat():
    url = "http://localhost:8000/api/chat"
    payload = {
        "message": "Bonjour",
        "history": []
    }
    
    print(f"Sending request: {payload['message']}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        reply = data.get("reply", "")
        products = data.get("products", [])
        
        print("\n--- RESPONSE ---")
        print(f"Reply ({len(reply)} chars): {reply}")
        print(f"Products count: {len(products)}")
        
        if len(products) > 0:
            print("✅ Products returned (Success)")
        else:
            print("❌ No products returned (Fail)")
            
        if len(reply.split()) < 35:
             print("✅ Reply is concise")
        else:
             print(f"⚠️ Reply might be too long ({len(reply.split())} words)")
             
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_chat()
