import dotenv from "dotenv";
import { createReadStream, writeFileSync } from "fs";
import OpenAI from "openai";
//remobe
dotenv.config();
const openai = new OpenAI();

//receiving an audio and generate text
async function createTranscription() {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream("Recording.mp3"),
    model: "whisper-1",
    language: "en",
    response_format: "verbose_json",
  });
  console.log("response:", response);
}

//translate filipino to english:NOT WORKING
async function translate() {
  try {
    const response = await openai.audio.translations.create({
      file: createReadStream("gutom.mp3"),
      model: "whisper-1",
      response_format: "verbose_json",
    });
    console.log("response:", response);
  } catch (error) {
    console.log(error);
  }
}

async function textToSpeech() {
  const sampleText = "This is a sample text to speech capability";
  try {
    const response = await openai.audio.speech.create({
      input: sampleText,
      voice: "alloy",
      model: "tts-1",
      response_format: "mp3",
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync("ttssample.mp3", buffer);
  } catch (error) {
    console.log(error);
  }
}
textToSpeech();
