const fs = require('fs');

// Helper: inject join_room logic into a page's socket setup
// Each page has: const socket = io(serverUrl, {...}); and a useEffect
// We add: useSearchParams, read room param, emit join_room on connect

function patchPage(filename, role) {
    let file = fs.readFileSync(filename, 'utf8');

    // 1. Add useSearchParams import if not present
    if (!file.includes('useSearchParams')) {
        file = file.replace(
            "import { useNavigate } from 'react-router-dom';",
            "import { useNavigate, useSearchParams } from 'react-router-dom';"
        );
        // For pages without useNavigate
        if (!file.includes('useSearchParams')) {
            file = file.replace(
                "import { io } from 'socket.io-client';",
                "import { io } from 'socket.io-client';\nimport { useSearchParams } from 'react-router-dom';"
            );
        }
    }

    // 2. Add useSearchParams hook after function declaration
    // Find the first useState in the component function
    const hookMarker = 'const [isConnected, setIsConnected] = useState(socket.connected);';
    const hookReplacement = `const [searchParams] = useSearchParams();
    const roomCode = (searchParams.get('room') || localStorage.getItem('roomCode') || 'DEFAULT').toUpperCase().trim();
    const [isConnected, setIsConnected] = useState(socket.connected);`;

    if (file.includes(hookMarker)) {
        file = file.replace(hookMarker, hookReplacement);
    }

    // 3. Add join_room emit to socket connect handler
    // After socket.on('connect', ...) or in the first useEffect
    const connectPattern = "socket.on('connect', () => {\n            setIsConnected(true);";
    const connectReplacement = `socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_room', roomCode);`;

    if (file.includes(connectPattern)) {
        file = file.replace(connectPattern, connectReplacement);
    }

    // Also emit join_room immediately if already connected
    const immediateEmitPattern = "socket.on('connect', () => {\n            setIsConnected(true);\n            socket.emit('join_room', roomCode);";
    // Add immediate emit before the connect handler
    const effectStart = "useEffect(() => {";
    // Find the first useEffect and add initial join
    if (file.includes("socket.connected")) {
        // inject after the isConnected useState
        file = file.replace(
            'const [isConnected, setIsConnected] = useState(socket.connected);',
            `const [isConnected, setIsConnected] = useState(socket.connected);`
        );
    }

    fs.writeFileSync(filename, file);
    console.log('Patched', filename);
}

// Patch IPadSheet separately - it has different structure
function patchIPad(filename) {
    let file = fs.readFileSync(filename, 'utf8');

    if (!file.includes('useSearchParams')) {
        // IPadSheet uses react-router-dom? Let's check
        if (file.includes("from 'react-router-dom'")) {
            file = file.replace(
                /from 'react-router-dom'/,
                "from 'react-router-dom'\nimport { useSearchParams } from 'react-router-dom';"
            );
        } else {
            file = file.replace(
                "import React, { useState, useEffect, useRef } from 'react';",
                "import React, { useState, useEffect, useRef } from 'react';\nimport { useSearchParams } from 'react-router-dom';"
            );
        }
    }

    // Add searchParams hook
    const hookMarker = 'const [isConnected, setIsConnected] = useState(socket.connected);';
    const hookReplacement = `const [searchParams] = useSearchParams();
    const roomCode = (searchParams.get('room') || localStorage.getItem('roomCode') || 'DEFAULT').toUpperCase().trim();
    const [isConnected, setIsConnected] = useState(socket.connected);`;

    if (file.includes(hookMarker)) {
        file = file.replace(hookMarker, hookReplacement);
    }

    // add join_room to connect handler
    const connectPattern = "socket.on('connect', () => {\n            setIsConnected(true);";
    const connectReplacement = `socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_room', roomCode);`;

    if (file.includes(connectPattern)) {
        file = file.replace(connectPattern, connectReplacement);
    }

    fs.writeFileSync(filename, file);
    console.log('Patched IPadSheet');
}

patchPage('client/src/pages/Master.jsx', 'Master');
patchPage('client/src/pages/Member.jsx', 'Member');
patchPage('client/src/pages/InEar.jsx', 'InEar');
patchIPad('client/src/pages/IPadSheet.jsx');
