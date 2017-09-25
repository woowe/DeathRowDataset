var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var rx = require('rxjs/Rx');
var Observable = require('rxjs/Observable').Observable;
var Subject = require('rxjs/Subject').Subject;

var saved_imgs = [];
var wait_for_handle = null;

var $exitPhantom = new Subject();

$exitPhantom.subscribe(function() {
    phantom.exit();
});

function waitFor ($config) {
    $config._start = $config._start || new Date();

    if ($config.timeout && new Date - $config._start > $config.timeout) {
        if ($config.error) $config.error();
        if ($config.debug) console.log('timedout ' + (new Date - $config._start) + 'ms');
        return;
    }

    if ($config.check()) {
        if ($config.debug) console.log('success ' + (new Date - $config._start) + 'ms');
        return $config.success();
    }

    setTimeout(waitFor, $config.interval || 0, $config);
}

var counter_text = $("#paintingCountBlock").text();
var matches = counter_text.match(/^1-(.*) out of (.*)$/);

var current = parseInt(matches[1]);
var max = parseInt(matches[2]);

console.log(current, ' out of ', max);

if(current >= max) {
    return false;
}

$('#btn-more').trigger('click');

return true;

page.open('https://www.wikiart.org/en/paintings-by-style/abstract-art', function () {
    page.includeJs("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js", function () {
        var load_more = true;

        // load all images
        let $load_images = Observable.create(function(observer) { 
            waitFor({
                debug: true,  // optional
                interval: 100,  // optional
                check: function () {
                    return page.evaluate(function() {
                        return $('#thediv').is(':visible');
                    });
                },
                success: function () {
                    // we have what we want
                    observer.next();
                },
                error: function() {
                    observer.error();
                }
            });
        });

        // retrive all images
        $retrived_images = $load_images
            .map(function(){
            });

        // save images
        $retrived_images.subscribe(function(images) {

            $exitPhantom.next(true);
        })
    });
});

page.onConsoleMessage = function (msg) {
    system.stderr.writeLine('[INFO]: ' + msg);
};