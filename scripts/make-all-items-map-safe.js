const fs = require('fs');
const path = require('path');

const files = [
  'casementWindow.js',
  'casementDoor.js',
  'slidingWindow.js',
  'slidingDoor.js',
  'ventilators.js',
  'fixed.js',
  'topHung.js',
  'editcasementWindow.js',
  'editcasementDoor.js',
  'editslidingWindow.js',
  'editslidingDoor.js',
  'editventilator.js',
  'editFixed.js',
  'editTopHung.js'
];

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any .items.map with ?.items?.map
  const updated = content
    .replace(/(\w+)\.items\.map\(/g, '$1?.items?.map(')
    .replace(/(\w+)\?\.items\.map\(/g, '$1?.items?.map('); // avoid duplication

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Made items.map safe in: ${file}`);
  }
});

console.log('Finished making items.map safe.');
