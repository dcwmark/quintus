// src/server/diagnostics.js

'use strict';

import { geminiAIChat, geminiAIEmbedding } from "./connections/geminiAIConnect/index.js";
import { mistralAIChat, mistralAIEmbedding } from "./connections/mistralAIConnect/index.js";
import { openAIChat, openAIEmbedding } from "./connections/openAIConnect/index.js";

const prompt = `Create an haiku about a robot's dream.`;
const inputs = ["Embed this sentence.", "As well as this one."];

geminiAIChat(prompt)
  /** full diagnostics */
  // .then((response) => console.log(
  //  `\n geminiai response::`,
  //  JSON.stringify(response, null, 2)))
  /** level 1 diagnostics */
  .then((response) => console.log(
    `\n geminiai chat response::\n\n`,
    response.response.text()
  ))
  .catch((error) => console.error(error));

geminiAIEmbedding(inputs)
  .then((response) => console.log(
    `\n geminiai embedding response::`, response
  ))
  .catch((error) => console.error(error));

mistralAIChat(prompt)
  /** full diagnostics */
  // .then((response) => console.log(
  //  `\n mistralai response::`,
  //  JSON.stringify(response, null, 2)))
  /** level 1 diagnostics */
  .then((response) => console.log(
    `\n mistralai chat response::\n\n`,
    response.choices[0].message.content
  ))
  .catch((error) => console.error(error));

mistralAIEmbedding(inputs)
  .then((response) => console.log(
    `\n mistralai embedding response::`, response
  ))
  .catch((error) => console.error(error));

openAIChat(prompt)
  /** full diagnostics */
  // .then((response) => console.log(
  //  `\n openai response::`,
  //  JSON.stringify(response, null, 2)))
  /** level 1 diagnostics */
  .then((response) => console.log(
    `\n openai chat response::\n\n`,
    response.choices[0].message.content
  ))
  .catch((error) => console.error(error));

openAIEmbedding(inputs)
  .then((response) => console.log(
    `\n openai embedding response::`, response
  ))
  .catch((error) => console.error(error));
