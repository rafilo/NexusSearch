from api.config import ElasticsearchClient


permission_based_docs_history_mapping = {
    "mappings": {
        "properties": {
            "session_id": {
                "type": "keyword"
            },
            "created_at": {
                "type": "date",
            },
            "history": {
                "type": "text",
            },
        }
    }
}

permission_based_docs_table_mapping = {
    "mappings": {
        "properties": {
            "session_id": {
                "type": "keyword"
            },
            "table_id": {
                "type": "keyword"
            },
            "modified_at": {
                "type": "date",
            },
            "name": {
                "type": "text",
            },
        }
    }
}

permission_based_docs_mapping = '''
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text"
      },
      "vector": {
        "type": "sparse_vector"
      }
    }
  },
  "settings": {
    "index": {
      "default_pipeline": "my-elser-pipeline"
    }
  }
}
'''



if __name__ == '__main__':
    ElasticsearchClient.indices.delete(index='permission_based_docs', ignore_unavailable=True)
    ElasticsearchClient.indices.delete(index='permission_based_docs_history')
    ElasticsearchClient.indices.delete(index='permission_based_docs_table')


    # ElasticsearchClient.indices.create(index="permission_based_docs")
    ElasticsearchClient.indices.create(index="permission_based_docs_history", body=permission_based_docs_history_mapping)
    ElasticsearchClient.indices.create(index="permission_based_docs_table", body=permission_based_docs_table_mapping)