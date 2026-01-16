// src/server/routes/documents.js

'use strict';

import csv from 'csv-parser';
import express from 'express';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import httpStatusCodes from 'http-status-codes';
import mammoth from 'mammoth';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatusCodes.NOT_FOUND)
                .json({
                  error: 'No document provided'
                });
    }

    const { originalname, mimetype, path: filepath } = req.file;
    let content = '';

    console.log('Processing document:', originalname);

    // Extract text based on file type
    if (mimetype === 'application/pdf') {
      const buffer = await fs.readFile(filepath);
      const data = await new PDFParse(buffer);
      content = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = await fs.readFile(filepath);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else if (mimetype === 'text/csv') {
      const rows = [];
      await new Promise((resolve, reject) => {
        createReadStream(filepath)
          .pipe(csv())
          .on('data', (row) => rows.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
      content = JSON.stringify(rows, null, 2);
    } else if (mimetype === 'text/plain') {
      content = await fs.readFile(filepath, 'utf-8');
    } else {
      await fs.unlink(filepath).catch(console.error);
      return res.status(httpStatusCodes.NOT_FOUND)
                .json({ error: 'Unsupported file type' });
    }

    // Clean up uploaded file
    await fs.unlink(filepath).catch(console.error);

    // TODO: Add document to vector store
    console.log('Document processed, content length:', content.length);

    res.json({
      message: 'Document uploaded and processed successfully',
      filename: originalname,
      contentLength: content.length
    });
  } catch (error) {
    console.error('Document processing error:', error);
    
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
      error: 'Document processing failed',
      message: error.message 
    });
  }
});

export default router;
