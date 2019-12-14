function loadPageContent(token) {

    function mainFun() {  }
    mainFun.prototype = {
        id:getUrlParam('id'),        
        isShare:getUrlParam('isShare'),
        titleText:decodeURI(decodeURI(getUrlParam('title'))),
        getData:function () {
            getData('/shop/goods/getCategoryGoods',{
                data:{
                    id:mainfun.id
                },
                pageSize:999,
                token:token
            },function (msg) {
                console.log(msg)
                var data = msg.data.records
                var goodsDom=''
                data.forEach(function(v,i) {
                    if(v.goodsKeys){
                        goodsDom +="<dl id="+v.id+"><dt><img  class='lazy' data-original="+v.goodsSamllPic+"></dt><dd><p>"+v.goodsName+"</p><p>"+v.goodsKeys+"</p>";
                    }else{
                        goodsDom +="<dl id="+v.id+"><dt><img  class='lazy' data-original="+v.goodsSamllPic+"></dt><dd><p>"+v.goodsName+"</p><p>暂无说明</p>";
                    }
                    if(v.goodsOriginalPrice){
                        goodsDom+="<p>￥"+v.goodsMoney+"<s>"+v.goodsOriginalPrice+"元</s></p></dd></dl>"
                    }else{
                        goodsDom+="<p>￥"+v.goodsMoney+"</p></dd></dl>"
                    }
                });
                $('.classifyList').html(goodsDom)
                $("img.lazy").lazyload( // 懒加载
                    {
                        placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 透明placeholder
                        effect: "fadeIn",
                        threshold:10,
                    }
                );
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
            $('.main>h1').html(mainfun.titleText)
        },
        checkTokenRedirect: function (url,callback){  // 点击登陆事件
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
        }
    }
    var mainfun = new mainFun()
    mainfun.getData()
    $('.classifyList').on('click','dl',function () {
        var id= $(this).attr('id')
        if(mainfun.isShare){
            window.location.href = '../goodsDetail/index.html?id='+id+"&isShare=true"
        }else{
            window.location.href = '../goodsDetail/index.html?id='+id
        }
    })
    $('#floatShopCar').on('click',function () {
        mainfun.checkTokenRedirect(window.location.href,function () {
            window.location.href = '../shopCart/index.html'
        })
    })
    var clipboard = new ClipboardJS('.copyBtn');
    clipboard.on('success',function () {
        $(".alertMsg").html('复制成功').slideDown() 
        setTimeout(function() {
            $(".alertMsg").slideUp();
        }, 3000);
    })
    clipboard.on('error', function() {
        $(".alertMsg").html('复制失败').slideDown()
        setTimeout(function() {
            $(".alertMsg").slideUp();
        }, 3000);
    });
    $('.lotteryWechatBtn').on('click',function () {
        $('.wechatAlert').fadeOut()
        $('.wrap').fadeOut()
    })
}
