import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
  maxTokens: 700,
  //verbose: true,
});

async function singleOneRequest() {
  const response = await model.invoke(
    "Translate I Love programming in Filipino"
  );
  console.log(response.content);
}

async function parallelRequest() {
  const response = await model.batch(["Hello", "What is the best 80s song?"]);
  console.log(response);
}

async function streamRequest() {
  const response = await model.stream(
    "Give me the top NBA playes in 1980s era"
  );
  for await (const chunk of response) {
    console.log(chunk.content);
  }
}
async function main() {
  streamRequest();
}

main();
