
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

client = genai.Client(api_key=api_key)

try:
    print("Attempting to list models...")
    for m in client.models.list():
        print(f"Found model: {m.name}")
        
    print("\n--- Testing Generation ---")
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents="Hello"
        )
        print("Success with gemini-1.5-flash")
    except Exception as e:
        print(f"Error with gemini-1.5-flash: {e}")

except Exception as e:
    print(f"Global Error: {e}")
