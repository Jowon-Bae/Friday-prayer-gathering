const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const target = `                minWidth={250}
                minHeight={350}
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5 }}`;

const replacement = `                minWidth={250}
                minHeight={350}
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5 }}
                enableResizing={{ bottom: true, bottomRight: true, right: true, left: false, top: false, topRight: false, bottomLeft: false, topLeft: false }}
                resizeHandleStyles={{
                    bottom: { height: '40px', bottom: '-20px' },
                    bottomRight: { width: '40px', height: '40px', right: '-20px', bottom: '-20px' },
                    right: { width: '40px', right: '-20px' }
                }}`;

if (file.includes(target)) {
    file = file.replace(target, replacement);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Patched touch targets successfully');
} else {
    console.log('Target not found!');
}

