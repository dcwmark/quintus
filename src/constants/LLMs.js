// src/constants/LLMs.ts

'use strict';

import 'dotenv/config';

export const LLMs = {
  GEMINI_AI_CHAT_LLM: process.env.GEMINI_AI_CHAT_LLM ?? '',
  GEMINI_AI_EMBED_LLM: process.env.GEMINI_AI_EMBED_LLM ?? '',
  MISTRAL_AI_CHAT_LLM: process.env.MISTRAL_AI_CHAT_LLM ?? '',
  MISTRAL_AI_EMBED_LLM: process.env.MISTRAL_AI_EMBED_LLM ?? '',
  OPEN_AI_CHAT_LLM: process.env.OPEN_AI_CHAT_LLM ?? '',
  OPEN_AI_EMBED_LLM: process.env.OPEN_AI_EMBED_LLM ?? '',
};

