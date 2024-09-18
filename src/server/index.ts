// src/server/index.ts

'use strict';

import { chatConnect } from "./connections/mistraAIConnect";

const prompt: string = `What does a robot dream?`;
chatConnect(prompt)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
