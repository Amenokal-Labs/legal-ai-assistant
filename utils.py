from PyPDF2 import PdfReader


def pdf_to_txt(filename:str):
    reader=PdfReader(filename)
    text = "\n".join(page.extract_text() for page in reader.pages)
    return text