import dotenv from "dotenv";
import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

dotenv.config();

const openai = new OpenAI();
const encoder = encoding_for_model("gpt-3.5-turbo");
const maxTokens = 700;
const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  { role: "system", content: " You are a helpful chatbot" },
];

async function createChatCompletion() {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });
  const responseMessage = response.choices[0].message;
  context.push({ role: "assistant", content: responseMessage.content });
  if (response.usage && response.usage.total_tokens > maxTokens) {
    //deleteOlderMessage
    deleteOlderMessage();
  }
  console.log(
    `${response.choices[0].message.role}:${response.choices[0].message.content}`
  );
}

process.stdin.addListener("data", async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  await createChatCompletion();
});

function deleteOlderMessage() {
  //count how big is context
  let contextLength = getContextLength();

  while (contextLength > maxTokens){
    for (let i=0; i < context.length; i++){
      const message = context[i];
      if(message.role != 'system'){
        context.splice(i, 1);
        contextLength = getContextLength();
        console.log("contextLength:", contextLength);
        break;
      }
    }
  }
}

function getContextLength() {
  // count that typeof message.content == string or messgeContent.type == text because content can have entries like undefined or null
  let length = 0;
  context.forEach((message) => {
    if (message.content === "string") {
      length += encoder.encode(message.content).length;
    } else if (Array.isArray(message.content)) {
      message.content.forEach((messageContent) => {
        if (messageContent.type === "text") {
          length += encoder.encode(messageContent.text).length;
        }
      });
    }
  });
  return length;
}
