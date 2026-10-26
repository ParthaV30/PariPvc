const fs = require('fs');
const path = require('path');

async function extractCss() {
  console.log('Fetching main.e22c4a74.css.map...');
  const res = await fetch('https://saalaram.app/static/css/main.e22c4a74.css.map');
  const mapData = await res.json();

  console.log(`Sources in CSS map: ${mapData.sources.length}`);
  console.log('Sample sources:', mapData.sources.slice(0, 10));

  for (let i = 0; i < mapData.sources.length; i++) {
    const raw = mapData.sources[i];
    const content = mapData.sourcesContent ? mapData.sourcesContent[i] : null;
    if (!content) continue;

    console.log(`Source ${i}: ${raw}`);
    // Save to extracted-source
    let clean = raw.replace(/^webpack:\/\/[^\/]*\//, '');
    clean = clean.replace(/\?.*$/, '');
    const parts = clean.split(/[/\\]/).filter(p => p !== '' && p !== '.');
    const safeParts = parts.map(part => {
      if (part === '..') return '_parent_';
      return part.replace(/[:*?"<>|]/g, '_');
    });

    const targetFile = path.join(__dirname, 'extracted-source', ...safeParts);
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`Saved CSS: ${targetFile}`);
  }
}

extractCss().catch(console.error);
