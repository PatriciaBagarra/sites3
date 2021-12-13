/////////////////////////////////////////////////////////////////////
//init
if (price_nullcut_disable==undefined) var price_nullcut_disable=0;
if (price_decimal_sup==undefined) var price_decimal_sup=0;
if (typeof google_analytics==undefined) var google_analytics=0;
if (typeof google_tagmanager==undefined) var google_tagmanager=0;
if (typeof facebook_pixel==undefined) var facebook_pixel=0;


/////////////////////////////////////////////////////////////////////
//ieupdate
function embedObject(script_file,script_width,script_height) {
    document.write('<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" width=\"'+script_width+'\" height=\"'+script_height+'\" id=\"head_menu\">' +
        '		  <param name=\"movie\" value=\"'+script_file+'\">' +
        '          <param name=\"quality\" value=\"high\">' +
        '          <param name=\"wmode\" value=\"opaque\">' +
        '          <embed src=\"'+script_file+'\" quality=\"high\" wmode=\"opaque\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width=\"'+script_width+'\" height=\"'+script_height+'\"></embed>' +
        '        </object>');

}

function embedObject_trans(script_file,script_width,script_height) {
    document.write('<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" width=\"'+script_width+'\" height=\"'+script_height+'\" id=\"head_menu\">' +
        '		  <param name=\"movie\" value=\"'+script_file+'\">' +
        '          <param name=\"quality\" value=\"high\">' +
        '          <param name=\"wmode\" value=\"transparent\">' +
        '          <embed src=\"'+script_file+'\" quality=\"high\"  wmode=\"transparent\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width=\"'+script_width+'\" height=\"'+script_height+'\"></embed>' +
        '        </object>');

}

/////////////////////////////////////////////////////////////////////
//tinymce media embed
function writeFlash(p) {
    writeEmbed(
        'D27CDB6E-AE6D-11cf-96B8-444553540000',
        'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
        'application/x-shockwave-flash',
        p
    );
}

function writeShockWave(p) {
    writeEmbed(
        '166B1BCA-3F9C-11CF-8075-444553540000',
        'http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0',
        'application/x-director',
        p
    );
}

function writeQuickTime(p) {
    writeEmbed(
        '02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
        'http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0',
        'video/quicktime',
        p
    );
}

function writeRealMedia(p) {
    writeEmbed(
        'CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA',
        'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
        'audio/x-pn-realaudio-plugin',
        p
    );
}

function writeWindowsMedia(p) {
    p.url = p.src;
    writeEmbed(
        '6BF52A52-394A-11D3-B153-00C04F79FAA6',
        'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701',
        'application/x-mplayer2',
        p
    );
}

function writeEmbed(cls, cb, mt, p) {
    var h = '', n;

    h += '<object classid="clsid:' + cls + '" codebase="' + cb + '"';
    h += typeof(p.id) != "undefined" ? 'id="' + p.id + '"' : '';
    h += typeof(p.name) != "undefined" ? 'name="' + p.name + '"' : '';
    h += typeof(p.width) != "undefined" ? 'width="' + p.width + '"' : '';
    h += typeof(p.height) != "undefined" ? 'height="' + p.height + '"' : '';
    h += typeof(p.align) != "undefined" ? 'align="' + p.align + '"' : '';
    h += '>';

    for (n in p)
        h += '<param name="' + n + '" value="' + p[n] + '">';

    h += '<param name="wmode" value="opaque">';
    h += '<embed type="' + mt + '"';

    for (n in p)
        h += n + '="' + p[n] + '" ';

    h += 'wmode="opaque" ';
    h += '></embed></object>';

    document.write(h);
}

/////////////////////////////////////////////////////////////////////
//get_product_sku
function get_product_sku(temp_object) {
    var temp_sku_return=temp_object.attr("data-sku");

    if (temp_sku_return=="") {
        var temp_sku = temp_object.attr("class").split(" ");
        temp_sku.forEach(function(temp_sku_val){
            if (temp_sku_val.indexOf("product_sku_")!=-1) {
                temp_sku_return=temp_sku_val.replace("product_sku_","");
            }
        });
    }

    return temp_sku_return;
}

/////////////////////////////////////////////////////////////////////
//facebook_event
function facebook_event(event,cart,event_id) {
    fbq('track', event, cart, event_id);
}

/////////////////////////////////////////////////////////////////////
//
function location_href_with_get(get_param) {
    return_url=location.href;
    if (get_param!==undefined && get_param!=="") {
        if (return_url.indexOf("?")===-1) {
            return_url=return_url+"?";
        } else {
            return_url=return_url+"&";
        }
        return_url=return_url+get_param;
    }
    return return_url;
}

/////////////////////////////////////////////////////////////////////
//popup
var allow_shop_popup=true;
var popup_open = false;

(function($) {
    var ajax = null;
    var popup_id = null;

    $.shop_popup = function(method,options) {
        if (method=="open") {
            var settings = $.extend({
                ajax_url: null,
                ajax_data: null,
                ajax_loader: true,
                iframe_url: null,
                width: null,
                height: null,
                minWidth: null,
                minHeight: null,
                offsetWidth: null,
                offsetHeight: null,
                offsetMaxWidth: -70,
                offsetMinHeight: -70,
                top: null,
                left: null,
                overflow: "hidden",
                close: true,
                closeEsc: null,
                closeClick: null,
                modal:0,
                id:"PopupContainer",
                class:"",
                contentId:null,
                popupId:'common',
                onLoad:null,
                onForbidden:null,
                onClose:null
            }, options);

            if (allow_shop_popup==false) {
                if($.isFunction(settings.onForbidden)) settings.onForbidden.apply();
                return;
            }

            /////////////////////////////////////////////
            ////setting
            popup_id=settings.id;

            if ($('#page_'+settings.id).length==0) {
                if (unas_design_ver>=3) {
                    var container = $('<div id="page_'+settings.id+'" class="'+settings.class+'" style="z-index:10000;"><div id="page_'+settings.id+'_inner"></div></div>');
                } else {
                    var container = $('<div id="page_'+settings.id+'" class="bg_color_dark3 '+settings.class+'" style="z-index:10000;"><div id="page_'+settings.id+'_inner" class="bg_color_light2"></div></div>');
                }
                $('body').append(container);

                $("#page_"+settings.id).overlay({
                    load: false
                });
            } else {
                if (unas_design_ver<3) {
					$('#page_'+settings.id).attr("class","bg_color_dark3");
				} else {
					$('#page_'+settings.id).attr("class","");
				}
                if (settings.class!="") $('#page_'+settings.id).addClass(settings.class);
            }

            $('#page_'+settings.id).css("display","none");
            if (settings.ajax_url!=null) $('#page_'+settings.id+'_inner').html('<div id="page_'+settings.id+'_ajax"></div>');

            if (settings.overflow!="" && settings.overflow!=null) $('#page_'+settings.id+'_inner').css("overflow",settings.overflow);

            /////////////////////////////////////////////
            ////content
            if (settings.ajax_url!=null && settings.ajax_url!='no') {
                if (ajax) {
                    ajax.abort();
                    ajax = null;
                }

                ajax = $.ajax({
                    type: 'GET',
                    url: settings.ajax_url,
                    data: settings.ajax_data,
                    success: function(data) {
                        $('#page_'+settings.id+'_inner').html(data);
                        if(typeof input_checkbox_alter !== 'undefined' && $.isFunction(input_checkbox_alter)) input_checkbox_alter();
                        if (settings.ajax_loader==false) {
                            if (data!="") {
                                $('#page_'+settings.id).css("display","block");
                                $.shop_popup("load",settings);
                                if (settings.width=="content" || settings.height=="content") {
                                    $.shop_popup("size",settings);
                                }
                            } else {
                                if($.isFunction(settings.onClose)) settings.onClose.apply();

                                popup_open=false;
                                popupCloseTrigger(popup_id);
                            }
                        } else {
                            $('#page_'+settings.id).css("display","block");
                            if (settings.width=="content" || settings.height=="content") {
                                $.shop_popup("size",settings);
                            }
                        }

                        var temp_popup_array = {};
                        temp_popup_array['popupId']=settings['popupId'];
                        $(document).trigger("popupContentLoaded", temp_popup_array);

                        popup_open=true;
                    }
                });
            } else if (settings.iframe_url!=null) {
                if (unas_design_ver>=3) {
                    $('#page_'+settings.id+'_inner').html('<iframe style="position:relative;" src="'+settings.iframe_url+'" id="page_'+settings.id+'_iframe" width="'+(settings.width-10)+'" height="'+(settings.height-10)+'" frameborder="0" marginwidth="0" marginheight="0" allowtransparency="true"></iframe>');
                } else {
                    $('#page_'+settings.id+'_inner').html('<iframe style="position:relative; top:-10px; left:-10px;" src="'+settings.iframe_url+'" id="page_'+settings.id+'_iframe" width="'+(settings.width-10)+'" height="'+(settings.height-10)+'" frameborder="0" marginwidth="0" marginheight="0" allowtransparency="true"></iframe>');
                }
            }

            if (settings.ajax_url!='no' && $('#page_'+settings.id).css("display")!="none") {
                //$('body').css("overflow","hidden");
            }
            if(typeof input_checkbox_alter !== 'undefined' && $.isFunction(input_checkbox_alter)) input_checkbox_alter();

            if (settings.ajax_loader==true || settings.ajax_url==null) {
                /////////////////////////////////////////////
                ////size
                var temp_settings_width=settings.width;
                var temp_settings_height=settings.height;
                if (settings.width=="content") settings.width=300;
                if (settings.height=="content") settings.height=300;
                $.shop_popup("size",settings);
                settings.width=temp_settings_width;
                settings.height=temp_settings_height;

                /////////////////////////////////////////////
                ////load
                $.shop_popup("load",settings);
            }
        }

        if (method=="load") {
            var settings = $.extend({
                ajax_url: null,
                ajax_data: null,
                ajax_loader: true,
                iframe_url: null,
                width: null,
                height: null,
                minWidth: null,
                minHeight: null,
                offsetWidth: null,
                offsetHeight: null,
                offsetMaxWidth: -70,
                offsetMinHeight: -70,
                top: null,
                left: null,
                overflow: "hidden",
                close: true,
                closeEsc: null,
                closeClick: null,
                modal:0,
                id:"PopupContainer",
                contentId:null,
                popupId:'common',
                onLoad:null,
                onForbidden:null,
                onClose:null
            }, options);

            if (unas_design_ver>=3) {
                settings.width=null;
                settings.height=null;
                settings.offsetWidth=null;
                settings.offsetHeight=null;
            }

            /////////////////////////////////////////////
            /////close
            if (settings.closeEsc==null) settings.closeEsc=settings.close;
            if (settings.closeClick==null) settings.closeClick=settings.close;

            /////////////////////////////////////////////
            ////load
            if (settings.modal!=0) {
                $(document).mask({
                    color: '#000000',
                    loadSpeed: 100,
                    opacity: settings.modal,
                    closeOnEsc:settings.closeEsc,
                    closeOnClick:settings.closeClick,
                    onBeforeClose: function(event) {
                        $('#page_'+settings.id).overlay().close();
                        if($.isFunction(settings.onClose)) settings.onClose.apply();
                        $('body').css("overflow","");

                        popup_open=false;
                        popupCloseTrigger(popup_id);
                    }
                });
            } else if (settings.closeClick) {
                $(document).click(function(e) {
                    if( e.target.id !== 'page_'+settings.id && !$('#page_'+settings.id).has(e.target).length) {
                        $('#page_'+settings.id).overlay().close();
                        $('#page_'+settings.id).css("display","none");
                        $('body').css("overflow","");
                    }
                });
            }

            $('#page_'+settings.id).overlay().getConf().closeOnEsc=settings.closeEsc;
            $('#page_'+settings.id).overlay().getConf().closeOnClick=settings.closeClick;

            $('#page_'+settings.id).overlay().load();

            //$('#page_'+settings.id).css("left",Math.ceil(($(window).width()-$('#page_'+settings.id).width()) / 2)+"px");
            $('#page_'+settings.id).css("left","50%");
            $('#page_'+settings.id).css("top","50%");
            $('#page_'+settings.id).css("transform","translate(-50%,-50%)");

            var temp_popup_array = {};
            temp_popup_array['popupId']=settings['popupId'];
            $(document).trigger("popupOpen", temp_popup_array);
        }

        if (method=="size") {
            var size_settings = $.extend({
                ajax_url: null,
                ajax_data: null,
                ajax_loader: true,
                iframe_url: null,
                width: null,
                height: null,
                minWidth: null,
                minHeight: null,
                offsetWidth: null,
                offsetHeight: null,
                offsetMaxWidth: -70,
                offsetMinHeight: -70,
                top: null,
                left: null,
                overflow: "hidden",
                close: true,
                modal:0,
                id:"PopupContainer",
                contentId:null,
                popupId:'common'
            }, options);

            if (unas_design_ver>=3) {
                size_settings.width=null;
                size_settings.height=null;
                size_settings.offsetWidth=null;
                size_settings.offsetHeight=null;
            }

            if (size_settings.width=="max" || size_settings.height=="max" || size_settings.width=="content" || size_settings.height=="content") {
                var maxWidth = 0, maxHeight = 0;
                if( typeof( window.innerWidth ) == 'number' ) {
                    //Non-IE
                    maxWidth = window.innerWidth;
                    maxHeight = window.innerHeight;
                } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                    //IE 6+ in 'standards compliant mode'
                    maxWidth = document.documentElement.clientWidth;
                    maxHeight = document.documentElement.clientHeight;
                } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                    //IE 4 compatible
                    maxWidth = document.body.clientWidth;
                    maxHeight = document.body.clientHeight;
                }
                maxWidth=maxWidth+size_settings.offsetMaxWidth;
                maxHeight=maxHeight+size_settings.offsetMinHeight;
            }
            if (size_settings.width=="max") size_settings.width=maxWidth;
            if (size_settings.height=="max") size_settings.height=maxHeight;

            //content
            if (size_settings.width=="content" || size_settings.height=="content") {
                if (size_settings.contentId==null) size_settings.contentId='page_'+size_settings.id+'_content';
            }
            if (size_settings.width=="content") {
                if (size_settings.offsetWidth==null) size_settings.offsetWidth=0;
                size_settings.width=Math.round(($('#'+size_settings.contentId).width()+49+size_settings.offsetWidth)/2)*2;
                if (size_settings.width>maxWidth) size_settings.width=maxWidth;
            }
            if (size_settings.height=="content") {
                if (size_settings.offsetHeight==null) size_settings.offsetHeight=0;
                size_settings.height=Math.round(($('#'+size_settings.contentId).height()+129+size_settings.offsetHeight)/2)*2;
                if (size_settings.height>maxHeight) size_settings.height=maxHeight;
            }

            //min
            if (size_settings.minWidth!=null && size_settings.width!=null) {
                if (size_settings.width<size_settings.minWidth) size_settings.width=size_settings.minWidth;
            }
            if (size_settings.minHeight!=null && size_settings.height!=null) {
                if (size_settings.height<size_settings.minHeight) size_settings.height=size_settings.minHeight;
            }

            //set
            if (size_settings.width!=null) {
                $('#page_'+size_settings.id).css("width",size_settings.width+"px");
                $('#page_'+size_settings.id+'_inner').css("width",(size_settings.width-30)+"px");
                if (size_settings.ajax_url!=null) $('#page_'+size_settings.id+'_ajax').css("width",(size_settings.width-50)+"px");
            }
            if (size_settings.height!=null) {
                $('#page_'+size_settings.id).css("height",size_settings.height);
                $('#page_'+size_settings.id+'_inner').css("height",(size_settings.height-30)+"px");
                if (size_settings.ajax_url!=null) $('#page_'+size_settings.id+'_ajax').css("height",(size_settings.height-50)+"px");
            }

            if (size_settings.left==null) {
                //$('#page_'+size_settings.id).css("left",Math.ceil(($(window).width()-$('#page_'+size_settings.id).width()) / 2)+"px");
                $('#page_'+size_settings.id).css("left","50%");
                $('#page_'+size_settings.id).css("transform","translateX(-50%)");
            } else {
                $('#page_'+size_settings.id).css("left",size_settings.left+"px");
                $('#page_'+size_settings.id).css("transform","");
            }
            if (size_settings.top==null) {
                //$('#page_'+size_settings.id).css("top",Math.ceil(($(window).height()-$('#page_'+size_settings.id).height()) / 2)+"px");
                $('#page_'+size_settings.id).css("top","50%");
                if (size_settings.left==null) {
                    $('#page_'+size_settings.id).css("transform","translate(-50%,-50%)");
                } else {
                    $('#page_'+size_settings.id).css("transform","translateY(-50%)");
                }
            } else {
                $('#page_'+size_settings.id).css("top",size_settings.top+"px");
                if (size_settings.left!=null) $('#page_'+size_settings.id).css("transform","");
            }

            if($.isFunction(size_settings.onLoad)) size_settings.onLoad.apply();

            //alert('#'+size_settings.contentId+": "+$('#'+size_settings.contentId).width());
            //alert(size_settings.width+"x"+settings.height);
            //alert($('#page_crossup_content').width());
        }

        if (method=="close") {
            $('#page_'+popup_id).overlay().close();
			$('#page_'+popup_id).css("display","none");
            $.mask.close();
            $('body').css("overflow","");

            popup_open=false;

            popupCloseTrigger(popup_id);
        }

        $("[id^='page_PopupContainer'] .close").click(function(){
            $('#page_'+popup_id).overlay().close();
			$('#page_'+popup_id).css("display","none");
            $.mask.close();
            $('body').css("overflow","");

            popup_open=false;
            popupCloseTrigger(popup_id);
        });

    }
})(jQuery);

/////////////////////////////////////////////////////////////////////
//select
var egyeb_ar1_netto=new Array();
var egyeb_ar1_brutto=new Array();
var egyeb_ar2_netto=new Array();
var egyeb_ar2_brutto=new Array();
var egyeb_ar3_netto=new Array();
var egyeb_ar3_brutto=new Array();
var egyeb_ar1_orig_netto=new Array();
var egyeb_ar1_orig_brutto=new Array();
var egyeb_ar2_orig_netto=new Array();
var egyeb_ar2_orig_brutto=new Array();
var egyeb_ar3_orig_netto=new Array();
var egyeb_ar3_orig_brutto=new Array();

var price_shop_netto=new Array();
var price_shop_brutto=new Array();
var price_net_netto=new Array();
var price_net_brutto=new Array();
var price_net_afa=new Array();
var price_akcio_netto=new Array();
var price_akcio_brutto=new Array();
var price_akcio_afa=new Array();
var price_unit_netto=new Array();
var price_unit_brutto=new Array();
var price_unit_div=new Array();

var price_net_akt=0;
var price_akcio_akt=0;
var price_save=0;

var page_artdet;
var price_kedv=new Array();
var price_kedv_netto=new Array();
var percent_kedv=new Array();
var kedv_num=-1;

