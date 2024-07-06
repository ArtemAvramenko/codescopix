import kbitxParse from './kbitx-parse.js';
import { writeFileSync } from 'fs';
import Jimp from 'jimp';

const chWidth = 8;
const chHeight = 19;
const chCapsHeight = 11;

const chars = kbitxParse('./Codescopix.kbitx');
const infoByCharCode = Object.fromEntries(chars.map(ch => [ch.code, ch]));

function getImagesByChar() {
    let /** @type {{[ch: string]: Jimp}} */ res = {};

    let maxCharY = Math.max(...chars.map(char => char.y));

    for (let char of chars) {
        const ch = String.fromCharCode(char.code);
        const chImg = new Jimp(chWidth, chHeight, 0xffffff00);
        let y = 0;
        for (let row of char.rows) {
            for (let x = 0; x < row.length; x++) {
                if (row[x]) {
                    chImg.setPixelColour(0xFF, char.x + x, y + maxCharY - char.y);
                }
            }
            y++;
        }
        res[ch] = chImg;
    }
    return res;
}

const bitmapByChar = getImagesByChar();

function toHex(/** @type {number} */ code, /** @type {number} */ n) {
    return ('0000' + code.toString(16).toUpperCase()).slice(-n);
}

function getAsciiImage() {
    let res = '';
    for (let char of chars) {
        const ch = String.fromCharCode(char.code);
        const hexCode = toHex(char.code, 4);
        res += `\\u${hexCode} '${ch}' (${char.x}, ${char.y})\n`;
        res += char.rows.map(row => row.map(x => x ? '[]' : '  ').join('')).join('\n');
        res += '\n\n';
    }
    return res;
}

function getTableText() {
    let latestGroup = '';
    let latestPos = 0;
    let res = ['Code ' + [...Array(16).keys()].map(n => toHex(n, 1)).join(' ') + ' '];
    for (let char of chars) {
        let group = toHex((char.code & 0xFFF0) >> 4, 3);
        if (group != latestGroup) {
            latestGroup = group;
            latestPos = 0;
            res.push(group + 'x');
        }
        const pos = char.code & 0xF;
        res[res.length - 1] += ' '.repeat(2 * (pos - latestPos));
        latestPos = pos + 1;
        const ch = String.fromCharCode(char.code);
        res[res.length - 1] += ' ' + ch;
    }
    return res;
}

function getImage(/** @type {string[]} */ textLines) {
    var maxRowLen = Math.max(...textLines.map(row => row.length));
    var img = new Jimp(chWidth * maxRowLen, chHeight * textLines.length, 0xFFFFFFFF);
    for (let y = 0; y < textLines.length; y++) {
        let row = textLines[y];
        for (let x = 0; x < row.length; x++) {
            if ([...row[x].normalize('NFD')].some(ch => !bitmapByChar[ch])) {
                continue;
            }
            let isDiacritics = false;
            const chars = bitmapByChar[row[x]] ? row[x] : row[x].normalize('NFD');
            let offset = 0;
            for (let ch of chars) {
                const chImg = bitmapByChar[ch];
                if (chImg) {
                    const charY = infoByCharCode[ch.charCodeAt(0)].y;
                    img.blit(chImg, x * chWidth, y * chHeight + (isDiacritics && charY > 0 ? offset : 0));
                    if (!isDiacritics) {
                        offset = Math.max(0, chCapsHeight - charY - 1);
                    }
                }
                isDiacritics = true;
            }
        }
    }
    return Jimp.encoders['image/png'](img);
}

writeFileSync('./Codescopix.png', getImage(getTableText()));
writeFileSync('./Example.png', getImage([
    'The quick brown fox jumps over the lazy dog',
    '"Üb jodeln, Gör!", quäkt Schwyz',
    'Pijamalı hasta yağız şoföire çabucak güvendi',
    'El veloz murciélago hindú comía feliz cardillo y kiwi.',
    'La cigüeña tocaba el saxofón detrás del palenque de paja.',
    'Voix ambiguë d’un cœur qui au zéphyr préfère les jattes de kiwis.',
    'Árvíztűrő tükörfúrógép',
    'ŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖŘŮÚŰÜÝŢẞ',
    'ŕáâăäĺćçčéęëěíîďđńňóôőöřůúűüýţß',
    'ЂЃѓЉЊЌЋЏђљњќћџЎўЈҐЁЄЇІіґёєјЅѕї',
    '×÷№µ©®™€¢£¥¤… ¿A? ¡B!',
    'ÑÒÕÀÃÅÈÊÌÏÙÛĞİŸŚŤŽŹĽŻŠĄŞŁŒÆÐØÞ',
    'ñòõàãåèêìïùûğıÿśťžźľżšąşłœæðøþ',
    '«French», ‹French›, “English”, ‘English’, „German“, ‚German‘',
    'Cop Сор, Box Вох, Check Сплеск, Cocoa Сосна,',
    '— Hello Em Dash & En–Dash, y=10-x*2, hy‐phen‐ate, мʼята, double ac˝ute ´2024',
    '⇧⌥⌘⊞ ⇦⇧⇨⇩⌃⌄ ¼, ½, ¾″',
    // TODO:
    //'†‡‰•ˇ˘¦§¨¬­°±˛¶·¸˙ƒˆ˜ª¯º',
    'No ambiguity in the characters ‘Il1’, ‘OoОо0’, ‘CcСс’, etc.',
    'Съешь же ещё этих мягких французских булок, да выпей чаю',
    'Вкъщи не яж сьомга с фиде без ракийка и хапка люта чушчица!',
    'У рудога вераб’я ў сховішчы пад фатэлем ляжаць нейкія гаючыя зёлкі',
    'Жебракують філософи при ґанку церкви в Гадячі, ще й шатро їхнє п’яне знаємо.'
]));
writeFileSync('./Codescopix.txt', getAsciiImage());
