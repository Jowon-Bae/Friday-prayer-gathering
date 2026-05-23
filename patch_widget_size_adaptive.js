const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// Replace the default height
file = file.replace('height: 880,', 'height: window.innerHeight > 800 ? 650 : window.innerHeight - 180,');

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Adaptive widget height applied');
