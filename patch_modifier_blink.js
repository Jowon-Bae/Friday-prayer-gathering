const fs = require('fs');

// Patch IPadSheet.jsx
let ipad = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');
const oldIpad = `style={{ fontSize: '2.2rem', fontWeight: '900', color: '#eab308', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '8px' }}`;
const newIpad = `style={{ fontSize: '2.2rem', fontWeight: '900', color: '#eab308', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '8px', animation: 'flash-text-blink 0.882s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}`;
if (ipad.includes(oldIpad)) {
    ipad = ipad.replace(oldIpad, newIpad);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', ipad);
    console.log('IPadSheet.jsx patched for modifier blink');
}

// Patch Member.jsx
let member = fs.readFileSync('client/src/pages/Member.jsx', 'utf8');
const oldMember = `className="member-cue" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}`;
const newMember = `className="member-cue" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)', animation: 'flash-text-blink 0.882s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}`;
if (member.includes(oldMember)) {
    member = member.replace(oldMember, newMember);
    fs.writeFileSync('client/src/pages/Member.jsx', member);
    console.log('Member.jsx patched for modifier blink');
}
