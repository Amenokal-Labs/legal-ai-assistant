import os
import openai
from fastapi import APIRouter
from dotenv import load_dotenv
from pydantic import BaseModel
from app.utils.anonymize import anonymize_text

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
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
            "content": "I want you to play Paralegal Ai expert. you receive anonymized legal documents from both "
                        "attorneys and non-legislatives. You are the legal Ai assistant, you have to analyze them, "
                        "understand every word and sentence, explain what is written there, extract complex concepts, "
                        "and serve as a guide for beginners and experts alike. You will be asked questions about the "
                        "document, your mission is to answer them with the highest accuracy possible, you must work "
                        "through it by heart to deliver correct knowledge and information extracted from the document "
                        "which align perfectly with the user enquiries about the file and to develop useful resources "
                        "from your current and previous experiences that user can use and will be beneficial to him."},
            {"role": "user", "content": text},
            {"role": "user", "content": f'considering the document I sent answer the following question: {question}'}
        ]
    )
    return {'response': resp['choices'][0]['message']['content']}
