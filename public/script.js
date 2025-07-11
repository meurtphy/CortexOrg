// Handle ingestion
document.getElementById('btnIngest').addEventListener('click', async () => {
  const text = document.getElementById('inputText').value.trim();
  if (!text) return;

  document.getElementById('ingestStatus').textContent = 'Analyse en cours...';

  try {
    const res = await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceType: 'DOC' })
    });
    const data = await res.json();
    document.getElementById('ingestStatus').textContent =
      res.ok ? `✅ Insertion de ${data.inserted} triplets.` : `❌ ${data.error}`;
  } catch (err) {
    document.getElementById('ingestStatus').textContent = '❌ Erreur réseau';
  }
});

// Handle quick actions
document.querySelectorAll('.action').forEach(btn => {
  btn.addEventListener('click', async () => {
    const endpoint = btn.dataset.endpoint;
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      showResult(data);
    } catch (err) {
      showResult({ error: 'fetch_failed' });
    }
  });
});

function showResult(obj) {
  const box = document.getElementById('resultBox');
  const pre = document.getElementById('resultPre');
  pre.textContent = JSON.stringify(obj, null, 2);
  box.hidden = false;
}
