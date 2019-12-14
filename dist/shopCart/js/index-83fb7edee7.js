function loadPageContent(token) {
    function mainFun() {  }
    mainFun.prototype = {
        goodsMsg:[],
        goodsNum:0,
        type :1,
        goodsArr:[], // 列表数据
        allGoodsMsg:[], // 结算时需要传
        rightType :"管理",
        getData:function () { // 请求购物车数据
            getData('/shop/goods/queryCart',{
                data:{
                    shopType:2
                },
                token:token
            },function (msg) {
                if(msg.success){
                    console.log(msg)
                    if(msg.data.length>=1){
                        var data = msg.data;
                        mainfun.goodsArr = msg.data
                        var goodsDom = '';
                        mainfun.goodsNum = data.length;
                        data.forEach(function(v,i){
                            var labelArr = v.labelName?v.labelName.split(','):''
                            console.log(labelArr)
                            var maxNum = v.buyMaxNum>0?v.buyMaxNum:9999;
                            maxNum=maxNum>v.goodsAttributeVo.goodsNum?v.goodsAttributeVo.goodsNum:maxNum;
                            var goodsMoney = v.goodsMoney?v.goodsMoney:v.goodsOriginalPrice;
                            var goodsAttribute = v.goodsAttributeVo.goodsAttribute=='默认'?'':v.goodsAttributeVo.goodsAttribute;
                            var thisNum = maxNum>v.buyNum?' add':''
                            var specialtyDom = ''
                            var labelDom = ''
                            if(v.specialtyName){
                                specialtyDom = "<span>"+v.specialtyName+"</span>"
                            }
                            if(labelArr.length){
                                labelDom = '<p class="label">'
                                labelArr.forEach(function (item,index) {
                                    labelDom+='<span>'+item+'</span>'
                                })
                                labelDom += '</p>'
                            }
                            if(v.buyNum>1){
                                goodsDom+="<li id='"+v.id+"' attributeId='"+v.goodsAttributeVo.id+"'><div class='selectBox'><span class='selectThis'></span></div><div class='goodsImg'><img src=" + v.goodsSamllPic + "></div><div class='goodsMsg'><p>"+specialtyDom + v.goodsName + "</p><p>" + goodsAttribute + "</p>"+labelDom+"<div><span class='goodsMoney'>" + goodsMoney + "</span><div class='numChange'><b class='numSubtract subtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + v.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div></div></li>"
                            }else{
                                goodsDom+="<li id='"+v.id+"' attributeId='"+v.goodsAttributeVo.id+"'><div class='selectBox'><span class='selectThis'></span></div><div class='goodsImg'><img src=" + v.goodsSamllPic + "></div><div class='goodsMsg'><p>"+specialtyDom + v.goodsName + "</p><p>" + goodsAttribute + "</p>"+labelDom+"<div><span class='goodsMoney'>" + goodsMoney + "</span><div class='numChange'><b class='numSubtract'></b><span id='goodsNum' maxNum='"+maxNum+"'>" + v.buyNum + "</span><b class='numAdd"+thisNum+"'></b></div></div></div></li>"
                            }
                        });
                        $('.goodsList').html(goodsDom)
                        mainfun.changeRightBtn()
                        $('.accounts').show()
                    }else{
                        $('.main').html("<dl class='noneCart'><dt><img src='./imgs/noneCart.png'></dt><dd>您当前还没有添加商品<br>赶紧去商城逛逛吧！</dd></dl>")
                        $('.accounts').hide()
                        mainfun.goodsArr=[]
                    }
                }else{
                    mainfun.falseAjax()
                }
            })
        },
        getAllMoney:function(){
            var goodsNum = $('.goodsList .thisGoods').parent().siblings().children().children().children('#goodsNum')
            var goodsMoney = $('.goodsList .thisGoods').parent().siblings().children().children('.goodsMoney')
            console.log($('.goodsList .thisGoods').parent().siblings().children().children('.goodsMoney'))
            var goodsMsg = []
            Object.getOwnPropertyNames(goodsMoney).forEach(function(key){
                if(!isNaN(key*1)){
                    goodsMsg.push({
                        ind:key,
                        money:goodsMoney[key].innerHTML,
                        num:goodsNum[key].innerHTML
                    })
                }
            })
            mainfun.goodsMsg = goodsMsg
            mainfun.calculatePrice()
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
                    getData('/shop/goods/queryCart',{
                        data:{
                            shopType:2
                        },
                        token:token
                    },function (msg) {
                        if(msg.success){
                            mainfun.goodsArr = msg.data
                            var domArr = $('.goodsList .thisGoods').splice(0,$('.goodsList .thisGoods').length)
                            mainfun.allGoodsMsg =[];
                            domArr.forEach(function (v,i) {
                                var ind = $(v).parent().parent().index()
                                mainfun.allGoodsMsg.push(mainfun.goodsArr[ind])
                            })
                            console.log(mainfun.allGoodsMsg)
                        }
                        mainfun.getAllMoney()
                    })
                }
            })
        },
        calculatePrice:function () { // 计算价格
            var allMoney = 0;
            mainfun.goodsMsg.forEach(function (v,i) {
                allMoney+=v.money*v.num
            })
            $('.money').html(Math.ceil(parseInt(allMoney*100))/100)
        },
        changeRightBtn:function () {
            setRightBtn(mainfun.rightType,function (msg) {
                if(mainfun.rightType=="管理"){
                    mainfun.rightType="完成"
                    $('.accountsBtn').hide()
                    $('.noneMoney').hide()
                    $('.seletGoodsBtn').show()
                }else{
                    mainfun.rightType="管理"
                    $('.accountsBtn').show()
                    $('.noneMoney').show()
                    $('.seletGoodsBtn').hide()
                }
                return mainfun.changeRightBtn()
            })
        },
        // 请求出错
        falseAjax:function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click',function () {
                window.location.href=''
            })
        }
    }
    var mainfun = new mainFun()
    mainfun.getData()
    $('.goodsList').on('click','.selectBox',function () {
        var ind=$(this).parents('li').index()
        $(this).find('.selectThis').toggleClass('thisGoods')
        var goodsNum = $('.goodsList .thisGoods').length
        if($('.goodsList .thisGoods').length==mainfun.goodsNum){
            $('.selectAll .selectThis').addClass('thisGoods')
            mainfun.type = 0;
        }else{
            $('.selectAll .selectThis').removeClass('thisGoods')
            mainfun.type = 1;
        }
        if(goodsNum){
            $('.accountsBtn').html("结算("+goodsNum+")")
        }else{
            $('.accountsBtn').html("结算")
        }
        mainfun.getAllMoney()
        var domArr = $('.goodsList .thisGoods').splice(0,$('.goodsList .thisGoods').length)
        mainfun.allGoodsMsg =[];
        domArr.forEach(function (v,i) {
            var ind = $(v).parent().parent().index()
            mainfun.allGoodsMsg.push(mainfun.goodsArr[ind])
        })
    })

    $('.selectAllGoods').on('click',function () {
        var goodsNum = $('.goodsList li').length
        if(mainfun.type){
            $('.selectThis').addClass('thisGoods')
            $('.accountsBtn').html("结算("+goodsNum+")")
            mainfun.type = 0;
            mainfun.allGoodsMsg =mainfun.goodsArr;
        }else{
            $('.selectThis').removeClass('thisGoods')
            $('.accountsBtn').html("结算")
            $('.money').html(0)
            mainfun.goodsMsg=[]
            mainfun.type = 1;
            mainfun.allGoodsMsg =[];
        }
        mainfun.getAllMoney()
    })

    $('.goodsList').on('click','.add',function () {
        var numDom = $(this).parent().children('#goodsNum')
        var num = $(numDom).html()*1+1
        var maxNum = $(this).siblings('#goodsNum').attr('maxNum')
        var ind = $(this).parents('li').index()
        var that = this;
        getData('/shop/orderGoods/canBuy',{
            data:{
                goodsId:mainfun.goodsArr[ind].id,
                goodsWillBuyNum:num
            },
            token:token
        },function (msg) {
            if(msg.success){
                console.log(msg)
                if(msg.data.state==0){
                    if(num>=1){
                        $(numDom).html(num)
                        $(that).parent().children('.numSubtract').addClass('subtract')
                        mainfun.changeCartNum($(that).parents('li').attr('id'),$(that).parents('li').attr('attributeId'),1)
                    }else{
                        $(that).parent().children('.numSubtract').removeClass('subtract')
                    }
                }else{
                    $(that).removeClass('add')
                }
            }
        })
        if(maxNum<=num){
            $(that).removeClass('add')
        }
    })

    $('.goodsList').on('click','.subtract',function () {
        mainfun.changeCartNum($(this).parents('li').attr('id'),$(this).parents('li').attr('attributeId'),0)
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
    })
    $('.accountsBtn').on('click',function () {
        if(mainfun.allGoodsMsg.length){
            getData('/shop/goods/calc',{
                data:mainfun.allGoodsMsg,
                token:token
            },function (msg) {
                if(msg.success){
                    var data = JSON.stringify(msg.data)
                    sessionStorage.setItem('orderMsg',data)
                    setRightBtn('')
                    window.location.href = '../submitOrder/index.html'
                }
            })
        }
    })
    $('.seletGoodsBtn').on('click',function () {
        if($('.goodsList .thisGoods').length){
            getData('/shop/goods/removeCartGoods',{
                data:{
                    goodsList:mainfun.allGoodsMsg,
                    shopType:2
                },
                token:token
            },function (msg) {
                if(msg.success){
                    mainfun.allGoodsMsg =[];
                    mainfun.getAllMoney()
                    mainfun.getData()
                    mainfun.changeRightBtn()
                    $(".alertMsg").html('删除商品成功').slideDown()
                    $('.money').html('0') 
                    $('.selectAllGoods .selectThis').removeClass('thisGoods')
                    setTimeout(function() {
                        $(".alertMsg").slideUp();
                    }, 3000);
                    $('.goodsList .thisGoods').parent().parent().remove()
                    $('.accountsBtn').html("结算")
                    if($('.goodsList li').length==0){
                        $('.main').html("<dl class='noneCart'><dt><img src='./imgs/noneCart.png'></dt><dd>您当前还没有添加商品<br>赶紧去商城逛逛吧！</dd></dl>")
                        $('.accounts').hide()
                    }else{
                        $('.accounts').show()
                    }
                }
            })
        }else{
            $(".alertMsg").html('暂无商品可删除').slideDown() 
            setTimeout(function() {
                $(".alertMsg").slideUp();
            }, 3000);
            $('.goodsList .thisGoods').parent().remove()
            $('.accounts').hide()
        }
    })
}
