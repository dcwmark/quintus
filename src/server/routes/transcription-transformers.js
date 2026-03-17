// src/server/routes/transaction-transformers.js

'use strict';

import express from 'express';
import fs from 'fs/promises';
import httpStatusCodes from 'http-status-codes';
import multer from 'multer';
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import ffmpeg from 'fluent-ffmpeg';

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
        // cache_dir: './models',
        // Use WASM backend for CPU (or 'webgpu' if available)
        // device: 'wasm'
        device: 'cpu'
      }
    );
    console.log('Xenova/whisper-small model loaded successfully!');
  }
  return transcriber;
}

async function convertToWav(inputPath) {
  const outputPath = `${inputPath}.wav`;
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .audioFrequency(16000)
      .audioChannels(1)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}

async function processAudioFile(filePath) {
  // Convert to WAV format first
  const wavPath = await convertToWav(filePath);
  
  
  try {
    // Read the WAV file as a buffer
    const audioBuffer = await fs.readFile(wavPath);
    
    // Create WAV file handler
    const wav = new wavefile.WaveFile(audioBuffer);
    
    // Get the samples as Float32Array
    const samples = wav.getSamples();
    
    // If samples is an array of channels, take the first channel
    const audioData = Array.isArray(samples) ? samples[0] : samples;
    
    // Ensure it's a Float32Array and normalize to [-1, 1] range if needed
    let float32Data;
    if (audioData instanceof Float32Array) {
      float32Data = audioData;
    } else if (audioData instanceof Int16Array) {
      // Convert Int16 to Float32 and normalize
      float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = audioData[i] / 32768.0;
      }
    } else {
      throw new Error('Unsupported audio data format');
    }
    
    // Clean up the converted WAV file
    await fs.unlink(wavPath).catch(console.error);
    
    return float32Data;
  } catch (error) {
    // Clean up the converted WAV file on error
    await fs.unlink(wavPath).catch(console.error);
    throw error;
  }
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
    
    // Process the audio file to get Float32Array
    const waveform = await processAudioFile(req.file.path);

    // Transcribe (this happens locally!)
    const result = await transcriber(waveform, {
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

