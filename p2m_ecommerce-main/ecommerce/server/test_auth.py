import requests
import json
import random
import string

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def test_auth():
    base_url = "http://localhost:8000"
    email = f"test_{random_string()}@example.com"
    password = "testpassword123"
    first_name = "TestUser"

    # 1. Test Signup
    print(f"Testing Signup for {email}...")
    signup_payload = {
        "first_name": first_name,
        "email": email,
        "password": password
    }
    try:
        response = requests.post(f"{base_url}/signup", json=signup_payload)
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.json()}")
        
        if response.status_code != 200:
            print("❌ Signup failed!")
            return

        # 2. Test Login
        print("\nTesting Login...")
        login_payload = {
            "email": email,
            "password": password
        }
        response = requests.post(f"{base_url}/login", json=login_payload)
        print(f"Login Status: {response.status_code}")
        login_data = response.json()
        print(f"Login Response: {login_data}")

        if response.status_code == 200 and "access_token" in login_data:
            print("✅ Auth Flow Success!")
        else:
            print("❌ Login failed!")

    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_auth()
