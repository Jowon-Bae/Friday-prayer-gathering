const fs = require('fs');

let file = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');

file = file.replace(
    'export default function ChatOverlay({ socket, role, inline = false }) {',
    'export default function ChatOverlay({ socket, role, inline = false, onImageClick }) {'
);

file = file.replace(
    'const openFullscreen = (msg) => setFullscreenImage(msg);',
    `const openFullscreen = (msg) => {
        if (onImageClick) {
            onImageClick(msg.fileUrl);
        } else {
            setFullscreenImage(msg);
        }
    };`
);

fs.writeFileSync('client/src/components/ChatOverlay.jsx', file);
console.log('Patched ChatOverlay.jsx successfully');
