module.exports = function (/** @type {string} */ filePath) {

    const fs = require('fs');
    const parser = require('xml2json');

    const xml = fs.readFileSync(filePath);
    const rleDecode = require('./rle-decode.js')

    const /** @type {{u:string,x:string,y:string,w:string,d:string}[]} */ data =
        parser.toJson(xml, { object: true }).kbits.g;

    return data.map(({ u, x, y, w, d }) => ({
        code: parseInt(u),
        x: parseInt(x),
        y: parseInt(y),
        data: rleDecode(d)
    }));
}
