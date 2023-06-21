import os
import openai
from fastapi import APIRouter
from dotenv import load_dotenv

load_dotenv()
ask_router=APIRouter()
openai.api_key=os.getenv("OPENAI_API_KEY")

@ask_router.get('/ask_gpt')
def ask():
    resp=openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "How are you today?"}
    ]
)
    return {'response':resp['choices'][0]['message']['content']}
