const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Change height to 810
file = file.replace('height: 1156,', 'height: 810,');

// 2. Change the current and next song text to use container query and auto-sizing
const oldCurrentTitle = `<div style={{ fontSize: '2rem', color: '#ccc', marginBottom: '20px', textAlign: 'left', lineHeight: 1.2 }}>{songMap[activeSong] || songMap[parseInt(activeSong, 10)] || ''}</div>`;
const newCurrentTitle = `{(function() {
                            const title = songMap[activeSong] || songMap[parseInt(activeSong, 10)] || '';
                            const charFactor = title.length > 0 ? title.split('').reduce((acc, char) => acc + (char.charCodeAt(0) > 255 ? 1 : 0.6), 0) : 1;
                            return (
                                <div style={{ containerType: 'inline-size', width: '100%', marginBottom: '20px' }}>
                                    <div style={{ 
                                        fontSize: \`min(2rem, calc(100cqi / \${Math.max(1, charFactor)}))\`, 
                                        color: '#ccc', 
                                        textAlign: 'left', 
                                        lineHeight: 1.2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {title}
                                    </div>
                                </div>
                            );
                        })()}`;

const oldNextTitle = `<div style={{ fontSize: '1.8rem', color: '#888', marginBottom: '20px', textAlign: 'left', lineHeight: 1.2 }}>{songMap[state.next_song] || songMap[parseInt(state.next_song, 10)] || ''}</div>`;
const newNextTitle = `{(function() {
                            const title = songMap[state.next_song] || songMap[parseInt(state.next_song, 10)] || '';
                            const charFactor = title.length > 0 ? title.split('').reduce((acc, char) => acc + (char.charCodeAt(0) > 255 ? 1 : 0.6), 0) : 1;
                            return (
                                <div style={{ containerType: 'inline-size', width: '100%', marginBottom: '20px' }}>
                                    <div style={{ 
                                        fontSize: \`min(1.8rem, calc(100cqi / \${Math.max(1, charFactor)}))\`, 
                                        color: '#888', 
                                        textAlign: 'left', 
                                        lineHeight: 1.2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {title}
                                    </div>
                                </div>
                            );
                        })()}`;

if (file.includes(oldCurrentTitle) && file.includes(oldNextTitle)) {
    file = file.replace(oldCurrentTitle, newCurrentTitle);
    file = file.replace(oldNextTitle, newNextTitle);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Successfully applied height and font size fixes to IPadSheet.jsx');
} else {
    console.log('Failed to find target strings to replace in IPadSheet.jsx');
}
