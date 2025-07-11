// src/services/graphEngine.js
// ★ Moteur minimal pour stocker et interroger un graphe en mémoire (JSON)
// Pour la V1 on reste en mémoire ; tu pourras brancher Neo4j plus tard.

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/orgGraph.json');

// charge le graphe depuis disque ou crée un squelette vide
function loadGraph() {
  if (!fs.existsSync(DATA_PATH)) {
    return { nodes: [], edges: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

// sauvegarde le graphe en JSON
function saveGraph(graph) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(graph, null, 2));
}

// ajoute (ou fusionne) un nœud
function addNode(type, attrs = {}) {
  const graph = loadGraph();
  const id = attrs.id || `${type}_${Date.now()}`;
  if (!graph.nodes.find(n => n.id === id)) {
    graph.nodes.push({ id, type, ...attrs });
    saveGraph(graph);
  }
  return id;
}

// ajoute une arête (relation)
function addEdge(source, relation, target) {
  const graph = loadGraph();
  const exists = graph.edges.find(e => e.source === source && e.relation === relation && e.target === target);
  if (!exists) {
    graph.edges.push({ source, relation, target });
    saveGraph(graph);
  }
}

// requête simple : trouver tous les nœuds d’un type
function findNodesByType(type) {
  const graph = loadGraph();
  return graph.nodes.filter(n => n.type === type);
}

// requête simple : projets sans lead
function projectsWithoutLead() {
  const graph = loadGraph();
  const leads = new Set(graph.edges.filter(e => e.relation === 'lead_of').map(e => e.target));
  return graph.nodes.filter(n => n.type === 'Projet' && !leads.has(n.id));
}

module.exports = {
  loadGraph,
  addNode,
  addEdge,
  findNodesByType,
  projectsWithoutLead,
};
