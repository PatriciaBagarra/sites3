var loadImages=function(l){var e=l.querySelectorAll("img[data-src]");e&&e.forEach(function(e){var t=new Image,a=e.dataset.src;t.onload=function(){t.classList.add("loaded")},t.src=a,t.classList.add("img-full"),l.querySelector(".img-placeholder").appendChild(t)})},loadBgImg=function(e){var t=e.querySelector(".img[data-src]"),a=new Image,l=t.dataset.src;a.onload=function(){t.style.backgroundImage='url("'+t.dataset.src+'")'},a.src=l},sr=ScrollReveal();function handlePlanToggleBtn(e){var t=e.target.dataset.value;document.querySelector(".pricing-toggle>button.active").classList.remove("active"),document.querySelector('.pricing-toggle>button[data-value="'+t+'"]').classList.add("active");for(var a=document.getElementsByClassName(("monthly"===t?"annual":"monthly")+"-plan"),l=0;l<a.length;l++)a[l].classList.add("d-none");var n=document.getElementsByClassName(("monthly"===t?"monthly":"annual")+"-plan");for(l=0;l<n.length;l++)n[l].classList.remove("d-none")}sr.reveal(".fade-in-img",{reset:!1,beforeReveal:loadImages}),sr.reveal(".fade-in",{reset:!1,beforeReveal:loadBgImg});for(var toggleBtns=document.querySelectorAll(".pricing-toggle>button"),i=0;i<toggleBtns.length;i++)toggleBtns[i].addEventListener("click",handlePlanToggleBtn,!1);var el=document.getElementById("see-all");function handleFaq(e){var t=e.currentTarget.dataset.id;e.currentTarget.classList.toggle("open"),document.querySelector('.faq-details[data-id="'+t+'"]').classList.toggle("d-none")}el.addEventListener("mouseenter",function(){document.querySelector('div[data-id="see-all"').classList.toggle("d-none")}),el.addEventListener("mouseleave",function(){document.querySelector('div[data-id="see-all"').classList.toggle("d-none")});var faqs=document.querySelectorAll(".faq");for(i=0;i<faqs.length;i++)faqs[i].addEventListener("click",handleFaq,!1);