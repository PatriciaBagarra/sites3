(function($){
// windows size
var mouseover_tid = [];
var mouseout_tid = [];
var winWidth = 0;
var winHeight = 0;
function winSize(){
	if (window.innerWidth)
		winWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
		winWidth = document.body.clientWidth;
	if (window.innerHeight)
		winHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
		winHeight = document.body.clientHeight;
	if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth)
	{
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
	}
	if(winWidth<951){
			
			if($('.mobile-head-items').length<1 && $('.mobile-nav-items').length<1 && $('.mobile-cart-items').length<1){
			var mobileService='<div class="mobile-head-items"><div class="mobile-head-item mobile-head-home"><div class="title"><a href="/"></a></div></div><div class="mobile-head-item mobile-head-nav"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div><div class="mobile-head-item mobile-head-language"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div><div class="mobile-head-item mobile-head-search"><div class="title"></div><div class="main-content-wrap middle-content-wrap"><div class="content-wrap"></div></div></div><div class="mobile-head-item mobile-head-social"><div class="title"></div><div class="main-content-wrap middle-content-wrap"><div class="content-wrap"></div></div></div></div>'
			$('.head-wrapper').append(mobileService)
			if($('body .aside').length>0){
				$('.mobile-head-items').append('<div class="mobile-head-item mobile-head-aside"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div>')
				}
			/*if($('.mobile-contact').length<1 && $('.head-contact').length>0){
				var mobileContact='<div class="mobile-contact"></div>'
				$('body').append(mobileContact)
			}*/
		 
		  mobileTabContainer('.tab-content-wrap','.tab-title','.tab-panel','span','.tab-panel-content')
					
$('.mobile-head-item').each(function(){
	$(this).find('.title').click(function(){
		if($(this).parents('.mobile-head-item').find('.main-content-wrap').length>0){
		var pItem=$(this).parents('.mobile-head-item')
		if(!pItem.find('.main-content-wrap').hasClass('show-content-wrap')){
			pItem.find('.main-content-wrap').addClass('show-content-wrap')
			pItem.find('.side-content-wrap').stop().animate({'left':'0'},300)
			pItem.find('.middle-content-wrap').addClass('middle-show-content-wrap')
			pItem.find('.side-content-wrap').append("<b class='mobile-ico-close'></b>")
			
			pItem.siblings('.mobile-head-item').find('.main-content-wrap').removeClass('show-content-wrap')
		 	pItem.siblings('.mobile-head-item').find('.side-content-wrap').stop().animate({'left':'-70%'},300) 
			pItem.siblings('.mobile-head-item').find('.middle-content-wrap').removeClass('middle-show-content-wrap')
			pItem.siblings('.mobile-head-item').find('.side-content-wrap .mobile-ico-close').remove()
			if($('body').find('.mobile-body-mask').length<1){
				$('body').append('<div class="mobile-body-mask"></div>')
			}
			 
		}
		else{
			pItem.find('.main-content-wrap').removeClass('show-content-wrap')
			pItem.find('.side-content-wrap').stop().animate({'left':'-70%'},300) 
			pItem.find('.middle-content-wrap').removeClass('middle-show-content-wrap')
			pItem.find('.side-content-wrap .mobile-ico-close').remove()
			}
		$('.mobile-body-mask').click(function(){
			$('.mobile-body-mask').remove()
			$('.mobile-head-item .main-content-wrap').removeClass('show-content-wrap')
			$('.mobile-head-item .side-content-wrap').animate({'left':'-70%'},300) 
			$('.mobile-head-item .middle-content-wrap').removeClass('middle-show-content-wrap')
			$('.mobile-head-item .side-content-wrap .mobile-ico-close').remove()
		})	
		$('.mobile-ico-close').click(function(){
			$('.mobile-body-mask').remove()
			$('.mobile-head-item .main-content-wrap').removeClass('show-content-wrap')
			$('.mobile-head-item .side-content-wrap').stop().animate({'left':'-70%'},300) 
			$('.mobile-head-item .middle-content-wrap').removeClass('middle-show-content-wrap')
			$('.mobile-head-item .side-content-wrap .mobile-ico-close').remove()
		})	
		
		}
	})
})
$('.change-language .change-language-cont ').clone().appendTo('.mobile-head-item.mobile-head-language .main-content-wrap .content-wrap')
$('.head-search-form').clone().appendTo('.mobile-head-item.mobile-head-search .main-content-wrap .content-wrap')
$('.nav-bar .nav').clone().appendTo('.mobile-head-item.mobile-head-nav .main-content-wrap .content-wrap')
$('.head-social').clone().appendTo('.mobile-head-item.mobile-head-social .main-content-wrap .content-wrap')
$('.aside .aside-wrap').clone().appendTo('.mobile-head-item.mobile-head-aside .main-content-wrap .content-wrap')
 
/*$('.head-contact').clone().appendTo('.mobile-contact')*/
		}
$(document).ready(function(){
	$('#rev_slider_3_1 ul li').each(function(index){
		 if((index+1)%2==0){
			 $(this).removeClass('evenItem')
			$(this).find('.tp-caption.itemImg').addClass('lfb').removeClass('lft').attr('data-x','700')
			$(this).find('.tp-caption.itemTitle').attr('data-x','0') 
			$(this).find('.tp-caption.itemDetail').addClass('lfl').removeClass('lfr').attr('data-x','0')
			$(this).find('.tp-caption.itemMore').attr('data-x','0')  
			 }
	
		})
	 
	
	})
	}
	//mobile end
	else{
		
		
	$(document).ready(function(){
		
	 
		
		 
		 
		$('.mobile-body-mask,.mobile-head-items,.mobile-nav-items,.mobile-cart-items,.mobile-tab-items,.mobile-contact').remove()	
		
	//nav
$('.nav').children('li').each(function(){
	var te=$(this).children('a').children('em').text()
	$(this).children('a').children('em').attr('data-hover',te)
	})
 
	$('.nav li').each(function(index){
			if($(this).children('ul').length>0){
				if($(this).children('a').find('.nav-ico').length<1){
					$(this).children('a').append("<i class='nav-ico'></i>")
					}			
				
			$(this).hover( 
				function(){
					var _self = this;
					clearTimeout(mouseout_tid[index]);
					mouseover_tid[index] = setTimeout(function() {
						$(_self).children('ul').fadeIn();
					}, 50);
				},
	 			function(){
					var _self = this;
					clearTimeout(mouseover_tid[index]);
					mouseout_tid[index] = setTimeout(function() {
						$(_self).children('ul').fadeOut();
				  }, 50);
				}
			);
			}
			
		})
			
 
 })
 	
$(document).ready(function(){
		$('.items_content').each(function(){
		  if($(this).find('li').length>1){
	   
		  $(".items_content").jCarouselLite({
			 btnPrev: ".btn-prev",
			 btnNext: ".btn-next",
			 speed:100,
			 auto:false,
			 scroll:1,
			 visible:5,
			 vertical:true,
			 circular:false,
			 onMouse:true
		  });
		  }	
		   	  
   })
	})
	
		}
		
	
}  
$(function(){
    winSize();
	$('.main .detail-wrap table').each(function(){
		 if(!$(this).parent().hasClass('table_wrap')){
			 	$(this).wrap("<div class='table_wrap'><//div>")
				var tableWidth=$(this).outerWidth()
				var tabWrapWidth=$('.main').outerWidth()
				if(tableWidth>tabWrapWidth){
					$(this).parent('.table_wrap').css('overflow-x','scroll')
					}else{
						$(this).parent('.table_wrap').css('overflow-x','hidden')
						}
			 }
		 })
})
$(window).resize(function() {
  winSize();
  $('.main .detail-wrap table').each(function(){
		 if(!$(this).parent().hasClass('table_wrap')){
			 	$(this).wrap("<div class='table_wrap'><//div>")
				var tableWidth=$(this).outerWidth()
				var tabWrapWidth=$('.main').outerWidth()
				if(tableWidth>tabWrapWidth){
					$(this).parent('.table_wrap').css('overflow-x','scroll')
					}else{
						$(this).parent('.table_wrap').css('overflow-x','hidden')
						}
			 }
		 })
});
})(jQuery);
$(document).ready(function(){
	
 
});
//scroll
(function($){$.fn.jCarouselLite=function(o){o=$.extend({btnPrev:null,btnNext:null,btnGo:null,mouseWheel:false,onMouse: false,auto:null,speed:500,easing:null,vertical:false,circular:true,visible:4,start:0,scroll:1,beforeStart:null,afterEnd:null},o||{});return this.each(function(){var b=false,animCss=o.vertical?"top":"left",sizeCss=o.vertical?"height":"width";var c=$(this),ul=$("ul",c),tLi=$("li",ul),tl=tLi.size(),v=o.visible;var TimeID=0;if(o.circular){ul.prepend(tLi.slice(tl-v-1+1).clone()).append(tLi.slice(0,v).clone());o.start+=v}var f=$("li",ul),itemLength=f.size(),curr=o.start;c.css("visibility","visible");f.css({overflow:"",float:o.vertical?"none":"left"});ul.css({position:"relative","list-style-type":"none","z-index":"1"});c.css({overflow:"hidden",position:"relative","z-index":"2",left:"0px"});var g=o.vertical?height(f):width(f);var h=g*itemLength;var j=g*v;f.css({width:f.width(),height:f.outerHeight()});ul.css(sizeCss,h+"px").css(animCss,-(curr*g));c.css(sizeCss,j+"px");if(o.btnPrev)$(o.btnPrev).click(function(){return go(curr-o.scroll)});if(o.btnNext)$(o.btnNext).click(function(){return go(curr+o.scroll)});if(o.btnGo)$.each(o.btnGo,function(i,a){$(a).click(function(){return go(o.circular?o.visible+i:i)})});if(o.mouseWheel&&c.mousewheel)c.mousewheel(function(e,d){return d>0?go(curr-o.scroll):go(curr+o.scroll)});if (o.auto)		TimeID=setInterval(function(){	go(curr + o.scroll);},o.auto+o.speed);if(o.onMouse){ul.bind("mouseover",function(){if(o.auto){clearInterval(TimeID);}}),ul.bind("mouseout",function(){if(o.auto){TimeID=setInterval(function(){go(curr+o.scroll);},o.auto+o.speed);}})}function vis(){return f.slice(curr).slice(0,v)};function go(a){if(!b){if(o.beforeStart)o.beforeStart.call(this,vis());if(o.circular){if(a<=o.start-v-1){ul.css(animCss,-((itemLength-(v*2))*g)+"px");curr=a==o.start-v-1?itemLength-(v*2)-1:itemLength-(v*2)-o.scroll}else if(a>=itemLength-v+1){ul.css(animCss,-((v)*g)+"px");curr=a==itemLength-v+1?v+1:v+o.scroll}else curr=a}else{if(a<0||a>itemLength-v)return;else curr=a}b=true;ul.animate(animCss=="left"?{left:-(curr*g)}:{top:-(curr*g)},o.speed,o.easing,function(){if(o.afterEnd)o.afterEnd.call(this,vis());b=false});if(!o.circular){$(o.btnPrev+","+o.btnNext).removeClass("disabled");$((curr-o.scroll<0&&o.btnPrev)||(curr+o.scroll>itemLength-v&&o.btnNext)||[]).addClass("disabled")}}return false}})};function css(a,b){return parseInt($.css(a[0],b))||0};function width(a){return a[0].offsetWidth+css(a,'marginLeft')+css(a,'marginRight')};function height(a){return a[0].offsetHeight+css(a,'marginTop')+css(a,'marginBottom')}})(jQuery);
 
