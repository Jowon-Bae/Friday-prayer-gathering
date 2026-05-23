const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const oldChat = '<ChatOverlay socket={socket} role="아이패드(iPad)" />';
const newChat = `
            {/* DRAGGABLE CHAT WIDGET */}
            <Rnd
                default={{
                    x: 390,
                    y: 160,
                    width: 350,
                    height: 450,
                }}
                minWidth={250}
                minHeight={300}
                bounds="parent"
                dragHandleClassName="chat-drag-handle"
                style={{ zIndex: 6, display: 'flex', flexDirection: 'column' }}
            >
                <div className="chat-drag-handle" style={{
                    width: '100%', height: '35px', backgroundColor: 'rgba(220, 38, 38, 0.9)', 
                    cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: 'white', fontWeight: 'bold', borderTopLeftRadius: '15px', borderTopRightRadius: '15px',
                    boxShadow: '0 -4px 15px rgba(0,0,0,0.5)'
                }}>
                    💬 실시간 팀 채팅 (드래그)
                </div>
                <div style={{ flex: 1, height: 'calc(100% - 35px)', backgroundColor: 'rgba(30, 30, 30, 0.9)', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', overflow: 'hidden' }}>
                    <ChatOverlay socket={socket} role="아이패드(iPad)" inline={true} />
                </div>
            </Rnd>
`;

file = file.replace(oldChat, newChat);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched IPadSheet.jsx successfully');
