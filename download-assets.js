const fs = require('fs');
const path = require('path');

const baseUrl = 'https://saalaram.app/';

const files = [
  'favicon.ico',
  'assets/fonts/inter/inter.css',
  'assets/fonts/phosphor/duotone/style.css',
  'assets/fonts/tabler-icons.min.css',
  'assets/fonts/feather.css',
  'assets/fonts/fontawesome.css',
  'assets/fonts/material.css',
  'assets/css/style.css',
  'assets/css/style-preset.css',
  'assets/js/plugins/apexcharts.min.js',
  'assets/js/plugins/popper.min.js',
  'assets/js/plugins/simplebar.min.js',
  'assets/js/plugins/bootstrap.min.js',
  'assets/js/fonts/custom-font.js',
  'assets/js/pcoded.js',
  'assets/js/plugins/feather.min.js',
  'assets/images/saalaram.png',
  'assets/images/sni-logo.png',
  'assets/images/gpay.png',
  'static/css/main.e22c4a74.css'
];

async function download() {
  const publicDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const relPath of files) {
    const url = baseUrl + relPath;
    const dest = path.join(publicDir, relPath);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    try {
      console.log(`Downloading ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved: ${dest}`);
      } else {
        console.warn(`Failed (${res.status}): ${url}`);
      }
    } catch (e) {
      console.error(`Error downloading ${url}:`, e.message);
    }
  }
}

download();
