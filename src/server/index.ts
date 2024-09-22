// src/server/index.ts

'use strict';

import { mistralAIChat, mistralAIEmbeddung } from "./connections/mistralAIConnect";
import { openAIChat, openAIEmbeddung } from "./connections/openAIConnect";

const prompt: string = `Create an haiku about a robot's dream.`;
const inputs: string[] = ["Embed this sentence.", "As well as this one."];

mistralAIChat(prompt)
  .then((response) => console.log(`mistral response::`, response.choices))
  .catch((error) => console.error(error));

mistralAIEmbeddung(inputs)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

openAIChat(prompt)
  .then((response) => console.log(`openai response::`, response.choices))
  .catch((error) => console.error(error));


openAIEmbeddung(inputs)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
