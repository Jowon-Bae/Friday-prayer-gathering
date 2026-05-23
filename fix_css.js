const fs = require('fs');
let css = fs.readFileSync('client/src/components/ChatOverlay.css', 'utf8');

// Replace literal "\n" with actual newlines
css = css.replace(/\\n/g, '\n');

fs.writeFileSync('client/src/components/ChatOverlay.css', css);
console.log('Fixed css literal newlines');
