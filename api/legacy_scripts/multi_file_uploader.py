import abc
import asyncio
import datetime
import os
import time
from typing import List, Union

import aiofiles
from datasets import tqdm
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage
from langchain_elasticsearch import ElasticsearchStore

from api.ai_methods.models import DocumentMetadata
from api.testapi.snowflakeGenerator import snowflake
from api.utils import get_file_name_and_type
from api.config import ElasticsearchClient, \
    LLM

"""
NOTE: this file supports multiple extension of the file, but wasn't used in this sprint.
May use this uploader to support arbitary file upload in future
"""

snowflake_generator = snowflake(1, 1)

TARGET_DIR = '../docs'

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=512, chunk_overlap=256
)


class BaseDocumentProcessor:
    def __init__(self, file_path):
        if file_path is None:
            raise ValueError('file_path cannot be None')

        # For prompt only
        self._label_key_name = 'label'

        # For elasticsearch
        self._chunk_size = 512
        self._chunk_overlap = 256

        # Chunk details
        self.content: Union[str, None] = ""
        self._label_prompt: Union[str, None] = ""
        self.url: str = file_path
        self.name: str = get_file_name_and_type(file_path)[0]
        self.category: str = get_file_name_and_type(file_path)[1]
        self.chunk_id: Union[str, int] = snowflake_generator.next_id()
        # following fields are not implemented yet, following the structure of data provided by data.json
        self._summary_prompt: Union[str, None] = ""
        self.updated_at: str = ""
        self.created_on: str = ""
        self.summary: str = ""

        # Langchain Document
        self.document: Union[Document, None] = None

    @abc.abstractmethod
    async def process(self) -> None:
        raise NotImplementedError

    def _init_doc(self, doc_content) -> None:
        self._content = doc_content
        self._label_prompt = f"""

          Now you need to output a label list based on your summary of the document (document below --- doc content ---). 
          Also, label should be list of strings and appear only once.
        
          For example:
          {{
            "{self._label_key_name}": ["Healthcare", "Python", "HTTP"]
          }}
          
          If you don't know the answer, just return {{ "{self._label_key_name}": []}} , don't try to make up an answer.


          Your response format should be:
          {{
          "{self._label_key_name}": []
          }}
            
          --- doc content ---
            
          {doc_content}

          """

    def _set_labels(self, labels: List[str]) -> None:
        if not isinstance(labels, list):
            raise TypeError("Expected a list for 'labels'")

        if not all(isinstance(label, str) for label in labels):
            raise TypeError("All elements in 'labels' must be strings")

        self._labels = labels

    def _set_document(self):
        self.document = DocumentMetadata(
            chunk_id=self.chunk_id,
            page_number=0,
            file_name=self.file_name,
            file_path=self.file_path,
            file_type=self.file_type,
            labels=self._labels,
            permissions=["IT"],
            section_summary="",
        ).to_document(page_content=self._content)

    async def _ask_llm_for_labels(self) -> BaseMessage:
        """ Input content to LLM, then get the labels"""

        if self._label_prompt is None or self._label_prompt == "":
            raise ValueError("_label_prompt cannot be empty")
        if self._content is None or self._content == "":
            raise ValueError("_content cannot be empty")

        return LLM.invoke(self._label_prompt)

    async def _upload_to_elasticsearch(self) -> None:
        """ Upload the document to Elasticsearch """
        await self._remove_elasticsearch_content()

        self._set_document()

        workspace_docs: [Document] = [self.document]
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=self._chunk_size, chunk_overlap=self._chunk_overlap
        )

        docs: List[Document] = list(
            text_splitter.transform_documents(workspace_docs))

        ElasticsearchStore.from_documents(
            docs,
            es_connection=ElasticsearchClient,
            index_name='permission_based_docs',
            strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(
                model_id=".elser_model_2_linux-x86_64"),
            bulk_kwargs={
                "request_timeout": 60,
            },
        )

    async def _remove_elasticsearch_content(self) -> None:
        """ Remove the content of Elasticsearch """
        # ElasticsearchClient.indices.create(index="permission_based_docs")
        # ElasticsearchClient.indices.delete(index='permission_based_docs', ignore_unavailable=True)
        pass


class TxtProcessor(BaseDocumentProcessor):

    async def process(self) -> None:
        """ 解析文件中包含的文字，然后 super 到 BaseDocumentProcessor 处理"""
        async with aiofiles.open(self.file_path, 'r') as f:
            content: str = await f.read()

            self._init_doc(content)  # initialized BaseDocumentProcessor
            base_message: BaseMessage = await self._ask_llm_for_labels()
            labels = eval(base_message.content)[
                self._label_key_name]  # gather labels

            self._set_labels(labels)
            await self._upload_to_elasticsearch()


class PdfProcessor(BaseDocumentProcessor):
    async def process(self):
        # todo:
        pass


class DocProcessor(BaseDocumentProcessor):
    async def process(self):
        # todo:
        pass


class CsvProcessor(BaseDocumentProcessor):
    async def process(self):
        # todo:
        pass


async def process_file(file_path):
    if file_path.endswith('.pdf'):
        # todo:
        pass
    elif file_path.endswith('.docx'):
        # todo:
        pass
    elif file_path.endswith('.doc'):
        # todo:
        pass
    elif file_path.endswith('.csv'):
        # todo:
        pass
    elif file_path.endswith('.txt'):
        txt_processor = TxtProcessor(file_path=file_path)
        await txt_processor.process()

    else:
        print(f"Unsupported file type: {file_path}")


async def upload_directory(directory: str) -> None:
    """ 异步处理文件 """

    tasks = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            task = process_file(file_path)
            tasks.append(task)

    # 使用 tqdm 展示进度条
    for task in tqdm.as_completed(tasks, total=len(tasks)):
        await task


if __name__ == "__main__":
    start_time = time.time()
    asyncio.run(upload_directory(TARGET_DIR))
    end_time = time.time()
    print(f"Completed in: {end_time - start_time}")
