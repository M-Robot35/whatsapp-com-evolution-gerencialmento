// docutação https://platform.openai.com/docs/guides/text-to-speech
// https://platform.openai.com/docs/api-reference/audio/createSpeech
// https://github.com/openai/openai-node

import OpenAI from "openai";
import { playAudio } from "openai/helpers/audio";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
  instructions: "Speak in a cheerful and positive tone.",
  response_format: "wav",
});

await playAudio(response);

//import fs from "fs";
//const speechFile = path.resolve("./speech.mp3");

//const mp3 = await openai.audio.speech.create({
//  model: "gpt-4o-mini-tts",
//  voice: "coral",
//  input: "Today is a wonderful day to build something people love!",
//  instructions: "Speak in a cheerful and positive tone.",
//});

//  const buffer = Buffer.from(await mp3.arrayBuffer());
//await fs.promises.writeFile(speechFile, buffer);

