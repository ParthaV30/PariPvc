const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, r, g, b) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: truecolor (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([t, data]));
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc, 0);
    return Buffer.concat([len, t, data, c]);
  }

  // Raw pixel data: each scanline starts with filter byte 0
  const scanline = Buffer.alloc(1 + width * 3);
  scanline[0] = 0;
  for (let x = 0; x < width; x++) {
    // draw a simple frame pattern
    const isBorder = (x < 10 || x >= width - 10);
    scanline[1 + x * 3] = isBorder ? 30 : r;
    scanline[1 + x * 3 + 1] = isBorder ? 58 : g;
    scanline[1 + x * 3 + 2] = isBorder ? 138 : b;
  }

  const rawLines = [];
  for (let y = 0; y < height; y++) {
    if (y < 10 || y >= height - 10) {
      const borderLine = Buffer.alloc(1 + width * 3);
      borderLine[0] = 0;
      for (let x = 0; x < width; x++) {
        borderLine[1 + x * 3] = 30;
        borderLine[1 + x * 3 + 1] = 58;
        borderLine[1 + x * 3 + 2] = 138;
      }
      rawLines.push(borderLine);
    } else {
      rawLines.push(scanline);
    }
  }

  const rawData = Buffer.concat(rawLines);
  const compressed = zlib.deflateSync(rawData);

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const imagesToCreate = [
  { name: 'casement-door.png', r: 240, g: 245, b: 255 },
  { name: 'casement-window.png', r: 235, g: 242, b: 250 },
  { name: 'sliding-door.png', r: 240, g: 248, b: 255 },
  { name: 'sliding-window.png', r: 230, g: 240, b: 250 },
  { name: 'fixed-window.png', r: 245, g: 245, b: 250 },
  { name: 'topHung.png', r: 238, g: 242, b: 250 },
  { name: 'louvers.png', r: 240, g: 240, b: 245 },
  { name: 'louverss.png', r: 240, g: 240, b: 245 }
];

const imgDir = path.resolve(__dirname, 'src', 'images');
for (const item of imagesToCreate) {
  const target = path.join(imgDir, item.name);
  if (!fs.existsSync(target)) {
    const pngBuf = createPng(200, 200, item.r, item.g, item.b);
    fs.writeFileSync(target, pngBuf);
    console.log(`Generated: ${item.name}`);
  }
}

console.log('All image assets generated successfully!');
