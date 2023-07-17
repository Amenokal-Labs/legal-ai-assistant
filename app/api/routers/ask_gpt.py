import os
import openai
from fastapi import APIRouter
from dotenv import load_dotenv
from pydantic import BaseModel
from app.utils.large_files import use_embeddings

load_dotenv()
ask_router = APIRouter()
openai.api_key = os.getenv("OPENAI_API_KEY")

class AskRequest(BaseModel):
    question: str
    text: str


@ask_router.post('/ask')
def ask(request: AskRequest):
    text = request.text
    question = request.question
    response=use_embeddings(text,question)
    return {'response': response}
    
