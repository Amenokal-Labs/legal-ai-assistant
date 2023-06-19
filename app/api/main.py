from fastapi import FastAPI
from routers import anonymize_file

app = FastAPI()
app.include_router(anonymize_file.router)

@app.get('/')
def root():
    return {"message":"connection made"}

