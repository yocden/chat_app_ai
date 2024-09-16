import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import dotenv from "dotenv";

dotenv.config();
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {product_name}"
  );
  //   const wholePrompt = await prompt.format({
  //     product_name: "Apple iPhone",
  //   });

  // create a chain: connecting the model and prompt
  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: "Apple iPhone",
  });
  console.log(response.content);
}

async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Write a short description for the product provided by the user",
    ],
    ["human", "{product_name}"],
  ]);
  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    product_name: "Apple iPhone",
  });
  console.log(result.content);
}

async function stringParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the product: {product}"
  );
  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  const response = await chain.invoke({
    product: "Smoked Brisket",
  });
  console.log(response);
}

async function commaSeparatedParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Provide the cooking procedure separated by commas, for: {word}"
  );
  const parser = new CommaSeparatedListOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  const response = await chain.invoke({
    word: "Smoked Pork Bacon",
  });
  console.log(response);
}

async function structuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting instructions: {format_instructions}
        Phrase: {phrase}
        `);
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    likes: "what the person likes",
  });

  const chain = prompt.pipe(model).pipe(outputParser);
  const response = await chain.invoke({
    phrase: "John likes pinapple pizza",
    format_instructions: outputParser.getFormatInstructions(),
  });
  console.log(response);
}
structuredParser();
