const fs = require('fs');

let file = fs.readFileSync('client/src/components/ChatOverlay.jsx', 'utf8');

// 1. Add state
const stateHook = `    const [dragOffset, setDragOffset] = useState(0);              // for swipe-down to dismiss`;
const newStateHook = `    const [dragOffset, setDragOffset] = useState(0);              // for swipe-down to dismiss
    const [newMessageToast, setNewMessageToast] = useState(false);`;

if (file.includes(stateHook) && !file.includes('newMessageToast')) {
    file = file.replace(stateHook, newStateHook);
}

// 2. Add toast trigger logic
const oldHandleNewMessage = `        const handleNewMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
        };`;

const newHandleNewMessage = `        const handleNewMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
            if (msg.role !== role) {
                setNewMessageToast(true);
                setTimeout(() => setNewMessageToast(false), 4000);
            }
        };`;

if (file.includes(oldHandleNewMessage)) {
    file = file.replace(oldHandleNewMessage, newHandleNewMessage);
}

// 3. Render toast
const endTag = `        </>
    );
}`;

const toastJSX = `
            {newMessageToast && (
                <div style={{
                    position: 'fixed',
                    top: 'max(40px, env(safe-area-inset-top))',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                    zIndex: 999999,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'toast-pop 0.3s ease-out forwards'
                }}>
                    <span style={{ fontSize: '1.4rem' }}>💬</span> 새로운 팀 채팅이 올라왔습니다!
                </div>
            )}
        </>
    );
}`;

if (file.includes(endTag)) {
    file = file.replace(endTag, toastJSX);
}

fs.writeFileSync('client/src/components/ChatOverlay.jsx', file);
console.log('Successfully added chat toast notification');
