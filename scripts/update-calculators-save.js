const fs = require('fs');
const path = require('path');

const creationFiles = [
  'casementWindow.js',
  'casementDoor.js',
  'slidingWindow.js',
  'slidingDoor.js',
  'ventilators.js',
  'fixed.js',
  'topHung.js'
];

const editFiles = [
  'editcasementWindow.js',
  'editcasementDoor.js',
  'editslidingWindow.js',
  'editslidingDoor.js',
  'editventilator.js',
  'editFixed.js',
  'editTopHung.js'
];

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

// Process creation calculators
creationFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add import if missing
  if (!content.includes('saveQuoteItem')) {
    content = content.replace(/(import axios from 'axios';)/, `$1\nimport { saveQuoteItem } from '../services/dbService';`);
  }

  // 2. Replace sendDataToUrl
  const regex = /const sendDataToUrl = async \(\) => {[\s\S]*?navigate\(selectPath\);[\s\S]*?};/;
  const replacement = `const sendDataToUrl = async () => {
    try { fetchDatalog(); } catch (e) {}
    try {
      await saveQuoteItem(coreData);
    } catch (err) {
      console.warn('saveQuoteItem fallback:', err);
    }
    try {
      await axios.post('https://upvcapi.sninfoserv.com/quotes/', { coreData });
    } catch (error) {
      // API fallback
    }
    navigate(\`/quotesdet?id=\${quoteId || coreData.quoteId}\`);
  };`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated creation calculator: ${file}`);
  } else {
    console.warn(`Regex did not match in creation file: ${file}`);
  }
});

// Process edit calculators
editFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('saveQuoteItem')) {
    content = content.replace(/(import axios from 'axios';)/, `$1\nimport { saveQuoteItem } from '../services/dbService';`);
  }

  const regex = /const sendDataToUrl = async \(\) => {[\s\S]*?navigate\(`\/quotesdet\?id=\${quoteIds}`\);[\s\S]*?};/;
  const replacement = `const sendDataToUrl = async () => {
    try { fetchDatalog(); } catch (e) {}
    try {
      await saveQuoteItem(coreData);
    } catch (err) {
      console.warn('saveQuoteItem fallback:', err);
    }
    try {
      await axios.post('https://upvcapi.sninfoserv.com/edit-quote/', { coreData });
    } catch (error) {
      // API fallback
    }
    navigate(\`/quotesdet?id=\${quoteIds || quoteId || coreData.quoteId}\`);
  };`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated edit calculator: ${file}`);
  } else {
    console.warn(`Regex did not match in edit file: ${file}`);
  }
});

console.log('Finished updating calculators.');
