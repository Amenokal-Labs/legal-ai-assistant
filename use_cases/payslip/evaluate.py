from app.utils.anonymize import anonymize_pdf_file


def evaluate(filePath:str):
    #extract questions
    with open('questions.txt') as q_file:
        questions=[q.rstrip() for q in q_file ]
    print(questions)
    text=anonymize_pdf_file(filePath)
    print(text)

    


if __name__=="__main__":
    evaluate("paysliper-template-list3.pdf")