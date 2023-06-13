import json
from presidio_anonymizer import AnonymizerEngine
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer.entities import RecognizerResult, OperatorConfig


#read txt file
text=''
with open("info.txt",'r',encoding='utf-8') as file:
    text=file.read()

# 1/ Analyzer 
#text = "I am louis, my second name is James Bond, my phone number is 07816093423"
analyzer = AnalyzerEngine()
analyzer_results = analyzer.analyze(text=text, language="en")

# Analyzer output
print("analyzer results")
print(analyzer_results)

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

print("Anonymized text")
print(result.text)

#storing the results
with open('anonymized_text.txt','w',encoding='utf-8')as file:
    file.write(result.text)
