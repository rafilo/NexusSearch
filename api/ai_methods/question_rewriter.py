### Question Re-writer
from typing import Literal


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from api.config import OPENAI_API_KEY

LLM: ChatOpenAI = ChatOpenAI(
        temperature=0,
        openai_api_key=OPENAI_API_KEY,
    )



# Prompt
system = """You a question re-writer that converts an input question to a better version that is optimized \n 
     for vectorstore retrieval. Look at the input and try to reason about the underlying semantic intent / meaning.\n
     The output should identify the specific form that user requires to be returned as (table, chart, etc.), 
     and add the form required by user in the output question. \n"""
re_write_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        (
            "human",
            "Here is the initial question: \n\n {question} \n Formulate an improved question.",
        ),
    ]
)

question_rewriter = re_write_prompt | LLM | StrOutputParser()
def rewrite_question(question):
    return question_rewriter.invoke({"question": question})