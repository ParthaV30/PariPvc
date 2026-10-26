const fs = require('fs');
const path = require('path');

const mediaMap = {
  'handleLeft.png': 'https://saalaram.app/static/media/handleLeft.d99d0dacc072ed1cde1a.png',
  'handleRight.png': 'https://saalaram.app/static/media/handleRight.35e8ade3f132a7442e6a.png',
  'mesh.png': 'https://saalaram.app/static/media/mesh.6366f713f5af29bbe022.png',
  'slideHandle.png': 'https://saalaram.app/static/media/slideHandle.3f2c47eafc0cfdfd5a99.png',
  'fan.png': 'https://saalaram.app/static/media/fan.7589aaa27e4ae2646836.png',
  'ventilator.png': 'https://saalaram.app/static/media/ventilator.be2e736d714ff384c285.png'
};

async function downloadMedia() {
  const imgDir = path.resolve(__dirname, 'extracted-source', 'images');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  for (const [name, url] of Object.entries(mediaMap)) {
    console.log(`Downloading ${name} from ${url}...`);
    const res = await fetch(url);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(path.join(imgDir, name), Buffer.from(buffer));
      console.log(`Saved ${name}`);
    } else {
      console.error(`Failed to download ${url}`);
    }
  }
}

downloadMedia().catch(console.error);