$(function(){
	 var full_height = function()
        {
            if($(window).height() > 590)
            {
                if($('body').length > 0)
                {
                    $('.page-end').unbind().bind('click', function(){
                        $("html, body").animate({ scrollTop: $('.foot-wrapper').offset().top }, 2000);
                    }).css({cursor: 'pointer'});
                }
/*
                $(window).bind('scroll', function(){
                    footer_lock();
                });
                footer_lock();
*/
            }          
        }
        full_height();
        $(window).resize(function(){
            full_height();
        });
	var mHeadTop=$('.nav-bar').offset().top
    var $backToTopTxt="top", $backToTopEle = $('<span class="gotop"></span>').appendTo($("body"))
        .text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
            $("html, body").animate({ scrollTop:0 }, 1000);
			
    }), $backToTopFun = function() {	
        var st = $(document).scrollTop(), winh = $(window).height();
        (st > mHeadTop)? $backToTopEle.fadeIn(): $backToTopEle.fadeIn();  		
        if (!window.XMLHttpRequest) {
            $backToTopEle.css("top", st + winh - 210); 
        }
		
    };
 $(window).bind("scroll", $backToTopFun);
    $(function() { $backToTopFun();});
	
	var $nav = $('.nav-bar'), navTop = $nav.offset().top, navH = $nav.outerHeight(),winTop_1=0,winWidth=$(window).width(), holder=jQuery('<div>');
		$(window).on('scroll',function(){
			var winTop_2 = $(window).scrollTop();
			holder.css('height',navH);
			
			if(winTop_2>navTop && winWidth>980){
				holder.show().insertBefore($nav);
				$nav.addClass('fixed-nav');
			}else{
				holder.hide();
				$nav.removeClass('fixed-nav');
			}
			
			if(winTop_2>winTop_1 && winWidth>980){
				$nav.removeClass('fixed-nav-appear');
			}else if(winTop_2<winTop_1){
				$nav.addClass('fixed-nav-appear');
			}
			winTop_1 = $(window).scrollTop();
		})
	 
