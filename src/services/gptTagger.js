// src/services/gptTagger.js
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 *  tagger(text, sourceType)  →  Promise<Triplet[]>
 *  Triplet = [ {id?, type, name, ...}, relation, {id?, type, name, ...} ]
 */
module.exports = async function gptTagger(rawText = '', source = 'DOC') {
  // 1. Prompt de structuration
  const prompt = `
Tu es un extracteur d'information pour un graphe de connaissance interne.
Source: ${source}

Texte:
"""
${rawText}
"""

Consignes:
1. Identifie les entités (Personne, Projet, OffreEmploi, Équipe, Lib, Document, Compétence, CultureÉquipe, Département).
2. Identifie les relations pertinentes (travaille_sur, maintient, dépend_de, fait_partie_de, version_de, poste_associe_a, utilise, conflit_avec, etc.).
3. Retourne uniquement une liste JSON de triplets sous la forme:
[
  { "subject": { "type": "...", "name": "..." },
    "relation": "...",
    "object":  { "type": "...", "name": "..." } }
]
Pas de commentaire, pas d'explication.`;

  // 2. Appel GPT-3.5 / GPT-4 (tu peux choisir le modèle)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  // 3. Parse la réponse
  let triplets = [];
  try {
    triplets = JSON.parse(response.choices[0].message.content.trim())
      .map(t => [
        { type: t.subject.type, name: t.subject.name },
        t.relation,
        { type: t.object.type,  name: t.object.name },
      ]);
  } catch (err) {
    console.error('GPT parse error', err);
  }

  return triplets;
};
