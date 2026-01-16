// src/server/routes/transaction.js

'use strict';

import express from 'express';
import fs from 'fs/promises';
import httpStatusCodes from 'http-status-codes';
import multer from 'multer';
import { InferenceClient } from '@huggingface/inference';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatusCodes.NOT_FOUND)
                .json({ error: 'No audio file provided' });
    }

    console.log('Processing audio file:', req.file.filename);
    
    // Read the uploaded audio file
    const audioBuffer = await fs.readFile(req.file.path);
    
    // Use Hugging Face Whisper for transcription
    const result = await hf.automaticSpeechRecognition({
      data: audioBuffer,
      model: 'openai/whisper-base',
      provider: 'hf-inference',
    });

    // Clean up uploaded file
    await fs.unlink(req.file.path).catch(console.error);

    const transcribedText = result.text || '';
    console.log('Transcription result:', transcribedText);

    res.json({ 
      text: transcribedText,
      confidence: result.confidence || 0.9
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: 'Transcription failed',
        message: error.message 
      });
  }
});

export default router;
