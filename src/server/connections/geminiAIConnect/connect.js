// src/server/commections/geminiAIConnect/connect.js

'use strict';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { API_KEYS } from "../../../constants/apiKeys.js";
import { LLMs } from "../../../constants/LLMs.js";

const apiKey = API_KEYS.GEMINI_AI_API_KEY;

export const geminiai = new GoogleGenerativeAI(apiKey);

/**
 * Connects to the GeminiAI service to generate a chat response
 * for the provided prompt.
 *
 * @param prompt - The input prompt to generate a chat response for.
 * @returns A Promise that resolves to a GenerateContentResult object
 *          containing the generated chat response.
 * @throws An error if there is a problem connecting to the GeminiAI
 *         service or generating the chat response.
 */
export const chatConnect = async (prompt) => {
  const model = geminiai.getGenerativeModel({ model: LLMs.GEMINI_AI_CHAT_LLM });
  try {
    const chatResponse = await model.generateContent([prompt]);
    return Promise.resolve(chatResponse);
  } catch(error) {
    return Promise.reject(`GeminiAi thrown error:: ${ error }`);
  } 
};

/**
 * Connects to the GeminiAI service to generate embeddings
 * for the provided input strings.
 *
 * @param inputs - An array of input strings to generate embeddings for.
 * @returns A Promise that resolves to an array of EmbedContentResponse objects,
 *          each containing the embedding for the corresponding input string.
 * @throws An error if there is a problem connecting to the GeminiAI service
 *         or generating the embeddings.
 */
export const embedConnect = (inputs) => {
  console.log(`genmini embed llm:: ${ LLMs.GEMINI_AI_EMBED_LLM }`);
  const model = geminiai.getGenerativeModel({ model: LLMs.GEMINI_AI_EMBED_LLM });
  const embeddingResponses = [];
  try {
    inputs.map(async (input) => {
      const embeddingResponse = await model.embedContent(input);
      embeddingResponses.push(embeddingResponse);
    });
    return Promise.resolve(embeddingResponses);
  } catch(error) {
    return Promise.reject(`GeminiAi thrown error:: ${ error }`);
  }
};
