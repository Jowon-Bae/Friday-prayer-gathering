const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Change cue widget height from 100% to auto, add flexShrink: 0
file = file.replace(
    /width: '100%',\s*height: '100%',\s*display: 'flex',/g,
    "width: '100%', height: 'auto', display: 'flex', flexShrink: 0,"
);

// 2. Find the end of the cue widget (the first </Rnd>)
const firstRndEndIndex = file.indexOf('</Rnd>');
if (firstRndEndIndex === -1) throw new Error("Could not find first </Rnd>");

// 3. Find the end of the second </Rnd>
const secondRndEndIndex = file.indexOf('</Rnd>', firstRndEndIndex + 6);
if (secondRndEndIndex === -1) throw new Error("Could not find second </Rnd>");

// 4. Construct the chat widget div
const chatWidget = `
                {/* CHAT WIDGET */}
                <div style={{
                    marginTop: '15px',
                    width: '100%',
                    flex: 1,
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                }}>
                    <div className="drag-handle" style={{
                        width: '100%', height: '35px', backgroundColor: 'rgba(220, 38, 38, 0.9)', 
                        cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 'bold'
                    }}>
                        💬 실시간 팀 채팅 (드래그)
                    </div>
                    <div style={{ flex: 1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
                        <ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} />
                    </div>
                </div>
`;

// Replace from first </Rnd> to second </Rnd> with the chatWidget + </Rnd>
const beforeFirstRndEnd = file.substring(0, firstRndEndIndex);
const afterSecondRndEnd = file.substring(secondRndEndIndex + 6); // length of '</Rnd>'

file = beforeFirstRndEnd + chatWidget + '            </Rnd>' + afterSecondRndEnd;

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Merged widgets successfully');
