$.fn.shoplist = function(options) {
    var defaults = {
        data: [],
        append: false,
        noMore: true,
    }
    var options = $.extend(defaults, options);
    var html = getListHtmlByData(options);

    function getListHtmlByData(options) {
        var data = options.data;
        var html = '';
        $.each(data, function(index, value) {
            var shopImg = '<img class="shop-img" src="' + value.detailUrl + '"/>';
            var shopName = '<div class="shop-name">' + value.title + '</div>';
            var shopPrice = '<div class="shop-price"><span>起送价 ¥' + value.transportPrice + '</span><span>配送价 ¥' + value.transportFee + '</span><span>' + (value.isOpening ? '营业中' : '未开业') + '</span></div>';
            var shopMark = '<div class="shop-mark">';
            var promotion = value.promotionData.split('$$');
            for (var i = 0; i < promotion.length; i++) {
                shopMark += '<span class="shop-activity">' + promotion[0] + '</span>';
            }
            shopMark += '<span class="shop-dist">' + (value.lbs_dist / 1000).toFixed(1) + '公里</span></div>';
            var item = '<a href="' + value.detailUrl + '" class="shop-item">';
            item += '<div class="shop-img-container">' + shopImg + '</div>' +
                '<div class="shop-detail">' + shopName + shopPrice + shopMark + '</div></a>';
            html += item;
        });

        html += options.noMore ? '<div class="no-more">已无更多数据</div>' : '<div class="load-more">努力加载中...</div>';
        return html;
    }

    if (options.append) {
        $('.load-more').replaceWith(html);
    } else {
        $(this).html(html);
    }
    return this;
}
