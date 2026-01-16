// src/server/routes/query.js

'use strict';

import express from 'express';
import httpStatusCodes from 'http-status-codes';
import WebSocket from 'ws';

import { MultiAgentRAG } from '#srcServices/MultiAgentRAG.js'
import { clients } from '#srcServices/WebSocketClients.js';

const router = express.Router();

// Initialize Multi-Agent RAG System
const multiAgentRAG = new MultiAgentRAG();

// Broadcast function for agent updates
export const broadcastToClients = (data) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(httpStatusCodes.NOT_FOUND)
                .json({ error: 'Query is required' });
    }

    console.log('Processing query:', query);

    // Process query through multi-agent system
    const result =
      await multiAgentRAG.processQuery(query, broadcastToClients);

    res.json({
      response: result.response,
      sources: result.sources,
      agents_used: result.agentsUsed,
      processing_time: result.processingTime
    });
  } catch (error) {
    console.error('Query processing error:', error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: 'Query processing failed',
        message: error.message 
      });
  }
});

export default router;

