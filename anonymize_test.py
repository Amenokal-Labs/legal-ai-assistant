from anonymize import anonymize
from utils import pdf_to_txt, txt_to_string



def test_anonymize_name():
    anonymize("test_example.pdf")
    text=txt_to_string('anonymized_text.txt')
    assert "John Doe" not in text and "John Doe" in pdf_to_txt("test_example.pdf")


def test_anonymize_phone():
    text=txt_to_string('anonymized_text.txt')
    assert "07816093423" not in text and "07816093423" in pdf_to_txt("test_example.pdf")

def test_anonymize_email():
    text=txt_to_string('anonymized_text.txt')
    assert "louisbond@example.com" not in text and "louisbond@example.com" in pdf_to_txt("test_example.pdf")


def test_anonymize_address():
    text=txt_to_string('anonymized_text.txt')
    assert "22 Rue Didouche Mourad Algiers, Algeria" not in text and "22 Rue Didouche Mourad Algiers, Algeria" in pdf_to_txt("test_example.pdf")
