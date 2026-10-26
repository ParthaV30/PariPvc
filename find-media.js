const fs = require('fs');

async function findMedia() {
  const res = await fetch('https://saalaram.app/static/js/main.48df3fc9.js');
  const js = await res.text();

  const mediaMatches = js.matchAll(/static\/media\/[^"'\s\)]+/g);
  const found = new Set();
  for (const m of mediaMatches) {
    found.add(m[0]);
  }
  console.log('Found media files:', Array.from(found));
}

findMedia().catch(console.error);
