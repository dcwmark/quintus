// src/server/index.ts

'use strict';

import { API_KEYS } from "../constants/apiKeys";
import { API_URLS } from "../constants/apiUrls";
import axios from "axios";
import 'dotenv/config';

const mistralApiKey = API_KEYS.MISTRAL_AI_API_KEY;
const mistralApiUrl = API_URLS.MISTRAL_AI_API_URL;
console.debug(`const mistralApiKey:: ${mistralApiKey}`);
console.debug(`const mistralApiUrl:: ${mistralApiUrl}`);
console.debug(`env mistralApiKey:: ${process.env.mistralApiKey}`);
console.debug(`env mistralApiUrl:: ${process.env.mistralApiUrl}`);

const generateText = async (prompt: string): Promise<string | null> => {
  try {
    const response = await axios.post(`${process.env.mistralApiUrl}/generate`, {
      prompt: prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.mistralApiKey}`
      }
    });

    return response.data.text;
  } catch (error) {
    console.error(`Error generating text:: `, error);
    return null;
  }
};

const prompt = "Write a sonnet about a robot who dreams of becoming a gardener.";
generateText(prompt)
  .then(text => console.log(text))



