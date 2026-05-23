const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const oldStr = `<div style={{ flex: 1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
                        <ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} onImageClick={setChatImagePreview} />
                    </div>`;

const newStr = `<div style={{ flex: 1, backgroundColor: 'rgba(30, 30, 30, 0.9)', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column' }}>
                            <ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} onImageClick={setChatImagePreview} />
                        </div>
                    </div>`;

if (file.includes(oldStr)) {
    file = file.replace(oldStr, newStr);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Fixed IPadSheet.jsx successfully');
} else {
    console.log('Could not find the exact string to replace.');
}