function select_base_price(cikk,artdet) {
    egyeb_ar1_netto[cikk]=new Array();
    egyeb_ar1_brutto[cikk]=new Array();
    egyeb_ar2_netto[cikk]=new Array();
    egyeb_ar2_brutto[cikk]=new Array();
    egyeb_ar3_netto[cikk]=new Array();
    egyeb_ar3_brutto[cikk]=new Array();
    egyeb_ar1_orig_netto[cikk]=new Array();
    egyeb_ar1_orig_brutto[cikk]=new Array();
    egyeb_ar2_orig_netto[cikk]=new Array();
    egyeb_ar2_orig_brutto[cikk]=new Array();
    egyeb_ar3_orig_netto[cikk]=new Array();
    egyeb_ar3_orig_brutto[cikk]=new Array();

    if (money_thousend=="") money_thousend=" ";
    if (money_dec=="") money_dec=",";

    if (money_thousend==".") {
        var re_thousend = /\./g;
    } else {
        var re_thousend = new RegExp(money_thousend, "g");
    }
    if (money_dec==".") {
        var re_dec = new RegExp("---unas---", "g");
    } else {
        var re_dec = new RegExp(money_dec, "g");
    }

    if ($(".price_shop_netto_"+cikk).length > 0 ) price_shop_netto[cikk]=parseFloat($(".price_shop_netto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_shop_brutto_"+cikk).length > 0 ) price_shop_brutto[cikk]=parseFloat($(".price_shop_brutto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_net_netto_"+cikk).length > 0 ) price_net_netto[cikk]=parseFloat($(".price_net_netto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_net_brutto_"+cikk).length > 0 ) price_net_brutto[cikk]=parseFloat($(".price_net_brutto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_net_afa_"+cikk).length > 0 ) price_net_afa[cikk]=parseFloat($(".price_net_afa_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_akcio_netto_"+cikk).length > 0 ) price_akcio_netto[cikk]=parseFloat($(".price_akcio_netto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_akcio_brutto_"+cikk).length > 0 ) price_akcio_brutto[cikk]=parseFloat($(".price_akcio_brutto_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    if ($(".price_akcio_afa_"+cikk).length > 0 ) price_akcio_afa[cikk]=parseFloat($(".price_akcio_afa_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));

    if ($("#price_unit_div_"+cikk).length > 0 ) price_unit_div[cikk]=parseFloat($("#price_unit_div_"+cikk).html().replace(re_thousend,'').replace(re_dec,'.'));
    price_unit_brutto[cikk]=price_shop_brutto[cikk];
    price_unit_netto[cikk]=price_shop_netto[cikk];
    if (price_net_brutto[cikk]>0) {
        price_unit_brutto[cikk]=price_net_brutto[cikk];
        price_unit_netto[cikk]=price_net_netto[cikk];
    }
    if (price_akcio_brutto[cikk]>0) {
        price_unit_brutto[cikk]=price_akcio_brutto[cikk];
        price_unit_netto[cikk]=price_akcio_netto[cikk];
    }

    if (artdet==1) {
        do {
            kedv_num=kedv_num+1;
            if ($("#price_kedv_" + cikk + "_" +kedv_num).length > 0 || $("#price_kedv_netto_" + cikk + "_" +kedv_num).length > 0) {
                if ($("#price_kedv_" + cikk + "_" +kedv_num).length > 0) price_kedv[kedv_num]=parseFloat($("#price_kedv_" + cikk + "_" +kedv_num).html().replace(re_thousend,'').replace(re_dec,'.'));
                if ($("#price_kedv_netto_" + cikk + "_" +kedv_num).length > 0) price_kedv_netto[kedv_num]=parseFloat($("#price_kedv_netto_" + cikk + "_" +kedv_num).html().replace(re_thousend,'').replace(re_dec,'.'));
            } else {
                kedv_num=kedv_num-1;
                break;
            }
        } while(true);
        page_artdet=1;
    } else {
        page_artdet=0;
    }
}

function number_format( number, decimals, dec_point, thousands_sep ) {
    var n = number, prec = decimals;
    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep == "undefined") ? ',' : thousands_sep;
    var dec = (typeof dec_point == "undefined") ? '.' : dec_point;

    var s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toFixed(prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

    var abs = Math.abs(n).toFixed(prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0,i + (n < 0)) +
            _[0].slice(i).replace(/(\d{3})/g, sep+'$1');
        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }

    if (price_decimal_sup==1) price_nullcut_disable=1;
    if (decimals>0 && price_nullcut_disable!=1) s=s.replace(/0*$/, '');

    if (price_decimal_sup==1) {
        if (s.indexOf(dec_point)) {
            s=s.replace(dec_point,'<sup>')+'</sup>';
        }
    }

    if (s[s.length-1]==dec) s=s.substr(0,s.length-1);

    return s;
}

function unas_number_format( number, decimals, dec_point, thousands_sep ) {
    var n = number, prec = decimals;
    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep == "undefined") ? ',' : thousands_sep;
    var dec = (typeof dec_point == "undefined") ? '.' : dec_point;

    var s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toFixed(prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

    var abs = Math.abs(n).toFixed(prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0,i + (n < 0)) +
            _[0].slice(i).replace(/(\d{3})/g, sep+'$1');
        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }

    if (price_decimal_sup==1) price_nullcut_disable=1;
    if (decimals>0 && price_nullcut_disable!=1) s=s.replace(/0*$/, '');

    if (price_decimal_sup==1) {
        if (s.indexOf(dec_point)) {
            s=s.replace(dec_point,'<sup>')+'</sup>';
        }
    }

    if (s[s.length-1]==dec) s=s.substr(0,s.length-1);

    return s;
}

function change_price(cikk,orig,type,result,value) {
    //alert(result.indexOf("_net_"));
    if (result.indexOf("_net_")!=-1) {
        if (type=='netto') {
            temp_ar1=egyeb_ar1_orig_netto[cikk];
            temp_ar2=egyeb_ar2_orig_netto[cikk];
            temp_ar3=egyeb_ar3_orig_netto[cikk];
        } else if (type=='afa') {
            temp_ar1=new Array();
            egyeb_ar1_orig_brutto[cikk].forEach(function(item, index){
                temp_ar1[index]=egyeb_ar1_orig_brutto[cikk][index]-egyeb_ar1_orig_netto[cikk][index];
            });
            temp_ar2=new Array();
            egyeb_ar2_orig_brutto[cikk].forEach(function(item, index){
                temp_ar2[index]=egyeb_ar2_orig_brutto[cikk][index]-egyeb_ar2_orig_netto[cikk][index];
            });
            temp_ar3=new Array();
            egyeb_ar3_orig_brutto[cikk].forEach(function(item, index){
                temp_ar3[index]=egyeb_ar3_orig_brutto[cikk][index]-egyeb_ar3_orig_netto[cikk][index];
            });
        } else {
            temp_ar1=egyeb_ar1_orig_brutto[cikk];
            temp_ar2=egyeb_ar2_orig_brutto[cikk];
            temp_ar3=egyeb_ar3_orig_brutto[cikk];
        }
    } else {
        if (type=='netto') {
            temp_ar1=egyeb_ar1_netto[cikk];
            temp_ar2=egyeb_ar2_netto[cikk];
            temp_ar3=egyeb_ar3_netto[cikk];
        } else if (type=='afa') {
            temp_ar1=new Array();
            egyeb_ar1_brutto[cikk].forEach(function(item, index){
                temp_ar1[index]=egyeb_ar1_brutto[cikk][index]-egyeb_ar1_netto[cikk][index];
            });
            temp_ar2=new Array();
            egyeb_ar2_brutto[cikk].forEach(function(item, index){
                temp_ar2[index]=egyeb_ar2_brutto[cikk][index]-egyeb_ar2_netto[cikk][index];
            });
            temp_ar3=new Array();
            egyeb_ar3_brutto[cikk].forEach(function(item, index){
                temp_ar3[index]=egyeb_ar3_brutto[cikk][index]-egyeb_ar3_netto[cikk][index];
            });
        } else {
            temp_ar1=egyeb_ar1_brutto[cikk];
            temp_ar2=egyeb_ar2_brutto[cikk];
            temp_ar3=egyeb_ar3_brutto[cikk];
        }
    }

    //console.log(type+": "+temp_ar1);

    var akt=orig;
    var percent2=(100-value)/100;
    if (jQuery.fn.jquery<'1.6.0') {
        if ($("#egyeb_list1_"+cikk).length > 0 ) akt=akt+(temp_ar1[$("#egyeb_list1_"+cikk).attr("selectedIndex")]*percent2);
        if ($("#egyeb_list2_"+cikk).length > 0 ) akt=akt+(temp_ar2[$("#egyeb_list2_"+cikk).attr("selectedIndex")]*percent2);
        if ($("#egyeb_list3_"+cikk).length > 0 ) akt=akt+(temp_ar3[$("#egyeb_list3_"+cikk).attr("selectedIndex")]*percent2);
    } else {
        if ($("#egyeb_list1_"+cikk).length > 0 ) akt=akt+(temp_ar1[$("#egyeb_list1_"+cikk).prop("selectedIndex")]*percent2);
        if ($("#egyeb_list2_"+cikk).length > 0 ) akt=akt+(temp_ar2[$("#egyeb_list2_"+cikk).prop("selectedIndex")]*percent2);
        if ($("#egyeb_list3_"+cikk).length > 0 ) akt=akt+(temp_ar3[$("#egyeb_list3_"+cikk).prop("selectedIndex")]*percent2);
    }
    if (type!='netto') {
        if (type=='unit_brutto' && price_unit_div[cikk]>0) akt=akt/price_unit_div[cikk];
        if (type=='unit_netto' && price_unit_div[cikk]>0) akt=akt/price_unit_div[cikk];
    }
    if (akt>0) {
        $(result).html(unas_number_format(akt,money_len,money_dec,money_thousend));
        return akt;
    }
}

function change_egyeb(cikk) {
    if ($(".price_shop_netto_"+cikk).length > 0 ) change_price(cikk,price_shop_netto[cikk],'netto','.price_shop_netto_'+cikk,0);
    if ($(".price_shop_brutto_"+cikk).length > 0 ) change_price(cikk,price_shop_brutto[cikk],'brutto','.price_shop_brutto_'+cikk,0);

    if ($(".price_net_netto_"+cikk).length > 0 ) price_net_akt=change_price(cikk,price_net_netto[cikk],'netto','.price_net_netto_'+cikk,0);
    if ($(".price_net_brutto_"+cikk).length > 0 ) price_net_akt=change_price(cikk,price_net_brutto[cikk],'brutto','.price_net_brutto_'+cikk,0);
    if ($(".price_net_afa_"+cikk).length > 0 ) change_price(cikk,price_net_afa[cikk],'afa','.price_net_afa_'+cikk,0);

    if ($(".price_akcio_netto_"+cikk).length > 0 ) price_akcio_akt=change_price(cikk,price_akcio_netto[cikk],'netto','.price_akcio_netto_'+cikk,0);
    if ($(".price_akcio_brutto_"+cikk).length > 0 ) price_akcio_akt=change_price(cikk,price_akcio_brutto[cikk],'brutto','.price_akcio_brutto_'+cikk,0);
    if ($(".price_akcio_afa_"+cikk).length > 0 ) change_price(cikk,price_akcio_afa[cikk],'afa','.price_akcio_afa_'+cikk,0);

    if ($("#price_unit_brutto_"+cikk).length > 0 ) change_price(cikk,price_unit_brutto[cikk],'unit_brutto','#price_unit_brutto_'+cikk,0);
    if ($("#price_unit_netto_"+cikk).length > 0 ) change_price(cikk,price_unit_netto[cikk],'unit_netto','#price_unit_netto_'+cikk,0);


    /*if ($(".price_net_afa_"+cikk).length > 0 ) {
        var price_netto_normal=parseFloat($(".price_net_netto_"+cikk).text().replace(/ /g, ""));
        var price_brutto_normal=parseFloat($(".price_net_brutto_"+cikk).text().replace(/ /g, ""));
        var afa_normal=price_brutto_normal-price_netto_normal;
        afa_normal=unas_number_format(afa_normal,money_len,money_dec,money_thousend)
        $(".price_net_afa_"+cikk).html(afa_normal);
    }*/
    /*if ($(".price_akcio_afa_"+cikk).length > 0 ) {
        var price_netto_akcio=parseFloat($(".price_akcio_netto_"+cikk).text().replace(/ /g, ""));
        var price_brutto_akcio=parseFloat($(".price_akcio_brutto_"+cikk).text().replace(/ /g, ""));
        var afa_akcio=price_brutto_akcio-price_netto_akcio;
        afa_akcio=unas_number_format(afa_akcio,money_len,money_dec,money_thousend)
        $(".price_akcio_afa_"+cikk).html(afa_akcio);
    }*/


    for (i = 0; i <= kedv_num; i++) {
        if ($("#price_kedv_" + cikk + "_" + i).length > 0) change_price(cikk, price_kedv[i], 'brutto', '#price_kedv_' + cikk + "_" + i, percent_kedv[i]);
        if ($("#price_kedv_netto_" + cikk + "_" + i).length > 0) change_price(cikk, price_kedv_netto[i], 'netto', '#price_kedv_netto_' + cikk + "_" + i, percent_kedv[i]);
    }

    if (price_akcio_akt>0 && price_net_akt>0 && $("#price_save_"+cikk).length > 0) {
        price_save=100-Math.round(price_akcio_akt/price_net_akt*100);
        if (price_save>0) {
            if ($("#price_save_"+cikk).html().indexOf("%")!=-1) price_save=price_save+"%";
            $("#price_save_"+cikk).html(price_save);
        }
    }

    //custom event call for retargeting.biz
    var temp_product_array = {};
    temp_product_array['sku'] = cikk;
    if ($("#egyeb_list1_"+cikk).length > 0 ) {
        temp_product_array['variant_name1']=$("#egyeb_nev1_"+cikk).val();
        temp_product_array['variant_list1']=$("#egyeb_list1_"+cikk).val();
    }
    if ($("#egyeb_list2_"+cikk).length > 0 ) {
        temp_product_array['variant_name2']=$("#egyeb_nev2_"+cikk).val();
        temp_product_array['variant_list2']=$("#egyeb_list2_"+cikk).val();
    }
    if ($("#egyeb_list3_"+cikk).length > 0 ) {
        temp_product_array['variant_name3']=$("#egyeb_nev3_"+cikk).val();
        temp_product_array['variant_list3']=$("#egyeb_list3_"+cikk).val();
    }
    $(document).trigger("changeVariant", temp_product_array);
}

function select_get(select_num,cikk,prefix) {
    temp_egyeb1="!!!unas-no-data!!!";
    temp_egyeb2="!!!unas-no-data!!!";
    temp_egyeb3="!!!unas-no-data!!!";

    if ($("#egyeb_list1_"+cikk).length > 0 ) temp_egyeb1=$("#egyeb_list1_"+cikk).val();
    if ($("#egyeb_list2_"+cikk).length > 0 ) temp_egyeb2=$("#egyeb_list2_"+cikk).val();
    if ($("#egyeb_list3_"+cikk).length > 0 ) temp_egyeb3=$("#egyeb_list3_"+cikk).val();

    if ((select_num==1 && $("#egyeb_list2_"+cikk).length > 0 ) || (select_num==2 && $("#egyeb_list3_"+cikk).length > 0 )) {
        $.ajax({
            type: "GET",
            async: true,
            dataType: 'json',
            url: shop_url_main+'/shop_artdet.php',
            data: {
                action:"select_get",
                cikk:cikk,
                list1:temp_egyeb1,
                list2:temp_egyeb2,
                list3:temp_egyeb3,
                select_num:select_num,
                prefix:prefix
            },
            success: function(result) {
                if (select_num==1 && $("#egyeb_list2_"+cikk).length > 0 ) {
                    $("#egyeb_list2_"+cikk+" option").each(function(){
                        if (result.select2_enable.includes($(this).val())) {
                            $(this).prop("disabled",false);
                            $(this).css("display","block");
                        }
                        if (result.select2_disable.includes($(this).val())) {
                            $(this).prop("disabled",true);
                            $(this).css("display","none");
                        }
                    });

                    if ($("#egyeb_list2_"+cikk+" option:selected").attr("value")!="") $("#egyeb_list2_"+cikk).val(result.list2);
                }
                if ((select_num==1 || select_num==2) && $("#egyeb_list3_"+cikk).length > 0 ) {
                    $("#egyeb_list3_"+cikk+" option").each(function(){
                        if (result.select3_enable.includes($(this).val())) {
                            $(this).prop("disabled",false);
                            $(this).css("display","block");
                        }
                        if (result.select3_disable.includes($(this).val())) {
                            $(this).prop("disabled",true);
                            $(this).css("display","none");
                        }
                    });

                    if ($("#egyeb_list3_"+cikk+" option:selected").attr("value")!="") $("#egyeb_list3_"+cikk).val(result.list3);
                }
                change_egyeb(cikk);

                if (unas_design_ver>=3) {
                    $('.select-styled-variants').each(function(){
                        var $temp_variant_items=$(this);
                        $(this).find("option").each(function(){
                            if ($(this).prop("disabled")==true) {
                                $temp_variant_items.find("li[rel='"+$(this).attr("value")+"']").css("display","none");
                            } else {
                                $temp_variant_items.find("li[rel='"+$(this).attr("value")+"']").css("display","block");
                            }
                        });
                        $temp_variant_items.find(".select-styled").html($temp_variant_items.find("select option:checked").text());
                    });
                }
            }
        });
    }
}

function select_style() {
    $('select').each(function(){
        if (!$(this).parent().hasClass('select')) {

            var $this = $(this), numberOfOptions = $(this).children('option').length;

            $this.addClass('select-hidden');
            $this.wrap('<div class="select"></div>');
            $this.after('<div class="select-styled"></div>');

            if ($(this).attr("disabled")=="disabled") $(this).closest(".select").find(".select-styled").addClass("disabled");

            var $styledSelect = $this.next('div.select-styled');
            $styledSelect.text($this.children('option:selected').text());

            var $list = $('<ul />', {
                'class': 'select-options'
            }).insertAfter($styledSelect);

            $this.children("option").each(function(){
                var temp_style="";
                if ($(this).prop("disabled")==true) temp_style="display:none;";

                $('<li />', {
                    text: $(this).text().replace("--- ",""),
                    rel: $(this).val(),
                    style: temp_style
                }).appendTo($list);
            });

            var $listItems = $list.children('li');

            $list.children('li[rel="'+$(this).val()+'"]').addClass('ez');

            $(document).trigger("selectStyleCreated");

            $styledSelect.click(function(e) {
                if (!($(this).hasClass("disabled"))) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function(){
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                    if ($list.children('.ez').position().top > 340) {
                        $list.scrollTop($list.children('.ez').position().top);
                    }
                }
            });

            $listItems.click(function(e) {
                e.stopPropagation();
                $styledSelect.text($(this).text()).removeClass('active');
                $this.val($(this).attr('rel'));
                $list.children('li').removeClass('ez');
                $(this).addClass('ez');
                $this.trigger('change');
                $list.hide();
            });

            $(document).click(function() {
                $styledSelect.removeClass('active');
                $list.hide();
            });
        };
    });
	
	 $(document).keydown(function(e) {
		if (e.keyCode == 27 || e.keyCode == 13) { //esc / enter
			$('div.select-styled.active').not(this).each(function(){
				$(this).removeClass('active').next('ul.select-options').hide();                    
			});
		}
			
		/*if (e.keyCode == 38 || e.keyCode == 40) { //up / down
			select=$('div.select-styled.active').closest('.select');
			
			if (e.keyCode == 38) {
				select.find('li.ez').prev().addClass('ez2');
			} else {
				select.find('li.ez').next().addClass('ez2');
			}
			if (select.find('li.ez2').length>0) {
				select.find('li.ez').removeClass('ez');
				select.find('li.ez2').addClass('ez');
				select.find('li.ez2').removeClass('ez2');
					
				select.find('select').val(select.find('li.ez').attr('rel'));
				select.find('select').trigger('change');
					
				select.find('.select-styled').text(select.find('li.ez').text());
				
				select.find('ul').scrollTop(0);
				select.find('ul').scrollTop(select.find('li.ez').position().top);
				
				e.preventDefault();
			}			
		}*/
	});
}

/////////////////////////////////////////////////////////////////////
//type
function product_type_url() {
    var product_type_select_data=new Object();
    product_type_select_data['action']="get_product_type";
    product_type_select_data['param_id']=new Array();
    product_type_select_data['param_value']=new Array();
    temp_num=-1;
    $(".product_type_select").each(function() {
        temp_num++;
        product_type_select_data['param_id'][temp_num]=$(this).attr('data-param_id');
        if (product_type_select_data['param_id'][temp_num]==undefined) product_type_select_data['param_id'][temp_num]=$(this).attr('rel');
        product_type_select_data['param_value'][temp_num]=$(this).val();
    });
    $.ajax({
        type: "GET",
        async: true,
        data: product_type_select_data,
        success: function(result){
            if (result!="") {
                location.href=result;
                //alert(result);
            }
        }
    });
}
function product_type_mod(param_id,new_value) {
    $("#param_type_"+param_id).val(new_value);
    product_type_url();
}
function product_type_none() {
}

$(document).ready(function(){
    $(".product_type_select").change(function() {
        product_type_url();
    });
    $(".page_artdet_product_type_element a").attr("href","javascript:product_type_none();");
});


/////////////////////////////////////////////////////////////////////
//param_cust_input_save - elmenti az input paraméterek értékét, így újratöltéskor is megmarad
$(document).ready(function(){
    if ($(".param_cust_input_save").length>0) {
        $(".param_cust_input_save").keyup(function(){
            localStorage.setItem("param_cust_input_"+$(this).attr("id"),$(this).val());
        });

        var param_cust_input_value="";
        $(".param_cust_input_save").each(function(){
            param_cust_input_value=localStorage.getItem('param_cust_input_'+$(this).attr("id"));
            if (param_cust_input_value!=undefined && param_cust_input_value!="") $(this).val(param_cust_input_value);
        });
    }
});


/////////////////////////////////////////////////////////////////////
//get_url_param - az URL-ből kivesz egy get paramétert
$.get_url_param = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

