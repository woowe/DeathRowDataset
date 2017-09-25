var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var saved_imgs = [];
var wait_for_handle = null;

page.open('https://www.wikiart.org/en/paintings-by-style/abstract-art', () => {
    page.includeJs("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js", () => {
        page.evaluate(() => {
            console.log('Triggering slideshow');
            $($('.st-masonry-tile')[0]).find('.favourites-menu-anchor img').trigger('click')

            waitFor({
                debug: true,
                interval: 200,
                check: () => {
                    return page.evaluate(() => {
                        return $('a.activeslide img').length;
                    })
                },
                success: () => {
                    console.log('has activeslide');

                    clearTimeout(wait_for_handle);
                },
                error: () => {
                    console.log('no activeslide');
                }
            })
        });
        phantom.exit()
    });
});

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('[INFO]: ' + msg);
}

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

    wait_for_handle = setTimeout(waitFor, $config.interval || 0, $config);
}
