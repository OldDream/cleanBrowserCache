function loadPageContent(token) {

    function mainFun() { }
    mainFun.prototype = {
        searchName:decodeURIComponent(decodeURIComponent(getUrlParam('searchName'))),
        searchHistoryArr:localStorage.getItem('searchHistoryArr') ?localStorage.getItem('searchHistoryArr').split(',') : [],
        searchCont:getUrlParam('searchCont'),
        unique:function (arr) {
            if (!Array.isArray(arr)) {
                console.log('type error!')
                return
            }
            var array =[];
            for(var i = 0; i < arr.length; i++) {
                if( !array.includes( arr[i]) && i<15) {//includes 检测数组是否有某个值
                    array.push(arr[i]);
                }
            }
            console.log(array)
            return array
        },
        setSearchHistoryListDom:function () {
            var dom = ''
            if(mainfun.searchHistoryArr.length){
                mainfun.searchHistoryArr.forEach(function (item,index) {
                    dom+='<span>'+item+'</span>'
                })
            $('.searchHistoryList').append(dom);
            }else{
                $('.searchHistoryList').html('');
            }
        },
        setSearchPlaceHolder:function () {
            if($('.searchIpt input').val()){
                $('.searchPlac').hide()
                $('.clearIpt').show()
            }else{
                $('.searchPlac').html(mainfun.searchName)
                $('.clearIpt').hide()
            }
        },
        // 请求出错
        falseAjax:function () {
            $('.falseAjax').fadeIn()
            $('.falseAjax').on('click',function () {
                window.loadPageContent(token)
                $('.falseAjax').fadeOut()
            })
        },
        searchGoods:function (val) {
            console.log(val)
            $('.searchIpt input').val(val)
            getData('/shop/goods/getCategoryGoodsNew',{
                data:{
                    goodsName:val
                }
            },function (msg) {
                console.log(msg)
                if(msg.code == 200){
                    $('.searchNomal').hide()
                    mainfun.searchHistoryArr = mainfun.unique(mainfun.searchHistoryArr)
                    localStorage.setItem('searchHistoryArr',mainfun.searchHistoryArr)
                    var goodsDom = ''
                    if(msg.data.records.length){
                        msg.data.records.forEach(function (v,i) {
                            var className = '';
                            if(v.flghtNum==2){
                                className = 'redBg'
                            }else if(v.flghtNum == 3){
                                className = 'yellowBg'
                            }else if(v.flghtNum == 5){
                                className = 'blueBg'
                            }
                            var specialtyDom = ''
                            if(v.specialtyName){
                                specialtyDom = "<span>" + v.specialtyName + "</span>"
                            }
                            goodsDom+=  ("<dl goodsId='" + v.id + "'>\n                            <dt><span class='" + className + "'></span><img class='lazy' data-original=\"" + v.goodsSamllPic + "\" alt=\"\"></dt>\n                            <dd>\n                                <h1>" + (specialtyDom + v.goodsName) + "</h1>\n                                <p><span class=\"goodsMoney\">" + v.goodsMoney + "</span> <b>" + v.sellNum + "人付款</b></p>\n                            </dd>\n                        </dl>");
                            goodsDom+="</div></div>"
                        })
                        $('.searchList').html(goodsDom).show()
                        $("img.lazy").lazyload( // 懒加载
                            {
                                placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 透明placeholder
                                effect: "fadeIn",
                                threshold:0,
                                container :'.main'
                            }
                        );
                    }else{
                        $('.searchHistory').hide()
                        $('.searchNomal').show()
                        $('.searchList').hide()
                    }
                }else{
                    $('.searchHistory').hide()
                    $('.searchNomal').show()
                    $('.searchList').hide()
                }
            })
        }
    }
    var mainfun = new mainFun()
    mainfun.searchGoods(decodeURIComponent(decodeURIComponent(mainfun.searchCont)))
    mainfun.setSearchPlaceHolder()
    $('.searchIpt').on('input', function (e) {
        if (e.target.value == '') {
            $('.searchPlac').show()
            $('.clearIpt').hide()
        } else {
            $('.searchPlac').hide()
            $('.clearIpt').show()
        }
    })
    $('.searchBtn').on('click', function () {
        var val = $('.searchIpt input').val()
        console.log(val)
        var searchPlac = $('.searchPlac').html()
        sessionStorage.setItem('searchText',val)
        if(val){
            mainfun.searchHistoryArr.unshift(val)
            mainfun.searchGoods(val)
        }else{
            $('.searchPlac').hide()
            $('.clearIpt').show()
            $('.searchIpt input').val(searchPlac)
            mainfun.searchHistoryArr.unshift(searchPlac)
            mainfun.searchGoods(val)
        } 
    })
    $('.searchHistory h1 span').on('click',function () {
        mainfun.searchHistoryArr=[]
        localStorage.removeItem('searchHistoryArr')
        mainfun.setSearchHistoryListDom()
    })
    $('.clearIpt').on('click',function () {
        $('.searchIpt input').val('')
        $('.searchPlac').show()
        $('.clearIpt').hide()
    })
    $('.searchHistoryList').on('click','span',function () {
        console.log($(this).html())
        $('.searchPlac').hide()
        $('.clearIpt').show()
        $('.searchIpt input').val($(this).html())
    })
    $('.searchList').on('click','dl',function () {
        var goodsid = $(this).attr('goodsId')
        window.location.href = '../goodsDetail/index.html?id='+goodsid
    })
}
window.onunload = function () {
    window.history.back(window.history.length)
}