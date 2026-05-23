const fs = require('fs');

// 1. SplashScreen CSS - Pretendard font + 10% bigger
let css = fs.readFileSync('client/src/components/SplashScreen.css', 'utf8');
css = `.splash-title { font-family: 'Pretendard', 'Inter', sans-serif; }
` + css;
css = css.replace(
    'font-size: 0.9rem;\n    /* Reduced to 60% of original 1.5rem size */',
    'font-size: 0.99rem; /* 0.9rem * 1.1 = 10% larger */'
);
fs.writeFileSync('client/src/components/SplashScreen.css', css);
console.log('1. Updated SplashScreen CSS');

// 2. Home screen title text
let app = fs.readFileSync('client/src/App.jsx', 'utf8');
app = app.replace(
    '<h1>Seouldream Church<br />금요기도집회 예배팀<br />Cue System</h1>',
    '<h1>Worship Team<br />Cue System</h1>'
);
fs.writeFileSync('client/src/App.jsx', app);
console.log('2. Updated home title');

