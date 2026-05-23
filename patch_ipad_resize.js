const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

file = file.replace(
    'y: 160,\n                    width: 350,\n                    height: 700,',
    'y: 100,\n                    width: 350,\n                    height: 500,'
);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched IPadSheet.jsx successfully');
