function loadPageContent(token) {
    var one = 1;
    function mainFun() {  }
    mainFun.prototype = {
        orderMsg:JSON.parse(sessionStorage.getItem('orderMsg')), // 获取本地存储里的数据
        payMsg:{}, // 付款信息 需传给客户端
        couponArr:[], //  优惠券数组
        moneyArr:[],
        selectGood:'',
        aginClick:true,
        getCard:function () { // 获取优惠券列表
            getData('/main/appUserCard/cardList',{
                data:{},
                token:token
            },function(msg){
                if(msg.success){
                    mainfun.orderMsg.shopType=2
                    msg.data.forEach(function (v,i) {
                        mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) {
                            val.cardMsg= val.cardMsg?val.cardMsg:new Array()
                            if(val.goodsList[0].companyId==v.companyId){
                                val.cardMsg.push(v)
                            }
                        })
                    })
                    var obj = {};
                    mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) {
                        if(val.cardMsg&&val.cardMsg.length>=1){
                            val.cardMsg = val.cardMsg.reduce(function(item, next) {
                                obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                                return item;
                        }, []);
                        }
                    })
                    mainfun.initMoney()
                }else{
                    mainfun.initMoney()
                }
            })
        },
        initMoney:function () { // 初始化最优优惠券使用
            var goodsDom = ''
            var total = 0; // 总价
            var preferential = 0; // 优惠
            mainfun.orderMsg.orderBeforeCommitVos.forEach(function (v,i){
                var allGoodsMoney = 999999999999;
                var thisMoney = 0;
                goodsDom+="<div class='goods'>"
                v.goodsList.forEach(function (val,ind) {
                    var maxNum = val.buyMaxNum>0?val.buyMaxNum:9999;
                    maxNum=maxNum>val.goodsAttributeVo.goodsNum?val.goodsAttributeVo.goodsNum:maxNum;
                    var goodsMoney = val.goodsMoney?val.goodsMoney:val.goodsOriginalPrice;
                    var thisNum = maxNum>val.buyNum?' add':''
                    thisMoney+=goodsMoney*val.buyNum
                    if(val.buyNum>1){
                        goodsDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>" + val.goodsName + "</p><p>" + val.goodsKeys + "</p><div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'>购买数量<div class='numChange'><b class='numSubtract subtract'>-</b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'>+</b></div></div>");
                    }else{
                        goodsDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>" + val.goodsName + "</p><p>" + val.goodsKeys + "</p><div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'>购买数量<div class='numChange'><b class='numSubtract'>-</b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'>+</b></div></div>");
                    }
                })
                if(v.cardMsg&&v.cardMsg.length>=1){
                    var initialPrice = thisMoney
                    var index = '';
                    console.log(v)
                    v.cardMsg.forEach(function (val,ind) {
                        console.log(val.appCard.goodsIds.split(',').includes('45'))
                        if(val.appCard.cardType){ // 0代金券 1打折券
                            if((thisMoney*val.appCard.discountAmount)<allGoodsMoney){
                                allGoodsMoney=Math.ceil(thisMoney*val.appCard.discountAmount*100)/100
                                index = ind
                                v.isUserCardId=val.id
                            }
                        }else{
                            if((thisMoney>=(val.appCard.fullAmount*1)) &&((thisMoney-val.appCard.discountAmount)<allGoodsMoney)){
                                allGoodsMoney=thisMoney-val.appCard.discountAmount
                                index = ind
                                v.isUserCardId=val.id
                            }
                        } 
                    })  
                    if(index===''){
                        goodsDom+="<div class='coupon'>优惠券信息<span class='couponList' id="+v.goodsList[0].companyId+">暂无可用优惠券</span></div></div>"
                        total+=thisMoney
                        mainfun.moneyArr.push(thisMoney)
                    }else{
                        goodsDom+="<div class='coupon'>优惠券信息<span class='initialPrice couponList' id="+v.goodsList[0].companyId+">"+v.cardMsg[index].appCard.cardShortName+"</span></div></div>"
                        total+=allGoodsMoney
                        mainfun.moneyArr.push(allGoodsMoney)
                        preferential+=(initialPrice-allGoodsMoney)
                    }   
                }else{
                    v.goodsList.forEach(function (val,ind) {
                        var goodsMoney = val.goodsMoney?val.goodsMoney:val.goodsOriginalPrice;
                        total+=goodsMoney*val.buyNum
                    })
                    mainfun.moneyArr.push(total)
                    goodsDom+="<div class='coupon'>优惠券信息<span class='couponList' id="+v.goodsList[0].companyId+">暂无可用优惠券</span></div></div>"
                }
            });
            $('.goodsList').html(goodsDom)
            $('.money').html(Math.ceil(total*100)/100)
            $('.preferential').html(Math.ceil(preferential*100)/100)
        },
        changeCartNum:function (id,attributeId,type) { // 更改数量
            var num = type?1:-1
            getData('/shop/goods/addCart',{
                data:{
                    id:id,
                    attributeId:attributeId,
                    buyNum:num,
                    shopType:2
                },
                token:token
            },function (msg) {
                console.log(msg)
                if(msg.success){
                    mainfun.orderMsg.orderBeforeCommitVos.forEach(function (v,i) {
                        v.goodsList.forEach(function (val,ind) {
                            if(val.id==id){
                                if(val.goodsAttributeVo.id==attributeId){
                                    val.buyNum=val.buyNum+num
                                }
                            }
                        })
                    })
                    sessionStorage.setItem('orderMsg',JSON.stringify(mainfun.orderMsg))
                    mainfun.computedValue()
                }
            })
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
                }
            })
        },
        foundCoupon:function (id,that) { // 计算最优优惠券使用
            console.log(id)
            getData('/main/appUserCard/cardList',{
                data:{},
                token:token
            },function (msg) {
                console.log(msg)
                mainfun.couponArr = msg.data
                if(msg.success){
                    $('.available').unbind('click');
                    var total = 0;
                    var coupoonDom = '';
                    $('.orderList').html(' ')
                    mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) { // 获取当前点击店铺的总价
                        if(val.goodsList[0].companyId==id){
                            val.goodsList.forEach(function (v,i) {
                                console.log(v)
                                total+=v.buyNum*v.goodsMoney
                            })
                        }
                    })
                    if(msg.data&&msg.data.length>=1){
                        msg.data.forEach(function (val,ind) {
                            console.log(val)
                            var expireDate = val.expireDate.split('T')[0]?val.expireDate.split('T')[0]:"无期限"
                            if(val.appCard.companyId==id){ // 判断是否是当前店铺的券
                                if(val.appCard.cardType){ // 0代金券 1打折券
                                    coupoonDom="<div class='availableList' ind="+ind+"  id="+val.id+"><dl><dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>"
                                    $('.available .orderList').append(coupoonDom)
                                }else{
                                    if(val.appCard.fullAmount<=total){
                                        coupoonDom="<div class='availableList' ind="+ind+" id="+val.id+"><dl><dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>"
                                        $('.available .orderList').append(coupoonDom)
                                    }else{
                                        coupoonDom="<div class='availableList'><dl> <dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>"
                                        $('.notAvailable .orderList').append(coupoonDom)
                                    }
                                }
                            }else{
                                coupoonDom="<div class='availableList'><dl><dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>"
                                $('.notAvailable .orderList').append(coupoonDom)
                            }
                        })
                        if($('.notAvailable .availableList').length==0){
                            $(".notAvailable h1").hide()
                        }
                        $('.wrap').fadeIn()
                        $('.coupon').fadeIn()
                    }else{
                        $(".alertMsg").html('暂无可用优惠券').slideDown() 
                        setTimeout(function() {
                            $(".alertMsg").slideUp();
                        }, 3000);
                    }
                    $('.available').on('click','.availableList',function () {
                        var ind = $(this).attr('ind')
                        var parInd = $(that).parents('.goods').index()
                        var allMoney = '';
                        mainfun.orderMsg.orderBeforeCommitVos[parInd].isUserCardId = $(this).attr('id')*1
                        sessionStorage.setItem('orderMsg',JSON.stringify(mainfun.orderMsg))
                        mainfun.moneyArr[parInd]= Math.ceil(total*mainfun.couponArr[ind].appCard.discountAmount)
                        mainfun.moneyArr.forEach(function (val,ind) {
                            allMoney=allMoney*1+val*1
                        })
                        $('.money').html(Math.ceil(allMoney*100)/100)
                        $(that).html($(this).find('h1').html()).addClass('initialPrice')
                        $('.wrap').fadeOut()
                        $('.wrap .coupon').fadeOut()
                        mainfun.computedValue()
                    })
                }
            })
        },
        computedValue:function () { // 计算总价发生变化
            var allMoney = 0 ; // 总订单的原价
            var concessionaryOrder = 0; // 总订单的优惠
            var price = 0; // 总订单打折后的价格
            console.log(mainfun.orderMsg)
            mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) {
                var initMoney = 0; // 单个店铺总价
                var thisMoney = 0; // 单个店铺打折后的总价
                if(val.isUserCardId!==null){
                    val.goodsList.forEach(function (item) {
                        initMoney+=item.buyNum*item.goodsMoney
                        thisMoney+=item.buyNum*item.goodsMoney
                        allMoney+=item.buyNum*item.goodsMoney
                    })
                    val.cardMsg.forEach(function (v,i) {
                        if(v.id==val.isUserCardId){
                            if(v.appCard.cardType){ // 0代金券 1打折券
                                thisMoney=Math.ceil((initMoney*v.appCard.discountAmount)*100)/100
                            }else{ // 代金券
                                if(initMoney>=v.appCard.fullAmount){
                                    thisMoney=Math.ceil((initMoney-v.appCard.discountAmount)*100)/100
                                }
                            }
                        }
                    })
                }else{
                    val.goodsList.forEach(function (v,i) {
                        thisMoney+=v.buyNum*v.goodsMoney
                        allMoney+=v.buyNum*v.goodsMoney
                    })
                }
                mainfun.moneyArr[ind]=thisMoney
            })
            concessionaryOrder=allMoney
            mainfun.moneyArr.forEach(function (v) {
                concessionaryOrder-=v
                price+=v
            })
            console.log(price)
            concessionaryOrder=concessionaryOrder<=0?0:concessionaryOrder
            $('.preferential').html(Math.ceil(concessionaryOrder*100)/100)
            $('.money').html(Math.ceil(price*100)/100)
            mainfun.aginClick = true;
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
           
            
        }
    }
    var mainfun = new mainFun()
    mainfun.getCard()
    mainfun.getAddress()
    mainfun.wxPay()
    $('.submitOrder').on('click','.hasAdd',function(){
        $('.wrap').show();
        $('.paymentTyp').slideDown();
        
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
    $('.continuePay').on('click',function () {
       $('.wrap').hide()
       $('.orderNotPaid').hide()
        mainfun.wxPay(1)
        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')

    })
    
    $('.goodsList').on('click','.add',function () { // 点击添加
        var numDom = $(this).parent().children('#goodsNum')
        var num = $(numDom).html()
        var maxNum = $(this).siblings('#goodsNum').attr('maxNum')
        var ind = $(this).parents('li').index()
        var that = this;
        if(mainfun.aginClick){
            mainfun.aginClick = false
            getData('/shop/orderGoods/canBuy',{
                data:{
                    goodsId:mainfun.orderMsg.orderBeforeCommitVos[$(this).parents('.goods').index()].goodsList[$(this).parents('.goods').children('dl').index()].id,
                    goodsWillBuyNum:num
                },
                token:token
            },function (msg) {
                if(msg.success){
                    if(msg.data.state==0){
                        $(numDom).html(++num)
                        $(that).parent().children('.numSubtract').addClass('subtract')
                        console.log(num)
                        if(maxNum<=num){
                            $(that).removeClass('add')
                        }
                        mainfun.changeCartNum($(that).parents('.buyNum').attr('id'),$(that).parents('.buyNum').attr('attributeId'),1)
                    }else{
                        $(that).removeClass('add')
                    }
                }
            })
        }
    })
    $('.goodsList').on('click','.subtract',function () { // 点击减少
        if(mainfun.aginClick){
            mainfun.aginClick = false
            mainfun.changeCartNum($(this).parents('.buyNum').attr('id'),$(this).parents('.buyNum').attr('attributeId'),0)
            var numDom = $(this).parent().children('#goodsNum')
            var num = $(numDom).html()
            var maxNum = $(this).siblings('#goodsNum').attr('maxNum')
            if(num>1){
                $(numDom).html(--num)
            }
            if(num==1){
                $(this).parent().children('.numSubtract').removeClass('subtract')
            }
            if(maxNum>=num){
                $(this).siblings('.numAdd').addClass('add')
            }
        }
    })
    $('.address').on('click',function () { // 地址编辑
        intoAdd(function (msg) {
            var data = JSON.parse(msg)
            console.log(data)
            mainfun.orderMsg.appUserAddress = data
            $('.address').html("<p class='userName'>"+data.userName+"<span class='userPhone'>"+data.userPhone+"</span></p><p class='userNewAdd'>"+data.province+data.city+data.areaInfo+data.receiveAddress+"</p>")
            $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
        })
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
    $('.noneAvailable').on('click',function () {
        var ind = mainfun.selectGood
        var that = $('.goods')[ind]
        console.log(mainfun.selectGood)
        $('.wrap').fadeOut('fast');
        $('.wrap .coupon').fadeOut('fast');
        console.log($(that))
        $(that).find('.couponList').html('选择不使用优惠券').removeClass('initialPrice')
        mainfun.orderMsg.orderBeforeCommitVos[ind].isUserCardId = null;
        localStorage.setItem('orderMsg',mainfun.orderMsg)
        mainfun.computedValue()
    })
}