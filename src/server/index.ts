// src/server/index.ts

'use strict';

import { response } from "express";
import { chatConnect } from "./connections/mistraAIlConnect";

const prompt: string = `What does a robot dream?`;
chatConnect(prompt)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

