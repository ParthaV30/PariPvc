const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'src', 'pages');
const imgDir = path.resolve(__dirname, 'src', 'images');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.js'));

const referencedImages = new Map();

for (const file of files) {
  const code = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const matches = code.matchAll(/from\s+['"]\.\.\/images\/([^'"]+)['"]/g);
  for (const m of matches) {
    const imgName = m[1];
    if (!referencedImages.has(imgName)) referencedImages.set(imgName, []);
    referencedImages.get(imgName).push(file);
  }
}

console.log('All image imports across src/pages:');
for (const [img, fromFiles] of referencedImages.entries()) {
  const exists = fs.existsSync(path.join(imgDir, img));
  console.log(`- ${img}: exists = ${exists} (used in: ${fromFiles.join(', ')})`);
}
