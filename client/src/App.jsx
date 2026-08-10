import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socket from './socket';
import Master from './pages/Master';
import Member from './pages/Member';
import InEar from './pages/InEar';
import IPadSheet from './pages/IPadSheet';
import SplashScreen from './components/SplashScreen';
import './index.css';

function App() {
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
    const [roomCode, setRoomCode] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [confirmedRoom, setConfirmedRoom] = useState(() => {
        const saved = sessionStorage.getItem('confirmedRoom');
        return saved || '';
    });

    const handleEnter = () => {
        const code = roomCode.toUpperCase().trim();
        if (!code) { setError('팀 코드를 입력해주세요'); return; }
        setIsVerifying(true);
        setError('');
        socket.emit('verify_room', { roomCode: code, password });
        socket.once('verify_room_result', ({ ok, room }) => {
            setIsVerifying(false);
            if (ok) {
                localStorage.setItem('roomCode', room);
                sessionStorage.setItem('confirmedRoom', room);
                sessionStorage.setItem('confirmedName', userName || '익명');
                setConfirmedRoom(room);
                setVerified(true);
            } else {
                setError('❌ 비밀번호가 틀렸습니다');
            }
        });
    };

    const handleLogout = () => {
        setConfirmedRoom('');
        setVerified(false);
        setRoomCode('');
        setPassword('');
        sessionStorage.removeItem('confirmedRoom');
        localStorage.removeItem('roomCode');
    };

    const getLink = (path) => `${path}?room=${confirmedRoom}`;

    if (confirmedRoom) {
        return (
            <div className="home-container">
                <img src="/logo_inverted.png" alt="App Icon" className="home-logo" />
                <h1>Worship Team<br />Cue System</h1>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#4ade80', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px', backgroundColor: 'rgba(74,222,128,0.1)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(74,222,128,0.3)' }}>
                        {confirmedRoom}
                    </span>
                    <button onClick={handleLogout} style={{ marginLeft: '10px', background: 'none', border: '1px solid #555', color: '#888', borderRadius: '8px', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer' }}>나가기</button>
                </div>
                <div className="home-links">
                    <a href={getLink('/master')} className="home-btn master-btn">Master Mode (인도자)</a>
                    <a href={getLink('/member')} className="home-btn member-btn">Member Mode (팀원)</a>
                    <a href={getLink('/ipad')} className="home-btn" style={{ backgroundColor: '#14b8a6', color: 'white', fontWeight: 'bold' }}>iPad Mode (악보+큐)</a>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <img src="/logo_inverted.png" alt="App Icon" className="home-logo" />
            <h1>Worship Team<br />Cue System</h1>

            <div style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: '18px',
                padding: '22px 20px',
                marginBottom: '20px',
                width: '100%',
                maxWidth: '340px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '14px', textAlign: 'center' }}>
                    Team Code
                </div>
                <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                    placeholder="Team Code"
                    style={{
                        width: '100%', padding: '13px 16px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1rem', textAlign: 'center', outline: 'none',
                        boxSizing: 'border-box', marginBottom: '10px'
                    }}
                />
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                    placeholder="Name"
                    style={{
                        width: '100%', padding: '13px 16px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1rem', textAlign: 'center', outline: 'none',
                        boxSizing: 'border-box', marginBottom: '10px'
                    }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                    placeholder="Password"
                    style={{
                        width: '100%', padding: '13px 16px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1rem', textAlign: 'center', outline: 'none',
                        boxSizing: 'border-box', marginBottom: '10px'
                    }}
                />
                {error && <div style={{ color: '#f87171', fontSize: '0.9rem', textAlign: 'center', marginBottom: '8px' }}>{error}</div>}
                <button
                    onClick={handleEnter}
                    disabled={isVerifying}
                    style={{
                        width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                        backgroundColor: isVerifying ? '#555' : '#d4af37',
                        color: 'white', fontWeight: 'bold', fontSize: '1rem',
                        cursor: isVerifying ? 'not-allowed' : 'pointer', letterSpacing: '1px'
                    }}
                >
                    {isVerifying ? '확인 중...' : '입장'}
                </button>
            </div>
        </div>
    );
}

export default App;
