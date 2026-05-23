const fs = require('fs');
let css = fs.readFileSync('client/src/components/ChatOverlay.css', 'utf8');

css = css.replace('cursor: pointer;\n    white-space: nowrap;\n    flex-shrink: 0;', 'cursor: pointer;');

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

const replaceStr = `
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

if (css.includes(targetStr)) {
    css = css.replace(targetStr, replaceStr);
    fs.writeFileSync('client/src/components/ChatOverlay.css', css);
    console.log('Fixed chat-send-btn correctly');
} else {
    console.log('.chat-send-btn block not found exactly as expected. Finding by keyword.');
    
    // Manual replace for chat-send-btn
    const btnStart = css.indexOf('.chat-send-btn {');
    if (btnStart !== -1) {
        const cursorIdx = css.indexOf('cursor: pointer;', btnStart);
        if (cursorIdx !== -1) {
            css = css.substring(0, cursorIdx) + 'cursor: pointer;\n    white-space: nowrap;\n    flex-shrink: 0;' + css.substring(cursorIdx + 'cursor: pointer;'.length);
            fs.writeFileSync('client/src/components/ChatOverlay.css', css);
            console.log('Fixed chat-send-btn via manual injection');
        }
    }
}
