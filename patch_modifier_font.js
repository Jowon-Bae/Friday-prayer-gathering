const fs = require('fs');

let ipad = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');
const oldIpad = `className="member-cue text-outline-black" style={{ fontSize: '2.2rem', color: '#eab308', marginBottom: '8px' }}`;
const newIpad = `style={{ fontSize: '2.2rem', fontWeight: '900', color: '#eab308', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '8px' }}`;

if (ipad.includes(oldIpad)) {
    ipad = ipad.replace(oldIpad, newIpad);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', ipad);
    console.log('IPadSheet.jsx patched');
} else {
    console.log('Target not found in IPadSheet.jsx');
}

let member = fs.readFileSync('client/src/pages/Member.jsx', 'utf8');
const oldMember = `className="member-cue text-outline-black"`;
const newMember = `className="member-cue" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}`;

if (member.includes(oldMember)) {
    member = member.replace(oldMember, newMember);
    fs.writeFileSync('client/src/pages/Member.jsx', member);
    console.log('Member.jsx patched');
} else {
    console.log('Target not found in Member.jsx');
}
