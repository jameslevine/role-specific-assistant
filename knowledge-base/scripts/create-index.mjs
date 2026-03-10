// Script to create the vector index in OpenSearch Serverless
// Usage: node create-index.mjs

import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { Client } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const COLLECTION_ENDPOINT = "https://rs2exxpgstno147r00sd.eu-west-2.aoss.amazonaws.com";
const REGION = "eu-west-2";
const INDEX_NAME = "bedrock-knowledge-base-default-index";

async function main() {
  const client = new Client({
    ...AwsSigv4Signer({
      region: REGION,
      service: "aoss",
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: COLLECTION_ENDPOINT,
  });

  console.log(`Creating vector index '${INDEX_NAME}'...`);

  try {
    const response = await client.indices.create({
      index: INDEX_NAME,
      body: {
        settings: {
          index: {
            knn: true,
            "knn.algo_param.ef_search": 512,
          },
        },
        mappings: {
          properties: {
            "bedrock-knowledge-base-default-vector": {
              type: "knn_vector",
              dimension: 1024,
              method: {
                engine: "faiss",
                space_type: "l2",
                name: "hnsw",
                parameters: {
                  ef_construction: 512,
                  m: 16,
                },
              },
            },
            AMAZON_BEDROCK_TEXT_CHUNK: {
              type: "text",
            },
            AMAZON_BEDROCK_METADATA: {
              type: "text",
              index: false,
            },
          },
        },
      },
    });

    console.log("Index created successfully:", JSON.stringify(response.body, null, 2));
  } catch (error) {
    console.error("Error creating index:", error.message);
    if (error.body) {
      console.error("Details:", JSON.stringify(error.body, null, 2));
    }
  }
}

main();
