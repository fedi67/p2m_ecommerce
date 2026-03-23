import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

system_instruction = "Tu es un assistant de mode. Réponds de façon très courte."
contents = "Bonjour, propose moi un vêtement."

try:
    print("Testing gemini-2.5-flash with system instruction...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config={"system_instruction": system_instruction}
    )
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Failed: {e}")
