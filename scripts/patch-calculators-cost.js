const fs = require('fs');
const path = require('path');

const files = [
  'casementWindow.js',
  'slidingWindow.js',
  'casementDoor.js',
  'slidingDoor.js',
  'topHung.js',
  'ventilators.js',
  'fixed.js',
  'editcasementWindow.js',
  'editslidingWindow.js',
  'editcasementDoor.js',
  'editslidingDoor.js',
  'editTopHung.js',
  'editventilator.js',
  'editFixed.js'
];

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure costManager import
  if (!code.includes('costManager')) {
    code = `import { DEFAULT_COST_DATA, fetchCostDataService } from "../services/costManager";\n` + code;
  }

  // 2. Fix costData initial state
  code = code.replace(
    /const\s*\[\s*costData\s*,\s*setCostData\s*\]\s*=\s*useState\([^)]*\);/g,
    'const [costData, setCostData] = useState(DEFAULT_COST_DATA.data);'
  );

  // 3. Fix fetchcostData function
  code = code.replace(
    /const\s*fetchcostData\s*=\s*async\s*\(\)\s*=>\s*\{[\s\S]*?fetchcostData\(\);/g,
    `const fetchcostData = async () => {\n      try {\n        const cData = await fetchCostDataService(user);\n        setCostData(cData);\n      } catch (error) {\n        setCostData(DEFAULT_COST_DATA.data);\n      }\n    };\n\n    fetchcostData();`
  );

  // 4. Protect all Object.entries(variable) calls: Object.entries(foo) -> Object.entries(foo || {})
  code = code.replace(
    /Object\.entries\(\s*([a-zA-Z0-9_]+)\s*\)/g,
    (match, p1) => {
      return `Object.entries(${p1} || {})`;
    }
  );

  // Also catch Object.entries(costData && ... ) or similar if any
  code = code.replace(
    /Object\.entries\(\s*([a-zA-Z0-9_.]+\.[a-zA-Z0-9_]+)\s*\)/g,
    (match, p1) => {
      if (p1.includes('||')) return match;
      return `Object.entries(${p1} || {})`;
    }
  );

  // 5. Ensure seriesData items map/find safety
  // Replace .items. with ?.items?.
  code = code.replace(/(\bseriesData[a-zA-Z0-9_]*)\.items\./g, '$1?.items?.');
  code = code.replace(/(\bseriesData[a-zA-Z0-9_]*)\.items\b/g, '$1?.items');

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Successfully patched: ${file}`);
});
