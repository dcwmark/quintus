// src/server/index.js

'use strict';

import cors from 'cors';
import express from 'express';
import http from 'http';
import httpStatusCodes from 'http-status-codes';

import 'dotenv/config';

import apiRoutes from '#srcRoutes/apiRoutes.js';
import WebSocketClients from './services/WebSocketClients.js';

const app = express();
const server = http.createServer(app);
WebSocketClients(server);

const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// File upload configuration
// const upload = multer({ 
//   dest: 'uploads/',
//   limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
// });

/** api routes registrar */
apiRoutes(app);
/* --------------------- */


// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎤 Transcription API: http://localhost:${PORT}/api/transcribe`);
  console.log(`🤖 Query API: http://localhost:${PORT}/api/query`);
  console.log(`🔊 Speech API: http://localhost:${PORT}/api/speak`);
  console.log(`📁 Documents API: http://localhost:${PORT}/api/documents`);
});
