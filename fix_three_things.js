const fs = require('fs');

// 1. Remove emoji from home room code input label
let app = fs.readFileSync('client/src/App.jsx', 'utf8');
app = app.replace('🏠 팀 코드 입력', '팀 코드 입력');
fs.writeFileSync('client/src/App.jsx', app);
console.log('1. Removed emoji from room code label');

// 2. Change SplashScreen title text
let splash = fs.readFileSync('client/src/components/SplashScreen.jsx', 'utf8');
splash = splash.replace(
    '<h2 className="splash-title">Seouldream Church<br />금요기도집회 예배팀<br />Cue System</h2>',
    '<h2 className="splash-title">Seouldream Church<br />Worship Team<br />Cue System</h2>'
);
fs.writeFileSync('client/src/components/SplashScreen.jsx', splash);
console.log('2. Updated splash screen title');

// 3. Add roomCode badge to each page's connection-status area
const pages = [
    { file: 'client/src/pages/Member.jsx', old: `{isConnected ? 'LIVE' : 'RECONNECTING...'}`, wrap: true },
    { file: 'client/src/pages/IPadSheet.jsx', old: `{isConnected ? 'LIVE' : 'RECONNECTING...'}`, wrap: true },
    { file: 'client/src/pages/InEar.jsx', old: null },
    { file: 'client/src/pages/Master.jsx', old: `{isConnected ? 'ONLINE' : 'OFFLINE'}`, wrap: true },
];

for (const p of pages) {
    let file = fs.readFileSync(p.file, 'utf8');
    if (p.old && file.includes(p.old)) {
        file = file.replace(
            p.old,
            `<span>{isConnected ? (p.old.includes('ONLINE') ? 'ONLINE' : 'LIVE') : (p.old.includes('ONLINE') ? 'OFFLINE' : 'RECONNECTING...')}</span><span style={{ marginLeft: '8px', opacity: 0.7, fontSize: '0.75em' }}>| {roomCode}</span>`
        );
    }
    fs.writeFileSync(p.file, file);
}
console.log('3. Added roomCode display to pages - attempting targeted approach...');

