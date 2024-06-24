import fs from 'fs';
import parser from 'xml2json';
import rleDecode from './rle-decode.js';

export default function (/** @type {string} */ filePath) {

    const xml = fs.readFileSync(filePath);

    const /** @type {{u:string,x:string,y:string,w:string,d:string}[]} */ data =
        parser.toJson(xml, { object: true }).kbits.g;

    return data.map(({ u, x, y, d }) => ({
        code: parseInt(u),
        x: parseInt(x),
        y: parseInt(y),
        rows: rleDecode(d)
    }));
}
