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

const inearTargetMap = {
    'WL': '예배인도자',
    'CLICK': '클릭',
    'SINGER': '싱어',
    'PRAY': '기도인도자',
    'PREACH': '설교자',
    'KEYMAIN': '메인 건반',
    'KEY21': '세컨1 건반',
    'KEY22': '세컨2 건반',
    'DRUM': '드럼',
    'BASS': '베이스',
    'ELEC': '일렉'
};

export default function Member() {
    const [state, setState] = useState({
        current_bpm: 70, // matches new default
        current_cue: 'WAIT',
        current_key: '',
        current_modifiers: [],
        current_color: '#121212',
        current_song: '',
        next_song: '',
        current_inear_targets: [],
        current_inear_vol: 0,
        song_trigger: 0
    });
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const prevTriggerRef = useRef(null);

    useEffect(() => {
        // Only trigger if this is a new value (greater than the last seen value) and not the initial payload
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
            }, 5292); // swap at 6th flash

            return () => {
                clearTimeout(transitionTimer);
                clearTimeout(swapTimer);
            };
        }
        
        // Update the ref to the current trigger value after evaluating
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
    const hasInEarTargets = state.current_inear_targets && state.current_inear_targets.length > 0;
    const hasInEarAdj = state.current_inear_vol !== 0;
    const isWaiting = !displayCue && !displayKey && !hasModifiers;

    return (
        <div
            className="member-container"
            style={{
                backgroundColor: state.current_color === '#121212' ? 'var(--bg-color)' : state.current_color,
                paddingBottom: 'max(30px, env(safe-area-inset-bottom))',
                paddingTop: 'max(60px, env(safe-area-inset-top))'
            }}
        >
            <div className={`connection-status ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
                {isConnected ? 'LIVE' : 'RECONNECTING...'}
            </div>

            {isTransitioning && (
                <div className="flash-transition" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                }}>
                    <h2 style={{ fontSize: '8vw', fontWeight: '900', color: 'white',
                        textAlign: 'center', lineHeight: 1.2, margin: '0 20px',
                        textShadow: '2px 2px 4px black, -2px -2px 4px black, 2px -2px 4px black, -2px 2px 4px black'
                    }}>
                        다음 곡으로<br/>넘어가겠습니다!
                    </h2>
                </div>
            )}

            <div className="member-song-wrapper">
                <div className="member-song glass-panel">
                    <span className="member-song-label">현재 곡</span>
                    <span className="member-song-number">{state.current_song || '-'}</span>
                    {(songMap[state.current_song] || songMap[parseInt(state.current_song, 10)]) ? (
                        <span className="member-song-title">
                            {songMap[state.current_song] || songMap[parseInt(state.current_song, 10)]}
                        </span>
                    ) : null}
                </div>
                
                <div className="member-song glass-panel">
                    <span className="member-song-label">다음 곡</span>
                    <span className="member-song-number">{state.next_song || '-'}</span>
                    {(songMap[state.next_song] || songMap[parseInt(state.next_song, 10)]) ? (
                        <span className="member-song-title">
                            {songMap[state.next_song] || songMap[parseInt(state.next_song, 10)]}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="member-cues-container">
                {displayKey && <div className="member-cue">{displayKey}</div>}
                {displayCue && <div className="member-cue">{displayCue}</div>}
                {hasModifiers && state.current_modifiers.map(mod => (
                    <div key={mod} className="member-cue text-outline-black">{modifierLabelMap[mod] || mod}</div>
                ))}
                {isWaiting && <div className="member-cue">WAIT</div>}
            </div>

            {(hasInEarTargets || hasInEarAdj) && (
                <div className="member-cues-container glass-panel" style={{ marginTop: '0.5rem', minHeight: 'auto', paddingTop: '1rem', paddingBottom: '1rem', width: '92%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-gold)', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.2em', fontWeight: '800' }}>IN-EAR CONTROL</div>

                    {hasInEarTargets && (
                        <>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>제 인이어에</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                                {state.current_inear_targets.map(tId => (
                                    <div key={tId} style={{ backgroundColor: 'var(--accent-gold-light)', color: '#000', fontSize: '1.5rem', padding: '6px 16px', borderRadius: '12px', fontWeight: '800', margin: '0' }}>
                                        {inearTargetMap[tId] || tId}
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>소리를</div>
                        </>
                    )}

                    {hasInEarAdj && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                            <div style={{ color: state.current_inear_vol > 0 ? '#ef4444' : '#3b82f6', fontSize: '3rem', fontWeight: '900', padding: '0 0.5rem', margin: '0 0 4px 0', lineHeight: 1 }}>
                                {state.current_inear_vol > 0 ? `+${state.current_inear_vol}` : state.current_inear_vol}
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="member-label" style={{ marginTop: '0.5rem', fontSize: '5vw' }}>BPM</div>
            <div
                className="member-bpm"
                style={state.is_playing ? { animation: `bpm-blink ${60 / state.current_bpm}s infinite` } : {}}
            >
                {state.current_bpm}
            </div>

            <ChatOverlay socket={socket} role="팀원(Member)" />
        </div>
    );
}
