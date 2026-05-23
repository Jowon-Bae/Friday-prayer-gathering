const fs = require('fs');

function addRoomBadge(filename, liveText, offlineText) {
    let file = fs.readFileSync(filename, 'utf8');
    
    const oldLine = `{isConnected ? '${liveText}' : '${offlineText}'}`;
    const newLine = `{isConnected ? '${liveText}' : '${offlineText}'} · {roomCode}`;
    
    if (file.includes(oldLine)) {
        file = file.replace(oldLine, newLine);
        fs.writeFileSync(filename, file);
        console.log('Patched', filename);
    } else {
        console.log('NOT FOUND in', filename, '| looking for:', oldLine);
    }
}

addRoomBadge('client/src/pages/Member.jsx', 'LIVE', 'RECONNECTING...');
addRoomBadge('client/src/pages/IPadSheet.jsx', 'LIVE', 'RECONNECTING...');
addRoomBadge('client/src/pages/Master.jsx', 'ONLINE', 'OFFLINE');
addRoomBadge('client/src/pages/InEar.jsx', 'LIVE', 'RECONNECTING...');

