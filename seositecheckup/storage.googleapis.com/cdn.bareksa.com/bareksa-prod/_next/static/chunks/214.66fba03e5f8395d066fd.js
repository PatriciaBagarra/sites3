(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[214],{"GO1+":function(e){e.exports=JSON.parse('{"a":"\'Montserrat\', sans-serif","b":"\'Open Sans\', sans-serif"}')},"i/6G":function(e,n,t){"use strict";t.r(n),t.d(n,"Header",(function(){return x}));var a=t("wx14"),i=t("rePB"),o=t("q1tI"),r=t.n(o),l=t("nOHt"),c=t("a6RD"),s=t.n(c),u=t("z7rF"),d=t("Po8q"),m=t.n(d),b=t("7Qib"),p=t("GO1+"),g=t("mS//"),f=r.a.createElement;function w(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function k(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?w(Object(t),!0).forEach((function(n){Object(i.a)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):w(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var h=s()((function(){return Promise.all([t.e(0),t.e(243)]).then(t.t.bind(null,"ZVZY",7))}),{loadableGenerated:{webpack:function(){return["ZVZY"]},modules:["@material-ui/icons/AccountCircleOutlined"]}}),v=s()((function(){return Promise.all([t.e(0),t.e(2),t.e(3),t.e(12),t.e(178)]).then(t.bind(null,"9a57"))}),{loadableGenerated:{webpack:function(){return["9a57"]},modules:["../../button/material"]}}),_=s()((function(){return Promise.all([t.e(0),t.e(188)]).then(t.bind(null,"bS6Z"))}),{loadableGenerated:{webpack:function(){return["bS6Z"]},modules:["./hamburger"]}}),y={color:"#4B8B26"},O=function(e){var n=e.caption,t=e.ETAction,a=e.ETLabel,i=e.href,o=e.styleLink,r=e.styleNav,c=Object(l.useRouter)().pathname===i?k(k({},o),y):o;return f("div",{style:r},f(u.Link,{href:i,onClick:function(){return Object(b.i)(window.eventName,t,a)},rel:"noopener noreferrer",style:c},n))},x=function(e){var n=e.auth,t=e.clickHamburger,i=e.device,r=e.isBrowser,l=e.link,c=e.name,s=e.onToggleModal,d=e.openHamburger,w=e.pre,k=m.a.load("b--user"),y="".concat("https://images.bareksa.com","/logo/1.0.0/logo.svg"),x="unknown"!==i?"/0/0/0/1":"/65/79/0",N="".concat(l.main,"/berita"),E=[{isLinkSelf:!0,link:"/client/profile",title:"Profil"},{isLinkSelf:!1,link:"".concat(l.main,"/reksadana/public/id/client/portofolio"),title:"Portofolio"},{isLinkSelf:!1,link:"".concat(l.main,"/reksadana/public/id/client/trades"),title:"Transaksi"},{isLinkSelf:!1,link:"".concat(l.main,"/id/member/logout"),fungsi:"logout",title:"Keluar"}],j=function(){var e=document.getElementsByClassName("nav")[0],n=g.anotherHeaders.includes(window.location.pathname),t=["/tentangkami","/syaratketentuan"].includes(window.location.pathname),a="/kontak"===window.location.pathname,i="/faq"===window.location.pathname,o="/kamus"===window.location.pathname,r="/karir"===window.location.pathname;document.documentElement.scrollTop>=50&&e?(e.style.boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.07)",n&&document.getElementsByClassName("nav")[0].setAttribute("data-background","onprimary-high-emphasis")):e&&(e.style.boxShadow="none",window.innerWidth>991&&(t&&document.getElementsByClassName("nav")[0].setAttribute("data-background","black-cool-050"),a&&document.getElementsByClassName("nav")[0].setAttribute("data-background","teal-050"),i&&document.getElementsByClassName("nav")[0].setAttribute("data-background","green-050"),o&&document.getElementsByClassName("nav")[0].setAttribute("data-background","brown-050"),r&&document.getElementsByClassName("nav")[0].setAttribute("data-background","transparent")))},L=function(){Object(b.i)(window.eventName,"investor","investor_".concat(k&&k.user_id)),window.location.pathname=/localhost/gi.test(window.location.origin)?"/client/portfolio":"/reksadana/public/id/client/portofolio"};Object(o.useEffect)((function(){window.addEventListener("scroll",j,{passive:!1})}),[]);var B={color:"#333333",fontFamily:p.a,fontWeight:"600",lineHeight:"18px",letterSpacing:"0.25px",textDecoration:"none"},T={link:l,styleLink:B,styleNav:{display:"inline-block",paddingLeft:"20px",paddingRight:"20px",paddingTop:"25px",paddingBottom:"19px"}};return f("nav",{className:"nav"},f("div",{className:"container-mui nav--container"},f("div",{className:"nav--left",style:{display:"flex",width:"100%"}},f("a",{href:w,onClick:function(){return Object(b.i)(window.eventName,"bareksa_logo","bareksa_logo")},onKeyPress:function(){return Object(b.i)(window.eventName,"bareksa_logo","bareksa_logo")},role:"button",tabIndex:"0"},f("img",{className:"nav-logo",src:y,alt:"Bareksa Logo"})),f("div",{className:"main-nav"},f(O,Object(a.a)({},T,{ETAction:"menu_mutualfund",ETLabel:"menu_mutualfund",href:"".concat(l.main,"/id/data/reksadana/daftar"),caption:"Reksadana"})),f(O,Object(a.a)({},T,{ETAction:"menu_robo",ETLabel:"menu_robo",href:"".concat(l.robo),caption:"Robo Advisor"})),f(O,Object(a.a)({},T,{ETAction:"menu_sbn",ETLabel:"menu_sbn",href:l.sbn,caption:"SBN"})),f(O,Object(a.a)({},T,{ETAction:"menu_umroh",ETLabel:"menu_umroh",href:l.umroh,caption:"Umroh",style:{color:"yellow"}})),f(O,Object(a.a)({},T,{ETAction:"menu_data",ETLabel:"menu_data",href:"".concat(l.main,"/id/data"),caption:"Data"})),f(O,Object(a.a)({},T,{ETAction:"menu_news",ETLabel:"menu_news",href:N,caption:"Berita"})))),f("div",{className:"nav--right"},r&&f("div",{className:"main-nav-menu"},n&&n.access_token&&k?f("div",{className:"nav-link-login",role:"button",tabIndex:0,onClick:L,onKeyPress:L},f(h,null),f(u.Link,{color:"#333333",fontSize:"15px",letterSpacing:"0.15px",lineHeight:"18px",style:{cursor:"pointer",marginLeft:"4px"}},k&&k.first_name?k.first_name:c)):f("div",{className:"nav-link-login"},f(u.Link,{href:"".concat(l.main,"/id/member/login"),onClick:function(){if(/\/berita/gi.test(window.location.pathname)){var e=Boolean(window.isNewsDetail);Object(b.i)("berita_page".concat(e?"_detail":""),"berita_page".concat(e?"_detail":"","_login"),"".concat(e?"detail_":"","click_login"))}else Object(b.i)(window.eventName,"menu_login","menu_login");window.location.href="".concat(l.main,"/id/member/login")},display:"inline-block",margin:"0px 16px 0px -5px",width:"80px"},f(u.TextButton,{style:{display:"inline-block",marginRight:"21px",textAlign:"center",width:"80px"}},"Login")),f(v,{onClick:function(){if(/\/berita/gi.test(window.location.pathname)){var e=Boolean(window.isNewsDetail);Object(b.i)("berita_page".concat(e?"_detail":""),"berita_page".concat(e?"_detail":"","_daftar"),"".concat(e?"detail_":"","click_daftar"))}else Object(b.i)(window.eventName,"menu_signup","menu_signup");s("signup")},style:{borderRadius:"8px",fontSize:"13.36px",height:"42px",letterSpacing:"normal",lineHeight:"15.27px",textAlign:"center",width:"111px"}},f(u.TextButton,null,"Daftar"))))),window.innerWidth<=991&&f("div",{className:"mobile-nav-icon"},f(_,{auth:n,childUser:E,device:i,indexNews:x,isBrowser:r,link:l,name:c,openHamburger:d,clickHamburger:t,user:k}))))};x.defaultProps={auth:{},name:null},n.default=x}}]);