//tab		
tabContainer('.tab-content-wrap','.tab-title','.tab-panel')      
   
});
 
$(document).ready(function(){
 
   
	 
	
	/*侧栏产品分类*/
	$('.side-widget .side-cate li').each(function(){
		if($(this).find('ul').length>0){
 
			$(this).append("<span class='icon-cate icon-cate-down'></span>")
			$(this).children('.icon-cate').click(function(e){
							if($(this).parent('li').children('ul').is(':hidden')){
								$(this).parent('li').children('ul').slideDown(100);
									$(this).removeClass('icon-cate-down').addClass('icon-cate-up');
								}else{
									$(this).parent('li').children('ul').slideUp(100);
									$(this).removeClass('icon-cate-up').addClass('icon-cate-down');
									}
									e.stopPropagation();
							})
			
			}
		})
		if($('.side-widget .side-cate .nav-current').parents('ul').length>0 && $('.side-widget .side-cate .nav-current').find('ul').length>0) {
		$('.side-widget .side-cate .nav-current').parents('ul').show()
		$('.side-widget .side-cate .nav-current').parents('li').addClass("show_li")
		$('.side-widget .side-cate .nav-current').parents('li.show_li').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up')
		$('.side-widget .side-cate .nav-current').children('ul').show()
		$('.side-widget .side-cate .nav-current ').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up');
		}
		 else if($('.side-widget .side-cate .nav-current').parents('ul').length>0 && $('.side-widget .side-cate .nav-current').find('ul').length<1){
			 $('.side-widget .side-cate .nav-current').parents('ul').show()
			 $('.side-widget .side-cate .nav-current').parents('li').addClass("show_li")
			 $('.side-widget .side-cate .nav-current').parents('li.show_li').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up')
			}
		 else if($('.side-widget .side-cate .nav-current').parents('ul').length<1 && $('.side-widget .side-cate .nav-current').find('ul').length>0){
			$('.side-widget .side-cate .nav-current').children('ul').show()
			$('.side-widget .side-cate .nav-current').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up');
			}
		$('.gm-sep,.main-product-wrap .items-content ').contents().filter(function() {
		return this.nodeType === 3;
		}).remove();
	
	$('.client-slide').owlCarousel({
					autoplay:true,
					loop:true,
					margin:0,
					dots:  true,
					nav:  false,
					autoplayTimeout:30000,
					smartSpeed:180,
					lazyLoad:true,
					responsive: {
	                  0: {
								
						items:1,
					slideBy:1
									
								  },
	                  380: {
								
						items:2,
					slideBy:2
									
								  },
 	                  768: {
						items:3,
					slideBy:3,
	                  },
	                  950: {
						items:4,
					slideBy:4,
	                  },
	                  1200: {
						items:5,
					slideBy:5,
	                  }
	                }
					
				});	
 
 
	$('.index-product-wrap .product-items .items-content').owlCarousel({
					autoplay:true,
					loop:true,
					margin:0,
					dots:  true,
					autoplayTimeout:30000,
					smartSpeed:180,
					lazyLoad:true,
					responsive: {
	                  0: {
								
						items:1,
					slideBy:1
									
								  },
	                  321: {
								
						items:2,
					slideBy:2
									
								  },
	                  768: {
						dots: false,
						nav:  true,
						items:4,
					slideBy:4,
	                  }
	                }
					
				});	
 
		if($('.image-additional ul li').length>1){
				$('.image-additional ul').owlCarousel({
					autoplay:false,
					loop:false,
					margin:0,
					autoplayTimeout:30000,
					smartSpeed:180,
					lazyLoad:true,
					mouseDrag:true,
					slideBy:1,
					responsive: {
								  0: {
									nav: false,
									dots: true,
									items:1,
								  },
								  951: {
									nav: true,
									dots: false,
									items:3,
									
								  }
								}
				});
			}
		else{
			$('.image-additional ul li').addClass('single')
			}
		
			
	$('.goods-items').owlCarousel({
					autoplay:true,
					loop:true,
					margin:0,
					dots:  true,
					autoplayTimeout:30000,
					smartSpeed:180,
					lazyLoad:true,
					
					responsive: {
	                  0: {
								
						items:1,
					slideBy:1
									
								  },
	                  321: {
								
						items:2,
					slideBy:2
									
								  },
					  500: {
									 
						items:3,
					slideBy:3
									
								  },
	                  769: {
						dots: false,
						nav:  true,
						items:3,
					slideBy:3,
	                  }
	                }
					
				});		
 
 $('.banner_flexslider,.about-img,.main-banner').flexslider({
		animation:"fade",
		direction:"horizontal",
		animationLoop:true,
		slideshow:true,
		directionNav: false, 
        controlNav: true,
		slideshowSpeed:7000, 
		animationSpeed: 600,
		touch: true 
	});
	$('.entry').find('img').parents('a').addClass('fancybox')
	$("a.fancybox").fancybox();
	
	$('.inquiry-form .form-item').each(function(index){
		$(this).addClass('form-item'+(index+1))
		})
   var demo = $(".inquiry-form,.wpcf7-form").Validform({
      tiptype : 3,
      showAllError : true,
      ajaxPost : false
   });
   demo.addRule([
	  {
      ele : "input.form-input-email",
      datatype : "e",
      nullmsg:"Please enter a valid email address",
      errormsg:"Please enter a valid email address"
      }, {
      ele : "input.form-input-name",
      datatype : "*1-200",
      nullmsg:"Please enter a valid user name",
      errormsg:"Please enter a valid user name"
      }
   ])
})
function tabContainer(container,title,panel){
	$(container).each(function(){
		$(this).find(title).each(function(){
			if($(this).hasClass('current')){
			j=$(this).index();
			$(this).parents(container).find(panel).eq(j).removeClass('disabled')
			}
			$(this).click(function(){
			i=$(this).index();
			$(this).addClass('current').siblings().removeClass('current');
			$(this).parents(container).find(panel).eq(i).show();
			$(this).parents(container).find(panel).not($(this).parents(container).find(panel).eq(i)).hide();
    	})   
			})
		})
	 
	}
			
