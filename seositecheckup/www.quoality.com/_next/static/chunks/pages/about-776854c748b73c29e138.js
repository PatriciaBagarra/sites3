_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[10],{"+yCD":function(e,t,i){"use strict";var n=this&&this.__extends||function(){var e=function(t,i){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(t,i)};return function(t,i){function n(){this.constructor=t}e(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var s=i("q1tI");t.isMouseMoveEvent=function(e){return"clientY"in e};var o=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t}(s.Component);t.default=o},"2ZXj":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("q1tI"),s=i("m1kc"),o=i("m1kc");t.populatePreviousSlides=function(e,t,i){void 0===i&&(i=0);var r,a,l=e.currentSlide,c=e.itemWidth,d=e.slidesToShow,u=t.children,h=t.showDots,m=t.infinite,p=s.getSlidesToSlide(e,t),f=l-i-(0<i?0:p),g=(n.Children.toArray(u).length-d)%p;return a=0<=f?(r=f,h&&!m&&0<g&&o.isInRightEnd(e)&&(r=l-g),-c*r):r=f<0&&0!==l?0:void 0,{nextSlides:r,nextPosition:a}}},"3TDQ":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("v5rg");t.getOriginalCounterPart=n.getOriginalCounterPart,t.getClones=n.getClones,t.checkClonesPosition=n.checkClonesPosition,t.getInitialSlideInInfiniteMode=n.getInitialSlideInInfiniteMode;var s=i("ztRg");t.getWidthFromDeviceType=s.getWidthFromDeviceType,t.getPartialVisibilityGutter=s.getPartialVisibilityGutter,t.getItemClientSideWidth=s.getItemClientSideWidth;var o=i("m1kc");t.getInitialState=o.getInitialState,t.getIfSlideIsVisbile=o.getIfSlideIsVisbile,t.getTransformForCenterMode=o.getTransformForCenterMode,t.getTransformForPartialVsibile=o.getTransformForPartialVsibile,t.isInLeftEnd=o.isInLeftEnd,t.isInRightEnd=o.isInRightEnd,t.notEnoughChildren=o.notEnoughChildren,t.getSlidesToSlide=o.getSlidesToSlide;var r=i("7XbK");t.throttle=r.default;var a=i("oQ0E");t.throwError=a.default;var l=i("DhR6");t.populateNextSlides=l.populateNextSlides;var c=i("2ZXj");t.populatePreviousSlides=c.populatePreviousSlides;var d=i("zwN0");t.populateSlidesOnMouseTouchMove=d.populateSlidesOnMouseTouchMove},"40+L":function(e,t,i){e.exports=i("41yN")},"41yN":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("sW6s");t.default=n.default},"4u9e":function(e,t,i){e.exports={container:"styles_container__G5aW4",first_container:"styles_first_container__3p3uB",second_container:"styles_second_container__3wmDM",first_text_container:"styles_first_text_container__3AUCr",first_img_container:"styles_first_img_container__mMIFF",moto:"styles_moto__1lwDd",text_container:"styles_text_container__3FcnF",moto_background_img:"styles_moto_background_img__1Wk8h",heading:"styles_heading__OTRfS",main_heading:"styles_main_heading__pm57D",para:"styles_para__8mmJB",timeline_container:"styles_timeline_container__1WEL9",mobile_team:"styles_mobile_team__3VjkV",mobile_heading:"styles_mobile_heading__p1ZWl",inner_container:"styles_inner_container__3AY8y",mobile_name:"styles_mobile_name__3QuEc",background_img0:"styles_background_img0__3eyDu",background_img1:"styles_background_img1__DoJex",crossImg:"styles_crossImg__2sZX6"}},"7XbK":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e,t,i){var n;return function(){var s=arguments;n||(e.apply(this,s),n=!0,"function"==typeof i&&i(!0),setTimeout((function(){n=!1,"function"==typeof i&&i(!1)}),t))}}},DhR6:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("m1kc");t.populateNextSlides=function(e,t,i){void 0===i&&(i=0);var s,o,r=e.slidesToShow,a=e.currentSlide,l=e.itemWidth,c=e.totalItems,d=n.getSlidesToSlide(e,t),u=a+1+i+r+(0<i?0:d);return o=u<=c?-l*(s=a+i+(0<i?0:d)):c<u&&a!==c-r?-l*(s=c-r):s=void 0,{nextSlides:s,nextPosition:o}}},Ikk0:function(e,t,i){e.exports={small_heading:"styles_small_heading__1u6zZ",gallery__item:"styles_gallery__item__2KQsP",main_heading:"styles_main_heading__j1V7P",gallery:"styles_gallery__RBSFb",gallery__img:"styles_gallery__img__1i8hP",gallery__item1:"styles_gallery__item1__EnP3E",gallery__item2:"styles_gallery__item2__1Sr0K",gallery__item3:"styles_gallery__item3__1nhyW",gallery__item4:"styles_gallery__item4__2bHL4",gallery__item5:"styles_gallery__item5__1TSa4",gallery__item6:"styles_gallery__item6__34HDS",gallery__item7:"styles_gallery__item7___ADKu",gallery__item8:"styles_gallery__item8__1nGON",gallery__item9:"styles_gallery__item9__2BVFN",gal_num:"styles_gal_num__3NUFm",gal_num2:"styles_gal_num2__j5HEM",gal_num3:"styles_gal_num3__1krel",gal_num4:"styles_gal_num4__2CbIc",gal_num5:"styles_gal_num5__231jv",gal_num6:"styles_gal_num6__1OR_q",gal_num7:"styles_gal_num7__3GIqU",gal_num8:"styles_gal_num8__4xwcv",gal_num9:"styles_gal_num9__26lXP"}},Juyh:function(e,t,i){"use strict";i.r(t);var n=i("nKUr"),s=(i("q1tI"),i("4u9e")),o=i.n(s),r=[{title:"Equip businesses with the tools they need to grow.",description:"We provide tools, insights and education that simplifies the effort of businesses, while immensely lowering the barriers of taking actionable decisions.We\u2019re all about our mission! Everything we do, must answer the question, \u201cDoes this help businesses grow?",src:"https://images.unsplash.com/photo-1621569898766-24987e1fd55e?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",order:2},{title:"The Service Catalogue Re-imagined!",description:"Every customer deserves top quality service and have the best experience. We strive to build flourishing and sustainable hospitality & travel products to not only maximize the service quality and total hotel revenue but also support the business and personal needs of our customers.",src:"https://images.unsplash.com/photo-1621569898766-24987e1fd55e?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",order:1}],a="Our Moto",l="Equip businesses with the tools they need to Grow & Maximize Revenue.",c="The Quoality Culture Manifesto",d="We as a company are goal driven and equipped with imperative principles and values. What makes the right platform? We strive to deliver the best, our standards are high and we\u2019re always willing to deliver the best and make life easy for clients and the people.",u=[{heading:"01",description:"It's in our name! Our standard for quality and detail is near perfection. Getting the little things right makes the final outcome even stronger.",color:"#a13bb0"},{heading:"02",description:"Make the right calls. Think like an entrepreneur",color:"#7bcee8"},{heading:"03",description:"Whether it's deadlines, money or technology, we embrace constraints and use them to fuel creative decisions",color:"#177bff"},{heading:"04",description:"All eyes on the finish line! We succeed, the businesses succeed.",color:"#f09959"},{heading:"05",description:"Once a decision is made, the team commits to it. Totally!",color:"#74b570"},{heading:"06",description:"We're here to make a difference and that purpose drives us each day to make a better product and a better place to work",color:"#f7cc4c"},{heading:"07",description:"We are accountable for decisions, deadlines, and commitments. Our decisions affect the team, customers, etc, We are responsible for owning what we commit to.",color:"#4a00c7"},{heading:"08",description:"Results speak! The final product is what we believe more, compared to the process. That\u2019s how we weigh success!",color:"#c84e89"},{heading:"09",description:"It\u2019s important that everyone feels safe to disagree. It hurts the company and the mission to never push each other to make better decisions.",color:"#ff176b"}];i("5788"),i("zM7Y");var h=i("wE2W");i("OMHL");var m=i("Ikk0"),p=i.n(m),f="It's in our name! Our standard for quality and detail is near perfection. Getting the little things right makes the final outcome even stronger.",g="Make the right calls. Think like an entrepreneur",_="Whether it's deadlines, money or technology, we embrace constraints and use them to fuel creative decisions",y="All eyes on the finish line! We succeed, the businesses succeed.",v="Once a decision is made, the team commits to it. Totally!",b="We're here to make a difference and that purpose drives us each day to make a better product and a better place to work",j="We are accountable for decisions, deadlines, and commitments. Our decisions affect the team, customers, etc, We are responsible for owning what we commit to.",x="Results speak! The final product is what we believe more, compared to the process. That\u2019s how we weigh success!",S="It\u2019s important that everyone feels safe to disagree. It hurts the company and the mission to never push each other to make better decisions.  ";var w=function(){var e=f,t=g,i=_,s=y,o=v,r=b,a=j,l=x,c=S;return Object(n.jsxs)("div",{className:p.a.container,children:[Object(n.jsx)("h6",{className:p.a.small_heading,children:"CORE VALUES"}),Object(n.jsx)("h1",{className:p.a.main_heading,children:"CORE VALUES"}),Object(n.jsxs)("div",{className:p.a.gallery,children:[Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item1),children:[Object(n.jsx)("p",{className:p.a.gal_num,children:"01"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:e})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item2),children:[Object(n.jsx)("p",{className:p.a.gal_num2,children:"02"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:t})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item3),children:[Object(n.jsx)("p",{className:p.a.gal_num3,children:"03"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:i})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item4),children:[Object(n.jsx)("p",{className:p.a.gal_num4,children:"04"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:s})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item5),children:[Object(n.jsx)("p",{className:p.a.gal_num5,children:"05"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:o})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item6),children:[Object(n.jsx)("p",{className:p.a.gal_num6,children:"06"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:r})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item7),children:[Object(n.jsx)("p",{className:p.a.gal_num7,children:"07"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:a})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item8),children:[Object(n.jsx)("p",{className:p.a.gal_num8,children:"08"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:l})]}),Object(n.jsxs)("figure",{className:(p.a.gallery__item,p.a.gallery__item9),children:[Object(n.jsx)("p",{className:p.a.gal_num9,children:"09"}),Object(n.jsx)("p",{className:p.a.gallery__img,children:c})]})]})]})},O=i("40+L"),T=i.n(O),I=i("e5lS"),C=i.n(I),M=i("/A61");var k=function(e){var t=e.data;return Object(n.jsx)("div",{style:{paddingBottom:"30px",position:"relative"},children:Object(n.jsx)(T.a,{additionalTransfrom:0,arrows:!0,autoPlaySpeed:3e3,centerMode:!1,className:"",containerClass:"container",dotListClass:"",draggable:!0,focusOnSelect:!1,infinite:!0,itemClass:"",keyBoardControl:!0,minimumTouchDrag:80,renderButtonGroupOutside:!1,renderDotsOutside:!0,responsive:{desktop:{breakpoint:{max:3e3,min:1024},items:1},mobile:{breakpoint:{max:464,min:0},items:1},tablet:{breakpoint:{max:1024,min:464},items:1}},showDots:!0,sliderClass:"",slidesToSlide:1,swipeable:!0,children:t.map((function(e,t){return Object(n.jsxs)("div",{className:C.a.Carousel_container,children:[Object(n.jsx)(M.c,{color:e.color,className:C.a.heading,children:e.heading}),Object(n.jsx)("p",{children:e.description}),Object(n.jsx)("p",{children:null===e||void 0===e?void 0:e.month})]},t)}))})})},P=i("RRtB");var E=function(e){var t=e.item;e.index;return Object(n.jsxs)("div",{className:o.a.first_container,children:[Object(n.jsxs)("div",{className:o.a.first_text_container,children:[Object(n.jsx)("h5",{children:"MISSION"}),Object(n.jsx)("h2",{children:t.title}),Object(n.jsx)("p",{className:o.a.description,children:t.description})]}),Object(n.jsxs)("div",{className:"relative flex justify-center mt-5 ".concat(o.a.first_img_container),children:[Object(n.jsx)("img",{className:o.a.crossImg,src:"/static/img/about/mission.jpeg",alt:"working"}),Object(n.jsx)("img",{className:o.a.background_img0,src:"/static/img/services/Vector0.png",alt:"company_description"})]})]})},N=function(e){var t=e.item;e.index;return Object(n.jsxs)("div",{className:o.a.second_container,children:[Object(n.jsxs)("div",{className:"flex justify-center relative ".concat(o.a.first_img_container),children:[Object(n.jsx)("img",{className:o.a.crossImg,src:"/static/img/about/vision.jpeg",alt:"team chemistry"}),Object(n.jsx)("img",{className:o.a.background_img1,src:"/static/img/services/Vector1.png",alt:"company_description"})]}),Object(n.jsxs)("div",{className:o.a.first_text_container,children:[Object(n.jsx)("h5",{children:"VISION"}),Object(n.jsx)("h2",{children:t.title}),Object(n.jsx)("p",{className:o.a.description2,children:t.description})]})]})},R=function(){var e=Object(P.a)();return Object(n.jsxs)("div",{className:o.a.container,children:[r.map((function(e,t){return Object(n.jsx)("div",{className:"mt-5",children:1===e.order?Object(n.jsx)(E,{item:e,index:t}):Object(n.jsx)(N,{item:e,index:t})},t)})),Object(n.jsx)(h.a,{gap:7}),e?Object(n.jsx)(k,{data:u}):Object(n.jsx)(w,{}),Object(n.jsxs)("div",{className:o.a.moto,children:[Object(n.jsxs)("div",{className:o.a.text_container,children:[Object(n.jsx)("h2",{children:a}),Object(n.jsx)("h3",{className:"font",children:l})]}),Object(n.jsx)("img",{className:o.a.moto_background_img,src:"/static/img/about/Vector.png",alt:"background_img"})]})]})},W=i("W5HN"),A=i.n(W);var D=function(){var e=c,t=d;return Object(n.jsxs)("div",{className:"relative",children:[Object(n.jsxs)("div",{className:A.a.container,children:[Object(n.jsxs)("div",{className:"".concat(A.a.left_text_container," mx-5 pb-10"),children:[Object(n.jsx)("h1",{children:e}),Object(n.jsx)("p",{className:"mt-12 ".concat(A.a.text_container_Desc),children:t}),Object(n.jsx)("button",{className:A.a.button,children:Object(n.jsx)("a",{href:"https://angel.co/company/quoality",children:"Join Us"})})]}),Object(n.jsxs)("div",{style:{position:"relative"},className:A.a.right_img_container,children:[Object(n.jsx)("img",{alt:"Team Bonding",src:"/static/img/about/bussiness-people-working-team-office 1.png"}),Object(n.jsx)("img",{alt:"background image",style:{position:"absolute",top:"25px",zIndex:-1},src:"/static/img/about/About us10.svg"})]})]}),Object(n.jsx)("img",{alt:"background image",className:A.a.background_img,src:"/static/img/about/Frame 1250.png"})]})},L=i("kTQO");t.default=function(){return Object(n.jsxs)(L.a,{description:"We as a company are goal-driven and equipped with imperative principles and values. What makes ... ",title:"About Us | Hospitality Revenue Acceleration Platform",children:[Object(n.jsx)(D,{}),Object(n.jsx)(h.a,{gap:"5"}),Object(n.jsx)(R,{}),Object(n.jsx)(h.a,{gap:"6"})]})}},OMHL:function(e,t,i){e.exports={img_container:"styles_img_container__1k4ul",img:"styles_img__2eQJ8",heading:"styles_heading__1mXEV",main_heading:"styles_main_heading__tg6fe"}},S9TR:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("q1tI"),s=i("3TDQ");t.default=function(e){var t=e.props,i=e.state,o=e.goToSlide,r=e.clones,a=e.notEnoughChildren,l=i.itemWidth,c=t.children,d=t.infinite,u=t.itemClass,h=t.itemAriaLabel,m=t.partialVisbile,p=t.partialVisible,f=s.getInitialState(i,t),g=f.flexBisis,_=f.shouldRenderOnSSR,y=f.domFullyLoaded,v=f.partialVisibilityGutter;return f.shouldRenderAtAll?(m&&console.warn('WARNING: Please correct props name: "partialVisible" as old typo will be removed in future versions!'),n.createElement(n.Fragment,null,(d?r:n.Children.toArray(c)).map((function(e,r){return n.createElement("li",{key:r,"data-index":r,onClick:function(){t.focusOnSelect&&o(r)},"aria-hidden":s.getIfSlideIsVisbile(r,i)?"false":"true","aria-label":h||(e.props.ariaLabel?e.props.ariaLabel:null),style:{flex:_?"1 0 "+g+"%":"auto",position:"relative",width:y?((m||p)&&v&&!a?l-v:l)+"px":"auto"},className:"react-multi-carousel-item "+(s.getIfSlideIsVisbile(r,i)?"react-multi-carousel-item--active":"")+" "+u},e)})))):null}},SSZS:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("q1tI"),s=i("v5rg"),o=i("bwfW"),r=i("m1kc");t.default=function(e){var t=e.props,i=e.state,a=e.goToSlide,l=e.getState,c=t.showDots,d=t.customDot,u=t.dotListClass,h=t.infinite,m=t.children;if(!c||r.notEnoughChildren(i))return null;var p,f=i.currentSlide,g=i.slidesToShow,_=r.getSlidesToSlide(i,t),y=n.Children.toArray(m);p=h?Math.ceil(y.length/_):Math.ceil((y.length-g)/_)+1;var v=o.getLookupTableForNextSlides(p,i,t,y),b=s.getOriginalIndexLookupTableByClones(g,y),j=b[f];return n.createElement("ul",{className:"react-multi-carousel-dot-list "+u},Array(p).fill(0).map((function(e,t){var i,s;if(h){s=v[t];var o=b[s];i=j===o||o<=j&&j<o+_}else{var r=y.length-g,c=t*_;i=(s=r<c?r:c)===f||s<f&&f<s+_&&f<y.length-g}return d?n.cloneElement(d,{index:t,active:i,key:t,onClick:function(){return a(s)},carouselState:l()}):n.createElement("li",{"data-index":t,key:t,className:"react-multi-carousel-dot "+(i?"react-multi-carousel-dot--active":"")},n.createElement("button",{"aria-label":"Go to slide "+(t+1),onClick:function(){return a(s)}}))})))}},W5HN:function(e,t,i){e.exports={container:"styles_container__2ee9P",text_container_Desc:"styles_text_container_Desc__3v0ED",left_text_container:"styles_left_text_container__1QNR8",right_img_container:"styles_right_img_container__3mJbU",background_img:"styles_background_img__3xYIP",button:"styles_button__KCxL9"}},bwfW:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("v5rg"),s=i("m1kc");t.getLookupTableForNextSlides=function(e,t,i,o){var r={},a=s.getSlidesToSlide(t,i);return Array(e).fill(0).forEach((function(e,i){var s=n.getOriginalCounterPart(i,t,o);if(0===i)r[0]=s;else{var l=r[i-1]+a;r[i]=l}})),r}},e5lS:function(e,t,i){e.exports={heading:"styles_heading__10e36"}},kTQO:function(e,t,i){"use strict";var n=i("nKUr"),s=i("q1tI"),o=i("g4pe"),r=i.n(o),a=i("7USR"),l=(i("onGI"),i("COdo"),i("wE2W"),i("2eAG")),c=i("qQXe"),d=i("Mj6V"),u=i.n(d),h=i("20a2"),m=i.n(h),p=i("u/rl"),f=i.n(p);m.a.onRouteChangeStart=function(e){localStorage.setItem("innerloading",!0),localStorage.setItem("loading",!1),u.a.start()},m.a.onRouteChangeComplete=function(){localStorage.setItem("innerloading",!1),u.a.done()},m.a.onRouteChangeError=function(){localStorage.setItem("innerloading",!1),u.a.done()};t.a=function(e){var t=e.children,i=e.title,o=e.description,d=e.logo,u=Object(s.useState)(!1),h=(u[0],u[1]),m=null;return m=localStorage.getItem("innerloading"),Object(s.useEffect)((function(){h(m)}),[m]),Object(n.jsx)("div",{children:Object(n.jsxs)("div",{className:f.a.main_container,children:[Object(n.jsxs)(r.a,{children:[Object(n.jsx)("title",{children:i}),Object(n.jsx)("link",{rel:"icon",href:"../../../static/img/logo1.png"}),Object(n.jsx)("meta",{name:"description",content:o}),Object(n.jsx)("meta",{property:"og:url",content:"https://www.dev.quoality.com/"}),Object(n.jsx)("meta",{property:"og:type",content:i}),Object(n.jsx)("meta",{property:"og:title",content:i}),Object(n.jsx)("meta",{property:"og:description",content:o}),Object(n.jsx)("meta",{property:"og:image",content:d})]}),Object(n.jsx)(a.a,{}),Object(n.jsx)("div",{children:t}),Object(n.jsx)(l.a,{}),Object(n.jsx)(c.a,{})]})})}},m1kc:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("ztRg");function s(e){var t=e.slidesToShow;return e.totalItems<t}function o(e,t,i){var n=i||e.transform;return!t.infinite&&0===e.currentSlide||s(e)?n:n+e.itemWidth/2}function r(e){var t=e.currentSlide,i=e.totalItems;return!(t+e.slidesToShow<i)}function a(e,t,i,n){void 0===t&&(t=0);var o=e.currentSlide,a=e.slidesToShow,l=r(e),c=!i.infinite&&l,d=n||e.transform;if(s(e))return d;var u=d+o*t;return c?u+(e.containerWidth-(e.itemWidth-t)*a):u}t.notEnoughChildren=s,t.getInitialState=function(e,t){var i,s=e.domLoaded,o=e.slidesToShow,r=e.containerWidth,a=e.itemWidth,l=t.deviceType,c=t.responsive,d=t.ssr,u=t.partialVisbile,h=t.partialVisible,m=Boolean(s&&o&&r&&a);d&&l&&!m&&(i=n.getWidthFromDeviceType(l,c));var p=Boolean(d&&l&&!m&&i);return{shouldRenderOnSSR:p,flexBisis:i,domFullyLoaded:m,partialVisibilityGutter:n.getPartialVisibilityGutter(c,u||h,l,e.deviceType),shouldRenderAtAll:p||m}},t.getIfSlideIsVisbile=function(e,t){var i=t.currentSlide,n=t.slidesToShow;return i<=e&&e<i+n},t.getTransformForCenterMode=o,t.isInLeftEnd=function(e){return!(0<e.currentSlide)},t.isInRightEnd=r,t.getTransformForPartialVsibile=a,t.getTransform=function(e,t,i){var s=t.partialVisbile,r=t.partialVisible,l=t.responsive,c=t.deviceType,d=t.centerMode,u=i||e.transform,h=n.getPartialVisibilityGutter(l,s||r,c,e.deviceType);return r||s?a(e,h,t,i):d?o(e,t,i):u},t.getSlidesToSlide=function(e,t){var i=e.domLoaded,n=e.slidesToShow,s=e.containerWidth,o=e.itemWidth,r=t.deviceType,a=t.responsive,l=t.slidesToSlide||1,c=Boolean(i&&n&&s&&o);return t.ssr&&t.deviceType&&!c&&Object.keys(a).forEach((function(e){var t=a[e].slidesToSlide;r===e&&t&&(l=t)})),c&&Object.keys(a).forEach((function(e){var t=a[e],i=t.breakpoint,n=t.slidesToSlide,s=i.max,o=i.min;n&&window.innerWidth>=o&&window.innerWidth<=s&&(l=n)})),l}},oQ0E:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var i=t.partialVisbile,n=t.partialVisible,s=t.centerMode,o=t.ssr,r=t.responsive;if((i||n)&&s)throw new Error("center mode can not be used at the same time with partialVisible");if(!r)throw o?new Error("ssr mode need to be used in conjunction with responsive prop"):new Error("Responsive prop is needed for deciding the amount of items to show on the screen");if(r&&"object"!=typeof r)throw new Error("responsive prop must be an object")}},rB5V:function(e,t,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/about",function(){return i("Juyh")}])},sW6s:function(e,t,i){"use strict";var n=this&&this.__extends||function(){var e=function(t,i){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(t,i)};return function(t,i){function n(){this.constructor=t}e(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var s=i("q1tI"),o=i("3TDQ"),r=i("+yCD"),a=i("SSZS"),l=i("yQRQ"),c=i("S9TR"),d=i("m1kc"),u=400,h="transform 400ms ease-in-out",m=function(e){function t(t){var i=e.call(this,t)||this;return i.containerRef=s.createRef(),i.listRef=s.createRef(),i.state={itemWidth:0,slidesToShow:0,currentSlide:0,totalItems:s.Children.count(t.children),deviceType:"",domLoaded:!1,transform:0,containerWidth:0},i.onResize=i.onResize.bind(i),i.handleDown=i.handleDown.bind(i),i.handleMove=i.handleMove.bind(i),i.handleOut=i.handleOut.bind(i),i.onKeyUp=i.onKeyUp.bind(i),i.handleEnter=i.handleEnter.bind(i),i.setIsInThrottle=i.setIsInThrottle.bind(i),i.next=o.throttle(i.next.bind(i),t.transitionDuration||u,i.setIsInThrottle),i.previous=o.throttle(i.previous.bind(i),t.transitionDuration||u,i.setIsInThrottle),i.goToSlide=o.throttle(i.goToSlide.bind(i),t.transitionDuration||u,i.setIsInThrottle),i.onMove=!1,i.initialX=0,i.lastX=0,i.isAnimationAllowed=!1,i.direction="",i.initialY=0,i.isInThrottle=!1,i.transformPlaceHolder=0,i}return n(t,e),t.prototype.resetTotalItems=function(){var e=this,t=s.Children.count(this.props.children),i=o.notEnoughChildren(this.state)?0:Math.max(0,Math.min(this.state.currentSlide,t));this.setState({totalItems:t,currentSlide:i},(function(){e.setContainerAndItemWidth(e.state.slidesToShow,!0)}))},t.prototype.setIsInThrottle=function(e){void 0===e&&(e=!1),this.isInThrottle=e},t.prototype.setTransformDirectly=function(e,t){var i=this.props.additionalTransfrom,n=d.getTransform(this.state,this.props,e);this.transformPlaceHolder=e,this.listRef&&this.listRef.current&&(this.setAnimationDirectly(t),this.listRef.current.style.transform="translate3d("+(n+i)+"px,0,0)")},t.prototype.setAnimationDirectly=function(e){this.listRef&&this.listRef.current&&(this.listRef.current.style.transition=e?this.props.customTransition||h:"none")},t.prototype.componentDidMount=function(){this.setState({domLoaded:!0}),this.setItemsToShow(),window.addEventListener("resize",this.onResize),this.onResize(!0),this.props.keyBoardControl&&window.addEventListener("keyup",this.onKeyUp),this.props.autoPlay&&this.props.autoPlaySpeed&&(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed))},t.prototype.setClones=function(e,t,i,n){var r=this;void 0===n&&(n=!1),this.isAnimationAllowed=!1;var a=s.Children.toArray(this.props.children),l=o.getInitialSlideInInfiniteMode(e||this.state.slidesToShow,a),c=o.getClones(this.state.slidesToShow,a),d=a.length<this.state.slidesToShow?0:this.state.currentSlide;this.setState({totalItems:c.length,currentSlide:i&&!n?d:l},(function(){r.correctItemsPosition(t||r.state.itemWidth)}))},t.prototype.setItemsToShow=function(e,t){var i=this,n=this.props.responsive;Object.keys(n).forEach((function(s){var o=n[s],r=o.breakpoint,a=o.items,l=r.max,c=r.min;window.innerWidth>=c&&window.innerWidth<=l&&(i.setState({slidesToShow:a,deviceType:s}),i.setContainerAndItemWidth(a,e,t))}))},t.prototype.setContainerAndItemWidth=function(e,t,i){var n=this;if(this.containerRef&&this.containerRef.current){var s=this.containerRef.current.offsetWidth,r=o.getItemClientSideWidth(this.props,e,s);this.setState({containerWidth:s,itemWidth:r},(function(){n.props.infinite&&n.setClones(e,r,t,i)})),t&&this.correctItemsPosition(r)}},t.prototype.correctItemsPosition=function(e,t,i){t&&(this.isAnimationAllowed=!0),!t&&this.isAnimationAllowed&&(this.isAnimationAllowed=!1);var n=this.state.totalItems<this.state.slidesToShow?0:-e*this.state.currentSlide;i&&this.setTransformDirectly(n,!0),this.setState({transform:n})},t.prototype.onResize=function(e){var t;t=!!this.props.infinite&&("boolean"!=typeof e||!e),this.setItemsToShow(t)},t.prototype.componentDidUpdate=function(e,t){var i=this,n=e.keyBoardControl,s=e.autoPlay,o=e.children,r=t.containerWidth,a=t.domLoaded,l=t.currentSlide;this.containerRef&&this.containerRef.current&&this.containerRef.current.offsetWidth!==r&&(this.itemsToShowTimeout&&clearTimeout(this.itemsToShowTimeout),this.itemsToShowTimeout=setTimeout((function(){i.setItemsToShow(!0)}),this.props.transitionDuration||u)),n&&!this.props.keyBoardControl&&window.removeEventListener("keyup",this.onKeyUp),!n&&this.props.keyBoardControl&&window.addEventListener("keyup",this.onKeyUp),s&&!this.props.autoPlay&&this.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=void 0),s||!this.props.autoPlay||this.autoPlay||(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed)),o.length!==this.props.children.length?setTimeout((function(){i.props.infinite?i.setClones(i.state.slidesToShow,i.state.itemWidth,!0,!0):i.resetTotalItems()}),this.props.transitionDuration||u):this.props.infinite&&this.state.currentSlide!==l&&this.correctClonesPosition({domLoaded:a}),this.transformPlaceHolder!==this.state.transform&&(this.transformPlaceHolder=this.state.transform)},t.prototype.correctClonesPosition=function(e){var t=this,i=e.domLoaded,n=s.Children.toArray(this.props.children),r=o.checkClonesPosition(this.state,n,this.props),a=r.isReachingTheEnd,l=r.isReachingTheStart,c=r.nextSlide,d=r.nextPosition;this.state.domLoaded&&i&&(a||l)&&(this.isAnimationAllowed=!1,setTimeout((function(){t.setState({transform:d,currentSlide:c})}),this.props.transitionDuration||u))},t.prototype.next=function(e){var t=this;void 0===e&&(e=0);var i=this.props,n=i.afterChange,s=i.beforeChange;if(!o.notEnoughChildren(this.state)){var r=o.populateNextSlides(this.state,this.props,e),a=r.nextSlides,l=r.nextPosition,c=this.state.currentSlide;void 0!==a&&void 0!==l&&("function"==typeof s&&s(a,this.getState()),this.isAnimationAllowed=!0,this.setState({transform:l,currentSlide:a},(function(){"function"==typeof n&&setTimeout((function(){n(c,t.getState())}),t.props.transitionDuration||u)})))}},t.prototype.previous=function(e){var t=this;void 0===e&&(e=0);var i=this.props,n=i.afterChange,s=i.beforeChange;if(!o.notEnoughChildren(this.state)){var r=o.populatePreviousSlides(this.state,this.props,e),a=r.nextSlides,l=r.nextPosition;if(void 0!==a&&void 0!==l){var c=this.state.currentSlide;"function"==typeof s&&s(a,this.getState()),this.isAnimationAllowed=!0,this.setState({transform:l,currentSlide:a},(function(){"function"==typeof n&&setTimeout((function(){n(c,t.getState())}),t.props.transitionDuration||u)}))}}},t.prototype.componentWillUnmount=function(){window.removeEventListener("resize",this.onResize),this.props.keyBoardControl&&window.removeEventListener("keyup",this.onKeyUp),this.props.autoPlay&&this.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=void 0),this.itemsToShowTimeout&&clearTimeout(this.itemsToShowTimeout)},t.prototype.resetMoveStatus=function(){this.onMove=!1,this.initialX=0,this.lastX=0,this.direction="",this.initialY=0},t.prototype.handleDown=function(e){if(!(!r.isMouseMoveEvent(e)&&!this.props.swipeable||r.isMouseMoveEvent(e)&&!this.props.draggable||this.isInThrottle)){var t=r.isMouseMoveEvent(e)?e:e.touches[0],i=t.clientX,n=t.clientY;this.onMove=!0,this.initialX=i,this.initialY=n,this.lastX=i,this.isAnimationAllowed=!1}},t.prototype.handleMove=function(e){if(!(!r.isMouseMoveEvent(e)&&!this.props.swipeable||r.isMouseMoveEvent(e)&&!this.props.draggable||o.notEnoughChildren(this.state))){var t=r.isMouseMoveEvent(e)?e:e.touches[0],i=t.clientX,n=t.clientY,s=this.initialX-i,a=this.initialY-n;if(!r.isMouseMoveEvent(e)&&this.autoPlay&&this.props.autoPlay&&this.props.pauseOnHover&&(clearInterval(this.autoPlay),this.autoPlay=void 0),this.onMove){if(!(Math.abs(s)>Math.abs(a)))return;var l=o.populateSlidesOnMouseTouchMove(this.state,this.props,this.initialX,this.lastX,i,this.transformPlaceHolder),c=l.direction,d=l.nextPosition,u=l.canContinue;c&&(this.direction=c,u&&void 0!==d&&this.setTransformDirectly(d)),this.lastX=i}}},t.prototype.handleOut=function(e){this.props.autoPlay&&!this.autoPlay&&(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed));var t="touchend"===e.type&&!this.props.swipeable,i=("mouseleave"===e.type||"mouseup"===e.type)&&!this.props.draggable;if(!t&&!i&&this.onMove){if(this.setAnimationDirectly(!0),"right"===this.direction)if(this.initialX-this.lastX>=this.props.minimumTouchDrag){var n=Math.round((this.initialX-this.lastX)/this.state.itemWidth);this.next(n)}else this.correctItemsPosition(this.state.itemWidth,!0,!0);"left"===this.direction&&(this.lastX-this.initialX>this.props.minimumTouchDrag?(n=Math.round((this.lastX-this.initialX)/this.state.itemWidth),this.previous(n)):this.correctItemsPosition(this.state.itemWidth,!0,!0)),this.resetMoveStatus()}},t.prototype.isInViewport=function(e){var t=e.getBoundingClientRect(),i=t.top,n=void 0===i?0:i,s=t.left,o=void 0===s?0:s,r=t.bottom,a=void 0===r?0:r,l=t.right,c=void 0===l?0:l;return 0<=n&&0<=o&&a<=(window.innerHeight||document.documentElement.clientHeight)&&c<=(window.innerWidth||document.documentElement.clientWidth)},t.prototype.isChildOfCarousel=function(e){return!!(e instanceof Element&&this.listRef&&this.listRef.current)&&this.listRef.current.contains(e)},t.prototype.onKeyUp=function(e){var t=e.target;switch(e.keyCode){case 37:if(this.isChildOfCarousel(t))return this.previous();break;case 39:if(this.isChildOfCarousel(t))return this.next();break;case 9:if(this.isChildOfCarousel(t)&&t instanceof HTMLInputElement&&!this.isInViewport(t))return this.next()}},t.prototype.handleEnter=function(){this.autoPlay&&this.props.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=void 0)},t.prototype.goToSlide=function(e,t){var i=this;if(!this.isInThrottle){var n=this.state.itemWidth,s=this.props,o=s.afterChange,r=s.beforeChange,a=this.state.currentSlide;"function"!=typeof r||t&&("object"!=typeof t||t.skipBeforeChange)||r(e,this.getState()),this.isAnimationAllowed=!0,this.setState({currentSlide:e,transform:-n*e},(function(){i.props.infinite&&i.correctClonesPosition({domLoaded:!0}),"function"!=typeof o||t&&("object"!=typeof t||t.skipAfterChange)||setTimeout((function(){o(a,i.getState())}),i.props.transitionDuration||u)}))}},t.prototype.getState=function(){return this.state},t.prototype.renderLeftArrow=function(e){var t=this,i=this.props.customLeftArrow;return s.createElement(l.LeftArrow,{customLeftArrow:i,getState:function(){return t.getState()},previous:this.previous,disabled:e})},t.prototype.renderRightArrow=function(e){var t=this,i=this.props.customRightArrow;return s.createElement(l.RightArrow,{customRightArrow:i,getState:function(){return t.getState()},next:this.next,disabled:e})},t.prototype.renderButtonGroups=function(){var e=this,t=this.props.customButtonGroup;return t?s.cloneElement(t,{previous:function(){return e.previous()},next:function(){return e.next()},goToSlide:function(t,i){return e.goToSlide(t,i)},carouselState:this.getState()}):null},t.prototype.renderDotsList=function(){var e=this;return s.createElement(a.default,{state:this.state,props:this.props,goToSlide:this.goToSlide,getState:function(){return e.getState()}})},t.prototype.renderCarouselItems=function(){var e=[];if(this.props.infinite){var t=s.Children.toArray(this.props.children);e=o.getClones(this.state.slidesToShow,t)}return s.createElement(c.default,{clones:e,goToSlide:this.goToSlide,state:this.state,notEnoughChildren:o.notEnoughChildren(this.state),props:this.props})},t.prototype.render=function(){var e=this.props,t=e.deviceType,i=e.arrows,n=e.renderArrowsWhenDisabled,r=e.removeArrowOnDeviceType,a=e.infinite,l=e.containerClass,c=e.sliderClass,u=e.customTransition,m=e.additionalTransfrom,p=e.renderDotsOutside,f=e.renderButtonGroupOutside,g=e.className,_=o.getInitialState(this.state,this.props),y=_.shouldRenderOnSSR,v=_.shouldRenderAtAll,b=o.isInLeftEnd(this.state),j=o.isInRightEnd(this.state),x=i&&!(r&&(t&&-1<r.indexOf(t)||this.state.deviceType&&-1<r.indexOf(this.state.deviceType)))&&!o.notEnoughChildren(this.state)&&v,S=!a&&b,w=!a&&j,O=d.getTransform(this.state,this.props);return s.createElement(s.Fragment,null,s.createElement("div",{className:"react-multi-carousel-list "+l+" "+g,ref:this.containerRef},s.createElement("ul",{ref:this.listRef,className:"react-multi-carousel-track "+c,style:{transition:this.isAnimationAllowed?u||h:"none",overflow:y?"hidden":"unset",transform:"translate3d("+(O+m)+"px,0,0)"},onMouseMove:this.handleMove,onMouseDown:this.handleDown,onMouseUp:this.handleOut,onMouseEnter:this.handleEnter,onMouseLeave:this.handleOut,onTouchStart:this.handleDown,onTouchMove:this.handleMove,onTouchEnd:this.handleOut},this.renderCarouselItems()),x&&(!S||n)&&this.renderLeftArrow(S),x&&(!w||n)&&this.renderRightArrow(w),v&&!f&&this.renderButtonGroups(),v&&!p&&this.renderDotsList()),v&&p&&this.renderDotsList(),v&&f&&this.renderButtonGroups())},t.defaultProps={slidesToSlide:1,infinite:!1,draggable:!0,swipeable:!0,arrows:!0,renderArrowsWhenDisabled:!1,containerClass:"",sliderClass:"",itemClass:"",keyBoardControl:!0,autoPlaySpeed:3e3,showDots:!1,renderDotsOutside:!1,renderButtonGroupOutside:!1,minimumTouchDrag:80,className:"",dotListClass:"",focusOnSelect:!1,centerMode:!1,additionalTransfrom:0,pauseOnHover:!0},t}(s.Component);t.default=m},v5rg:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOriginalCounterPart=function(e,t,i){var n=t.slidesToShow,s=t.currentSlide;return i.length>2*n?e+2*n:s>=i.length?i.length+e:e},t.getOriginalIndexLookupTableByClones=function(e,t){if(t.length>2*e){for(var i={},n=t.length-2*e,s=t.length-n,o=n,r=0;r<s;r++)i[r]=o,o++;var a=t.length+s,l=a+t.slice(0,2*e).length,c=0;for(r=a;r<=l;r++)i[r]=c,c++;var d=a,u=0;for(r=s;r<d;r++)i[r]=u,u++;return i}i={};var h=3*t.length,m=0;for(r=0;r<h;r++)i[r]=m,++m===t.length&&(m=0);return i},t.getClones=function(e,t){return t.length<e?t:t.length>2*e?t.slice(t.length-2*e,t.length).concat(t,t.slice(0,2*e)):t.concat(t,t)},t.getInitialSlideInInfiniteMode=function(e,t){return t.length>2*e?2*e:t.length},t.checkClonesPosition=function(e,t,i){var n,s=e.currentSlide,o=e.slidesToShow,r=e.itemWidth,a=e.totalItems,l=0,c=0,d=0===s,u=t.length-(t.length-2*o);return t.length<o?(c=l=0,d=n=!1):t.length>2*o?((n=s>=u+t.length)&&(c=-r*(l=s-t.length)),d&&(c=-r*(l=u+(t.length-2*o)))):((n=s>=2*t.length)&&(c=-r*(l=s-t.length)),d&&(c=i.showDots?-r*(l=t.length):-r*(l=a-2*o))),{isReachingTheEnd:n,isReachingTheStart:d,nextSlide:l,nextPosition:c}}},yQRQ:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("q1tI");t.LeftArrow=function(e){var t=e.customLeftArrow,i=e.getState,s=e.previous,o=e.disabled;return t?n.cloneElement(t,{onClick:function(){return s()},carouselState:i(),disabled:o}):n.createElement("button",{"aria-label":"Go to previous slide",className:"react-multiple-carousel__arrow react-multiple-carousel__arrow--left",onClick:function(){return s()},type:"button",disabled:o})};t.RightArrow=function(e){var t=e.customRightArrow,i=e.getState,s=e.next,o=e.disabled;return t?n.cloneElement(t,{onClick:function(){return s()},carouselState:i(),disabled:o}):n.createElement("button",{"aria-label":"Go to next slide",className:"react-multiple-carousel__arrow react-multiple-carousel__arrow--right",onClick:function(){return s()},type:"button",disabled:o})}},zM7Y:function(e,t,i){e.exports={container:"styles_container__30yEU",text_container:"styles_text_container__1nkhD"}},ztRg:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.getPartialVisibilityGutter=function(e,t,i,n){var s=0,o=n||i;return t&&o&&(s=e[o].partialVisibilityGutter||e[o].paritialVisibilityGutter),s},t.getWidthFromDeviceType=function(e,t){var i;return t[e]&&(i=(100/t[e].items).toFixed(1)),i},t.getItemClientSideWidth=function(e,t,i){return Math.round(i/(t+(e.centerMode?1:0)))}},zwN0:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.populateSlidesOnMouseTouchMove=function(e,t,i,n,s,o){var r,a,l=e.itemWidth,c=e.slidesToShow,d=e.totalItems,u=e.currentSlide,h=t.infinite,m=!1,p=Math.round((i-n)/l),f=Math.round((n-i)/l),g=i<s;if(s<i&&p<=c){r="right";var _=Math.abs(-l*(d-c)),y=o-(n-s),v=u===d-c;(Math.abs(y)<=_||v&&h)&&(a=y,m=!0)}return g&&f<=c&&(r="left",((y=o+(s-n))<=0||0===u&&h)&&(m=!0,a=y)),{direction:r,nextPosition:a,canContinue:m}}}},[["rB5V",0,1,2,3,4]]]);