// src/server/diagnotics.ts

'use strict';

import { geminiAIChat } from "./connections/geminiAIConnect";
import { mistralAIChat, mistralAIEmbeddung } from "./connections/mistralAIConnect";
import { openAIChat, openAIEmbeddung } from "./connections/openAIConnect";

const prompt: string = `Create an haiku about a robot's dream.`;
const inputs: string[] = ["Embed this sentence.", "As well as this one."];

geminiAIChat(prompt)
  .then((response) => console.log(`gemniniai response::`, response))
  .catch((error) => console.error(error));

// mistralAIChat(prompt)
//   .then((response) => console.log(`mistral response::`, response.choices))
//   .catch((error) => console.error(error));

// mistralAIEmbeddung(inputs)
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));

// openAIChat(prompt)
//   .then((response) => console.log(`openai response::`, response.choices))
//   .catch((error) => console.error(error));

// openAIEmbeddung(inputs)
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));
