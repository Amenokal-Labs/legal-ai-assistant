import os
from dotenv import load_dotenv
import langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS 
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain import PromptTemplate 

load_dotenv()

langchain.embeddings.openai.api_key = os.getenv("OPENAI_API_KEY")

def useEmbeddings(text: str,question:str):
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
                            output_parser=None, partial_variables={}, template="I want you to play Paralegal Ai expert. you receive anonymized legal documents from both attorneys and non-legislatives. You are the legal Ai assistant, you have to analyze them,understand every word and sentence, explain what is written there, extract complex concepts, and serve as a guide for beginners and experts alike. You will be asked questions about the document, your mission is to answer them with the highest accuracy possible, you must work through it by heart to deliver correct knowledge and information extracted from the document which align perfectly with the user enquiries about the file and to develop useful resources from your current and previous experiences that user can use and will be beneficial to him.Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:", template_format='f-string', validate_template=True)
    chain.llm_chain.prompt=prompt
    docs = docsearch.similarity_search(question)
    return chain.run(input_documents=docs, question=question)


