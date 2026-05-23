const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Add state
file = file.replace(
    'const [isTransitioning, setIsTransitioning] = useState(false);',
    'const [isTransitioning, setIsTransitioning] = useState(false);\n    const [chatImagePreview, setChatImagePreview] = useState(null);'
);

// 2. Clear chat image on trigger
file = file.replace(
    'setIsTransitioning(true);',
    'setIsTransitioning(true);\n            setChatImagePreview(null);'
);

// 3. Update image rendering block
const oldRender = `            {activeSong && !imgError ? (
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

const newRender = `            {chatImagePreview ? (
                <TransformWrapper 
                    key={chatImagePreview}
                    initialScale={1} 
                    centerOnInit={false}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={chatImagePreview} 
                            alt="Chat Preview" 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : activeSong && !imgError ? (
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

file = file.replace(oldRender, newRender);

// 4. Update Header text
file = file.replace('💬 실시간 팀 채팅 (드래그)', '💬 실시간 팀 채팅');

// 5. Update ChatOverlay props
file = file.replace(
    '<ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} />',
    '<ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} onImageClick={setChatImagePreview} />'
);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched IPadSheet.jsx successfully');
