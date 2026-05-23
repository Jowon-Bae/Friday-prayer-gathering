const fs = require('fs');

let html = fs.readFileSync('client/index.html', 'utf8');

const oldTitle = '<title>SDC 금요기도집회 예배팀 Cue System</title>';
const newTitle = '<title>SDC 예배팀 Cue System</title>\n  <meta property="og:title" content="SDC 예배팀 Cue System" />\n  <meta property="og:description" content="Seouldream Church 예배팀 전용 큐 시스템입니다." />';

if (html.includes(oldTitle)) {
    html = html.replace(oldTitle, newTitle);
}

const oldAppleTitle = '<meta name="apple-mobile-web-app-title" content="SDC 금요기도집회 예배팀 Cue System">';
const newAppleTitle = '<meta name="apple-mobile-web-app-title" content="SDC 예배팀 Cue System">';

if (html.includes(oldAppleTitle)) {
    html = html.replace(oldAppleTitle, newAppleTitle);
}

fs.writeFileSync('client/index.html', html);
console.log('index.html updated successfully');
