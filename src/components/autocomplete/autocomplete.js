$.fn.autocomplete = function(options) {
    var me = this;
    var url = 'http://map.baidu.com/su';
    var defaults = {
        'position': 'absolute',
        'left': '0',
        'right': '0',
        'top': '3em'
    }
    $(me).after('<div class="bdmap_autocomplete"></div>');
    $(me).on('input', function(e) {
        $.ajax({
            type: 'get',
            url: 'http://map.baidu.com/su',
            dataType: 'jsonp',
            data: {
                cid: 1,
                type: 0,
                wd: $(e.target).val(),
            },
            success: function(resp) {
                console.log(resp.s);
                var addrArr = resp.s;
                var html = getHTML(addrArr);
                $('.bdmap_autocomplete').html(html);
            }
        })
    })

    function getHTML(addrArr) {
        var html = '';
        for (var i = 0; i < addrArr.length; i++) {
            var addr = addrArr[i].split('$$');
            var city = addr[0].split('$').join('');
            var street = addr[1].split('$')[0];
            html += '<a style="display:block;background-color:white;border-top:1px solid #ededed;padding:1em 1.6em;">';
            html += '<div>' + street + '</div>';
            html += '<div>' + city + '</div>';
            html += '</a>';
        }
        return html;
    }
    var options = $.extend(defaults, options);
    $('.bdmap_autocomplete').css(options);
    return me;
}
