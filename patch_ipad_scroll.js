const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Change Rnd default height
file = file.replace(
    "width: 350,\n                    height: 'auto',",
    "width: 350,\n                    height: 700,"
);

// 2. Change minHeight of chat widget
file = file.replace(
    "flex: 1,\n                    minHeight: '400px',",
    "flex: 1,\n                    minHeight: '200px',"
);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched IPadSheet.jsx successfully');
