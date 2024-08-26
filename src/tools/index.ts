import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI();

function getTimeOfDay() {
  return "5:45";
}

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
  ];
  //configure chat tools(call openAI)
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "Get the time of day",
        },
      },
    ],
    tool_choice: "auto", // engine will decide which tool to use
  });

  //decide if tool call is required
  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (response.choices[0].finish_reason === "tool_calls" && toolCall) {
    const toolName = toolCall.function.name;
    if (toolName === "getTimeOfDay") {
      const toolResponse = getTimeOfDay();
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall.id,
      });
    }
  }
  const secondResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });
  console.log(secondResponse.choices[0].message.content);
}

callOpenAIWithTools();
