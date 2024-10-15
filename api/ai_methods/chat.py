from xml.dom.minidom import Document

from dotenv import load_dotenv
from typing import Union, List, Optional, Annotated

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_elasticsearch import ElasticsearchStore, ElasticsearchChatMessageHistory
from langchain_core.pydantic_v1 import BaseModel, Field

# from api.ai_methods.graph import NexusStateDict, FINISH, app
from api.ai_methods.llm_integrations import get_llm
from api.ai_methods.elasticsearch_client import (
    elasticsearch_client,
    get_elasticsearch_chat_message_history,
)
from flask import render_template, stream_with_context, current_app
import json
import os
from api.ai_methods.query_router import route_query
from api.ai_methods.retrieval_grader import grade_retrived_documents
from api.ai_methods.question_rewriter import rewrite_question
from utils.category_enum import CategoryEnum
from utils.department_enum import DepartmentEnum

INDEX = "workplace-app-docs"
INDEX_CHAT_HISTORY = "workplace-app-docs-chat-history"
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2_linux-x86_64")
SESSION_ID_TAG = "[SESSION_ID]"
SOURCE_TAG = "[SOURCE]"
DONE_TAG = "[DONE]"
FOLLOWUP_TAG = "[FOLLOWUP]"

CHART_GENERATION_TAG = "[CHART_GENERATION]"
CHART_DATA = '[CHART_DATA]'
END_CHART_GENERATION_TAG = "[END_CHART_GENERATION]"

store = ElasticsearchStore(
    es_connection=elasticsearch_client,
    index_name=INDEX,
    strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(
        model_id=ELSER_MODEL),
)

load_dotenv()


# original ask question API
@stream_with_context
def ask_question(question, session_id, permission: list = []):
    yield f"data: {SESSION_ID_TAG} {session_id}\n\n"
    current_app.logger.debug("Chat session ID: %s", session_id)

    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )

    if len(chat_history.messages) > 0:
        # create a condensed question
        condense_question_prompt = render_template(
            "condense_question_prompt.txt",
            question=question,
            chat_history=chat_history.messages,
        )
        condensed_question = get_llm().invoke(condense_question_prompt).content
    else:
        condensed_question = question

    current_app.logger.debug("Condensed question: %s", condensed_question)
    current_app.logger.debug("Question: %s", question)

    docs: List[Document] = store.as_retriever(search_kwargs={"k": 3, "filter": {"terms": {
        "metadata.permission.keyword": permission
    }}}).invoke(condensed_question)

    for doc in docs:
        doc_source = {**doc.metadata, "page_content": doc.page_content}
        current_app.logger.debug(
            "Retrieved document passage from: %s", doc.metadata["name"]
        )
        yield f"data: {SOURCE_TAG} {json.dumps(doc_source)}\n\n"

    route_query(question)
    qa_prompt = render_template(
        "rag_prompt.txt",
        question=question,
        docs=docs,
        chat_history=chat_history.messages,
    )

    answer = ""

    for chunk in get_llm().stream(qa_prompt):
        content = chunk.content.replace(
            "\n", "<br>"
        )  # the stream can get messed up with newlines
        answer += content
        yield f"data: {content}\n\n"

    yield f"data: {DONE_TAG}\n\n"
    current_app.logger.debug("Answer: %s", answer)

    # TODO: add data summary agent to help return table based on the answer
    data_summary_prompt = ""

    chat_history.add_user_message(question)
    chat_history.add_ai_message(answer)


class RouterModel(BaseModel):
    destination: str = Field(
        description=f"Categories: {CategoryEnum.all_category_list()}. Based on the Question semantics, You need to choose a category from Categories")


class PieChartModel(BaseModel):
    value: List[int] = Field(
        description=f'Values are numerical. If value contains percentage, you need to convert them to numerical value.'
    )
    label: List[str] = Field(
        description=f'Labels are categorical'
    )
    pie_chat_title: str = Field(
        'Based on given data generate a title for the pie chart.Eg If the data has percentage, you have to add a percentage.')


