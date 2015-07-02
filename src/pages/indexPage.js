$(function() {
    function App(selector) {
        var me = this;
        var $el = me.$el = $(selector);
        me.inited = false;
        //自适应调整
        me.resize = function() {
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
                $el.find('.shop-list').css('min-height', height / fontSize - 17.8 + 'rem');
            }
            $(window).on('resize', function() {
                initial();
            })
        }

        //读取数据
        me.load = function(url, params, append) {

            me.$el.trigger('loading');
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
    }

    App.prototype.init = function(cb) {
        var me = this;
        var $el = me.$el;
        $el.on('init', function() {
            if (!me.inited) {
                //me.locationFailed();
                $el.trigger('loading');
                me.resize();
                me.inited = true;
            }
            me.background();
        });
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
            setTimeout(function(){
                if($('.loader').length > 0){
                    me.ajaxFailed();
                }
            },3000);
            routie('index');
        });
        $el.on('locationFailed', function(e, hasLoadData) {
            if (hasLoadData == false) {
                me.locationFailed();
            }
        });
        //刷新按钮
        $el.on('click', '.list-refresh', function() {
            me.load(me.lastRequest.url, me.lastRequest.params);
        })

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

    window.App = App;
})
