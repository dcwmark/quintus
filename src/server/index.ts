// src/server/index.ts

'use strict';

import { chatConnect } from "./connections/mistraAIlConnect";

const prompt: string = `What does a robot dream?`;
console.log(chatConnect(prompt));

