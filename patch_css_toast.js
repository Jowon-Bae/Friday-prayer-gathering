const fs = require('fs');

let css = fs.readFileSync('client/src/index.css', 'utf8');

if (!css.includes('toast-pop')) {
    css += `
@keyframes toast-pop {
    0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
    100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
`;
    fs.writeFileSync('client/src/index.css', css);
    console.log('Added toast-pop animation');
}
