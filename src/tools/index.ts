import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI();

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a conversational AI assistant giving information about date and time.",
    },
    {
      role: "user",
      content: "What is the current date and time in New York City?",
    },
  ]
  //configure chat tools(call openAI)
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context
  })
  console.log(response.choices[0].message.content)
}

callOpenAIWithTools();