const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, 'extracted-source', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const packages = new Set();
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const matches = content.matchAll(/from\s+['"]([^'.\/][^'"]*)['"]/g);
  for (const m of matches) {
    const pkg = m[1].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0];
    packages.add(pkg);
  }
}
console.log('Dependencies found:', Array.from(packages));
