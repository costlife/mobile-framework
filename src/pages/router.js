$(function() {
    //自适应屏幕
    (function resize() {
        initial();

        function initial() {
            var width = window.screen.width;
            var height = window.screen.height;
            var fontSize = width / 320 * 10;
            if (fontSize > 14) {
                fontSize = 14;
            } else if (fontSize < 10) {
                fontSize = 10;
            }
            $('html').css('font-size', fontSize + 'px');
            $('.shop-list').css('min-height', height / fontSize - 17.8 + 'rem');
        }
        $(window).on('resize', function() {
            initial();
        })
    })();
    //在BMap加载完成后执行初始化
    (function init() {
        if (window.BMap) {
            var app = new App('#appview');
            var search = new Search('#searchview');
            search.$el.trigger('autolocation');

            routie({
                'index': function() {
                    app.init();
                    search.$el.trigger('moveout');
                },
                'search': function() {
                    search.init();
                },
                '*': function() {
                    routie('index');
                }
            })
        } else {
            setTimeout(function() {
                init();
            }, 100);
        }
    })();
})
