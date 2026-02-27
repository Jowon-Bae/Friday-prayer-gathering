import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Global state
let appState = {
    is_playing: false,
    current_bpm: 70, // changed default to 70
    current_cue: '', // This will hold 'Sections' (V1, CH, BR)
    current_key: '', // This will hold 'Keys' (KA, KBb, KC)
    current_modifiers: [], // This will hold 'Modifiers' (ONEMORE, KEYUP)
    current_color: '#000000',
    current_song: '',
    current_inear_targets: [],
    current_inear_vol: 0
};

let chatHistory = [];
const MAX_CHAT_HISTORY = 50;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current state and chat history to the newly connected client
    socket.emit('state_update', appState);
    socket.emit('chat_history', chatHistory);

    // Listen for state changes from Master
    socket.on('update_state', (newState) => {
        appState = { ...appState, ...newState };

        // Broadcast updated state to all clients
        io.emit('state_update', appState);
    });

    // Listen for new chat messages
    socket.on('send_chat', (data) => {
        const message = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            role: data.role || 'User',
            text: data.text,
            timestamp: new Date().toISOString()
        };

        chatHistory.push(message);
        if (chatHistory.length > MAX_CHAT_HISTORY) {
            chatHistory.shift(); // Keep only the latest N messages
        }

        io.emit('chat_message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Socket.IO Server running on port ${PORT}`);
});
