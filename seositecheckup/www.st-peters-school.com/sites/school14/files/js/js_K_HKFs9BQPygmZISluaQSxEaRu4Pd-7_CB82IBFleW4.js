(function($,_,Drupal,drupalSettings){'use strict';Drupal.behaviors.horizontal_scroller={attach:function(context){setTimeout(function(){const paragraphsElementCls=".paragraph--type--bp-column-wrapper.paragraph--view-mode--horizontal-content .paragraph";if(!$(paragraphsElementCls).length){return false;}
let topPos;const windowWidthFunc=()=>{let windowWidth=$(window).width();if(windowWidth<=991){topPos="-2%";}else if(windowWidth>=992&&windowWidth<=1184){topPos="-14.3%"}else if(windowWidth>=1185&&windowWidth<=1240){topPos="-13.3%"}else if(windowWidth>=1241&&windowWidth<=1280){topPos="-12.8%"}else if(windowWidth>=1281&&windowWidth<=1360){topPos="-12%"}else if(windowWidth>=1361&&windowWidth<=1410){topPos="-11.7%"}else if(windowWidth>=1411&&windowWidth<=1480){topPos="-11%"}else if(windowWidth>=1900){topPos="-7%"}else{topPos="-10.3%"}}
windowWidthFunc();ScrollTrigger.addEventListener("refreshInit",windowWidthFunc);gsap.registerPlugin(ScrollTrigger);ScrollTrigger.matchMedia({"(min-width: 960px)":function(){const titleElementWrapper=".paragraph--type--bp-columns.paragraph--view-mode--horizontal-content .titlewrap";const titleElementCls=".paragraph--type--bp-columns.paragraph--view-mode--horizontal-content .titlewrap .hs-line-11";if($(titleElementCls).length){let tl=gsap.timeline({scrollTrigger:{trigger:titleElementWrapper,start:"-100 top",invalidateOnRefresh:true,pin:true,pinSpacing:false}});gsap.fromTo(".paragraph--type--bp-columns.paragraph--view-mode--horizontal-content .titlewrap .whitetext",{clipPath:"polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",},{scrollTrigger:{trigger:".paragraph--type--bp-column-wrapper.paragraph--view-mode--horizontal-content",scrub:true,start:()=>topPos+" top+="+document.querySelector(".paragraph--view-mode--horizontal-content .titlewrap .hs-line-11").offsetHeight,end:()=>'+='+document.querySelector(".paragraph--view-mode--horizontal-content .titlewrap .hs-line-11").offsetHeight,invalidateOnRefresh:true},clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",ease:'none'});gsap.fromTo(".paragraph--type--bp-columns.paragraph--view-mode--horizontal-content .titlewrap .component-intro",{opacity:1,},{scrollTrigger:{trigger:".paragraph--type--bp-columns.paragraph--view-mode--horizontal-content .titlewrap .component-intro",scrub:true,start:'-200 0',end:'-80% 0',},opacity:0,ease:'none'});}
const sections=gsap.utils.toArray(paragraphsElementCls);let maxWidth=50;const getMaxWidth=()=>{maxWidth=50;sections.forEach((section)=>{maxWidth+=section.offsetWidth;});};getMaxWidth();ScrollTrigger.addEventListener("refreshInit",getMaxWidth);gsap.to(sections,{x:()=>`-${maxWidth-window.innerWidth}`,ease:"none",scrollTrigger:{trigger:".paragraph--type--bp-column-wrapper.paragraph--view-mode--horizontal-content",pin:true,scrub:true,start:"-=10 top",end:()=>`+=${maxWidth}`,onEnter:()=>document.querySelector('.paragraph--view-mode--horizontal-content .titlewrap').classList.add('started'),onLeaveBack:()=>document.querySelector('.paragraph--view-mode--horizontal-content .titlewrap').classList.remove('started')}});sections.forEach((sct,i)=>{ScrollTrigger.create({trigger:sct,start:()=>'-=10 top-='+(sct.offsetLeft-window.innerWidth/2)*(maxWidth /(maxWidth-window.innerWidth)),end:()=>'+='+sct.offsetWidth*(maxWidth /(maxWidth-window.innerWidth)),toggleClass:{targets:sct,className:"active"}});});}});},1200);}};})(window.jQuery,window._,window.Drupal,window.drupalSettings);;
(function($,_,Drupal,drupalSettings){'use strict';Drupal.behaviors.animatedTestimonial={attach:function(context){$('.testimonial-quote-original').each(function(){const $original=$(this);const $duplicate=$(this).next('.testimonial-quote-duplicate');if(!$original.length||!$duplicate.length){return;}
let eleWidth=$original.width();let clone=$original.text();const splitTextAnimation=(eleWidth)=>{gsap.registerPlugin(ScrollTrigger);$duplicate.text(clone);$duplicate.splitLines({width:eleWidth,tag:'<div class="line">'});const lines=gsap.utils.toArray('.line');lines.forEach(line=>{gsap.fromTo(line,{clipPath:"polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"},{scrollTrigger:{trigger:line,scrub:true,start:"0% center",end:"100% center",},clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"});});}
ScrollTrigger.addEventListener("refreshInit",function(){eleWidth=$original.width();setTimeout(function(){splitTextAnimation(eleWidth);},1000);});setTimeout(function(){splitTextAnimation(eleWidth);},1000);});}};})(window.jQuery,window._,window.Drupal,window.drupalSettings);;
Drupal.debounce=function(func,wait,immediate){var timeout=void 0;var result=void 0;return function(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}
var context=this;var later=function later(){timeout=null;if(!immediate){result=func.apply(context,args);}};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow){result=func.apply(context,args);}
return result;};};;
(function($,Drupal,drupalSettings){'use strict';Drupal.extlink=Drupal.extlink||{};Drupal.extlink.attach=function(context,drupalSettings){if(!drupalSettings.data.hasOwnProperty('extlink')){return;}
var extIconPlacement='append';if(drupalSettings.data.extlink.extIconPlacement&&drupalSettings.data.extlink.extIconPlacement!='0'){extIconPlacement=drupalSettings.data.extlink.extIconPlacement;}
var pattern=/^(([^\/:]+?\.)*)([^\.:]{1,})((\.[a-z0-9]{1,253})*)(:[0-9]{1,5})?$/;var host=window.location.host.replace(pattern,'$2$3$6');var subdomain=window.location.host.replace(host,'');var subdomains;if(drupalSettings.data.extlink.extSubdomains){subdomains='([^/]*\\.)?';}
else if(subdomain==='www.'||subdomain===''){subdomains='(www\\.)?';}
else{subdomains=subdomain.replace('.','\\.');}
var whitelistedDomains=false;if(drupalSettings.data.extlink.whitelistedDomains){whitelistedDomains=[];for(var i=0;i<drupalSettings.data.extlink.whitelistedDomains.length;i++){whitelistedDomains.push(new RegExp('^https?:\\/\\/'+drupalSettings.data.extlink.whitelistedDomains[i].replace(/(\r\n|\n|\r)/gm,'')+'.*$','i'));}}
var internal_link=new RegExp('^https?://([^@]*@)?'+subdomains+host,'i');var extInclude=false;if(drupalSettings.data.extlink.extInclude){extInclude=new RegExp(drupalSettings.data.extlink.extInclude.replace(/\\/,'\\'),'i');}
var extExclude=false;if(drupalSettings.data.extlink.extExclude){extExclude=new RegExp(drupalSettings.data.extlink.extExclude.replace(/\\/,'\\'),'i');}
var extCssExclude=false;if(drupalSettings.data.extlink.extCssExclude){extCssExclude=drupalSettings.data.extlink.extCssExclude;}
var extCssExplicit=false;if(drupalSettings.data.extlink.extCssExplicit){extCssExplicit=drupalSettings.data.extlink.extCssExplicit;}
var external_links=[];var mailto_links=[];$('a:not([data-extlink]), area:not([data-extlink])',context).each(function(el){try{var url='';if(typeof this.href=='string'){url=this.href.toLowerCase();}
else if(typeof this.href=='object'){url=this.href.baseVal;}
if(url.indexOf('http')===0&&((!internal_link.test(url)&&!(extExclude&&extExclude.test(url)))||(extInclude&&extInclude.test(url)))&&!(extCssExclude&&$(this).is(extCssExclude))&&!(extCssExclude&&$(this).parents(extCssExclude).length>0)&&!(extCssExplicit&&$(this).parents(extCssExplicit).length<1)){var match=false;if(whitelistedDomains){for(var i=0;i<whitelistedDomains.length;i++){if(whitelistedDomains[i].test(url)){match=true;break;}}}
if(!match){external_links.push(this);}}
else if(this.tagName!=='AREA'&&url.indexOf('mailto:')===0&&!(extCssExclude&&$(this).parents(extCssExclude).length>0)&&!(extCssExplicit&&$(this).parents(extCssExplicit).length<1)){mailto_links.push(this);}}
catch(error){return false;}});if(drupalSettings.data.extlink.extClass!=='0'&&drupalSettings.data.extlink.extClass!==''){Drupal.extlink.applyClassAndSpan(external_links,drupalSettings.data.extlink.extClass,extIconPlacement);}
if(drupalSettings.data.extlink.mailtoClass!=='0'&&drupalSettings.data.extlink.mailtoClass!==''){Drupal.extlink.applyClassAndSpan(mailto_links,drupalSettings.data.extlink.mailtoClass,extIconPlacement);}
if(drupalSettings.data.extlink.extTarget){$(external_links).filter(function(){return!(drupalSettings.data.extlink.extTargetNoOverride&&$(this).is('a[target]'));}).attr({target:'_blank'});$(external_links).attr('rel',function(i,val){if(val===null||typeof val==='undefined'){return'noopener';}
if(val.indexOf('noopener')>-1){if(val.indexOf('noopener')===-1){return val+' noopener';}
else{return val;}}
else{return val+' noopener';}});}
if(drupalSettings.data.extlink.extNofollow){$(external_links).attr('rel',function(i,val){if(val===null||typeof val==='undefined'){return'nofollow';}
var target='nofollow';if(drupalSettings.data.extlink.extFollowNoOverride){target='follow';}
if(val.indexOf(target)===-1){return val+' nofollow';}
return val;});}
if(drupalSettings.data.extlink.extNoreferrer){$(external_links).attr('rel',function(i,val){if(val===null||typeof val==='undefined'){return'noreferrer';}
if(val.indexOf('noreferrer')===-1){return val+' noreferrer';}
return val;});}
Drupal.extlink=Drupal.extlink||{};Drupal.extlink.popupClickHandler=Drupal.extlink.popupClickHandler||function(){if(drupalSettings.data.extlink.extAlert){return confirm(drupalSettings.data.extlink.extAlertText);}};$(external_links).off("click.extlink");$(external_links).on("click.extlink",function(e){return Drupal.extlink.popupClickHandler(e,this);});};Drupal.extlink.applyClassAndSpan=function(links,class_name,icon_placement){var $links_to_process;if(drupalSettings.data.extlink.extImgClass){$links_to_process=$(links);}
else{var links_with_images=$(links).find('img, svg').parents('a');$links_to_process=$(links).not(links_with_images);}
if(class_name!=='0'){$links_to_process.addClass(class_name);}
$links_to_process.attr('data-extlink','');var i;var length=$links_to_process.length;for(i=0;i<length;i++){var $link=$($links_to_process[i]);if(drupalSettings.data.extlink.extUseFontAwesome){if(class_name===drupalSettings.data.extlink.mailtoClass){$link[icon_placement]('<span class="fa-'+class_name+' extlink"><span class="'+drupalSettings.data.extlink.extFaMailtoClasses+'" aria-label="'+drupalSettings.data.extlink.mailtoLabel+'"></span></span>');}
else{$link[icon_placement]('<span class="fa-'+class_name+' extlink"><span class="'+drupalSettings.data.extlink.extFaLinkClasses+'" aria-label="'+drupalSettings.data.extlink.extLabel+'"></span></span>');}}
else{if(class_name===drupalSettings.data.extlink.mailtoClass){$link[icon_placement]('<svg focusable="false" class="'+class_name+'" role="img" aria-label="'+drupalSettings.data.extlink.mailtoLabel+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 70 20"><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><sliceSourceBounds y="-8160" x="-8165" width="16389" height="16384" bottomLeftOrigin="true"/><optimizationSettings><targetSettings targetSettingsID="0" fileFormat="PNG24Format"><PNG24Format transparency="true" filtered="false" interlaced="false" noMatteColor="false" matteColor="#FFFFFF"/></targetSettings></optimizationSettings></sfw></metadata><title>'+drupalSettings.data.extlink.mailtoLabel+'</title><path d="M56 14H8c-1.1 0-2 0.9-2 2v32c0 1.1 0.9 2 2 2h48c1.1 0 2-0.9 2-2V16C58 14.9 57.1 14 56 14zM50.5 18L32 33.4 13.5 18H50.5zM10 46V20.3l20.7 17.3C31.1 37.8 31.5 38 32 38s0.9-0.2 1.3-0.5L54 20.3V46H10z"/></svg>');}
else{$link[icon_placement]('<svg focusable="false" class="'+class_name+'" role="img" aria-label="'+drupalSettings.data.extlink.extLabel+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><sliceSourceBounds y="-8160" x="-8165" width="16389" height="16384" bottomLeftOrigin="true"/><optimizationSettings><targetSettings targetSettingsID="0" fileFormat="PNG24Format"><PNG24Format transparency="true" filtered="false" interlaced="false" noMatteColor="false" matteColor="#FFFFFF"/></targetSettings></optimizationSettings></sfw></metadata><title>'+drupalSettings.data.extlink.extLabel+'</title><path d="M48 26c-1.1 0-2 0.9-2 2v26H10V18h26c1.1 0 2-0.9 2-2s-0.9-2-2-2H8c-1.1 0-2 0.9-2 2v40c0 1.1 0.9 2 2 2h40c1.1 0 2-0.9 2-2V28C50 26.9 49.1 26 48 26z"/><path d="M56 6H44c-1.1 0-2 0.9-2 2s0.9 2 2 2h7.2L30.6 30.6c-0.8 0.8-0.8 2 0 2.8C31 33.8 31.5 34 32 34s1-0.2 1.4-0.6L54 12.8V20c0 1.1 0.9 2 2 2s2-0.9 2-2V8C58 6.9 57.1 6 56 6z"/></svg>');}}}};Drupal.behaviors.extlink=Drupal.behaviors.extlink||{};Drupal.behaviors.extlink.attach=function(context,drupalSettings){if(typeof extlinkAttach==='function'){extlinkAttach(context);}
else{Drupal.extlink.attach(context,drupalSettings);}};})(jQuery,Drupal,drupalSettings);;
(function($,_,Drupal,drupalSettings){"use strict";Drupal.behaviors.varbaseVideoPlayer={attach:function(context,settings){$('.js-video-player-icon').on("click",function(ev){$(this).fadeOut(500);if($(this).closest(".field.field--type-entity-reference").find('.media--type-video video').length>0){$(this).closest(".field.field--type-entity-reference").find('.media--type-video video').get(0).play();}
if($(this).closest(".embedded-entity").find('.media--type-video video').length>0){$(this).closest(".embedded-entity").find('.media--type-video video').get(0).play();}
if($(this).closest('.field.field--type-entity-reference').find('.media--type-remote-video iframe[src*="youtube.com"]').length>0){var closestYoutubeIframe=$(this).closest('.field.field--type-entity-reference').find('.media--type-remote-video iframe[src*="youtube.com"]').get(0).contentWindow;closestYoutubeIframe.postMessage('play',"*");}
if($(this).closest('.embedded-entity').find('.media--type-remote-video iframe[src*="youtube.com"]').length>0){var closestYoutubeIframe=$(this).closest('.embedded-entity').find('.media--type-remote-video iframe[src*="youtube.com"]').get(0).contentWindow;closestYoutubeIframe.postMessage('play',"*");}
if($(this).closest('.field.field--type-entity-reference').find('.media--type-remote-video iframe[src*="vimeo.com"]').length>0){var closestVimeoIframe=$(this).closest('.field.field--type-entity-reference').find('.media--type-remote-video iframe[src*="vimeo.com"]').get(0).contentWindow;closestVimeoIframe.postMessage('play',"*");}
if($(this).closest('.embedded-entity').find('.media--type-remote-video iframe[src*="vimeo.com"]').length>0){var closestVimeoIframe=$(this).closest('.embedded-entity').find('.media--type-remote-video iframe[src*="vimeo.com"]').get(0).contentWindow;closestVimeoIframe.postMessage('play',"*");}});}};})(window.jQuery,window._,window.Drupal,window.drupalSettings);;
(function($,Drupal,drupalSettings){$(document).ready(function(){$.ajax({type:'POST',cache:false,url:drupalSettings.statistics.url,data:drupalSettings.statistics.data});});})(jQuery,Drupal,drupalSettings);;
window.matchMedia||(window.matchMedia=function(){"use strict";var e=window.styleMedia||window.media;if(!e){var t=document.createElement("style"),i=document.getElementsByTagName("script")[0],n=null;t.type="text/css";t.id="matchmediajs-test";i.parentNode.insertBefore(t,i);n="getComputedStyle"in window&&window.getComputedStyle(t,null)||t.currentStyle;e={matchMedium:function(e){var i="@media "+e+"{ #matchmediajs-test { width: 1px; } }";if(t.styleSheet){t.styleSheet.cssText=i}else{t.textContent=i}return n.width==="1px"}}}return function(t){return{matches:e.matchMedium(t||"all"),media:t||"all"}}}());
;
!function(i,n,s){"use strict";function l(l,t){function a(i){if(g.find(".b-lazy:not(.b-loaded)").length){var s=g.find(i?".slide:not(.slick-cloned) .b-lazy:not(.b-loaded)":".slick-active .b-lazy:not(.b-loaded)");s.length||(s=g.find(".slick-cloned .b-lazy:not(.b-loaded)")),s.length&&n.blazy.init.load(s)}}function e(){b&&r(),y&&a(!1)}function o(n){var s=i(n),l=s.closest(".slide")||s.closest(".unslick");s.parentsUntil(l).removeClass(function(i,n){return(n.match(/(\S+)loading/g)||[]).join(" ")});var t=s.closest(".media--background");t.length&&t.find("> img").length&&(t.css("background-image","url("+s.attr("src")+")"),t.find("> img").remove(),t.removeAttr("data-lazy"))}function d(){g.children().sort(function(){return.5-Math.random()}).each(function(){g.append(this)})}function c(i){var n=i.slideCount<=i.options.slidesToShow,s=n||!1===i.options.arrows;if(g.attr("id")===i.$slider.attr("id")){i.options.centerPadding&&"0"!==i.options.centerPadding||i.$list.css("padding",""),n&&i.$slideTrack.width()<=i.$slider.width()&&i.$slideTrack.css({left:"",transform:""});var l=g.find(".b-loaded ~ .b-loader");l.length&&l.remove(),p[s?"addClass":"removeClass"]("visually-hidden")}}function r(){g.removeClass("is-paused"),g.find(".is-playing").length&&g.find(".is-playing").removeClass("is-playing").find(".media__icon--close").click()}function u(){g.addClass("is-paused").slick("slickPause")}function f(s){return _?{}:{slide:s.slide,lazyLoad:s.lazyLoad,dotsClass:s.dotsClass,rtl:s.rtl,prevArrow:i(".slick-prev",p),nextArrow:i(".slick-next",p),appendArrows:p,customPaging:function(i,l){var t=i.$slides.eq(l).find("[data-thumb]")||null,a='<img alt="'+n.t(t.find("img").attr("alt"))+'" src="'+t.data("thumb")+'">',e=t.length&&s.dotsClass.indexOf("thumbnail")>0?'<div class="slick-dots__thumbnail">'+a+"</div>":"",o=i.defaults.customPaging(i,l);return e?o.add(e):o}}}var k,g=i("> .slick__slider",t).length?i("> .slick__slider",t):i(t),p=i("> .slick__arrow",t),h=g.data("slick")?i.extend({},s.slick,g.data("slick")):i.extend({},s.slick),m=!("array"!==i.type(h.responsive)||!h.responsive.length)&&h.responsive,v=h.appendDots,y="blazy"===h.lazyLoad&&n.blazy,b=g.find(".media--player").length,_=g.hasClass("unslick");if(_||(h.appendDots=".slick__arrow"===v?p:v||i(g)),m)for(k in m)Object.prototype.hasOwnProperty.call(m,k)&&"unslick"!==m[k].settings&&(m[k].settings=i.extend({},s.slick,f(h),m[k].settings));g.data("slick",h),h=g.data("slick"),function(){h.randomize&&!g.hasClass("slick-initiliazed")&&d(),_||g.on("init.sl",function(s,l){".slick__arrow"===v&&i(l.$dots).insertAfter(l.$prevArrow);var t=g.find(".slick-cloned.slick-active .b-lazy:not(.b-loaded)");y&&t.length&&n.blazy.init.load(t)}),y?g.on("beforeChange.sl",function(){a(!0)}):i(".media--loading",g).closest(".slide__content").addClass("is-loading"),g.on("setPosition.sl",function(i,n){c(n)})}(),g.slick(f(h)),function(){g.parent().on("click.sl",".slick-down",function(n){n.preventDefault();var s=i(this);i("html, body").stop().animate({scrollTop:i(s.data("target")).offset().top-(s.data("offset")||0)},800,"easeOutQuad"in i.easing&&h.easing?h.easing:"swing")}),h.mouseWheel&&g.on("mousewheel.sl",function(i,n){return i.preventDefault(),g.slick(n<0?"slickNext":"slickPrev")}),y||g.on("lazyLoaded lazyLoadError",function(i,n,s){o(s)}),g.on("afterChange.sl",e),b&&(g.on("click.sl",".media__icon--close",r),g.on("click.sl",".media__icon--play",u))}(),_&&g.slick("unslick"),i(t).addClass("slick--initialized")}n.behaviors.slick={attach:function(n){i(".slick",n).once("slick").each(l)}}}(jQuery,Drupal,drupalSettings);
;
(function($,Drupal,drupalSettings){Drupal.behaviors.betterExposedFilters={attach:function(context,settings){$('.bef-tree input[type=checkbox], .bef-checkboxes input[type=checkbox]').change(function(){_bef_highlight(this,context);}).filter(':checked').closest('.form-item',context).addClass('highlight');}};function _bef_highlight(elem,context){$elem=$(elem,context);$elem.attr('checked')?$elem.closest('.form-item',context).addClass('highlight'):$elem.closest('.form-item',context).removeClass('highlight');}})(jQuery,Drupal,drupalSettings);;
(function($,_,Drupal,drupalSettings){"use strict";Drupal.behaviors.bornReadyBootstrapParagraphs={attach:function(context){AOS.init();}};})(window.jQuery,window._,window.Drupal,window.drupalSettings);;