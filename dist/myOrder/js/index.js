function loadPageContent(token) {

    function mainFun() {  }
    mainFun.prototype = {
        flghtEndTime:'', // 拼团倒计时
        isFlght:'', // 是否是拼团商品
        orderData:{},
        orderMsg:{},
        timer :'',
        getOrder:function () {
            getData('/shop/orderGoods/getOrders',{
                data:{
                    state:null
                },
                token:token
            },function (msg) {
                console.log(msg)
                if(msg.success){
                    $('.am-tab-panel').html(' ')
                    if(msg.success && msg.data.length){
                        msg.data.forEach(function (val,ind){
                            var roderDom = '';
                            var state = val.shopOrder.state
                            switch(state){ // 订单状态 0待付款，1已支付（待发货），2已发货，3,已收货 ,4 退款
                                case 0:
                                    roderDom+="<div class='arrearageOrder goodsMsg'><h1 id="+val.shopOrder.id+">订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 1:
                                    roderDom+="<div class='notShipped goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 6:
                                    roderDom+="<div class='notShipped goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 2:
                                    roderDom+="<div class='delivered goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 3:
                                    roderDom+="<div class='complete goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 4:
                                    roderDom+="<div class='drawback goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                    state=3
                                break;
                                case 7:
                                    roderDom+="<div class='flghtIng goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                                case 8:
                                    roderDom+="<div class='flghtError goodsMsg' id="+ind+"><h1 id="+val.shopOrder.id+" class='intoDetail'>订单编号："+val.shopOrder.code+"</h1>"
                                break;
                            }
                            if(val.shopOrder.state!=8){
                                val.shopOrder.orderGoodsList.forEach(function (v,i) {
                                    if(v.goodKeys){
                                        roderDom+="<dl goodsId='"+v.goodsId+"' goodsMoney='"+val.shopOrder.payMoney+"'><dt><img src="+v.goodSamllPic+"></dt><dd><p>"+v.goodsName+"</p><p>"+v.goodKeys+"</p></dd></dl>"
                                    }else{
                                        roderDom+="<dl goodsId='"+v.goodsId+"'><dt><img src="+v.goodSamllPic+"></dt><dd><p>"+v.goodsName+"</p></dd></dl>"
                                    }
                                })
                                roderDom+="<div class='orderMsg'>共"+val.shopOrder.orderGoodsList.length+"件商品 <span>实付款：<b>￥"+val.shopOrder.payMoney+"</b></span></div>"
                                if(state==0){
                                    roderDom+="<p>剩余支付时间："+mainfun.changeTime(val.shopOrder.orderTime)+"分钟 <span class='toPay' isFlght="+val.shopOrder.isFlght+" flghtEndTime="+val.shopOrder.flghtEndTime+" id="+val.shopOrder.id+" money="+val.shopOrder.payMoney+">去付款</span></p></div>"
                                }else{
                                    roderDom+="<div class='operateOrder'><span class='orderDetail' id="+val.shopOrder.id+">订单状态</span></div>"
                                }
                                $('.tab0').append(roderDom)
                                $('.tab'+(state*1+1)).append(roderDom)
                                if(val.shopOrder.state == 6){
                                    $('.tab2').append(roderDom)
                                }
                                if(state==4){
                                    $('.tab4').append(roderDom)
                                }
                            }else{
                                console.log(val)
                                val.shopOrder.orderGoodsList.forEach(function (v,i) {
                                    if(v.goodKeys){
                                        roderDom+="<dl goodsId='"+v.goodsId+"' goodsMoney='"+val.shopOrder.payMoney+"'><dt><img src="+v.goodSamllPic+"></dt><dd><p>"+v.goodsName+"</p><p>"+v.goodKeys+"</p></dd></dl>"
                                    }else{
                                        roderDom+="<dl goodsId='"+v.goodsId+"'><dt><img src="+v.goodSamllPic+"></dt><dd><p>"+v.goodsName+"</p></dd></dl>"
                                    }
                                    roderDom+="<div class='orderMsg'>共"+val.shopOrder.orderGoodsList.length+"件商品 <span>实付款：<b>￥"+val.shopOrder.payMoney+"</b></span></div>"
                                    roderDom+="<div class='operateOrder'><span class='orderDetail' id="+val.shopOrder.id+">订单状态</span></div>"
                                })
                                $('.tab0').append(roderDom)
                            }
                        });
                    }
                }
                mainfun.addImg()
            })
        },
        changeTime:function(time){
            var timeArr = time.split('T')
            var time = new Date(timeArr[0].replace(/-/g, "/")+' '+timeArr[1]).getTime()
            var nowTime = new Date().getTime()
            var gapTime =nowTime-time
            var minite = 120-Math.floor((gapTime/1000/60) << 0); 
            return minite
        },
        addImg:function(){
            var dom = " <dl class='noneImg'><dt><img src='./imgs/noneImg.png' alt=''></dt><dd>您当前还没有订单哦</dd></dl>"
            if($('.goodsMsg').length==0){
                $('.tab0').html(dom)
            }
            if($('.arrearageOrder').length==0){
                $('.tab1').html(dom)
            }
            if($('.notShipped').length==0){
                $('.tab2').html(dom)
            }
            if($('.delivered').length==0){
                $('.tab3').html(dom)
            }
            if($('.complete').length==0 && $('.drawback').length==0 ){
                $('.tab4').html(dom)
            }
        },
        wxPay:function (type,isFlght) { // 处理微信支付重复点击
            if(type){
                shopPay(mainfun.orderMsg,function (msg) {
                    if(msg=='false'){
                        $('.paymentTyp').fadeOut(function () {
                            $('.wrap').fadeIn()
                            $('.orderNotPaid').fadeIn()
                        });
                    }else if(msg=='true'){
                        $('.paymentTyp').fadeOut(function () {
                            if(isFlght){
                                $('.wrap').fadeIn()
                                $('.customService').fadeIn()
                            }else{
                                $('.wrap').fadeIn()
                                $('.customServiceFlght').fadeIn()
                            }
                            mainfun.getOrder()
                        });
                    }
                })
            }else{
                $('.typeWX').unbind('click')
                $('.typeWX').one('click',function () {
                    mainfun.orderMsg.payType = 0
                    shopPay(mainfun.orderMsg,function (msg) {
                        if(msg=='false'){
                            $('.paymentTyp').fadeOut(function () {
                                $('.wrap').fadeIn()
                                $('.orderNotPaid').fadeIn()
                            });
                        }else if(msg=='true'){
                            $('.paymentTyp').fadeOut(function () {
                                if(isFlght){
                                    $('.wrap').fadeIn()
                                    $('.customService').fadeIn()
                                }else{
                                    $('.wrap').fadeIn()
                                    $('.customServiceFlght').fadeIn()

                                }
                                mainfun.getOrder()
                            });
                        }
                    })
                })
                $('.typeZFB').unbind('click')
                $('.typeZFB').one('click',function () {
                    mainfun.orderMsg.payType = 1
                    shopPay(mainfun.orderMsg,function (msg) {
                        if(msg=='false'){
                            $('.paymentTyp').fadeOut(function () {
                                $('.wrap').fadeIn()
                                $('.orderNotPaid').fadeIn()
                            });
                        }else if(msg=='true'){
                            $('.paymentTyp').fadeOut(function () {
                                if(isFlght){
                                    $('.wrap').fadeIn()
                                    $('.customService').fadeIn()
                                }else{
                                    $('.wrap').fadeIn()
                                    $('.customServiceFlght').fadeIn()

                                }
                                mainfun.getOrder()
                            });
                        }
                    })
                })
            }
        },
        // 请求出错
        falseAjax:function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click',function () {
                // window.loadPageContent(token)
                // $('.falseAjax').fadeOut()
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
    }
    var mainfun = new mainFun()
    mainfun.getOrder()
    $('.am-tab-panel').on('click','.arginBuy',function () {
        console.log($(this).parents('.goodsMsg').attr('id'))
    })
    $('.am-tabs-bd').on('click','.intoDetail',function () {
        window.location.href="../orderStatus/index.html?id="+$(this).attr('id')
    })
    $('.am-tabs-bd').on('click','.orderDetail',function () {
        window.location.href="../orderStatus/index.html?id="+$(this).attr('id')
    })
    $('.am-tabs-bd').on('click','.toPay',function () {
        if (/(LKHDAPP)/i.test(navigator.userAgent)) { // 判断App
            $('.wrap').fadeIn()
            $('.paymentTyp').fadeIn()
            if($(this).attr('isflght')==1){
                mainfun.isFlght = 1
                mainfun.flghtEndTime = new Date($(this).attr('flghtEndTime').replace(/-/g,'/').replace(/T/g,' ')).getTime()
                console.log(mainfun.flghtEndTime)
                clearInterval(mainfun.timer)
                mainfun.setEndTime()
                mainfun.timer = setInterval(function(){
                    mainfun.setEndTime()
                }, 1000);
                mainfun.orderMsg={
                    id:$(this).attr('id'),
                    payType:0,
                    payMoney:$(this).attr('money')
                }
                mainfun.wxPay()
            }else{
                mainfun.isFlght = 0
                mainfun.orderMsg={
                    id:$(this).attr('id'),
                    payType:0,
                    payMoney:$(this).attr('money')
                }
                mainfun.wxPay(0,1)
            }
        }else if(wechat){// 判断小程序
            getData('/pay/payOrderByWechat',{
                data:{
                    id:$(this).attr('id'),
                    payCoin:0,
                    payMoney:$(this).attr('money'),
                    payType:3
                },
                token:token
            },function (res) {
                if(res.code==200){
                    var data = JSON.parse(res.data)
                    console.log(data)
                    var newData = '?appid='+data.appId+'&noncestr='+data.nonceStr+'&sign='+data.paySign+'&timestamp='+data.timeStamp+'&prepayid='+data.package+'&signType='+data.signType
                    console.log(newData)
                    wx.miniProgram.redirectTo({
                        url:'/pages/payOrder/payOrder'+newData,
                        success: function(){
                            console.log('success')
                        },
                        fail: function(){
                            console.log('fail');
                        },
                        complete:function(){
                            console.log('complete');
                        }
                    });
                }
            })
        }
       
        
    })
   
    $('#submitOrderClose').on('click',function () {
        $('.paymentTyp').fadeOut()
        $('.wrap').fadeOut()
    })
    $('.continuePay').on('click',function () {
        $('.wrap').hide()
        $('.orderNotPaid').hide()
        mainfun.wxPay(1)
    })
    $('#customServiceClose,.leave , #customServiceFlghtClose').on('click',function () {
        if(/(LKHDAPP)/i.test(navigator.userAgent)){
            refresh()
        }else{
            window.history.back(window.history.length)
        }
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
    $('.am-tabs').on('click','dl',function () {
        var goodsId = $(this).attr('goodsId')
        window.location.href = '../goodsDetail/index.html?id='+goodsId
    })
}
