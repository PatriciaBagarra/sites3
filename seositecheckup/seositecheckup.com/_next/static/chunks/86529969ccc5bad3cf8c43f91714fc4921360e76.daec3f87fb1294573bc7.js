(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[16],{"7DRr":function(t,r,e){"use strict";e.d(r,"a",(function(){return N})),e.d(r,"b",(function(){return D}));var o=e("KQm4"),n=e("ANjH"),i=e("q1tI"),c=e.n(i),u=e("/MKj"),a=function(){return(a=Object.assign||function(t){for(var r,e=1,o=arguments.length;e<o;e++)for(var n in r=arguments[e])Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);return t}).apply(this,arguments)},s=function(t,r,e,o){return new(e||(e=Promise))((function(n,i){function c(t){try{a(o.next(t))}catch(r){i(r)}}function u(t){try{a(o.throw(t))}catch(r){i(r)}}function a(t){var r;t.done?n(t.value):(r=t.value,r instanceof e?r:new e((function(t){t(r)}))).then(c,u)}a((o=o.apply(t,r||[])).next())}))},_=function(t,r){var e,o,n,i,c={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"===typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;c;)try{if(e=1,o&&(n=2&i[0]?o.return:i[0]?o.throw||((n=o.return)&&n.call(o),0):o.next)&&!(n=n.call(o,i[1])).done)return n;switch(o=0,n&&(i=[2&i[0],n.value]),i[0]){case 0:case 1:n=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,o=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(n=(n=c.trys).length>0&&n[n.length-1])&&(6===i[0]||2===i[0])){c=0;continue}if(3===i[0]&&(!n||i[1]>n[0]&&i[1]<n[3])){c.label=i[1];break}if(6===i[0]&&c.label<n[1]){c.label=n[1],n=i;break}if(n&&c.label<n[2]){c.label=n[2],c.ops.push(i);break}n[2]&&c.ops.pop(),c.trys.pop();continue}i=r.call(t,c)}catch(u){i=[6,u],o=0}finally{e=n=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},p=function(t,r){var e={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&r.indexOf(o)<0&&(e[o]=t[o]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var n=0;for(o=Object.getOwnPropertySymbols(t);n<o.length;n++)r.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(t,o[n])&&(e[o[n]]=t[o[n]])}return e},l="__NEXT_REDUX_WRAPPER_HYDRATE__",d=function(){return"undefined"===typeof window},f=function(t,r){var e=(void 0===r?{}:r).deserializeState;return e?e(t):t},g=function(t,r){var e=(void 0===r?{}:r).serializeState;return e?e(t):t},b=function(t){var r=t.makeStore,e=t.context,o=function(t){return(void 0===t?{}:t).storeKey||"__NEXT_REDUX_WRAPPER_STORE__"}(t.config),n=function(){return r(e)};if(d()){var i=e,c=void 0;return i.req&&(c=i.req),i.ctx&&i.ctx.req&&(c=i.ctx.req),c?(c.__nextReduxWrapperStore||(c.__nextReduxWrapperStore=n()),c.__nextReduxWrapperStore):n()}return o in window||(window[o]=n()),window[o]},O=function(t,r){void 0===r&&(r={});var e=function(e){var o=e.callback,n=e.context,i=e.isApp,c=void 0!==i&&i;return s(void 0,void 0,void 0,(function(){var e,i,u,s;return _(this,(function(_){switch(_.label){case 0:return e=b({context:n,makeStore:t,config:r}),r.debug&&console.log("1. getProps created store with state",e.getState()),(u=o)?[4,o(a(a({},n),c?{ctx:a(a({},n.ctx),{store:e})}:{store:e}))]:[3,2];case 1:u=_.sent(),_.label=2;case 2:return i=u||{},r.debug&&console.log("3. getProps after dispatches has store state",e.getState()),s=e.getState(),[2,{initialProps:i,initialState:d()?g(s,r):s}]}}))}))},o=function(t){return function(r){return s(void 0,void 0,void 0,(function(){return _(this,(function(o){return r.store?(console.warn("No need to wrap pages if _app was wrapped"),[2,t(r)]):[2,e({callback:t,context:r})]}))}))}},n=function(t){return function(r){return s(void 0,void 0,void 0,(function(){return _(this,(function(o){switch(o.label){case 0:return[4,e({callback:t,context:r,isApp:!0})];case 1:return[2,o.sent()]}}))}))}},O=function(t){return function(r){return s(void 0,void 0,void 0,(function(){var o,n,i,c,u;return _(this,(function(s){switch(s.label){case 0:return[4,e({callback:t,context:r})];case 1:return o=s.sent(),n=o.initialProps,i=n.props,c=p(n,["props"]),u=p(o,["initialProps"]),[2,a(a({},c),{props:a(a({},u),i)})]}}))}))}};return{getServerSideProps:function(t){return function(r){return s(void 0,void 0,void 0,(function(){return _(this,(function(e){switch(e.label){case 0:return[4,O(t)(r)];case 1:return[2,e.sent()]}}))}))}},getStaticProps:O,withRedux:function(e){var d="withRedux("+(e.displayName||e.name||"Component")+")",g=function(o,n){var s,_=o.initialState,g=o.initialProps,O=p(o,["initialState","initialProps"]),v=Object(i.useRef)(!0),y=null===(s=null===O||void 0===O?void 0:O.pageProps)||void 0===s?void 0:s.initialState;r.debug&&console.log("4. WrappedApp created new store with",d,{initialState:_,initialStateFromGSPorGSSR:y});var S=Object(i.useRef)(b({makeStore:t,config:r,context:n})),m=Object(i.useCallback)((function(){_&&S.current.dispatch({type:l,payload:f(_,r)}),y&&S.current.dispatch({type:l,payload:f(y,r)})}),[y,_]);v.current&&m(),Object(i.useEffect)((function(){v.current?v.current=!1:m()}),[m]),g&&g.pageProps&&(O.pageProps=a(a({},g.pageProps),O.pageProps));var E=O;return y&&delete(E=a(a({},O),{pageProps:a({},O.pageProps)})).pageProps.initialState,c.a.createElement(u.a,{store:S.current},c.a.createElement(e,a({},g,E)))};return g.displayName=d,"getInitialProps"in e&&(g.getInitialProps=function(t){return s(void 0,void 0,void 0,(function(){var r;return _(this,(function(i){return r=e.getInitialProps,[2,(t.ctx?n(r):o(r))(t)]}))}))}),g}}};function v(t){return function(r){var e=r.dispatch,o=r.getState;return function(r){return function(n){return"function"===typeof n?n(e,o,t):r(n)}}}}var y=v();y.withExtraArgument=v;var S=y,m=e("rePB"),E=e("Ff2n"),w=e("OGtD");function j(t){var r=function(t,r){if("object"!==typeof t||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var o=e.call(t,r||"default");if("object"!==typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"===typeof r?r:String(r)}function P(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,o)}return e}function R(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?P(Object(e),!0).forEach((function(r){Object(m.a)(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):P(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}var T={network_activity:[],sections:{},report_in_progress:null,current_seo_audit:null,reports:{},seo_audit_error:null},k=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:T,r=arguments.length>1?arguments[1]:void 0;switch(r.type){case w.b.FETCH_SEO_AUDIT_IN_PROGRESS:return R(R({},t),{},{network_activity:[].concat(Object(o.a)(t.network_activity),["fetch_seo_audit_".concat(r.url)])});case w.b.FETCH_SEO_AUDIT_SUCCESS:return R(R({},t),{},{network_activity:t.network_activity.filter((function(t){return t!=="fetch_seo_audit_".concat(r.url)})),current_seo_audit:r.guid,reports:R(R({},t.reports),{},Object(m.a)({},r.guid,r.report))});case w.b.FETCH_SEO_AUDIT_FAILED:return R(R({},t),{},{network_activity:t.network_activity.filter((function(t){return t!=="fetch_seo_audit_".concat(r.url)})),current_seo_audit:null});case w.b.GET_ANALYSIS_REPORT_STRUCTURE_IN_PROGRESS:return R(R({},t),{},{network_activity:[].concat(Object(o.a)(t.network_activity),["categorized_sections"])});case w.b.GET_ANALYSIS_REPORT_STRUCTURE_SUCCESSFUL:return R(R({},t),{},{sections:r.analysis_general_structure,network_activity:t.network_activity.filter((function(t){return"categorized_sections"!==t}))});case w.b.GET_ANALYSIS_REPORT_STRUCTURE_FAILED:return R(R({},t),{},{network_activity:t.network_activity.filter((function(t){return"categorized_sections"!==t}))});case w.b.INIT_ANALYSIS_IN_PROGRESS:return R(R({},t),{},{report_in_progress:r.guid,reports:R(R({},t.reports),{},Object(m.a)({},r.guid,{url:r.url,status:"running",sections:r.sections,section_results:{},section_errors:[],network_activity:["generating report for ".concat(r.url)].concat(Object(o.a)(r.competitor_urls.map((function(t){return"generating report for ".concat(t)})))),competitor_urls:r.competitor_urls,competitors:{}}))});case w.b.INIT_ANALYSIS_SUCCESSFUL:var e=Object.keys(t.reports).reduce((function(e,o){return o!==r.temp_guid&&(e[o]=t.reports[o]),e}),{});return e[r.guid]=R(R({},t.reports[r.temp_guid]),{},{created_at:r.created_at}),R(R({},t),{},{report_in_progress:r.guid,reports:e});case w.b.CREATE_REPORT_SUCCESSFUL:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{sections:r.sections,is_suspicious:r.is_suspicious,network_activity:t.reports[r.guid].network_activity.filter((function(t){return t!=="generating report for ".concat(r.url)}))})))});case w.b.CREATE_REPORT_FAILED:var n=r.guid,i=t.reports,c=(i[n],Object(E.a)(i,[n].map(j)));return R(R({},t),{},{report_in_progress:null,reports:R({},c),seo_audit_error:!0});case w.b.GET_REPORT_SECTION_IN_PROGRESS:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{network_activity:[].concat(Object(o.a)(t.reports[r.guid].network_activity),["fetching ".concat(r.section_key," for ").concat(r.guid)])})))});case w.b.GET_REPORT_SECTION_SUCCESSFUL:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{section_results:R(R({},t.reports[r.guid].section_results),{},Object(m.a)({},r.section_key,r.section_result)),network_activity:t.reports[r.guid].network_activity.filter((function(t){return t!=="fetching ".concat(r.section_key," for ").concat(r.guid)}))})))});case w.b.GET_REPORT_SECTION_FAILED:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{section_errors:[].concat(Object(o.a)(t.reports[r.guid].section_errors),[r.section_key]),network_activity:t.reports[r.guid].network_activity.filter((function(t){return t!=="fetching ".concat(r.section_key," for ").concat(r.guid)}))})))});case w.b.GET_COMPETITOR_REPORT_SECTION_IN_PROGRESS:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.main_url_guid,R(R({},t.reports[r.main_url_guid]),{},{competitors:R(R({},t.reports[r.main_url_guid].competitors),{},Object(m.a)({},r.competitor_guid,R(R({},t.reports[r.main_url_guid].competitors[r.competitor_guid]),{},{network_activity:[].concat(Object(o.a)(t.reports[r.main_url_guid].competitors[r.competitor_guid].network_activity),["fetching ".concat(r.section_key," for ").concat(r.competitor_url)])})))})))});case w.b.GET_COMPETITOR_REPORT_SECTION_SUCCESSFUL:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.main_url_guid,R(R({},t.reports[r.main_url_guid]),{},{competitors:R(R({},t.reports[r.main_url_guid].competitors),{},Object(m.a)({},r.competitor_guid,R(R({},t.reports[r.main_url_guid].competitors[r.competitor_guid]),{},{section_results:R(R({},t.reports[r.main_url_guid].competitors[r.competitor_guid].section_results),{},Object(m.a)({},r.section_key,r.section_result)),network_activity:t.reports[r.main_url_guid].competitors[r.competitor_guid].network_activity.filter((function(t){return t!=="fetching ".concat(r.section_key," for ").concat(r.competitor_url)}))})))})))});case w.b.GET_COMPETITOR_REPORT_SECTION_FAILED:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.main_url_guid,R(R({},t.reports[r.main_url_guid]),{},{competitors:R(R({},t.reports[r.main_url_guid].competitors),{},Object(m.a)({},r.competitor_guid,R(R({},t.reports[r.main_url_guid].competitors[r.competitor_guid]),{},{section_errors:[].concat(Object(o.a)(t.reports[r.main_url_guid].competitors[r.competitor_guid].section_errors),[r.section_key]),network_activity:t.reports[r.main_url_guid].competitors[r.competitor_guid].network_activity.filter((function(t){return t!=="fetching ".concat(r.section_key," for ").concat(r.competitor_url)}))})))})))});case w.b.ADD_INFO_FOR_RESTRICTED_SECTION:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.reportGuid,R(R({},t.reports[r.reportGuid]),{},{section_results:R(R({},t.reports[r.reportGuid].section_results),{},Object(m.a)({},r.key,r.info))})))});case w.b.SAVE_SEO_AUDIT_IN_PROGRESS:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{network_activity:[].concat(Object(o.a)(t.reports[r.guid].network_activity),["save_seo_audit_".concat(r.guid)])})))});case w.b.SAVE_SEO_AUDIT_SUCCESSFUL:case w.b.SAVE_SEO_AUDIT_FAILED:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.guid,R(R({},t.reports[r.guid]),{},{network_activity:t.reports[r.guid].network_activity.filter((function(t){return t!=="save_seo_audit_".concat(r.guid)}))})))});case w.b.INIT_SEO_AUDIT_STATE:return R(R({},t),{},{report_in_progress:r.guid,current_seo_audit:r.guid,reports:R(R({},t.reports),{},Object(m.a)({},r.guid,{url:r.url,status:"running",sections:r.sections,section_results:{},section_errors:[],network_activity:[],competitor_urls:r.competitor_urls,competitors:{},created_at:r.created_at}))});case w.b.CREATE_COMPETITOR_REPORT_SUCCESSFUL:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.main_url_guid,R(R({},t.reports[r.main_url_guid]),{},{network_activity:t.reports[r.main_url_guid].network_activity.filter((function(t){return t!=="generating report for ".concat(r.competitor_url)})),competitors:R(R({},t.reports[r.main_url_guid].competitors),{},Object(m.a)({},r.competitor_guid,{url:r.competitor_url,section_results:{},section_errors:[],network_activity:[]}))})))});case w.b.CREATE_COMPETITOR_REPORT_FAILED:return R(R({},t),{},{reports:R(R({},t.reports),{},Object(m.a)({},r.main_url_guid,R(R({},t.reports[r.main_url_guid]),{},{network_activity:t.reports[r.main_url_guid].network_activity.filter((function(t){return t!=="generating report for ".concat(r.competitor_url)})),competitor_urls:t.reports[r.main_url_guid].competitor_urls.filter((function(t){return t!==r.competitor_url}))})))});default:return T}};function h(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,o)}return e}function I(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?h(Object(e),!0).forEach((function(r){Object(m.a)(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):h(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}var A=Object(n.c)({analysis:k}),C=function(t,r){return r.type===l?I(I({},t),r.payload):A(t,r)},N=function(){return Object(n.d)(C,(t=[S],n.a.apply(void 0,Object(o.a)(t))));var t},D=O(N)}}]);