/////////////////////////////////////////////////////////////////////
//recaptcha_load
function recaptcha_load() {
    if ($("#recaptchaScript").length==0) {
        var head = document.getElementsByTagName('head')[0];
        var recaptchaScript = document.createElement('script');
        recaptchaScript.id = 'recaptchaScript';
        recaptchaScript.type = 'text/javascript';
        recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
        head.appendChild(recaptchaScript);
    }
}

/////////////////////////////////////////////////////////////////////
//infinite_scroll

function load_next_content(next_link,infinite_page,click) {
    if (typeof click === "undefined") click = 0;

    $.get(next_link, function(result) {
        /*A nem végkategóriában szűrés miatt kell ez a rész.*/
        /*A result JSON string a nem végkategóriában szűrés esetén is, egyébként plain text, és ezért a JSON parse error-t*/
        /*kezelni kell mindneképpen.*/
        try {
            var resultParsed = JSON.parse(result);
            result = resultParsed.product_list_content;
        } catch (e) {}
        
        if (result.indexOf("</html")==-1) {
            var url_state=$("link[rel=canonical]").attr("href");
            if (url_state!="") {
                if (url_state.indexOf("?")==-1) {
                    url_state=url_state+"?";
                } else {
                    url_state=url_state+"&";
                }
                var filter_get_act=$.get_url_param('filter');
                if (filter_get_act!="" && filter_get_act!=null && filter_get_act!=undefined) url_state=url_state+"filter="+filter_get_act+"&";
                url_state=url_state+"infinite_page="+infinite_page;
                history.replaceState("", "", url_state);
            }
            $('.page_artlist_next_loading').html('');
            $('.page_artlist_next_content').replaceWith(result);

            if (result.indexOf('page_artlist_next_link')==-1) {
                $('.page_artlist_next_loading').remove();
                $('.page_artlist_page').remove();

                if (click===1) $(".page_artlist_load_more_content").hide();
            } else {
                infinite_scroll_num=infinite_scroll_num+1;
                $('.page_artlist_page').remove();

                $('.page_artlist_next_loading').html('<div class=\"page_artlist_next_loading_'+infinite_scroll_num+'\" data-page="'+(infinite_page+1)+'"></div>');

                if (click===0) infinite_scroll_next();
                if (click===1) $(".page_artlist_load_more_content").show();
            }
        }
    });
}

function get_next_link() {
    $('.page_artlist_next_loading').html('<div class="page_content_ajax"></div>');
    var next_link=$('.page_artlist_next_link').attr('href');
    $('.page_artlist_next_link').remove();
    return next_link;
}

var infinite_scroll_num=1;
function infinite_scroll_next() {
    //$('.page_artlist_next_loading_'+infinite_scroll_num).waypoint( //4.0.0
    //handler:function(dir) { //4.0.0
    $('.page_artlist_next_loading_'+infinite_scroll_num).waypoint(function(dir) { //2.0.3
        var infinite_page= $('.page_artlist_next_loading_'+infinite_scroll_num).data("page");
        //console.log(dir); //teszt
        //this.destroy(); //4.0.0
        if (dir=='down') load_next_content(get_next_link(),infinite_page);
    //},offset: 'bottom-in-view'}); //4.0.0
    },{offset: 'bottom-in-view',triggerOnce:true}); //2.0.3
}

function infinite_scroll_next_on_click() {
    $("body").on("click",".page_artlist_load_more_content", function () {
        var infinite_page = $('.page_artlist_next_loading_'+infinite_scroll_num).data("page");
        $(this).hide();
        load_next_content(get_next_link(),infinite_page,1);
    });
}

/////////////////////////////////////////////////////////////////////
//product_param_description
$(document).ready(function(){
    if ($(".param_desc_popup[title]:not(.param_desc_popup_ver4)").length>0) {
        $(".param_desc_popup[title]:not(.param_desc_popup_ver4)").tooltip({tipClass: "param_desc_tooltip text_normal bg_color_light3 border_1"});
    }
});

/////////////////////////////////////////////////////////////////////
//inline javascript defer
if (unas_design_ver>=3) {
    var script_defer="";
    $("script[type='text/javascript_defer']").each(function() {
        script_defer=script_defer+"\r\n"+$(this).html();
    });
    if (script_defer!="") eval(script_defer);
} else {
    $(document).ready(function(){
        $("script[type='text/javascript_defer']").each(function() {
            $(this).clone().attr("type","text/javascript").appendTo("body");
        });
    });
}


/////////////////////////////////////////////////////////////////////
//empty paragraph to new line
$(document).ready(function(){
    $('p').filter(function () { return ($(this).text() == "" && $(this).html().indexOf("<img")==-1 && $(this).html().indexOf("<object")==-1 && $(this).html().indexOf("<embed")==-1 && $(this).html().indexOf("<iframe")==-1 && $(this).html().indexOf("<script")==-1 && $(this).html().indexOf("<link")==-1 && $(this).html().indexOf("<style")==-1 && $(this).html().indexOf("<audio")==-1 && $(this).html().indexOf("<input")==-1 && $(this).html().indexOf("<textarea")==-1 && $(this).html().indexOf("<video")==-1) }).html("&nbsp;");
    $('.page_txt:not(.type_product) div').filter(function () { return ($(this).text() == "" && $(this).html().indexOf("<img")==-1 && $(this).html().indexOf("<object")==-1 && $(this).html().indexOf("<embed")==-1 && $(this).html().indexOf("<iframe")==-1 && $(this).html().indexOf("<script")==-1 && $(this).html().indexOf("<link")==-1 && $(this).html().indexOf("<style")==-1 && $(this).html().indexOf("<audio")==-1 && $(this).html().indexOf("<input")==-1 && $(this).html().indexOf("<textarea")==-1 && $(this).html().indexOf("<video")==-1) }).html("&nbsp;");
});

/////////////////////////////////////////////////////////////////////
//shop reg
function shipping_same_action() {
    $(document).ready(function(){
        if ($("#shipping_same").prop("checked")==true) {
            $("#newcust_other_mod").stop().slideUp();
            $("#other_nev").val("");
            $("#other_varos").val("");
            $("#other_irany").val("");
            $("#other_utca").val("");
            $("#other_megye").val("");
            $("#other_ado").val("");
            $("#newcust_other_mod").find("#div_out_other_address").find("select").find("#add_address").prop("selected",true);
        } else {
            $("#newcust_other_mod").stop().slideDown();
        }
    });
}

$(document).ready(function(){
    $(".check_email").blur(function(){
        var thisInput = $(this);

        $("#div_out_email .page_design_fault_out").addClass("page_design_progress");
        thisInput.addClass('in-progress');
        $.ajax({
            type: "GET",
            async: true,
            url: shop_url_main+"/shop_reg.php",
            data: {
                action:"check_email",
                lang_master:actual_lang,
                emai:$("#emai").val(),
                emai_check:$("#emai_fault_check").val()
            },
            success: function(result){
                $("#div_out_email .page_design_fault_out").removeClass("page_design_progress");
                thisInput.removeClass('in-progress');
                if (result=="no") {
                    $("#div_out_email .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_email .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_email .page_design_fault_text strong").html("");
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(thisInput.data('invalid-empty'));
                } else if (result!="") {
                    $("#div_out_email .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_email .page_design_fault_out").addClass("page_design_fault");
                    $("#div_out_email .page_design_fault_text strong").html(result);
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(result);
                } else {
                    $("#div_out_email .page_design_fault_out").addClass("page_design_ok");
                    $("#div_out_email .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_email .page_design_fault_text strong").html("");
                    thisInput.removeClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html("");
                }
            }
        });
    });

    $(".check_username").blur(function(){
        var thisInput = $(this);

        $("#div_out_username .page_design_fault_out").addClass("page_design_progress");
        thisInput.addClass('in-progress');
        $.ajax({
            type: "GET",
            async: true,
            url: shop_url_main+"/shop_reg.php",
            data: {
                action:"check_username",
                lang_master:actual_lang,
                cust_username:$("#cust_username").val()
            },
            success: function(result){
                $("#div_out_username .page_design_fault_out").removeClass("page_design_progress");
                thisInput.removeClass('in-progress');
                if (result=="no") {
                    $("#div_out_username .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_username .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_username .page_design_fault_text strong").html("");
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(thisInput.data('invalid-empty'));
                } else if (result!="") {
                    $("#div_out_username .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_username .page_design_fault_out").addClass("page_design_fault");
                    $("#div_out_username .page_design_fault_text strong").html(result);
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(result);
                } else {
                    $("#div_out_username .page_design_fault_out").addClass("page_design_ok");
                    $("#div_out_username .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_username .page_design_fault_text strong").html("");
                    thisInput.removeClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html("");
                }
            }
        });
    });

    $(".check_passwd").blur(function(){
        var thisInput = $(".check_passwd");

        $("#div_out_passwd .page_design_fault_out").addClass("page_design_progress");
        $("#div_out_passwd_again .page_design_fault_out").addClass("page_design_progress");
        thisInput.addClass('in-progress');
        $.ajax({
            type: "GET",
            async: true,
            url: shop_url_main+"/shop_reg.php",
            data: {
                action:"check_passwd",
                lang_master:actual_lang,
                passwd1:$("#passwd1").val(),
                passwd2:$("#passwd2").val()
            },
            success: function(result){
                $("#div_out_passwd .page_design_fault_out").removeClass("page_design_progress");
                $("#div_out_passwd_again .page_design_fault_out").removeClass("page_design_progress");
                thisInput.removeClass('in-progress');
                if (result=="no") {
                    $("#div_out_passwd .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_passwd .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_passwd .page_design_fault_text strong").html("");
                    $("#div_out_passwd_again .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_passwd_again .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_passwd_again .page_design_fault_text strong").html("");
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(thisInput.data('invalid-empty'));
                } else if (result!="") {
                    $("#div_out_passwd .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_passwd .page_design_fault_out").addClass("page_design_fault");
                    $("#div_out_passwd .page_design_fault_text strong").html(result);
                    $("#div_out_passwd_again .page_design_fault_out").removeClass("page_design_ok");
                    $("#div_out_passwd_again .page_design_fault_out").addClass("page_design_fault");
                    $("#div_out_passwd_again .page_design_fault_text strong").html(result);
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(result);
                } else {
                    $("#div_out_passwd .page_design_fault_out").addClass("page_design_ok");
                    $("#div_out_passwd .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_passwd .page_design_fault_text strong").html("");
                    $("#div_out_passwd_again .page_design_fault_out").addClass("page_design_ok");
                    $("#div_out_passwd_again .page_design_fault_out").removeClass("page_design_fault");
                    $("#div_out_passwd_again .page_design_fault_text strong").html("");
                    thisInput.removeClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html("");
                }
            }
        });
    });

	$(".check_zip").blur(function(){
        var thisInput = $(this);
		var temp_value = thisInput.val();
		var temp_type = thisInput.attr("id").replace("_irany","");
        thisInput.addClass('in-progress');

		$.ajax({
			type: "GET",
			async: true,
			url: shop_url_main+"/shop_reg.php",
			dataType: 'json',
			data: {
				action:"check_zip",
				zip:temp_value,
				country:$("#"+temp_type+"_orszag").val()
			},
			success: function(result) {
                thisInput.removeClass('in-progress');
				if (result.status=="no_data") { /*nem találjuk*/
					$("#div_out_"+temp_type+"_zip .page_design_fault_out").removeClass("page_design_fault");
					$("#div_out_"+temp_type+"_zip .page_design_fault_text strong").html("");
                    thisInput.removeClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html("");
				} else if (result.status=="not_found") {
					$("#div_out_"+temp_type+"_zip .page_design_fault_out").addClass("page_design_fault");
					$("#div_out_"+temp_type+"_zip .page_design_fault_text strong").html(lang_text["data_not_found"]);
                    thisInput.addClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html(lang_text["data_not_found"]);
				} else if (result.status=="ok") {
					$("#div_out_"+temp_type+"_zip .page_design_fault_out").removeClass("page_design_fault");
					$("#div_out_"+temp_type+"_zip .page_design_fault_text strong").html("");
                    thisInput.removeClass('is-invalid');
                    thisInput.siblings('.invalid-feedback').html("");

					$("#"+temp_type+"_megye").val(result.county).removeClass('is-invalid');
                    if (result.city!="") $("#"+temp_type+"_varos").val(result.city).removeClass('is-invalid');
                    if (result.street!="") $("#"+temp_type+"_utca").val(result.street).removeClass('is-invalid');
				}
			}
		});
	});

	$(".check_city_county").blur(function(){
        var thisInput = $(this);
		var temp_value = thisInput.val();
		var temp_type = thisInput.attr("id").replace("_varos","").replace("_megye","");
		var temp_data = thisInput.attr("id").replace(temp_type+"_","");
		if (temp_data=="irany") temp_data="zip";
		if (temp_data=="megye") temp_data="county";
		if (temp_data=="varos") temp_data="city";

		$.ajax({
			type: "GET",
			async: true,
			url: shop_url_main+"/shop_reg.php",
			dataType: 'json',
			data: {
				action:"check_"+temp_data,
				value:temp_value,
				zip:$("#"+temp_type+"_irany").val(),
				country:$("#"+temp_type+"_orszag").val()
			},
			success: function(result) {
				if (result.status=="no_data") {
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_out").removeClass("page_design_fault");
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_text strong").html("");
				} else if (result.status=="not_found") {
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_out").addClass("page_design_fault");
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_text strong").html(lang_text["data_not_found"]);
				} else if (result.status=="zip_error") {
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_out").addClass("page_design_fault");
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_text strong").html(lang_text["data_zip_error"]);
				} else if (result.status=="ok") {
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_out").removeClass("page_design_fault");
					$("#div_out_"+temp_type+"_"+temp_data+" .page_design_fault_text strong").html("");
				}
			}
		});
	});

	$(".js-form-validation").on("focus",".form-control, .custom-control-input", function(){
	    var thisItem = $(this);
        thisItem.removeClass('is-invalid');
        /* radio group */
        if ((thisItem).is(':radio')) {
            thisItem.closest('.custom-radio').siblings('.custom-radio').find('.custom-control-input').removeClass('is-invalid');
        }
    });

	$("#default_orszag").change(function(){
		 $("#div_out_default_county .page_design_name strong").html($("#default_orszag option:selected").attr("rel"));
	})
	$("#other_orszag").change(function(){
		 $("#div_out_other_county .page_design_name strong").html($("#other_orszag option:selected").attr("rel"));
	})
});

/////////////////////////////////////////////////////////////////////
//shop cart
var marketing_settings={
    width: 660,
    height: "content",
    offsetHeight: -80,
    contentId:"page_marketing_content",
    popupId:"marketing",
    modal:0.6,
    overflow: "scroll"
}

$(document).ready(function(){
    $("#coupon_check").click(function(){
        cart_coupon_check("#coupon_id");
    });
    $("#coupon_check_mobile").click(function(){
        cart_coupon_check("#coupon_id_mobile");
    });
});

function cart_coupon_check(coupon_id) {
    $.ajax({
        type: "GET",
        async: true,
        url: unas_shop_url+"/shop_cart.php?action=coupon_check",
        data: {
            action:"coupon_check",
            coupon_id:$(coupon_id).val()
        },
        success: function(result){
            if (result=="") {
                location.href=unas_shop_url+"/shop_cart.php?overlay=order_coupon_ok";
                //alert("OK");
            } else if (result!="empty") {
                location.href=unas_shop_url+"/shop_cart.php?overlay=order_coupon_error_"+result;
                //alert(result);
            } else {
                location.href=unas_shop_url+"/shop_cart.php";
                //alert(result);
            }
        }
    });
}

function postsale_marketing_popup (order_key) {
    var postsale_marketing_ajax_data="get_ajax=1&marketing_type=popup&order_key="+encodeURIComponent(order_key)+"&change_lang="+actual_lang;

    if (!popup_open) {
        $.shop_popup("open",{
            ajax_url:shop_url_main+"/shop_marketing.php",
            ajax_data:postsale_marketing_ajax_data,
            ajax_loader:false,
            width: 660,
            height: "content",
            offsetHeight: -80,
            contentId:"page_marketing_content",
            class:"shop_popup_postsale",
            popupId:"marketing",
            modal:0.6,
            overflow: "scroll",
            closeClick: false
        });
    }
}

function cart_marketing_popup(sku,variant_name1,variant_list1,variant_name2,variant_list2,variant_name3,variant_list3,marketing_close_script) {
    var cart_marketing_ajax_data="get_ajax=1&marketing_type=popup&change_lang="+actual_lang+"&cikk="+sku;
    cart_marketing_ajax_data=cart_marketing_ajax_data+"&egyeb_nev1="+encodeURIComponent(variant_name1)+"&egyeb_list1="+encodeURIComponent(variant_list1);
    cart_marketing_ajax_data=cart_marketing_ajax_data+"&egyeb_nev2="+encodeURIComponent(variant_name2)+"&egyeb_list2="+encodeURIComponent(variant_list2);
    cart_marketing_ajax_data=cart_marketing_ajax_data+"&egyeb_nev3="+encodeURIComponent(variant_name3)+"&egyeb_list3="+encodeURIComponent(variant_list3);

    $.shop_popup("open",{
        ajax_url:shop_url_main+"/shop_marketing.php",
        ajax_data:cart_marketing_ajax_data,
		ajax_loader:false,
		width: 660,
    	height: "content",
		offsetHeight: -80,
		contentId:"page_marketing_content",
        popupId:"marketing",
        class:"shop_popup_marketing",
		modal:0.6,
        onClose: function() {
            if (marketing_close_script!="") setTimeout(function() {eval(marketing_close_script);},400);
        },
        onForbidden: function(){
            if (marketing_close_script!="") setTimeout(function() {eval(marketing_close_script);},400);
        },
    	onLoad: function() {
            if ($("#page_PopupContainer").css("display") == "none") $.shop_popup("close");
        },
		overflow: "scroll"
    });
}

function cart_file_submit(random) {
    var fd = new FormData();
	$(".cust_input_file").each(function(){
        var $this = $(this);
        var file_data = $this[0].files[0];
        if (file_data !== undefined) {
            $this.addClass("cust_input_file_uploading");
            fd.append($this.attr("id"), file_data);
        }
    });
    fd.append("action", "fileupload");
    fd.append("get_ajax", "1");
    fd.append("rnd_number", random);
    $.ajax({
        url: shop_url_main+"/shop_ajax/ajax_cart.php",
        type: "POST",
        async: false,
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        enctype: "multipart/form-data",
        complete: function(){
			$(".cust_input_file.cust_input_file_uploading").removeClass("cust_input_file_uploading").addClass('cust_input_file_uploaded');
        }
    });
    return false;
}

/*global variables for cart_add and check_cust_input*/
var product_param=[];
var cust_input_file_exists=0;

/*check customer inputs*/
function check_cust_input(){

    var has_error=0;
    var temp_values = [];

    $('.cust_input').each(function(){

        var $this=$(this);
        var id=$this.attr("id");
        var value="";

        $("#page_artdet_product_param_spec_"+id).removeClass("page_artdet_product_param_spec_fault");
        $("#page_artdet_product_param_spec_"+id+"_value").removeClass("page_artdet_product_param_spec_fault");
        $this.removeClass("is-invalid"); /*1900*/

        if($this.hasClass('cust_input_select')){ /*cust_input_select*/
            value=$this.find("option:selected").val();
        } else { /*cust_input_text or cust_input_file*/
            value=$this.val();
            if($this.hasClass("cust_input_file")) cust_input_file_exists=1;
        }

        if ($this.hasClass("required") && value === "") {
            has_error=1;
            $("#page_artdet_product_param_spec_"+id).addClass("page_artdet_product_param_spec_fault");
            $("#page_artdet_product_param_spec_"+id+"_value").addClass("page_artdet_product_param_spec_fault");
            $this.addClass("is-invalid");
        }
        if (value !== "") {
            temp_values.push(id+"¤"+value);
        }
    });

    /*if there is no error in input params, temp array becomes real array */
    if (has_error === 0) product_param = temp_values;

    return has_error;
}

