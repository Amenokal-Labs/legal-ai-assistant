from PyPDF2 import PdfReader

def pdf_to_txt(filename:str):
    reader=PdfReader(filename)
    text=''
    for page in reader.pages:
        text += str(page.extract_text()) 
    return text

def txt_to_string(filename:str):
    text=''
    with open(filename,'r')as file:
        text+=file.read()
    return text