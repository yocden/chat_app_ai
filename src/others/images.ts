import dotenv from "dotenv";
import { createReadStream, writeFileSync } from "fs";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI();

async function generateFreeImage() {
  const response = await openai.images.generate({
    prompt: "A photo of cat in a mat",
    model: "dall-e-2",
    style: "vivid",
    size: "256x256",
    quality: "standard",
    n: 1,
  });

  console.log(response);
}

async function generateFreeLocalImage() {
  const response = await openai.images.generate({
    prompt: "A photo of cat in a mat",
    model: "dall-e-2",
    style: "vivid",
    size: "256x256",
    quality: "standard",
    n: 1,
    response_format: "b64_json",
  });
  const rawImage = response.data[0].b64_json;
  if (rawImage) {
    writeFileSync("cat.png", Buffer.from(rawImage, "base64"));
  }
  console.log(response);
}

async function generateAdvancedImage(){
    const response = await openai.images.generate({
        prompt: "A photo of a lot sweet potatoes with funny faces riding each on their motor bike on mountain ranges with curve roads",
        model: "dall-e-3",
        style: "vivid",
        size: "1024x1024",
        quality: "hd",
        n: 1,
        response_format: "b64_json",
      });
      const rawImage = response.data[0].b64_json;
      if (rawImage) {
        writeFileSync("kamoteRiders.png", Buffer.from(rawImage, "base64"));
      }
      console.log(response);
}

async function generateImageVariation() {
    const response= await openai.images.createVariation({
        image: createReadStream("kamoteRiders.png"),
        model: "dall-e-2",
        response_format: "b64_json",
        n:1
    })
    const rawImage = response.data[0].b64_json;
    if (rawImage){
        writeFileSync("kamoteRidersVariation.png", Buffer.from(rawImage, "base64"))
    }
}

async function editImage(){
    const response = await openai.images.edit({
        image: createReadStream("kamoteRiders.png"),
        mask: createReadStream("kamoteRidersMask.png"),
        prompt: "Add photographers on the side of the road",
        model: "dall-e-2",
        response_format: "b64_json"
    })
    const rawImage = response.data[0].b64_json;
    if (rawImage){
        writeFileSync("kamoteRidersEdited.png", Buffer.from(rawImage, "base64"))
    }
}
editImage();
