const fs = require('fs');

let appJsx = fs.readFileSync('client/src/App.jsx', 'utf8');

// Replace "🏠 {confirmedRoom}" with "{confirmedRoom}"
if (appJsx.includes('🏠 {confirmedRoom}')) {
    appJsx = appJsx.replace('🏠 {confirmedRoom}', '{confirmedRoom}');
    fs.writeFileSync('client/src/App.jsx', appJsx);
    console.log('House emoji removed from confirmed room display.');
} else {
    console.log('House emoji not found. Checking if it exists elsewhere.');
}