function mobileTabContainer(container,title,panel,titleSpan,panelContent){
	$(container).each(function(){
		 if($(this).find(title).length>0 && $(this).find(panel).length>0){
			  $(this).append('<div class="mobile-tab-items"></div>')
					 var mobileTabItem='<div class="mobile-tab-item"><h2 class="mobile-tab-title"></h2><div class="mobile-tab-panel"></div></div>'
					 $(this).find(title).each(function(){
						$(this).parents(container).find('.mobile-tab-items').append(mobileTabItem)
						 })
		 }
		 var mobileTabTitle=$(this).find('.mobile-tab-items .mobile-tab-title')
					var mobileTabPanel=$(this).find('.mobile-tab-items .mobile-tab-panel')
					for(var i=0;i<$(this).find(title).length;i++){
						 $(this).find(title).eq(i).find(titleSpan).clone().appendTo(mobileTabTitle.eq(i))
						 $(this).find(panel).eq(i).find(panelContent).clone().appendTo(mobileTabPanel.eq(i))
						}
	})
	
	}
function picturesShow(container,picturesItem,length){	
	var containerWidth=$(container).width()
	var itemCurrentWidth=((1-1/8*(length-1))*100)+"%"
	var itemWidth=(1/8*100)+"%"
	$(container).find(picturesItem).css('width',itemWidth)
	$(container).find(picturesItem).eq(0).addClass('current').css('width',itemCurrentWidth)
	$(container).find(picturesItem).find('.item-wrap').css('width',containerWidth*(1-1/8*(length-1)) )
	$(container).find(picturesItem).each(function(){
		$(this).click(function(){
			$(this).addClass('current').stop().animate({'width':itemCurrentWidth},600)
			$(this).siblings().removeClass('current').stop().animate({'width':itemWidth},300)
			 
			})
	})
	}
 
