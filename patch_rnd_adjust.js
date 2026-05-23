const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Adjust default y position from 100 to 150
file = file.replace(
    'y: 100,\n                    width: 350,\n                    height: 500,',
    'y: 150,\n                    width: 350,\n                    height: 500,'
);

// 2. Fix the resize handles overlapping issue
const oldStyles = `                    bottom: { height: '30px', bottom: '-15px' },
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

const newStyles = `                    bottom: { height: '35px', bottom: '-35px' },
                    bottomRight: { width: '35px', height: '35px', right: '-15px', bottom: '-35px' },
                    right: { width: '30px', right: '-15px' }
                }}
                resizeHandleComponent={{
                    bottom: (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5px' }}>
                            <div style={{ backgroundColor: '#fff', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                ↕ 위아래로 당겨서 크기 조절
                            </div>
                        </div>
                    ),
                    bottomRight: (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '5px', paddingRight: '5px' }}>
                            <div style={{ width: '0', height: '0', borderBottom: '15px solid #fff', borderLeft: '15px solid transparent', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))', pointerEvents: 'none' }}></div>
                        </div>
                    )
                }}`;

if (file.includes(oldStyles)) {
    file = file.replace(oldStyles, newStyles);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Patched handle visibility and y position successfully');
} else {
    console.log('Target not found!');
}

