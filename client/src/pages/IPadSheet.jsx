import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { songMap } from '../utils/songMap';
import ChatOverlay from '../components/ChatOverlay';
import { Rnd } from 'react-rnd';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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

export default function IPadSheet() {
    const [state, setState] = useState({
        current_bpm: 70,
        current_cue: 'WAIT',
        current_key: '',
        current_modifiers: [],
        current_color: '#121212',
        current_song: '',
        next_song: '',
        song_trigger: 0,
        current_inear_targets: [],
        current_inear_vol: 0
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
    const hasInEarTargets = state.current_inear_targets && state.current_inear_targets.length > 0;
    const hasInEarAdj = state.current_inear_vol !== 0 && state.current_inear_vol !== undefined;
    const imageUrl = activeSong && !imgError ? `/sheets/${activeSong}.jpg` : null;
    const activeCueColor = state.current_color && state.current_color !== '#121212' ? state.current_color : '#3b82f6';

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100dvh', backgroundColor: '#111', overflow: 'hidden' }}>
            <div className={`connection-status ${isConnected ? 'status-connected' : 'status-disconnected'}`} style={{ zIndex: 10 }}>
                {isConnected ? 'LIVE' : 'RECONNECTING...'}
            </div>

            {/* MAIN SHEET MUSIC AREA */}
            {imageUrl ? (
                <TransformWrapper 
                    key={activeSong}
                    initialScale={1} 
                    centerOnInit={false}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={imageUrl} 
                            alt={`Sheet Music for Song ${activeSong}`} 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                            onError={() => setImgError(true)}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {activeSong ? `악보가 없습니다. (/sheets/${activeSong}.jpg)` : '대기중...'}
                    </div>
                </div>
            )}

            {/* DRAGGABLE & RESIZABLE SIDEBAR WRAPPER */}
            <Rnd
                default={{
                    x: 20,
                    y: 20,
                    width: 350,
                    height: 'auto',
                }}
                minWidth={250}
                bounds="parent"
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
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
                        border: '1px solid rgba(255,100,100,0.5)',
                        animation: 'bpm-blink 0.5s infinite alternate'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', lineHeight: 1.3, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            다음 곡으로<br/>넘어가겠습니다!
                        </div>
                    </div>
                )}

                {/* FLOATING CUE WIDGET */}
                <div style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                }}>
                    {/* DRAG HANDLE */}
                    <div className="drag-handle" style={{
                        width: '100%',
                        height: '35px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        cursor: 'grab',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        flexShrink: 0
                    }}>
                        <div style={{ width: '50px', height: '6px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '3px' }}></div>
                    </div>

                    <div style={{ padding: '1.5rem', width: '100%', height: '100%', overflowY: 'auto' }}>
                        <div style={{ fontSize: '1rem', color: '#888', fontWeight: 'bold', marginBottom: '4px' }}>현재 곡</div>
                        <div style={{ fontSize: '4rem', fontWeight: '900', color: 'white', lineHeight: 1 }}>{activeSong || '-'}</div>
                        <div style={{ fontSize: '2rem', color: '#ccc', marginBottom: '20px', textAlign: 'left', lineHeight: 1.2 }}>{songMap[activeSong] || songMap[parseInt(activeSong, 10)] || ''}</div>

                        {state.next_song ? (
                            <>
                                <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '15px' }}></div>
                                <div style={{ fontSize: '1rem', color: '#888', fontWeight: 'bold', marginBottom: '4px' }}>다음 곡</div>
                                <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#aaa', lineHeight: 1 }}>{state.next_song}</div>
                                <div style={{ fontSize: '1.8rem', color: '#888', marginBottom: '20px', textAlign: 'left', lineHeight: 1.2 }}>{songMap[state.next_song] || songMap[parseInt(state.next_song, 10)] || ''}</div>
                                <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '20px' }}></div>
                            </>
                        ) : (
                            <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '20px', marginTop: '10px' }}></div>
                        )}

                        {displayKey && <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '10px', marginBottom: '12px' }}>{displayKey}</div>}
                        {displayCue && <div style={{ fontSize: '3.5rem', fontWeight: '900', color: activeCueColor, textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '12px' }}>{displayCue}</div>}
                        
                        {hasModifiers && state.current_modifiers.map(mod => (
                            <div key={mod} className="member-cue text-outline-black" style={{ fontSize: '2.2rem', color: '#eab308', marginBottom: '8px' }}>
                                {modifierLabelMap[mod] || mod}
                            </div>
                        ))}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                            <span style={{ fontSize: '1.2rem', color: '#888', fontWeight: 'bold' }}>BPM</span>
                            <span style={state.is_playing ? { fontSize: '3rem', fontWeight: '900', color: '#fff', animation: `bpm-blink ${60 / state.current_bpm}s infinite` } : { fontSize: '3rem', fontWeight: '900', color: '#fff' }}>
                                {state.current_bpm}
                            </span>
                        </div>

                        {(hasInEarTargets || hasInEarAdj) && (
                            <div className="member-cues-container" style={{ marginTop: '20px', backgroundColor: 'rgba(50,50,50,0.5)', borderRadius: '15px', border: '1px solid #555', padding: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: '10px', letterSpacing: '2px', fontWeight: 'bold' }}>IN-EAR CONTROL</div>

                                {hasInEarTargets && (
                                    <>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px', color: 'white' }}>제 인이어에</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                                            {state.current_inear_targets.map(tId => (
                                                <div key={tId} className="member-cue" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.4rem', padding: '4px 10px', borderRadius: '8px', margin: '0' }}>
                                                    {inearTargetMap[tId] || tId}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '4px', marginBottom: '8px', color: 'white' }}>소리를</div>
                                    </>
                                )}

                                {hasInEarAdj && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px' }}>
                                        <div className="member-cue" style={{ backgroundColor: 'transparent', color: state.current_inear_vol > 0 ? '#ef4444' : '#3b82f6', fontSize: '2.2rem', padding: '0 0.5rem', margin: '0 0 5px 0' }}>
                                            {state.current_inear_vol > 0 ? `+${state.current_inear_vol}` : state.current_inear_vol}
                                        </div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>
                                            {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Rnd>

            <ChatOverlay socket={socket} role="아이패드(iPad)" />
        </div>
    );
}
