const fs = require('fs'),
    http = require('http'),
    cheerio = require('cheerio')
    downloadImage = require('download-image');

let images_urls = JSON.parse(fs.readFileSync('./image_urls.json'));

for(let src of images_urls) {
    let file = src.substring(src.lastIndexOf('/')).substring(1);
    downloadImage(src, './Data/' + file);
}
