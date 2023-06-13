from PyPDF2 import PdfReader

reader=PdfReader("meta_projet_final.pdf")

text=''
for i in range(len(reader.pages)):
    page=reader.pages[i]
    text += page.extract_text()

with open("text_file",'w',encoding='utf-8') as file:
    file.write(text)