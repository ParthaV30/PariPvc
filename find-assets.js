const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, 'extracted-source', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const assetUrls = new Set();
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const matches = content.matchAll(/['"](assets\/[^'"]+)['"]/g);
  for (const m of matches) {
    assetUrls.add(m[1]);
  }
}
console.log('Referenced assets in pages:', Array.from(assetUrls));
