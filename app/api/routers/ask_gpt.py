import os
import openai
from fastapi import APIRouter
from dotenv import load_dotenv
from app.utils.anonymize import anonymize_text

load_dotenv()
ask_router=APIRouter()
openai.api_key=os.getenv("OPENAI_API_KEY")

@ask_router.get('/ask')
async def ask(question:str,text):
    anonymized_text= anonymize_text(text)
    resp=openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
                {"role": "system", "content": "I want you to play Paralegal Ai expert. you receive anonymized legal documents from both attorneys and non-legislatives. you are the legal Ai assistant, you have to analyze them, understand every word and sentence, explain what is written there,extract complex concepts, and serve as a guide for beginners and experts alike. you will be asked questions about the document,your mission is to answer them with the highest accuracy possible,you must work through it by heart to deliver correct knowledg and information extracted from the document which aligns perfectly with the user enquiries about the file and to develop useful resources from your current andprevious experiences that user can use and will be beneficial to him."},
                {"role": "user", "content": anonymized_text},
                {"role": "user", "content": f'considering the document I sent answer the following question{question}'}
        ]
)
    return {'response':resp['choices'][0]['message']['content']}
