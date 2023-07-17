import os
from dotenv import load_dotenv
import langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS 
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain import PromptTemplate 
from app.constants.template import template

load_dotenv()

langchain.embeddings.openai.api_key = os.getenv("OPENAI_API_KEY")

def use_embeddings(text: str,question:str):
    # Splitting up the text into smaller chunks for indexing
    text_splitter = CharacterTextSplitter(        
        separator = "\n",
        chunk_size = 1000,
        chunk_overlap  = 100, #striding over the text
        length_function = len,
    )
    texts = text_splitter.split_text(text)
    #create and store embeddings for each chunck 
    embeddings = OpenAIEmbeddings()
    docsearch = FAISS.from_texts(texts, embeddings)
    chain = load_qa_chain(OpenAI(),chain_type="stuff") # stuff all the docs in at once
    #define customized prompt
    prompt = PromptTemplate(input_variables=['context', 'question'], 
                            output_parser=None, partial_variables={}, template=template, template_format='f-string', validate_template=True)
    chain.llm_chain.prompt=prompt
    docs = docsearch.similarity_search(question)
    return chain.run(input_documents=docs, question=question)

