const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const extractedDir = path.join(rootDir, 'extracted-source');

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying files from extracted-source to src...');
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

copyRecursive(path.join(extractedDir, 'App.js'), path.join(srcDir, 'App.js'));
copyRecursive(path.join(extractedDir, 'index.js'), path.join(srcDir, 'index.js'));
copyRecursive(path.join(extractedDir, 'App.css'), path.join(srcDir, 'App.css'));
copyRecursive(path.join(extractedDir, 'index.css'), path.join(srcDir, 'index.css'));
copyRecursive(path.join(extractedDir, 'images'), path.join(srcDir, 'images'));
copyRecursive(path.join(extractedDir, 'pages'), path.join(srcDir, 'pages'));

// Create reportWebVitals.js
fs.writeFileSync(path.join(srcDir, 'reportWebVitals.js'), `
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {});
  }
};
export default reportWebVitals;
`, 'utf8');

// Customization for "Pari and Co"
console.log('Customizing for store name "Pari and Co"...');

// 1. pages/index.js
const indexPath = path.join(srcDir, 'pages', 'index.js');
let indexCode = fs.readFileSync(indexPath, 'utf8');
indexCode = indexCode.replace(/Welcome to Saalaram UPVC App!/g, 'Welcome to Pari and Co UPVC App!');
indexCode = indexCode.replace(/demouser@saalaram\.com/g, 'demouser@pariandco.com');
// Ensure companyname session is Pari and Co by default
indexCode = indexCode.replace(
  'ReactSession.set("companyname", response.data.data.company_data.companyName );',
  'ReactSession.set("companyname", response.data.data?.company_data?.companyName || "Pari and Co" );'
);
if (!indexCode.includes('ReactSession.get("companyname")')) {
  indexCode = indexCode.replace(
    'ReactSession.setStoreType("localStorage");',
    'ReactSession.setStoreType("localStorage");\nif(!ReactSession.get("companyname")){ ReactSession.set("companyname", "Pari and Co"); }'
  );
} else {
  indexCode = indexCode.replace(
    'ReactSession.setStoreType("localStorage");',
    'ReactSession.setStoreType("localStorage");\nif(!ReactSession.get("companyname")){ ReactSession.set("companyname", "Pari and Co"); }'
  );
}
fs.writeFileSync(indexPath, indexCode, 'utf8');

// 2. pages/download.js
const downloadPath = path.join(srcDir, 'pages', 'download.js');
if (fs.existsSync(downloadPath)) {
  let downloadCode = fs.readFileSync(downloadPath, 'utf8');
  downloadCode = downloadCode.replace(/www\.saalaram\.app/g, 'www.pariandco.com');
  downloadCode = downloadCode.replace(/\{brandDatas && brandDatas\[0\]\.companyName\}/g, '{ (brandDatas && brandDatas[0]?.companyName) || "Pari and Co" }');
  downloadCode = downloadCode.replace(/\{brandDatas && brandDatas\[0\]\?\.companyName\}/g, '{ (brandDatas && brandDatas[0]?.companyName) || "Pari and Co" }');
  fs.writeFileSync(downloadPath, downloadCode, 'utf8');
}

// 3. pages/invoice.js
const invoicePath = path.join(srcDir, 'pages', 'invoice.js');
if (fs.existsSync(invoicePath)) {
  let invoiceCode = fs.readFileSync(invoicePath, 'utf8');
  invoiceCode = invoiceCode.replace(/\{brandDatas && brandDatas\[0\]\.companyName\}/g, '{ (brandDatas && brandDatas[0]?.companyName) || "Pari and Co" }');
  fs.writeFileSync(invoicePath, invoiceCode, 'utf8');
}

// 4. pages/cuttingSchedule.js
const cutPath = path.join(srcDir, 'pages', 'cuttingSchedule.js');
if (fs.existsSync(cutPath)) {
  let cutCode = fs.readFileSync(cutPath, 'utf8');
  cutCode = cutCode.replace(/\{brandDatas\?\.\[0\]\?\.companyName\}/g, '{ brandDatas?.[0]?.companyName || "Pari and Co" }');
  fs.writeFileSync(cutPath, cutCode, 'utf8');
}

// 5. pages/customCost.js
const customCostPath = path.join(srcDir, 'pages', 'customCost.js');
if (fs.existsSync(customCostPath)) {
  let ccCode = fs.readFileSync(customCostPath, 'utf8');
  ccCode = ccCode.replace(/\{brandDatas && brandDatas\[0\]\.companyName\}/g, '{ (brandDatas && brandDatas[0]?.companyName) || "Pari and Co" }');
  fs.writeFileSync(customCostPath, ccCode, 'utf8');
}

console.log('Setup of src/ with Pari and Co customization complete!');
