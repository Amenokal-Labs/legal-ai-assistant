# legal-ai-assistant
## anonymize.py
Anonymizing text files by identifying and extracting different types of PII from text data and replacing sensitive information with generic placeholders or pseudonyms using Microsoft Presidio
## utils.py
Helper functions for converting pdf file to txt using pdfplumber and reading from txt files  
## anonymize_test
Running unit tests on anonymize.py using pytest
## installing requirements using pip
pip install -r requirements.txt
## To run the API
uvicorn app.api.main:app --reload  
### To anonymize a file run the following command 
In windows: **curl.exe -X POST -F "file=@tests\example.pdf" http://localhost:8000/anonymize**  
The equivalent command for linux/mac: **curl http://localhost:8000/anonymize -F "file=@tests/example.pdf"**
