const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const hookText = `    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e) => {
            if (e.changedTouches.length > 0) {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }
        };

        const handleTouchEnd = (e) => {
            if (e.changedTouches.length > 0) {
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                
                // Check if swipe started from the left edge (within 40px)
                if (touchStartX < 40) {
                    const deltaX = touchEndX - touchStartX;
                    const deltaY = Math.abs(touchEndY - touchStartY);
                    
                    // If it's a clear horizontal swipe to the right
                    if (deltaX > 80 && deltaY < 60) {
                        window.location.href = '/';
                    }
                }
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { capture: true });
        window.addEventListener('touchend', handleTouchEnd, { capture: true });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart, { capture: true });
            window.removeEventListener('touchend', handleTouchEnd, { capture: true });
        };
    }, []);`;

// Insert it right after the `useEffect(() => { setImgError(false); }, [activeSong]);` or just before the return.
// Let's find a good spot: `const modifierLabelMap = {`
if (file.includes('const modifierLabelMap = {') && !file.includes('handleTouchStart')) {
    file = file.replace('const modifierLabelMap = {', hookText + '\n\n    const modifierLabelMap = {');
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Swipe back gesture added to IPadSheet.jsx');
} else {
    console.log('Could not inject swipe back gesture');
}
