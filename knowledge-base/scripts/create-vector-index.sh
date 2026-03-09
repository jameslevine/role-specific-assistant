#!/bin/bash
# Script to create the vector index in OpenSearch Serverless
# Run this after the collection is ACTIVE

COLLECTION_ENDPOINT=$1

if [ -z "$COLLECTION_ENDPOINT" ]; then
  echo "Usage: ./create-vector-index.sh <collection-endpoint>"
  echo "Example: ./create-vector-index.sh https://rs2exxpgstno147r00sd.eu-west-2.aoss.amazonaws.com"
  exit 1
fi

echo "Creating vector index 'bedrock-knowledge-base-default-index' on $COLLECTION_ENDPOINT..."

awscurl --service aoss --region eu-west-2 \
  -X PUT \
  "$COLLECTION_ENDPOINT/bedrock-knowledge-base-default-index" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "index": {
        "knn": true,
        "knn.algo_param.ef_search": 512
      }
    },
    "mappings": {
      "properties": {
        "bedrock-knowledge-base-default-vector": {
          "type": "knn_vector",
          "dimension": 1024,
          "method": {
            "engine": "faiss",
            "space_type": "l2",
            "name": "hnsw",
            "parameters": {
              "ef_construction": 512,
              "m": 16
            }
          }
        },
        "AMAZON_BEDROCK_TEXT_CHUNK": {
          "type": "text"
        },
        "AMAZON_BEDROCK_METADATA": {
          "type": "text",
          "index": false
        }
      }
    }
  }'

echo ""
echo "Vector index created successfully!"
