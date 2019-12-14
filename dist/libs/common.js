var USER_TOKEN = '';
var pointId = getUrlParam('id')?getUrlParam('id'):'';
var watermarkId = getUrlParam('watermarkId')?getUrlParam('watermarkId'):0;
var wechat = getUrlParam('wechat')?getUrlParam('wechat'):localStorage.getItem('wechat')?localStorage.getItem('wechat'):null;
var API_PRE_URL = 'https://appv3.devcenter.lingkehudong.com';
// var API_PRE_URL = 'http://192.168.100.149:6050'; // 光ip
// var url = 'http://constant-info-dev.lingkehudong.com/cate/homePage/Main/index.html?id='+ pointId+'&watermarkId='+watermarkId;
var protocol = new Protocol(function(){},function(){});
var pro = true; // 开发 false  生产 true
if(pro){
    API_PRE_URL = "https://api.lingkehudong.com/";
    // url = 'http://constant-info.lingkehudong.com/cate/homePage/Main/index.html?id='+ pointId+'&watermarkId='+watermarkId;
}else{
    // loadScript('//cdn.jsdelivr.net/npm/eruda')
}
if(getUrlParam('wechat')){
    localStorage.setItem('wechat',getUrlParam('wechat'))
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

 // 动态创建script标签
function loadScript(url){
    var script = document.createElement('script');     
    script.type = 'text/javascript';               
    script.src = url;       
    document.getElementsByTagName('head')[0].appendChild(script); 
    script.onload = function () {
        eruda.init();
    }
}

// 返回首页按钮
function backBtn(str) {
    if (/(LKHDAPP)/i.test(navigator.userAgent)) {
        protocol.setBackButton({'homeName':'首页',"homeUrl":url,"backName":str})
    }
}
// 全屏广告

function pushAD(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        protocol.pushADView({'type':'splash','placementId':'7050540725229324'})
    } else if (/(Android)/i.test(navigator.userAgent)) {
        protocol.pushADView({'type':'splash','placementId':'1020344338680450'})
    }
}

// 分享按钮
function shareBtn(num,type,urlData='') {
    var Newstr ={'number':num,'type':type,'parameterStr':urlData} 
    protocol.share(Newstr,function (res) {
    });
}
function getPointId() {
    if (pointId == '') {
        pointId = getUrlParam('id');
    }
    return pointId;
}

function intoAdd(callback) {
    protocol.jumpAddressController(callback)
}

// 跳转到初始页面
function refresh() {
    protocol.refresh()
}

// 单页面应用调用客户端弹幕
function sendPointId(params,callback) {
    protocol.sendPointId(params,callback);
}

function getPointId() {
    if (pointId == '') {
        pointId = getUrlParam('id');
    }
    return pointId;
}


/**
 * @param {参数} params
 * url 图片地址
 */
// 拍摄照片
function takePhoto(params,callback) {
    protocol.takePhoto(params,callback);
}

// 保存照片
function savePhoto(params,callback) {
    protocol.savePhoto(params,callback);
}

/**
 * 
 * @param {参数} params
 * 电话号 
 * @param {回调} callback 
 */
// 打电话
function photoCall(params,callback) {
    protocol.photoCall(params,callback);
}

// 震动
function vibrate(params,callback) {
    protocol.vibrate(params,callback);
}

/**
 * 3.0设置互动分享按钮
 * @param {setButton:true,type:'type'} params 
 * setButton:是否让分享按钮显示
   type:分享type
*/
function setShareButton(params) {
    protocol.setShareButton(params)
}

// 商品支付
function shopPay(params,callback) {
    console.log('shopPay')
    protocol.shopPay(params,callback);
}

function protocolLoaded(callback){
    var token = "";
    setTimeout(function() {
        window.protocol.getToken(function (token) {
            callback(token);
        })
    },0);
};


// 设置导航栏按钮
function setRightBtn(params,callback) {
    protocol.setRightBtn(params,callback);
}

// 跳转到App并打开新webView
function jumpWebViewController(params, callback) {
    protocol.jumpWebViewController(params, callback)
}

// 跳转协议跳互动页
function jumpInteractionRoller(params) {
    protocol.jumpInteractionRoller(params)
}
// 3.0跳转视频播放页
function intoPlayVideo(params) {
    protocol.intoPlayVideo(params)
}
// App3.*导航栏透明
function navBarAlpha(params) {
    protocol.navBarAlpha&&protocol.navBarAlpha(params)

}
// 二次封装jQ.ajax
function getData(url,data,callback) {
    $.ajax({
        url: API_PRE_URL + url,
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success:callback,
        error:callback
    })
}

window.onload = function(){
    $(".loading").show().html("<img src='./imgs/loading.gif'>")
    protocol.initPromise(function(){
        window.protocolLoaded(
            function(tokenVal){
                window.loadPageContent(tokenVal);
                $(".loading").fadeOut('fast').html('')
                if(window.loadPageContent1){
                    window.loadPageContent1(tokenVal);
                }
            }
        );
    })
    document.documentElement.style.webkitUserSelect='none'
    document.documentElement.style.webkitTouchCallout='none'
}