function cart_add() {
    var sku=arguments[0];
    var cart_prefix=arguments[1]
    var is_artdet=arguments[3]
    if ($("#ud_shop_artdet").length>0 && $("#db_"+cart_prefix+sku).val()!=undefined && is_artdet<1) is_artdet=1;
    var sku_orig=sku.replace(/__unas__/g,"-");

    var main_image="main_image_"+cart_prefix+sku;

    if (!$("#"+main_image).is(":visible")) main_image=main_image+'_mobile';

    var qty=$("#db_"+cart_prefix+sku).val();
    if (arguments[2]!=null) qty=arguments[2];
    if (qty<=0 || qty==null || qty==undefined) qty=1;

    var cart_config=arguments[4];

    var variant_name1=$("#egyeb_nev1_"+cart_prefix+sku).val();
    var variant_list1=$("#egyeb_list1_"+cart_prefix+sku).val();
    var variant_name2=$("#egyeb_nev2_"+cart_prefix+sku).val();
    var variant_list2=$("#egyeb_list2_"+cart_prefix+sku).val();
    var variant_name3=$("#egyeb_nev3_"+cart_prefix+sku).val();
    var variant_list3=$("#egyeb_list3_"+cart_prefix+sku).val();

    if (is_artdet>0 && (document.form_temp2_artdet!=undefined || $("#db_"+cart_prefix+sku).val()==undefined)) {
        variant_name1=document.form_temp_artdet.egyeb_nev1.value;
        variant_list1=document.form_temp_artdet.egyeb_list1.value;
        variant_name2=document.form_temp_artdet.egyeb_nev2.value;
        variant_list2=document.form_temp_artdet.egyeb_list2.value;
        variant_name3=document.form_temp_artdet.egyeb_nev3.value;
        variant_list3=document.form_temp_artdet.egyeb_list3.value;
        qty=document.form_temp_artdet.db.value;
    }

    if (is_artdet>0) {
        if (variant_name1==undefined && $("#temp_egyeb_nev1").val()!="") variant_name1=$("#temp_egyeb_nev1").val();
        if (variant_list1==undefined && $("#temp_egyeb_list1").val()!="") variant_list1=$("#temp_egyeb_list1").val();
        if (variant_name2==undefined && $("#temp_egyeb_nev2").val()!="") variant_name2=$("#temp_egyeb_nev2").val();
        if (variant_list2==undefined && $("#temp_egyeb_list2").val()!="") variant_list2=$("#temp_egyeb_list2").val();
        if (variant_name3==undefined && $("#temp_egyeb_nev3").val()!="") variant_name3=$("#temp_egyeb_nev3").val();
        if (variant_list3==undefined && $("#temp_egyeb_list3").val()!="") variant_list3=$("#temp_egyeb_list3").val();
    }

    var error=0;
    var service_plus="";
    if (is_artdet>0) {
        error = check_cust_input();
        main_image="main_image";
        service_plus=$(".service_plus_radio input:checked").val();
    }

    if (error==1){
        if (is_artdet==1) overlay_load("warning",lang_text_warning,lang_text_required_fields_missing);
    } else {
        cart_add_fly(main_image);

        var cust_input_file_random = Math.floor(Math.random()*(10000-1+1)+1);

        ajax_async = true;
        if (cust_input_file_exists==1) {
            ajax_async = false;
            cart_file_submit(cust_input_file_random);

        }
        var product_param_temp;
        product_param_temp = product_param.filter(Boolean).join("|");

        $.ajax({
            type: "POST",
            async: ajax_async,
            url: shop_url_main+"/shop_ajax/ajax_cart.php",
            dataType: 'json',
            data: {
                get_ajax:1,
                result_type:"json",
                lang_master:actual_lang,
                action:"add",
                sku:sku,
                qty:qty,
                variant_name1:variant_name1,
                variant_list1:variant_list1,
                variant_name2:variant_name2,
                variant_list2:variant_list2,
                variant_name3:variant_name3,
                variant_list3:variant_list3,
                service_plus:service_plus,
                product_param:product_param_temp,
                item_random_number:cust_input_file_random,
                cart_config:cart_config
            },
            success: function(result){
                //custom event call
                var temp_product_array = {};
                temp_product_array['error'] = result.error;
                temp_product_array['sku'] = sku_orig;
                temp_product_array['master_key'] = result.master_key;
                temp_product_array['name'] = result.name;
                temp_product_array['url'] = result.url;
                temp_product_array['unit'] = result.unit;
                temp_product_array['event_id'] = result.event_id;
                temp_product_array['category'] = result.category;
                temp_product_array['price'] = result.price;
                temp_product_array['qty'] = qty;
                temp_product_array['qty_all'] = result.qty_all;
                temp_product_array['qty_add'] = result.qty_add;
                temp_product_array['variant_name1'] = variant_name1;
                temp_product_array['variant_list1'] = variant_list1;
                temp_product_array['variant_name2'] = variant_name2;
                temp_product_array['variant_list2'] = variant_list2;
                temp_product_array['variant_name3'] = variant_name3;
                temp_product_array['variant_list3'] = variant_list3;
                $(document).trigger("addToCart",temp_product_array);
                if (result.cart_success==1) $(document).trigger("addToCartSuccess",temp_product_array);

                cart_add_finish(result,main_image);
            }
        });
    }
}

function check_cust_input_live(){
    $(".cust_input.required").each(function(){
        var $this = $(this);
        var $thisID = $this.attr("id");
        $this.on('change keyup', function(){
            if ($this.attr("value") === "") {
                $("#page_artdet_product_param_spec_"+$thisID+", #page_artdet_product_param_spec_"+$thisID+"_value").addClass("page_artdet_product_param_spec_fault");
                $this.addClass('is-invalid');
            } else {
                $("#page_artdet_product_param_spec_"+$thisID+", #page_artdet_product_param_spec_"+$thisID+"_value").removeClass("page_artdet_product_param_spec_fault");
                $this.removeClass('is-invalid');
            }
        });
    });
}

$(document).ready(function(){
    check_cust_input_live();
});

function cart_add_fly(main_image) {
    if (typeof config_plus['cart_redirect']!=='undefined' && config_plus['cart_redirect']==1) {
        var main_image_fly="#box_cart_content";
        if (typeof config_plus['cart_fly_id']!=='undefined' && config_plus['cart_fly_id']!="") {
            main_image_fly="#"+config_plus['cart_fly_id'];
            if (!$(main_image_fly).is(':visible') && $("#box_cart_content").is(':visible')) main_image_fly="#box_cart_content";
        }
        if (!$(main_image_fly).is(':visible') && $("#box_cart_content2").is(':visible')) main_image_fly="#box_cart_content2";

        if ($(main_image_fly).length>0) {
            if ($("#"+main_image).length>0) {
                $(document).trigger("addToCartFly");

                var image = $("#"+main_image).offset();
                var cart  = $(main_image_fly).offset();

                //console.log(image);
                //console.log(cart);

                $("#image_to_cart").html('<img id="image_to_cart_img" src="'+$("#"+main_image).attr('src')+'" />');
                $("#image_to_cart_img").css("position","absolute");
                $("#image_to_cart_img").css("top",image.top+"px");
                $("#image_to_cart_img").css("left",image.left+"px");
                $("#image_to_cart_img").css("opacity","0.8");
                $("#image_to_cart_img").css("width",$("#"+main_image).width()+"px");
                $("#image_to_cart_img").css("height",$("#"+main_image).height()+"px");
                $("#image_to_cart_img").css("max-width","none");
                $("#image_to_cart_img").css("max-height","none");
                $("#image_to_cart").css("z-index","1000000");
                $("#image_to_cart").css("display","block");
                params = {
                    top : cart.top + "px",
                    left : cart.left + "px",
                    opacity : 0.0,
                    width : "20px",
                    height : "20px",
                    display: "none"
                };
                $("#image_to_cart_img").animate(params, 500, function() { $("#image_to_cart_img").css("display","none"); });
            }
        }
    }
}

var cart_add_warning=0;
function cart_add_overlay() {
    if (cart_add_warning!=1) {
        $('#overlay_cart_add_ok').overlay().load();
        $(document).trigger("addToCartOverlay");
    }
}
function cart_add_redirect() {
    if (cart_add_warning!=1) {
        location.href=unas_shop_url+'/shop_cart.php';
        $(document).trigger("addToCartRedirect");
    }
}

function cart_add_finish(result,main_image) {
    if (typeof config_plus['cart_refresh_force']!=='undefined' && config_plus['cart_refresh_force']=="1") {
        var cart_refresh_force=1;
    } else {
        var cart_refresh_force=0;
    }

    if ($("#box_cart_content").is(':visible') || cart_refresh_force==1) $("#box_cart_content").load(shop_url_main+"/shop_ajax/ajax_box_cart.php?get_ajax=1&lang_master="+actual_lang+"&unas_design="+result.unas_design,function(){
        $(document).trigger("cartRefreshed");
    });
    if (result.cart_box_more==1 && ($("#box_cart_content2").is(':visible') || cart_refresh_force==1)) $("#box_cart_content2").load(shop_url_main+"/shop_ajax/ajax_box_cart.php?get_ajax=1&lang_master="+actual_lang+"&unas_design="+result.unas_design+"&cart_num=2");
    if (result.cart_add_callback!=null && result.cart_add_callback!="") eval(result.cart_add_callback+"();");

    if ($(".container_shipping_cost").length>0 || $(".container_shipping_free").length>0) {
        $.ajax({
            type: "GET",
            sync: true,
            url: shop_url_main+"/shop_ajax/ajax_shipping.php",
            dataType: "json",
            data: {
                get_ajax:1,
                shop_id:shop_id,
                lang_master:actual_lang
            },
            success: function(result2){
                $(".container_shipping_cost").html(result2.cost);
                $(".container_shipping_free").html(result2.free);
            }
        });
    }
    if (result.overlay!="" && result.overlay!=undefined) {
        $("#overlay_cart_add").html(result.overlay);
        if (result.cart_onclose!="" && result.cart_redirect==0) {
            $("#overlay_cart_add").bind("onClose", function () {
                eval(result.cart_onclose);
            });
        } else {
            $("#overlay_cart_add").unbind("onClose");
        }
        $("#overlay_cart_add").overlay().load();
    } else {
        if (result.cart_onclose!="" && result.cart_onclose!=undefined) {
            eval(result.cart_onclose);
        }
    }
}

function cart_delete(item) {
    $.ajax({
        type: "GET",
        async: true,
        url: shop_url_main+"/shop_ajax/ajax_cart.php",
        dataType: 'json',
        data: {
            get_ajax:1,
            action:"delete",
            item:item
        },
        success: function(result_delete){
            cart_add_finish(result_delete,"");
            if (result_delete.sku!="" && result_delete.sku!=undefined) $(document).trigger("removeFromCart",{sku:result_delete.sku});
        }
    });
}

function cart_empty() {
    $.ajax({
        type: "GET",
        async: true,
        url: shop_url_main+"/shop_ajax/ajax_cart.php",
        dataType: 'json',
        data: {
            get_ajax:1,
            action:"empty"
        },
        success: function(result_empty){
            cart_add_finish(result_empty,"");
            $(document).trigger("emptyCart",{});
        }
    });
}

/////////////////////////////////////////////////////////////////////
//shop order mods
function delivery_point_open(id) {
    if ($("#szall_id_"+id).prop("checked")==true) {
        if ($("#szall_mod_"+id+" .page_order_mods_deliverypoint").css("display")=="none" || $("#szall_mod_"+id+" .page_order_mods_deliverypoint").length==0) {
            $(".page_order_mods_deliverypoint").css("display","none");
            $("#szall_mod_"+id+" .page_order_mods_deliverypoint").slideDown(200,"linear");
        }
    }
}

function delivery_point_select_disp(id) {
    if ($("#szall_mod_"+id+" .delivery_point_1_outer").html()=="") {
        $("#szall_mod_"+id+" .delivery_point_1_wrapper").css("display","none");
    } else {
        $("#szall_mod_"+id+" .delivery_point_1_wrapper").css("display","inline-block");
    }

    if ($("#szall_mod_"+id+" .delivery_point_2_outer").html()=="") {
        $("#szall_mod_"+id+" .delivery_point_2_wrapper").css("display","none");
    } else {
        $("#szall_mod_"+id+" .delivery_point_2_wrapper").css("display","inline-block");
    }

    if ($("#szall_mod_"+id+" .delivery_point_3_outer").html()=="") {
        $("#szall_mod_"+id+" .delivery_point_3_wrapper").css("display","none");
    } else {
        $("#szall_mod_"+id+" .delivery_point_3_wrapper").css("display","inline-block");
    }

    if ($("#szall_mod_"+id+" .delivery_point_4_outer").html()=="") {
        $("#szall_mod_"+id+" .delivery_point_4_wrapper").css("display","none");
    } else {
        $("#szall_mod_"+id+" .delivery_point_4_wrapper").css("display","inline-block");
    }

    if ($("#szall_mod_"+id+" .delivery_point_5_outer").html()=="") {
        $("#szall_mod_"+id+" .delivery_point_5_wrapper").css("display","none");
    } else {
        $("#szall_mod_"+id+" .delivery_point_5_wrapper").css("display","inline-block");
    }
}

function delivery_point_change(num,id,shop_id,value) {
    if (num==0) {
        value=$("#szall_mod_"+id+" .delivery_point").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:0,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
                if ($("#szall_mod_"+id+" .delivery_point").val()!="") {
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html(result.info);
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").slideDown(200,"linear");
                    $(document).trigger("deliveryPointSelected");
                }
            }
        });
    }
    if (num==1) {
        value=$("#szall_mod_"+id+" .delivery_point_1").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:1,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .delivery_point_2_outer").html(result.select2);
                $("#szall_mod_"+id+" .delivery_point_3_outer").html(result.select3);
                $("#szall_mod_"+id+" .delivery_point_4_outer").html(result.select4);
                $("#szall_mod_"+id+" .delivery_point_5_outer").html(result.select5);
                delivery_point_select_disp(id);

                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
            }
        });
    }
    if (num==2) {
        value=$("#szall_mod_"+id+" .delivery_point_2").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:2,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .delivery_point_3_outer").html(result.select3);
                $("#szall_mod_"+id+" .delivery_point_4_outer").html(result.select4);
                $("#szall_mod_"+id+" .delivery_point_5_outer").html(result.select5);
                delivery_point_select_disp(id);

                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
            }
        });
    }
    if (num==3) {
        value=$("#szall_mod_"+id+" .delivery_point_3").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:3,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .delivery_point_4_outer").html(result.select4);
                $("#szall_mod_"+id+" .delivery_point_5_outer").html(result.select5);
                delivery_point_select_disp(id);

                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
            }
        });
    }
    if (num==4) {
        value=$("#szall_mod_"+id+" .delivery_point_4").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:4,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .delivery_point_5_outer").html(result.select5);
                delivery_point_select_disp(id);

                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
            }
        });
    }
    if (num==5) {
        value=$("#szall_mod_"+id+" .delivery_point_5").val();
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:5,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
                if ($("#szall_mod_"+id+" .delivery_point_5").val()!="") {
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html(result.info);
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").slideDown(200,"linear");
                    $(document).trigger("deliveryPointSelected");
                }
            }
        });
    }

    if (num=="direct_key" || num=="direct_name") {
        $.ajax({
            type: "GET",
            url: "shop_order_mods.php",
            data: {
                action:"delivery_point_change",
                num:num,
                mod_id:id,
                value:value
            },
            dataType: 'json',
            success: function(result){
                $("#szall_mod_"+id+" .delivery_point_1_outer").html(result.select1);
                $("#szall_mod_"+id+" .delivery_point_2_outer").html(result.select2);
                $("#szall_mod_"+id+" .delivery_point_3_outer").html(result.select3);
                $("#szall_mod_"+id+" .delivery_point_4_outer").html(result.select4);
                $("#szall_mod_"+id+" .delivery_point_5_outer").html(result.select5);
                delivery_point_select_disp(id);

                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").css("display","none");
                $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html("");
                if ($("#szall_mod_"+id+" .delivery_point_5").val()!="") {
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info").html(result.info);
                    $("#szall_mod_"+id+" .page_order_mods_deliverypoint_info_outer").slideDown(200,"linear");
                    $(document).trigger("deliveryPointSelected");
                }
            }
        });
    }
}

var mod_first="";
var mod_select=0;

function connect_check(mod_id,type) {
    mod_select=0;
    mod_first="";

    $("."+type+"_radio").each(function(index, value) {
        temp_connect1=$(this).attr("rel_connect");
        if (temp_connect1!="") temp_connect2=temp_connect1.split(",");

        temp_connect3=0;
        if (temp_connect1!="") {
            for (temp_value in temp_connect2) {
                if (temp_connect2[temp_value]==mod_id) temp_connect3=1;
            }
        }

        if (temp_connect3==0) {
            mod_disable($(this).attr("id"),"enable");
            if (mod_first=="") mod_first=$(this).attr("id");
        } else {
            mod_disable($(this).attr("id"),"disable");
        }

        if ($(this).prop("checked")==true) mod_select=1;
    });

    if (mod_select==0 && orderflow_no_mode_selected!=1) {
        temp_id=mod_first.replace(type+"_id_","");
        temp_spec= (mod_first!="") ? $("#"+mod_first).attr("rel_spec") : "";
        if (type=="fiz") payment_select(temp_id,temp_spec); else shipping_select(temp_id,temp_spec);
    }
}

function mod_disable(mod_id,type) {
    var mod_id2=mod_id.replace("szall_id_","szall_mod_").replace("fiz_id_","page_order_mods_");

    if (type=="enable") {
        $("#"+mod_id).prop("disabled",false);
        //var temp = $("#"+mod_id).parents('tr:first');
        var temp = $("#"+mod_id2);
        $(temp).find("td").fadeTo(300, 1, function() {
            $(this).find(".text_normal").fadeTo(0, 1);
        });
        if (unas_design_ver>=3) {
            $(temp).addClass("js-order-mods--enabled");
            $(temp).removeClass("js-order-mods--disabled");
        } else {
            $(temp).addClass("page_order_mods_tr_body_enable");
            $(temp).removeClass("page_order_mods_tr_body_disable");
        }
    } else {
        $("#"+mod_id).prop("checked",false);
        $("#"+mod_id).prop("disabled",true);
        //var temp = $("#"+mod_id).parents('tr:first');
        var temp = $("#"+mod_id2);
        $(temp).find("td").fadeTo(300, 0.7, function() {
            $(this).find(".text_normal").fadeTo(0, 0.7);
        });
        if (unas_design_ver>=3) {
            $(temp).removeClass("js-order-mods--enabled");
            $(temp).addClass("js-order-mods--disabled");
        } else {
            $(temp).removeClass("page_order_mods_tr_body_enable");
            $(temp).addClass("page_order_mods_tr_body_disable");
        }
    }
}

function payment_select(fiz_id,fiz_spec) {
    var temp_payment_array = {};
    temp_payment_array['id'] = fiz_id;
    temp_payment_array['spec'] = fiz_spec;
    temp_payment_array['name'] = $("#fiz_id_"+temp_payment_array['id']).val();

    var old_payment_checked=$("#fiz_id_"+fiz_id).prop("checked");
    $("#fiz_id_"+fiz_id).prop("checked",true);
    if (old_payment_checked!=true) {
        $("#fiz_id_"+fiz_id).change();
        temp_payment_array['auto'] = 1;
    }

    document.form_order.fiz_id.value=fiz_id;
    document.form_order.fiz_spec.value=fiz_spec;

    if (orderflow_disable_control==1) {
        if (orderflow_disable_send==1) {
            if (fiz_spec=="") {
                $("#button_next").attr("value",orderflow_button_order);
                $("#button_next").attr("data-type","order");
            } else {
                if ($("#fiz_id_"+fiz_id).attr("rel_online")=="no" || $("#fiz_id_"+fiz_id).attr("rel_checkout_direct")=="no") {
                    $("#button_next").attr("value",orderflow_button_order);
                    $("#button_next").attr("data-type","send");
                } else if ($("#fiz_id_"+fiz_id).attr("rel_type")=="credit") {
                    $("#button_next").attr("value",orderflow_button_credit);
                    $("#button_next").attr("data-type","credit");
                } else {
                    $("#button_next").attr("value",orderflow_button_checkout);
                    $("#button_next").attr("data-type","pay");
                }
            }
        } else {
            $("#button_next").attr("data-type","order");
        }
    } else {
        $("#button_next").attr("data-type","control");
    }

    if (orderflow_payment_first!=1) connect_check(fiz_id,"szall");

    $(document).trigger("changePaymentType", temp_payment_array);
    $(document).trigger("changePaymentMethod", temp_payment_array);
}

function shipping_select(szall_id,szall_spec) {
    var temp_shipping_array = {};
    temp_shipping_array['id'] = szall_id;
    temp_shipping_array['spec'] = szall_spec;

    var old_shipping_checked=$("#szall_id_"+szall_id).prop("checked");
    $("#szall_id_"+szall_id).prop("checked",true);
    if (old_shipping_checked!=true) {
        $("#szall_id_"+szall_id).change();
        temp_shipping_array['auto'] = 1;
    }

    document.form_order.szall_id.value=szall_id;
    document.form_order.szall_spec.value=szall_spec;
    delivery_point_open(szall_id);

    if (orderflow_payment_first==1) connect_check(szall_id,"fiz");

    $(document).trigger("changeShippingType", temp_shipping_array);
    $(document).trigger("changeShippingMethod", temp_shipping_array);
}

