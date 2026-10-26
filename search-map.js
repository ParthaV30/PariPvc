const fs = require('fs');

async function searchMap() {
  console.log('Fetching map...');
  const res = await fetch('https://saalaram.app/static/js/main.48df3fc9.js.map');
  const mapData = await res.json();

  const needed = [
    'casement-door',
    'casement-window',
    'sliding-door',
    'sliding-window',
    'fixed-window',
    'topHung',
    'louverss',
    'louvers',
    'favicon.svg'
  ];

  for (let i = 0; i < mapData.sources.length; i++) {
    const src = mapData.sources[i];
    for (const name of needed) {
      if (src.includes(name)) {
        console.log(`Source ${i}: ${src}`);
        const content = mapData.sourcesContent[i];
        console.log(`Length: ${content?.length}, preview: ${content?.slice(0, 100)}`);
      }
    }
  }
}

searchMap().catch(console.error);
