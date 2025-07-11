// src/services/ruleEngine.js
const { loadGraph } = require('./graphEngine');

function ruleOffersWithoutContact(graph) {
  const alerts = [];
  const offers = graph.nodes.filter(n => n.type === 'OffreEmploi');
  offers.forEach((offer) => {
    const linked = graph.edges.find(
      e => e.source === offer.id && e.relation === 'validated_by'
    );
    if (!linked) {
      alerts.push({
        severity: 'warning',
        rule: 'offer_without_contact',
        message: `Offre ${offer.name || offer.id} sans contact référent.`,
      });
    }
  });
  return alerts;
}

function ruleProjectLibNoMaintainer(graph) {
  const alerts = [];
  const deps = graph.edges.filter(e => e.relation === 'dépend_de');
  deps.forEach((edge) => {
    const maintainer = graph.edges.find(
      e =>
        e.relation === 'maintient' &&
        e.target === edge.target
    );
    if (!maintainer) {
      alerts.push({
        severity: 'critical',
        rule: 'lib_without_maintainer',
        message: `La librairie ${edge.target} n’a pas de mainteneur (dépendance de ${edge.source}).`,
      });
    }
  });
  return alerts;
}

function runAllRules() {
  const graph = loadGraph();
  return [
    ...ruleOffersWithoutContact(graph),
    ...ruleProjectLibNoMaintainer(graph),
  ];
}

module.exports = { runAllRules };
