const fs = require('fs');

// Restore main.jsx to its proper role: just mount the App
const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
`;

fs.writeFileSync('client/src/main.jsx', mainJsx);

// Move the room-based Home and App into App.jsx
const appJsx = `import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Master from './pages/Master';
import Member from './pages/Member';
import InEar from './pages/InEar';
import IPadSheet from './pages/IPadSheet';
import SplashScreen from './components/SplashScreen';
import './index.css';

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/master" element={<Master />} />
                    <Route path="/member" element={<Member />} />
                    <Route path="/inear" element={<InEar />} />
                    <Route path="/ipad" element={<IPadSheet />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

function Home() {
    const [roomCode, setRoomCode] = useState(() => localStorage.getItem('roomCode') || '');
    const [inputCode, setInputCode] = useState(() => localStorage.getItem('roomCode') || '');

    const handleSetRoom = () => {
        const code = inputCode.toUpperCase().trim();
        if (!code) return;
        setRoomCode(code);
        localStorage.setItem('roomCode', code);
    };

    const getLink = (path) => roomCode ? \`\${path}?room=\${roomCode}\` : null;

    return (
        <div className="home-container">
            <img src="/logo_inverted.png" alt="App Icon" className="home-logo" />
            <h1>Seouldream Church<br />금요기도집회 예배팀<br />Cue System</h1>

            {/* Room Code Section */}
            <div style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '24px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center' }}>
                    🏠 팀 코드 입력
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleSetRoom()}
                        placeholder="예: FRIDAY"
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            textAlign: 'center',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSetRoom}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        입장
                    </button>
                </div>
                {roomCode && (
                    <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.9rem', color: '#4ade80' }}>
                        ✅ 현재 팀: <strong style={{ letterSpacing: '1px' }}>{roomCode}</strong>
                    </div>
                )}
            </div>

            {/* Mode Buttons */}
            <div className="home-links">
                {roomCode ? (
                    <>
                        <a href={getLink('/master')} className="home-btn master-btn">Master Mode (인도자)</a>
                        <a href={getLink('/member')} className="home-btn member-btn">Member Mode (팀원)</a>
                        <a href={getLink('/ipad')} className="home-btn" style={{ backgroundColor: '#14b8a6', color: 'white', fontWeight: 'bold' }}>iPad Mode (악보+큐)</a>
                    </>
                ) : (
                    <div style={{ color: '#888', fontSize: '0.95rem', textAlign: 'center', marginTop: '8px' }}>
                        ⬆️ 팀 코드를 먼저 입력하세요
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
`;

fs.writeFileSync('client/src/App.jsx', appJsx);
console.log('Restored main.jsx and updated App.jsx');
