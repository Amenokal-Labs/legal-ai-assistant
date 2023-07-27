import logging
from fastapi import FastAPI, Request, APIRouter,BackgroundTasks
from sse_starlette.sse import EventSourceResponse
import asyncio
import os
from typing import List
import openai
from fastapi import APIRouter
from dotenv import load_dotenv
from pydantic import BaseModel
from app.utils.use_embeddings import use_embeddings
 

load_dotenv()
ask_router = APIRouter()
openai.api_key = os.getenv("OPENAI_API_KEY")

class AskRequest(BaseModel):
    questions: List[str]
    text: str


ask_stream_router = APIRouter()

logger = logging.getLogger()

MESSAGE_STREAM_DELAY = 1  # second
MESSAGE_STREAM_RETRY_TIMEOUT = 15000  # milisecond

# Queue to pass data from POST endpoint to GET endpoint
data_queue = asyncio.Queue()

@ask_stream_router.post('/ask')
def ask(request: AskRequest, background_tasks: BackgroundTasks):
    text = request.text
    questions = request.questions

    # Queue the data to be passed to the GET endpoint
    background_tasks.add_task(queue_data, text, questions)

    return {'response': 'Data queued for streaming'}


async def queue_data(text: str, questions: List[str]):
    # Put the data into the queue
    await data_queue.put((text, questions))

@ask_stream_router.get("/askstream")
async def ask_stream(request: Request):
    async def event_generator():
        data = await data_queue.get()
        text,questions = data
        docs,chain=use_embeddings(text,questions)
        # Process the data and yield the response in streaming
        for chunk in chain.run(input_documents=docs, questions=questions):
            if await request.is_disconnected():
                logger.debug("Request disconnected")
                break

            yield {
                "event": "new_message",
                "id": "message_id",
                "retry": MESSAGE_STREAM_RETRY_TIMEOUT,
                "data": chunk,
            }

        # Signal the end of the stream
        yield {
            "event": "end_event",
            "id": "message_id",
            "retry": MESSAGE_STREAM_RETRY_TIMEOUT,
            "data": "End of the stream",
        }

    return EventSourceResponse(event_generator())
