const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const oldStr = `            {chatImagePreview ? (
                <TransformWrapper 
                    key={chatImagePreview}
                    initialScale={1} 
                    centerOnInit={true}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: 'calc(100vw - 390px)', height: '100dvh', position: 'absolute', right: 0, top: 0 }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={chatImagePreview} 
                            alt="Chat Preview" 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : imageUrl ? (`;

const newStr = `            {chatImagePreview ? (
                <>
                    <TransformWrapper 
                        key={chatImagePreview}
                        initialScale={1} 
                        centerOnInit={true}
                        doubleClick={{ disabled: false }}
                        pinch={{ step: 5 }}
                    >
                        <TransformComponent wrapperStyle={{ width: 'calc(100vw - 390px)', height: '100dvh', position: 'absolute', right: 0, top: 0 }} contentStyle={{ width: '100%', height: '100%' }}>
                            <img 
                                src={chatImagePreview} 
                                alt="Chat Preview" 
                                className="sheet-fade-in"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                    <button 
                        onClick={() => setChatImagePreview(null)}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            right: '40px',
                            zIndex: 100,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        ✕ 악보로 돌아가기
                    </button>
                </>
            ) : imageUrl ? (`;

if (file.includes(oldStr)) {
    file = file.replace(oldStr, newStr);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Patched close button successfully');
} else {
    console.log('Could not find the exact string to replace.');
}
