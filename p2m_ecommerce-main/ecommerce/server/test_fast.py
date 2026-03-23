import requests
import json

url = "http://localhost:8000/api/chat"
headers = {"Content-Type": "application/json"}

queries = [
    "Bonjour",
    "Je cherche une robe"
]

for q in queries:
    print(f"\n--- Testing Query: '{q}' ---")
    payload = {"message": q, "history": []}
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=15)
        data = response.json()
        print(f"Status: {response.status_code}")
        print(f"Reply: {data.get('reply', '')[:100]}...")
        products = data.get('products', [])
        print(f"Products returned: {len(products)}")
    except Exception as e:
        print(f"Error: {e}")
