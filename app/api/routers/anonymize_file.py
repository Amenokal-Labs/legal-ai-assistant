import os
import shutil
from fastapi import APIRouter, File, Form, UploadFile
from app.utils.anonymize import anonymize


router = APIRouter()

@router.post("/anonymize")
async def anonymize_file(name:str=Form(...),file:UploadFile=File(...)):
    upload_dir = os.path.join(os.getcwd(), "uploads")
    # Create the upload directory if it doesn't exist
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    # get the destination path
    dest = os.path.join(upload_dir, file.filename)
    # copy the file contents to pdf file in destination dest (uploads/filename)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text_anonymized=anonymize(dest)

    return {"filename": file.filename,"anonymized-content":text_anonymized}