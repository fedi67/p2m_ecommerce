import requests
import json

url = "http://localhost:8000/api/chat"
payload = {
    "message": "Bonjour, je cherche une robe",
    "history": []
}
headers = {"Content-Type": "application/json"}

try:
    print("Testing local API...")
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
except Exception as e:
    print(f"Error: {e}")
