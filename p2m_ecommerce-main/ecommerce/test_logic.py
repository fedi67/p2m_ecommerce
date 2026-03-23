import os
import sys
import asyncio
from unittest.mock import MagicMock
from dotenv import load_dotenv

# Add the server directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "server"))

load_dotenv()

async def test_logic():
    # Mocking Dependencies
    from main import chat_endpoint, ChatRequest
    from database import SessionLocal
    
    db = SessionLocal()
    request = ChatRequest(
        message="Je cherche une veste élégante",
        history=[]
    )
    
    try:
        print("🚀 Testing chat_endpoint logic directly...")
        response = await chat_endpoint(request, db)
        print("✅ SUCCESS!")
        print(response)
    except Exception:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_logic())
