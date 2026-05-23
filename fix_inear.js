const fs = require('fs');
let file = fs.readFileSync('client/src/pages/InEar.jsx', 'utf8');
file = file.replace(
    "{isConnected ? 'ONLINE' : 'OFFLINE'}",
    "{isConnected ? 'ONLINE' : 'OFFLINE'} · {roomCode}"
);
fs.writeFileSync('client/src/pages/InEar.jsx', file);
console.log('Patched InEar.jsx');
