const fs = require('fs');

let file = fs.readFileSync('client/src/App.jsx', 'utf8');

const oldStyle = `style={{
                        width: '100%', padding: '13px 16px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1.2rem', fontWeight: 'bold',
                        letterSpacing: '3px', textAlign: 'center', outline: 'none',
                        boxSizing: 'border-box', marginBottom: '10px'
                    }}`;

const newStyle = `style={{
                        width: '100%', padding: '13px 16px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1rem', textAlign: 'center', outline: 'none',
                        boxSizing: 'border-box', marginBottom: '10px'
                    }}`;

if (file.includes(oldStyle)) {
    file = file.replace(oldStyle, newStyle);
    fs.writeFileSync('client/src/App.jsx', file);
    console.log('App.jsx input style patched successfully');
} else {
    console.log('Old style block not found');
}
