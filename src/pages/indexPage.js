$(function() {
    function App(selector) {
        var me = this;
        var $el = me.$el = $(selector);
        //读取数据
        me.load = function(url, params, append) {
            var params = params || {};
            me.lastRequest = {
                params: params,
                url: url,
                append: append,
            }
            $.ajax({
                url: url,
                data: params,
                type: 'GET',
                dataType: 'jsonp',
                timeout: 2000,
                error: function() {
                    if (!append) {
                        me.ajaxFailed();
                    }
                },
                success: function(resp) {
                    console.log(resp);
                    if (resp.status == 200) {
                        $('.shop-list').shoplist({
                            data: resp.result.resultData.tplData.result,
                            append: append || false,
                            noMore: true,
                        })
                    } else {
                        me.noshop();
                    }
                }
            });
        }

        //定位失败
        me.locationFailed = function() {
            var html = '<div class="list-info">';
            html += '<div class="list-logo"></div>';
            html += '<div class="list-text"><div>定位失败，请重试</div><div></div></div>';
            html += '<div class="list-handler"><a href="#search" class="list-search">手动输入地址</a></div>';
            html += '</div>';
            $el.find('.position-text').html('定位失败');
            $el.find('.shop-list').html(html);
        }

        //定位未开启
        me.locationDenied = function() {
            var html = '<div class="list-info">';
            html += '<div class="list-logo"></div>';
            html += '<div class="list-text"><div>当前定位未开启</div><div>请手动输入收货地址哦</div></div>';
            html += '<div class="list-handler"><a href="#search" class="list-search">手动输入地址</a></div>';
            html += '</div>';
            $el.find('.position-text').html('定位未开启');
            $el.find('.shop-list').html(html)
        }

        //没有商家
        me.noshop = function() {
            var html = '<div class="list-info">';
            html += '<div class="list-noshop-logo"></div>';
            html += '<div class="list-text"><div>没有找到您附近的商家哦</div><div>正在努力拓展中</div></div>';
            html += '<div class="list-handler"><a href="#search" class="list-search">手动输入地址</a></div>';
            html += '</div>';
            $el.find('.shop-list').html(html)
        }
        me.ajaxFailed = function() {
            var html = '<div class="list-info">';
            html += '<div class="list-noshop-logo"></div>';
            html += '<div class="list-text"><div>请求超时，请重试</div></div>';
            html += '<div class="list-handler">' +
                '<a href="javascript:void(0);" class="list-search list-refresh">刷新</a>' +
                '<span class="list-separator">或</span>' +
                '<a href="#search" class="list-search">手动输入地址</a>' +
                '</div>';
            html += '</div>';
            $el.find('.shop-list').html(html)
        }

        //背景色和图片
        me.background = function() {
            $el.headImg({
                'background-image': 'url(/static/imgs/bg.png)',
                'background-color': '#d63b3b'
            })
        }

        bindEvents();

        function bindEvents() {
            $el.on('mercatorReady', function(e, res) {
                var url = 'http://10.205.199.19:8888/open/lightopen?';
                var params = {
                    lcid: 'lightopen',
                    srcid: '4958',
                    encrypt: 1,
                    query: res.point,
                    p: JSON.stringify({
                        _rn: 10,
                        _pn: 2,
                        crd: res.mercator,
                        o_c_time: '2330_2330',
                    }),
                }
                me.load(url, params);
            });
            $el.on('loading', function(e, text) {
                $('.shop-list').html('<div class="loader"></div>');
                if (text) {
                    $('.position-text').html(text);
                }
                setTimeout(function() {
                    if ($('.loader').length > 0) {
                        me.ajaxFailed();
                    }
                }, 2000);
                routie('index');
            });
            $el.on('locationFailed', function(e, hasLoadData) {
                if (!hasLoadData) {
                    me.locationDenied();
                }
            });
            //刷新按钮
            $el.on('click', '.list-refresh', function() {
                me.load(me.lastRequest.url, me.lastRequest.params);
            });

            // $(window).bind("scroll", function() {
            //     // 判断窗口的滚动条是否接近页面底部，这里的20可以自定义
            //     me.didScroll = true;
            // });
            // setInterval(function() {
            //     var needFetch = $(document.body).scrollTop() + $(window).height() > document.body.scrollHeight - 50;
            //     if (me.didScroll && needFetch) {
            //         me.load(me.lastRequest.url, me.lastRequest.params, true);
            //         me.didScroll = false;
            //     }
            // }, 1000);
        }


    }

    App.prototype.init = function(cb) {
        $('.header .title').html('@便利店');
        this.background();
        if (!this.inited) {
            //me.locationFailed();
            this.$el.trigger('loading');
            this.inited = true;
        }
    }

    window.App = App;
})
