_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[38],{"/zTt":function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var r=n("v7Hm"),a=n("q1tI"),c=n.n(a).a.createElement;function l(e){var t=e.children;return c(r.a,{textStyle:"mediumText",fontWeight:"700"},t)}},Hqhg:function(e,t,n){"use strict";n.r(t),n.d(t,"__N_SSP",(function(){return fe}));var r=n("q1tI"),a=n.n(r),c=n("m/eG"),l=n("WBSE"),i=n("qOOK"),u=n("jPFB"),s=n("VYqH"),o=n("wx14"),m=n("du4W"),d=n("QoCZ"),f=a.a.createElement;var p=a.a.createElement;var h=a.a.createElement;var v=a.a.createElement;var b=a.a.createElement;var E=a.a.createElement,y=function(e){return E(m.a,Object(o.a)({bg:"white",borderRadius:"md",boxShadow:"0 0 0 1px ".concat(d.a.darkAsh[300])},e),e.children)};y.Thead=function(e){return f(m.e,e,e.children)},y.Th=function(e){return p(m.d,e,e.children)},y.Tbody=function(e){var t=e.children;return h(m.b,null,t)},y.Td=function(e){return v(m.c,e,e.children)},y.Tr=function(e){var t=e.children;return b(m.f,null,t)};var g=y,T=n("tofy"),_=a.a.createElement;var O=a.a.createElement,x=function(e){var t=e.children;return O(g,null,t)};x.Wrapper=function(e){var t=e.children;return _(T.a,{justifyContent:"flex-end",mt:6},t)};var j=x,R=n("v7Hm"),w=n("z0gp"),k=a.a.createElement,K=function(e){var t=e.children;return k(w.a,{columns:{base:1,sm:2,md:3,lg:4},gap:4},t)},N=a.a.createElement,S=function(e){var t=e.children;return N(l.b,{textAlign:"center",fontSize:"32px",mb:10},t)},C=a.a.createElement,H=function(e){var t=e.children;return C(R.a,{mb:20},t)};H.Wrapper=K,H.Title=S;var L=H,W=n("wZsY"),q=a.a.createElement,z=function(e){var t=e.children;return q(l.c,{fontSize:"20px",textAlign:"center"},t)},A=a.a.createElement,P=function(e){var t=e.children;return A(W.c,{justifyContent:"space-between",spacing:4,px:4,py:6,bg:"white",borderRadius:"md",boxShadow:"0 2px 10px -2px rgb(0 0 0 / 21%)"},t)};P.Name=z;var I=P,Y=n("gxmF"),M=a.a.createElement;function B(e){var t=e.sectionKey,n=e.name,r=e.passRate;return M(I,null,M(Y.a,{sectionKey:t}),M(I.Name,null,n),M("div",null,"Pass Rate: ",M("strong",null,r,"%")))}var D={seoCheckupsStats:[{sectionKey:"title-tag",name:"Meta Tags Analyzer",passRate:78},{sectionKey:"robots-txt",name:"Robots.txt Test",passRate:82},{sectionKey:"sitemap",name:"Sitemap Test",passRate:70},{sectionKey:"broken-links",name:"Broken Links",passRate:82},{sectionKey:"heading-tags",name:"H1 and H2 Tags",passRate:82},{sectionKey:"url-seo-friendly",name:"SEO Friendly URL",passRate:67},{sectionKey:"html-compression",name:"HTML Compression",passRate:77},{sectionKey:"img-alt",name:"Image Alt Test",passRate:38},{sectionKey:"js-errors",name:"JS Errors Checker",passRate:85},{sectionKey:"flash",name:"Flash Test",passRate:85},{sectionKey:"image-caching",name:"Image Caching Test",passRate:54},{sectionKey:"http-redirects",name:"URL Redirects Checker",passRate:72}]},F=a.a.createElement,U=D.seoCheckupsStats;function J(){return F(L,null,F(L.Title,null,"Percent of sites passing:"),F(L.Wrapper,null,U.map((function(e,t){return F(B,{key:t,sectionKey:e.sectionKey,name:e.name,passRate:e.passRate})}))))}var X=n("wd/R"),Z=n.n(X),G=a.a.createElement;function Q(e){var t=e.children;return G(g.Thead,null,G(g.Tr,null,t))}var V=a.a.createElement;function $(e){var t=e.children;return V(g.Td,{w:"73px"},t)}var ee=a.a.createElement;function te(e){var t=e.children;return ee(g.Td,{maxW:"0",isTruncated:!0},t)}var ne=a.a.createElement;function re(e){var t=e.children;return ne(g.Td,{w:{base:"100px",sm:"150px",md:"200px"},textAlign:"right"},t)}var ae=n("zHD3"),ce=a.a.createElement;function le(e){var t=e.children,n=e.href;return ce(ae.a,{href:n,color:"brightOrange.900",isExternal:!0},t)}var ie=a.a.createElement,ue=function(e){var t=e.children;return ie(g,null,t)},se=n("cBaE"),oe=a.a.createElement;function me(e){var t=e.dataSource,n=e.offset;return oe(ue,null,oe(Q,null,oe(g.Th,null,"#"),oe(g.Th,null,"URL"),oe(g.Th,{isNumeric:!0},"Last checkup date")),oe(g.Tbody,null,t.map((function(e,t){return oe(g.Tr,{key:t},oe($,null,n+t+1),oe(te,null,oe(le,{href:"/seo-audit/".concat(Object(se.b)(e.url))},e.url)),oe(re,null,Z.a.unix(e.c_at).format("MMM DD, YYYY")))}))))}var de=a.a.createElement,fe=!0;t.default=function(e){var t=e.metaTitle,n=e.metaDescription,r=e.title,a=e.overline,o=e.seoCheckups,m=e.offset,d=e.pageNumber;return de("div",null,de(c.d,{title:t,description:n}),de(c.c,null),de(c.a,null,de(c.a.Header,null,de(i.a,null,a),de(l.a,null,r)),de(s.a,null,de(J,null),de("div",null,de(me,{dataSource:o,offset:m}),de(j.Wrapper,null,de(u.b,{onClick:function(){window.location.href="/seo-checkups/".concat(d+1)}},"Load more"))))),de(c.b,null))}},du4W:function(e,t,n){"use strict";n.d(t,"a",(function(){return f})),n.d(t,"e",(function(){return h})),n.d(t,"b",(function(){return v})),n.d(t,"d",(function(){return b})),n.d(t,"f",(function(){return E})),n.d(t,"c",(function(){return y}));var r=n("q1tI"),a=n("sKyC"),c=n("4jWa"),l=n("CRla"),i=n("5+Am"),u=n("U6LL"),s=n("epLR"),o=n("pr4h");function m(){return(m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function d(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var f=Object(a.a)((e,t)=>{var n=Object(c.a)("Table",e),a=Object(l.b)(e),{className:o}=a,f=d(a,["className"]);return r.createElement(i.b,{value:n},r.createElement(u.a.table,m({role:"table",ref:t,__css:n.table,className:Object(s.c)("chakra-table",o)},f)))});o.a&&(f.displayName="Table");var p=Object(a.a)((e,t)=>{var{placement:n="bottom"}=e,a=d(e,["placement"]),c=Object(i.c)();return r.createElement(u.a.caption,m({},a,{ref:t,__css:m({},c.caption,{captionSide:n})}))});o.a&&(p.displayName="TableCaption");var h=Object(a.a)((e,t)=>{var n=Object(i.c)();return r.createElement(u.a.thead,m({},e,{ref:t,__css:n.thead}))}),v=Object(a.a)((e,t)=>{var n=Object(i.c)();return r.createElement(u.a.tbody,m({},e,{ref:t,__css:n.tbody}))}),b=Object(a.a)((e,t)=>{var{isNumeric:n}=e,a=d(e,["isNumeric"]),c=Object(i.c)();return r.createElement(u.a.th,m({},a,{ref:t,__css:c.th,"data-is-numeric":n}))}),E=Object(a.a)((e,t)=>{var n=Object(i.c)();return r.createElement(u.a.tr,m({role:"row"},e,{ref:t,__css:n.tr}))}),y=Object(a.a)((e,t)=>{var{isNumeric:n}=e,a=d(e,["isNumeric"]),c=Object(i.c)();return r.createElement(u.a.td,m({role:"gridcell"},a,{ref:t,__css:c.td,"data-is-numeric":n}))})},qOOK:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return i.a}));var r=n("v7Hm"),a=n("q1tI"),c=n.n(a).a.createElement;function l(e){var t=e.children;return c(r.a,{textStyle:"overline"},t)}var i=n("/zTt")},rElz:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/seo-checkups/[[...page]]",function(){return n("Hqhg")}])}},[["rElz",1,2,5,4,13,7,9,10,12,0,3,6,8,14]]]);