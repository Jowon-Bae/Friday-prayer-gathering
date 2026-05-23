const fs = require('fs');

let jsx = fs.readFileSync('client/src/pages/Master.jsx', 'utf8');

// Fix the nested curly brace issue
// Original:
// {songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)] ? (
//    {(function() {

const badSyntax = `{songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)] ? (
                    {(function() {`;

const goodSyntax = `{songMap[inputSongNum] || songMap[parseInt(inputSongNum, 10)] ? (function() {`;

if (jsx.includes(badSyntax)) {
    jsx = jsx.replace(badSyntax, goodSyntax);
    // There will be a trailing `)}` from my newSpan and `) : null}` from the original code
    // Let's replace the ending too
    const endBad = `})()}
                ) : null}`;
    const endGood = `})() : null}`;
    jsx = jsx.replace(endBad, endGood);
    fs.writeFileSync('client/src/pages/Master.jsx', jsx);
    console.log('Fixed syntax error in Master.jsx');
} else {
    console.log('Syntax not found');
}

