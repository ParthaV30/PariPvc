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

  // Replace sendprofileDataToUrl to directly load profiles
  const regex = /const sendprofileDataToUrl = (?:async\s*)?\(\) => {[\s\S]*?setCalcBtn\(true\);[\s\S]*?if \([\s\S]*?openModal\(\);[\s\S]*?} else {[\s\S]*?handleContinueCalc\(\);[\s\S]*?setCalcBtn\(false\);[\s\S]*?setIsProfile\(true\);[\s\S]*?addDef\(\);[\s\S]*?}[\s\S]*?};/;

  const replacement = `const sendprofileDataToUrl = () => {
    setCalcBtn(true);
    try {
      handleContinueCalc();
    } catch (e) {
      console.warn('handleContinueCalc error:', e);
    }
    setCalcBtn(false);
    setIsProfile(true);
    try {
      addDef();
    } catch (e) {
      console.warn('addDef error:', e);
    }
  };`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully patched sendprofileDataToUrl in: ${file}`);
  } else {
    // Check if simple pattern
    const regexSimple = /const sendprofileDataToUrl = (?:async\s*)?\(\) => {[\s\S]*?setIsProfile\(true\);[\s\S]*?};/;
    if (regexSimple.test(content)) {
      content = content.replace(regexSimple, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully patched (simple) in: ${file}`);
    } else {
      console.warn(`Pattern did not match in: ${file}`);
    }
  }
});

console.log('Finished updating sendprofileDataToUrl.');
