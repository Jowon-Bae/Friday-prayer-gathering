const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const targetStr = `backgroundColor: 'rgba(220, 38, 38, 0.9)'`;
const replaceStr = `backgroundColor: 'var(--color-ch)'`;

if (file.includes(targetStr)) {
    file = file.replace(targetStr, replaceStr);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('IPadSheet.jsx patched successfully');
} else {
    console.log('Target string not found');
}
