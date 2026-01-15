// src/server/index.js

'use strict';

import cors from 'cors';
import express from 'express';
import http from 'http';
import httpStatusCodes from 'http-status-codes';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

import 'dotenv/config';

import apiRoutes from '#srcRoutes/index.js';
// import { MultiAgentRAG } from '#srcServices/MultiAgentRAG.js'

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// File upload configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Initialize Multi-Agent RAG System
// const multiAgentRAG = new MultiAgentRAG();

// WebSocket connections store
const clients = new Set();

// WebSocket handling
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New WebSocket connection established');
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed');
  });
});


// Broadcast function for agent updates
export const broadcastToClients = (data) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

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
