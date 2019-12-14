function loadPageContent(token) {
    function mainFun() {  }
    mainFun.prototype = {
        userId:getUrlParam('userId'),
        goodsId:getUrlParam('goodsId'),
        getUserMsg:function () { // 获取用户头像
            getData('/main/userInvitation/findUserById',{
                data:mainfun.userId,
                token:token
            },function (msg) {
                if(msg.code == 200){
                    $('.headImg').attr('src',msg.data.headimgUrl)
                }
            })
        },
        getFlghtGoodsMsg:function () { // 获取拼团商品信息
            getData('/shop/goods/getGoods',{
                data:{
                    id:mainfun.goodsId
                },
                token:token
            },function (msg) {
                if(msg.code == 200){
                    $('.goods img').attr('src',msg.data.goodsSamllPic) // 商品图片
                    $('.originalCost').html('原价：'+msg.data.goodsOriginalPrice) // 原价
                    $('.currentPrice').html('拼团价：'+msg.data.goodsMoney) // 拼团价
                    $('.goods h1').html(msg.data.goodsName) // 商品名称
                }
            })
        },
        getRecommendGoods:function () { // 获取推荐商品
            getData('/shop/goods/recommendGoods',{
                data:{
                    num:4
                }
            },function (msg) {
                console.log(msg)
                if(msg.code == 200){
                    var goodsDom = ''
                    msg.data.forEach(function (item,index) {
                        goodsDom +="<dl id="+item.id+" class='intoApp'><dt><img src="+item.goodsSamllPic+"></dt><dd><p>"+item.goodsName+"</p>";
                        if(item.goodsKeys){
                            goodsDom+="<p>"+item.goodsKeys+"</p>"
                        }else{
                            goodsDom+="<p>暂无说明</p>"
                        }
                        if(item.goodsOriginalPrice){
                            goodsDom+="<p>￥"+item.goodsMoney+"<s>"+item.goodsOriginalPrice+"元</s></p></dd></dl>"
                        }else{
                            goodsDom+="<p>￥"+item.goodsMoney+"</p></dd></dl>"
                        }
                    })
                    $('.classifyList').html(goodsDom)
                }
            })
        },
        // 点击登陆事件
        checkTokenRedirect: function (callback){
            var data = OpenInstall.parseUrlParams();//openinstall.js中提供的工具函数，解析url中的所有查询参数
            new OpenInstall({
                /*appKey必选参数，openinstall平台为每个应用分配的ID*/
                appKey : "fd3al3",
                /*openinstall初始化完成的回调函数，可选*/
                onready : function() {
                    var m = this
                    m.wakeupOrInstall(callback);
                    /*在app已安装的情况尝试拉起app*/
                    m.schemeWakeup(callback);
                }
            }, data);
        },
        intoAppToShopDetail:function (id) {
            var url = ''
            var goodsId =encodeURIComponent('?id=' + id)
            if(pro){
                url= 'http://constant-info.lingkehudong.com/3.0H5/app-mall/goodsDetail/index.html'+goodsId
            }else{
                url='http://constant-info-dev.lingkehudong.com/app-mall/goodsDetail/index.html'+goodsId
            }
            intoApp.appQuery = "http://protocol?iC=BaseWebViewVC&aA=BaseWebActivity&URL="+url
            intoApp.url='/downloadApp/index.html'
            intoApp.intoAppFun()
        }
    }
    var mainfun = new mainFun()
    mainfun.getUserMsg()
    mainfun.getFlghtGoodsMsg()
    mainfun.getRecommendGoods()
    $('.headImgNone').on('click',function () {
        mainfun.intoAppToShopDetail(mainfun.goodsId)
    })
    $('.intoFlght').on('click',function () {
        mainfun.intoAppToShopDetail(mainfun.goodsId)
    })
    $('.classifyList').on('click','dl',function () {
        var id = $(this).attr('id')
        mainfun.intoAppToShopDetail(id)
    })

  
}

  