import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI();

function getFlightOfToday(departure: string, destination: string): string[] {
  console.log("Getting available flights");
  if (departure == "SFO" && destination == "LAX") {
    return ["UA 123", "AA 456"];
  }
  if (departure == "DFW" && destination == "LAX") {
    return ["AA 789"];
  }
  return ["66 FSFG"];
}

function makeFlightReservation(flightNumber: string): string {
  if (flightNumber.length == 6) {
    console.log(`Your reservation number for flight ${flightNumber}`);
    return `123456`;
  } else {
    return "FULLY_BOOKED";
  }
}
const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant that gives information about flights and makes reservation",
  },
];
async function callOpenAIWithFunctions() {
  //configure chat tools(call openAI). in this sample tool is a FUNCTION
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    temperature: 0.0,
    tools: [
      {
        type: "function",
        function: {
          name: "getFlightOfToday",
          description: "Get the plane flights available between 2 destination",
          parameters: {
            type: "object",
            properties: {
              departure: {
                type: "string",
                description: "Departure airport code",
              },
              destination: {
                type: "string",
                description: "Destination airport code",
              },
            },
            required: ["departure", "destination"],
          },
        },
      },

      {
        type: "function",
        function: {
          name: "makeFlightReservation",
          description: "Return the flight reservation number",
          parameters: {
            type: "object",
            properties: {
              flightNumber: {
                type: "string",
                description: "The flight Number",
              },
            },
            required: ["flightNumber"],
          },
        },
      },
    ],
    tool_choice: "auto", // engine will decide which tool to use
  });

  //decide if tool call is required
  const willInvokeFunction = response.choices[0].finish_reason == "tool_calls";
  if (willInvokeFunction) {
    const toolCall = response.choices[0].message.tool_calls![0];
    const functionName = toolCall.function.name;

    if (functionName === "getFlightOfToday") {
      const rawArgument = JSON.parse(toolCall.function.arguments);
      const availableFlightResponse = getFlightOfToday(
        rawArgument.departure,
        rawArgument.destination
      );
      // to avoid error
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: availableFlightResponse.toString(),
        tool_call_id: toolCall.id,
      });
    }

    if (functionName === "makeFlightReservation") {
      const rawArgument = JSON.parse(toolCall.function.arguments);
      const flightReservationResponse = makeFlightReservation(
        rawArgument.flightNumber
      );
      // to avoid error
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: flightReservationResponse,
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

console.log("Flight Assistant Chatbot");
process.stdin.addListener("data", async function (input) {
  let userInput = input.toString().trim();
  context.push({
    role: "assistant",
    content: userInput,
  });
  await callOpenAIWithFunctions();
});
