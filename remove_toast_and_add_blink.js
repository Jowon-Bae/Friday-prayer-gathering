const fs = require('fs');

// 1. Update index.css
let css = fs.readFileSync('client/src/index.css', 'utf8');
if (!css.includes('chat-header-bg-blink')) {
    css += `
@keyframes chat-header-bg-blink {
  0%, 100% { background-color: rgba(255,255,255,0.1); }
  50% { background-color: #3b82f6; }
}
.chat-blink-active {
  animation: chat-header-bg-blink 0.882s cubic-bezier(0.4, 0, 0.6, 1) 8 !important;
}
`;
    fs.writeFileSync('client/src/index.css', css);
    console.log('Added chat-blink-active to index.css');
}

// 2. Remove Toast from ChatOverlay.jsx
let chatJsx = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');
chatJsx = chatJsx.replace(
    'const [dragOffset, setDragOffset] = useState(0);              // for swipe-down to dismiss\n    const [newMessageToast, setNewMessageToast] = useState(false);',
    'const [dragOffset, setDragOffset] = useState(0);              // for swipe-down to dismiss'
);

chatJsx = chatJsx.replace(
`            if (msg.role !== role) {
                setNewMessageToast(true);
                setTimeout(() => setNewMessageToast(false), 4000);
                if (onNewMessage) onNewMessage();
            }`,
`            if (msg.role !== role) {
                if (onNewMessage) onNewMessage();
            }`
);

// We need to use regex or split to remove the JSX block since it contains newlines and spaces.
// Let's just find "{newMessageToast && (" and remove everything until "</>"
const toastStart = chatJsx.indexOf('{newMessageToast && (');
if (toastStart !== -1) {
    const endTag = chatJsx.indexOf('</>', toastStart);
    if (endTag !== -1) {
        chatJsx = chatJsx.substring(0, toastStart) + chatJsx.substring(endTag);
    }
}
fs.writeFileSync('client/src/components/ChatOverlay.jsx', chatJsx);
console.log('Removed toast from ChatOverlay.jsx');

// 3. Update IPadSheet.jsx
let ipadJsx = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');
ipadJsx = ipadJsx.replace(
    `        chatBlinkTimer.current = setTimeout(() => {
            setChatBlink(false);
        }, 4000);`,
    `        chatBlinkTimer.current = setTimeout(() => {
            setChatBlink(false);
        }, 7058);`
);

const oldHeader = `className="drag-handle" style={{
                        width: '100%', height: '35px', 
                        backgroundColor: chatBlink ? '#3b82f6' : 'rgba(255,255,255,0.1)', 
                        transition: 'background-color 0.5s ease',
                        cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 'bold'
                    }}`;
const newHeader = `className={\`drag-handle \${chatBlink ? 'chat-blink-active' : ''}\`} style={{
                        width: '100%', height: '35px', 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 'bold'
                    }}`;

if (ipadJsx.includes(oldHeader)) {
    ipadJsx = ipadJsx.replace(oldHeader, newHeader);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', ipadJsx);
    console.log('Updated IPadSheet.jsx with new blink animation');
} else {
    console.log('Could not find old header in IPadSheet.jsx');
}

