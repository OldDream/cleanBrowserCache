function loadPageContent(token) {

    function mainFun() {  }
    mainFun.prototype = {
        flghtEndTime:'',
        getData:function () {
            getData('/shop/orderGoods/getOrderDetail',{
                data:{
                    id:getUrlParam('id')
                },
                token:token
            },function(msg){
                console.log(msg)
                if(msg.success){
                    var goodsMsg = msg.data.shopOrder.orderGoodsList[0]
                    var orderTime = msg.data.shopOrder.orderTime.split('T');
                    var orderCode = msg.data.shopOrder.code;
                    var shipTime = msg.data.shopOrder.shipTime;
                    var logisticsCode = msg.data.shopOrder.logisticsCode?msg.data.shopOrder.logisticsCode:'';
                    var timeArr = shipTime?shipTime.replace('T',' '):''
                    var logisticsCompany = msg.data.shopOrder.logisticsCompany?msg.data.shopOrder.logisticsCompany:'暂无';
                    if(msg.data.shopOrder.isFlght){
                        mainfun.flghtEndTime =new Date(msg.data.shopOrder.flghtEndTime.replace(/-/g,'/').replace(/T/g,' ')).getTime()
                    }
                    mainfun.goodsId = msg.data.shopOrder.orderGoodsList[0].goodsId
                    switch(msg.data.shopOrder.state){
                        case 0:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.orderInformation').addClass('thisType');
                            break;
                        case 1:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.shippingStatu div').html('您的订单 正在发货')
                            $('.shippingStatu').addClass('thisType');
                        break;
                        case 6:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.shippingStatu div').html('您的订单 正在发货')
                            $('.shippingStatu').addClass('thisType');
                        break;
                        case 2:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.shippingStatu div').html('您的订单 已发货')
                            $('.delivered div').html("<p>您的订单 已于"+timeArr+"发货成功</p><p>物流单号："+logisticsCode+"</p><p><span class='cloneCode' data-clipboard-text="+msg.data.shopOrder.logisticsCode+">复制物流单号</span></p><p>快递公司："+logisticsCompany+"</p><p>请保持您的手机畅通注意查收。</p>")
                            $('.delivered').addClass('thisType');
                        break;
                        case 3:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.shippingStatu div').html('您的订单 已发货')
                            $('.delivered div').html("<p>您的订单 已于"+timeArr+"发货成功</p><p>物流单号："+logisticsCode+"</p><p><span class='cloneCode' data-clipboard-text="+msg.data.shopOrder.logisticsCode+">复制物流单号</span></p><p>快递公司："+logisticsCompany+"</p><p>请保持您的手机畅通注意查收。</p>")
                            $('.complete').addClass('thisType');
                            $(".complete div").html('您的订单已经完成')
                        break;
                        case 4:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.shippingStatu div').html('您的订单 已发货')
                            $('.delivered div').html("<p>您的订单 已于"+timeArr+"发货成功</p><p>物流单号："+logisticsCode+"</p><p><spa class='cloneCode'n data-clipboard-text="+msg.data.shopOrder.logisticsCode+">复制物流单号</span></p><p>快递公司："+logisticsCompany+"</p><p>请保持您的手机畅通注意查收。</p>")
                            $('.complete').addClass('thisType');
                            $(".complete div").html('您的订单已经完成')
                        break;
                        case 7:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.orderInformation').addClass('thisType');
                            $('.flghtIng').css({'display':'flex'}).addClass('thisType')
                            $('.shippingStatu').hide()
                        break;
                        case 8:
                            $('.orderInformation div').html('您于'+orderTime[0]+'确认下单，订单号'+orderCode)
                            $('.orderInformation').addClass('thisType');
                            $('.flghtError').css({'display':'flex'}).addClass('thisType')
                            $('.shippingStatu').hide()
                        break;
                    }
                    if(msg.data.shopOrder.orderGoodsList.length==1){
                        $('.orderStatus img').attr('src',goodsMsg.goodSamllPic)
                        $('.goodsName').html(goodsMsg.goodsName)
                        $('.goodsMoney').html(goodsMsg.goodMoney?goodsMsg.goodMoney+'元':goodsMsg.goodsOriginalPrice+'元')
                    }else{
                        var orderDom = ''
                        msg.data.shopOrder.orderGoodsList.forEach(function(v,i) {
                            var money = v.goodMoney?v.goodMoney+'元':v.goodsOriginalPrice+'元'
                            orderDom+="<dl class='orderStatus'><dt><img src="+v.goodSamllPic+"></dt><dd><p class='goodsName'>"+v.goodsName+"</p><p class='goodsMoney'>"+money+"</p></dd></dl>"
                        });
                        $('#orderStatus').html(orderDom)
                    }
                    var clipboard1 = new ClipboardJS('.cloneCode');
                    clipboard1.on('success',function () {
                        $(".alertMsg").html('复制物流单号成功').slideDown() 
                        setTimeout(function() {
                            $(".alertMsg").slideUp();
                        }, 3000);
                    })
                }else{
                    mainfun.falseAjax()
                }
            })
            getData('/main/sysConfigure/getSysConfigure',{
                data:{
                    key:'SHOP_MAll'
                },
                token:token
            },function (msg) {
                console.log(msg)
                if(msg.success){
                    $('#ad').attr('src',msg.data.configValue)
                }
            })
        },
        // 请求出错
        falseAjax:function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click',function () {
                window.location.href=''
            })
        },
        setEndTime:function () { // 设置到期时间
            var timeText='';
            var timer = mainfun.flghtEndTime - new Date().getTime()
            var days    = Math.floor(timer / 1000 / 60 / 60 / 24);
            var hours    = Math.floor(timer/ 1000 / 60 / 60 - (24 * days));
            var minutes   = Math.floor(timer / 1000 /60 - (24 * 60 * days) - (60 * hours));
            var seconds   = Math.floor(timer/ 1000 - (24 * 60 * 60 * days) - (60 * 60 * hours) - (60 * minutes));
            if(days){
                timeText+=days+'天'
            }
            if(hours){
                timeText+=hours+'小时'
            }
            if(minutes){
                timeText+=minutes+'分钟'
            }
            if(seconds){
                timeText+=seconds+'秒'
            }
            $('#remainingTime').html(timeText)
        },
        getUserId:function () {
            getData('/main/userInvitation/findUserByToken',{
                data:token
            },function (msg) {
                if(msg.code == 200){
                    mainfun.userId = msg.data.id
                }
            })
        }
    }
    var mainfun = new mainFun()
    mainfun.getData()
    mainfun.getUserId()
    var clipboard = new ClipboardJS('.cloneWX');
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
    $('.showFlghtDetail').on('click',function () {
        $('.wrap').fadeIn()
    })
    $('#customServiceClose').on('click',function () {
        $('.wrap').fadeOut()
    })
    $('.shareBtn').on('click',function () {
        var urlData = '?goodsId='+mainfun.goodsId+'&userId='+mainfun.userId
        shareBtn(0,"jzzp_fight",urlData)
    })
}
