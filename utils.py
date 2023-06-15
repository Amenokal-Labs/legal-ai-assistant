from PyPDF2 import PdfReader


def pdf_to_txt(filename:str):
    reader=PdfReader(filename)
    text=''
    for i in range(len(reader.pages)):
        page=reader.pages[i]
        text += page.extract_text()
    return text