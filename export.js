const installDependencies = dependencies => {
    const fs = require('fs');
    const dependenciesPath = './.npm-' + __filename.match(/.*[\\\/]([^\\\/]+)/)[1];
    fs.existsSync(dependenciesPath) || fs.mkdirSync(dependenciesPath);
    const packageFile = dependenciesPath + '/package.json';
    const oldPackage = fs.existsSync(packageFile) && JSON.parse(fs.readFileSync(packageFile));
    if (JSON.stringify(oldPackage.dependencies) !== JSON.stringify(dependencies)) {
        fs.writeFileSync(packageFile, JSON.stringify({ dependencies }, null, '  '));
        require('child_process').execSync('npm i', { stdio: 'inherit', cwd: dependenciesPath });
    }
    process.env.NODE_PATH = dependenciesPath + '/node_modules';
    require('module').Module._initPaths();
};

installDependencies({
    'xml2json': '^0.12.0'
});

const rleDecode = require('./rle-decode.js')
const kbitxParse = require('./kbitx-parse.js')
const fs = require('fs');

const chars = kbitxParse('./Codescopix.kbitx');

let text = '';
for (let char of chars) {
    const ch = String.fromCharCode(char.code);
    const hexCode = ('0000' + char.code.toString(16).toUpperCase()).slice(-4);
    text += `\\u${hexCode} '${ch}' (${char.x}, ${char.y})\n`;
    text += char.data.map(row => row.map(x => x ? '[]' : '  ').join('')).join('\n');
    text += '\n\n';
}

fs.writeFileSync('./Codescopix.txt', text);