const fs = require('fs'),
      http = require('http'),
      cheerio = require('cheerio')
      downloadImage = require('download-image');
    //   after_load = require('after-load');

// let html = after_load('https://www.wikiart.org/en/paintings-by-style/abstract-art');

let file_names = ['abstract-art.html'];

// if(!fs.exists('./Wiki Art Data/')) {
//     console.log('Creating ./Wiki Art Data/...');
//     fs.mkdirSync('./Wiki Art Data/');
// }

for(let file_name of file_names) {
    console.log('Loading ' + file_name);
    let file = fs.readFileSync('./' + file_name);

    let $ = cheerio.load(file);

    let contains_pl = true;

    $('.st-masonry-tile img').each((i, e) => {
        let src = $(e).attr('src');
        src.replace(/!(.*)$/, '');

        console.log('Downloading ', src);
        
        downloadImage(src, './Wiki Art Data/abstract art/' + file_name + '(' + i + ').jpg');
    });

    console.log("Finished with " + file_name);
}

