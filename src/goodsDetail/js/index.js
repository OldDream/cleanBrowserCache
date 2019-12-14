function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function loadPageContent(token) {
	function mainFun() { }

	mainFun.prototype = {
		id: getUrlParam('id'),
		attributeId: '',
		intoSubmit: getUrlParam('intoSubmit'),
		flghtEndTime: '',
		isShare: getUrlParam('isShare'),
		// 判断是否是分享
		goodsMsg: {
			appUserAddress: null,
			cardIds: [],
			isPlace: null,
			orderBeforeCommitVos: [],
			shopType: null,
			totalCoin: null,
			totalMoney: null
		},
		getData: function getData1() {
			var mainfun = this;
			getData('/shop/goods/getGoods', {
				data: {
					id: this.id
				},
				token: token
			}, function (msg) {
				console.log(msg);
				if (msg.success) {
					mainfun.isFlght(msg.data.isFlght);
					mainfun.goodsMsg.orderBeforeCommitVos.push(msg.data);
					mainfun.isShow();
					var goodsNum = 0;
					var bannerList = '';
					msg.data.goodsPic.split(',').forEach(function (item, index) {
						if(msg.data.goodsVideoId && index==0){
							bannerList += "<li class='swiper-slide videoImg' linkUrl='"+msg.data.goodsVideoId+"'><img src='" + item + "' alt=''></li>";
						}else{
							bannerList += "<li class='swiper-slide'><img src='" + item + "' alt=''></li>";
						}
						}); 
					// 设置右上角分享
					setShareButton({
						setButton: true,
						title: msg.data.goodsName,
						description: '我在应声互动福利商城发现了超值好物，快来看看吧！',
						imgURL: msg.data.goodsSamllPic,
						shareURL: window.location.href + '&isShare=true'
					});
					if (msg.data.goodsAttributeList.length >= 2) {
						msg.data.goodsAttributeList.forEach(function (v, i) {
							console.log(v)
							$('.typeList').append("<span id=" + v.id + " num='" + v.goodsNum + "'sellNum='" + v.sellNum + "'>" + v.goodsAttribute + "</span>");
							goodsNum += v.goodsNum * 1;
						});

						if (goodsNum > 0 || msg.data.buyMaxNum == -1) {
							$('.shop').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										$('.addCartRight button').addClass('shopBtn').removeClass('addChartBtn');
										$('.contWrap').fadeIn('fast');
										$('.addCart').fadeIn('fast');
									});
								}
							});
							$('.addCartBtn').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										$('.addCartRight button').addClass('addChartBtn').removeClass('shopBtn');
										$('.contWrap').fadeIn('fast');
										$('.addCart').fadeIn('fast');
									});
								}
							});
						} else {
							$('.shop,.addCartBtn').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										$(".alertMsg").html('商品库存不足').slideDown();
										$('.addCart').fadeOut();
										$('.contWrap').fadeOut();
										setTimeout(function () {
											$(".alertMsg").slideUp();
										}, 3000);
									});
								}
							});
						}
					} else {
						goodsNum = msg.data.goodsAttributeList[0].goodsNum;
						mainfun.attributeId = msg.data.goodsAttributeList[0].id;

						if (goodsNum > 0 || msg.data.buyMaxNum == -1) {
							$('.shop').on('click', function () {
								sessionStorage.removeItem('searchText')
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										var ind = 0;
										var obj = mainfun.goodsMsg.orderBeforeCommitVos[0];
										obj.goodsAttributeVo = obj.goodsAttributeList[ind];
										obj.buyNum = $('#goodsNum').html() * 1;
										mainfun.goodsMsg.Obj = _objectSpread({}, mainfun.goodsMsg.orderBeforeCommitVos);
										mainfun.goodsMsg.orderBeforeCommitVos[0] = {
											cardMsg: [],
											goodsList: [obj],
											isCanCardId: null,
											isUserCardId: null,
											totalOrderCoin: null,
											totalOrderMoney: null
										};
										sessionStorage.setItem('orderMsg', JSON.stringify(mainfun.goodsMsg));
										console.log(mainfun.goodsMsg)
										window.location.href = '../submitOrder/index.html';
									});
								}
							});
							$('.flghtBtn').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										console.log(mainfun.goodsMsg);
										var ind = 0;
										var obj = mainfun.goodsMsg.orderBeforeCommitVos[0];
										obj.goodsAttributeVo = obj.goodsAttributeList[ind];
										obj.buyNum = $('#goodsNum').html() * 1;
										mainfun.goodsMsg.orderBeforeCommitVos[0] = {
											cardMsg: [],
											goodsList: [obj],
											isCanCardId: null,
											isUserCardId: null,
											totalOrderCoin: null,
											totalOrderMoney: null
										};
										sessionStorage.setItem('orderMsg', JSON.stringify(mainfun.goodsMsg));
										window.location.href = '../submitFlghtOrder/index.html';
									});
								}
							});
							$('.addCartBtn').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, mainfun.addCartFun);
								}
							});
						} else {
							$('.shop,.addCartBtn').on('click', function () {
								if (mainfun.isShare) {
									mainfun.intoAppToShopDetail(getUrlParam('id'));
								} else {
									mainfun.checkTokenRedirect(window.location.href, function () {
										$(".alertMsg").html('商品库存不足').slideDown();
										$('.addCart').fadeOut();
										$('.contWrap').fadeOut();
										setTimeout(function () {
											$(".alertMsg").slideUp();
										}, 3000);
									});
								}
							});
						}
					}
					var specialtyDom = ''
					if(msg.data.specialtyName){
						specialtyDom = "<span>" + msg.data.specialtyName + "</span>"
					}
					if (msg.data.isFlght) {
						mainfun.flghtEndTime = new Date(msg.data.flghtEndTime.replace(/-/g, '/').replace(/T/g, ' ')).getTime();
						mainfun.setEndTime();
						setInterval(function () {
							mainfun.setEndTime();
						}, 1000);
						$('.goodsTitle').html("<div class=\"flghtNum\"><b>" + msg.data.goodsMoney + "</b><p class=\"remainingTime\"><span id=\"remainingTime\"></span>拼团结束</p><p class=\"flghtText\"><span>已售：" + msg.data.goodsAttributeList[0].sellNum + "件</span></p></div><h1>"+specialtyDom + msg.data.goodsName + "</h1>");
					} else {
						if (msg.data.goodsOriginalPrice) {
							$('.goodsTitle').html("<h2><i>" + msg.data.goodsMoney + "</i></h2><h1>"+specialtyDom + msg.data.goodsName + "</h1>");
						} else {
							$('.goodsTitle').html("<h2><i>" + msg.data.goodsMoney + "</i></h2><h1>"+specialtyDom + msg.data.goodsName + "</h1>");
						}
					}
					if(msg.data.labelName){
						var labelArr = msg.data.labelName?msg.data.labelName.split(','):''
						var labelDom = '<div class="labelDom">'
						labelArr.forEach(function (item, index) {
							labelDom += '<span>' + item + '</span>'
						})
						labelDom += '</div>'
						$('.goodsTitle').append(labelDom)
					}
					$('.thisGoodsMoney').html('￥' + msg.data.goodsMoney);
					$('.goodsTitle h2').append("<span>已售：<b>" + msg.data.sellNum + "</b>件</span>");
					var eventDetail = msg.data.goodsDetails ? msg.data.goodsDetails : '暂无内容';
					// $('#goodsMaxNum').html(goodsNum);
					$('.eventDetail').html(eventDetail);
					$('#thisGoods').attr('src', msg.data.goodsSamllPic);
					$('body').css('display', 'flex');
					$('.swiper-wrapper').html(bannerList);
					var mySwiper = new Swiper('.swiper-container', {
						loop: true,
						// autoplay: {
						// 	disableOnInteraction: false // 用户操作后不停止轮播

						// },
						pagination: {
							el: '.swiper-pagination',
							type: 'fraction',
						},
						on: {
							slideChangeTransitionStart: function slideChangeTransitionStart() {
								// 设置右上角分享
								setShareButton({
									setButton: true,
									title: msg.data.goodsName,
									description: '我在应声互动福利商城发现了超值好物，快来看看吧！',
									imgURL: msg.data.goodsSamllPic,
									shareURL: window.location.href + '&isShare=true'
								});
							}
						}
					});
					if(msg.data.goodsVideoId){
						var dom = $('.swiper-wrapper li')[1]
						console.log(dom)
						$(dom).addClass('videoImg')
					}
				}
			});
			getData('/shop/goods/recommendGoods', {
				data: {
					num: 3
				},
				token: token
			}, function (msg) {
				console.log(msg)
				var goodsDom = '<h1>热门推荐</h1><div>';
				if (msg.success && msg.data && msg.data.length) {
					$('.pickWeek').show()
					msg.data.forEach(function (v, i) {
						var className = '';
						if (v.flghtNum == 2) {
							className = 'redBg'
						} else if (v.flghtNum == 3) {
							className = 'yellowBg'
						} else if (v.flghtNum == 5) {
							className = 'blueBg'
						}
						goodsDom += "<dl id=" + v.id + "><dt><span class='"+className+"'></span><img src=" + v.goodsSamllPic + "></dt><dd><p>" + v.goodsName + "</p>";
						if (v.goodsOriginalPrice) {
							goodsDom += "<p>" + v.goodsMoney + "</p></dd></dl>"
						} else {
							goodsDom += "<p>" + v.goodsMoney + "</p></dd></dl>"
						}
					})
					goodsDom += "</div>"
					$('.pickWeek').html(goodsDom)
				}
			})
		},
		addCartFun: function addCartFun() {
			// 添加购物车
			getData('/shop/goods/addCart', {
				data: {
					id: mainfun.id,
					attributeId: mainfun.attributeId,
					buyNum: $('#goodsNum').html(),
					shopType: 2
				},
				token: token
			}, function (msg) {
				if (msg.success) {
					if (msg.data.state == 0) {
						$(".alertMsg").html('加入购物车成功').slideDown();
						$('.addCart').fadeOut();
						$('.contWrap').fadeOut();
						setTimeout(function () {
							$(".alertMsg").slideUp();
						}, 3000);
					} else if (msg.data.state == 2) {
						$(".alertMsg").html('您当前添加的商品数量已超出库存数量').slideDown();
						$('.addCart').fadeOut();
						$('.contWrap').fadeOut();
						setTimeout(function () {
							$(".alertMsg").slideUp();
						}, 3000);
					} else {
						$(".alertMsg").html('加入购物车失败').slideDown();
						$('.addCart').fadeOut();
						$('.contWrap').fadeOut();
						setTimeout(function () {
							$(".alertMsg").slideUp();
						}, 3000);
					}
				}
			});
		},
		// 点击登陆事件
		checkTokenRedirect: function checkTokenRedirect(url, callback) {
			if (/(LKHDAPP)/i.test(navigator.userAgent)) {
				protocol.getToken(function (token) {
					if (!token) {
						layer.confirm('此功能需要登录，是否前往登录?', {
							title: '提示'
						}, function (index) {
							if (index) {
								protocol.jumpLoginController(function (deviceInfo) {// setTimeout(function () {
									//     window.location.href =  (url+"").replace("{token}",token);
									// },1000)
								});
							}

							layer.close(index);
						});
						return false;
					} else {
						callback && callback();
					}
				});
			} else if (wechat) {
				if (!token) {
					wx.miniProgram.navigateTo({
						url: '/pages/login/login',
						success: function success() {
							console.log('success');
						},
						fail: function fail() {
							console.log('fail');
						},
						complete: function complete() {
							console.log('complete');
						}
					});
				} else {
					callback && callback();
				}
			} else {
				layer.confirm('此功能需要登录，是否前往应用商店下载App?', {
					title: '提示'
				}, function (index) {
					if (index) {
						window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.lkhd&channel=0002160650432d595942&fromcase=60001';
						return false;
					}

					layer.close(index);
				});
				return false;
			}
		},
		// 判断是否是拼团商品
		isFlght: function isFlght(type) {
			if (type) {
				$('.bottomBtn').hide();
			} else {
				$('.flghtBottomBtn').hide();
			}
		},
		// 参数判断
		isShow: function isShow() {
			if (!mainfun.intoSubmit || wechat) {
				$('.box').css({
					'display': 'flex'
				});
			} else {
				var obj = mainfun.goodsMsg.orderBeforeCommitVos[0];
				obj.goodsAttributeVo = obj.goodsAttributeList[0];
				obj.buyNum = $('#goodsNum').html() * 1;
				mainfun.goodsMsg.orderBeforeCommitVos[0] = {
					cardMsg: [],
					goodsList: [obj],
					isCanCardId: null,
					isUserCardId: null,
					totalOrderCoin: null,
					totalOrderMoney: null
				};
				sessionStorage.setItem('orderMsg', JSON.stringify(mainfun.goodsMsg));
				location.replace('../submitFlghtOrder/index.html');
			}
		},
		setEndTime: function setEndTime() {
			// 设置到期时间
			var timeText = '';
			var timer = mainfun.flghtEndTime - new Date().getTime();
			var days = Math.floor(timer / 1000 / 60 / 60 / 24);
			var hours = Math.floor(timer / 1000 / 60 / 60 - 24 * days);
			var minutes = Math.floor(timer / 1000 / 60 - 24 * 60 * days - 60 * hours);
			var seconds = Math.floor(timer / 1000 - 24 * 60 * 60 * days - 60 * 60 * hours - 60 * minutes);

			if (days) {
				timeText += days + ':';
			}

			if (hours) {
				timeText += hours>9?hours+':':'0'+hours+':';
			}

			if (minutes) {
				timeText += minutes>9?minutes+':':'0'+minutes+':';
			}

			if (seconds) {
				timeText += seconds;
			}

			$('#remainingTime').html(timeText);
		},
		// 分享页点击判断
		intoAppToShopDetail: function intoAppToShopDetail(id) {
			var url = '';
			var goodsId = encodeURIComponent('?id=' + id);

			if (pro) {
				url = 'http://constant-info.lingkehudong.com/3.0H5/app-mall/goodsDetail/index.html' + goodsId;
			} else {
				url = 'http://constant-info-dev.lingkehudong.com/app-mall/goodsDetail/index.html' + goodsId;
			}

			intoApp.appQuery = "http://protocol?iC=BaseWebViewVC&aA=BaseWebActivity&URL=" + url;
			intoApp.url = '/downloadApp/index.html';
			intoApp.intoAppFun();
		}
	};
	var mainfun = new mainFun();
	mainfun.getData();
	var clipboard = new ClipboardJS('.copyBtn');
	clipboard.on('success', function () {
		$(".alertMsg").html('复制成功').slideDown();
		setTimeout(function () {
			$(".alertMsg").slideUp();
		}, 3000);
	});
	clipboard.on('error', function () {
		$(".alertMsg").html('复制失败').slideDown();
		setTimeout(function () {
			$(".alertMsg").slideUp();
		}, 3000);
	});
	$('#customServiceClose').on('click', function () {
		$('.contWrap').fadeOut();
		$('.customService').fadeOut();
	});
	$('.showCustomService').on('click', function () {
		$('.contWrap').fadeIn();
		$('.customService').fadeIn();
	});
	$('.numChange').on('click', '.add', function () {
		var num = $('#goodsNum').html();
		var goodsNum = $('.thisType').attr('num') * 1;
		$('#goodsNum').html(++num);
		$('.numSubtract').addClass('subtract');

		if (num >= goodsNum) {
			$('.numAdd').removeClass('add');
		}
	});
	$('.numChange').on('click', '.subtract', function () {
		var num = $('#goodsNum').html();
		$('#goodsNum').html(--num);
		$('.numAdd').addClass('add');

		if (num <= 1) {
			$('.numSubtract').removeClass('subtract');
		}
	});
	$('.typeList').on('click', 'span', function () {
		$(this).addClass('thisType').siblings().removeClass('thisType');
		$('.addCartRight button').addClass('rightBtn');
		$('#goodsMaxNum').html($(this).attr('sellNum'));
		$('.thisGoodsMaxNum').show();
		mainfun.attributeId = $(this).attr('id');
	});
	$('.addCartRight').on('click', '.rightBtn', function () {
		if ($(this).hasClass('shopBtn')) {
			sessionStorage.removeItem('searchText')
			var ind = $('.thisType').index();
			var obj = mainfun.goodsMsg.orderBeforeCommitVos[0];
			obj.goodsAttributeVo = obj.goodsAttributeList[ind];
			obj.buyNum = $('#goodsNum').html() * 1;
			mainfun.goodsMsg.orderBeforeCommitVos[0] = {
				cardMsg: [],
				goodsList: [obj],
				isCanCardId: null,
				isUserCardId: null,
				totalOrderCoin: null,
				totalOrderMoney: null
			};
			console.log(mainfun.goodsMsg);
			sessionStorage.setItem('orderMsg', JSON.stringify(mainfun.goodsMsg));
			window.location.href = '../submitOrder/index.html';
		} else {
			mainfun.addCartFun();
		}
	});
	$('#shopCartClose').on('click', function () {
		$('.contWrap').fadeOut('fast');
		$('.addCart').fadeOut('fast');
	});
	$('.intoChart').on('click', function () {
		sessionStorage.removeItem('searchText')
		if (mainfun.isShare) {
			mainfun.intoAppToShopDetail(getUrlParam('id'));
		} else {
			mainfun.checkTokenRedirect(window.location.href, function () {
				window.location.href = '../shopCart/index.html';
			});
		}
	});
	$('#submitOrderClose').on('click', function () {
		$('.contWrap').fadeOut();
		$('.paymentTyp').fadeOut();
	});
	$('.pickWeek').on('click', 'dl', function () {
		var id = $(this).attr('id');

		if (mainfun.isShare) {
			window.location.href = '../goodsDetail/index.html?id=' + id + "&isShare=true";
		} else {
			window.location.href = '../goodsDetail/index.html?id=' + id;
		}
	});
	var clipboard1 = new ClipboardJS('.copyBtn1');
	clipboard1.on('success', function () {
		$(".alertMsg").html('复制成功').slideDown();
		setTimeout(function () {
			$(".alertMsg").slideUp();
		}, 3000);
	});
	clipboard1.on('error', function () {
		$(".alertMsg").html('复制失败').slideDown();
		setTimeout(function () {
			$(".alertMsg").slideUp();
		}, 3000);
	});
	$('.lotteryWechatBtn').on('click', function () {
		$('.lotteryWechat').fadeOut();
		$('.lotteryMark').fadeOut();
	});
	$('.lotteryWechatBtn').on('click', function () {
		$('.wechatAlert').fadeOut();
		$('.contWrap').fadeOut();
	});
	$('.banner').on('click','.videoImg',function () {
		var linkUrl = $(this).attr('linkUrl')
		if (/(LKHDAPP)/i.test(navigator.userAgent)) {
			protocol.getToken(function (token) {
				if (!token) {
					layer.confirm('此功能需要登录，是否前往登录?', {
						title: '提示'
					}, function (index) {
						if (index) {
							protocol.jumpLoginController(function (deviceInfo) {// setTimeout(function () {
								//     window.location.href =  (url+"").replace("{token}",token);
								// },1000)
							});
						}

						layer.close(index);
					});
					return false;
				} else {
					getData('/video/queryVideoPlayInfo',{
						data:linkUrl
					},function (msg) {
						console.log(msg)
						if(msg.code == 200){
							intoPlayVideo(msg.data.getPlayInfoResponse.playInfoList[0].playURL)
						}
					})
				}
			});
		} else if (wechat) {
			if (!token) {
				wx.miniProgram.navigateTo({
					url: '/pages/login/login',
					success: function success() {
						console.log('success');
					},
					fail: function fail() {
						console.log('fail');
					},
					complete: function complete() {
						console.log('complete');
					}
				});
			} else {
				wx.miniProgram.navigateTo({
					url: '/pages/videoPage/videoPage?linkUrl='+linkUrl,
					success: function success() {
						console.log('success');
					},
					fail: function fail() {
						console.log('fail');
					},
					complete: function complete() {
						console.log('complete');
					}
				});
			}
		}
		
	})
	$('.main').scroll(function () {
		var position = $('.banner').offset().top
		var opcityNum = position*3/100
		if(opcityNum<=0 &&opcityNum>=-1){
			navBarAlpha(Math.abs(opcityNum))
		}else if(opcityNum>0){
			navBarAlpha(0)
		}else if(opcityNum<-1){
			navBarAlpha(1)
		}
    })
	navBarAlpha(0)
}
window.onpageshow = function () {
	if (sessionStorage.getItem('isShow')) {
		window.location.href = '';
		sessionStorage.removeItem('isShow');
	}
};