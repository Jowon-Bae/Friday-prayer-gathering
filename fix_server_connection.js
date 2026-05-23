const fs = require('fs');

let file = fs.readFileSync('server/index.js', 'utf8');

// Fix: also emit on plain connection with DEFAULT room, and let join_room override
const oldConnect = `io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    let currentRoom = null;

    // Client joins a room
    socket.on('join_room', (roomCode) => {`;

const newConnect = `io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    let currentRoom = 'DEFAULT';

    // Send default state immediately on connection (will be overridden by join_room)
    socket.join('DEFAULT');
    socket.emit('state_update', getRoomState('DEFAULT'));
    socket.emit('chat_history', getRoomChats('DEFAULT'));

    // Client joins a room
    socket.on('join_room', (roomCode) => {`;

if (file.includes(oldConnect)) {
    file = file.replace(oldConnect, newConnect);
    fs.writeFileSync('server/index.js', file);
    console.log('Fixed server connection handler');
} else {
    console.log('Target not found!');
}
