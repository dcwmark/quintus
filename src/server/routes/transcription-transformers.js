// src/server/routes/transaction-transformers.js

'use strict';

import express from 'express';
import fs from 'fs/promises';
import httpStatusCodes from 'http-status-codes';
import multer from 'multer';
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// Set the ffmpeg path to use the bundled binary
ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize the pipeline once (cached)
let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    console.log('Loading Whisper model locally...');
    transcriber = await pipeline(
      'automatic-speech-recognition',
      // 'Xenova/whisper-small',
      'Xenova/whisper-tiny',
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
  console.log('Input file path:', filePath);
  
  // Convert to WAV format first
  console.time('WAV conversion');
  const wavPath = await convertToWav(filePath);
  console.timeEnd('WAV conversion');
  console.log('WAV file created at:', wavPath);
  
  try {
    // Read the WAV file as a buffer
    const audioBuffer = await fs.readFile(wavPath);
    console.log('Audio buffer size:', audioBuffer.length, 'bytes');
    
    // Create WAV file handler
    const wav = new wavefile.WaveFile(audioBuffer);
    
    console.log('WAV details:', {
      sampleRate: wav.fmt.sampleRate,
      numChannels: wav.fmt.numChannels,
      bitDepth: wav.bitDepth,
      duration: wav.data.samples.length / wav.fmt.sampleRate / wav.fmt.numChannels
    });
    
    // Get the samples
    const samples = wav.getSamples();
    console.log('Samples type:', samples?.constructor?.name);
    console.log('Samples length:', samples?.length);
    
    // If samples is an array of channels, take the first channel
    let audioData = Array.isArray(samples) ? samples[0] : samples;
    console.log('Audio data type:', audioData?.constructor?.name);
    console.log('Audio data length:', audioData?.length);
    
    // Check if audio has actual content (not all zeros/silence)
    const sampleCheck = audioData.slice(0, 100);
    const hasContent = Array.from(sampleCheck).some(val => Math.abs(val) > 0.01);
    console.log('Audio has content:', hasContent);
    console.log('Sample values (first 10):', Array.from(audioData.slice(0, 10)));
    
    // Convert to Float32Array
    let float32Data;
    
    if (audioData instanceof Float32Array) {
      float32Data = audioData;
    } else if (audioData instanceof Float64Array) {
      float32Data = new Float32Array(audioData);
    } else if (audioData instanceof Int16Array) {
      float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = audioData[i] / 32768.0;
      }
    } else if (audioData instanceof Int8Array) {
      float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = audioData[i] / 128.0;
      }
    } else if (audioData instanceof Uint8Array) {
      float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = (audioData[i] - 128) / 128.0;
      }
    } else if (Array.isArray(audioData)) {
      float32Data = new Float32Array(audioData);
    } else {
      throw new Error(`Unsupported audio data format: ${audioData?.constructor?.name}`);
    }
    
    console.log('Final Float32Array length:', float32Data.length);
    console.log('Final sample values (first 10):', Array.from(float32Data.slice(0, 10)));
    
    // Clean up the converted WAV file
    await fs.unlink(wavPath).catch(console.error);
    
    return float32Data;
  } catch (error) {
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
    console.time('Model loading');
    const transcriber = await getTranscriber();
    console.timeEnd('Model loading');
    
    // Process the audio file to get Float32Array
    console.log('Converting audio file...');
    console.time('Audio conversion');
    const waveform = await processAudioFile(req.file.path);
    console.timeEnd('Audio conversion');
    console.log('Audio converted, length:', waveform.length, 'samples (~', Math.round(waveform.length / 16000), 'seconds)');

    // Transcribe (this happens locally!)
    console.log('Starting transcription...');
    console.time('Transcription');

    const result = await transcriber(waveform, {
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true,
      language: 'en',
      task: 'transcribe',
      // Add callback to see progress
      callback_function: (beams) => {
        console.log('Transcription progress:', beams);
      }
    });
    
    console.timeEnd('Transcription');

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
    console.error('Error stack:', error.stack);

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

