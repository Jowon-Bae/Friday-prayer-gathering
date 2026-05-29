const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Current Song Title
// Find: color: '#ccc', \n textAlign: 'left',
file = file.replace(/color: '#ccc',\s*textAlign: 'left',/g, "color: 'white',\n                                        fontWeight: '900',\n                                        textAlign: 'left',");

// 2. Next Song Label
// Find: color: '#888', fontWeight: 'bold', marginBottom: '4px' }}>다음 곡
file = file.replace(/color: '#888',\s*fontWeight: 'bold',\s*marginBottom: '4px'\s*}}\>다음 곡/g, "color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>다음 곡");

// 3. Next Song Number
// Find: color: '#eee', lineHeight: 1 }}>{state.next_song
file = file.replace(/color: '#eee',\s*lineHeight: 1\s*}}\>\{state\.next_song/g, "color: 'white', lineHeight: 1 }}>{state.next_song");

// 4. Next Song Title
// Find: color: '#888', \n textAlign: 'left', (inside the next song block)
file = file.replace(/color: '#888',\s*textAlign: 'left',/g, "color: 'white',\n                                        fontWeight: '900',\n                                        textAlign: 'left',");

// 5. Let's make sure "현재 곡" label is also white, not just #ccc
file = file.replace(/color: '#ccc',\s*fontWeight: 'bold',\s*marginBottom: '4px'\s*}}\>현재 곡/g, "color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>현재 곡");


fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Fonts updated to white and bolder');
