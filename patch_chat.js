const fs = require('fs');

let file = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');

file = file.replace(
    'export default function ChatOverlay({ socket, role }) {',
    'export default function ChatOverlay({ socket, role, inline = false }) {'
);

file = file.replace(
    '<button className={`chat-fab ${isOpen ? \'open\' : \'\'}`} onClick={toggleChat}>',
    '{!inline && <button className={`chat-fab ${isOpen ? \'open\' : \'\'}`} onClick={toggleChat}>}'
);

file = file.replace(
    '</button>\n\n            {/* Chat Drawer/Overlay */}',
    '</button>}\n\n            {/* Chat Drawer/Overlay */}'
);

file = file.replace(
    '<div className={`chat-overlay ${isOpen ? \'active\' : \'\'}`}>',
    '<div className={`chat-overlay ${isOpen || inline ? \'active\' : \'\'} ${inline ? \'inline\' : \'\'}`}>'
);

file = file.replace(
    '<button className="chat-close" onClick={toggleChat}>✕</button>',
    '{!inline && <button className="chat-close" onClick={toggleChat}>✕</button>}'
);

file = file.replace(
    '{isOpen && <div className="chat-backdrop" onClick={toggleChat}></div>}',
    '{!inline && isOpen && <div className="chat-backdrop" onClick={toggleChat}></div>}'
);

fs.writeFileSync('client/src/components/ChatOverlay.jsx', file);

let css = fs.readFileSync('client/src/components/ChatOverlay.css', 'utf8');
if (!css.includes('.chat-overlay.inline')) {
    css += `

.chat-overlay.inline {
    position: relative;
    height: 100%;
    max-height: none;
    border-radius: 15px;
    box-shadow: none;
    background-color: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(10px);
}
`;
    fs.writeFileSync('client/src/components/ChatOverlay.css', css);
}

console.log('Patched ChatOverlay successfully');
