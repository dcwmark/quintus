// src/constants/LLMs.ts

'use strict';

import 'dotenv/config';

export const LLMs = {
  MISTRAL_CHAT_LLM: process.env.MISTRAL_CHAT_LLM as string,
};
