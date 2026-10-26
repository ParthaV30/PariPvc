const fs = require('fs');
const path = require('path');

async function extract() {
  console.log('Fetching main.48df3fc9.js.map...');
  const res = await fetch('https://saalaram.app/static/js/main.48df3fc9.js.map');
  const mapData = await res.json();

  const outDir = path.resolve(__dirname, 'extracted-source');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Processing ${mapData.sources.length} sources...`);
  let extractedCount = 0;

  for (let i = 0; i < mapData.sources.length; i++) {
    const rawSource = mapData.sources[i];
    const content = mapData.sourcesContent ? mapData.sourcesContent[i] : null;

    if (!content) continue;

    // Strip webpack:// and query strings
    let clean = rawSource.replace(/^webpack:\/\/[^\/]*\//, '');
    clean = clean.replace(/\?.*$/, ''); // strip query string e.g. ?236e

    // Replace invalid windows chars in path components
    const parts = clean.split(/[/\\]/).filter(p => p !== '' && p !== '.');
    // Replace .. with _parent_ so it stays inside outDir
    const safeParts = parts.map(part => {
      if (part === '..') return '_parent_';
      return part.replace(/[:*?"<>|]/g, '_');
    });

    const targetFile = path.join(outDir, ...safeParts);
    const targetDir = path.dirname(targetFile);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, content, 'utf8');
    extractedCount++;
  }

  console.log(`Successfully extracted ${extractedCount} source files into ${outDir}`);
}

extract().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
