// src/constants/apiKeys.ts

'use strict';

import 'dotenv/config';

export const API_KEYS = {
  MISTRAL_AI_API_KEY: process.env.MISTRAL_AI_API_KEY ?? '',
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY ?? '',
};
