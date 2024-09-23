// src/constants/apiKeys.ts

'use strict';

import 'dotenv/config';

export const API_KEYS = {
  GEMINI_AI_API_KEY: process.env.GEMINI_AI_API_KEY ?? '',
  MISTRAL_AI_API_KEY: process.env.MISTRAL_AI_API_KEY ?? '',
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY ?? '',
};
