var loadBgImg=function(e){var a=e.querySelector(".img[data-src]"),r=new Image,l=a.dataset.src;r.onload=function(){a.style.backgroundImage='url("'+a.dataset.src+'")'},r.src=l},sr=ScrollReveal();sr.reveal(".lazy",{reset:!1,beforeReveal:loadBgImg});