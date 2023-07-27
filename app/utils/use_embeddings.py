import os
from typing import List
from dotenv import load_dotenv
import langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS 
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain import PromptTemplate 
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from app.constants.template import template
from langchain.chat_models import ChatOpenAI

load_dotenv()

langchain.embeddings.openai.api_key = os.getenv("OPENAI_API_KEY")


def use_embeddings(text: str,questions: List[str]):
    # Splitting up the text into smaller chunks for indexing
    text_splitter = CharacterTextSplitter(        
        separator = "\n",
        chunk_size = 400,
        chunk_overlap  = 10, #striding over the text
        length_function = len,
    )
    texts = text_splitter.split_text(text)
    #create and store embeddings for each chunck 
    embeddings = OpenAIEmbeddings()
    docsearch = FAISS.from_texts(texts, embeddings)
    llm=OpenAI(streaming=True, callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]),temperature=0.8)
    chain = load_qa_chain(llm=llm,chain_type="stuff") # stuff all the docs in at once
    #define customized prompt
    prompt = PromptTemplate(input_variables=['context','questions'], 
                            output_parser=None, partial_variables={}, template=template, template_format='f-string', validate_template=True)
    chain.llm_chain.prompt=prompt
    docs=[]
    for q in questions:
        docs.extend(docsearch.similarity_search(q, k=10))
    return [docs,chain]
