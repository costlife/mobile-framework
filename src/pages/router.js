$(function() {
    //在BMap加载完成后执行初始化
    (function init() {
        if (window.BMap) {
            new App('#appview').init();
            new Search('#searchview').init();
            $('#searchview').trigger('autolocation');
            routie({
                'index': function() {
                    $('#appview').trigger('init');
                    $('.header .title').html('@便利店');
                    $('#searchview').trigger('moveout');
                    console.log("route to index");
                },
                'search': function() {
                    $('#searchview').trigger('init');
                    $('.header .title').html('搜索地址');
                    console.log("route to map");
                }
            })
        } else {
            setTimeout(function() {
                init();
            }, 100);
        }
    })();
})
