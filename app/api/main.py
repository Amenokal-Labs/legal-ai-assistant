from fastapi import FastAPI
from app.api.routers.anonymize_file import anonymize_router
from app.api.routers.ask_gpt import ask_router

app = FastAPI()

app.include_router(anonymize_router)
app.include_router(ask_router)

@app.get('/')
def root():
    return {"message":"successfully connected"}

