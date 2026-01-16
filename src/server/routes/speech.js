// src/server/routes/speech.js

'use strict';
import express from 'express';
import fs from 'fs/promises';
import gtts from 'node-gtts';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/speak', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      return res.status(400).json(
        { error: 'Text is required' }
      );
    }

    console.log(
      'Generating speech for text:',
      text.substring(0, 100) + '...');

    const tts = gtts(language);
    const filename = `speech_${uuidv4()}.mp3`;
    const filepath = path.join('uploads', filename);

    // Generate speech
    await new Promise((resolve, reject) => {
      tts.save(filepath, text, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Read the generated audio file
    const audioBuffer = await fs.readFile(filepath);

    // Clean up the temporary file
    await fs.unlink(filepath).catch(console.error);

    // Send audio as response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ 
      error: 'Speech generation failed',
      message: error.message 
    });
  }
});

export default router;

