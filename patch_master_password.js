const fs = require('fs');

let file = fs.readFileSync('client/src/pages/Master.jsx', 'utf8');

// Add setPassword logic
const hookMarker = 'const [isPlaying, setIsPlaying] = useState(false);';
const hookReplacement = `const [isPlaying, setIsPlaying] = useState(false);
    const [roomPassword, setRoomPassword] = useState('');
    
    const handleSetPassword = () => {
        socket.emit('set_room_password', { roomCode, password: roomPassword });
        alert('팀 비밀번호가 설정되었습니다.');
    };`;

if (file.includes(hookMarker)) {
    file = file.replace(hookMarker, hookReplacement);
}

// Add UI near the top
const uiMarker = '<h1 className="header-title">Master Mode 👑</h1>';
const uiReplacement = `<h1 className="header-title">Master Mode 👑</h1>
                <div style={{ position: 'absolute', top: '30px', right: '10px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="새 비밀번호" 
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        style={{ padding: '2px 5px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: 'white', width: '80px' }}
                    />
                    <button 
                        onClick={handleSetPassword}
                        style={{ padding: '2px 5px', fontSize: '0.8rem', borderRadius: '4px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        설정
                    </button>
                </div>`;

if (file.includes(uiMarker)) {
    file = file.replace(uiMarker, uiReplacement);
}

fs.writeFileSync('client/src/pages/Master.jsx', file);
console.log('Patched Master.jsx for password setting');
