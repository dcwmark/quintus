// src/server/commections/mistralAIConnect/connect.js

'use strict';

import { Mistral } from "@mistralai/mistralai";

import { API_KEYS } from "../../../constants/apiKeys.js";
import { LLMs } from "../../../constants/LLMs.js";

const apiKey = API_KEYS.MISTRAL_AI_API_KEY;

export const mistral = new Mistral({ apiKey: apiKey });

/**
 * Connects to the Mistral AI chat API and generates a chat
 * completion response based on the provided prompt.
 *
 * @param prompt - The input prompt to send to the Mistral AI chat model.
 * @returns A Promise that resolves to the ChatCompletionResponse object
 *          returned by the Mistral AI chat API.
 * @throws An error if there is an issue connecting to the Mistral AI chat API.
 */
export const chatConnect = async (prompt) => {
  try {
    const chatResponse = await mistral.chat.complete({
      model: LLMs.MISTRAL_AI_CHAT_LLM ?? null,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });
    return Promise.resolve(chatResponse);
  } catch(error) {
    return Promise.reject(`MistralAI thrown error:: ${ error }`);
  }
};

/**
 * Connects to the Mistral AI embeddings API and generates embeddings
 * for the provided input strings.
 *
 * @param inputs - An array of input strings to generate embeddings for.
 * @returns A Promise that resolves to the ChatCompletionResponse object
 *          returned by the Mistral AI embeddings API.
 * @throws An error if there is an issue connecting to the Mistral AI embeddings API.
 */
export const embedConnect = async (inputs) => {
  try {
    const embeddingResponse = await mistral.embeddings.create({
      model: LLMs.MISTRAL_AI_EMBED_LLM ?? null,
      inputs: inputs,
    });
    return Promise.resolve(embeddingResponse);
  } catch(error) {
    return Promise.reject(`MistralAi thrown error:: ${ error }`);
  }
};


