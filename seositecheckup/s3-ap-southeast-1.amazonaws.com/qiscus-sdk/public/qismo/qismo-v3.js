!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Qismo=t()}(this,(function(){"use strict";function e(){}function t(e){return e()}function o(){return Object.create(null)}function i(e){e.forEach(t)}function n(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(e,t){e.appendChild(t)}function a(e,t,o){e.insertBefore(t,o||null)}function c(e){e.parentNode.removeChild(e)}function m(e){return document.createElement(e)}function l(e){return document.createTextNode(e)}function u(e,t,o){null==o?e.removeAttribute(t):e.getAttribute(t)!==o&&e.setAttribute(t,o)}let d;function g(e){d=e}function f(e){(function(){if(!d)throw new Error("Function called outside component initialization");return d})().$$.on_mount.push(e)}const p=[],h=[],b=[],q=[],w=Promise.resolve();let y=!1;function $(e){b.push(e)}function S(){const e=new Set;do{for(;p.length;){const e=p.shift();g(e),C(e.$$)}for(;h.length;)h.pop()();for(let t=0;t<b.length;t+=1){const o=b[t];e.has(o)||(o(),e.add(o))}b.length=0}while(p.length);for(;q.length;)q.pop()();y=!1}function C(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach($)}}const x=new Set;let _;function v(){_={r:0,c:[],p:_}}function I(){_.r||i(_.c),_=_.p}function k(e,t){e&&e.i&&(x.delete(e),e.i(t))}function E(e,t,o,i){if(e&&e.o){if(x.has(e))return;x.add(e),_.c.push(()=>{x.delete(e),i&&(o&&e.d(1),i())}),e.o(t)}}function z(e,o,s){const{fragment:r,on_mount:a,on_destroy:c,after_update:m}=e.$$;r&&r.m(o,s),$(()=>{const o=a.map(t).filter(n);c?c.push(...o):i(o),e.$$.on_mount=[]}),m.forEach($)}function T(e,t){const o=e.$$;null!==o.fragment&&(i(o.on_destroy),o.fragment&&o.fragment.d(t),o.on_destroy=o.fragment=null,o.ctx=[])}function F(e,t){-1===e.$$.dirty[0]&&(p.push(e),y||(y=!0,w.then(S)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function A(t,n,s,r,a,c,m=[-1]){const l=d;g(t);const u=n.props||{},f=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:a,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(l?l.$$.context:[]),callbacks:o(),dirty:m};let p=!1;f.ctx=s?s(t,u,(e,o,...i)=>{const n=i.length?i[0]:o;return f.ctx&&a(f.ctx[e],f.ctx[e]=n)&&(f.bound[e]&&f.bound[e](n),p&&F(t,e)),o}):[],f.update(),p=!0,i(f.before_update),f.fragment=!!r&&r(f.ctx),n.target&&(n.hydrate?f.fragment&&f.fragment.l(function(e){return Array.from(e.childNodes)}(n.target)):f.fragment&&f.fragment.c(),n.intro&&k(t.$$.fragment),z(t,n.target,n.anchor),S()),g(l)}class M{$destroy(){T(this,1),this.$destroy=e}$on(e,t){const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(t),()=>{const e=o.indexOf(t);-1!==e&&o.splice(e,1)}}$set(){}}function H(e){let t,o;return{c(){t=m("img"),t.src!==(o=e[1])&&u(t,"src",o),u(t,"alt","chat with us icon"),u(t,"height","20")},m(e,o){a(e,t,o)},p(e,i){2&i&&t.src!==(o=e[1])&&u(t,"src",o)},d(e){e&&c(t)}}}function L(e){let t,o,i=(e[0]?e[0]:"Chat With Us")+"";return{c(){t=m("div"),o=l(i),u(t,"class","svelte-noomlu")},m(e,i){a(e,t,i),r(t,o)},p(e,t){1&t&&i!==(i=(e[0]?e[0]:"Chat With Us")+"")&&function(e,t){t=""+t,e.data!==t&&(e.data=t)}(o,i)},d(e){e&&c(t)}}}function U(t){let o,i,n,s=(t[3]||t[2])&&H(t),d=t[4]&&!t[2]&&L(t);return{c(){o=m("div"),s&&s.c(),i=l(" "),d&&d.c(),u(o,"class","qcw-trigger-btn svelte-noomlu")},m(e,c){var m,l,u,g;a(e,o,c),s&&s.m(o,null),r(o,i),d&&d.m(o,null),m=o,l="click",u=t[5],m.addEventListener(l,u,g),n=()=>m.removeEventListener(l,u,g)},p(e,[t]){e[3]||e[2]?s?s.p(e,t):(s=H(e),s.c(),s.m(o,i)):s&&(s.d(1),s=null),e[4]&&!e[2]?d?d.p(e,t):(d=L(e),d.c(),d.m(o,null)):d&&(d.d(1),d=null)},i:e,o:e,d(e){e&&c(o),s&&s.d(),d&&d.d(),n()}}}function B(e,t,o){let{label:i}=t,{icon:n}=t,{isMobile:s}=t,{buttonHasIcon:r}=t,{buttonHasText:a}=t;return e.$set=e=>{"label"in e&&o(0,i=e.label),"icon"in e&&o(1,n=e.icon),"isMobile"in e&&o(2,s=e.isMobile),"buttonHasIcon"in e&&o(3,r=e.buttonHasIcon),"buttonHasText"in e&&o(4,a=e.buttonHasText)},[i,n,s,r,a,function(t){!function(e,t){const o=e.$$.callbacks[t.type];o&&o.slice().forEach(e=>e(t))}(e,t)}]}class D extends M{constructor(e){super(),A(this,e,B,U,s,{label:0,icon:1,isMobile:2,buttonHasIcon:3,buttonHasText:4})}}const O=e=>document.querySelector(e),N=(e,t)=>{if(e){var o=15;e.style.opacity=0,e.style.transform="translateY(15px)";var i=+new Date,n=function(){e.style.opacity=+e.style.opacity+(new Date-i)/400,(o-=1)<15&&(e.style.transform="translateY("+o+"px)"),(o<=0||e.style.opacity>=1)&&(e.style.transform="none",e.style.opacity=1),i=+new Date,+e.style.opacity<1?window.requestAnimationFrame&&requestAnimationFrame(n)||setTimeout(n,16):(e.style.display="block",t&&t())};n()}},j=(e,t)=>{if(e){var o=0;e.style.opacity=1,e.style.transform="translateY(0px)";var i=+new Date,n=function(){e.style.opacity=+e.style.opacity-(new Date-i)/400,o+=1,e.style.transform="translateY("+o+"px)",i=+new Date,+e.style.opacity>0&&(window.requestAnimationFrame&&requestAnimationFrame(n)||setTimeout(n,16)),e.style.opacity<=0&&(e.style.display="none",t&&t())};n()}},W=e=>{var t=new XMLHttpRequest,o="";return new Promise((function(i,n){t.onload=function(){this.status>=200&&this.status<400?i(e.successFn(JSON.parse(this.response))):n(e.failFn(JSON.parse(this.response)))},t.onerror=function(){n(e.failFn())},t.open(e.type||"GET",e.url,!0),"POST"==e.type&&(t.setRequestHeader("Content-type","application/json; charset=utf-8"),e.data&&(o=JSON.stringify(e.data))),t.send(o||null)}))},G=e=>({customerServiceAvatar:"https://d1edrlpyc25xu0.cloudfront.net/kiwari-prod/image/upload/Ri-pxHv6e1/default_avatar.png",customerServiceName:"Customer Service",buttonHasText:!0,buttonText:"Talk to Us",buttonHasIcon:"true",buttonIcon:"https://s3-ap-southeast-1.amazonaws.com/qiscus-sdk/public/qismo/img/icon-qiscus-widget-default.svg",formGreet:"Welcome to Live Chat",openAtStart:!1,welcomeText:"Hi there! Do you want to have a chat widget like this? It's so easy and customisable! So, come on have a chat with us!  ",welcomeMessageStatus:!0,welcomeTimeout:3,qismoBaseUrl:e?"https://qismo-stag.qiscus.com":"https://qismo.qiscus.com",qismoIframeUrl:"https://multichannel.qiscus.com",callbackFunction:{afterFormValidation:!1},customerIdentifierInputType:"email",customerIdentifier:"email"});function P(e,t){return e=e.replace("#",""),"rgba("+parseInt(e.substring(0,2),16)+","+parseInt(e.substring(2,4),16)+","+parseInt(e.substring(4,6),16)+","+t/100+")"}const R=(e,t,o)=>{var i=document.createElement(e);if(t&&i.appendChild(document.createTextNode(t)),o){var n="";Object.keys(o).forEach((function(e){(n=document.createAttribute(e)).value=o[e],i.setAttributeNode(n)}))}return i},J=e=>{let t="";return Object.keys(e).forEach(o=>{let i="&";t||(i="?"),t+=`${i}${o}=${e[o]}`}),t};function Y(e){let t,o,i=(!e[2]&&!e[3]&&e[4]||!e[4])&&Q(e);return{c(){i&&i.c(),t=l("")},m(e,n){i&&i.m(e,n),a(e,t,n),o=!0},p(e,o){!e[2]&&!e[3]&&e[4]||!e[4]?i?(i.p(e,o),k(i,1)):(i=Q(e),i.c(),k(i,1),i.m(t.parentNode,t)):i&&(v(),E(i,1,1,()=>{i=null}),I())},i(e){o||(k(i),o=!0)},o(e){E(i),o=!1},d(e){i&&i.d(e),e&&c(t)}}}function Q(e){let t;const o=new D({props:{isMobile:e[4],label:qismoConfig.buttonText,buttonHasIcon:qismoConfig.buttonHasIcon,buttonHasText:qismoConfig.buttonHasText,icon:qismoConfig.buttonIcon,$$slots:{default:[V]},$$scope:{ctx:e}}});return o.$on("click",e[0]),{c(){var e;(e=o.$$.fragment)&&e.c()},m(e,i){z(o,e,i),t=!0},p(e,t){const i={};16&t[0]&&(i.isMobile=e[4]),4&t[1]&&(i.$$scope={dirty:t,ctx:e}),o.$set(i)},i(e){t||(k(o.$$.fragment,e),t=!0)},o(e){E(o.$$.fragment,e),t=!1},d(e){T(o,e)}}}function V(t){return{c:e,m:e,d:e}}function X(e){let t,o,i=e[1]&&Y(e);return{c(){t=m("main"),i&&i.c(),u(t,"class","svelte-1uzz2rw")},m(e,n){a(e,t,n),i&&i.m(t,null),o=!0},p(e,o){e[1]?i?(i.p(e,o),k(i,1)):(i=Y(e),i.c(),k(i,1),i.m(t,null)):i&&(v(),E(i,1,1,()=>{i=null}),I())},i(e){o||(k(i),o=!0)},o(e){E(i),o=!1},d(e){e&&c(t),i&&i.d()}}}function K(e,t,o){let i,n,s,r,a,c=!1,m=!1,l={},u=!1,d=!1,g=!1,{staging:p=!1}=t,{widgetDesktopSizes:h=[360,510]}=t,{loginFormSizes:b=[360,510]}=t,{welcomeMessageSizes:q=[380,350]}=t,{grabberSizes:w=[300,150]}=t;const y=()=>{l=G(p),W({type:"GET",url:l.qismoBaseUrl+"/api/v1/app/config/public-widget/"+A,successFn(e){var t=e.data.widget;((e,t)=>{var o=G();if(o.qismoBaseUrl=t&&t.baseUrl?t.baseUrl:"//multichannel.qiscus.com",o.qismoIframeUrl=t&&t.qismoIframeUrl?t.qismoIframeUrl:"//multichannel.qiscus.com",window.qismoConfig||(window.qismoConfig=Object.assign({},o)),t&&(window.qismoConfig=Object.assign({},qismoConfig,t)),!e)return qismoConfig=Object.assign({},o,qismoConfig),qismoConfig;Object.keys(e.variables).forEach((function(t){qismoConfig[t]=e.variables[t]}))})(t,M),a=(e=>{if(!e)return O("head").appendChild(R("style",".qcw-header { background: #74c162 !important; }")),!1;var t=Object.keys(e).reduce((function(t,o){return t+o+JSON.stringify(e[o]).replace(/['"]+/g,"").replace(/[,]+/g,";")}),""),o="#74c162",i="#FFFFFF";return e[".qcw-header,.qismo-login-form__header"]&&(i="#444444","#ffffff"==(o=e[".qcw-header,.qismo-login-form__header"]["background-color"].replace("!important","").trim()).toLowerCase()?(t+=".qismo-contact-icon,.qismo-email-icon{fill:"+o+";}",t+=".qismo-phone-icon{stroke:"+o+";}",t+=".qismo-input .icon{background:"+P("#444444",20)+"!important;}",t+=".qcw-copyright,.qismo-input input {color:#444 !important;}",t+=".qismo-login-form__header { color: "+i+";}",t+=".qcw-cs-box-form { background: #444; }"):(t+=".qismo-contact-icon,.qismo-email-icon{fill:"+o+";}",t+=".qismo-phone-icon{stroke:"+o+";}",t+=".qismo-input .icon{background:"+P(o,20)+"!important;}",t+=".qcw-copyright,.qismo-copyright,.qismo-input input {color:"+o+"!important;}")),!document.querySelector("#qismo-custom-css")&&O("head").appendChild(R("style",t,{id:"qismo-custom-css"})),t})(t?t.styles:null),S(),$();var i=JSON.parse(localStorage.getItem("qismo-widget"));!i||i.display_name&&i.unique_id||localStorage.removeItem("qismo-widget"),localStorage.getItem("qismo-widget")?x():k(),o(1,c=!0),F()},failFn(e){}})},$=()=>{if(1!=qismoConfig.attentionGrabberStatus)return!1;s=document.createElement("iframe");let e=J({grabberImage:qismoConfig.grabberImage,grabberTextStatus:qismoConfig.grabberTextStatus,attention_grabber_image:qismoConfig.attentionGrabberImage,attention_grabber_text:qismoConfig.attentionGrabberText});a&&(e+=`&customcss=${a.replace(/#/g,"@")}`);let t=`${qismoConfig.qismoIframeUrl}/iframes/${A}/attention-grabber${e}`;s.setAttribute("src",t),s.setAttribute("id","qcw-welcome-iframe"),s.setAttribute("style","display: none"),z(s,w[0]+"px",w[1]+"px","0","50px"),document.getElementById("qcw-welcome-iframe")||document.body.appendChild(s),N(s)},S=()=>{const e=localStorage.getItem("qismo-widget");if(1!=qismoConfig.welcomeMessageStatus||1==qismoConfig.attentionGrabberStatus||e)return!1;var t=qismoConfig.welcomeTimeout>=0?qismoConfig.welcomeTimeout:l.welcomeTimeout;s=document.createElement("iframe");let o=J({avatar_url:qismoConfig.customerServiceAvatar,cs_name:qismoConfig.customerServiceName,welcome_text:qismoConfig.welcomeText});a&&(o+=`&customcss=${a.replace(/#/g,"@")}`);let i=`${qismoConfig.qismoIframeUrl}/iframes/${A}/welcome-message${o}`;s.setAttribute("src",i),s.setAttribute("id","qcw-welcome-iframe"),s.setAttribute("style","display: none"),z(s,q[0]+"px",q[1]+"px","0","75px"),document.getElementById("qcw-welcome-iframe")||document.body.appendChild(s),setTimeout((function(){u||d||(s.style.display="block",N(s),s&&I("qcw-welcome-iframe",{event_name:"change-height"}))}),1e3*parseInt(t))},C=()=>{if(m)return!1;o(2,u=!u);const e=document.getElementById("qcw-login-form-iframe");if(!e)return!1;u?(N(e,()=>{setTimeout(()=>{qismoConfig.loginFormCustomCSS&&I("qcw-login-form-iframe",{event_name:"custom-css",css:qismoConfig.loginFormCustomCSS})},0)}),v()):j(e)},x=e=>{let t=JSON.parse(localStorage.getItem("qismo-widget"));const s=!t;t?i={display_name:t.display_name,unique_id:t.unique_id,extra_fields:t.extra_fields}:(i=e,M&&M.extra_fields&&(i.extra_fields=e.extra_fields),localStorage.setItem("qismo-widget",JSON.stringify(i))),E(s),m=!0,o(2,u=!1),s&&j(n)},_=()=>{const e=document.getElementById("qcw-iframe");if(!e)return!1;d?(N(e,()=>{if(!qismoConfig.widgetCustomCSS)return!1;setTimeout(()=>{I("qcw-iframe",{event_name:"custom-css",css:qismoConfig.widgetCustomCSS})},1e3)}),v()):j(e)},v=()=>{const e=document.getElementById("qcw-welcome-iframe");e&&j(e)};var I=function(e,t){document.getElementById(e).contentWindow.postMessage(t,"*")};const k=()=>{n=document.createElement("iframe");const e=qismoConfig.customerIdentifierInputType?qismoConfig.customerIdentifierInputType:qismoConfig.customerIdentifier||"email";let t=J({formGreet:qismoConfig.formGreet,customerIdentifier:e,extra_fields:M&&M.extra_fields?M.extra_fields:""});a&&(t+=`&customcss=${a.replace(/#/g,"@")}`);let o=`${qismoConfig.qismoIframeUrl}/iframes/${A}/login-form${t}`;qismoConfig.loginFormUrl&&(o=`${qismoConfig.loginFormUrl}?customerIdentifier=${e}`),n.setAttribute("src",o),n.setAttribute("id","qcw-login-form-iframe"),n.setAttribute("style","display: none"),document.body.clientWidth<600?T(n):z(n,b[0]+"px",b[1]+"px"),document.getElementById("qcw-login-form-iframe")||document.body.appendChild(n),qismoConfig.loginFormCustomCSS&&I("qcw-login-form-iframe",{event_name:"custom-css",css:qismoConfig.loginFormCustomCSS})},E=e=>{r=document.createElement("iframe");let t=J({display_name:i.display_name,unique_id:i.unique_id,app_id:A,staging:p});i.extra_fields&&(t+=`&extra_fields=${i.extra_fields}`),M&&M.extras&&(t+=`&extras=${M.extras}`),M&&M.room_badge&&(t+=`&room_badge=${M.room_badge}`);let o=`${qismoConfig.qismoIframeUrl}/iframes/${A}/multichannel-widget${t}`;r.setAttribute("src",o),r.setAttribute("id","qcw-iframe"),r.setAttribute("style","display: none"),document.body.clientWidth<600?T(r):z(r,h[0]+"px",h[1]+"px"),document.getElementById("qcw-iframe")||document.body.appendChild(r),(qismoConfig.openAtStart||e)&&N(r,()=>{if(!qismoConfig.widgetCustomCSS)return!1;setTimeout(()=>{I("qcw-iframe",{event_name:"custom-css",css:qismoConfig.widgetCustomCSS})},1e3)})},z=(e,t,o,i,n)=>{if(!e)return!1;e.style.width=t,e.style.height=o,e.style.bottom=n||"77px",e.style.right=i||"42px"},T=e=>{z(e,"100%","100%"),e.style.bottom=0,e.style.right=0},F=()=>{const e=qismoConfig.mobileBreakPoint?qismoConfig.mobileBreakPoint:400;document.body.clientWidth<e?(o(4,g=!0),r&&T(r),n&&T(n)):(o(4,g=!1),r&&z(r,h[0]+"px",h[1]+"px"),n&&z(n,b[0]+"px",b[1]+"px"))};f(async()=>(y(),window.addEventListener("resize",(function(e){F()})),()=>{r&&"object"==typeof r&&(document.body.removeChild(r),r=null),n&&"object"==typeof n&&(document.body.removeChild(n),n=null),s&&"object"==typeof s&&(document.body.removeChild(s),s=null)}));let{appId:A}=t,{options:M}=t;return e.$set=e=>{"staging"in e&&o(5,p=e.staging),"widgetDesktopSizes"in e&&o(6,h=e.widgetDesktopSizes),"loginFormSizes"in e&&o(7,b=e.loginFormSizes),"welcomeMessageSizes"in e&&o(8,q=e.welcomeMessageSizes),"grabberSizes"in e&&o(9,w=e.grabberSizes),"appId"in e&&o(13,A=e.appId),"options"in e&&o(14,M=e.options)},[()=>{m?(o(3,d=!d),_()):C(),(d||u)&&v()},c,u,d,g,p,h,b,q,w,C,x,v,A,M]}class Z extends M{constructor(e){super(),A(this,e,K,X,s,{staging:5,widgetDesktopSizes:6,loginFormSizes:7,welcomeMessageSizes:8,grabberSizes:9,toggleLoginForm:10,toggleWidget:0,login:11,closeWelcomeMessage:12,appId:13,options:14},[-1,-1])}get staging(){return this.$$.ctx[5]}set staging(e){this.$set({staging:e}),S()}get widgetDesktopSizes(){return this.$$.ctx[6]}set widgetDesktopSizes(e){this.$set({widgetDesktopSizes:e}),S()}get loginFormSizes(){return this.$$.ctx[7]}set loginFormSizes(e){this.$set({loginFormSizes:e}),S()}get welcomeMessageSizes(){return this.$$.ctx[8]}set welcomeMessageSizes(e){this.$set({welcomeMessageSizes:e}),S()}get grabberSizes(){return this.$$.ctx[9]}set grabberSizes(e){this.$set({grabberSizes:e}),S()}get toggleLoginForm(){return this.$$.ctx[10]}get toggleWidget(){return this.$$.ctx[0]}get login(){return this.$$.ctx[11]}get closeWelcomeMessage(){return this.$$.ctx[12]}get appId(){return this.$$.ctx[13]}set appId(e){this.$set({appId:e}),S()}get options(){return this.$$.ctx[14]}set options(e){this.$set({options:e}),S()}}return class{constructor(e,t={}){if(!e)throw new Error("Multichannel AppId is required");this.appId=e,this.staging=t.staging,this.options=t.options,this.baseUrl="https://multichannel.qiscus.com",this.mobileBreakPoint=500,this.onLoginSuccess=t.onLoginSuccess?t.onLoginSuccess:null,this.onLoginError=t.onLoginError?t.onLoginError:null,this.onRoomChanged=t.onRoomChanged?t.onRoomChanged:null,this.onHeaderClicked=t.onHeaderClicked?t.onHeaderClicked:null,t.options&&(t.options.qismoIframeUrl&&(this.baseUrl=t.options.qismoIframeUrl),t.options.mobileBreakPoint&&(this.mobileBreakPoint=t.options.mobileBreakPoint),t.options.widgetDesktopSizes&&(this.widgetDesktopSizes=t.options.widgetDesktopSizes)),this.appendCSS(),this.render(),this.bindEvent(window,"message",e=>{e.data&&("login-success"==e.data.event_name&&this.onLoginSuccess&&this.onLoginSuccess(e.data.data),"login-error"==e.data.event_name&&this.onLoginError&&this.onLoginError(e.data.data),"room-changed"==e.data.event_name&&this.onRoomChanged&&this.onRoomChanged(e.data.data),"new-messages"==e.data.event_name&&this.onNewMessages&&this.onNewMessages(e.data.data),"typing"==e.data.event_name&&this.onTyping&&this.onTyping(e.data.data),"header-clicked"==e.data.event_name&&this.onHeaderClicked&&this.onHeaderClicked(),"close-welcome-message"==e.data.event_name&&this.widget.closeWelcomeMessage(),"close-login-form"==e.data.event_name&&this.widget.toggleLoginForm(),"iframe-height-change"==e.data.event_name&&(document.getElementById("qcw-welcome-iframe").style.height=e.data.height+"px",this.widget.welcomeMessageSizes[1]=e.data.height),"toggle-widget"==e.data.event_name&&this.widget.toggleWidget(),"login"==e.data.event_name&&this.widget.login({display_name:e.data.display_name,unique_id:e.data.unique_id,extra_fields:e.data.extra_fields}))})}appendCSS(){const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href",`${this.baseUrl}/css/qismo-v3.css`),document.head.appendChild(e)}bindEvent(e,t,o){e.addEventListener?e.addEventListener(t,o,!1):e.attachEvent&&e.attachEvent("on"+t,o)}log(e,t){this.params.verbose&&console.log(`=== Qiscus ==> ${e}`,t||"")}chatTarget(e){return this.core.chatTarget(e)}sendMessage(e){document.getElementById("qcw-iframe").contentWindow.postMessage(e,"*")}logout(){localStorage.clear(),this.widget.isLogin=!1,this.widget.isLoginFormOpened=!1,this.widget.isWidgetOpened=!1}render(){document.getElementById("qismo-widget")||document.body.insertAdjacentHTML("beforeend",'<div id="qismo-widget"></div>');const e={appId:this.appId,staging:this.staging,options:this.options};this.widgetDesktopSizes&&(e.widgetDesktopSizes=this.widgetDesktopSizes),this.widget=new Z({target:document.getElementById("qismo-widget"),props:e})}}}));
//# sourceMappingURL=qismo-v3.js.map