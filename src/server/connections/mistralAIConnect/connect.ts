// src/server/commections/mistralAIConnect/connect.ts

'use strict';

import { Mistral } from "@mistralai/mistralai";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components/chatcompletionresponse";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.MISTRAL_AI_API_KEY;

export const client: Mistral = new Mistral({ apiKey: apiKey });

export const chatConnect = async (prompt: string): Promise<string> => {
  const chatResponse: ChatCompletionResponse = await client.chat.complete({
    model: LLMs.MISTRAL_CHAT_LLM ?? null,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const nullMessage = 'Mistral AI fails to return an answer!';

  if (!chatResponse?.choices?.length) {
    return Promise.reject(nullMessage);
  }

  return Promise.resolve(chatResponse.choices[0].message.content ?? nullMessage);
};

export const embedConnect = async (inputs: string[]) : Promise<ChatCompletionResponse> => {
  const embeddingResponse: ChatCompletionResponse = await client.embeddings.create({
    model: LLMs.MISTRAL_EMBED_LLM?? null,
    inputs: inputs,
  });

  const nullMessage = 'Mistral AI fails to return any embedding!';

  if (Object.keys(embeddingResponse).length < 1) {
    return Promise.reject(nullMessage);
  }

  return Promise.resolve(embeddingResponse);
};


