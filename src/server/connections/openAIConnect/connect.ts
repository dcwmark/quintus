// src/server/commections/openAIConnect/connect.ts

'use strict';

import OpenAI from "openai";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.OPEN_AI_API_KEY;

export const openai = new OpenAI({ apiKey: apiKey});

export const chatConnect = async (prompt: string) : Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  try {
    const chatResponse: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        model: LLMs.OPEN_AI_CHAT_LLM,
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