function mod_init() {
    if (orderflow_no_mode_selected!=1 || orderflow_mode_modify==1) {
        if (orderflow_payment_first!=1) {
            shipping_select(orderflow_shipping_act,orderflow_shipping_act_spec);
            payment_select(orderflow_payment_act,orderflow_payment_act_spec);
        } else {
            payment_select(orderflow_payment_act,orderflow_payment_act_spec);
            shipping_select(orderflow_shipping_act,orderflow_shipping_act_spec);
        }
    }
    $(".page_order_mods_deliverypoint_info_outer").each(function(){
        if ($(this).attr("style")==undefined) $(this).css("display","none");
    });

    $("#button_prev").click(function(e) {
        $(document).trigger("clickOrderButton", {id:"cart",page:"mods",direction:"back"});
        location.href=unas_shop_url+"/shop_cart.php";
    });
    $("#button_next").click(function(e) {
        if(unas_design_ver >= 4){
            var order_mods_error = false;
            var error_text, error_selector, error_position;
            error_text = error_selector = error_position = '';
            var errors = [];
            $('.js-param-required').each(function(){
                if(order_mods_params_check($(this))){
                    order_mods_error = true;
                }
            });
            error_text += '<ul class="order-mods__overlay-error">';
            if(order_mods_error){
                error_text += '<li>'+orderflow_missing_parameters_alert+'</li>';
                errors.push('.js-param-validation');
            }

            if (orderflow_no_mode_selected==1) {
                if ($(".fiz_radio:checked").length<1 || $(".szall_radio:checked").length<1) {
                    error_text += "<li>"+orderflow_select_modes+"</li>";
                    errors.push('.js-methods-validation');
                    order_mods_error = true;
                }
            }
            
            if (orderflow_terms_alert===1 && !$("#order_control_terms").prop("checked")){
                $('.js-terms-validation').addClass('has-fault is-invalid');
                order_mods_error = true;
                error_text += '<li>'+orderflow_terms_alert1+'</br>'+orderflow_terms_alert2+'</li>';
                errors.push('.js-terms-validation');
            }

            var temp_id=document.form_order.szall_id.value;

            if ($("#szall_mod_"+temp_id+" .page_order_mods_deliverypoint_info_outer").css("display")==="none"){
                $("#szall_mod_"+temp_id+" .js-delivery-point-validation .order-mods__delivery-point-selects").addClass('has-fault');
                order_mods_error = true;
                error_text += '<li>'+orderflow_delivery_point_alert1+'</br>'+orderflow_delivery_point_alert2+'</li>';
                errors.push('.js-delivery-point-validation');
            } else {
                $("#szall_mod_"+temp_id+" .js-delivery-point-validation .order-mods__delivery-point-selects").removeClass('has-fault');
            }
            error_text += '</ul>';
            if(order_mods_error){
                jQuery.each( errors, function( i, val ) {
                    if(error_position === '' || error_position > $(val).offset().top){
                        error_position = $(val).offset().top;
                        error_selector = val;
                    }
                });
                scroll_to_element(error_selector);
                overlay_load('error',orderflow_missing_data_alert,error_text);
            } else {
                if (config_plus['order_mods_button_stayenabled']!==1) {
                    $("#button_next").prop("disabled", true);
                    $("#button_prev").prop("disabled", true);
                }
                $(document).trigger("clickOrderButton", {id:$("#button_next").attr("data-type"),page:"mods",paymentMethod:document.form_order.fiz.value,shippingMethod:document.form_order.szall.value});
                document.form_order.submit();
            }
        } else {
            if (orderflow_terms_alert==1 && $("#order_control_terms").prop("checked")!=true) {
                $(document).trigger("clickOrderButtonError", {id:$("#button_next").attr("data-type"),page:"mods",paymentMethod:document.form_order.fiz.value,shippingMethod:document.form_order.szall.value,error:"terms"});
                overlay_load("error",orderflow_terms_alert1,orderflow_terms_alert2);
            } else {
                var temp_id=document.form_order.szall_id.value;

                if (orderflow_no_mode_selected==1) {
                    if ($(".fiz_radio:checked").length<1 || $(".szall_radio:checked").length<1) {
                        overlay_load("error",orderflow_select_modes,"");
                        return false;
                    }
                }

                if ($("#szall_mod_"+temp_id+" .page_order_mods_deliverypoint").length==0) {
                    if (config_plus['order_mods_button_stayenabled']!=1) {
                        $("#button_next").prop("disabled", true);
                        $("#button_prev").prop("disabled", true);
                    }
                    $(document).trigger("clickOrderButton", {id:$("#button_next").attr("data-type"),page:"mods",paymentMethod:document.form_order.fiz.value,shippingMethod:document.form_order.szall.value});
                    document.form_order.submit();
                } else {
                    if ($("#szall_mod_"+temp_id+" .page_order_mods_deliverypoint_info_outer").css("display")=="none") {
                        $(document).trigger("clickOrderButtonError", {id:$("#button_next").attr("data-type"),page:"mods",paymentMethod:document.form_order.fiz.value,shippingMethod:document.form_order.szall.value,error:"deliverypoint"});
                        overlay_load("error",orderflow_delivery_point_alert1,orderflow_delivery_point_alert2);
                    } else {
                        if (config_plus['order_mods_button_stayenabled']!=1) {
                            $("#button_next").prop("disabled", true);
                            $("#button_prev").prop("disabled", true);
                        }
                        $(document).trigger("clickOrderButton", {id:$("#button_next").attr("data-type"),page:"mods",paymentMethod:document.form_order.fiz.value,shippingMethod:document.form_order.szall.value});
                        document.form_order.submit();
                    }
                }
            }
        }
    });
}
function order_mods_params_check(el,live){
    var $this,$error;
    if(live){
        $this = $(el).closest('.js-param-required');
    }else{
        $this = $(el);
        $error = false;
    }
    if($this.hasClass('param-type-input') || $this.hasClass('param-type-file')){
        if($this.find('input').val()===''){
            $this.addClass('has-fault');/*1800*/
            $this.find('input').addClass('is-invalid');/*1900*/
            $error = true;
        }else{
            $this.removeClass('has-fault');
            $this.find('input').removeClass('is-invalid');
        }
    }
    if($this.hasClass('param-type-radio')){
        if(!$this.find('input[type="radio"]').is(":checked")){
            $this.addClass('has-fault');
            $this.find('input').addClass('is-invalid');
            $error = true;
        }else{
            $this.removeClass('has-fault');
            $this.find('input').removeClass('is-invalid');
        }
    }
    if(!live){ return $error; }
}

/////////////////////////////////////////////////////////////////////
//shop order control
function order_control_back() {
    location.href=unas_shop_url+"/shop_order_mods.php";
}

function order_control_next() {
    if (orderflow_terms_alert==1 && $("#order_control_terms").prop("checked")!=true) {
        $(document).trigger("clickOrderButtonError", {id:orderflow_next_type,page:"control",error:"terms"});

        overlay_load("error",orderflow_terms_alert1,orderflow_terms_alert2);
    } else {
        $(document).trigger("clickOrderButton", {id:orderflow_next_type,page:"control"});

        document.form_szf.megj.value=document.form_megj.megj.value;

        if (typeof document.form_megj.szall_megj !== 'undefined') {
            document.form_szf.szall_megj.value=document.form_megj.szall_megj.value;
        }

        document.form_szf.full_virt_pont.value=document.form_megj.full_virt_pont.value;
        document.form_szf.virtual_money_aktual.value=document.form_megj.virtual_money_aktual.value;
        document.form_szf.coupon_amount_aktual.value=document.form_megj.coupon_amount_aktual.value;
        document.form_szf.action=unas_shop_url+"/shop_order_send.php";

        $("#button_next").prop("disabled",true);
        $("#button_back").prop("disabled",true);

        document.form_szf.submit();
    }
}

/////////////////////////////////////////////////////////////////////
//shop order checkout
var payment_spec_redir_allow=1;
function order_checkout_start(start_url) {
    if (payment_spec_redir_allow==1) {
        payment_spec_redir_allow=0;
        location.href=start_url;
    }
}

$(document).ready(function(){
    $("#button_pay").click(function(){
        $("#button_pay").attr("disabled","disabled");
        $("#button_pay").prop("disabled",true);

        $("#button_prev").attr("disabled","disabled");
        $("#button_prev").prop("disabled",true);
    });
});

function order_checkout_change() {
    $(document).trigger("clickOrderButton", {id:"change",page:"checkout",paymentMethod:document.form_change_send.fiz.value});
}

/////////////////////////////////////////////////////////////////////
//shop compare
function compare_checkbox(cikk,action) {
    var product_array = {};
    product_array["sku"] = cikk;
    product_array["sku_id"] = cikk.replace(/-/g,'__unas__');
	if (action=="delete") {
		$("#page_artlist_"+cikk.replace(/-/g,'__unas__')+" .page_art_func_compare").removeClass("page_art_func_compare_checked");
	    $(".page_artlist_sku_"+cikk.replace(/-/g,'__unas__')+" .page_art_func_compare").removeClass("page_art_func_compare_checked");
    	$(".page_artdet_func_compare_"+cikk.replace(/-/g,'__unas__')).removeClass("page_artdet_func_compare_checked");

        text_add=$(".page_artdet_func_compare_text_"+cikk.replace(/-/g,'__unas__')).data("text-add");
        if (text_add!=undefined && text_add!="") $(".page_artdet_func_compare_text_"+cikk.replace(/-/g,'__unas__')).html(text_add);
        $(document).trigger("removeFromCompare", product_array);

        if (google_analytics==1) gtag("event", "remove_from_compare", { 'event_category':"product",'event_label':cikk });
        if (google_tagmanager==1) dataLayer.push({'event': 'remove_from_compare','eventCategory': 'compare','eventAction': 'remove_from_compare','eventLabel': cikk});
	} else {
		$("#page_artlist_"+cikk.replace(/-/g,'__unas__')+" .page_art_func_compare").addClass("page_art_func_compare_checked");
        $(".page_artlist_sku_"+cikk.replace(/-/g,'__unas__')+" .page_art_func_compare").addClass("page_art_func_compare_checked");
        $(".page_artdet_func_compare_"+cikk.replace(/-/g,'__unas__')).addClass("page_artdet_func_compare_checked");

        text_delete=$(".page_artdet_func_compare_text_"+cikk.replace(/-/g,'__unas__')).data("text-delete");
        if (text_delete!=undefined && text_delete!="") $(".page_artdet_func_compare_text_"+cikk.replace(/-/g,'__unas__')).html(text_delete);
        $(document).trigger("addToCompare", product_array);

        if (google_analytics==1) gtag("event", "add_to_compare", { 'event_category':"product",'event_label':cikk });
        if (google_tagmanager==1) dataLayer.push({'event': 'add_to_compare','eventCategory': 'product','eventAction': 'add_to_compare','eventLabel': cikk});
	}
}

function compare_box_refresh(cikk,action) {
    var temp_compare_url=shop_url_main+"/shop_ajax/ajax_box_compare.php?get_ajax=1&lang_master="+actual_lang+"&unas_design="+unas_design_code;
    if (action=="delete") {
        temp_compare_url=temp_compare_url+"&delete="+cikk;
		compare_checkbox(cikk,"delete");
    }

    $.ajax({
        type: "GET",
        url: temp_compare_url,
        success: function (temp_result) {
            $("#box_compare_content").html(temp_result);
        }
    });
    if ($("#box_compare_content").html()=="") {
        $("#box_container_shop_compare").css("display","none");
    } else {
        $("#box_container_shop_compare").css("display","block");
    }
}

function compare_add(cikk) {
    popup_compare_dialog(cikk);
}

function compare_del(cikk) {
    $.ajax({
        type: "GET",
        url: unas_shop_url+"/shop_compare.php",
        data: "get_ajax=1&action=delete&cikk="+cikk,
        dataType: 'json',
        success: function(compare_del_result){
            compare_checkbox(cikk,"delete");
            compare_box_refresh("","");

            $(".col_"+compare_del_result.sku_id).hide(300, function(){
                $(".col_"+compare_del_result.sku_id).remove();
                if(compare_del_result.count==0) {
                    $.shop_popup("close");
                } else {
                    $.shop_popup("size",{
                        width:"content",
                        height:"content",
                        contentId:"page_compare_table",
                        popupId:"compare"
                    });
                }
            });
        }
    });
}


function compare_tocart(sku,qty) {
    $.shop_popup("close");
    setTimeout(function () { cart_add(sku,"",qty); }, 500);
}

/////////////////////////////////////////////////////////////////////
//favourite
function favourite_del(sku,sku_id,master_key,page,prefix) {
    $.ajax({
        type: "GET",
        url: "shop_order_track.php?tab=favourites&page="+page,
        data: "favourite_del="+sku,
        success: function(result) {
            var product_array = {};
            product_array["sku"] = sku;
            product_array["sku_id"] = sku_id;
            product_array["master_key"] = master_key;
            $(document).trigger("removeFromFavourites", product_array);

            $("#page_artlist_"+prefix+result).remove();
            if($(".favourites_item_del").length===0) {
                if (unas_design_ver<3) {
                    $(".no_favourites").show();
                } else {
                    $(".no_favourites").removeClass("d-none").addClass("d-block");
                }

            }
        }
    });
}

/////////////////////////////////////////////////////////////////////
//calendar
function get_month(month) {
    if (service_type=="cms") {
        $.ajax({
            type: "GET",
            async: true,
            url: calendar_ajax_url,
            data: {
                home_id:home_id,
                lang_master:actual_lang,
                get_ajax:1,
                month:month
            },
            success: function(result){
                $("#box_calendar_content").html(result);
            }
        });
    } else {
        $.ajax({
            type: "GET",
            async: true,
            url: calendar_ajax_url,
            data: {
                shop_id:shop_id,
                lang_master:actual_lang,
                get_ajax:1,
                month:month
            },
            success: function(result){
                $("#box_calendar_content").html(result);
            }
        });
    }
}

/////////////////////////////////////////////////////////////////////
//product_det_prevnext
function product_det_prevnext(ajax_url) {
    $.ajax({
        type: "GET",
        async: true,
        url: ajax_url,
        success: function(result){
            location.href=result;
        }
    });
}

