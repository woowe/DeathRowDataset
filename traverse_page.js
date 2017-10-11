var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var rx = require('rxjs/Rx');
var Observable = require('rxjs/Observable').Observable;
var Subject = require('rxjs/Subject').Subject;

var saved_imgs = [];
var wait_for_handle = null;

var $exitPhantom = new Subject();

var $script_loaded = new Subject();
var $console_out = new Subject();
var $start = $console_out.switchMap(function(o) { return Observable.timer(1000) });

$exitPhantom.subscribe(function() {
    phantom.exit();
});

page.open('https://www.wikiart.org/en/paintings-by-style/abstract-art', function () {
    page.includeJs("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js", function () {
        console.log('Script loaded');
        $script_loaded.next(true);
    });

    $console_out
        .merge($script_loaded)
        .debounceTime(1000)
        .take(1)
        .subscribe(function() {
            console.log('starting');
            
            var $loaded_images = new Subject();
            var $load_images = Observable.create(function(observer) {
                var ret = page.evaluate(function() {
                    var text = $('#paintingCountBlock').text();
                    
                    var matches = text.match(/1-(.*) out of (.*)/);

                    var current = parseInt(matches[1]);
                    var max = parseInt(matches[2]);

                    console.log(current, ' out of ', max);

                    if(current >= max) {
                        return false;
                    }

                    $('#btn-more').trigger('click');

                    return true;
                });

                if(ret) {
                    observer.next(ret);
                } else {
                    observer.complete(ret);
                    $loaded_images.next(true);
                }
            });

            $console_out.debounceTime(750)
                .startWith(null)
                .switchMap(function() { return $load_images })
                .takeUntil($loaded_images)
                .subscribe(function() {});
            
            $loaded_images
                .subscribe(function(ret) {
                    console.log('Complete!!!!!! --------------------------------');

                    var image_urls = page.evaluate(function() {
                        var urls = [];

                        $('.st-masonry-tile img').each(function(i, e) {
                            var src_url = $(e).attr('src');
                            var real_url = src_url.replace(/#?!(.*)$/, '');

                            urls.push(real_url);
                        });

                        return urls;
                    });

                    console.log('Urls: ', image_urls.length);

                    fs.write('image_urls.json', JSON.stringify(image_urls), 'w');

                    $exitPhantom.next(true);
                });
        });
});

page.onConsoleMessage = function (msg) {
    system.stderr.writeLine('[INFO]: ' + msg);
    $console_out.next(true);
};