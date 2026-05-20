import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { songMap } from '../utils/songMap';
import ChatOverlay from '../components/ChatOverlay';

const isCloudflare = window.location.hostname.includes('trycloudflare.com');
const serverUrl = import.meta.env.PROD ? '' : (isCloudflare
    ? `https://outside-concepts-mouse-hypothesis.trycloudflare.com`
    : `http://${window.location.hostname}:3001`);
const socket = io(serverUrl, {
    extraHeaders: {
        "Bypass-Tunnel-Reminder": "true"
    }
});

// Group 1: Song Sections
const sections = [
    { id: 'V1', label: 'V1', color: 'var(--color-v1)' },
    { id: 'V2', label: 'V2', color: 'var(--color-v2)' },
    { id: 'CH', label: 'Ch', color: 'var(--color-ch)' },
    { id: 'BR', label: 'Br', color: 'var(--color-br)' },
    { id: 'INST', label: 'Intro', color: 'var(--color-inst)' },
    { id: 'END', label: 'Ending', color: 'var(--color-end)' }
];

// Group 2: Musical Keys
const keyCues = [
    { id: 'KA', label: 'A key', color: 'var(--color-key-a)' },
    { id: 'KBb', label: 'Bb key', color: 'var(--color-key-bb)' },
    { id: 'KC', label: 'C key', color: 'var(--color-key-c)' },
    { id: 'KD', label: 'D key', color: 'var(--color-key-d)' },
    { id: 'KE', label: 'E key', color: 'var(--color-key-e)' },
    { id: 'KF', label: 'F key', color: 'var(--color-key-f)' },
    { id: 'KG', label: 'G key', color: 'var(--color-key-g)' }
];

// Group 3: Modifiers (Toggleable, Multiple allowed)
const modifiers = [
    { id: 'ONEMORE', label: '한 번 더', color: 'var(--color-onemore)' },
    { id: 'KEYUP', label: 'Key up', color: 'var(--color-keyup)' }
];

