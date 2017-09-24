const fs = require('fs'),
      http = require('http'),
      cheerio = require('cheerio')
      downloadImage = require('download-image');
    //   after_load = require('after-load');

// let html = after_load('https://www.wikiart.org/en/paintings-by-style/abstract-expressionism');

let file_names = [/*'Artworks by style_ Abstract Art - WikiArt.org.html',*/ 'Wiki Art_Abstract Expressionism.html'];

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
        if(src.indexOf('!PinterestLarge') !== -1) {
            src.replace('!PinterestLarge', '');
        }
        downloadImage(src, './Wiki Art Data/' + file_name + '(' + i + ').jpg');
        // let root_url = https://use2-uploads8.wikiart.org/00108/images/hossein-zenderoudi/dantielle-cafe.jpg!PinterestLarge.jpg
    });

    console.log("Finished with " + file_name);
}

