import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import dotenv from "dotenv";

dotenv.config();
const client = new ChromaClient({
  path: process.env.CHROMA_PATH,
});

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: "text-embedding-3-small",
});

async function main() {
  const response = await client.createCollection({
    name: "data-test2",
    embeddingFunction: embeddingFunction,
  });
  console.log(response);
}

async function addData() {
  try {
    const collection = await client.getCollection({
      name: "data-test2",
      embeddingFunction: embeddingFunction,
    });
    const result = await collection.add({
      ids: ["id1", "id2"],
      metadatas: [{ key: "value" }, { key: "value" }],
      documents: ["document1", "document2"],
    });
    console.log(result);
  } catch (error) {
    console.error("Error adding data:", error);
  }
}

addData();
