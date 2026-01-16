// src/server/routes/apiRoutes.js

'use strict';

import transcriptionRouter from '#srcRoutes/transcription.js';
import queryRouter from '#srcRoutes/query.js';
import speechRouter from '#srcRoutes/speech.js';
import documentsRouter from '#srcRoutes/documents.js';

const routeMap = {
  'POST /api/transcribe': transcriptionRouter,
  'POST /api/query': queryRouter,
  'POST /api/speak': speechRouter,
  'POST /api/upload': documentsRouter,
};

const apiRoutes = (app) => {
  ((app, map) => {
    // Register API routes
    Object.entries(map).forEach(([key, handler]) => {
      const [method, path] = key.split(' ');
      app[method.toLowerCase()](path, handler);
      
      console.log(`Registered API route: ${method.toUpperCase()} ${path}`);
    });
  })(app, routeMap);
};

export default apiRoutes;

