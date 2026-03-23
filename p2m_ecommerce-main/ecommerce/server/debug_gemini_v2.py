
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

client = genai.Client(api_key=api_key)

try:
    print("Attempting to list models...")
    # Note: listing models might be different in the new SDK or requires specific permissions
    # Let's try to just generate content with a few common model names
    
    models_to_test = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"]
    
    for model_name in models_to_test:
        print(f"\nTesting model: {model_name}")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Hello, echo this back."
            )
            print(f"SUCCESS with {model_name}")
            print(f"Response: {response.text}")
            break # Stop if one works
        except Exception as e:
            print(f"FAILED with {model_name}: {e}")

except Exception as e:
    print(f"Global Error: {e}")
