const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Change the height to window.innerHeight - 180
file = file.replace(/height: window\.innerHeight > 800 \? 650 : window\.innerHeight - 180,/g, 'height: window.innerHeight - 180,');

// Also replace the old 810 just in case it's still there
file = file.replace(/height: 810,/g, 'height: window.innerHeight - 180,');

// 2. Change the padding of the inner container to have more padding at the bottom so the drag handle doesn't overlap
// Find: <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
file = file.replace(
    "padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'",
    "padding: '20px', paddingBottom: '30px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'"
);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Widget height maximized and padding fixed');
