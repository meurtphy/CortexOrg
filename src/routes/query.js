// src/routes/query.js
const express = require('express');
const router = express.Router();
const {
  loadGraph,
  findNodesByType,
  projectsWithoutLead,
} = require('../services/graphEngine');

// ─────────────────────────────────────────────────────────────
// GET /api/query/projects-without-lead
router.get('/projects-without-lead', (_req, res) => {
  const result = projectsWithoutLead();
  res.json({ count: result.length, projects: result });
});

// GET /api/query/nodes?type=Personne
router.get('/nodes', (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ error: 'type param required' });
  res.json(findNodesByType(type));
});

// GET /api/query/graph → renvoie tout le graphe
router.get('/graph', (_req, res) => {
  res.json(loadGraph());
});

module.exports = router;
