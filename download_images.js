const fs = require('fs'),
    http = require('http'),
    cheerio = require('cheerio'),
    download = require('image-downloader');

const rx = require('rxjs/Rx');
const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;

    
let images_urls = JSON.parse(fs.readFileSync('./image_urls.json'));
let retry_urls = [];
let dest = './Data/images/';
let $done = new Subject();
let $urls = Observable.interval(250)
    .switchMap(() => Observable.of(images_urls))
    .takeUntil($done)
    .map(urls => urls.pop());

$urls.subscribe(url => {
    download.image({ url, dest })
        .then(({filename, image}) => {
            console.log("File saved to", filename);
        })
        .catch((err) => {
            throw err
        });

    if(images_urls.length === 0 && retry_urls.length === 0) {
        $done.next(true);
    }
});