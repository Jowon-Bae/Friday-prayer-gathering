const fs = require('fs');
let file = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');

const target1 = `export default function ChatOverlay({ socket, role, inline = false, onImageClick }) {`;
const replace1 = `export default function ChatOverlay({ socket, role, inline = false, onImageClick, onNewMessage }) {`;

const target2 = `            if (msg.role !== role) {
                setNewMessageToast(true);
                setTimeout(() => setNewMessageToast(false), 4000);
            }`;
const replace2 = `            if (msg.role !== role) {
                setNewMessageToast(true);
                setTimeout(() => setNewMessageToast(false), 4000);
                if (onNewMessage) onNewMessage();
            }`;

if (file.includes(target1) && file.includes(target2)) {
    file = file.replace(target1, replace1);
    file = file.replace(target2, replace2);
    fs.writeFileSync('client/src/components/ChatOverlay.jsx', file);
    console.log('ChatOverlay.jsx patched');
} else {
    console.log('Targets not found');
}