$(function(){
if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))){
	var wow = new WOW({
	    boxClass: 'wow',
	    animateClass: 'animated',
	    offset: 0,
	    mobile: false,
	    live: true
	});
	wow.init();
};
})
function decrease(item,time){
	var i=0;
	var j=item.length;
	item.each(function(){
	 i++
	 j--
	 var ii=(i-1)
	 var jj=time*j
	item.eq(ii).attr('data-wow-delay',jj+'s')
	 })
	}
function add(item,time){
	item.each(function(index){
	$(this).attr('data-wow-delay',(index*time)+'s')
	 })
	}
$(function(){
	add( $('.company-synopses .synopsis-item'),.1)
	add( $('.index-advertising-wrap .advertising-item'),.1)
	add( $('.product-items .product-item'),.1)
	decrease( $('.news-items .news-item'),.1)
	 containerItems('.foot-item-news',2,'.foot-cont','.new-item',1,1,1,1) 
	})
 
function containerItems(container,itemDisplayLength,containerName,cItem,showItems,showItems01,showItems02,showItems03){
	$(container).each(function(){
	$(this).find(containerName).hide()
	var itemLength=$(this).find(containerName).find(cItem).size()
	if($(this).find('.product-container').length<1){
		$(this).append("<div class='product-container'></div>")
		}
	for(var i=0;i<(itemLength/itemDisplayLength);i++){
		
	$(this).find('.product-container').append("<div class='product-slide-item'></div>")
	}		
	$(this).find('.product-container').find('.product-slide-item').each(function(){
		var itemContIndex=parseInt($(this).index())
		if(itemContIndex>0){
			var itemIndex=itemContIndex*itemDisplayLength;
			var current=$(this).parents('.product-container').find('.product-slide-item').eq(itemContIndex);
		 	for(var i=0;i<itemDisplayLength;i++){
				var move=$(this).parents(container).find(containerName).find(cItem).eq(itemIndex+i);
				move.clone().appendTo(current);
			 	}
			}
		else{
			for(var i=0;i<itemDisplayLength;i++){
				var move=$(this).parents(container).find(containerName).find(cItem).eq(i);
				move.clone().appendTo($(this).parents('.product-container').find('.product-slide-item').eq(0));
				
			 	}
			}	
		
		})
var productContainer=$(this).find('.product-container')
		productContainer.owlCarousel({
		loop:true,
		margin:0,
		dots:  true,
		smartSpeed:180,
		lazyLoad:true,
		dots: true,
		nav:true,
		mouseDrag:true,
		items:4,
		slideBy:4,
		responsive: {
			0: {
		items:showItems03,
		slideBy:showItems03
		
			},
			320: {
		items:showItems02,
		slideBy:showItems02
		
			},
			480: {
		items:showItems01,
		slideBy:showItems01
		
			},
		
		640: {
		items:showItems,
		slideBy:showItems
			}
		}
	})
		
})
		
}
 $(function(){
										  $('.search-toggle').on('click',function(){
											  var tasking=$(this).parents('.head-wrapper').find('.tasking');
											  var hdSearch=$(this).parents('.head-search');
											  if(tasking.is(':hidden')){
												  tasking.show()
												  $(this).hide()
												  }else{
													  tasking.delay(600).hide()
													   $(this).show()
													  }
											if(!hdSearch.hasClass('head-search-show')){
												hdSearch.addClass('head-search-show');
											}else{
												hdSearch.removeClass('head-search-show');
												}	
											  
											  })
											 $('.head-search').on('click',function(e){
		e.stopPropagation();
	})
	$(document).on('click',function(){
			$('.head-wrapper .tasking').delay(600).fadeOut()
			$('.head-search .search-toggle').show()
			$('.head-search').removeClass('head-search-show');
	})
										  })
										  
										  
										  
