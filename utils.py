from PyPDF2 import PdfReader


def pdf_to_txt(pdf_file:str,txt_file:str):
    reader=PdfReader(pdf_file+".pdf")
    text=''
    for i in range(len(reader.pages)):
        page=reader.pages[i]
        text += page.extract_text()
    with open(txt_file+".txt",'w') as file:
        file.write(text)
    return txt_file