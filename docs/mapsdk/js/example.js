;(function() {
    var actor = window.ATLAS_ACTOR;
    if(window.PL) {
        var timescore = '?t=' + new Date().getTime();
        var version = 'v1.0.1';
        var config = {
            path: {
                'static': './',
                'dist': './libs/cityfun/',
            }
        };
        PL({
            config: config,
            libs: [
                'static:libs/jquery.min.js',
                'static:js/config.js' + timescore,
            ],
            loaded: function() {
                PL({
                    config: config,
                    libs: [
                        'dist:cityfun.min.js?' + version,
                        'static:libs/jquery.min.js',
                        'static:libs/fastclick.min.js',
                        'static:libs/handlebars.min.js',
                        'static:libs/codemirror/codemirror.min.js',
                        'static:libs/codemirror/htmlmixed.js',
                        'static:libs/codemirror/css.js',
                        'static:libs/codemirror/javascript.js',
                        'static:libs/codemirror/xml.js',
                        'static:libs/codemirror/closetag.js',
                        'static:libs/codemirror/closebrackets.js',
                        'static:libs/perfectscroll/perfect-scrollbar.min.js',
                        'static:js/config.js' + timescore,
                        'static:js/tree.js' + timescore,
                        'static:js/' + (actor === 'mobile' ? 'mindex': 'index') + '.js?'+ timescore
                    ],
                    styles: [
                        'dist:cityfun.min.css?' + version,
                        'static:libs/codemirror/codemirror.min.css',
                        'static:libs/codemirror/theme/monokai.css',
                        'static:libs/perfectscroll/perfect-scrollbar.css',
                    ],
                    loaded: function () {
                        loader.style.opacity = 0;
                    }
                });
            }
        })
        
    }
}());
