var loadBgImg=function(e){var r=e.querySelector(".img[data-src]"),a=new Image,t=r.dataset.src;a.onload=function(){r.style.backgroundImage='url("'+r.dataset.src+'")'},a.src=t},sr=ScrollReveal();function handleCard(e){document.body.style.overflow="hidden";var r=e.currentTarget.dataset.id;document.querySelector('.overlay[data-id="'+r+'"]').classList.add("open");var a=e.currentTarget.dataset.quiz,t={ref:a,appId:a,width:"100%",height:800,async:!0,host:"quiz.tryinteract.com",auto_resize:!0,mobile:!1,no_cover:"true"===e.currentTarget.dataset.cover,redirect_host:!0};window[a]=new InteractApp,window[a].initialize(t),window[a].display()}sr.reveal(".lazy",{reset:!1,beforeReveal:loadBgImg});for(var cards=document.querySelectorAll(".card"),i=0;i<cards.length;i++)cards[i].addEventListener("click",handleCard,!1);function handleClose(e){document.body.style.overflow="auto";var r=e.currentTarget.dataset.id,a=document.querySelector('.overlay[data-id="'+r+'"]'),t=document.querySelector(".overlay.open iframe");a.classList.remove("open"),t.src=""}var closers=document.querySelectorAll(".close");for(i=0;i<closers.length;i++)closers[i].addEventListener("click",handleClose,!1);