class PieChartListModel(BaseModel):
    pie_chart_list: List[PieChartModel] = Field(
        description='Values are numerical. If value contains percentage, you need to convert them to numerical value. Labels are categorical.Based on given data generate a title for the pie chart.Eg If the data has percentage, you have to add a percentage'
    )


class ChartRouterModel(BaseModel):
    is_required: bool = Field(
        description=f'Based on the Question semantics, You need to identify whether chart is required. return True of False. Eg generate pie chart -> True.  generate a table -> False'
    )


class RelevantQuestionModel(BaseModel):
    is_relevant: bool = Field(
        description=f"Returns False if none of the documents are relevant to the user's question, otherwise True"
    )
    reason: str = Field(
        description=f"Explain why user questions are not relevant to the documentation."
    )


class NexusGraph:
    def __init__(self,
                 session_id: str,
                 question: str,
                 permission: List[str],
                 ):
        self.documents: List[Document] = []
        self.permission: List[str] = permission
        self.question: str = question
        self.condensed_question: str = ""
        self.session_id: str = session_id
        self.es_chat_history: Union[ElasticsearchChatMessageHistory, None] = None
        self.answer = ""
        self.router_system = f""" You are handling logic."""
        self.router_prompt = ChatPromptTemplate.from_messages([
            ("system", self.router_system),
            ("human", "Question: {question}")
        ])
        self.question_router = self.router_prompt | get_llm().with_structured_output(RouterModel)
        self.pie_chart = ChatPromptTemplate.from_messages([
            ("system",
             'You are data engineering, Your job is to create a pie chart basd on given table. Do not try to add addiction data.'),
            ("human", "Based on the table, you need to output the categorical labels and numerical value. "
                      "You might receive a table with many column, then based on the each column header generate more than one pie chart"
                      "For example |For the six months ended|2021|2022|Change Reported (%)|Change CC (%)| |---|---|---|---|---| |Operating revenue|900.0 NZ$M|690.6 NZ$M|-23%|-27%| |Gross profit|567.7 NZ$M|413.2 NZ$M|-27%|-33%| |Gross margin|63.1%|59.8%|-325bps|-533bps| |SG&A expenses|(189.6) NZ$M|(202.3) NZ$M|+7%|-| |R&D expenses|(75.7) NZ$M|(84.2) NZ$M|+11%|+11%| |Total operating expenses|(265.3) NZ$M|(286.5) NZ$M|+8%|+3%| |Operating profit|302.4 NZ$M|126.7 NZ$M|-58%|-67%| |Operating margin|33.6%|18.3%|-1,526bps|-1,770bps| |Net financing (expense)|(1.3) NZ$M|(12.4) NZ$M|+854%|-125%| |Profit before tax|301.1 NZ$M|114.3 NZ$M|-62%|-67%| |Tax expense|(79.3) NZ$M|(18.4) NZ$M|-77%|-74%| |Profit after tax|221.8 NZ$M|95.9 NZ$M|-57%|-65%|"
                      "then you need to generate 4 pie charts. For exmaple: label=['operating revenue', 'gross progit', 'SG&A expresss', ‘R&D expresses’...] value=[900.0, 567.7, 189.6, 75.7] title='2021 revenue ...'   "
                      "Based on the header, create a suitable header (no longer than 10 words)."
                      "Don't add additional data . table: {table}")
        ]) | get_llm().with_structured_output(PieChartListModel)
        self.chart_router = ChatPromptTemplate.from_messages([
            ("system", self.router_system),
            ("human", "Based on the question. Important, If user question doesn't include pie chart, then return False."
                      "If user question includes pie chart, then return True. For example: generate a chart -> False. generate a pie chart -> True."
                      "Don't add additional data. Question: {question}")
        ]) | get_llm().with_structured_output(ChartRouterModel)
        self.ralevent_question = ChatPromptTemplate.from_messages([
            ("system", self.router_system),
            ("human", "Based on the documents, Returns False if none of the documents are relevant to the user's question and explain why, otherwise True."
                      "For example, birds can fly (from documents), can i have a coffee? (user question), return False, because they are unrelated explain your reason (highlight your reason, markdown syntax), then give the most relavent follow up based on the docuemnts and user question; "
                      "birds can fly (from documents), who can fly?(user question), return True because question and documents are relatived."
                      "Also It doesn't need to be particularly strict, just something related to return True."
                      "For now: Documents: {documents} Question: {question}.")
        ]) | get_llm().with_structured_output(RelevantQuestionModel)

    def preprocessor(self):
        """ Document preprocessor """
        question = rewrite_question(self.question)
        current_app.logger.debug("rephrased question: %s", question)

        yield f"data: {SESSION_ID_TAG} {self.session_id}\n\n"
        current_app.logger.debug("Chat session ID: %s", self.session_id)

        self.documents = store.as_retriever(search_kwargs={"k": 3, "filter": {"terms": {
            "metadata.permission.keyword": self.permission
        }}}).invoke(question)


    def supervisor(self, preprocessor: preprocessor):
        """ 分发内容 """
        # 预处理
        for pre in preprocessor():
            yield pre

        # check permission
        if not self.documents:
            yield f"data: We can't find any documents related to your question. Please check your permission.\n\n"
            yield from self._exit()
            return

        router_model: RouterModel = self.question_router.invoke({
            "question": self.question,
        })

        # 分发内容
        if router_model.destination == CategoryEnum.FINANCE.name:
            yield from self._finance_category()
        elif router_model.destination == CategoryEnum.OTHERS.name:
            yield from self._other_category()
        else:
            # 无法分别问题类型
            yield f"data: we cannot identify your question, try another one\n\n"

        for doc in self.documents:
            doc_source = {**doc.metadata, "page_content": doc.page_content}
            current_app.logger.debug(
                "Retrieved document passage from: %s", doc.metadata["name"]
            )
            yield f"data: {SOURCE_TAG} {json.dumps(doc_source)}\n\n"

        # 结束
        yield from self._exit()

    def _stream_llm_response_naive(self, qa_prompt):
        answer = ""
        for chunk in get_llm().stream(qa_prompt):
            content = chunk.content.replace("\n", "<br>")
            answer += content
            yield f"data: {content}\n\n"

        # 结束问答，换行
        yield f"data: <br>\n\n"
        self.answer = answer

        current_app.logger.debug('Identify chart response')
        chart_router_model: ChartRouterModel = self.chart_router.invoke({
            "question": self.question,
        })
        current_app.logger.debug(chart_router_model)
        if chart_router_model.is_required:
            yield from self._chart_generator()

        yield f"data:<br>\n\n"
        # Follow up
        current_app.logger.debug("Generate three follow up")
        follow_up_prompt = render_template(
            "rag_followup.txt",
            question=self.question,
            answer=self.answer,
            docs=self.documents,
        )

        response = get_llm().invoke(follow_up_prompt)
        tags = response.content.split('\n')

        for tag in tags:
            yield f"data: {FOLLOWUP_TAG} {tag}\n\n"

    def _stream_llm_response(self, qa_prompt):
        """共用的 get_llm().stream() 方法"""
        relavant_question: RelevantQuestionModel = self.ralevent_question.invoke({
            "question": qa_prompt,
            'documents': self.documents,
        })

        current_app.logger.debug("is relavant: %s",relavant_question.is_relevant)

        if relavant_question.is_relevant:
            answer = ""
            for chunk in get_llm().stream(qa_prompt):
                content = chunk.content.replace("\n", "<br>")
                answer += content
                yield f"data: {content}\n\n"

            # 结束问答，换行
            yield f"data: <br>\n\n"
            self.answer = answer

            current_app.logger.debug('Identify chart response')
            chart_router_model: ChartRouterModel = self.chart_router.invoke({
                "question": self.question,
            })

            if chart_router_model.is_required:
                yield from self._chart_generator()

            yield f"data:<br>\n\n"
            # Follow up
            current_app.logger.debug("Generate three follow up")
            follow_up_prompt = render_template(
                "rag_followup.txt",
                question=self.question,
                answer=self.answer,
                docs=self.documents,
            )

            response = get_llm().invoke(follow_up_prompt)
            tags = response.content.split('\n')

            for tag in tags:
                yield f"data: {FOLLOWUP_TAG} {tag}\n\n"

        else:
            self.documents = []
            yield f"data: We can't find any documents related to your question. Please try different keywords or asking more specific\n\n"
            yield f"data: <br>\n\n"

    def _finance_category(self):
        current_app.logger.debug("Using finance related query prompt")
        qa_prompt = render_template(
            "rag_prompt_finance.txt",
            question=self.question,
            docs=self.documents,
        )
        yield from self._stream_llm_response_naive(qa_prompt)


    def _chart_generator(self):
        ''' Pie chart only '''
        yield f'data: {CHART_GENERATION_TAG}\n\n'
        pie_chart_model: List[PieChartModel] = self.pie_chart.invoke({'table': self.answer})
        for _ in pie_chart_model:
            for chart in _[1]:
                yield f'data: {CHART_DATA}value={chart}\n\n'
        current_app.logger.debug(pie_chart_model)
        yield f'data: {END_CHART_GENERATION_TAG}\n\n'
        yield f'data: <br>\n\n'

    def _other_category(self):
        current_app.logger.debug("Using common query prompt")
        qa_prompt = render_template(
            "rag_prompt.txt",
            question=self.question,
            docs=self.documents,
        )
        yield from self._stream_llm_response_naive(qa_prompt)



    def _exit(self):
        # End
        yield f"data: {DONE_TAG}\n\n"
        current_app.logger.debug("Answer: %s", self.answer)
        if self.es_chat_history:
            self.es_chat_history.add_user_message(self.question)
            self.es_chat_history.add_ai_message(self.answer)




