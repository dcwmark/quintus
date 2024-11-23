// src/server/diagnotics.ts

'use strict';

import { geminiAIChat, geminiAIEmbeddung } from "./connections/geminiAIConnect";
import { mistralAIChat, mistralAIEmbeddung } from "./connections/mistralAIConnect";
import { openAIChat, openAIEmbeddung } from "./connections/openAIConnect";

const prompt: string = `Create an haiku about a robot's dream.`;
const inputs: string[] = ["Embed this sentence.", "As well as this one."];

geminiAIChat(prompt)
  .then((response) => console.log(`geminiai response::`, JSON.stringify(response, null, 2)))
  .catch((error) => console.error(error));

// geminiAIEmbeddung(inputs)
//   .then((response) => console.log(`geminiai embedding response::`, response))
//   .catch((error) => console.error(error));

mistralAIChat(prompt)
// .then((response) => console.log(`mistralai response::`, JSON.stringify(response, null, 2)))
.then((response) => console.log(`mistralai response::`, response.candidates[0].content))
.catch((error) => console.error(error));

// mistralAIEmbeddung(inputs)
//   .then((response) => console.log(`mistralai embedding response::`, response))
//   .catch((error) => console.error(error));

// openAIChat(prompt)
//   .then((response) => console.log(`openai response::`, JSON.stringify(response, null, 2)))
//   .catch((error) => console.error(error));

// openAIEmbeddung(inputs)
//   .then((response) => console.log(`openai embedding response::`, response))
//   .catch((error) => console.error(error));
