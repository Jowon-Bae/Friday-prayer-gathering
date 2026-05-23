const fs = require('fs');

// === SERVER: add roomPasswords store + verify_room + set_room_password events ===
let server = fs.readFileSync('server/index.js', 'utf8');

// Add roomPasswords after roomChats
server = server.replace(
    'const MAX_CHAT_HISTORY = 50;',
    `const MAX_CHAT_HISTORY = 50;
const roomPasswords = {}; // roomCode -> password (empty string = no password)`
);

// Add verify_room event handler after join_room
const oldJoinEnd = `        socket.emit('state_update', getRoomState(room));
        socket.emit('chat_history', getRoomChats(room));
    });`;

const newJoinEnd = `        socket.emit('state_update', getRoomState(room));
        socket.emit('chat_history', getRoomChats(room));
    });

    // Verify password before joining
    socket.on('verify_room', ({ roomCode, password }) => {
        const room = (roomCode || 'DEFAULT').toUpperCase().trim();
        const stored = roomPasswords[room] || '';
        const ok = stored === '' || stored === (password || '');
        socket.emit('verify_room_result', { ok, room });
    });

    // Master sets room password
    socket.on('set_room_password', ({ roomCode, password }) => {
        const room = (roomCode || 'DEFAULT').toUpperCase().trim();
        roomPasswords[room] = password || '';
        console.log(\`Room \${room} password updated\`);
        socket.emit('set_room_password_result', { ok: true });
    });`;

if (server.includes(oldJoinEnd)) {
    server = server.replace(oldJoinEnd, newJoinEnd);
    fs.writeFileSync('server/index.js', server);
    console.log('Server patched with password logic');
} else {
    console.log('Server join_room end not found');
}

