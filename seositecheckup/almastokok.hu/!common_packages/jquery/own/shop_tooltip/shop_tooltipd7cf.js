$(document).ready(function(){
	var currentID;
	$.shop_popup("open", {
		id: 'PopupContainer_tooltip',
		ajax_url: 'no',
		ajax_loader: false,
        overflow: ''
	});
	$('#page_PopupContainer_tooltip').hover(function(){
		$('#page_PopupContainer_tooltip').attr('data-hoverIntentAttached',1);
	}, function() {
		if (unas_design_ver<3 || (typeof shop_tooltip_mouseout_hide!=='undefined' && shop_tooltip_mouseout_hide==1)) {
			$.shop_popup("close");
			$('#page_PopupContainer_tooltip').css("display","none");
		}
		$('#page_PopupContainer_tooltip').attr('data-hoverIntentAttached',0);
	});

    $(document).bind('ajaxStop', function() {
        product_tooltip();
	});
    product_tooltip();
});

function product_tooltip() {
    if (typeof config_plus['product_tooltip']!=='undefined' && config_plus['product_tooltip']==1) {
        $(".page_PopupTrigger, .product_tooltip_hover, .js-product-tooltip-hover").hoverIntent({
            over: function () {
                currentID = $(this).attr('data-sku');
                if (currentID == '') return;
                $.shop_popup("open", {
                    id: 'PopupContainer_tooltip',
                    ajax_url: shop_url_main + '/shop_artdet.php',
                    ajax_data: 'ajax_tooltip=1&get_ajax=1&cikk=' + currentID + '&change_lang=' + actual_lang,
                    overflow: '',
                    popupId: 'tooltip'
                });
            },
            out: function () {
                if ($('#page_PopupContainer_tooltip').attr('data-hoverIntentAttached') != 1) {
                    $.shop_popup("close");
                    $('#page_PopupContainer_tooltip').css("display", "none");
                }
            },
            timeout: 400,
            interval: 400,
            sensitivity: 8
        });
    }

    $(".product_tooltip_click, .js-product-tooltip-click").unbind("click");
    $(".product_tooltip_click, .js-product-tooltip-click").click(function(event){
        event.preventDefault();
        var modal = 0;
        if (unas_design_ver>=4) modal=0.7;
        currentID = $(this).attr('data-sku');
        if (currentID == '') return;
        if (typeof config_plus['product_tooltip']!=='undefined' && config_plus['product_tooltip']==1) {
            $('#page_PopupContainer_tooltip').attr('data-hoverIntentAttached', 1);
            $.shop_popup("open", {
                id: 'PopupContainer_tooltip',
                ajax_url: shop_url_main + '/shop_artdet.php',
                ajax_data: 'ajax_tooltip=1&get_ajax=1&cikk=' + currentID + '&change_lang=' + actual_lang,
                overflow: '',
                popupId: 'tooltip',
                modal: modal,
                closeClick: false
            });
        } else {
            location.href=unas_shop_url+'/spd/'+currentID+'/';
        }
    });
}