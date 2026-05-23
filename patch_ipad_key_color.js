const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// Inject keyColorMap
const hookText = `const modifierLabelMap = {`;
const keyColorMapCode = `const keyColorMap = {
        'KA': 'var(--color-key-a)',
        'KBb': 'var(--color-key-bb)',
        'KC': 'var(--color-key-c)',
        'KD': 'var(--color-key-d)',
        'KE': 'var(--color-key-e)',
        'KF': 'var(--color-key-f)',
        'KG': 'var(--color-key-g)'
    };
    
    const `;

if (file.includes(hookText) && !file.includes('keyColorMap')) {
    file = file.replace(hookText, keyColorMapCode + 'modifierLabelMap = {');
}

// Update the JSX for displayKey
const oldDisplayKeyJSX = `{displayKey && <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '10px', marginBottom: '12px' }}>{displayKey}</div>}`;
const newDisplayKeyJSX = `{displayKey && <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', backgroundColor: keyColorMap[state.current_key] || 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '10px', marginBottom: '12px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{displayKey}</div>}`;

if (file.includes(oldDisplayKeyJSX)) {
    file = file.replace(oldDisplayKeyJSX, newDisplayKeyJSX);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Successfully added key color matching to IPadSheet.jsx');
} else {
    console.log('Could not find JSX for displayKey');
}
