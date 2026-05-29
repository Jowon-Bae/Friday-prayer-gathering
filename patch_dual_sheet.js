const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Add prevSongRef to track the previous song during transition
// Insert after: const [isTransitioning, setIsTransitioning] = useState(false);
file = file.replace(
    'const [isTransitioning, setIsTransitioning] = useState(false);',
    'const [isTransitioning, setIsTransitioning] = useState(false);\n    const prevSongRef = useRef(null);'
);

// 2. Capture the current song BEFORE the swap in the transition timer
// Replace the transition trigger effect
const oldTransitionBlock = `            setIsTransitioning(true);
            setChatImagePreview(null);
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
            }, 5292);`;

const newTransitionBlock = `            setIsTransitioning(true);
            setChatImagePreview(null);
            // Capture current song for split-view during transition
            setState(prev => {
                prevSongRef.current = prev.current_song;
                return prev;
            });
            const transitionTimer = setTimeout(() => {
                setIsTransitioning(false);
                prevSongRef.current = null;
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
            }, 5292);`;

if (file.includes(oldTransitionBlock)) {
    file = file.replace(oldTransitionBlock, newTransitionBlock);
    console.log('Transition block updated');
} else {
    console.log('ERROR: Transition block not found');
}

// 3. Change activeSong logic - keep showing current song (not next) during transition
file = file.replace(
    '// Use the next song immediately when transition starts so musicians can prepare\n    const activeSong = (isTransitioning && state.next_song) ? state.next_song : state.current_song;',
    '// During transition: show current song. After swap timer, show next song.\n    const activeSong = state.current_song;'
);

// 4. Add prev/next imageUrl
file = file.replace(
    'const imageUrl = activeSong && !imgError ? `/sheets/${activeSong}.jpg` : null;',
    `const imageUrl = activeSong && !imgError ? \`/sheets/\${activeSong}.jpg\` : null;
    const prevSong = prevSongRef.current;
    const prevImageUrl = (isTransitioning && prevSong && prevSong !== activeSong) ? \`/sheets/\${prevSong}.jpg\` : null;`
);

// 5. Replace the sheet music rendering area to show both sheets when transitioning
const oldSheetSection = `) : imageUrl ? (
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
            ) : (`;

const newSheetSection = `) : (isTransitioning && prevImageUrl) ? (
                /* SPLIT VIEW: show prev song on left, next song on right during transition */
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ flex: 1, height: '100%', borderRight: '3px solid var(--color-ch)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: '#aaa', fontSize: '0.8rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', zIndex: 2, whiteSpace: 'nowrap' }}>현재 곡 {prevSong}</div>
                        <TransformWrapper key={\`prev-\${prevSong}\`} initialScale={1} centerOnInit={false} doubleClick={{ disabled: false }} pinch={{ step: 5 }}>
                            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                                <img src={prevImageUrl} alt={\`Prev Song \${prevSong}\`} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(59,130,246,0.8)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', zIndex: 2, whiteSpace: 'nowrap' }}>다음 곡 {state.next_song || activeSong}</div>
                        <TransformWrapper key={\`next-\${activeSong}\`} initialScale={1} centerOnInit={false} doubleClick={{ disabled: false }} pinch={{ step: 5 }}>
                            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                                <img src={imageUrl} alt={\`Next Song \${activeSong}\`} className="sheet-fade-in" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} onError={() => setImgError(true)} />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                </div>
            ) : imageUrl ? (
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
                            alt={\`Sheet Music for Song \${activeSong}\`} 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                            onError={() => setImgError(true)}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : (`;

if (file.includes(oldSheetSection)) {
    file = file.replace(oldSheetSection, newSheetSection);
    console.log('Sheet section updated with split view');
} else {
    console.log('ERROR: Sheet section not found');
    // Find partial match
    const idx = file.indexOf(') : imageUrl ? (');
    console.log('imageUrl found at index:', idx);
}

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Done');