@stream_with_context
# financial department ,'economic','finance',,'cashflow'
def ask_question_2(question, session_id, permission: list = []):
    nexus: NexusGraph = NexusGraph(
        session_id=session_id,
        question=question,
        permission=permission,
    )
    for n in nexus.supervisor(preprocessor=nexus.preprocessor):
        yield n


@stream_with_context
def ask_question_3(question, session_id, permission: list = []):
    # 1. rephrase question in clearer form for llm to use
    question = rewrite_question(question)
    current_app.logger.debug("rephrased question: %s", question)

    yield f"data: {SESSION_ID_TAG} {session_id}\n\n"
    current_app.logger.debug("Chat session ID: %s",
                             session_id)

    docs = store.as_retriever(search_kwargs={"k": 3, "filter": {"terms": {
        "metadata.permission.keyword": permission
    }}}).invoke(question)

    # 2. regrade doc retrieved by vectorstore, remove irrelevant docs for better result
    graded_docs = grade_retrived_documents(question, docs)

    for doc in docs:
        doc_source = {**doc.metadata, "page_content": doc.page_content}
        current_app.logger.debug(
            "Retrieved document passage from: %s", doc.metadata["name"]
        )
        yield f"data: {SOURCE_TAG} {json.dumps(doc_source)}\n\n"

    # 3. identify the type of question, route question to different prompts
    query_type = route_query(question)
    if query_type.datasource == "finance_related_query":
        current_app.logger.debug("Using finance related query prompt")
        qa_prompt = render_template(
            "rag_prompt_finance.txt",
            question=question,
            docs=docs,
        )
    else:
        qa_prompt = render_template(
            "rag_prompt.txt",
            question=question,
            docs=docs,
        )

    # 4. stream answer
    answer = ""

    for chunk in get_llm().stream(qa_prompt):
        content = chunk.content.replace(
            "\n", "<br>"
        )
        answer += content
        yield f"data: {content}\n\n"

    yield f"data:<br>\n\n"
    # Follow up
    current_app.logger.debug("Generate three follow up")
    follow_up_prompt = render_template(
        "rag_followup.txt",
        question=question,
        answer=answer,
        docs=docs,
    )

    followup_response = get_llm().invoke(follow_up_prompt)
    followups = followup_response.content.split('\n')

    for followup in followups:
        yield f"data: {FOLLOWUP_TAG} {followup}\n\n"

    yield f"data: {DONE_TAG}\n\n"
    current_app.logger.debug("Answer: %s", answer)
    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )
    chat_history.add_user_message(question)
    chat_history.add_ai_message(answer)
