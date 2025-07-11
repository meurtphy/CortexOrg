// src/routes/ingest.js
const express = require('express');
const router = express.Router();
const { addNode, addEdge } = require('../services/graphEngine');
const gptTagger = require('../services/gptTagger');

// POST /api/ingest
// Body : { text: "...", sourceType: "RH" | "DOC" | ... }
router.post('/', async (req, res) => {
  try {
    const { text = '', sourceType = 'DOC' } = req.body;

    // 1. appeler ChatGPT pour extraire les triplets
    const triplets = await gptTagger(text, sourceType);

    // 2. insérer dans le graphe
    triplets.forEach(([subj, rel, obj]) => {
      const subjId = addNode(subj.type, subj);
      const objId  = addNode(obj.type,  obj);
      addEdge(subjId, rel, objId);
    });

    res.json({ status: 'ok', inserted: triplets.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ingest_failed' });
  }
});

module.exports = router;
