// src/server/routes/transaction-transformers.js

'use strict';

import express from 'express';
import fs from 'fs/promises';
import httpStatusCodes from 'http-status-codes';
import multer from 'multer';
import { pipeline } from '@xenova/transformers';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize the pipeline once (cached)
let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    console.log('Loading Whisper model locally...');
    transcriber = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-small',
      {
        // Model will be downloaded and cached locally
        cache_dir: './models',
        // Use WASM backend for CPU (or 'webgpu' if available)
        device: 'wasm'
      }
    );
    console.log('Xenova/whisper-small model loaded successfully!');
  }
  return transcriber;
}

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatusCodes.NOT_FOUND)
                .json({ error: 'No audio file provided' });
    }

    console.log('Processing audio file with Transformers.js:', req.file.filename);
    
    // Get the transcriber
    const transcriber = await getTranscriber();
    
    // Read the audio file
    const audioBuffer = await fs.readFile(req.file.path);
    
    // Transcribe (this happens locally!)
    const result = await transcriber(audioBuffer, {
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true
    });

    // Clean up uploaded file
    await fs.unlink(req.file.path).catch(console.error);

    const transcribedText = result.text || '';
    console.log('Local transcription result:', transcribedText);

    res.json({ 
      text: transcribedText,
      confidence: 0.9,
      method: 'transformers.js',
      chunks: result.chunks || []
    });

  } catch (error) {
    console.error('Transformers.js transcription error:', error);
    
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

