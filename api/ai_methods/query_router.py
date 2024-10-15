# Router

from typing import Literal


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI


from api.config import OPENAI_API_KEY

LLM: ChatOpenAI = ChatOpenAI(
    temperature=0,
    openai_api_key=OPENAI_API_KEY,
    streaming=True,
    model_name="gpt-4o"
)

# Data model


class RouteQuery(BaseModel):
    """Route a user query based on the query type they have."""

    datasource: Literal["finance_related_query", "other_query"] = Field(
        ...,
        description="Given a user question categorize whether it is finance related question or other question.",
    )


structured_llm_router = LLM.with_structured_output(RouteQuery)

# Prompt
system = """You are an expert at distinguishing between finance-related questions and other questions. \n
    You will be provided with a user question. \n
    If the question is finance-related, respond with 'finance_related_query'. \n
    If the question is not finance-related, respond with 'other_query'. \n
    Do not respond with anything else."""
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)

question_router = route_prompt | structured_llm_router


def route_query(question):
    return question_router.invoke({"question": question})
