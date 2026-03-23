import requests
import json

url = "http://localhost:8000/api/chat"
headers = {"Content-Type": "application/json"}
q = "Je cherche un gilet matelassé"

payload = {"message": q, "history": []}
try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    data = response.json()
    print(f"Reply: {data.get('reply')}")
    products = data.get('products', [])
    print(f"Number of products: {len(products)}")
    for p in products:
        print(f" - {p['name']} (ID: {p['id']})")
except Exception as e:
    print(f"Error: {e}")
