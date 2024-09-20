// src/server/commections/mistralAIConnect/connect.ts

'use strict';

import { Mistral } from "@mistralai/mistralai";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components/chatcompletionresponse";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.MISTRAL_AI_API_KEY;

export const mistral: Mistral = new Mistral({ apiKey: apiKey });

export const chatConnect = async (prompt: string): Promise<ChatCompletionResponse> => {
  try {
    const chatResponse: ChatCompletionResponse = await mistral.chat.complete({
      model: LLMs.MISTRAL_CHAT_LLM ?? null,
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

export const embedConnect = async (inputs: string[]) : Promise<ChatCompletionResponse> => {
  try {
    const embeddingResponse: ChatCompletionResponse = await mistral.embeddings.create({
      model: LLMs.MISTRAL_EMBED_LLM?? null,
      inputs: inputs,
    });
    return Promise.resolve(embeddingResponse);
  } catch(error) {
    return Promise.reject(`MistralAi thrown error:: ${ error }`);
  }
};


