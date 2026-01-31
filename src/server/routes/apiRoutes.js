// src/server/routes/apiRoutes.js

'use strict';

import documentsRouter from '#srcRoutes/documents.js';
import queryRouter from '#srcRoutes/query.js';
import speechRouter from '#srcRoutes/speech.js';
import transcriptionRouter from '#srcRoutes/transcription-transformers.js';

const apiRoutes = (app) => {
  app.use('/api', documentsRouter);
  app.use('/api', queryRouter);
  app.use('/api', speechRouter);
  app.use('/api', transcriptionRouter);
};

export default apiRoutes;

