Number.prototype.add = function(arg){   
    var r1,r2,m;   
    try{r1=this.toString().split(".")[1].length}catch(e){r1=0}   
    try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}   
    m=Math.pow(10,Math.max(r1,r2))   
    return (this*m+arg*m)/m   
}     
Number.prototype.sub = function (arg){   
    return this.add(-arg);   
}
Number.prototype.mul = function (arg)   
{   
    var m=0,s1=this.toString(),s2=arg.toString();   
    try{m+=s1.split(".")[1].length}catch(e){}   
    try{m+=s2.split(".")[1].length}catch(e){}   
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
}  
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
        selectedCoupon:[], // 已选择优惠券
        aginClick:true,
        addressList:[],
        getCard:function () { // 获取优惠券列表
            getData('/main/appUserCard/cardList',{
                data:{},
                token:token
            },function(msg){
                if(msg.success){
                    var data = msg.data
                    mainfun.orderMsg.shopType=2
                    mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) {
                        var cardMsg = []
                        data.forEach(function (v,i) {
                            if(v.appCard.availableCompanyIds.split(',').indexOf(val.goodsList[0].companyId+'')!=-1){
                                cardMsg.push(v)
                            }
                        })
                        val.cardMsg = cardMsg
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
            var cardInd = '';
            var goodsNum = 0;
            mainfun.orderMsg.orderBeforeCommitVos.forEach(function (item,index) { // 店铺列表
                cardInd=''
                preferential = 0; // 优惠
                var initMoney = 0; // 不打折总价
                var storeMoney = 0;
                var storePreferential=0;
                goodsDom+="<div class='goods'>"
                if(item.cardMsg&&item.cardMsg.length>=1){ // 有卡券
                    var storyDom = '';
                    $.each(item.cardMsg,function (cardIndex,cardItem) { // 遍历卡券
                        storyDom = '';
                        if(mainfun.selectedCoupon.indexOf(cardItem.id)==-1){
                            storyDom = ''
                            storeMoney = 0
                            storePreferential=0
                            var cardMoney = 0; // 使用卡券后的价格
                            initMoney = 0; // 不打折总价
                            if(cardItem.appCard.cardType){ // 1 打折券
                                $.each(item.goodsList,function (goodsIndex,goodsItem){ // 遍历商品
                                    if(cardItem.appCard.goodsIds == ''){
                                        cardMoney= cardMoney.add(goodsItem.goodsMoney.mul(cardItem.appCard.discountAmount).mul(goodsItem.buyNum))
                                        initMoney= initMoney.add(goodsItem.goodsMoney.mul(goodsItem.buyNum))
                                    }else if(cardItem.appCard.goodsIds.split(',').indexOf(goodsItem.goodsAttributeVo.goodsId+'') !='-1'){
                                        cardMoney= cardMoney.add(goodsItem.goodsMoney.mul(cardItem.appCard.discountAmount).mul(goodsItem.buyNum))
                                        initMoney= initMoney.add(goodsItem.goodsMoney.mul(goodsItem.buyNum))
                                    }else{
                                        storeMoney= storeMoney.add(goodsItem.goodsMoney.mul(goodsItem.buyNum)) // 不能打折的先添加到店铺总价
                                        initMoney= initMoney.add(goodsItem.goodsMoney.mul(goodsItem.buyNum))
                                    }
                                    var maxNum = goodsItem.buyMaxNum>0?goodsItem.buyMaxNum:9999;
                                    var thisNum = maxNum>goodsItem.buyNum?' add':''
                                    var goodsMoney = goodsItem.goodsMoney?goodsItem.goodsMoney:goodsItem.goodsOriginalPrice;
                                    var labelArr = goodsItem.labelName?goodsItem.labelName.split(','):''
                                    var specialtyDom = ''
                                    var labelDom = ''
                                    if(goodsItem.specialtyName){
                                        specialtyDom = "<span>"+goodsItem.specialtyName+"</span>"
                                    }
                                    if(labelArr.length){
                                        labelDom = '<p class="label">'
                                        labelArr.forEach(function (item,index) {
                                            labelDom+='<span>'+item+'</span>'
                                        })
                                        labelDom += '</p>'
                                    }
                                    if(goodsItem.buyNum>1){
                                        storyDom += ("<dl><dt><img src='" + goodsItem.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + goodsItem.goodsName + "</p><p>" + goodsItem.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+goodsItem.id+"' attributeId='"+goodsItem.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract subtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + goodsItem.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                    }else{
                                        storyDom += ("<dl><dt><img src='" + goodsItem.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + goodsItem.goodsName + "</p><p>" + goodsItem.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+goodsItem.id+"' attributeId='"+goodsItem.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + goodsItem.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                    }
                                })
                                storePreferential = initMoney-storeMoney-cardMoney
                                if((storePreferential>=preferential) && storePreferential!=0){
                                    storeMoney+=cardMoney
                                    preferential=storePreferential // 算优惠
                                    cardInd = cardIndex
                                    item.isUserCardId=cardItem.id
                                }
                            }else{// 0 代金券
                                $.each(item.goodsList,function (goodsIndex,goodsItem) { // 遍历商品
                                    var goodsMoney = goodsItem.goodsMoney?goodsItem.goodsMoney:goodsItem.goodsOriginalPrice;
                                    var maxNum = goodsItem.buyMaxNum>0?goodsItem.buyMaxNum:9999;
                                    var thisNum = maxNum>goodsItem.buyNum?' add':''
                                    var labelArr = goodsItem.labelName?goodsItem.labelName.split(','):''
                                    var specialtyDom = ''
                                    var labelDom = ''
                                    if(goodsItem.specialtyName){
                                        specialtyDom = "<span>"+goodsItem.specialtyName+"</span>"
                                    }
                                    if(labelArr.length){
                                        labelDom = '<p class="label">'
                                        labelArr.forEach(function (item,index) {
                                            labelDom+='<span>'+item+'</span>'
                                        })
                                        labelDom += '</p>'
                                    }
                                    if(cardItem.appCard.goodsIds == ''){
                                        cardMoney+=goodsItem.goodsMoney*goodsItem.buyNum
                                        initMoney+=goodsItem.goodsMoney*goodsItem.buyNum
                                    }else if(cardItem.appCard.goodsIds.split(',').indexOf(goodsItem.goodsAttributeVo.goodsId+'') !='-1'){
                                        cardMoney+=goodsItem.goodsMoney*goodsItem.buyNum
                                        initMoney+=goodsItem.goodsMoney*goodsItem.buyNum
                                    }else{
                                        storeMoney+=goodsItem.goodsMoney*goodsItem.buyNum // 不能打折的先添加到店铺总价
                                        initMoney+=goodsItem.goodsMoney*goodsItem.buyNum
                                    }
                                    if(goodsItem.buyNum>1){
                                        storyDom += ("<dl><dt><img src='" + goodsItem.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + goodsItem.goodsName + "</p><p>" + goodsItem.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+goodsItem.id+"' attributeId='"+goodsItem.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract subtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + goodsItem.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                    }else{
                                        storyDom += ("<dl><dt><img src='" + goodsItem.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + goodsItem.goodsName + "</p><p>" + goodsItem.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+goodsItem.id+"' attributeId='"+goodsItem.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + goodsItem.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                    }
                                })
                                if((cardMoney>=(cardItem.appCard.fullAmount*1))){
                                    cardMoney-=cardItem.appCard.discountAmount
                                    storePreferential = cardItem.appCard.discountAmount*1
                                }
                                if((storePreferential>=preferential) && storePreferential!=0){
                                    storeMoney+=cardMoney
                                    preferential=storePreferential // 算优惠
                                    cardInd = cardIndex
                                    item.isUserCardId=cardItem.id
                                }
                            }
                            storeMoney=initMoney-preferential
                        }else{
                            storeMoney=0
                            item.goodsList.forEach(function (val,ind) {
                                var goodsMoney = val.goodsMoney?val.goodsMoney:val.goodsOriginalPrice;
                                var maxNum = val.buyMaxNum>0?val.buyMaxNum:9999;
                                var thisNum = maxNum>val.buyNum?' add':''
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
                                if(val.buyNum>1){
                                    storyDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + val.goodsName + "</p><p>" + val.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract subtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                }else{
                                    storyDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>"+specialtyDom + val.goodsName + "</p><p>" + val.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                                }
                                storeMoney+=goodsMoney*val.buyNum
                            })
                        }
                    })
                    goodsDom+=storyDom
                }else{ // 无卡券
                    storeMoney=0
                    item.goodsList.forEach(function (val,ind) {
                        var goodsMoney = val.goodsMoney?val.goodsMoney:val.goodsOriginalPrice;
                        var maxNum = val.buyMaxNum>0?val.buyMaxNum:9999;
                        var thisNum = maxNum>val.buyNum?' add':''
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
                        if(val.buyNum>1){
                            goodsDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>"+specialtyDom  + val.goodsName + "</p><p>" + val.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract subtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                        }else{
                            goodsDom += ("<dl><dt><img src='" + val.goodsSamllPic + "'></dt><dd><p>"+specialtyDom  + val.goodsName + "</p><p>" + val.goodsKeys + "</p>"+labelDom+"<div><span>" + goodsMoney + "</span></div></dd></dl><div class='buyNum'  id='"+val.id+"' attributeId='"+val.goodsAttributeVo.id+"'><span>购买数量</span><div class='numChange'><b class='numSubtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + val.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div>");
                        }
                        storeMoney+=goodsMoney*val.buyNum
                    })
                }
                if(cardInd===''){
                    goodsDom+="<div class='coupon'><span>选择优惠券</span><span class='couponList' id="+item.goodsList[0].companyId+">暂无可用优惠券</span></div>"
                    total+=storeMoney
                    mainfun.moneyArr.push(storeMoney)
                }else{
                    mainfun.selectedCoupon.push(item.cardMsg[cardInd].id)
                    goodsDom+="<div class='coupon'><span>选择优惠券</span><span class='initialPrice couponList' cardId="+item.cardMsg[cardInd].id+" id="+item.goodsList[0].companyId+">"+item.cardMsg[cardInd].appCard.cardShortName+"</span></div>"
                    total+=storeMoney
                    mainfun.moneyArr.push(storeMoney)
                }
                goodsNum+=item.goodsList.length
                goodsDom+='<div class="storyMsg"><span>共'+item.goodsList.length+'件</span><span>优惠:<b class="storePreferential"></b></span><span>小计:<b class="storeMoney"></b></span></div></div></div>'
            })
            $('.goodsNum i').html(goodsNum)
            $('.goodsList').html(goodsDom)
            mainfun.computedValue()
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
                        $('#submitOrderBtn').addClass('noneAdd').removeClass('hasAdd').unbind('click')
                    }
                    mainfun.isShow++;
                    if(mainfun.isShow >1){
                        $('.main').show()
                    }
                }
            })
        },
        foundCoupon:function (id,that) { // 选择优惠券
            getData('/main/appUserCard/cardList',{
                data:{},
                token:token
            },function (msg) {
                mainfun.couponArr = msg.data
                var canUserCouponArr = [];
                if(msg.success){
                    $('.available').unbind('click');
                    var total = 0;
                    var coupoonDom = '';
                    var coupoonDom1 = '';
                    var cardId = $(that).attr('cardId');
                    $('.orderList').html(' ')
                    mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) { // 获取当前点击店铺的总价
                        if(val.goodsList[0].companyId==id){
                            val.goodsList.forEach(function (v,i) {
                                total+=v.buyNum*v.goodsMoney
                            })
                        }
                    })
                    if(msg.data&&msg.data.length>=1){
                        msg.data.forEach(function (val,ind) {
                            var expireDate = val.expireDate.split('T')[0]?val.expireDate.split('T')[0]:"无期限"
                            if(mainfun.selectedCoupon.indexOf(val.id)==-1){ // 判断是否使用过
                                if(val.appCard.availableCompanyIds.split(',').indexOf(id+'')!=-1){ // 判断是否是当前店铺的券
                                    mainfun.orderMsg.orderBeforeCommitVos[$(that).parents('.goods').index()].goodsList.forEach(function (goodsItem,goodsInd){
                                        if(val.appCard.goodsIds == ''){
                                            if(val.appCard.cardType){ // 0代金券 1打折券
                                                if(canUserCouponArr.indexOf(val.id) == -1){
                                                    canUserCouponArr.push(val.id)
                                                }
                                            }else{
                                                if(val.appCard.fullAmount<=total){
                                                    if(canUserCouponArr.indexOf(val.id) == -1){
                                                        canUserCouponArr.push(val.id)
                                                    }
                                                }
                                            }
                                        }else if(val.appCard.goodsIds.split(',').indexOf(goodsItem.goodsAttributeVo.goodsId+'') !='-1'){
                                            var num =0
                                            mainfun.orderMsg.orderBeforeCommitVos[$(that).parents('.goods').index()].goodsList.forEach(function (goodsItem1,goodsInd){
                                                if(val.appCard.goodsIds.split(',').indexOf(goodsItem1.goodsAttributeVo.goodsId+'') !='-1'){
                                                    num = num.add(goodsItem1.goodsMoney.mul(goodsItem1.buyNum))
                                                }
                                            })
                                            if(val.appCard.cardType){ // 0代金券 1打折券
                                                if(canUserCouponArr.indexOf(val.id) == -1){
                                                    canUserCouponArr.push(val.id)
                                                }
                                            }else{
                                                if(val.appCard.fullAmount<=num){
                                                    if(canUserCouponArr.indexOf(val.id) == -1){
                                                        canUserCouponArr.push(val.id)
                                                    }
                                                }
                                            }
                                            $('.available .orderList').append(coupoonDom)
                                            $('.notAvailable .orderList').append(coupoonDom1)
                                        }
                                    })
                                }
                            }
                        })
                        mainfun.couponArr.forEach(function (val,ind) { // 渲染优惠券dom
                            var expireDate = val.expireDate.split('T')[0]?val.expireDate.split('T')[0]:"无期限"
                            if(canUserCouponArr.indexOf(val.id) != -1){
                                $('.available .orderList').append("<div class='availableList' ind="+ind+" id="+val.id+"><dl><dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>")
                            }else{
                                if(mainfun.selectedCoupon.indexOf(val.id)==-1){
                                    $('.notAvailable .orderList').append("<div class='availableList'><dl> <dt><img src="+val.appCard.cardPicUrl+"></dt><dd><span>立即使用</span></dd></dl><div class='couponMsg'><h1>"+val.appCard.cardShortName+" </h1><p>"+val.appCard.detail+"</p><p>有效期至："+expireDate+"</p></div></div>")
                                }
                            }
                        })
                        if($('.notAvailable .availableList').length==0){
                            $(".notAvailable h1").hide()
                        }else{
                            $(".notAvailable h1").show()
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
                        var arrInd = mainfun.selectedCoupon.indexOf($(that).attr('cardid')*1)
                        var parInd = $(that).parents('.goods').index()
                        var allMoney = '';
                        mainfun.orderMsg.orderBeforeCommitVos[parInd].isUserCardId = $(this).attr('id')*1
                        sessionStorage.setItem('orderMsg',JSON.stringify(mainfun.orderMsg))
                        mainfun.moneyArr[parInd]= Math.ceil(total*mainfun.couponArr[ind].appCard.discountAmount)
                        mainfun.moneyArr.forEach(function (val,ind) {
                            allMoney=allMoney*1+val*1
                        })
                        
                        if(arrInd == -1){
                            mainfun.selectedCoupon.push($(this).attr('id')*1)
                        }else{
                            mainfun.selectedCoupon[arrInd]=$(this).attr('id')*1
                        }
                        $(that).attr('cardid',$(this).attr('id'))
                        $('.money').html(Math.ceil(parseInt(allMoney*1000))/1000)
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
            mainfun.orderMsg.orderBeforeCommitVos.forEach(function (val,ind) {
                var initMoney = 0; // 单个店铺总价
                var thisMoney = 0; // 单个店铺打折后的总价
                if(val.isUserCardId!==null){
                    val.cardMsg.forEach(function (v,i) {
                        if(v.id==val.isUserCardId){
                            if(v.appCard.cardType){ // 0代金券 1打折券
                                val.goodsList.forEach(function (item) {
                                    if(v.appCard.goodsIds == ''){
                                        thisMoney= thisMoney.add(item.buyNum.mul(item.goodsMoney).mul(v.appCard.discountAmount))
                                    }else if(v.appCard.goodsIds.split(',').indexOf(item.goodsAttributeVo.goodsId+'') !='-1'){
                                        thisMoney= thisMoney.add(item.buyNum.mul(item.goodsMoney).mul(v.appCard.discountAmount))
                                    }else{
                                        thisMoney= thisMoney.add(item.buyNum.mul(item.goodsMoney))
                                    }
                                    initMoney= initMoney.add(item.buyNum.mul(item.goodsMoney))
                                    allMoney= allMoney.add(item.buyNum.mul(item.goodsMoney))
                                })
                            }else{ // 代金券
                                var noneMoney = 0;
                                val.goodsList.forEach(function (item) {
                                    if(v.appCard.goodsIds == ''){
                                        thisMoney= thisMoney.add(item.buyNum.mul(item.goodsMoney))
                                    }else if(v.appCard.goodsIds.split(',').indexOf(item.goodsAttributeVo.goodsId+'') !='-1'){
                                        thisMoney= thisMoney.add(item.buyNum.mul(item.goodsMoney))
                                    }else{
                                        noneMoney= noneMoney.add(item.buyNum.mul(item.goodsMoney))
                                    }
                                    initMoney= initMoney.add(item.buyNum.mul(item.goodsMoney))
                                    allMoney= allMoney.add(item.buyNum.mul(item.goodsMoney))
                                })
                                if(thisMoney>=v.appCard.fullAmount){
                                    thisMoney=thisMoney.sub(v.appCard.discountAmount).add(noneMoney)
                                }else{
                                    var dom = $('.couponList')[ind]
                                    $(dom).removeClass('initialPrice').html('当前优惠券无法使用')
                                }
                            }
                        }
                    })
                }else{
                    val.goodsList.forEach(function (v,i) {
                        initMoney+=v.buyNum*v.goodsMoney
                        thisMoney+=v.buyNum*v.goodsMoney
                        allMoney+=v.buyNum*v.goodsMoney
                    })
                }
                mainfun.moneyArr[ind]=thisMoney
                var storePreferential = $('.storePreferential')[ind]
                var num1 = initMoney.sub(thisMoney)
                $(storePreferential).html(Math.floor(num1*100)/100)
            })
            concessionaryOrder=allMoney
            mainfun.moneyArr.forEach(function (v,i) {
                concessionaryOrder = concessionaryOrder.sub(v)
                price+=v
                var storeMoney = $('.storeMoney')[i]
                $(storeMoney).html(Math.ceil(v*100)/100)
            })
            concessionaryOrder=concessionaryOrder<=0?0:concessionaryOrder
            $('.preferential').html(Math.floor(concessionaryOrder*100)/100)
            $('.money').html(Math.ceil(price*100)/100)
            mainfun.aginClick = true;
            mainfun.isShow++;
            if(mainfun.isShow >1){
                $('.main').show()
            }
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
                    if(one){
                        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')
                        one=0;
                        getData('/shop/orderGoods/addOrder',{
                            data:mainfun.orderMsg,
                            token:token
                        },function (msg) {
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
                $('.typeZFB').unbind('click')
                $('.typeZFB').on('click',function () { // 点击支付宝支付
                    if(one){
                        $(".loading").html("<img src='./imgs/loading.gif'>").fadeIn('fast')
                        one=0;
                        getData('/shop/orderGoods/addOrder',{
                            data:mainfun.orderMsg,
                            token:token
                        },function (msg) {
                            if(msg.success){
                                if(msg.data.state==0){
                                    mainfun.payMsg = msg.data
                                    mainfun.payMsg.id=mainfun.payMsg.orderId
                                    mainfun.payMsg.payType = 1
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
        if($('.money').html() <= 0){
            getData('/shop/orderGoods/addOrder',{
                data:mainfun.orderMsg,
                token:token
            },function (msg) {
                if(msg.success){
                    if(msg.data.state==0){
                        mainfun.payMsg = msg.data
                        mainfun.payMsg.id=mainfun.payMsg.orderId
                        mainfun.payMsg.payType = 0
                        $('.wrap').fadeIn()
                        $('.customService').fadeIn()
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
            if (/(LKHDAPP)/i.test(navigator.userAgent)) { // 判断App
                $('.wrap').show();
                $('.paymentTyp').slideDown();
            }else if(wechat){ // 判断小程序
                var goodsBody = '应声互动商城商品'
                if(one){
                    one=0;
                    getData('/shop/orderGoods/addOrder',{
                        data:mainfun.orderMsg,
                        token:token
                    },function (msg) {
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
                                        var newData = '?appid='+data.appId+'&noncestr='+data.nonceStr+'&sign='+data.paySign+'&timestamp='+data.timeStamp+'&prepayid='+data.package+'&signType='+data.signType
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
        if (/(LKHDAPP)/i.test(navigator.userAgent)) {
            intoAdd(function (msg) {
                if(msg){
                    var data = JSON.parse(msg)
                    mainfun.orderMsg.appUserAddress = data
                    mainfun.orderMsg.appUserAddress.createdTime = null;
                    mainfun.orderMsg.appUserAddress.updatedTime = null;
                    mainfun.orderMsg.appUserAddress.companyId = null;
                    mainfun.orderMsg.appUserAddress.receivePostCode = null;
                    $('.address').html("<p class='userName'>"+data.userName+"<span class='userPhone'>"+data.userPhone+"</span></p><p class='userNewAdd'>"+data.province+data.city+data.areaInfo+data.receiveAddress+"</p>")
                    $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
                }else{ // 
                    mainfun.getAddress()
                }
            })
        }else if(wechat){
            getData('/main/appUserAddress/getUserAddress',{
                data:'',
                token:token
            },function (msg) {
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
    $('.noneAvailable').on('click',function () {
        var ind = mainfun.selectGood
        var that = $('.goods')[ind]
        var thatCardInd = mainfun.selectedCoupon.indexOf($(that).find('.couponList').attr('cardId')*1)
        $('.wrap').fadeOut('fast');
        $('.wrap .coupon').fadeOut('fast');
        mainfun.selectedCoupon[thatCardInd] = null
        $(that).find('.couponList').html('选择不使用优惠券').removeClass('initialPrice')
        mainfun.orderMsg.orderBeforeCommitVos[ind].isUserCardId = null;
        localStorage.setItem('orderMsg',mainfun.orderMsg)
        mainfun.computedValue()
        $(that).find('.couponList').attr('cardId','')
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
        setTimeout(function() {
            $(".alertMsg").slideUp();
        }, 3000);
        $('#submitOrderBtn').addClass('hasAdd').removeClass('noneAdd')
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