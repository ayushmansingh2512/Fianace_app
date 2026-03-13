from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import traceback
import os
from dotenv import load_dotenv

# Load env variables and override existing ones just in case
load_dotenv(override=True)

app = FastAPI(title="AI Finance Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client explicitly with the key from our .env
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment!")
client = genai.Client(api_key=api_key)

from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {"message": "AI Finance Assistant API is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client not initialized")
    
    try:
        system_prompt = "You are a helpful and professional financial advisor assistant. Provide concise, high-value financial advice. "
        
        if request.context:
            context_str = "\nUser Financial Context provided from Dashboard:\n"
            for key, value in request.context.items():
                if value: # Only add if the string is not empty
                    # format camelCase keys to normal readable labels
                    formatted_key = ''.join([' '+c.lower() if c.isupper() else c for c in key]).strip().capitalize()
                    context_str += f"- {formatted_key}: {value}\n"
            
            system_prompt += context_str + "\nUse this context to tailor your advice specifically to the user's situation. Do not ask for information they have already provided here."

        full_prompt = f"{system_prompt}\n\nUser query: {request.message}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        return {"response": response.text}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard")
async def get_dashboard_data():
    return {
        "balance": 12500.50,
        "monthly_spending": 2450.00,
        "savings_rate": 25,
        "investments": 45000.00,
        "recent_transactions": [
            {"id": 1, "name": "Apple Store", "amount": -149.99, "date": "2024-03-01"},
            {"id": 2, "name": "Salary", "amount": 5000.00, "date": "2024-03-01"},
            {"id": 3, "name": "Starbucks", "amount": -5.50, "date": "2024-02-28"},
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
