const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// Find the <Rnd block
const target = `                minWidth={250}
                minHeight={350}
                bounds="parent"
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5 }}`;

const replacement = `                minWidth={250}
                minHeight={350}
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5 }}`;

if (file.includes(target)) {
    file = file.replace(target, replacement);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Removed bounds="parent" successfully');
} else {
    console.log('Target not found!');
}

