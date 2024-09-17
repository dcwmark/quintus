// src/server/index.ts

'use strict';

import axios from "axios";
import 'dotenv/config';

import { API_KEYS } from "../constants/apiKeys";
import { API_URLS } from "../constants/apiUrls";

const mistralApiKey = API_KEYS.MISTRAL_AI_API_KEY;
const mistralApiUrl = API_URLS.MISTRAL_AI_API_URL;
console.debug(`const mistralApiKey:: ${mistralApiKey}`);
console.debug(`const mistralApiUrl:: ${mistralApiUrl}`);
console.debug(`env mistralApiKey:: ${process.env[mistralApiKey]}`);
console.debug(`env mistralApiUrl:: ${process.env[mistralApiUrl]}`);



