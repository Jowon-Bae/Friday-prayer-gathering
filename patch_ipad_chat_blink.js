const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Add chatBlink state and chatBlinkTimer ref
const stateHook = `    const [imgError, setImgError] = useState(false);`;
const newStateHook = `    const [imgError, setImgError] = useState(false);
    const [chatBlink, setChatBlink] = useState(false);
    const chatBlinkTimer = useRef(null);
    const handleNewChatMessage = () => {
        setChatBlink(true);
        if (chatBlinkTimer.current) clearTimeout(chatBlinkTimer.current);
        chatBlinkTimer.current = setTimeout(() => {
            setChatBlink(false);
        }, 4000);
    };`;

if (file.includes(stateHook) && !file.includes('chatBlink')) {
    file = file.replace(stateHook, newStateHook);
}

// 2. Pass handleNewChatMessage to ChatOverlay
const oldChatOverlay = `<ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} onImageClick={setChatImagePreview} />`;
const newChatOverlay = `<ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} onImageClick={setChatImagePreview} onNewMessage={handleNewChatMessage} />`;

if (file.includes(oldChatOverlay)) {
    file = file.replace(oldChatOverlay, newChatOverlay);
}

// 3. Change the background color and add transition to the drag-handle
const oldHeader = `width: '100%', height: '35px', backgroundColor: 'rgba(255,255,255,0.1)', 
                        cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 'bold'`;
const newHeader = `width: '100%', height: '35px', 
                        backgroundColor: chatBlink ? '#3b82f6' : 'rgba(255,255,255,0.1)', 
                        transition: 'background-color 0.5s ease',
                        cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 'bold'`;

if (file.includes(oldHeader)) {
    file = file.replace(oldHeader, newHeader);
}

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('IPadSheet.jsx patched for chat blinking');
