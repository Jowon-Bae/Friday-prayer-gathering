import { io } from 'socket.io-client';

// Determine server URL once, at module load time.
// In production (Render), the client is served from the same origin as the server,
// so we use an empty string to connect to the same host.
const isCloudflare = window.location.hostname.includes('trycloudflare.com');
const serverUrl = import.meta.env.PROD
    ? ''
    : isCloudflare
    ? `https://outside-concepts-mouse-hypothesis.trycloudflare.com`
    : `http://${window.location.hostname}:3001`;

// Single shared socket instance for the entire app.
// All pages (Master, Member, InEar) import this same object,
// so there is never more than one WebSocket connection open at a time.
const socket = io(serverUrl, {
    extraHeaders: {
        'Bypass-Tunnel-Reminder': 'true',
    },
    // Automatically attempt to reconnect with exponential back-off.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});

export default socket;
