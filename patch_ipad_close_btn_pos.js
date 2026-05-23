const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const target = `                    <button 
                        onClick={() => setChatImagePreview(null)}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            right: '40px',`;

const replacement = `                    <button 
                        onClick={() => setChatImagePreview(null)}
                        style={{
                            position: 'absolute',
                            top: '100px',
                            right: '40px',`;

if (file.includes(target)) {
    file = file.replace(target, replacement);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Patched button position successfully');
} else {
    console.log('Target not found!');
}