export default function Master() {
    const navigate = useNavigate();
    const [bpm, setBpm] = useState(70); // default to 70
    const [activeSection, setActiveSection] = useState('');
    const [activeKey, setActiveKey] = useState('');
    const [activeModifiers, setActiveModifiers] = useState([]);
    const [songNum, setSongNum] = useState('');
    const [nextSongNum, setNextSongNum] = useState('');
    const [inputSongNum, setInputSongNum] = useState('');
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isPlaying, setIsPlaying] = useState(false);

    // For continuous button press
    const holdTimeoutRef = useRef(null);
    const holdIntervalRef = useRef(null);

    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('state_update', (state) => {
            setBpm(state.current_bpm);
            setActiveSection(state.current_cue);
            if (state.current_key !== undefined) setActiveKey(state.current_key);
            if (state.current_song !== undefined) {
                setSongNum(state.current_song);
                // Only update input if it's empty to prevent overwriting user typing
                setInputSongNum(prev => prev || state.current_song);
            }
            if (state.next_song !== undefined) {
                setNextSongNum(state.next_song);
            }
            if (state.current_modifiers !== undefined) setActiveModifiers(state.current_modifiers);
            if (state.is_playing !== undefined) setIsPlaying(state.is_playing);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('state_update');
            stopHold();
        };
    }, []);

    const changeBpm = (delta) => {
        setBpm(prev => {
            const newBpm = prev + delta;
            socket.emit('update_state', { current_bpm: newBpm });
            return newBpm;
        });
    };

    const startHold = (delta) => {
        changeBpm(delta);
        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(() => {
                changeBpm(delta);
            }, 100);
        }, 400);
    };

    const stopHold = () => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };

    const selectSection = (cue, color) => {
        // Toggle off if already selected, otherwise turn on
        const newCue = activeSection === cue ? 'WAIT' : cue;
        const newColor = activeSection === cue ? '#121212' : color;
        setActiveSection(newCue);
        socket.emit('update_state', { current_cue: newCue, current_color: newColor });
    };

    const selectKey = (keyId) => {
        // Toggle off if already selected, otherwise turn on
        const newKey = activeKey === keyId ? '' : keyId;
        setActiveKey(newKey);
        socket.emit('update_state', { current_key: newKey });
    };

    const toggleModifier = (modId) => {
        setActiveModifiers(prev => {
            const next = prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId];
            socket.emit('update_state', { current_modifiers: next });
            return next;
        });
    };

    const handleSongChange = (e) => {
        setInputSongNum(e.target.value);
    };

    const handleGoClick = () => {
        if (!inputSongNum) return;
        
        // If there's already a current song, the next GO sets the next_song.
        // Otherwise, it sets the current_song.
        if (songNum && songNum !== inputSongNum) {
            socket.emit('update_state', {
                next_song: inputSongNum
            });
            setNextSongNum(inputSongNum);
            setInputSongNum('');
        } else {
            socket.emit('update_state', {
                current_song: inputSongNum
            });
            setSongNum(inputSongNum);
            setInputSongNum('');
        }
    };

    return (
        <div className="master-container" style={{ paddingTop: 'max(50px, env(safe-area-inset-top))' }}>
            <div className="header-top-bar"></div>
            <div className="song-control">
                <span className="song-label" style={{ fontSize: '1rem' }}>Song No.</span>
                <input
                    type="text"
                    className="song-input"
                    value={inputSongNum}
                    onChange={handleSongChange}
                    style={{ fontSize: '1.2rem', padding: '4px 8px', width: '70px' }}
                />
                <button
                    onClick={handleGoClick}
                    className="premium-btn"
                    style={{ padding: '6px 16px', marginRight: '8px' }}
                >
                    GO
                </button>
                {songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)] ? (
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginLeft: '5px' }}>
                        {songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)]}
                    </span>
                ) : null}
            </div>
            
            <div style={{ display: 'flex', gap: '15px', margin: '15px 10px', width: 'auto', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ flex: 1, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '5px', fontWeight: '600' }}>현재 곡</div>
                    <div className="inter-num" style={{ fontSize: '1.4rem', fontWeight: '800' }}>{songNum || '-'}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{songMap[songNum] || songMap[parseInt(songNum, 10)] || ''}</div>
                </div>
                <div className="glass-panel" style={{ flex: 1, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '5px', fontWeight: '600' }}>다음 곡</div>
                    <div className="inter-num" style={{ fontSize: '1.4rem', fontWeight: '800' }}>{nextSongNum || '-'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{songMap[nextSongNum] || songMap[parseInt(nextSongNum, 10)] || ''}</div>
                    {nextSongNum && (
                        <button
                            onClick={() => {
                                socket.emit('update_state', { next_song: '' });
                                setNextSongNum('');
                            }}
                            style={{ marginTop: '5px', fontSize: '0.7rem', padding: '2px 8px', background: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            취소
                        </button>
                    )}
                </div>
            </div>

            <div className="tempo-control" style={{ position: 'relative', paddingTop: '35px', paddingBottom: '10px' }}>
                <div className={`connection-status ${isConnected ? 'status-connected' : 'status-disconnected'}`} style={{ position: 'absolute', top: '5px', right: '10px', fontSize: '0.7rem' }}>
                    {isConnected ? 'ONLINE' : 'OFFLINE'}
                </div>

                <button className="tempo-btn" onClick={() => changeBpm(-10)}>-10</button>

                <button
                    className="tempo-btn tempo-btn-main"
                    onMouseDown={() => startHold(-1)}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={(e) => { e.preventDefault(); startHold(-1); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopHold(); }}
                >-1</button>

                <div className="tempo-display" style={{ margin: '0 5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="tempo-label">TEMPO</span>
                    <span
                        className="tempo-number"
                        style={isPlaying ? { animation: `bpm-blink ${60 / bpm}s infinite` } : {}}
                    >
                        {bpm}
                    </span>
                    <button
                        onClick={() => socket.emit('update_state', { is_playing: !isPlaying })}
                        style={{
                            marginTop: '4px',
                            padding: '4px 12px',
                            background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(22, 163, 74, 0.2)',
                            color: isPlaying ? '#ef4444' : '#4ade80',
                            border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.5)' : 'rgba(22, 163, 74, 0.5)'}`,
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isPlaying ? 'STOP' : '▶ START'}
                    </button>
                </div>

                <button
                    className="tempo-btn tempo-btn-main"
                    onMouseDown={() => startHold(1)}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={(e) => { e.preventDefault(); startHold(1); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopHold(); }}
                >+1</button>

                <button className="tempo-btn" onClick={() => changeBpm(10)}>+10</button>
            </div>

            <div className="cue-grid">
                {keyCues.map(kCue => (
                    <button
                        key={kCue.id}
                        className={`cue-btn ${activeKey === kCue.id ? 'active' : ''}`}
                        style={{
                            backgroundColor: activeKey === kCue.id ? kCue.color : 'rgba(20, 20, 32, 0.5)',
                            color: activeKey === kCue.id ? '#fff' : kCue.color
                        }}
                        onClick={() => selectKey(kCue.id)}
                    >
                        {kCue.label}
                    </button>
                ))}

                <div className="cue-divider"></div>

                {sections.map(sec => (
                    <button
                        key={sec.id}
                        className={`cue-btn cue-${sec.id.toLowerCase()} ${activeSection === sec.id ? 'active' : ''}`}
                        style={{
                            backgroundColor: activeSection === sec.id ? sec.color : 'rgba(20, 20, 32, 0.5)',
                            color: activeSection === sec.id ? '#fff' : sec.color
                        }}
                        onClick={() => selectSection(sec.id, sec.color)}
                    >
                        {sec.label}
                    </button>
                ))}

                <div className="cue-divider"></div>

                {modifiers.map(mod => (
                    <button
                        key={mod.id}
                        className={`cue-btn ${activeModifiers.includes(mod.id) ? 'active' : ''}`}
                        style={{
                            backgroundColor: activeModifiers.includes(mod.id) ? mod.color : 'rgba(20, 20, 32, 0.5)',
                            color: activeModifiers.includes(mod.id) ? '#fff' : mod.color
                        }}
                        onClick={() => toggleModifier(mod.id)}
                    >
                        {mod.label}
                    </button>
                ))}
                
                <button
                    className={`cue-btn`}
                    style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                    }}
                    onClick={() => {
                        const ns = nextSongNum;
                        socket.emit('update_state', { song_trigger: Date.now() });
                        
                        if (ns) {
                            setTimeout(() => {
                                socket.emit('update_state', { 
                                    current_song: ns,
                                    next_song: '' 
                                });
                                setSongNum(ns);
                                setNextSongNum('');
                            }, 5292); // 6th flash
                        }
                    }}
                >
                    다음 곡
                </button>

                <div className="cue-divider"></div>

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button
                        className="premium-btn-outline"
                        style={{
                            width: '100%',
                            fontSize: '1rem',
                            padding: '12px',
                        }}
                        onClick={() => navigate('/inear')}
                    >
                        인이어 조정 (In-Ear Control)
                    </button>
                </div>
            </div>

            <ChatOverlay socket={socket} role="인도자(Master)" />
        </div>
    );
}
