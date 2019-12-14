function loadPageContent(token) {
    function mainFun() {  }
    mainFun.prototype = {
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
    $('.available').on('click','.availableList',function () {
        $(this).find('.thisCoupon').addClass('confirmThis')
        $(this).siblings().find('.thisCoupon').removeClass('confirmThis')
    })
}
