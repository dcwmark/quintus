// src/server/routes/index.js

'use strict';

import express from 'express';
import multer from 'multer';
import { InferenceClient } from '@huggingface/inference';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export default router;
