_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[30],{aurX:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/articles/category/[[...slugs]]",function(){return r("uBK1")}])},uBK1:function(e,t,r){"use strict";r.r(t),r.d(t,"__N_SSG",(function(){return K})),r.d(t,"default",(function(){return Y}));var n=r("wx14"),a=r("q1tI"),c=r.n(a),l=r("LSNp"),i=r("m/eG"),u=r("7e9e"),o=r("zHD3"),s=r("0SSZ"),d=c.a.createElement;var f=r("QoCZ"),g=r("wZsY"),v=c.a.createElement;var m=c.a.createElement;function p(e){var t=e.children;return m("div",null,t)}p.ListItem=function(e){var t=e.name,r=e.slug;return d(o.a,{href:"/articles/category/".concat(r,"/page/1"),color:"brightOrange.900",fontWeight:"700",w:"100%",d:"flex",alignItems:"center",justifyContent:"space-between",_hover:{textDecoration:"none"},_focus:{boxShadow:"none"}},t,d(s.a,{w:"24px",h:"24px",color:"darkAsh.500"}))},p.List=function(e){var t=e.children;return v(g.c,{divider:v(g.b,{borderColor:f.a.darkAsh[100]}),spacing:3,mt:6},t)};var h=p,b=r("WBSE"),E=r("VYqH"),w=r("F2j1"),_=c.a.createElement;function x(e){var t=e.children;return _(w.a,{gridTemplateColumns:{base:"1fr",lg:"2.25fr 1fr"},gridGap:{base:"16px",lg:"72px"}},t)}var A=r("v7Hm"),S=c.a.createElement;function k(e){var t=e.message;return S(A.a,{w:"100%",borderRadius:"md",color:"darkAsh.500",bg:"darkAsh.100",textAlign:"center",fontWeight:"700",padding:6},t)}var y=c.a.createElement;function N(e){var t=e.children;return y(g.a,{spacing:2},t)}var I=c.a.createElement;function L(e){var t=e.href,r=e.children,n=e.isActive;return I(o.a,{variant:n?"solid":"contrastBasic",size:"button",href:t},r)}var P=c.a.createElement,C=function(e,t){var r=!1;return e===t&&(r=!0),r};function T(e){var t=e.total,r=e.currentPage,n=e.baseSlug;if(t<=1)return null;var a=r<=t-2&&t>3;return P(N,null,r>2&&t>3&&P(L,{isActive:!1,href:"".concat(n,"/page/1")},"First page"),function(e,t){return 1===e?[1]:2===e?[1,2]:1===t?[t,t+1,t+2]:t===e?[t-2,t-1,t]:[t-1,t,t+1]}(t,r).map((function(e,t){return P(L,{key:t,isActive:C(r,e),href:"".concat(n,"/page/").concat(e)},e)})),a&&P(L,{isActive:!1,href:"".concat(n,"/page/").concat(t)},"Last page"))}var j=r("vG+z"),G=c.a.createElement;function R(e){var t=e.src,r=e.alt;return G(j.a,{src:t,alt:r,objectFit:"cover",w:"100%",h:"100%",borderRadius:"md"})}var B=c.a.createElement;function D(e){var t=e.children;return B(A.a,{w:"72px",h:"50px",border:"1px solid ".concat(f.a.darkAsh[300]),borderRadius:"md",bg:"white"},t)}var F=c.a.createElement;function H(e){var t=e.children;return F(A.a,{flex:"1",pl:"12px"},t)}var W=c.a.createElement;function X(e){var t=e.children,r=e.slug;return W(o.a,{href:"/articles/".concat(r),d:"flex",alignItems:"center",justifyContent:"space-around",mb:"12px",_hover:{textDecoration:"none"},_focus:{boxShadow:"none"}},t)}var z=c.a.createElement;function O(e){var t=e.children;return z(A.a,{mb:6},t)}var Z=c.a.createElement;function q(e){var t=e.articles;return Z(O,null,t.map((function(e,t){return Z(X,{key:t,slug:e.slug},Z(D,null,e.image&&Z(R,{src:e.image,alt:"article-image"})),Z(H,null,e.title))})))}var J=c.a.createElement,K=!0;function Y(e){var t=e.metaTitle,r=e.metaDescription,a=e.slug,c=e.title,o=e.paginatedArticles,s=e.featuredArticles,d=e.subcategories,f=e.articlesTotal,g=e.pageNumber;return J("div",null,J(i.d,{title:t,description:r}),J(i.c,null),J(i.a,null,J(i.a.Header,null,J(b.a,null,c)),J(E.a,null,J(x,null,J(u.a.Wrapper,null,o.length>0?o.map((function(e,t){return J(u.a.Preview,Object(n.a)({key:t},e))})):J(k,{message:"No articles found."}),J(T,{total:Math.ceil(f/l.c.ARTICLES_PER_PAGE),currentPage:parseInt(g),baseSlug:"/articles/category/".concat(a)})),J(h,null,s.length>0&&J(b.e,null,"Featured Articles"),J(q,{articles:s}),d.length>0&&J(b.e,null,"SEO topics"),J(h.List,null,d.map((function(e,t){return J(h.ListItem,{key:t,name:e.title,slug:e.slug})}))))))),J(i.b,null))}}},[["aurX",1,2,5,4,0,3,6,19]]]);