import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Master from './pages/Master';
import Member from './pages/Member';
import InEar from './pages/InEar';
import IPadSheet from './pages/IPadSheet';
import SplashScreen from './components/SplashScreen';
import './index.css';

function App() {
    // Only show splash once per browser session
    const [showSplash, setShowSplash] = useState(() => {
        if (sessionStorage.getItem('splashShown')) return false;
        return true;
    });

    const handleSplashComplete = () => {
        sessionStorage.setItem('splashShown', '1');
        setShowSplash(false);
    };

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
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

    const getLink = (path) => roomCode ? `${path}?room=${roomCode}` : '#';

    return (
        <div className="home-container">
            <img src="/logo_inverted.png" alt="App Icon" className="home-logo" />
            <h1>Seouldream Church<br />금요기도집회 예배팀<br />Cue System</h1>

            {/* Room Code Section */}
            <div style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '18px 20px',
                marginBottom: '24px',
                width: '100%',
                maxWidth: '360px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: '0.82rem', color: '#aaa', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px', textAlign: 'center' }}>
                    팀 코드 입력
                </div>
                <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSetRoom()}
                    placeholder="예: FRIDAY"
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        letterSpacing: '3px',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '10px'
                    }}
                />
                <button
                    onClick={handleSetRoom}
                    style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        letterSpacing: '1px'
                    }}
                >
                    입장 →
                </button>
                {roomCode && (
                    <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.9rem', color: '#4ade80' }}>
                        ✅ 현재 팀: <strong style={{ letterSpacing: '2px' }}>{roomCode}</strong>
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
                    <div style={{ color: '#777', fontSize: '0.95rem', textAlign: 'center' }}>
                        ⬆️ 팀 코드를 먼저 입력하세요
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
