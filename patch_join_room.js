const fs = require('fs');

const pages = [
    'client/src/pages/Master.jsx',
    'client/src/pages/Member.jsx',
    'client/src/pages/InEar.jsx',
    'client/src/pages/IPadSheet.jsx',
];

for (const filename of pages) {
    let file = fs.readFileSync(filename, 'utf8');

    // Pattern 1: single-line connect handler
    // socket.on('connect', () => setIsConnected(true));
    if (file.includes("socket.on('connect', () => setIsConnected(true));")) {
        file = file.replace(
            "socket.on('connect', () => setIsConnected(true));",
            `socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_room', roomCode);
        });`
        );
        console.log('Patched single-line connect in', filename);
    }

    // Pattern 2: multi-line connect handler
    if (file.includes("socket.on('connect', () => {\n            setIsConnected(true);\n        });")) {
        file = file.replace(
            "socket.on('connect', () => {\n            setIsConnected(true);\n        });",
            `socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_room', roomCode);
        });`
        );
        console.log('Patched multi-line connect in', filename);
    }

    // Also add immediate join if socket is already connected (reconnect case)
    if (!file.includes("socket.emit('join_room', roomCode)") && file.includes('roomCode')) {
        // fallback - add after the first useEffect opening
        console.log('WARNING: join_room not found in', filename);
    } else {
        // After setIsConnected(true) in connect, also emit immediately if already connected
        // Add socket.emit('join_room', roomCode) near the top of the first useEffect
        if (!file.includes("if (socket.connected) socket.emit('join_room', roomCode);")) {
            file = file.replace(
                "socket.emit('join_room', roomCode);\n        });",
                `socket.emit('join_room', roomCode);
        });
        // If already connected (reconnect/refresh), emit immediately
        if (socket.connected) {
            socket.emit('join_room', roomCode);
        }`
            );
        }
    }

    fs.writeFileSync(filename, file);
}
console.log('Done');
