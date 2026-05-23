const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// Restore the height back to 810
file = file.replace(/height: window\.innerHeight - 180,/g, 'height: 810,');

// Increase width from 350 to 370
file = file.replace(/width: 350,/g, 'width: 370,');

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Widget size restored and width increased');
