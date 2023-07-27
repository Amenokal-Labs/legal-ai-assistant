from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.anonymize_file import anonymize_router
from app.api.routers.ask import ask_stream_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(anonymize_router)
app.include_router(ask_stream_router,prefix='/stream')

@app.get('/')
def root():
    return {"message":"successfully connected"}

