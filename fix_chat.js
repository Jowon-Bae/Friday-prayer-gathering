const fs = require('fs');

let file = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');

file = file.replace(
    '{!inline && <button className={`chat-fab ${isOpen ? \'open\' : \'\'}`} onClick={toggleChat}>}',
    '{!inline && (\n                <button className={`chat-fab ${isOpen ? \'open\' : \'\'}`} onClick={toggleChat}>'
);

file = file.replace(
    '</button>}',
    '</button>\n            )}'
);

fs.writeFileSync('client/src/components/ChatOverlay.jsx', file);
console.log('Fixed ChatOverlay JSX syntax');
