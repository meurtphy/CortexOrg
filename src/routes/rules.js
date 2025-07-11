// src/routes/rules.js
const express = require('express');
const router = express.Router();
const { runAllRules } = require('../services/ruleEngine');

// GET /api/rules/run → renvoie toutes les alertes
router.get('/run', (_req, res) => {
  const alerts = runAllRules();
  res.json({ count: alerts.length, alerts });
});

module.exports = router;
