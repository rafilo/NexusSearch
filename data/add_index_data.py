from elasticsearch import Elasticsearch, NotFoundError
from langchain_elasticsearch import ElasticsearchStore
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
from extract_metadata import split_text_with_metadata
import json
import os
import time
from llama_index.core import SimpleDirectoryReader
from llama_index.llms.openai import OpenAI

load_dotenv()

# Global variables
# Modify these if you want to use a different file, index or model
INDEX = os.getenv("ES_INDEX", "workplace-app-docs")
FILES = [os.getenv(
    "FILE", f"{os.path.dirname(__file__)}/input/Spark_Annual_Report_2021.pdf"), os.getenv(
    "FILE", f"{os.path.dirname(__file__)}/input/Spark_Annual_Report_2022.pdf"),
    os.getenv(
    "FILE", f"{os.path.dirname(__file__)}/input/Spark_Annual_Report_2023.pdf"), ]
TESTFILE = os.getenv(
    "FILE", f"{os.path.dirname(__file__)}/input/2023-fph-interim-report.pdf")
ELASTIC_CLOUD_ID = os.getenv("ELASTIC_CLOUD_ID")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2_linux-x86_64")

llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo", max_tokens=512)


if ELASTICSEARCH_URL:
    elasticsearch_client = Elasticsearch(
        hosts=[ELASTICSEARCH_URL],
    )
elif ELASTIC_CLOUD_ID:
    elasticsearch_client = Elasticsearch(
        cloud_id=ELASTIC_CLOUD_ID, api_key=ELASTIC_API_KEY
    )
else:
    raise ValueError(
        "Please provide either ELASTICSEARCH_URL or ELASTIC_CLOUD_ID and ELASTIC_API_KEY"
    )


def main():
    # TODO: index docs to elastic search cloud
    workplace_docs = []
    test_docs = SimpleDirectoryReader(input_files=[TESTFILE]).load_data()
    for i, doc in enumerate(test_docs):
        if doc.text == "":
            print("chunk empty:", i)
    docs = split_text_with_metadata(test_docs, llm)

    print(f"{len(docs)} chunks")

    for doc in docs:
        if doc.text != "":
            workplace_docs.append(Document(
                page_content=doc.text,
                metadata={
                    "name": doc.metadata["file_name"],
                    "summary": doc.metadata["section_summary"],
                    "url": doc.metadata["file_path"],
                    "category": os.path.splitext(doc.metadata["file_name"])[1].replace(".", ""),
                    "updated_at": doc.metadata["last_modified_date"],
                    "permission": ["Finance", "Admin"],
                    "label": doc.metadata["label"]
                },
            ))
    print(workplace_docs[-1])


    ElasticsearchStore.from_documents(
        documents=workplace_docs,
        es_connection=elasticsearch_client,
        index_name=INDEX,
        strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(
            model_id=ELSER_MODEL),
        bulk_kwargs={
            "request_timeout": 60,
        },
    )



if __name__ == "__main__":
    main()
