// src/server/index.ts

'use strict';

import { mistralChat, mistralEmbeddung } from "./connections/mistralAIConnect";

const prompt: string = `What does a robot dream?`;
mistralChat(prompt)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

const inputs: string[] = ["Embed this sentence.", "As well as this one."];
mistralEmbeddung(inputs)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
