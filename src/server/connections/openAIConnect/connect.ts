// src/server/commections/openAIConnect/connect.ts

'use strict';

import OpenAI from "openai";
import { ChatCompletion, CreateEmbeddingResponse } from "openai/resources";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.OPEN_AI_API_KEY;

export const openai = new OpenAI({ apiKey: apiKey});

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
