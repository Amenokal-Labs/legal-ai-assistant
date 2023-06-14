from PyPDF2 import PdfReader


def pdf_to_txt(pdf_file:str):
    reader=PdfReader(pdf_file+".pdf")
    text=''
    for i in range(len(reader.pages)):
        page=reader.pages[i]
        text += page.extract_text()
    return text