const fs = require('fs');
let file = fs.readFileSync('client/src/pages/Master.jsx', 'utf8');

const anchor = `<div className="master-container" style={{ paddingTop: 'max(50px, env(safe-area-inset-top))' }}>`;
const replacement = `<div className="master-container" style={{ paddingTop: 'max(50px, env(safe-area-inset-top))' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>팀 비밀번호:</span>
                <input 
                    type="text" 
                    placeholder="새 비밀번호" 
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '0.9rem', borderRadius: '6px', border: '1px solid #555', background: '#333', color: 'white', width: '100px' }}
                />
                <button 
                    onClick={handleSetPassword}
                    style={{ padding: '4px 10px', fontSize: '0.9rem', borderRadius: '6px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    설정
                </button>
            </div>`;

if (file.includes(anchor) && !file.includes('handleSetPassword}')) {
    file = file.replace(anchor, replacement);
    fs.writeFileSync('client/src/pages/Master.jsx', file);
    console.log('UI injected successfully');
} else {
    console.log('Anchor not found or UI already injected');
}
