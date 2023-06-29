from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.api.routers.anonymize_file import anonymize_router
from server.app.api.routers.ask_gpt import ask_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(anonymize_router)
app.include_router(ask_router)

@app.get('/')
def root():
    return {"message":"successfully connected"}

