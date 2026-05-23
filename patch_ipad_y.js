const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

file = file.replace(
    'y: 40,\n                    width: 350,\n                    height: 680,',
    'y: 160,\n                    width: 350,\n                    height: 680,'
);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched y position successfully');
