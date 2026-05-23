const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const targetStr = `width: '100%', height: '35px', backgroundColor: 'rgba(220, 38, 38, 0.9)',`;
const replacementStr = `width: '100%', height: '35px', backgroundColor: 'rgba(255,255,255,0.1)',`;

if (file.includes(targetStr)) {
    file = file.replace(targetStr, replacementStr);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Successfully changed chat header color');
} else {
    console.log('Target string not found');
}
