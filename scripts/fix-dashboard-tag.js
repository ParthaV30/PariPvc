const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '..', 'src', 'pages', 'dashboard.js');
let lines = fs.readFileSync(dashPath, 'utf8').split(/\r?\n/);

// Find the double closing </div> around line 139-142
for (let i = 135; i < 145; i++) {
  if (lines[i] && lines[i].trim() === '</div>' && lines[i+1] && lines[i+1].trim() === '</div>') {
    lines.splice(i+1, 1);
    console.log('Removed duplicate </div> at line', i+2);
    break;
  }
}

fs.writeFileSync(dashPath, lines.join('\n'), 'utf8');
console.log('Done updating dashboard.js');
