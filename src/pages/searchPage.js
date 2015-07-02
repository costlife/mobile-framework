$(function() {
    function Search(selector) {
        var me = this;
        var $el = me.$el = $(selector);
        var myGeo = new BMap.Geocoder();
        me.getMercator = function(point) {
            point.lat = point.lat.toFixed(6);
            point.lng = point.lng.toFixed(6);
            myGeo.getLocation(point, function(result) {
                var addr = result.address;
                $('#appview').trigger('loading', addr);
                var coords = point.lng + ',' + point.lat;
                var url = 'http://api.map.baidu.com/geoconv/v1/?coords=' + coords + '&from=1&to=6&ak=9602da11481ea186960a8fa2744f7a6a';
                $.get(url + '&callback=?', function(resp) {
                    $('#appview').trigger('mercatorReady', {
                        point: coords.replace(',', '_'),
                        mercator: resp.result[0].x + '_' + resp.result[0].y,
                    });
                })
            })
        }
        me.getLocationXY = function(region, street, city) {
            var addr = region + street;
            var city = city || '';
            myGeo.getPoint(addr, function(point) {
                if (point) {
                    me.addHistory(region, street);
                    me.getMercator(point)
                } else {
                    alert("您选择地址没有解析到结果!");
                }
            }, city);
        }

        // me.BMapLocation = function() {
        //     var geolocation = new BMap.Geolocation();
        //     var status = geolocation.getStatus();
        //     geolocation.getCurrentPosition(function(r) {
        //         if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //             var mk = new BMap.Marker(r.point);
        //             alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        //         } else {
        //             alert('failed' + this.getStatus());
        //         }
        //     }, {
        //         enableHighAccuracy: true
        //     })
        // }
        me.autoLocation = function() {
            //routie('index');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
                setTimeout(function() {
                    if (!me.hasLoadData) {
                        locationFailed()
                    }
                }, 2000);
            } else {
                disableLocation();
            }

            function showPosition(position) {
                me.hasLoadData = true;
                var point = new BMap.Point(position.coords.longitude, position.coords.latitude)
                me.getMercator(point);
            }

            function showError(error) {
                if (error.code == error.PERMISSION_DENIED) {
                    disableLocation();
                }
            }

            function disableLocation() {
                $('.location-btn').addClass('disabled').html('当前定位未开启，请先开启定位');
            }

            function locationFailed() {
                $('#appview').trigger('locationFailed', me.hasLoadData);
            }
        }
        me.location = function() {
            //$('#suggestId').autocomplete();
            var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
                'input': 'suggestId'
            });
            ac.addEventListener('onconfirm', function(e) {
                $('#suggestId').trigger('init');
                var _value = e.item.value;
                var city = _value.city;
                var region = _value.province + _value.city + _value.district;
                var street = _value.street + _value.business;
                me.getLocationXY(region, street, city);
            });
        }
        me.history = function() {
            try {
                var history = JSON.parse(localStorage.history);
            } catch (e) {
                history = {};
            }
            return history;
        }
        me.addHistory = function(region, street) {
            var history = me.history();
            delete history[street];
            history[street] = region;
            try {

                localStorage.history = JSON.stringify(history);
            } catch(e){
                console.log('未开启本地数据库')
            }
        }
        me.getHistory = function() {
            var hasHistory = false;
            var history = me.history();
            var html = '';
            for (var prop in history) {
                hasHistory = true;
                html = '<a href="javascript:void(0)" class="history-item history-click" data-region="' + history[prop] + '">' + prop + '</a>' + html;
            }
            html += '<a href="javascript:void(0)" class="history-item history-clear">清空历史纪录</a>';
            if (!hasHistory) {
                html = '';
                //html = '<div class="no-history">还没有搜索历史纪录哦</div>';
            }
            $el.find('.search-history').html(html).css({
                'display': hasHistory
            });
        }
        me.background = function() {
            $el.headImg({
                'background-color': '#f8f8f8'
            })
        }

        bindEvents();

        function bindEvents() {
            me.$el.on('movein', function() {
                document.title = "搜索地址";
                $el.show().css({
                    'transform': 'translate3d(0,0,0)'
                })
                $("#appview").hide();
            });
            me.$el.on('moveout', function() {
                document.title = "@便利店";
                var deviceWidth = window.innerWidth + 'px';
                $el.hide().css({
                    'transform': 'translate3d(' + deviceWidth + ',0,0)'
                })
                $("#appview").show();
            });
            me.$el.on('autolocation', function() {
                me.autoLocation();
            });
            $('.location-btn').on('click', function() {
                if (!$(this).hasClass('disabled')) {
                    me.autoLocation();
                } else {
                    console.log('定位未开启');
                }
            })
            $('.search-history').on('click', '.history-clear', function(e) {
                localStorage.removeItem('history');
                me.getHistory();
            })
            $('.search-history').on('click', '.history-click', function(e) {
                var region = $(this).attr('data-region');
                var street = $(this).html();
                me.getLocationXY(region, street);
            })
            $('.search-input').on('init', function(e) {
                $(this).val('');
                $(this).trigger('blur');
            })
            $('.search-input').on('blur', function(e) {
                if ($(this).val() == '') {
                    $('.location').css('display', 'block');
                } else {
                    $('.location').css('display', 'none');
                }
            })
            $('.search-input').on('input', function(e) {
                if ($(this).val() == '') {
                    $('.location').css('display', 'block');
                } else {
                    $('.location').css('display', 'none');
                }
            })
        }

    }

    Search.prototype.init = function() {
        $('.header .title').html('搜索地址');
        this.getHistory();
        this.background();
        this.$el.trigger('movein');
        if (!this.inited) {
            this.location();
            this.inited = true;
        }
    }
    Search.prototype.$el = function() {
        return this.$el;
    }
    window.Search = Search;
})
