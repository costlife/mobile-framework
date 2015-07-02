$.fn.headImg = function(options) {
    var defaults = {
        'background-size': '100%',
        'background-repeat': 'no-repeat',
        'background-color':'#fff',
        'position': 'absolute',
        'top': '4.5rem',
        'width': '100%',
    }
    var options = $.extend(defaults, options);
    var agent = navigator.userAgent;
    if(agent.indexOf('baiduboxapp') > 0
        && agent.indexOf('light') >0
        || agent.indexOf('BaiduRuntimeO2OZone') >0){
        options.top = '0';
    }
    $('html').css('background-color',options['background-color']);
    $(this).css(options);
    return this;
}
