let fs = require('fs');

let path = './Data/images/normalized_128'

let filenames = fs.readdirSync(path).filter(name => name.endsWith('jpg') || v.endsWith('.jpeg') || name.endsWith('png'))
let names = [];

for(let filename of filenames) {
    let matches = filename.match(/(.*).(jpg|png)$/);

    if (matches) {
        names.push(matches[1]);
    }
}

console.log('Saving ' + names.length + ' names');

fs.writeFileSync(path + '/titles.json', JSON.stringify(names), 'utf8');