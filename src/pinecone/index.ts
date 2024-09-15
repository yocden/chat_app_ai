import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

async function listIndexes() {
  const result = await pc.listIndexes();
  console.log(result);
}

//
function getIndex() {
  const index = pc.index<CoolType>("cool-index");
  return index;
}

//
function generateNumberArray(length: number) {
  return Array.from({ length }, () => Math.random());
}

//
type CoolType = {
  coolness: number;
  referrence: string;
};
// add entry
async function upsertVectors() {
  const embedding = generateNumberArray(1536);
  const index = getIndex();
  const upsertResult = await index.upsert([
    {
      id: "id-1",
      values: embedding,
      metadata: {
        coolness: 3,
        referrence: "abdc",
      },
    },
  ]);
}

async function queryVectors() {
  const index = getIndex();
  const result = await index.query({
    id: "id-1",
    topK: 1,
    includeMetadata: true,
  });
  console.log(result);
  console.log("metadata:", result.matches[0].metadata);
}
async function createIndex() {
  try {
    await pc.createIndex({
      name: "cool-index",
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}
async function main() {
  //await listIndexes();
  //await upsertVectors();
  await queryVectors();
}

main();
