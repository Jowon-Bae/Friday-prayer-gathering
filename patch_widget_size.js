const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

file = file.replace('height: 810,', 'height: 880,');

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Widget height updated');
