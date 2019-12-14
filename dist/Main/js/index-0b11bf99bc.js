function loadPageContent(token) {
var mescroll = ''
var width = window.screen.width * 0.9
    var mySwiper = ''
    function mainFun() { }
    mainFun.prototype = {
        pageNum: 0,
        pageSize: 10,
        tabId:0,
        getData: function (callback) {
            getData('/shop/goods/getShopGoodsNew', {
                data: {
                    id: 1,
                    shopType: 2
                }
            }, function (msg) {
                if (msg.code == 200) {
                    if(callback){
                    }else{
                        mainfun.initTab(msg.data.goodsCategories,true)
                    }
                    var specialtyListDom = ''
                    var bannerList = ''
                    $('.searchPlac').html(msg.data.defaultValue)
                    $('.scrollBox>.searchBox').show()
                    msg.data.museums.forEach(function (item, index) {
                        specialtyListDom += '<img src="' + item.samllPicUrl + '" specialtyId="' + item.id + '">'
                    })
                    $('.specialtyList').html(specialtyListDom)
                    $('.specialtyImg').attr('src', msg.data.middlePic.picUrl)
                    msg.data.topPics.forEach(function (item, index) {
                        var linkUrl = item.linkUrl ? item.linkUrl : "javascript:;"
                        bannerList += "<li class='swiper-slide'><img src='" + item.picUrl + "' linkUrl='" + linkUrl + "'></li>"
                    })
                    $('.swiper-wrapper').html(bannerList)
                    mySwiper = new Swiper('.swiper-container', {
                        loop: true,
                        autoplay: {
                            disableOnInteraction: false // 用户操作后不停止轮播
                        },
                        pagination: {
                            el: '.swiper-pagination',
                        },
                    })
                    callback && callback()
                }
            })
            getData('/shop/goods/queryCart', {
                data: {
                    shopType: 2
                },
                token: token
            }, function (msg) {
                if (msg.success && msg.data.length) {
                    $('#floatShopCar b').html(msg.data.length)
                }
            })
        },
        initTab: function (data,type) { // 初始化tab切换
            var dom = '';
            data.forEach(function (item, index) {
                if (index == 0) {
                    dom += "<span class='thisTab' tabId='" + item.id + "'>" + item.name + "</span>"
                    mainfun.tabId = item.id
                    mescroll = new MeScroll("mescroll", {
                        down: {
                            auto: false,
                            callback: downCallback //下拉刷新的回调
                        },
                        up: {
                            callback: upCallback, //上拉加载的回调
                            isBounce:false,
                            showNoMore: function(mescroll, upwarp) {
                                console.log("up --> showNoMore");
                                //无更多数据
                                upwarp.innerHTML = mescroll.optUp.htmlNodata;
                            },
                        }
                    });
                } else {
                    dom += "<span tabId='" + item.id + "'>" + item.name + "</span>"
                }
            })
            $('.scri').html(dom)
        },
        tabCli: function () {
            getData('/shop/goods/getCategoryGoodsNew', {
                data: {
                    id: mainfun.tabId
                },
                pageNum: mainfun.pageNum,
                pageSize:mainfun.pageSize,
            }, function (msg) {
                if (msg.code == 200 && msg.data.records.length) {
                    $('.tabCont').html(' ')
                    var data = msg.data.records
                    var goodsDom = "";
                    data.forEach(function (v, i) {
                        var className = '';
                        if (v.flghtNum == 2) {
                            className = 'redBg'
                        } else if (v.flghtNum == 3) {
                            className = 'yellowBg'
                        } else if (v.flghtNum == 5) {
                            className = 'blueBg'
                        }
                        var specialtyDom = ''
                        if (v.specialtyName) {
                            specialtyDom = "<span>" + v.specialtyName + "</span>"
                        }
                        goodsDom += "<div class='classifyList'><dl id=" + v.id + "><dt><span class='" + className + "'></span><img class='lazy' data-original=" + v.goodsSamllPic + "></dt><dd><p>" + specialtyDom + v.goodsName + "</p>";
                        if (v.goodsOriginalPrice) {
                            goodsDom += "<p>" + v.goodsMoney + "<s>" + v.goodsOriginalPrice + "元</s></p></dd></dl>"
                        } else {
                            goodsDom += "<p>" + v.goodsMoney + "</p></dd></dl>"
                        }
                        goodsDom += "</div></div>"
                    });
                    $('.tabCont').html(goodsDom)
                    $("img.lazy").lazyload( // 懒加载
                        {
                            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 透明placeholder
                            effect: "fadeIn",
                            threshold: 0,
                            container: '.main'
                        });
                }else{
                    $('.tabCont').html("<dl class='goodsNomal'><dt><img src='./imgs/goodsNomalImg.png'></dt><dd>当前分类还没有商品哦~</dd></dl>")
                }

            })
        },
        // 点击登陆事件
        checkTokenRedirect: function (url, callback) {
            if (/(LKHDAPP)/i.test(navigator.userAgent)) {
                protocol.getToken(function (token) {
                    if (!token) {
                        layer.confirm('此功能需要登录，是否前往登录?', { title: '提示' }, function (index) {
                            if (index) {
                                protocol.jumpLoginController(function (deviceInfo) {
                                    setTimeout(function () {
                                        window.location.href = (url + "").replace("{token}", token);
                                    }, 1000)
                                });
                            }
                            layer.close(index);
                        });
                        return false;
                    } else {
                        if (callback) {
                            callback()
                        }
                    }
                });
            } else if (wechat) {
                callback && callback()
            } else {
                layer.confirm('此功能需要登录，是否前往应用商店下载App?', { title: '提示' }, function (index) {
                    if (index) {
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.lkhd&channel=0002160650432d595942&fromcase=60001'
                        return false;
                    }
                    layer.close(index);
                });
                return false;
            }
        },
        // 请求出错
        falseAjax: function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click', function () {
                window.loadPageContent(token)
                $('.falseAjax').fadeOut()
            })
        }
    }
    var mainfun = new mainFun()
    mainfun.getData()
    $('.tabCont').on('click', '.classifyList dl', function () {
        var id = $(this).attr('id')
        window.location.href = '../goodsDetail/index.html?id=' + id
    })
    $('.classifyList').on('click', '.goodsCategorys', function () {
        var titleTxt = encodeURI(encodeURI($(this).html()))
        if (wechat) {
            window.location.href = '../listDetail/index.html?wechat=1&id=' + $(this).attr('id') + '&title=' + titleTxt
        } else {
            window.location.href = '../listDetail/index.html?id=' + $(this).attr('id') + '&title=' + titleTxt
        }
    })
    $('#floatShopCar').on('click', function () {
        console.log(navigator.userAgent)
        mainfun.checkTokenRedirect(window.location.href, function () {
            window.location.href = '../shopCart/index.html'
        })
    })
    var clipboard = new ClipboardJS('.copyBtn');
    clipboard.on('success', function () {
        $(".alertMsg").html('复制成功').slideDown()
        setTimeout(function () {
            $(".alertMsg").slideUp();
        }, 3000);
    })
    clipboard.on('error', function () {
        $(".alertMsg").html('复制失败').slideDown()
        setTimeout(function () {
            $(".alertMsg").slideUp();
        }, 3000);
    });
    $('.lotteryWechatBtn').on('click', function () {
        $('.lotteryWechat').fadeOut()
        $('.lotteryMark').fadeOut()
    })
    $('.lotteryWechatBtn').on('click', function () {
        $('.wechatAlert').fadeOut()
        $('.wrap').fadeOut()
    })

    // 新版
    $('.main').scroll(function () {
        var position = $('.tab').offset().top
        if (position <= 60) {
            $('.scri').addClass('scriFixed')
            $('.scri1').show()
            $('.tab .searchBox').show()
            if(mainfun.mainTop && mainfun.mainTop!=0){
            }else{
                mainfun.mainTop = $('.main').scrollTop()
            }
        } else {
            $('.scri').removeClass('scriFixed')
            $('.scri1').hide()
            $('.tab .searchBox').hide()
            $('.tabCont').css({'top':'0'})
            mainfun.mainTop = 0
        }
    })
    $('.banner').on('click', 'img', function () {
        var linkUrl = $(this).attr('linkUrl')
        if (linkUrl) {
            window.location.href = linkUrl
        }
    })
    $('.scri').on('click', 'span', function () {
        var parentNode = $('.scri')
        $(this).addClass('thisTab').siblings().removeClass('thisTab')
        if($('.scri').hasClass('scriFixed')){
            $('.main').scrollTop(
                mainfun.mainTop
            )
        }
        $('.tabCont').html(' ')
        mainfun.tabId = $(this).attr('tabId')
        var j = $(this).index();
        if ($(this).offset().left <= 0) {
            parentNode.stop().animate({
                scrollLeft: parentNode.scrollLeft() - 20 + $(this).offset().left// 核心代码
            }, 400);
        } else if ($(this).offset().left >= width) {
            parentNode.stop().animate({
                scrollLeft: parentNode.scrollLeft() + $(this).width()// 核心代码
            }, 400);
        }
        mainfun.pageNum = 0
        mescroll.resetUpScroll();
    })
    $('.searchBox').on('click', function () {
        var data = encodeURIComponent(encodeURIComponent($('.searchPlac').html()))
        window.location.href = '../search/index.html?searchName=' + data
    })
    $('.specialtyList ').on('click', 'img', function () {
        var specialtyId = $(this).attr('specialtyId')
        window.location.href = '../specialtyHall/index.html?specialtyId=' + specialtyId
    })
  
    //上拉加载的回调 
    function upCallback(page) {
        console.log('upCallback');
        mainfun.pageNum++
        getListDataFromNet(function (curPageData) {
            mescroll.endSuccess(curPageData.length);
            creatDom(curPageData)
        })
    }
    //下拉刷新的回调
    function downCallback() {
        mainfun.pageNum = 0
        mySwiper.destroy(false)
        mainfun.getData(function () {
            setTimeout(function() {
                mescroll.endSuccess();
            }, 1000);
        })
    }
    // 创建dom
    function creatDom(curPageData) {
        console.log(curPageData.length,mainfun.pageNum)
        if(curPageData.length){
            var data = curPageData
            var goodsDom = "";
            data.forEach(function (v, i) {
                var className = '';
                if (v.flghtNum == 2) {
                    className = 'redBg'
                } else if (v.flghtNum == 3) {
                    className = 'yellowBg'
                } else if (v.flghtNum == 5) {
                    className = 'blueBg'
                }
                var specialtyDom = ''
                if (v.specialtyName) {
                    specialtyDom = "<span>" + v.specialtyName + "</span>"
                }
                goodsDom += "<div class='classifyList'><dl id=" + v.id + "><dt><span class='" + className + "'></span><img class='lazy' data-original=" + v.goodsSamllPic + "></dt><dd><p>" + specialtyDom + v.goodsName + "</p>";
                if (v.goodsOriginalPrice) {
                    goodsDom += "<p>" + v.goodsMoney + "<s>" + v.goodsOriginalPrice + "元</s></p></dd></dl>"
                } else {
                    goodsDom += "<p>" + v.goodsMoney + "</p></dd></dl>"
                }
                goodsDom += "</div></div>"
            });
            $('.tabCont').append(goodsDom)
            $("img.lazy").lazyload( // 懒加载
            {
                placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 透明placeholder
                effect: "fadeIn",
                threshold: 0,
                container: '.main'
            });
        }else{
            if($('.tabCont').find('.classifyList').length){
            }else{
                $('.tabCont').html("<dl class='goodsNomal'><dt><img src='./imgs/goodsNomalImg.png'></dt><dd>当前分类还没有商品哦~</dd></dl>")
            }
        }
    }
    function getListDataFromNet(callback) {
        var goodsData = [];
        getData('/shop/goods/getCategoryGoodsNew', {
            data: {
                id: mainfun.tabId
            },
            pageNum: mainfun.pageNum,
            pageSize:mainfun.pageSize,
        }, function (msg) {
            console.log(msg)
            if (msg.code == 200) {
                goodsData = msg.data.records
                callback(goodsData)
            }
        })
    }
}
