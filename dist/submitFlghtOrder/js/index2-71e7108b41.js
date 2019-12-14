function loadPageContent(token) {
    var one = 1;
    function mainFun() {  }
    mainFun.prototype = {
        isShow:0,
        orderMsg:JSON.parse(sessionStorage.getItem('orderMsg')), // 获取本地存储里的数据
        payMsg:{}, // 付款信息 需传给客户端
        couponArr:[], //  优惠券数组
        moneyArr:[],
        selectGood:'',
        flghtEndTime:'',
        aginClick:true,
        goodsId:'',
        userId:'',
        pushDom:function () {
            mainfun.orderMsg.shopType=2
            mainfun.flghtEndTime =new Date(mainfun.orderMsg.orderBeforeCommitVos[0].goodsList[0].flghtEndTime.replace(/-/g,'/').replace(/T/g,' ')).getTime()
            var goodsDom="<div class='goods'>"
            mainfun.orderMsg.orderBeforeCommitVos[0].goodsList.forEach(function (val,ind) {
                console.log(val)
                mainfun.goodsId = val.id
                var goodsMoney = val.goodsMoney
                var labelArr = val.labelName?val.labelName.split(','):''
                var specialtyDom = ''
                var labelDom = ''
                if(val.specialtyName){
                    specialtyDom = "<span>"+val.specialtyName+"</span>"
                }
                if(labelArr.length){
                    labelDom = '<p class="label">'
                    labelArr.forEach(function (item,index) {
                        labelDom+='<span>'+item+'</span>'
                    })
                    labelDom += '</p>'
                }
                var className = 'redBg';
                if(val.flghtNum==2){
                    className = 'redBg'
                }else if(val.flghtNum == 3){
                    className = 'yellowBg'
                }else if(val.flghtNum == 5){
                    className = 'blueBg'
                }
                goodsDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'><span class='"+className+"'></span></dt><dd><p>"+specialtyDom + val.goodsName + "</p><p>" + val.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl>");
                $('.money').html(val.goodsMoney)
                $('.preferential').html(val.goodsOriginalPrice)
            })
            $('.goodsList').html(goodsDom)
            mainfun.isShow++;
            if(mainfun.isShow >1){
                $('.main').show()
            }
        },
        getAddress:function () { // 获取用户地址
            getData('/main/appUserAddress/getmyreceivelist',{
                data:{},
                token:token
            },function (msg) {
                if(msg.success){
                    if(msg.data.length){
                        msg.data.forEach(function (val,ind) {
                            if(val.isDefault){
                                mainfun.orderMsg.appUserAddress = val
                                $('.address').html("<p class='userName'>"+val.userName+"<span class='userPhone'>"+val.userPhone+"</span></p><p class='userNewAdd'>"+val.province+val.city+val.areaInfo+val.receiveAddress+"</p>")
                            }
                        })
                        $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
                    }else{
                        $('.address').html("<p>暂无地址可用</p><p>请添加有效地址</p>")
                        $('#submitOrderBtn').addClass('noneAdd')
                    }
                    mainfun.isShow++;
                    if(mainfun.isShow >1){
                        $('.main').show()
                    }
                }
            })
        },
        wxPay:function (type) { // 处理微信支付重复点击
            if(type){
            window.shopPay(mainfun.payMsg,function (msg) { //调用客户端
                $(".loading").fadeOut('fast').html('')
                    if(msg=='false'){
                        $('.paymentTyp').fadeOut(function () {
                            $('.wrap').fadeIn()
                            $('.orderNotPaid').fadeIn()
                        });
                    }else if(msg=='true'){
                        $('.paymentTyp').fadeOut(function () {
                            $('.wrap').fadeIn()
                            $('.customService').fadeIn()
                            mainfun.setEndTime()
                            setInterval(function(){
                                mainfun.setEndTime()
                            }, 1000);
                        });
                    }
                })
            }else{
                $('.typeWX').unbind('click')
                $('.typeWX').on('click',function () { // 点击微信支付
                    console.log(mainfun.orderMsg)
                    if(one){
                        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')
                        one=0;
                        getData('/shop/orderGoods/addOrder',{
                            data:mainfun.orderMsg,
                            token:token
                        },function (msg) {
                            console.log(msg)
                            if(msg.success){
                                if(msg.data.state==0){
                                    mainfun.payMsg = msg.data
                                    mainfun.payMsg.id=mainfun.payMsg.orderId
                                    mainfun.payMsg.payType = 0
                                    console.log(mainfun.payMsg)
                                    window.shopPay(mainfun.payMsg,function (msg) { //调用客户端
                                        $(".loading").fadeOut('fast').html('')
                                        one=1;
                                        if(msg=='false'){
                                            $('.paymentTyp').fadeOut(function () {
                                                $('.wrap').fadeIn()
                                                $('.orderNotPaid').fadeIn()
                                            });
                                        }else if(msg=='true'){
                                            $('.paymentTyp').fadeOut(function () {
                                                $('.wrap').fadeIn()
                                                $('.customService').fadeIn()
                                                mainfun.setEndTime()
                                                setInterval(function(){
                                                    mainfun.setEndTime()
                                                }, 1000);
                                            });
                                        }else{
                                            alert('未知错误')
                                        }
                                    })
                                }else if(msg.data.state==1){
                                    $(".alertMsg").html('超出购买最大数').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }else if(msg.data.state==5){
                                    $(".alertMsg").html('抱歉，您下手慢了').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }else{
                                    $(".alertMsg").html('订单创建失败').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }
                            
                            }
                        })
                    }else{
                        console.log('多次点击')
                    }
                   
                })
                $('.typeZFB').unbind('click')
                $('.typeZFB').on('click',function () { // 点击支付宝支付
                    console.log(mainfun.orderMsg)
                    if(one){
                        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')
                        one=0;
                        getData('/shop/orderGoods/addOrder',{
                            data:mainfun.orderMsg,
                            token:token
                        },function (msg) {
                            console.log(msg)
                            if(msg.success){
                                if(msg.data.state==0){
                                    mainfun.payMsg = msg.data
                                    mainfun.payMsg.id=mainfun.payMsg.orderId
                                    mainfun.payMsg.payType = 1
                                    console.log(mainfun.payMsg)
                                    window.shopPay(mainfun.payMsg,function (msg) { //调用客户端
                                        $(".loading").fadeOut('fast').html('')
                                        one=1;
                                        if(msg=='false'){
                                            $('.paymentTyp').fadeOut(function () {
                                                $('.wrap').fadeIn()
                                                $('.orderNotPaid').fadeIn()
                                            });
                                        }else if(msg=='true'){
                                            $('.paymentTyp').fadeOut(function () {
                                                $('.wrap').fadeIn()
                                                $('.customService').fadeIn()
                                                mainfun.setEndTime()
                                                setInterval(function(){
                                                    mainfun.setEndTime()
                                                }, 1000);
                                            });
                                        }else{
                                            alert('未知错误')
                                        }
                                    })
                                }else if(msg.data.state==1){
                                    $(".alertMsg").html('超出购买最大数').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }else if(msg.data.state==5){
                                    $(".alertMsg").html('抱歉，您下手慢了').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }else{
                                    $(".alertMsg").html('订单创建失败').slideDown() 
                                    setTimeout(function() {
                                        $(".alertMsg").slideUp();
                                    }, 3000);
                                }
                            
                            }
                        })
                    }else{
                        console.log('多次点击')
                    }
                   
                })
            }
           
            
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
            console.log(timeText)
            $('#remainingTime').html(timeText)
        },
        getUserId:function () {
            getData('/main/userInvitation/findUserByToken',{
                data:token
            },function (msg) {
                console.log(msg)
                if(msg.code == 200){
                    mainfun.userId = msg.data.id
                }
            })
        },
        // 微信
        wechatOrAppToPay: function (url,callback){
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
                callback&& callback()
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
        // 生成32位随机码
        randomString:function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';    
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
            　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
    }
    var mainfun = new mainFun()
    mainfun.pushDom()
    mainfun.getAddress()
    mainfun.wxPay()
    mainfun.getUserId()
    $('.submitOrder').on('click','.hasAdd',function(){
        if (/(LKHDAPP)/i.test(navigator.userAgent)) { // 判断App
            $('.wrap').show();
            $('.paymentTyp').slideDown();
        }else if(wechat){ // 判断小程序
            var goodsBody = '应声互动商城商品'
            console.log()
            if(one){
                one=0;
                getData('/shop/orderGoods/addOrder',{
                    data:mainfun.orderMsg,
                    token:token
                },function (msg) {
                    console.log(msg)
                    if(msg.success){
                        if(msg.data.state==0){
                            mainfun.payMsg = msg.data
                            getData('/pay/payOrderByWechat',{
                                data:{
                                    id:mainfun.payMsg.orderId,
                                    payCoin:0,
                                    payMoney:msg.data.payMoney,
                                    payType:3
                                },
                                token:token
                            },function (res) {
                                if(res.code==200){
                                    var data = JSON.parse(res.data)
                                    console.log(data)
                                    var newData = '?appid='+data.appId+'&noncestr='+data.nonceStr+'&sign='+data.paySign+'&timestamp='+data.timeStamp+'&prepayid='+data.package+'&signType='+data.signType
                                    console.log(newData)
                                    wx.miniProgram.navigateTo({
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
                                // $(".loading").fadeOut('fast').html('')
                                // if(msg=='false'){
                                //     $('.paymentTyp').fadeOut(function () {
                                //         $('.wrap').fadeIn()
                                //         $('.orderNotPaid').fadeIn()
                                //     });
                                // }else if(msg=='true'){
                                //     $('.paymentTyp').fadeOut(function () {
                                //         $('.wrap').fadeIn()
                                //         $('.customService').fadeIn()
                                //     });
                                // }
                        }else if(msg.data.state==1){
                            one=1;
                            $(".alertMsg").html('超出购买最大数').slideDown() 
                            setTimeout(function() {
                                $(".alertMsg").slideUp();
                            }, 3000);
                        }else if(msg.data.state==5){
                            one=1;
                            $(".alertMsg").html('抱歉，您下手慢了').slideDown() 
                            setTimeout(function() {
                                $(".alertMsg").slideUp();
                            }, 3000);
                        }else{
                            one=1;
                            $(".alertMsg").html('订单创建失败').slideDown() 
                            setTimeout(function() {
                                $(".alertMsg").slideUp();
                            }, 3000);
                        }
                    }
                })
            }
        }
    })
    $('#submitOrderClose').on('click',function () {
        $('.wrap').fadeOut();
        $('.paymentTyp').fadeOut();
        mainfun.firstClick=true
        if(mainfun.firstClick){
            mainfun.firstClick=false
            mainfun.wxPay()
            one=1
        }
    })
    $('.continuePay').on('click',function () {
       $('.wrap').hide()
       $('.orderNotPaid').hide()
        mainfun.wxPay(1)
        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')

    })
    $('.address').on('click',function () { // 地址编辑
        if (/(LKHDAPP)/i.test(navigator.userAgent)) {
            intoAdd(function (msg) {
                var data = JSON.parse(msg)
                mainfun.orderMsg.appUserAddress = data
                mainfun.orderMsg.appUserAddress.createdTime = null;
                mainfun.orderMsg.appUserAddress.updatedTime = null;
                mainfun.orderMsg.appUserAddress.companyId = null;
                mainfun.orderMsg.appUserAddress.receivePostCode = null;
                $('.address').html("<p class='userName'>"+data.userName+"<span class='userPhone'>"+data.userPhone+"</span></p><p class='userNewAdd'>"+data.province+data.city+data.areaInfo+data.receiveAddress+"</p>")
                $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
            })
        }else if(wechat){
            getData('/main/appUserAddress/getUserAddress',{
                data:'',
                token:token
            },function (msg) {
                console.log(msg)
                if(msg.code == 200){
                    if(msg.data.length>0){
                        mainfun.addressList = msg.data
                        var dom =  ''
                        msg.data.forEach(function (item,index) {
                            dom += ("<div class=\"addMsg\">\n                                <div class=\"msgOne\">\n                                    <span class=\"userName\">" + item.userName + "</span>\n                                    <span class=\"userPhone\">" + item.userPhone + "</span>\n                                </div>\n                                <div class=\"thisAddress\">\n                                    <span>" + item.city + "</span>\n                                    <span>" + item.areaInfo + "</span>\n                                    <span>" + item.receiveAddress + "</span>\n                                </div>\n                            </div>");
                        })
                        $('.addressList').html(dom)
                        $('.addressWrap').fadeIn()
                    }else{
                        $('.addressList').html('<h1>暂无地址请添加新地址</h1>')
                        $('.addressWrap').fadeIn()
                    }
                }else{
                    $('.addressList').html('<h1>暂无地址请添加新地址</h1>')
                    $('.addressWrap').fadeIn()
                }
            })
        }
    })
    
    $('#customServiceClose,.leave').on('click',function () {
        if(/(LKHDAPP)/i.test(navigator.userAgent)){
            refresh()
        }else{
            window.history.back(window.history.length)
        }
    })
    $('#useCouponClose').on('click',function () {
        $('.wrap .coupon').fadeOut()
        $('.wrap').fadeOut()
    })
    $('.goodsList').on('click','.couponList',function(){
        var that = $(this)
        mainfun.selectGood = $(this).parents('.goods').index()
        mainfun.foundCoupon($(this).attr('id'),that)
    })
    $('.submitOrder').on('click','.noneAdd',function () {
        $(".alertMsg").html('请添加收货地址').slideDown() 
        setTimeout(function() {
            $(".alertMsg").slideUp();
        }, 3000);
    })
    $('.shareBtn').on('click',function () {
        var urlData = '?goodsId='+mainfun.goodsId+'&userId='+mainfun.userId
        shareBtn(0,"jzzp_fight",urlData)
    })

    $('.addressContClose').on('click',function () {
        $('.addressWrap').fadeOut(function () {
            $('.addressList').html('')
        })
    })
    $('.addressWrap').on('click','.addMsg',function () {
        var ind = $(this).index()
        var data = mainfun.addressList[ind]
        mainfun.orderMsg.appUserAddress = data
        mainfun.orderMsg.appUserAddress.createdTime = null;
        mainfun.orderMsg.appUserAddress.updatedTime = null;
        mainfun.orderMsg.appUserAddress.companyId = null;
        mainfun.orderMsg.appUserAddress.receivePostCode = null;
        $('.address').html("<p class='userName'>"+data.userName+"<span class='userPhone'>"+data.userPhone+"</span></p><p class='userNewAdd'>"+data.province+data.city+data.areaInfo+data.receiveAddress+"</p>")
        $('.addressWrap').fadeOut(function () {
            $('.addressList').html('')
        })
        $(".alertMsg").html('更改地址成功').slideDown() 
        $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
        setTimeout(function() {
            $(".alertMsg").slideUp();
        }, 3000);
    })
    $('.addAddress').on('click',function () {
        $('.addressWrap').fadeOut()
        wx.miniProgram.navigateTo({
            url:'/pages/addAddress/addAddress',
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
    })
}
window.onpageshow = function () {
    sessionStorage.setItem('isShow','1')
}