import pytest
from server.app.utils.anonymize import anonymize_pdf_file
from server.app.utils.utils import read_pdf_file, read_txt_file

# Constants
TEST_PDF_PATH = "tests/example.pdf"
ANONYMIZED_TEXT_PATH = "anonymized_text.txt"

# Fixtures
@pytest.fixture(scope="module")
def pdf_file():
    yield read_pdf_file(TEST_PDF_PATH)


@pytest.fixture(scope="module")
def anonymized_text():
    anonymize_pdf_file(TEST_PDF_PATH)
    return read_txt_file(ANONYMIZED_TEXT_PATH)


# Tests
def test_anonymize_name(pdf_file, anonymized_text):
    assert "John Doe" not in anonymized_text
    assert "John Doe" in pdf_file


def test_anonymize_phone(pdf_file, anonymized_text):
    assert "07816093423" not in anonymized_text
    assert "07816093423" in pdf_file


def test_anonymize_email(pdf_file, anonymized_text):
    assert "louisbond@example.com" not in anonymized_text
    assert "louisbond@example.com" in pdf_file


def test_anonymize_address(pdf_file, anonymized_text):
    assert "22 Rue Didouche Mourad Algiers, Algeria" not in anonymized_text
    assert "22 Rue Didouche Mourad Algiers, Algeria" in pdf_file
