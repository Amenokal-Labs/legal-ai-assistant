import os
import time
import requests as req
from dotenv import load_dotenv
import openai
from app.utils.utils import read_pdf_file

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def evaluate(file_path: str):
    text = read_pdf_file(file_path)
    # extract questions
    with open('questions.txt') as q_file:
        questions = [q.rstrip() for q in q_file]
    nq = 0
    with open('results.txt', "a") as res_file:
        for question in questions:
            nq += 1
            payload = {'question': question, 'text': text}
            res = req.get('http://127.0.0.1:8000/ask', params=payload)
            res_file.write(res.json()['response'].replace('\n', ' ') + '\n')
            if nq != 3:
                time.sleep(1)
            else:
                time.sleep(60)
