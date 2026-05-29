const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

file = file.replace(
    "fontSize: '1rem', color: '#888', fontWeight: 'bold', marginBottom: '4px'",
    "fontSize: '1rem', color: '#ccc', fontWeight: 'bold', marginBottom: '4px'"
);

file = file.replace(
    "fontSize: '2.8rem', fontWeight: 'bold', color: '#aaa', lineHeight: 1",
    "fontSize: '2.8rem', fontWeight: 'bold', color: '#eee', lineHeight: 1"
);

// We need to be careful replacing the title div since it's multiline.
// Let's replace the whole style block for the title
const oldStyleBlock = `fontSize: charFactor > 9 ? '1rem' : (charFactor > 7 ? '1.1rem' : '1.2rem'), 
                                    color: '#777', 
                                    marginTop: '8px',
                                    wordBreak: 'keep-all',
                                    lineHeight: 1.2`;
                                    
const newStyleBlock = `fontSize: charFactor > 9 ? '1rem' : (charFactor > 7 ? '1.1rem' : '1.2rem'), 
                                    color: '#ccc', 
                                    fontWeight: 'bold',
                                    marginTop: '8px',
                                    wordBreak: 'keep-all',
                                    lineHeight: 1.2`;

if(file.includes(oldStyleBlock)) {
    file = file.replace(oldStyleBlock, newStyleBlock);
} else {
    // try a simpler replace
    file = file.replace("color: '#777',", "color: '#ccc',\n                                    fontWeight: 'bold',");
}

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Next song fonts made brighter and bolder');
