!function(l){l(function(){var t,o=window.location.href,a=void 0!==document.title?document.title:"",n=void 0!==screen.width&&1024<screen.width?"no":"yes",r="",i="";if("undefined"!=typeof ht_ctc_chat_var)i=ht_ctc_chat_var,e(),c();else{try{document.querySelector(".ht_ctc_chat_data")&&(t=l(".ht_ctc_chat_data").attr("data-settings"),i=JSON.parse(t))}catch(t){i={}}e(),c()}function e(){var t=document.querySelector(".ht_ctc_chat_data");t&&(r=l(".ht_ctc_chat_data").attr("data-no_number"),t.remove())}function c(){var t;l(document).trigger("ht_ctc_ce_settings",[i]),(t=document.querySelector(".ht-ctc-chat"))&&(l(document).trigger("ht_ctc_ce_chat"),function(t){"yes"==i.schedule?l(document).trigger("ht_ctc_ce_display",[i,h,t]):h(t)}(t),t.addEventListener("click",function(){_(t)})),l(document).on("click",".ht-ctc-sc-chat",function(){var t=this.getAttribute("data-number"),e=(e=this.getAttribute("data-pre_filled")).replace(/\[url]/gi,o);e=encodeURIComponent(e),i.web&&"yes"!==n?window.open("https://web.whatsapp.com/send?phone="+t+"&text="+e,"_blank","noopener"):window.open("https://wa.me/"+t+"?text="+e,"_blank","noopener"),d(this),u(t)}),l(document).on("click",".ctc_chat, #ctc_chat",function(){_(this)}),l(document).on("click",'[href="#ctc_chat"]',function(t){t.preventDefault(),_(this)})}function h(t){var e;"yes"==n?"show"==i.dis_m&&((e=document.querySelector(".ht_ctc_desktop_chat"))&&e.remove(),t.style.cssText=i.pos_m+i.css,s(t)):"show"==i.dis_d&&((e=document.querySelector(".ht_ctc_mobile_chat"))&&e.remove(),t.style.cssText=i.pos_d+i.css,s(t))}function s(e){try{l(e).show(parseInt(i.se))}catch(t){e.style.display="block"}var t;t=e,setTimeout(function(){t.classList.add("ht_ctc_animation",i.ani)},120),l(".ht-ctc-chat").hover(function(){l(".ht-ctc-chat .ht-ctc-cta-hover").show(120)},function(){l(".ht-ctc-chat .ht-ctc-cta-hover").hide(100)})}function d(t){l(document).trigger("ht_ctc_analytics");var e=i.number;t.classList.contains("ht-ctc-sc")&&(e=t.getAttribute("data-number"));var c="Click to Chat for WhatsApp",n="chat: "+e,t=a+", "+o;(i.ga||i.ga4)&&("undefined"!=typeof gtag?i.ga4?gtag("event","click to chat",{number:e,title:a,url:o}):gtag("event",n,{event_category:c,event_label:t}):"undefined"!=typeof ga&&void 0!==ga.getAll?ga.getAll()[0].send("event",c,n,t):"undefined"!=typeof __gaTracker&&__gaTracker("send","event",c,n,t)),"undefined"!=typeof dataLayer&&dataLayer.push({event:"Click to Chat",type:"chat",number:e,title:a,url:o,event_category:c,event_label:t,event_action:n}),i.ads&&"undefined"!=typeof gtag_report_conversion&&gtag_report_conversion(),i.fb&&"undefined"!=typeof fbq&&fbq("trackCustom","Click to Chat by HoliThemes",{Category:"Click to Chat for WhatsApp",return_type:"chat",ID:e,Title:a,URL:o})}function _(t){l(document).trigger("ht_ctc_ce_number",[i]);var e=i.number,c=(c=i.pre_filled).replace(/\[url]/gi,o);c=encodeURIComponent(c),""!=e?(i.web&&"yes"!==n?window.open("https://web.whatsapp.com/send?phone="+e+"&text="+c,"_blank","noopener"):window.open("https://wa.me/"+e+"?text="+c,"_blank","noopener"),d(t),u(e)):l(".ht-ctc-chat").html(r)}function u(t){var e,c;i.hook_url&&(e=i.hook_url,c={},i.hook_v&&(c=i.hook_v),l(document).trigger("ht_ctc_ce_hook",[i,t]),e=i.hook_url,c=i.hook_v,data=JSON.stringify(c),l.ajax({url:e,type:"POST",mode:"no-cors",data:data,success:function(t){}}))}})}(jQuery)