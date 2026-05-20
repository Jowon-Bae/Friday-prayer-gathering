import React, { useState, useEffect, useRef } from 'react';
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

const cueLabelMap = {
    'V1': 'Verse 1',
    'V2': 'Verse 2',
    'CH': 'Chorus',
    'BR': 'Bridge',
    'INST': 'Intro',
    'END': 'Ending',
    'BR2': 'Bridge 한 번 더',
    'KA': 'A key',
    'KBb': 'Bb key',
    'KC': 'C key',
    'KD': 'D key',
    'KE': 'E key',
    'KF': 'F key',
    'KG': 'G key'
};

export default function IPadSheet() {
    const [state, setState] = useState({
        current_bpm: 70,
        current_cue: 'WAIT',
        current_key: '',
        current_modifiers: [],
        current_color: '#121212',
        current_song: '',
        next_song: '',
        song_trigger: 0
    });
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imgError, setImgError] = useState(false);
    const prevTriggerRef = useRef(null);

    useEffect(() => {
        if (state.song_trigger && prevTriggerRef.current !== null && state.song_trigger > prevTriggerRef.current) {
            setIsTransitioning(true);
            const transitionTimer = setTimeout(() => {
                setIsTransitioning(false);
            }, 7058);

            const swapTimer = setTimeout(() => {
                setState(prev => {
                    if (prev.next_song) {
                        return {
                            ...prev,
                            current_song: prev.next_song,
                            next_song: ''
                        };
                    }
                    return prev;
                });
            }, 5292);

            return () => {
                clearTimeout(transitionTimer);
                clearTimeout(swapTimer);
            };
        }
        
        if (state.song_trigger !== undefined) {
            prevTriggerRef.current = state.song_trigger;
        }
    }, [state.song_trigger]);

    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('state_update', (newState) => {
            setState(prev => ({ ...prev, ...newState }));
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('state_update');
        };
    }, []);

    // Use the next song immediately when transition starts so musicians can prepare
    const activeSong = (isTransitioning && state.next_song) ? state.next_song : state.current_song;

    // Reset image error state when active song changes
    useEffect(() => {
        setImgError(false);
    }, [activeSong]);

    const displayCue = state.current_cue && state.current_cue !== 'WAIT'
        ? (cueLabelMap[state.current_cue] || state.current_cue)
        : '';

    const displayKey = state.current_key
        ? (cueLabelMap[state.current_key] || state.current_key)
        : '';

    const modifierLabelMap = {
        'ONEMORE': '한 번 더',
        'KEYUP': 'Key up'
    };

    const hasModifiers = state.current_modifiers && state.current_modifiers.length > 0;
    const imageUrl = activeSong && !imgError ? `/sheets/${activeSong}.jpg` : null;

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100dvh', backgroundColor: '#111', overflow: 'hidden' }}>
            <div className={`connection-status ${isConnected ? 'status-connected' : 'status-disconnected'}`} style={{ zIndex: 10 }}>
                {isConnected ? 'LIVE' : 'RECONNECTING...'}
            </div>

            {/* MAIN SHEET MUSIC AREA */}
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={`Sheet Music for Song ${activeSong}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                    onError={() => setImgError(true)}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {activeSong ? `악보가 없습니다. (/sheets/${activeSong}.jpg)` : '대기중...'}
                    </div>
                </div>
            )}

            {/* RIGHT SIDEBAR WRAPPER */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                zIndex: 5
            }}>
                {/* FLASH TRANSITION TEXT (Above the box) */}
                {isTransitioning && (
                    <div className="flash-transition" style={{ 
                        backgroundColor: 'rgba(220, 38, 38, 0.9)', 
                        padding: '12px 15px', 
                        borderRadius: '12px',
                        marginBottom: '15px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,100,100,0.5)'
                    }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'white', lineHeight: 1.3, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            다음 곡으로<br/>넘어가겠습니다!
                        </div>
                    </div>
                )}

                {/* FLOATING CUE WIDGET */}
                <div style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold', marginBottom: '2px' }}>현재 곡</div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white', lineHeight: 1 }}>{activeSong || '-'}</div>
                    <div style={{ fontSize: '1rem', color: '#ccc', marginBottom: '15px', textAlign: 'right' }}>{songMap[activeSong] || songMap[parseInt(activeSong, 10)] || ''}</div>

                    <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '10px' }}></div>

                    <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold', marginBottom: '2px' }}>다음 곡</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#aaa', lineHeight: 1 }}>{state.next_song || '-'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px', textAlign: 'right' }}>{songMap[state.next_song] || songMap[parseInt(state.next_song, 10)] || ''}</div>

                    <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '15px' }}></div>

                    {displayKey && <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '8px', marginBottom: '10px' }}>{displayKey}</div>}
                    {displayCue && <div style={{ fontSize: '3rem', fontWeight: '900', color: '#3b82f6', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '10px' }}>{displayCue}</div>}
                    
                    {hasModifiers && state.current_modifiers.map(mod => (
                        <div key={mod} className="member-cue text-outline-black" style={{ fontSize: '2rem', color: '#eab308', marginBottom: '5px' }}>
                            {modifierLabelMap[mod] || mod}
                        </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <span style={{ fontSize: '1rem', color: '#888', fontWeight: 'bold' }}>BPM</span>
                        <span style={state.is_playing ? { fontSize: '2.5rem', fontWeight: '900', color: '#fff', animation: `bpm-blink ${60 / state.current_bpm}s infinite` } : { fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>
                            {state.current_bpm}
                        </span>
                    </div>
                </div>
            </div>

            <ChatOverlay socket={socket} role="아이패드(iPad)" />
        </div>
    );
}
