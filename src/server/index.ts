// src/server/index.ts

'use strict';

import { mistralAIChat, mistralAIEmbeddung } from "./connections/mistralAIConnect";
import { openAIChat } from "./connections/openAIConnect";

const prompt: string = `What does a robot dream?`;
const inputs: string[] = ["Embed this sentence.", "As well as this one."];

mistralAIChat(prompt)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

mistralAIEmbeddung(inputs)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

// openAIChat(prompt)
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));
  