/////////////////////////////////////////////////////////////////////
//recommend
function recommend_valid_datas() {
    $("#recommend_error_msg").hide();
    $("#recommend_friends_email").removeClass("recommend_fault is-invalid");
    $("#recommend_friends_email").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#recommend_my_name").removeClass("recommend_fault is-invalid");
    $("#recommend_my_name").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#recommend_my_email").removeClass("recommend_fault is-invalid");
    $("#recommend_my_email").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#recommend_privacy_policy").removeClass("recommend_fault is-invalid");
    $("#recommend_privacy_policy").closest(".recommend_label_input").removeClass("recommend_label_fault");

    $.ajax({
        type: "POST",
        url: unas_shop_url+"/shop_recommend.php",
        data: "validation=ok&change_lang="+actual_lang+"&friends_email="+$("#recommend_friends_email").val()+"&my_name="+$("#recommend_my_name").val()+"&my_email="+$("#recommend_my_email").val()+"&comment="+$("#recommend_comment").val()+"&recaptcha_response="+grecaptcha.getResponse(recaptcha_id_recommend)+"&art_num="+$("#recommend_art_num").html()+"&recommend_privacy_policy="+$("#recommend_privacy_policy").prop("checked"),
        dataType: 'json',
        success: function(result){
            //console.log(result);

            if(result.status=="fault") {
                if(result.friends_email=="0") {
                    $("#recommend_friends_email").addClass("recommend_fault is-invalid");
                    $("#recommend_friends_email").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.my_name=="0") {
                    $("#recommend_my_name").addClass("recommend_fault is-invalid");
                    $("#recommend_my_name").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.my_email=="0") {
                    $("#recommend_my_email").addClass("recommend_fault is-invalid");
                    $("#recommend_my_email").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.privacy_policy=="0") {
                    $("#recommend_privacy_policy").addClass("recommend_fault is-invalid");
                    $("#recommend_privacy_policy").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
            } else {
                $(document).trigger("recommendationSent");

                if (google_analytics==1) gtag("event", "recommendation_sent", { 'event_category':"product" });
                if (google_tagmanager==1) dataLayer.push({'event': 'recommendation_sent','eventCategory': 'product','eventAction': 'recommendation_sent','eventLabel': ''});

                $("#recommend_error_msg").show(500, function() {
                    setTimeout(function () { $.shop_popup("close"); }, 1500);
                });
            }
        }
    });
}

function recommend_del(cikk,prefix) {
    $.ajax({
        type: "POST",
        url: unas_shop_url+"/shop_recommend.php",
        data: "recommend_del="+cikk,
        success: function(result){
            $("#page_PopupContainer_inner #page_popuplist_"+prefix+result).slideUp(300,function(){
                $("#page_PopupContainer_inner #page_popuplist_"+prefix+result).remove();
                if($(".page_popuplist_item").length==0) {
                    $.shop_popup("close");
                } else {
                    $.shop_popup("size",recommend_settings);
                }
                $(document).trigger("removeRecommendItem");
            });
        }
    });
}

var recaptcha_rendered;
var recommend_settings={
	width: 660,
	height: "content",
	offsetHeight: -80,
	contentId:"page_recommend_content",
    popupId:"recommend"
};

function recommend_dialog(cikk) {
    recaptcha_load();

	if (recaptcha_rendered==1) {
		window.location.hash = "#recommend";
		location.reload();
	} else {
		$.shop_popup("open",{
			ajax_url:unas_shop_url+"/shop_recommend.php",
			ajax_data:"cikk="+cikk+"&change_lang="+actual_lang+"&get_ajax=1",
			width: 660,
			height: "content",
			offsetHeight: -80,
			contentId:"page_recommend_content",
            popupId:"recommend",
		    class:"shop_popup_recommend shop_popup_artdet",
			modal:0.6,
			overflow: "auto"
		})
	}
}

$(document).ready(function () {
	if (window.location.hash=="#recommend") recommend_dialog();
});

/////////////////////////////////////////////////////////////////////
//question
function question_send(cikk) {
    $("#recommend_error_msg").hide();
    $("#question_name").removeClass("recommend_fault is-invalid");
    $("#question_name").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#question_email").removeClass("recommend_fault is-invalid");
    $("#question_email").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#question_message").removeClass("recommend_fault is-invalid");
    $("#question_message").closest(".recommend_label_input").removeClass("recommend_label_fault");
    $("#question_privacy_policy").removeClass("recommend_fault is-invalid");
    $("#question_privacy_policy").closest(".recommend_label_input").removeClass("recommend_label_fault");

    $.ajax({
        type: "POST",
        url: unas_shop_url+"/shop_question.php",
        data: "get_ajax=1&change_lang="+actual_lang+"&action=send&cikk="+cikk+"&question_name="+$("#question_name").val()+"&question_email="+$("#question_email").val()+"&question_phone="+$("#question_phone").val()+"&question_message="+$("#question_message").val()+"&question_privacy_policy="+$("#question_privacy_policy").prop("checked"),
        dataType: 'json',
        success: function (result) {
            //console.log(result);

            if(result.status=="fault") {
                if(result.name=="0") {
                    $("#question_name").addClass("recommend_fault is-invalid");
                    $("#question_name").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.email=="0") {
                    $("#question_email").addClass("recommend_fault is-invalid");
                    $("#question_email").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.message=="0") {
                    $("#question_message").addClass("recommend_fault is-invalid");
                    $("#question_message").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
                if(result.privacy_policy=="0") {
                    $("#question_privacy_policy").addClass("recommend_fault is-invalid");
                    $("#question_privacy_policy").closest(".recommend_label_input").addClass("recommend_label_fault");
                }
            } else {
                $("#recommend_error_msg").show(500, function() {
                    $(document).trigger("questionSent");

                    if (google_analytics==1) gtag("event", "question_sent", { 'event_category':"product" });
                    if (google_tagmanager==1) dataLayer.push({'event': 'question_sent','eventCategory': 'product','eventAction': 'question_sent','eventLabel': ''});
                    if (facebook_pixel==1) fbq('track', 'Contact');

                    setTimeout(function () { $.shop_popup("close"); }, 1500);
                });
            }
        }
    });
}

/////////////////////////////////////////////////////////////////////
//vote
function vote_disable(id) {
    if (id=="") {
        if ($("#vote_box_privacy_policy").prop("checked") == true && $(".vote_box_radio:checked").prop("checked") == true) {
            $("#vote_box_button").prop("disabled", false);
        } else {
            $("#vote_box_button").prop("disabled", true);
        }
    } else {
        if ($("#vote_privacy_policy_" + id).prop("checked") == true && $(".vote_radio_" + id + ":checked").prop("checked") == true) {
            $("#vote_button_" + id).prop("disabled", false);
        } else {
            $("#vote_button_" + id).prop("disabled", true);
        }
    }
}

/////////////////////////////////////////////////////////////////////
//filter
function product_filter_slider(obj,akt_min,akt_max) {
    var min = obj.slider("option", "min");
    var max = obj.slider("option", "max");
    obj.parent().find('.akt_min').val(akt_min);
    obj.parent().find('.akt_max').val(akt_max);
    obj.slider("values", [akt_min, akt_max]);

    var text_before = obj.parent().find('.text_before').val();
    var text_after = obj.parent().find('.text_after').val();
    text = text_before+String(akt_min).replace(".",money_dec)+text_after+" - "+text_before+String(akt_max).replace(".",money_dec)+text_after;
    obj.parent().find('.product_filter_num_text').html(text);

    if (akt_min==min && akt_max==max) {
        obj.parents(".product_filter_content").removeClass("product_filter_content_checked");
        obj.parents(".product_filter_group").removeClass("product_filter_group_checked");
    } else {
        obj.parents(".product_filter_content").addClass("product_filter_content_checked");
        obj.parents(".product_filter_group").addClass("product_filter_group_checked");
    }
}

function product_filter_delete_all(prefix) {
    if (unas_design_ver>=4) {
        $('.js-selected-filters').empty();
        $(".product_filter_content input[type='checkbox']").prop("checked",false);

        $(".product_filter_content .product_filter_icon").each(function() {
            if ($(this).hasClass("product_filter_icon_checked")) {
                filter_icon($(this));
            }
        });
    } else {
        $(".product_filter_content .text_input_checkbox").each(function() {
            $(this).children("input").prop("checked",false);
            if ($(this).hasClass("text_input_checkbox_checked")) {
                $(this).addClass("text_input_checkbox_unchecked");
                $(this).removeClass("text_input_checkbox_checked");
            }
            $(this).attr("rel_checked",0);
        });

        $(".product_filter_content .product_filter_icon").each(function() {
            if ($(this).hasClass("product_filter_icon_checked")) {
                filter_icon_click($(this));filter_icon($(this));
            }
        });
    }

    $(".product_filter_content .ui-slider").each(function() {
        var min = $(this).slider("option", "min");
        var max = $(this).slider("option", "max");
        $(this).parent().find('.akt_min').val(min);
        $(this).parent().find('.akt_max').val(max);
        if ($(this).closest('.product_filter_group').attr('data-id') === 'price'){
            $(this).closest('.product_filter_group').find('.product_filter_num_from').val(number_format((min * parseFloat(UNAS.shop.currency_rate)),money_len,'.',''));
            $(this).closest('.product_filter_group').find('.product_filter_num_to').val(number_format((max * parseFloat(UNAS.shop.currency_rate)),money_len,'.',''));
        } else {
            $(this).closest('.product_filter_group').find('.product_filter_num_from').val(number_format(min,$(this).parent().find('.decimal_length'),'.',''));
            $(this).closest('.product_filter_group').find('.product_filter_num_to').val(number_format(max,$(this).parent().find('.decimal_length'),'.',''));
        }
        $(this).slider("values", [min, max]);

        var text_before = $(this).parent().find('.text_before').val();
        var text_after = $(this).parent().find('.text_after').val();
        text = text_before+String(min).replace(".",money_dec)+text_after+" - "+text_before+String(max).replace(".",money_dec)+text_after;
        $(this).parent().find('.product_filter_num_text').html(text);

        $(this).parents(".product_filter_content").removeClass("product_filter_content_checked");
        $(this).parents(".product_filter_group").removeClass("product_filter_group_checked");
    });

    filter_activate_delay(prefix);
}

function product_filter_save_filter_overlay() {
    if ($("#overlay_save_filter").attr("data-inited")==1) {
        $("#overlay_save_filter").overlay().load();
    } else {
        $(document).on("overlayInited",function(event, params) {
            if (params['id']=='save_filter') {
                $("#overlay_save_filter").overlay().load();
            }
        });
    }
}


function product_filter_save () {
    var filter_name = $("#filter_name").val();
    var filter_page_id = $("#filter_page_id").val();
    var filter_name_check=filter_name.replace(/\s/g, "");

    if (filter_name_check=="") {
        $("#filter_save_errors").removeClass("d-none").addClass("d-block");
        $("#filter_save_errors .error_empty_input").removeClass("d-none").addClass("d-block")
    } else {
        var data = {
            action: "save_filter",
            shop_id: shop_id,
            get_ajax: 1,
            filter_name: filter_name,
            page: UNAS.design.page,
            page_id: filter_page_id
        };

        data['filter'] = filter_get;
        if (UNAS.design.page==="search" || UNAS.design.page==="search_result") data['page_data'] = JSON.stringify(search_parameters);
        if (UNAS.design.page==="artspec" || UNAS.design.page==="product_list_spec") data['page_data'] = JSON.stringify(artspec_parameters);

        $.ajax({
            type: "GET",
            url: UNAS.shop.base_url+"/shop_ajax/ajax_save_filter.php?change_lang="+actual_lang,
            dataType: "JSON",
            data: data,
            success: function (response) {
                if (response.success) {
                    if (UNAS.design.page!=="search" && UNAS.design.page!=="artspec" && UNAS.design.page!=="search_result" && UNAS.design.page!=="product_list_spec" ) {
                        $(".saved_filters_wrapper").html(response.content);
                    }

                    $("#overlay_save_filter #filter_name").val("");
                    $("#overlay_save_filter").overlay().close();
                    
                    $("#filter_save_errors").removeClass("d-block").addClass("d-none");
                    $("#filter_save_errors .error").removeClass("d-block").addClass("d-none");
                }

                if (response.error) {
                    $("#filter_save_errors").removeClass("d-none").addClass("d-block");
                    $(".error_"+response.error_code).removeClass("d-none").addClass("d-block");
                }
            }
        });
    }
}

var saved_filter_master_key;
var saved_filter_name;
var saved_filter_email;
function saved_filter_del_overlay(master_key,name,email) {
    saved_filter_master_key=master_key;
    saved_filter_name=name;
    saved_filter_email=email;

    $("#overlay_delete_filter").overlay().load();
}

function saved_filter_del(master_key,filter_name,email) {
    $.ajax({
        type: "POST",
        url: UNAS.shop.base_url+"/shop_ajax/ajax_save_filter.php",
        dataType: "JSON",
        data: {
            action: "delete_saved_filter",
            master_key: master_key,
            email: email,
            filter_name: filter_name,
            get_ajax:1
        },
        success: function () {
            $("#saved_filter_row_"+master_key).remove();

            $("#overlay_delete_filter").overlay().close();

            if ($(".saved_filter_row").length<1) {
                $("#saved_filters_table").hide();

                $(".no_saved_filters").show();

                if (!($(".no_saved_filters").is(":visible"))) $(".no_saved_filters").removeClass("d-none").addClass("d-block");
            }
        }
    });
}
$(document).ready(function () {
    $(document).on("overlayAjaxLoaded",function(event, params) {
        if (params['id']=='save_filter') {
            $("#overlay_save_filter #filter_page_id").val(UNAS.shop.category_id);
        }
    });
    if (location.hash=="#filter_save") {
        if (UNAS.customer['email']!="") product_filter_save_filter_overlay();
    }
});

$(document).ajaxStop(function () {
    $("#filter_name").on('click', function () {
        $("#filter_save_errors").removeClass("d-block").addClass("d-none");
        $("#filter_save_errors .error").removeClass("d-block").addClass("d-none");
    });
});


var popStateEvent=0;
function product_filter_history_state(action,url,prefix,clicked_param_id,clicked_param_value) {

    if (action=="replace") history.replaceState("", "", url);

    if (action=="push") {
        if (popStateEvent!=1) {
            pushStatData = new Array();
            pushStatData["prefix"] = prefix;
            pushStatData["clicked_param_id"] = clicked_param_id;
            pushStatData["clicked_param_value"] = clicked_param_value;

            pushStatData["checkbox"] = new Array();
            $("#"+prefix+"box_filter_content input[type=checkbox]").each(function(){
                if ($(this).prop("checked")==true) {
                    pushStatData["checkbox"].push($(this).attr("id"));
                }
            });

            pushStatData["slider"] = new Array();
            $("#"+prefix+"box_filter_content .product_filter_num").each(function(){
                pushStatData["slider"][$(this).attr("id")]=$(this).slider("values");
            });

            //console.log(pushStatData);
            history.pushState(pushStatData, "", url);
        }
        popStateEvent=0;
    }

    if (action=="pop") {
        window.addEventListener("popstate", function(event){
            if (event.state==undefined) {
                if (window.location.hash==="" && cat_art_list_filter_loaded!==1) product_filter_delete_all("");
            } else {
                popStateEvent=1;
                $("#"+event.state.prefix+"box_filter_content input[type=checkbox]").each(function(){
                    if (event.state.checkbox.indexOf($(this).attr("id"))!=-1) {
                        if ($(this).prop("checked")!=true) {
                            $(this).prop("checked",true);
                            if (typeof input_checkbox_alter_reload === "function") input_checkbox_alter_reload($(this).parent());
                        }
                    } else {
                        if ($(this).prop("checked")!=false) {
                            $(this).prop("checked",false);
                            if (typeof input_checkbox_alter_reload === "function") input_checkbox_alter_reload($(this).parent());
                        }
                    }
                });

                $("#"+event.state.prefix+"box_filter_content .product_filter_num").each(function(){
                    product_filter_slider($(this),event.state.slider[$(this).attr("id")][0],event.state.slider[$(this).attr("id")][1]);
                });

                clicked_param_id=event.state.clicked_param_id;
                clicked_param_value=event.state.clicked_param_value;

                filter_activate_delay(event.state.prefix);
            }

            //console.log(document.location);
            //console.log(event.state);
        });
    }
}

/////////////////////////////////////////////////////////////////////
//cookie alert
function cookie_alert_action(close,allow) {
    $(document).ready(function(){
        if (close==1) {
            $("#cookie_alert").slideUp(300, function() {
                $("#cookie_alert").addClass("cookie_alert_close");
                $("#cookie_alert").slideDown(150);
            });

            if (google_analytics==1) gtag("event", "cookie_alert_close", { 'event_category':"cookie_alert" });
            if (google_tagmanager==1) dataLayer.push({'event': 'cookie_alert_close','eventCategory': 'cookie','eventAction': 'cookie_alert_close','eventLabel': ''});
        } else if (close==0) {
            $("#cookie_alert").slideUp(150, function() {
                $("#cookie_alert").removeClass("cookie_alert_close");
                $("#cookie_alert").slideDown(300);
            });

            if (google_analytics==1) gtag("event", "cookie_alert_open", { 'event_category':"cookie_alert" });
            if (google_tagmanager==1) dataLayer.push({'event': 'cookie_alert_open','eventCategory': 'cookie','eventAction': 'cookie_alert_close','eventLabel': ''});
        }

        if (allow==1) {
            $("#cookie_alert").addClass("cookie_alert_allow");
            if (google_analytics==1) gtag("event", "cookie_allow", { 'event_category':"cookie_alert" });
            if (google_tagmanager==1) dataLayer.push({'event': 'cookie_allow','eventCategory': 'cookie','eventAction': 'cookie_allow','eventLabel': ''});

            $(document).trigger("grantConsent",{});
        } else {
            $("#cookie_alert").removeClass("cookie_alert_allow");
            if (allow==0) {
                if (google_analytics==1) gtag("event", "cookie_disallow", { 'event_category':"cookie_alert" });
                if (google_tagmanager==1) dataLayer.push({'event': 'cookie_disallow','eventCategory': 'cookie','eventAction': 'cookie_disallow','eventLabel': ''});

                $(document).trigger("rejectConsent",{});
            }
        }

        $.ajax({
            type: "GET",
            url: shop_url_main+"/shop_ajax/ajax_cookie_alert.php",
            data: {service_type:service_type,close:close,allow:allow,get_ajax:"1"}
        });
    });
}

/////////////////////////////////////////////////////////////////////
//product question
function popup_question_dialog(cikk) {
    $.shop_popup("open",{
        ajax_url:unas_shop_url+"/shop_question.php",
        ajax_data:"cikk="+cikk+"&change_lang="+actual_lang+"&get_ajax=1",
        width: 580,
        height: 420,
        modal:0.6,
        class:"shop_popup_question shop_popup_artdet",
        overflow: "auto"
    });
}

/////////////////////////////////////////////////////////////////////
//product print
function popup_print_dialog(ajax_print_temp,print_blank,cikk) {
    if (print_blank==1) {
        print_width=700;
        if (screen.availWidth-20<print_width) print_width=screen.availWidth-20;
        print_height=screen.availHeight-150

        window.open(unas_shop_url+"/shop_artdet.php?ajax_print="+ajax_print_temp+"&cikk="+cikk+"&change_lang="+actual_lang,"","status=no,menubar=no,resizable=no,left=0,top=0,width="+print_width+",height="+print_height);
    } else {
        $("<style media=\"print\"> #ud_shop_artdet {display:none;} </style>").appendTo("head");
        $.shop_popup("open",{
            iframe_url:unas_shop_url+"/shop_artdet.php?ajax_print="+ajax_print_temp+"&cikk="+cikk+"&change_lang="+actual_lang,
            width: 700,
            height: 700,
            class:"shop_popup_artdet_print shop_popup_artdet",
            modal:0.6
        });
    }
}

/////////////////////////////////////////////////////////////////////
//overlay init
function overlay_init(id,config) {
    var config_act = $.extend({
        top: 50,
        maskLoadSpeed: 200,
        maskOpacity: 0.7,
        closeOnClick: false,
        closeOnEsc: true,
        load: false,
        onBeforeLoad: true
    }, config);

    $("#overlay_"+id).overlay({
        onBeforeLoad: function() {
            if (config_act.onBeforeLoad==true && $("#overlay_"+id).attr("data-content")!=1) {
                overlay_ajax(id);
            }
        },
        onLoad: function(){
            $(document).trigger("overlayOpen",{id:id});
        },
        top: config_act.top,
        mask: {
            color: "#000000",
            loadSpeed: config_act.maskLoadSpeed,
            maskId: "exposeMaskOverlay",
            opacity: config_act.maskOpacity
        },
        closeOnClick: config_act.closeOnClick,
        closeOnEsc: config_act.closeOnEsc,
        load: config_act.load
    });

    $(document).trigger("overlayInited",{id:id});
    $("#overlay_"+id).attr("data-inited",1);
}

function overlay_ajax(id) {
    if ($("#overlay_"+id).attr("data-content")!=1) {
        $("#overlay_"+id).attr("data-content",1);
        $.ajax({
            type: "GET",
            async: true,
            url: shop_url_main+"/shop_ajax/ajax_overlay.php",
            data: {
                shop_id:shop_id,
                lang_master:actual_lang,
                overlay_id:id,
                layout_plus:UNAS.design.page,
                get_ajax:"1"
            },
            beforeSend:function(){
                $("#overlay_"+id).addClass('overlay-loading');
            },
            success: function(data){
                if (data!="") $("#overlay_"+id).html(data);
                $("#overlay_"+id).removeClass('overlay-loading').addClass('overlay-loaded');
                $(document).trigger("overlayAjaxLoaded",{id:id});
            }
        });
    } else {
        $(document).trigger("overlayAjaxLoaded",{id:id});
    }
}

function overlay_close(id) {
    $(document).ready(function(){
        $("#"+id).overlay().close();
        $(document).trigger("overlayClosed",id);
    });
}

var overlay_type="";
var overlay_title="";
var overlay_text="";
function overlay_load(type,title,text) {
    overlay_type=type;
    overlay_title=title;
    overlay_text=text;

    overlay_ajax("script");

    $(document).on("overlayAjaxLoaded",function(event, params) {
        if (params['id'] == "script") {
            $("#overlay_script").attr("class","overlay_common overlay_"+overlay_type);

            $("#overlay_script .overlay_title").html(overlay_title);
            if (text!="") {
                $("#overlay_script .overlay_text").html(overlay_text);
                $("#overlay_script .overlay_text").css("display","block");
            } else {
                $("#overlay_script .overlay_text").css("display","none");
            }

            $("#overlay_script").overlay().load();
        }
    });
}

/////////////////////////////////////////////////////////////////////
//set_front_var
function set_front_var(key,value,type) {
    $.ajax({
        type: "GET",
        async: true,
        url:shop_url_main+"/shop_ajax/ajax_set_front_var.php",
        data: {
            get_ajax:1,
            key:key,
            value:value,
            type:type
        }
    });
}

/////////////////////////////////////////////////////////////////////
//qty plus minus
function qty_plus_minus(temp_this,plus_minus) {
    //init
    if (money_dec=="") money_dec=",";
    if (money_dec==".") {
        var re_dec = new RegExp("---unas---", "g");
    } else {
        var re_dec = new RegExp(money_dec, "g");
    }

    //vals
    var temp_input=temp_this.closest(".page_qty_input_outer").find(".page_qty_input");
    var temp_qty_min = parseFloat(temp_input.attr('data-min'));
    var temp_qty_max = parseFloat(temp_input.attr('data-max'));
    var temp_qty_step = parseFloat(temp_input.attr('data-step'));
    var temp_qty_act = parseFloat(String(temp_input.val()).replace(re_dec,'.'));
    var temp_qty_val_change = 0;
    var temp_qty_test = 0;
    var temp_qty_act_temp = 0;

    //action
    if (plus_minus=='plus') {
        temp_qty_test = Math.round((temp_qty_act + temp_qty_step)*100000)/100000;
        if (!isNaN(temp_qty_act) && temp_qty_test <= temp_qty_max) {
            temp_qty_act = temp_qty_test;
            temp_qty_val_change=1;
        }
    }
    if (plus_minus=='minus') {
        temp_qty_test = Math.round((temp_qty_act-temp_qty_step)*100000)/100000;
        if (!isNaN(temp_qty_act) && temp_qty_test >= temp_qty_min) {
            temp_qty_act = temp_qty_test;
            temp_qty_val_change=1;
        }
    }

    //validation
    if (!isNaN(temp_qty_act) && temp_qty_act > temp_qty_max) {
        temp_qty_act = temp_qty_max;
        temp_qty_val_change=1;
    }
    if (!isNaN(temp_qty_act) && temp_qty_act < temp_qty_min) {
        temp_qty_act = temp_qty_min;
        temp_qty_val_change=1;
    }

    temp_qty_act_temp = Math.round((temp_qty_act-temp_qty_min)/temp_qty_step)*temp_qty_step+temp_qty_min;
    temp_qty_act_temp = Math.round(temp_qty_act_temp*100000)/100000;
    if (temp_qty_act_temp>temp_qty_max) {
        temp_qty_act_temp = Math.floor((temp_qty_act-temp_qty_min)/temp_qty_step)*temp_qty_step+temp_qty_min;
        temp_qty_act_temp = Math.round(temp_qty_act_temp*100000)/100000;
    }
    if (temp_qty_act_temp!=temp_qty_act) {
        temp_qty_act=temp_qty_act_temp;
        temp_qty_val_change=1;
    }
    if (isNaN(temp_qty_act)) temp_qty_act=temp_input.prop("defaultValue");

    //disable
    if (!isNaN(temp_qty_act) && Math.round((temp_qty_act + temp_qty_step)*100000)/100000 > temp_qty_max) {
        temp_this.closest(".page_qty_input_outer").find(".qtyplus_common").addClass("qty_disable");
    } else {
        temp_this.closest(".page_qty_input_outer").find(".qtyplus_common").removeClass("qty_disable");
    }
    if (!isNaN(temp_qty_act) && Math.round((temp_qty_act - temp_qty_step)*100000)/100000 < temp_qty_min) {
        temp_this.closest(".page_qty_input_outer").find(".qtyminus_common").addClass("qty_disable");
    } else {
        temp_this.closest(".page_qty_input_outer").find(".qtyminus_common").removeClass("qty_disable");
    }

    //return
    if (temp_qty_val_change==1 && !isNaN(temp_qty_act)) {
        if (temp_input.attr("type")=="number") {
            temp_input.val(temp_qty_act);
        } else {
            temp_input.val(String(temp_qty_act).replace('.', money_dec));
        }

        temp_input.trigger("changeProductQty");
    }
}

$(document).ready(function(){
    if (unas_design_ver>=3) {
        var hovered_qty_input = null;
        $('body').on("focus", ".page_qty_input", function(e) {
            if ($(this).prop("readonly")!=true) hovered_qty_input = $(this);
        });
        $('body').on("blur", ".page_qty_input", function(e) {
            hovered_qty_input = null;
        });
        /*window.addEventListener("wheel", function(e) {
            if (hovered_qty_input) {
                if (e.deltaY < 0) {
                    qty_plus_minus(hovered_qty_input,'plus');
                } else {
                    qty_plus_minus(hovered_qty_input,'minus');
                }
                e.preventDefault();
            }
        }, {passive: false} );*/

        $('body').on("click", ".qtyplus_common", function () {
            qty_plus_minus($(this),'plus');
        });
        $('body').on("click", ".qtyminus_common", function () {
            qty_plus_minus($(this),'minus');
        });
        $('body').on("blur", ".page_qty_input", function () {
            qty_plus_minus($(this),'');
        });
        $('.page_qty_input').each(function () {
            qty_plus_minus($(this),'');
        });
    }
});

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/*
* case 0 - hirlevélre feliratkozva, mehet a termék feliratkozás
* case 1 - nincs bejelentkezve/regisztráció nélkül vásárol, hírlevélre feliratkozás + termékre
* case 2 - bejelentkezve, nincs feliratkozva. Elfogadja, akkor termékre is és hírlevélre is felriatkozott
*/
var logged_in = 0;
var newsletter;
function subscribe_to_product(sku,email,address,name,type,price,_newsletter) {
    if (email!=="") logged_in=1;
    newsletter = _newsletter;

    if (popup_open) {
        $.shop_popup("close");
    }
    setTimeout(function(){
        if (newsletter==1) {
            $.ajax({
                url: shop_url_main + "/shop_ajax/ajax_product_subscribe.php",
                type: "POST",
                dataType:"json",
                data: {
                    get_ajax: 1,
                    email:email,
                    action:"check_newsletter_subscription",
                    cikk: sku
                },
                success: function (response) {
                    switch (response.code) {
                        case 0:
                            handle_product_subscribe(sku,email,type,price);
                            break;
                        case 1:
                            subscribe_to_product_overlay(response,1,1);

                            $("#overlay_product_subscription").on('click', '#overlay_product_subscription_agree button', function (e) {
                                var name=$("#overlay_product_subscription_subscribe input[name='name']").val();
                                var nologin_email=$("#overlay_product_subscription_subscribe input[name='email']").val();

                                handle_newsletter_subscribe(sku,address,nologin_email,type,name,price);
                            });
                            break;
                        case 2:
                            subscribe_to_product_overlay(response,0,1);

                            $("#overlay_product_subscription").on('click', '#overlay_product_subscription_agree button', function () {
                                handle_newsletter_subscribe(sku,address,email,type,name,price);
                            });
                            break;
                    }
                }
            });
        } else {
            handle_product_subscribe(sku,email,type,price);
        }
    },300);
}
function handle_newsletter_subscribe (sku,address,email,type,name,price) {
    if (typeof address === "undefined" || address === "") {
        if ($("#overlay_product_subscription_subscribe").is(":visible") && $("#overlay_product_subscription_subscribe input[name='address']").length>0) {
            address=$("#overlay_product_subscription_subscribe input[name='address']").val();
        }
        if ($("#overlay_product_subscription_agree").is(":visible") && $("#overlay_product_subscription_agree input[name='address']").length>0) {
            address=$("#overlay_product_subscription_agree input[name='address']").val();
        }
    }

    $("#overlay_product_subscription .subscribe_validation_error").css("display","none");
    $.ajax({
        type:"GET",
        url: shop_url_main + "/shop_ajax/ajax_newsletter.php",
        dataType:"json",
        data: {
            get_ajax:1,
            action:"subscribe",
            name:name,
            email: email,
            addr: address,
            product_subscribe: 1,
            privacy_policy: $("#product_subscribe_privacy_policy").prop("checked")
        },
        success: function (result) {
            if (result.status==="ok" || result.error_code==="newsletter_error_up_old") {
                $("#overlay_product_subscription").overlay().close();

                if (email!="") logged_in = 1;
                setTimeout(function () { handle_product_subscribe(sku,email,type,price); },500);
                $("#overlay_product_subscription").off('click', '#overlay_product_subscription_agree button');
            } else {
                $("#overlay_product_subscription .subscribe_validation_error").html(result.error_text);
                $("#overlay_product_subscription .subscribe_validation_error").css("display","block");
            }
        }
    });
}
var product_subscribe_params = [];
function handle_product_subscribe (sku,email,type,price) {
    if (logged_in!=1) {
        product_subscribe_params['sku']=sku;
        product_subscribe_params['type']=type;
        product_subscribe_params['price']=price;
        subscribe_to_product_overlay("",0,0);
    } else {
        $.ajax({
            type: "POST",
            url: shop_url_main + "/shop_ajax/ajax_product_subscribe.php",
            dataType:"json",
            data: {
                get_ajax: 1,
                cikk: sku,
                email: email,
                type: type,
                price: price,
                action: "subscribe_to_product"
            },
            success: function (response) {
                subscribe_to_product_overlay(response,0,0);
            }
        });
    }
}

var subscribe_to_product_response;
var subscribe_to_product_subscribe;
var subscribe_to_product_agree;
function subscribe_to_product_overlay(response,subscribe,agree) {
    subscribe_to_product_response=response;
    subscribe_to_product_subscribe=subscribe;
    subscribe_to_product_agree=agree;
    overlay_ajax("product_subscription");

    $(document).off("overlayAjaxLoaded").on("overlayAjaxLoaded",function(event, params) {
        if (params['id']=="product_subscription" && (logged_in==1 || newsletter==1)) {
            $("#overlay_product_subscription .overlay_title").html(subscribe_to_product_response.message);
            $("#overlay_product_subscription .overlay_text").html(subscribe_to_product_response.message_sub);

            if (subscribe_to_product_response.message_sub!=="" && typeof subscribe_to_product_response.message_sub !=="undefined") {
                $("#overlay_product_subscription .overlay_text").css("display","block");
            } else {
                $("#overlay_product_subscription .overlay_text").css("display","none");
            }

            if (subscribe_to_product_subscribe==1) {
                $("#overlay_product_subscription #overlay_product_subscription_subscribe").css("display", "block");
                $("#overlay_product_subscription_subscribe input[name='email']").val("").focusout();
                $("#overlay_product_subscription_subscribe input[name='address']").val("").focusout();
                $("#overlay_product_subscription_subscribe input[name='name']").val("").focusout();
            } else {
                $("#overlay_product_subscription #overlay_product_subscription_subscribe").css("display", "none");
            }

            $("#overlay_product_subscription .overlay_subscribe_button").html(subscribe_to_product_response.button_text);
            $("#overlay_product_subscription .subscribe_validation_error").html(subscribe_to_product_response.error_message);

            if (subscribe_to_product_agree==1) {
                $("#overlay_product_subscription #overlay_product_subscription_agree").css("display", "block");
            } else {
                $("#overlay_product_subscription #overlay_product_subscription_agree").css("display", "none");
            }

            if(typeof input_checkbox_alter !== 'undefined' && $.isFunction(input_checkbox_alter)) input_checkbox_alter();

            $("#product_subscribe_privacy_policy").prop("checked",false);
            $("#overlay_product_subscription").overlay().load();

            logged_in = 0;
        } else {
            if (params['id']=="product_subscription") {
                $("#overlay_product_subscription .overlay_title").text($("#overlay_product_subscription .overlay_title_hidden").val());

                $("#overlay_product_subscribe_no_login").show();
                $(".overlay_row").show();
                $(".overlay_privacy_policy").show();
                $(".overlay_subscribe_button").show();
                $("#product_subscribe_no_login_privacy_policy").prop("checked",false);
                $(".overlay_text").show();
                $("#overlay_product_subscribe_no_login input[name='email']").val("").focusout();
                $("#overlay_product_subscribe_no_login input[name='address']").val("").focusout();
                $("#overlay_product_subscribe_no_login input[name='name']").val("").focusout();
                if (newsletter !== 1){
                    $("#overlay_product_subscribe_no_login input[name='address']").closest('.overlay_row').hide();
                    $("#overlay_product_subscribe_no_login input[name='name']").closest('.overlay_row').hide();
                }

                $("#overlay_product_subscription").overlay().load();

                if(typeof input_checkbox_alter !== 'undefined' && $.isFunction(input_checkbox_alter)) input_checkbox_alter();

                $("#overlay_product_subscribe_no_login .overlay_subscribe_button").off('click').on("click", function () {
                    var email = $("#overlay_product_subscribe_no_login input[name='email']").val();

                    $(".subscribe_validation_error #privacy").hide();
                    $(".subscribe_validation_error #email").hide();
                    $(".subscribe_validation_error #not_valid_email").hide();

                    if (email=="") {
                        $(".subscribe_validation_error").show();
                        $("#email").show();
                        setTimeout(function () {
                            $(".subscribe_validation_error #email").hide();
                            $(".subscribe_validation_error").hide();
                        }, 3000);
                    } else {
                        var email_valid = false;

                        $.ajax({
                            type:"GET",
                            url:shop_url_main+"/shop_ajax/ajax_validate.php",
                            dataType:"json",
                            data: {
                                get_ajax:1,
                                action:"email",
                                email_to_check: email
                            },
                            success: function (result) {
                                if (result.success) email_valid=true;

                                if (email_valid) {
                                    if ($("#product_subscribe_no_login_privacy_policy:checked").length>0) {
                                        $(".overlay_row").hide();
                                        $(".overlay_privacy_policy").hide();
                                        $(".overlay_subscribe_button").hide();

                                        $("#overlay_product_subscription").overlay().close();
                                        $("#product_subscribe_no_login_privacy_policy").parent().removeClass("text_input_checkbox_checked").addClass("text_input_checkbox_unchecked").attr("rel_checked",0);

                                        setTimeout(function () {
                                            logged_in = 1;
                                            handle_product_subscribe(product_subscribe_params['sku'],email,product_subscribe_params['type'],product_subscribe_params['price']);
                                        }, 750);
                                    } else {
                                        $(".subscribe_validation_error").show();
                                        $(".subscribe_validation_error #privacy").show();
                                        setTimeout(function () {
                                            $(".subscribe_validation_error #privacy").hide();
                                            $(".subscribe_validation_error").hide();
                                        }, 3000);
                                    }
                                } else {
                                    $(".subscribe_validation_error").show();
                                    $(".subscribe_validation_error #not_valid_email").show();

                                    setTimeout(function () {
                                        $(".subscribe_validation_error").hide();
                                        $(".subscribe_validation_error #not_valid_email").hide();
                                    }, 3000);
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/// szállítási cím betöltés
function disable_address_inputs (type) {
    $("select[name='"+type+"_orszag']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_nev']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_irany']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_varos']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_megye']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_utca']").prop("disabled",true).addClass("disabled");
    if ($("input[name='"+type+"_ado']").length>0) $("input[name='"+type+"_ado']").prop("disabled",true).addClass("disabled");
    if ($("input[name='"+type+"_ado_eu']").length>0) $("input[name='"+type+"_ado_eu']").prop("disabled",true).addClass("disabled");

    $("input[name='"+type+"_utcanev']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_kozterulet']").prop("disabled",true).addClass("disabled");
    $("input[name='"+type+"_hazszam']").prop("disabled",true).addClass("disabled");
}
function enable_address_inputs (type,result) {
    $("select[name='"+type+"_orszag']").prop("disabled",false).addClass("disabled").removeClass("disabled");
    $("select[name='"+type+"_orszag'] option[value='"+result.orszag+"']").prop("selected",true);
    $("input[name='"+type+"_nev']").val(result.nev).prop("disabled",false).removeClass("disabled");
    $("input[name='"+type+"_irany']").val(result.irany).prop("disabled",false).removeClass("disabled");
    $("input[name='"+type+"_varos']").val(result.varos).prop("disabled",false).removeClass("disabled");
    $("input[name='"+type+"_megye']").val(result.megye).prop("disabled",false).removeClass("disabled");
    $("input[name='"+type+"_utca']").val(result.utca).prop("disabled",false).removeClass("disabled");
    if ($("input[name='"+type+"_ado']").length>0) $("input[name='"+type+"_ado']").val(result.adoszam).prop("disabled",false).removeClass("disabled");
    if ($("input[name='"+type+"_ado_eu']").length>0) $("input[name='"+type+"_ado_eu']").val(result.eu_adoszam).prop("disabled",false).removeClass("disabled");

    if (result.utcanev!=undefined) $("input[name='"+type+"_utcanev']").val(result.utcanev).prop("disabled",false).removeClass("disabled");
    if (result.kozterulet!=undefined) $("input[name='"+type+"_kozterulet']").val(result.kozterulet).prop("disabled",false).removeClass("disabled");
    if (result.hazszam!=undefined) $("input[name='"+type+"_hazszam']").val(result.hazszam).prop("disabled",false).removeClass("disabled");
}
function delete_address_check() {
    var count_of_addresses=$(".delete_address").closest("#div_out_default_address").find(".addresses").find("option").length-1;
    if (count_of_addresses<=1) {
        $("#overlay_delete_address_error").overlay().load();
    } else {
        $("#overlay_delete_address").overlay().load();
    }

}
function reset_address_select(select) {
    var first_address=$("#"+select+" option").get(1);

    $(first_address).prop("selected",true);
    $("#"+select).trigger("change");

    if (unas_design_ver>=3) {
        if ($(first_address).val()!==undefined) {
            $("#div_out_default_address").find(".select-options").find("li[rel='"+$(first_address).val()+"']").addClass("ez");
            $("#div_out_default_address").find(".select-styled").text($(first_address).text());

            $("#div_out_other_address").find(".select-options").find("li[rel='"+$(first_address).val()+"']").addClass("ez");
            $("#div_out_other_address").find(".select-styled").text($(first_address).text());
        }
    }
}

function remove_from_ul (outer_div,temp_master_key) {
    var select_elem=$(outer_div).find(".select-options");
    $(select_elem).find("li[rel='"+temp_master_key+"']").remove();
}

function delete_address() {
    var temp_master_key=$(".delete_address").closest("#div_out_default_address").find(".addresses").val();
    
    $.ajax({
        url: "shop_reg.php",
        type: "GET",
        async: true,
        dataType: "JSON",
        data: {
            action: "delete_address",
            master_key: temp_master_key
        },
        success: function (result) {
            if (result) {
                $("#select_default_shipping_address option").each(function () { if ($(this).val()==temp_master_key) $(this).remove(); });
                $("#select_default_billing_address option").each(function () { if ($(this).val()==temp_master_key) $(this).remove(); });
                if (unas_design_ver>=3) {
                    remove_from_ul("#div_out_default_address",temp_master_key);
                    remove_from_ul("#div_out_other_address",temp_master_key);
                }
                reset_address_select("div_out_default_address .addresses");
                reset_address_select("div_out_other_address .addresses");
            }
        }
    });
}
$(document).ready(function () {
    var default_type="";
    var other_type="";
    var default_value = $("#default").val();

    if (default_value=="billing") {
        default_type="szam";
        other_type="szall";
    }

    if (default_value=="shipping") {
        default_type="szall";
        other_type="szam";
    }

    $(".addresses").on('change',function() {
        if ($(this).find('option:checked').val()=="") {
           if ($(this).attr('id').indexOf($("#default").val())>=0) {
               $("#newcust_default_mod input[type='text']").val("");
               $("#newcust_default_mod .delete_address").hide();
           }
           if ($(this).attr('id').indexOf($("#other").val())>=0) {
               $("#newcust_other_mod input[type='text']").val("");
           }
        } else {
            var temp_id=$(this).attr("id");

            if (temp_id.indexOf($("#default").val())>=0) {
                disable_address_inputs(default_type);
                $("#newcust_default_mod .delete_address").show();
            }
            if (temp_id.indexOf($("#other").val())>=0) disable_address_inputs(other_type);

            $.ajax({
                async:true,
                type: "GET",
                url: "shop_reg.php",
                dataType: "JSON",
                data: {
                    action: "get_address",
                    master_key:$(this).find('option:checked').val()
                },
                success: function (result) {
                    if (temp_id.indexOf($("#default").val())>=0) enable_address_inputs(default_type,result);
                    if (temp_id.indexOf($("#other").val())>=0) enable_address_inputs(other_type,result);
                }
            });
        }
    });
});

/////////////////////////////////////////////////////////////////////
///company selector
function show_vat_element() {
    $("#div_out_other_vat").show();
    $("#div_out_other_eu_vat").show();

    $("#div_out_default_vat").show();
    $("#div_out_default_eu_vat").show();

    if ($("#shipping_same").prop("checked") && $("#div_out_other_vat").length>0) {
        $("#shipping_same").prop("checked",false);
        shipping_same_action();
    }
}

function hide_vat_element() {
    $("#div_out_other_vat").hide();
    $("#div_out_other_eu_vat").hide();
    $("#div_out_other_vat input[name='szam_ado']").val("");
    $("#div_out_other_eu_vat input[name='szam_ado_eu']").val("");

    $("#div_out_default_vat").hide();
    $("#div_out_default_eu_vat").hide();
    $("#div_out_default_vat input[name='szam_ado']").val("");
    $("#div_out_default_eu_vat input[name='szam_ado_eu']").val("");
}

function handle_vat_on_click(temp_val) {
    temp_val = parseInt(temp_val);
    if (temp_val===0 || temp_val===2) hide_vat_element(); else show_vat_element();
}

$(document).ready(function () {
    if ($("input[name='choose_company']").length>1) {
        if ($("input[name='choose_company']:checked").val()==1) {
            show_vat_element();
        } else {
            hide_vat_element();
        }
    }

    $("input[name='choose_company']").on('click',function () {
        handle_vat_on_click($(this).val());
    });
});

/////////////////////////////////////////////////////////////////////
// click product
$(document).ready(function () {
    $('#container').on("click",".product_link_normal",function () {
        var temp_click_sku=get_product_sku($(this));
        $(document).trigger("clickProduct", {sku:temp_click_sku,type:'normal'});
    });
    $('#container').on("click",".product_link_promo",function () {
        var temp_click_sku=get_product_sku($(this));
        $(document).trigger("clickProduct", {sku:temp_click_sku,type:'promo'});
    });
});

/////////////////////////////////////////////////////////////////////
// scroll to element - headert mindig beleszámolja alapból
function scroll_to_element(el,offset,scrollIn) {
    var $offset = offset || 10;
    var $scrollIn;
    var $scrollTop = 0;
    var $offsetFull;
    if ( scrollIn === undefined ) {
        $scrollIn = 'html,body';
        $offsetFull = $offset + getHeaderHeight();
        $scrollTop = $(el).offset().top;
    } else {
        $scrollIn = scrollIn;
        $scrollTop = $(el).offset().top - $(window).scrollTop() + $($scrollIn).scrollTop();
        $offsetFull = 50;
    }

    $($scrollIn).animate({
            scrollTop: $scrollTop - $offsetFull},
        'slow');
}

/////////////////////////////////////////////////////////////////////
// textarea character counter
function textareaCharacterCounter(selector,maxlength){
    $(selector).keyup(function() {
        var characterCount = $(this).val().length,
            current = $(selector+'__current'),
            maximum = $(selector+'__maximum'),
            theCount = $(selector+'__count');
        current.text(characterCount);
        if (characterCount >= (maxlength*0.8)) {
            maximum.css('color', '#ff6666');
            current.css('color', '#ff6666');
        } else {
            maximum.css('color','inherit');
            current.css('color','inherit');
        }
        if (characterCount === maxlength){
            theCount.css('font-weight','bold');
        }else{
            theCount.css('font-weight','normal');
        }
    });
}

/////////////////////////////////////////////////////////////////////
// load page
$(document).ready(function () {
    if (UNAS.design!=undefined && UNAS.design.page!="") {
        $(document).trigger("loadPage", {page:UNAS.design.page});
    }
});

/////////////////////////////////////////////////////////////////////
// JS API
var UNAS = UNAS || {};

UNAS.data=new Array();
function get_ajax_api(handleData,action,data) {
    if (UNAS.data[action]!=undefined && data=="") {
        handleData(UNAS.data[action]);
    } else {
        $.ajax({
            type: "GET",
            async: true,
            dataType: 'json',
            url: shop_url_main+'/shop_ajax/api.php',
            data: {
                get_ajax:1,
                api_auth:UNAS.api_auth,
                action:action,
                data:data
            },
            success: function(result) {
                UNAS.data[action]=result;
                handleData(UNAS.data[action]);
            }
        });
    }
}

function popupCloseTrigger (popup_id) {
    var temp_popup_array = {};
    temp_popup_array['popupId']=popup_id;
    $(document).trigger("popupClosed", temp_popup_array);
}

var order_delete_key;
function button_delete_order(key) {
    order_delete_key = key;
    $("#overlay_delete_order").overlay().load();
}

function order_delete_action (key) {
    location.href=shop_url_main+'/shop_order_track_det.php?key='+key+'&action=order_delete';
}

/**
 * A visszáru funkció frontos logikáját kezelő Objektum
 * @param config - különböző beállítások a kinézetek függvényében
 */
function returnOrderViewHandler (config) {
    var $returnOrderViewHandler = this;

    if (typeof config.design1500 === "undefined") config.design1500 = false;
    if (typeof config.convertClickedIndex === "undefined") config.convertClickedIndex = true;

    $returnOrderViewHandler.check = function ($this,errorRemoveDisable) {
        if (typeof errorRemoveDisable === "undefined") errorRemoveDisable = 0;
        $($this).prop("checked",true);

        if (config.design1500) {
            $($this).closest("."+config.design1500Config.checkBoxClass).removeClass(config.design1500Config.checkBoxUnCheckedClass);
            $($this).closest("."+config.design1500Config.checkBoxClass).addClass(config.design1500Config.checkBoxCheckedClass);
            $($this).closest("."+config.design1500Config.checkBoxClass).attr("rel_checked",1);
            
            if (config.typeInput) {
                $($this).closest(config.rowItem).find(config.inputItem).prop("readonly",false);
            } else {
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).removeClass("disabled");
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).find(config.inputItem).prop("disabled",false);
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).closest(".select").find(config.inputItem).removeAttr("disabled","disabled");
            }

            $($this).closest(config.rowItem).addClass("checked");
        } else {
            $($this).closest(config.rowItem).find((config.typeInput!==1) ? "select"+config.inputItem : config.inputItem).prop((config.typeInput!==1) ? "disabled" : "readonly",false);
            $($this).closest(config.rowItem).addClass("checked");
        }

        if (!errorRemoveDisable) $returnOrderViewHandler.removeError($this);
    };

    $returnOrderViewHandler.unCheck = function ($this) {
        $($this).prop("checked",false);

        if (config.design1500) {
            $($this).closest("."+config.design1500Config.checkBoxClass).removeClass(config.design1500Config.checkBoxCheckedClass);
            $($this).closest("."+config.design1500Config.checkBoxClass).addClass(config.design1500Config.checkBoxUnCheckedClass);
            $($this).closest("."+config.design1500Config.checkBoxClass).attr("rel_checked",0);

            if (config.typeInput) {
                $($this).closest(config.rowItem).find(config.inputItem).prop("readonly",true);
            } else {
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).addClass("disabled");
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).find(config.inputItem).prop("disabled",true);
                $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).closest(".select").find(config.inputItem).attr("disabled","disabled");
            }

            $($this).closest(config.rowItem).removeClass("checked");
        } else {
            $($this).closest(config.rowItem).find((config.typeInput!==1) ? "select"+config.inputItem : config.inputItem).prop((config.typeInput!==1) ? "disabled" : "readonly",true);
            $($this).closest(config.rowItem).removeClass("checked");
        }

        $returnOrderViewHandler.removeError($this);
    };

    $returnOrderViewHandler.pairItemWithDiscount = function (checkBoxItems,sku,checked,clickedIndex) {
        if (config.convertClickedIndex) clickedIndex = clickedIndex - 2;

        $(checkBoxItems).each(function (currentIndex) {
            var $this=$(this);
            if (currentIndex!==(clickedIndex)) {
                if (sku===$($this).attr("data-sku")) {
                    (checked)
                        ? $returnOrderViewHandler.check($this,config.typeInput)
                        : $returnOrderViewHandler.unCheck($this,config.typeInput);
                }
            }
        });
    };

    $returnOrderViewHandler.removeError = function ($this) {
        if ($($this).closest(config.rowItem).hasClass(config.errorClass))
            $($this).closest(config.rowItem).removeClass(config.errorClass);
    };

    $returnOrderViewHandler.isAnyChecked = function (onload) {
        if (onload===1) {
            var returnItem = (config.design1500)
                ? $(config.returnItem).find("input[type='checkbox']:checked")
                : config.returnItem+":checked";

            $(returnItem).each(function() {
                var $this=$(this);
                $returnOrderViewHandler.check($this,1);
            });
        }

        $(config.returnSendButton).prop("disabled",$(config.rowItem+".checked").length<1)
    };

    $returnOrderViewHandler.filterMods = function (selectedPaymentType) {
        var itemCount = $(config.customerParamRowClass).length;

        $(config.customerParamRowClass).each(function() {
            var $this=$(this);
            var actualPaymentType = $($this).attr(config.paymentTypeAttr);

            if (actualPaymentType===selectedPaymentType || actualPaymentType==="always") {
                $($this).show().addClass(config.visibleClass).removeClass(config.notVisibleClass);
            } else {
                $($this).hide().addClass(config.notVisibleClass).removeClass(config.visibleClass);
            }
        });

        var countOfNotVisibleItems = $(config.customerParamRowClass+"."+config.notVisibleClass).length;
        (countOfNotVisibleItems===itemCount) ? $(config.customerParamWrapper).hide() : $(config.customerParamWrapper).show();
    };

    $returnOrderViewHandler.returnItemClick = function () {
        $(config.returnItem).on("click",function () {
            var $this=$(this);
            var sku = (config.design1500)
                ? $($this).find(config.design1500Config.returnItem).attr("data-sku")
                : $($this).attr("data-sku");
            
            $returnOrderViewHandler.removeError($this);

            if (config.design1500) {
                (!$($this).hasClass(config.design1500Config.checkBoxCheckedClass.replace(".","")))
                    ? $($this).closest(config.rowItem).addClass("checked")
                    : $($this).closest(config.rowItem).removeClass("checked");
            } else {
                ($($this).prop("checked"))
                    ? $($this).closest(config.rowItem).addClass("checked")
                    : $($this).closest(config.rowItem).removeClass("checked");
            }

            $returnOrderViewHandler.pairItemWithDiscount(
                (config.design1500) ? config.design1500Config.returnItem : config.returnItem,
                sku,
                (config.design1500)
                    ? !$($this).hasClass(config.design1500Config.checkBoxCheckedClass.replace(".",""))
                    : $($this).prop("checked"),
                $($this).closest(config.rowItem).index()
            );
        });

        $(config.returnItem).click(function () {
            var $this=$(this);

            $($this).closest(config.rowItem)
                .find((config.typeInput!==1) ? "select"+config.inputItem : config.inputItem)
                .prop(
                    (config.typeInput!==1)
                        ? "disabled"
                        : "readonly",
                    (config.design1500)
                        ? $($this).hasClass(config.design1500Config.checkBoxCheckedClass.replace(".",""))
                        : !$($this).prop("checked")
                );

            if (config.design1500 && config.typeInput!==1) {
                ($($this).hasClass(config.design1500Config.checkBoxCheckedClass.replace(".","")))
                    ? $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).addClass("disabled")
                    : $($this).closest(config.rowItem).find(config.design1500Config.selectWrapper).removeClass("disabled");
            }

            $returnOrderViewHandler.isAnyChecked(0);
        });
    };

    $returnOrderViewHandler.paymentRadioClick = function () {
        $(config.paymentRadioClass).click(function(){
           var $this=$(this);
           $returnOrderViewHandler.filterMods(
               (config.design1500) ? $($this).find("input[type='radio']").attr("data-type") : $($this).attr("data-type"),
               config.customerParamRowClass,
               config.paymentTypeAttr,
               config.visibleClass,
               config.notVisibleClass,
               config.customerParamWrapper
           );
        });
    };

    $returnOrderViewHandler.customerParameterRadioClick = function() {
        $(function () { $(config.customerParameterRadio+":checked").click(); });

        $(config.customerParameterRadio).on("click", function() {
            var id = (config.design1500)
                ? $(this).find(config.design1500Config.customerParameterRadioInput).attr("id")
                : $(this).attr("id");

            var split = id.split("_");
            var value = (config.design1500)
                ? $(this).find(config.design1500Config.customerParameterRadioInput).val()
                : $(this).val();

            $("#cust_param_hidden_"+split[3]).val(value);
        });
    };
}

/**
 * Vásárló felületen elemek szűrését megvalósító JS prototípus.
 *
 * $filterByTag
 * $filterTag
 * $filterTagActive
 * $filterableElement
 * $filterableElementWrapper
 * $filterTagsWrapper
 * $filterClearTag
 * $page
 * $filterDo
 * $config
 *
 */
function filterByTag (config) {
    var $filterByTag = this;
    var $filterTag = "js-filter-by-tag";
    var $filterTagActive = "js-active-filter";
    var $filterableElement = "js-filterable";
    if ($("."+$filterableElement).length<0) $filterableElement = "js-fitlerable";
    var $filterableElementWrapper = "js-filterable-elements-wrapper";
    if ($("."+$filterableElementWrapper).length<0) $filterableElementWrapper = "js-fitlerable-elements-wrapper";
    var $filterTagsWrapper = "js-tags";
    var $filterClearTag = "js-clear-tag-filter";
    var $loadingClass = "loading"
    var $page = 1;
    var $filterDo = "js-do-filter";
    var $config = config || {};

    $filterByTag.filterInit = function () {
        $("."+$filterTag).on("click", function () {
            var _this=$(this);
            $filterByTag.filter(null,_this);
        });
    }

    $filterByTag.clearFilterInit = function() {
        $("."+$filterClearTag).on("click", function () {
            var _this=$(this);


            $filterByTag.$page = 1;

            $("."+$filterTag).removeClass($filterTagActive);
            $filterByTag.filter({},_this);

            (unas_design_ver>=4) ? $(_this).addClass("d-none") : $(_this).hide();
        });
    }

    $filterByTag.filterInitAJAX = function () {
        $("."+$filterTag).on("click", function () {
            var _this=$(this);
            $filterByTag.checkActiveElement(_this);
            $filterByTag.filter($filterByTag.getDataFilter(),_this);
        });
    }

    $filterByTag.checkActiveElement = function (_this) {
        if ($(_this).hasClass($filterTag)) {
            if ($(_this).hasClass($filterTagActive)) {
                $(_this).removeClass($filterTagActive);
            } else {
                $(_this).addClass($filterTagActive);
            }
        }

        if (unas_design_ver>=4) {
            if ($("."+$filterTagActive).length<1) $(".js-clear-tag-filter").addClass("d-none"); else $(".js-clear-tag-filter").removeClass("d-none");
        } else {
            if ($("."+$filterTagActive).length<1) $(".js-clear-tag-filter").css("display","none"); else $(".js-clear-tag-filter").css("display","inline-block");
        }
    }

    $filterByTag.filter = function (dataFilter,_this) {
        switch(config.type) {
            case "category":
                $filterByTag.checkActiveElement(_this);

                $("."+$filterableElement).hide();

                $('.'+$filterTagsWrapper+" ."+$filterTag+"."+$filterTagActive).each(function() {
                    var tag = $(this).attr("data-filter");
                    var classNames = '.' + tag;
                    $("."+$filterableElement).filter(classNames).show();
                });

                if ($('.'+$filterTag+'.'+$filterTagActive).length<1) $("."+$filterableElement).show();
                break;
            case "content":
                if (typeof config.loadingClass !=="undefined" && config.loadingClass!=="") $loadingClass = config.loadingClass;
                $.ajax({
                    type: "POST",
                    url: UNAS.shop.base_url+"/shop_ajax/ajax_content.php?change_lang="+actual_lang,
                    data: {
                        get_ajax:1,
                        action:"filter",
                        page: UNAS.shop.page_id,
                        ajax_nodesign: 1,
                        shop_id: shop_id,
                        filter_tags: dataFilter,
                        page_act_ajax: $filterByTag.$page
                    },
                    beforeSend: function () {
                        $("."+$filterableElementWrapper).html("");
                        $("."+$filterableElementWrapper).addClass($loadingClass);
                    },
                    success: function (response) {
                        $("."+$filterableElementWrapper).removeClass($loadingClass);
                        $("."+$filterableElementWrapper).html(response)
                    }
                });
                break;
        }
    }

    $filterByTag.getDataFilter = function () {
        var dataFilter = {};

        $("."+$filterTagActive).each(function(index, el) {
            dataFilter[index] = $(el).attr("data-filter").replace("js-filterable-","").replace("js-fitlerable-");
        });

        return dataFilter;
    }

    $filterByTag.pagination = function (page) {
        $filterByTag.$page = (typeof page === "undefined") ? 1 : page;
        $filterByTag.filter($filterByTag.getDataFilter(),null);
    }
}

/*** PRODUCT REVIEW FILE UPLOADER ***/
function reviewFileUploader (sku) {
    var reviewFileUploader = this;

    reviewFileUploader.sku = sku;

    reviewFileUploader.BaseAJAXURL = UNAS.shop.base_url+"/shop_ajax/ajax_review_image.php";

    reviewFileUploader.init = function () {
        $(document).on("reviewImagesLoaded", function () {
            reviewFileUploader.reviewImageDeleteClickHandler();
            reviewFileUploader.selectImageClickHandler();
        });

        $(document).ready(function () {
            reviewFileUploader.reviewImageDeleteClickHandler();
            reviewFileUploader.reviewImageRandom = $("#review_image_random").val();
            reviewFileUploader.selectImageClickHandler();
        });
    };

    reviewFileUploader.reviewImageDeleteClickHandler = function () {
        $(".js-review-image-delete").off().on("click", function () {
            var _this=$(this);
            reviewFileUploader.delete(_this);
        });
    };

    reviewFileUploader.selectImageClickHandler = function () {
        $(".js-review-image-upload").off().on("click", function () {
            var _this=$(this);

            var imageNumber = $(_this).closest(".js-review-image-upload-outer").data("image-number")

            if ($(".js-review-images .js-review-image-" + imageNumber).hasClass("has-fault")) {
                $(".js-review-images .js-review-image-" + imageNumber).removeClass("has-fault");
            }

            if (! $(".js-review-image-" + imageNumber + " .js-review-image-errors").hasClass("d-none")) {
                $(".js-review-image-" + imageNumber + " .js-review-image-errors").addClass("d-none");
            }
        });
    };

    reviewFileUploader.upload = function (imageNumber) {
        if ($("#review-images-file-upload-" + imageNumber).val() ==="") {
            return;
        }

        $.ajax({
            type: "POST",
            url: reviewFileUploader.BaseAJAXURL,
            data: reviewFileUploader.getFormData(imageNumber, "upload"),
            dataType: "JSON",
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $(".js-review-image-" + imageNumber + " .js-review-image-upload").addClass("d-none");
                $(".js-review-image-" + imageNumber + " .js-review-image-wrapper").removeClass("d-none");
            },
            success: function (response) {
                if (response.error) {
                    if (! $(".js-review-images .js-review-image-" + imageNumber).hasClass("has-fault")) {
                        $(".js-review-images .js-review-image-" + imageNumber).addClass("has-fault");
                    }

                    $(".js-review-image-" + imageNumber + " .js-review-image-upload").removeClass("d-none");
                    $(".js-review-image-" + imageNumber + " .js-review-image-wrapper").addClass("d-none");
                    $(".js-review-images .js-review-image-" + imageNumber + " .js-review-image-delete").addClass("d-none");
                    $(".js-review-image-" + imageNumber + " .loading-spinner").removeClass("d-none");
                    $(".js-review-image-" + imageNumber + " .js-review-image-errors").removeClass("d-none");

                    $(".js-review-image-" + imageNumber + " .js-review-image-errors").html(response.message);
                }

                if (response.success) {
                    $(".js-review-image-" + imageNumber + " .js-review-image-wrapper .loading-spinner").addClass("d-none");
                    $(".js-review-images .js-review-image-" + imageNumber + " .js-review-image-content").html(response.image);
                    $(".js-review-images .js-review-image-" + imageNumber + " .js-review-image-delete").removeClass("d-none");

                    $("#review-images-file-upload-" + imageNumber).val('');

                    $(document).trigger("reviewImagesLoaded");
                }
            }
        });
    };

    reviewFileUploader.delete = function (deleteIcon) {
        var imageNumber = $(deleteIcon).data("image-number");

        $.ajax({
            type: "POST",
            url: reviewFileUploader.BaseAJAXURL,
            data: reviewFileUploader.getFormData(imageNumber, "delete"),
            dataType: "JSON",
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $(".js-review-image-" + imageNumber + " .loading-spinner").removeClass("d-none");
                $(".js-review-image-" + imageNumber + " .js-review-image-content").html("");
                $(".js-review-images .js-review-image-" + imageNumber + " .js-review-image-delete").addClass("d-none");
            },
            success: function () {
                $(".js-review-image-" + imageNumber + " .js-review-image-upload").removeClass("d-none");
                $(".js-review-image-" + imageNumber + " .js-review-image-wrapper").addClass("d-none");
                $(".js-review-image-" + imageNumber + " .loading-spinner").removeClass("d-none");
            }
        });
    };

    reviewFileUploader.getFormData = function (imageNumber, action) {
        reviewFileUploader.formData = new FormData();

        reviewFileUploader.formData.append('review_image', $("#review-images-file-upload-" + imageNumber)[0].files[0]);
        reviewFileUploader.formData.append("action", action);
        reviewFileUploader.formData.append("sku", reviewFileUploader.sku);
        reviewFileUploader.formData.append("imageNumber", imageNumber);
        reviewFileUploader.formData.append("reviewImageRandom", reviewFileUploader.reviewImageRandom);

        return reviewFileUploader.formData;
    };
}

/**
 * Felugró részletek ablakban tartalmat cserélő függvény.
 */
function ajaxProductTooltip(sku,target){
    $.ajax({
        type: "GET",
        url: shop_url_main + "/shop_artdet.php",
        data: "ajax_tooltip=1&get_ajax=1&ajax_nodesign=1&cikk=" + sku + '&change_lang=' + actual_lang,
        beforeSend: function(){
            $(document).trigger('ajaxProductTooltipLoading');
        },
        success: function(result) {
            $(target).html(result);
            $(document).trigger('ajaxProductTooltipLoaded');
        }
    });
}

//on
UNAS.onLoadPage = function (api_function) { $(document).on("loadPage",api_function); };

UNAS.onAddToCart = function (api_function) { $(document).on("addToCart",api_function); };
UNAS.onRemoveFromCart = function (api_function) { $(document).on("removeFromCart",api_function); };
UNAS.onModifyCart = function (api_function) { $(document).on("modifyCart",api_function); };
UNAS.onEmptyCart = function (api_function) { $(document).on("emptyCart",api_function); };

UNAS.onClickOrderButton = function (api_function) { $(document).on("clickOrderButton",api_function); };
UNAS.onClickProduct = function (api_function) { $(document).on("clickProduct",api_function); };

UNAS.onChangeProductQty = function (api_function) { $(document).on("changeProductQty",api_function); };
UNAS.onChangeVariant = function (api_function) { $(document).on("changeVariant",api_function); };
UNAS.onChangePaymentType = function (api_function) { $(document).on("changePaymentType",api_function); };
UNAS.onChangeShippingType = function (api_function) { $(document).on("changeShippingType",api_function); };

UNAS.onGrantConsent = function (api_function) { $(document).on("grantConsent",api_function); };
UNAS.onRejectConsent = function (api_function) { $(document).on("rejectConsent",api_function); };

UNAS.onPopupOpen = function (api_function) { $(document).on("popupOpen",api_function); };
UNAS.onOverlayOpen = function (api_function) { $(document).on("overlayOpen",api_function); };
//UNAS.onOverlayAjaxLoaded = function (api_function) { $(document).on("overlayAjaxLoaded",api_function); };

//get
UNAS.getShop = function(handleData) { handleData(UNAS.shop); };
UNAS.getCustomer = function(handleData) { get_ajax_api(handleData,"getCustomer",""); };
UNAS.getCart = function(handleData) { get_ajax_api(handleData,"getCart",""); };
UNAS.getOrder = function(handleData) { get_ajax_api(handleData,"getOrder",""); };
UNAS.getProduct = function(handleData,data) { get_ajax_api(handleData,"getProduct",data); };

//test
/*UNAS.onAddToCart(function(event,params){
    console.log(params);
});*/
/*UNAS.getCart(function(result) {
    console.log(result);
});*/
/*UNAS.getProduct(function(result) {
    console.log(result);
},{sku:"teszt1"});*/
/*UNAS.onClickProduct(function(event,params){
    console.log(params);
});*/



/////////////////////////////////////////////////////////////////////
