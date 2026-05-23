const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const target = `                    bottom: { height: '40px', bottom: '-20px' },
                    bottomRight: { width: '40px', height: '40px', right: '-20px', bottom: '-20px' },
                    right: { width: '40px', right: '-20px' }
                }}`;

const replacement = `                    bottom: { height: '30px', bottom: '-15px' },
                    bottomRight: { width: '30px', height: '30px', right: '-15px', bottom: '-15px' },
                    right: { width: '30px', right: '-15px' }
                }}
                resizeHandleComponent={{
                    bottom: (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '5px' }}>
                            <div style={{ backgroundColor: '#fff', color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                ↕ 위아래로 당겨서 크기 조절
                            </div>
                        </div>
                    ),
                    bottomRight: (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '5px' }}>
                            <div style={{ width: '0', height: '0', borderBottom: '15px solid #fff', borderLeft: '15px solid transparent', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))', pointerEvents: 'none' }}></div>
                        </div>
                    )
                }}`;

if (file.includes(target)) {
    file = file.replace(target, replacement);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Patched visible handles successfully');
} else {
    console.log('Target not found!');
}

