import os

from elasticsearch import Elasticsearch
# langchain
from langchain_elasticsearch import ElasticsearchStore
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

''' Database '''
ELASTICSEARCH_CHUNKS_INDEX = "chunks"  # Document chunk index
ELASTICSEARCH_HISTORY_INDEX = 'history' # Chat history


''' Environments '''
ELASTIC_CLOUD_ID = os.getenv("ELASTIC_CLOUD_ID")
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SPARSE_VECTOR_MODEL = os.getenv("SPARSE_VECTOR_MODEL", '.elser_model_2_linux-x86_64')

SECRET_KEY = os.getenv("SECRET_KEY")


LLM: ChatOpenAI = ChatOpenAI(
        temperature=0,
        openai_api_key=OPENAI_API_KEY,
        streaming=True
    )

ElasticsearchClient: Elasticsearch = Elasticsearch(
    cloud_id=ELASTIC_CLOUD_ID,
    api_key=ELASTIC_API_KEY
)

Store: ElasticsearchStore = ElasticsearchStore(
    es_connection=ElasticsearchClient,
    index_name="permission_based_docs",
    strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id='.elser_model_2_linux-x86_64'),
)
