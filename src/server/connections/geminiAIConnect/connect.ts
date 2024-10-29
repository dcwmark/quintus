// src/server/commections/geminiAIConnect/connect.ts

'use strict';

import { EmbedContentResponse, GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";

import { API_KEYS } from "../../../constants/apiKeys";
import { LLMs } from "../../../constants/LLMs";

const apiKey = API_KEYS.GEMINI_AI_API_KEY;

export const geminiai = new GoogleGenerativeAI(apiKey);
const model = geminiai.getGenerativeModel({ model: LLMs.GEMINI_AI_CHAT_LLM });

export const chatConnect = async (prompt: string) : Promise<GenerateContentResult> => {
  try {
    const chatResponse: GenerateContentResult = await model.generateContent([prompt]);
    return Promise.resolve(chatResponse);
  } catch(error) {
    return Promise.reject(`GeminiAi thrown error:: ${ error }`);
  } 
};

export const embedConnect = (inputs: string[]): Promise <EmbedContentResponse[]> => {
  const embeddingResponses: EmbedContentResponse[] = [];
  try {
    inputs.map(async (input) => {
      const embeddingResponse: EmbedContentResponse = await model.embedContent(input);
      embeddingResponses.push(embeddingResponse);
    });
    return Promise.resolve(embeddingResponses);
  } catch(error) {
    return Promise.reject(`GeminiAi thrown error:: ${ error }`);
  }
};
