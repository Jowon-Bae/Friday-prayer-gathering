const fs = require('fs');

function patchFile(filename) {
    let file = fs.readFileSync(filename, 'utf8');

    // For IPadSheet.jsx:
    // if (state.song_trigger && state.song_trigger > prevTriggerRef.current) {
    
    // For Member.jsx:
    // if (state.song_trigger && prevTriggerRef.current !== null && state.song_trigger > prevTriggerRef.current) {

    // Common approach: inject Date.now check into the if condition
    
    if (file.includes('if (state.song_trigger && state.song_trigger > prevTriggerRef.current) {')) {
        file = file.replace(
            'if (state.song_trigger && state.song_trigger > prevTriggerRef.current) {',
            'const isOldTrigger = (Date.now() - state.song_trigger) > 10000;\n        if (state.song_trigger && state.song_trigger > prevTriggerRef.current && !isOldTrigger) {'
        );
        console.log('Patched IPadSheet.jsx');
    }

    if (file.includes('if (state.song_trigger && prevTriggerRef.current !== null && state.song_trigger > prevTriggerRef.current) {')) {
        file = file.replace(
            'if (state.song_trigger && prevTriggerRef.current !== null && state.song_trigger > prevTriggerRef.current) {',
            'const isOldTrigger = (Date.now() - state.song_trigger) > 10000;\n        if (state.song_trigger && prevTriggerRef.current !== null && state.song_trigger > prevTriggerRef.current && !isOldTrigger) {'
        );
        console.log('Patched Member.jsx');
    }

    fs.writeFileSync(filename, file);
}

patchFile('client/src/pages/IPadSheet.jsx');
patchFile('client/src/pages/Member.jsx');

