from fastapi import FastAPI
from app.api.routers.anonymize_file import anonymize_router

app = FastAPI()
app.include_router(anonymize_router)

@app.get('/')
def root():
    return {"message":"connection made"}

