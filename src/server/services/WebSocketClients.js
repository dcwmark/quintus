// src/server/services/WebSocketClients.js

'use strict';

import { WebSocketServer } from 'ws';

export const clients = new Set();
const WebSocketClients = (server) => {
  const wss = new WebSocketServer({ server });

  // WebSocket handling
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New WebSocket connection established');
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket connection closed');
    });
  });
};

export default WebSocketClients;

