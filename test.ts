import fs from 'fs';

const streamsPool = [
    "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "https://bein-beinxtrasports-firetv.amagi.tv/playlist.m3u8",
    "https://bein-esp-xumo.amagi.tv/playlist.m3u8",
    "https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8",
    "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
];

let content = fs.readFileSync('src/data.ts', 'utf8');

const regex = /streamUrl:\s*"https:\/\/[^"]+"/g;
let i = 0;

content = content.replace(regex, (match) => {
    const url = streamsPool[i % streamsPool.length];
    i++;
    return `streamUrl: "${url}"`;
});

fs.writeFileSync('src/data.ts', content);
console.log('Replaced all stream URLs with working ones.');
