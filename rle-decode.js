module.exports = function (/** @type {string} */ base64) {

    let /** @type {number} */ repeatData = null;
    let repeatCount = 0;
    let buf = atob(base64);
    let bufIndex = 0;

    function readByte() {
        if (bufIndex >= buf.length) {
            return -1;
        }
        return buf.charCodeAt(bufIndex++);
    }


    function read() {
        while (true) {
            if (repeatCount > 0) {
                repeatCount--;
                if (repeatData == null) {
                    return readByte();
                } else {
                    return repeatData;
                }
            }
            let data = readByte();
            if (data < 0) {
                return data;
            }
            repeatCount = data & 0x1F;
            if ((data & 0x20) !== 0) {
                repeatCount <<= 5;
            }
            switch (data & 0xC0) {
                case 0x00:
                    repeatData = 0;
                    break;
                case 0x40:
                    repeatData = 0xFF;
                    break;
                case 0x80:
                    data = readByte();
                    if (data < 0) {
                        return data;
                    }
                    repeatData = data;
                    break;
                case 0xC0:
                    repeatData = null;
                    break;
            }
        }
    }

    readByte();
    const width = readByte();
    let /** @type {boolean[][]} */ res = [[]];
    let b = read();
    while (b >= 0) {
        let row = res[res.length - 1];
        if (row.length == width) {
            row = [];
            res.push(row)
        }
        row.push(b > 128);
        b = read();
    }
    return res;
}
