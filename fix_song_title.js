const fs = require('fs');

// 1. Update index.css
let css = fs.readFileSync('client/src/index.css', 'utf8');
if (css.includes('justify-content: center;')) {
    // Only target the one in .song-control
    css = css.replace(
`.song-control {
  display: flex;
  align-items: center;
  justify-content: center;`,
`.song-control {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;`
    );
    fs.writeFileSync('client/src/index.css', css);
    console.log('index.css updated');
}

// 2. Update Master.jsx
let jsx = fs.readFileSync('client/src/pages/Master.jsx', 'utf8');

const oldSpan = `<span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginLeft: '5px' }}>
                        {songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)]}
                    </span>`;

const newSpan = `{(function() {
                        const title = songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)];
                        const isLong = title.length > 15;
                        return (
                            <span style={{ 
                                fontSize: isLong ? '0.85rem' : '1rem', 
                                fontWeight: 'bold', 
                                color: 'white', 
                                marginLeft: '5px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                flex: 1
                            }}>
                                {title}
                            </span>
                        );
                    })()}`;

if (jsx.includes(oldSpan)) {
    jsx = jsx.replace(oldSpan, newSpan);
    fs.writeFileSync('client/src/pages/Master.jsx', jsx);
    console.log('Master.jsx updated');
}

