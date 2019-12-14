function loadPageContent(token) {
    var width = window.screen.width*0.7
    function mainFun() {  }
    mainFun.prototype = {
        specialtyId:getUrlParam('specialtyId'),
        getData:function () {
            getData('/shop/goodsSpecialtyMuseum/queryHomeSpecialty',{
                data:mainfun.specialtyId,
                token:token
            },function (msg) {
                console.log(msg)
                document.title = msg.data.goodsSpecialtyMuseum.specialtyName
                $('.searchPlac').html(msg.data.goodsSpecialtyMuseum.defaultValue)
                $('.searchBox').show()
                $('.bgPicUrl').attr('src',msg.data.goodsSpecialtyMuseum.bgPicUrl)
                mainfun.initTab(msg.data.goodsCategoryList)
            })
            getData('/shop/goods/queryCart',{
                data:{
                    shopType:2
                },
                token:token
            },function (msg) {
                if(msg.success && msg.data.length){
                    $('#floatShopCar b').html(msg.data.length)
                }
            })
        },
        initTab:function (data) {
            var dom = ''
            data.forEach(function (item,index) {
                if(index==0){
                    dom+="<span class='thisTab' tabId='"+item.id+"'>" + item.name + "</span>"
                    mainfun.tabCli(item.id)
                }else{
                    dom+="<span tabId='"+item.id+"'>" + item.name + "</span>"
                }
            })
            $('.scri').html(dom)
        },
        tabCli:function (id) {
            getData('/shop/goods/getCategoryGoodsNew',{
                data:{
                    id:id,
                    specialtyId:mainfun.specialtyId
                }
            },function (msg) {
                if(msg.code == 200){
                    var data = msg.data.records
                    var goodsDom = "";
                    data.forEach(function(v,i) {
                        var className = '';
                        if(v.flghtNum==2){
                            className = 'redBg'
                        }else if(v.flghtNum == 3){
                            className = 'yellowBg'
                        }else if(v.flghtNum == 5){
                            className = 'blueBg'
                        }
                        goodsDom +="<div class='classifyList'><dl id="+v.id+"><dt><span class='"+className+"'></span><img class='lazy' data-original="+v.goodsSamllPic+"></dt><dd><p>"+v.goodsName+"</p>";
                        if(v.goodsOriginalPrice){
                            goodsDom+="<p>"+v.goodsMoney+"<s>"+v.goodsOriginalPrice+"元</s></p></dd></dl>"
                        }else{
                            goodsDom+="<p>"+v.goodsMoney+"</p></dd></dl>"
                        }
                        goodsDom+="</div></div>"
                    });
                    $('.tabCont').html(goodsDom)
                    $("img.lazy").lazyload( // 懒加载
                        {
                            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 透明placeholder
                            effect: "fadeIn",
                            threshold:0,
                            container :'.main'
                        }
                    );
                }
            })
        },
        // 点击登陆事件
        checkTokenRedirect: function (url,callback){
            if (/(LKHDAPP)/i.test(navigator.userAgent)) {
                protocol.getToken(function(token){
                    if(!token){
                            layer.confirm('此功能需要登录，是否前往登录?', {title:'提示'}, function(index){
                                if(index){
                                    protocol.jumpLoginController(function(deviceInfo){
                                        setTimeout(function () {
                                            window.location.href =  (url+"").replace("{token}",token);
                                        },1000)
                                    });
                                }
                                layer.close(index);
                            });
                            return false;
                    } else {
                        if(callback){
                            callback()
                        }
                    }
                });
            }else if(wechat){
                callback && callback()
            } else {
                layer.confirm('此功能需要登录，是否前往应用商店下载App?', {title:'提示'}, function(index){
                    if(index){
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.lkhd&channel=0002160650432d595942&fromcase=60001'
                        return false;
                    }
                    layer.close(index);
                });
                return false;
            }
        },
        // 请求出错
        falseAjax:function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click',function () {
                window.loadPageContent(token)
                $('.falseAjax').fadeOut()
            })
        }
    }
    var mainfun = new mainFun()
    mainfun.getData()
    $('.scri').on('click','span',function () {
        var parentNode = $( '.scri' )
        $(this).addClass('thisTab').siblings().removeClass('thisTab')
        mainfun.tabCli($(this).attr('tabId'))
        console.log($(this).offset().left)
        var j = $(this).index();
        if($(this).offset().left<=15){
            parentNode.stop().animate({
                scrollLeft : parentNode.scrollLeft()-40 + $(this).offset().left// 核心代码
            },400);
        }else if($(this).offset().left>=width){
            parentNode.stop().animate({
                scrollLeft : parentNode.scrollLeft() + $(this).width()// 核心代码
            },400);
        }
    })
    $('.tabCont').on('click','dl',function () {
        var id= $(this).attr('id')
        window.location.href = '../goodsDetail/index.html?id='+id
    })
    $('.searchBox').on('click',function () {
        var data = encodeURIComponent(encodeURIComponent($('.searchPlac').html()))
        window.location.href = '../search/index.html?searchName='+data
    })
    $('#floatShopCar').on('click',function () {
        mainfun.checkTokenRedirect(window.location.href,function () {
            window.location.href = '../shopCart/index.html'
        })
    })
}
