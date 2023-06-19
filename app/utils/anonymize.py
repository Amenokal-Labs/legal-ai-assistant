from presidio_anonymizer import AnonymizerEngine
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer.entities import OperatorConfig
from app.utils.utils import read_pdf_file

def anonymize(filename:str):
    #read pdf file
    text=read_pdf_file(filename)

    # 1/ Analyzer 
    analyzer = AnalyzerEngine()
    analyzer_results = analyzer.analyze(text=text, language="en")

    # 2/Anonymizer
    
    # Initialize the engine:
    engine = AnonymizerEngine()

    #define customized opeartors
    operators={
        "DEFAULT": OperatorConfig("replace", {"new_value": "<ANONYMIZED>"}),
        "PHONE_NUMBER": OperatorConfig(
            "mask",
            {
                "type": "mask",
                "masking_char": "*",
                "chars_to_mask": 12,
                "from_end": True,
            },
        ),
    }
    # Invoke the anonymize function with the text,
    result = engine.anonymize(
        text=text, analyzer_results=analyzer_results,operators=operators
    )
    
    #storing the results
    with open('anonymized_text.txt','w')as file:
        file.write(result.text)
    
