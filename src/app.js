require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route handlers
const ingestRoute = require('./routes/ingest');
const queryRoute = require('./routes/query');
const rulesRoute = require('./routes/rules');
const aiRoute = require('./routes/ai');

const app = express();

// ────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static assets (frontend)
app.use(express.static('public'));

// ────────────────────────────────────────────────────────────
// API routes
// ────────────────────────────────────────────────────────────
app.use('/api/ingest', ingestRoute);   // Upload & parsing docs
app.use('/api/query', queryRoute);     // Queries to graph / FAISS
app.use('/api/rules', rulesRoute);     // Logical rule checks
app.use('/api/ai', aiRoute);           // GPT fallback / structuration

// Health‑check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ────────────────────────────────────────────────────────────
// Server start
// ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CortexOrg server is running on port ${PORT}`);
});

module.exports = app;
