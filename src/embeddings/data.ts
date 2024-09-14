import OpenAI from "openai";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

dotenv.config();
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

export async function generateEmbeddings(input: string | string[]) {
  const response = await openAI.embeddings.create({
    input: input,
    model: "text-embedding-3-small",
  });
  console.log(response.data[0]);
  return response;
}

export function loadJsonData<T>(fileName: string): T {
  const path = join(__dirname, fileName);
  const rawData = readFileSync(path);
  return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataBuffer);
  console.log(`saved data to ${fileName}`);
}

async function main() {
  const data = loadJsonData<string[]>("data.json");
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }
  saveDataToJsonFile(dataWithEmbeddings, "dataWithEmbeddings.json");
}
main();
