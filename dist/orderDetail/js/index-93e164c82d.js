function loadPageContent(token) {

    function mainFun() {  }
    mainFun.prototype = {
    
    }
    var mainfun = new mainFun()
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
    $('#customServiceClose').on('click',function () {
        $('.wrap').fadeOut();
        $('.customService').fadeOut();
    })
    $('.service').on('click',function () {
        $('.wrap').fadeIn('fast')
        $('.customService').fadeIn('fast')
    })
}


