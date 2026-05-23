const fs = require('fs');

// The previous script left broken JSX - let's fix all pages directly
const pages = [
    { file: 'client/src/pages/Member.jsx', live: 'LIVE', offline: 'RECONNECTING...' },
    { file: 'client/src/pages/IPadSheet.jsx', live: 'LIVE', offline: 'RECONNECTING...' },
    { file: 'client/src/pages/InEar.jsx', live: 'LIVE', offline: 'RECONNECTING...' },
    { file: 'client/src/pages/Master.jsx', live: 'ONLINE', offline: 'OFFLINE' },
];

const badOld = `<span>{isConnected ? (p.old.includes('ONLINE') ? 'ONLINE' : 'LIVE') : (p.old.includes('ONLINE') ? 'OFFLINE' : 'RECONNECTING...')}</span><span style={{ marginLeft: '8px', opacity: 0.7, fontSize: '0.75em' }}>| {roomCode}</span>`;

for (const { file, live, offline } of pages) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove previously broken injection if present
    if (content.includes('p.old.includes')) {
        content = content.replace(badOld, `{isConnected ? '${live}' : '${offline}'}`);
    }
    
    // Now add the proper room badge
    const oldStr = `{isConnected ? '${live}' : '${offline}'}`;
    const newStr = `{isConnected ? '${live}' : '${offline}'} · {roomCode}`;
    
    if (content.includes(oldStr)) {
        content = content.replace(oldStr, newStr);
        console.log('Patched', file);
    } else {
        console.log('NOT FOUND:', file);
    }
    
    fs.writeFileSync(file, content);
}

