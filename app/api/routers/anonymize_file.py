import os
import shutil
from fastapi import APIRouter, File, UploadFile
from app.utils.anonymize import anonymize_pdf_file


anonymize_router = APIRouter()

@anonymize_router.post("/anonymize")
async def anonymize(file:UploadFile=File(...)):
    upload_dir = os.path.join(os.getcwd(), "uploads")
    # Create the upload directory if it doesn't exist
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    # get the destination path
    dest = os.path.join(upload_dir, file.filename)
    # copy the file contents to pdf file in destination dest (uploads/filename)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text_anonymized=anonymize_pdf_file(dest)

    return {"filename": file.filename,"anonymized-content":text_anonymized}
