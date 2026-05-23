const fs = require('fs');

let file = fs.readFileSync('client/src/App.jsx', 'utf8');

// 1. "팀 코드 입력" -> "Team Code"
file = file.replace('팀 코드 입력', 'Team Code');

// 2. placeholder="팀 코드" -> "Team Code"
file = file.replace('placeholder="팀 코드"', 'placeholder="Team Code"');

// 3. placeholder="비밀번호 (없으면 비워두세요)" -> "Password"
file = file.replace('placeholder="비밀번호 (없으면 비워두세요)"', 'placeholder="Password"');

// 4. "입장 →" -> "입장"
file = file.replace("{isVerifying ? '확인 중...' : '입장 →'}", "{isVerifying ? '확인 중...' : '입장'}");

// 5. Button color #3b82f6 -> modern gold
// 'backgroundColor: isVerifying ? '#555' : '#3b82f6','
file = file.replace(
    "backgroundColor: isVerifying ? '#555' : '#3b82f6'",
    "backgroundColor: isVerifying ? '#555' : '#d4af37'"
);

fs.writeFileSync('client/src/App.jsx', file);
console.log('App.jsx patched successfully');
