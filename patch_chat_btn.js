const fs = require('fs');
let css = fs.readFileSync('client/src/components/ChatOverlay.css', 'utf8');

const targetStr = `
.chat-send-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
}`;

const replacementStr = `
.chat-send-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}`;

if (css.includes('.chat-send-btn {')) {
    // If the exact block doesn't match, we can just replace the definition or append to it.
    css = css.replace('cursor: pointer;', 'cursor: pointer;\\n    white-space: nowrap;\\n    flex-shrink: 0;');
    fs.writeFileSync('client/src/components/ChatOverlay.css', css);
    console.log('ChatOverlay.css patched');
} else {
    console.log('.chat-send-btn not found');
}
