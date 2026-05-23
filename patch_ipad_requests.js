const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Make height 1.7x (680 * 1.7 = 1156)
file = file.replace(
    'height: 680,',
    'height: 1156,'
);

// 2. Remove minHeight: '200px' from Chat Widget so it doesn't overflow
file = file.replace(
    "minHeight: '200px',",
    "minHeight: 0,"
);

// 3. Add zIndex to the bottom resize handle to ensure it never gets hidden
const oldHandle = `<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5px' }}>
                            <div style={{ backgroundColor: '#fff', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                ↕ 위아래로 당겨서 크기 조절
                            </div>
                        </div>`;

const newHandle = `<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5px', zIndex: 9999, position: 'relative' }}>
                            <div style={{ backgroundColor: '#fff', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                ↕ 위아래로 당겨서 크기 조절
                            </div>
                        </div>`;

file = file.replace(oldHandle, newHandle);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('IPadSheet updated');

