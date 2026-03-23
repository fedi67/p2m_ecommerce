import requests
import json

url = "http://localhost:8000/api/chat"
headers = {"Content-Type": "application/json"}

queries = [
    "Bonjour, je m'appelle Nour",
    "Je cherche un gilet matelassé",
    "Je veux voir des robes"
]

for q in queries:
    print(f"\n--- Testing Query: '{q}' ---")
    payload = {"message": q, "history": []}
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        data = response.json()
        print(f"Reply: {data.get('reply')[:100]}...")
        products = data.get('products', [])
        print(f"Number of products returned: {len(products)}")
        for p in products:
            print(f" - {p['name']} (ID: {p['id']})")
    except Exception as e:
        print(f"Error: {e}")
