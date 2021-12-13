var InteractApp=function(){this.host=this.host||"quiz.tryinteract.com",this.height="800",this.width="800",this.auto_resize=!0,this.frameUrl="",this.footer=this.footer||"hide",this.initializeComplete=!1,this.initialize=function(t){for(var i in t)this[i]=t[i];this.key=this.ref?this.ref:this.appId+""+Math.floor(1e6*Math.random()),this.generateFrameUrl(),!1===this.initializeComplete&&(this.addEvent(window,"message",this.messageListener.bind(this)),this.initializeDone=!0)},this.generateFrameUrl=function(){var t="https://"+this.host+"/#/";t+=this.preview?"preview/":"",t+=this.template?"preview/template/":"",t+=this.transcript?"preview/transcript/":"",t+=this.appId?this.appId:"",t+=(this.no_cover?"/q/1":"")+"?embed="+this.key,t+=this.mobile?"&mobile=1":"",t+=this.redirect_host?"&redirect_host=1":"",t+=this.auto_resize?"&auto_resize=1":"",t+="&origin="+encodeURIComponent(window.location.origin?window.location.origin:window.location.origin?window.location.origin:window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""));for(var i in this.user)t+="&user."+i+"="+encodeURIComponent(this.user[i]);this.frameUrl=t},this.messageListener=function(t){if(t.origin=="https://"+this.host){var i=t.data.length?t.data.split("|"):[],e=3===i.length&&i[1]===this.key,r=!!document.getElementById("interactApp"+this.key);e&&r&&("redirectHost"===i[0]&&this.redirect(i[2]||null),"resizeHeight"===i[0]&&this.resizeHeight(i[2]||null))}},this.redirect=function(t){if(!t)return null;window.location.href=t},this.resizeHeight=function(t){if(!this.auto_resize)return null;var i=document.getElementById("interact-"+(this.ref?this.ref:this.appId)),e=document.getElementById("interactApp"+this.key);e.height=t,e.style.height=t+"px";var r=i.getBoundingClientRect();if(r.top<0)if("scrollBehavior"in document.documentElement.style)window.scrollTo(0,window.scrollY+r.top);else{var s=document.scrollingElement||document.documentElement;s.scrollTop=s.scrollTop+r.top}},this.generateFrame=function(){var t=this.aspect_ratio?'<div class="interact_responsive_padding" style="padding:'+this.aspect_ratio+' 0 0 0;position:relative;margin-bottom:5px;"><div class="interact_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">':"";return t+='<iframe id="interactApp'+this.key+'" name="'+this.key+'" class="interact-app-container" height="'+(this.aspect_ratio?"100%":"100%"==this.height?"100%":this.height+"px")+'" allowTransparency="true" frameborder="0" style="width:'+(this.aspect_ratio?"100%":this.width+"px")+";border:none;max-width:100%;margin:0;"+(this.auto_resize?"-webkit-transition: all 300ms cubic-bezier(0.190, 1.000, 0.220, 1.000);transition: all 300ms cubic-bezier(0.190, 1.000, 0.220, 1.000);":"")+'"src="'+this.frameUrl+'"><a href="'+this.frameUrl+'" title="Interact Quiz">Take my quiz!</a></iframe>',t+=this.aspect_ratio?"</div></div>":"",t+="giveaway.tryinteract.com"===this.host&&"show"==this.footer?'<div class="interact_footer" style="display:block;font-size:11px;color:#666;">Powered by <a href="https://www.tryinteract.com/?utm_source=Powered%20By%20Link" target="_blank"><img src="https://quiz.tryinteract.com/img/logo.svg" width="67" height="16" style="vertical-align:middle;"></a></div>':""},this.display=function(){1==this.async?document.getElementById("interact-"+(this.ref?this.ref:this.appId)).innerHTML=this.generateFrame():document.write(this.generateFrame())},this.addEvent=function(t,i,e){t.attachEvent?(t["e"+i+e]=e,t[i+e]=function(){t["e"+i+e](window.event)},t.attachEvent("on"+i,t[i+e])):t.addEventListener(i,e)}};