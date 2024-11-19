// src/server/commections/openAIConnect/connect.ts

'use strict';

import OpenAI from "openai";
import { ChatCompletion, CreateEmbeddingResponse } from "openai/resources";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.OPEN_AI_API_KEY;

export const openai = new OpenAI({ apiKey: apiKey});

/**
 * Sends a chat completion request to the OpenAI API and returns the response.
 *
 * @param prompt - The prompt to send to the OpenAI API for chat completion.
 * @returns A Promise that resolves to the ChatCompletion response from the OpenAI API.
 */
export const chatConnect = async (prompt: string) : Promise<ChatCompletion> => {
  try {
    const chatResponse: ChatCompletion =
      await openai.chat.completions.create({
        model: LLMs.OPEN_AI_CHAT_LLM ?? null,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });
    return Promise.resolve(chatResponse);
  } catch(error) {
    return Promise.reject(`OpenAi thrown error:: ${ error }`);
  } 
};

/**
 * Sends an embedding request to the OpenAI API and returns the response.
 *
 * @param inputs - An array of strings to generate embeddings for.
 * @returns A Promise that resolves to the CreateEmbeddingResponse from the OpenAI API.
 */
export const embedConnect = async (inputs: string[]): Promise <CreateEmbeddingResponse> => {
  try {
    const embeddingResponse: CreateEmbeddingResponse = await openai.embeddings.create({
      model: LLMs.OPEN_AI_EMBED_LLM,
      input: inputs,
    });
    return Promise.resolve(embeddingResponse)
  } catch(error) {
    return Promise.reject(`OpenAi thrown error:: ${ error }`);
  }
};
