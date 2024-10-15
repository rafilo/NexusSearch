### Retrieval Grader

from typing import Literal


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_elasticsearch import ElasticsearchStore
from api.ai_methods.elasticsearch_client import (
    elasticsearch_client,
)
import os

INDEX = "workplace-app-docs"
INDEX_CHAT_HISTORY = "workplace-app-docs-chat-history"
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2_linux-x86_64")

from api.config import OPENAI_API_KEY

LLM: ChatOpenAI = ChatOpenAI(
        temperature=0,
        openai_api_key=OPENAI_API_KEY,
    )
# Data model
class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents."""

    binary_score: str = Field(
        description="Documents are relevant to the question, 'yes' or 'no'"
    )


# LLM with function call
llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
structured_llm_grader = llm.with_structured_output(GradeDocuments)

store = ElasticsearchStore(
    es_connection=elasticsearch_client,
    index_name=INDEX,
    strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(
        model_id=ELSER_MODEL),
)

# Prompt
system = """You are a grader assessing relevance of a retrieved document to a user question. \n 
    If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
    It does not need to be a stringent test. The goal is to filter out erroneous retrievals. \n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."""
grade_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
    ]
)

retrieval_grader = grade_prompt | structured_llm_grader
def grade_retrived_documents(question: str, docs: list):
    graded_docs = []
    for doc in docs:
        doc_txt = doc.page_content
        result = retrieval_grader.invoke({"question": question, "document": doc_txt}).binary_score
        print(result)
        if result == 'yes':
            graded_docs.append(doc)
    return graded_docs