$(function(){
	$('.faq-item').each(function(index){
		var _this=$(this)
		var title=_this.find('.faq-title')
		var cont=_this.find('.faq-cont')
		if(index==0){
			title.addClass('show-title')
			}
		title.on('click',function(){
			if(cont.is(':hidden') && !$(this).hasClass('show-title')){
				cont.slideDown('fast')
				$(this).addClass('show-title')
				_this.siblings().find('.faq-title').removeClass('show-title')
				_this.siblings().find('.faq-cont').slideUp('fast')
				}
				else{
					cont.slideUp('fast')
					$(this).removeClass('show-title')
					}
			})
		})
	})
	
/*language*/
function changeuRL(link){
	var curUrl=document.location.href; 
 	var oldUrl=window.location.host+'/';
 	var lgArr=['fr/','de/','pt/','es/','ru/','ko/','ar/','ga/','ja/','el/','tr/','it/','da/','ro/','id/','cs/','af/','sv/','pl/','eu/','ca/','eo/','hi/','lo/','sq/','am/','hy/','az/','be/','bn/','bs/','bg/','ceb/','ny/','co/','hr/','nl/','et/','tl/','fi/','fy/','gl/','ka/','gu/','ht/','ha/','haw/','iw/','hmn/','hu/','is/','ig/','jw/','kn/','kk/','km/','ku/','ky/','la/','lv/','lt/','lb/','mk/','mg/','ms/','ml/','mt/','mi/','mr/','mn/','my/','ne/','no/','ps/','fa/','pa/','sr/','st/','si/','sk/','sl/','so/','sm/','gd/','sn/','sd/','su/','sw/','tg/','ta/','te/','th/','uk/','ur/','uz/','vi/','cy/','xh/','yi/','yo/','zu/','zh-CN/','zh-TW/','zh/']; 
	$.each(lgArr,function(i,lenItem){  
		var lgUrl=oldUrl.toString()+lenItem;
		if(curUrl.indexOf(lgUrl)!=-1){
			link.each(function(i){
				if(!$(this).parents().hasClass('language-flag')){
					var iLink;
					if($(this).prop('href')){
						iLink=$(this).prop('href');
					}
					if(String(iLink).indexOf(oldUrl)!=-1 &&  String(iLink).indexOf(lgUrl)==-1 && curUrl.indexOf(lgUrl)!=-1){
						var newLink=iLink.replace(oldUrl,lgUrl);
						$(this).attr('href',newLink);
					}
				}
			})
		}
	}); 
}
$(function(){
	changeuRL($('a'));
})
	$(document).ready(function(){
		$('.prisna-wp-translate-seo').contents().filter(function() {
		return this.nodeType === 3;
		}).remove();
		$('.change-language .change-language-cont').append("<div class='change-empty'>Untranslated</div>")
		$('.prisna-wp-translate-seo').append("<div class='lang-more'>More Language</div>")
		if($('body .prisna-wp-translate-seo').length>0 && $('.change-language .prisna-wp-translate-seo').length<1){
			$('.prisna-wp-translate-seo').appendTo('.change-language-cont')
			if($('.change-language .change-language-cont .prisna-wp-translate-seo li').length>0){
				$('.change-language .change-language-cont .change-empty').hide()
				$('.change-language .change-language-cont .prisna-wp-translate-seo li').each(function(index){
					if(index>14 ){
						$(this).addClass('lang-item lang-item-hide')
						$('.change-language-cont').find('.lang-more').show()
						}else{
							$('.change-language-cont').find('.lang-more').hide()
							}
					})
					if($('.change-language-cont .lang-more').length>0){
						$('.change-language-cont .lang-more').click(function(){
							if($(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').hasClass('lang-item-hide')){
								$(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').removeClass('lang-item-hide')
								$(this).text('x')
								}else{
									$(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').addClass('lang-item-hide')
									$(this).text('More Language')
									}
							})
						}
				}else{
					$('.change-language .change-language-cont .change-empty').fadeIn()
					}
			}
			var mouseover_tid = [];
var mouseout_tid = [];
	$('.change-language').each(function(index){
			$(this).hover( 
				function(){
					var _self = this;
					clearTimeout(mouseout_tid[index]);
					mouseover_tid[index] = setTimeout(function() {
						$(_self).find('.sub-content').slideDown();
						$('.change-language-info .change-language-title').addClass('title-show').removeClass('title-hide');
					}, 150);
				},
	 			function(){
					var _self = this;
					clearTimeout(mouseover_tid[index]);
					mouseout_tid[index] = setTimeout(function() {
						$(_self).find('.sub-content').slideUp();
						$('.change-language-info .change-language-title').addClass('title-hide').removeClass('title-show');
				  }, 50);
				}
			);
		})
		})
$(function(){
$('body .inquiry-form-wrap.ct-inquiry-form').append('<div class="ad_prompt">Write your message here and send it to us</div>')
	if($('body .inquiry-form-wrap.ct-inquiry-form').length>0 && $('.scrollsidebar#scrollsidebar .side_list .email').length>0){
		var webTop=$('body .inquiry-form-wrap.ct-inquiry-form').offset().top-50
		$('.scrollsidebar#scrollsidebar .side_list .email').after('<a class="ad_email" href="javascript:">'+ $('.scrollsidebar#scrollsidebar .side_list .email').text()+'</a>')
		$('.scrollsidebar#scrollsidebar .side_list .email').css('display','none')
		$('.scrollsidebar#scrollsidebar .side_list .ad_email').click(function(){
			 $("html, body").animate({ scrollTop:webTop }, 1000);
			 $(".ad_prompt").show().delay(3000).hide(300);
			})
		}
	})
$(function(){
	if($('body .inquiry-form-wrap.ct-inquiry-form').length>0 && $('.email.inquiryfoot').length>0){
		var webTop=$('body .inquiry-form-wrap.ct-inquiry-form').offset().top-50
		$('.email.inquiryfoot').before('<a class="email inquiryfoot ad_inquiryfoot" href="javascript:">'+ $('.email.inquiryfoot').text()+'</a>')
		$('.email.inquiryfoot.ad_inquiryfoot').click(function(){
			 $("html, body").animate({ scrollTop:webTop }, 1000);
			 $(".ad_prompt").show().delay(3000).hide(300);
			})
		}
	})
$(function(){
	if($('body .inquiry-form-wrap.ct-inquiry-form').length>0 && $('.product-btn-wrap .email').length>0){
		var webTop=$('body .inquiry-form-wrap.ct-inquiry-form').offset().top-50
		$('.product-btn-wrap .email').before('<a class="email page_pd_email" href="javascript:">'+ $('.product-btn-wrap .email').text()+'</a>')
		$('.product-btn-wrap .email.page_pd_email').click(function(){
			 $("html, body").animate({ scrollTop:webTop }, 1000);
			 $(".ad_prompt").show().delay(3000).hide(300);
			})
		}
	});
/* CALL PLACEHOLDER */
	setREVStartSize();
	var tpj=jQuery;
	/*tpj.noConflict();*/
	var revapi3;
	tpj(document).ready(function() {
	if(tpj('#rev_slider_3_1').revolution == undefined){
		revslider_showDoubleJqueryError('#rev_slider_3_1');
	}else{
	   revapi3 = tpj('#rev_slider_3_1').show().revolution({	
			dottedOverlay:"none",
			delay:9000,
			startwidth:1920,
			startheight:750,
			});
		}
	});
$(function() { 
                $("#scrollsidebar").fix({
                    float : 'right',
                    durationTime : 400 
          });
   $('input[name=refer]').val(window.location.href);
            });