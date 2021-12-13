var $ = jQuery;
var windw = this;

$( document ).ready(function() {
	$('section>div.container').removeClass('width_fixer');
	//Append list items for mobile menu
    $('.align-right').appendTo('#menu-mainnav');

    //Close top bar
    $('.top-bar-close').click(function() {
	  $('#topbar').fadeOut();
	});

    //Clone of masonry controls to sidebar
    $('.portfolio-filter').clone().addClass('displayFilter').appendTo( "#primary-sidebar" );
	
	//Create add-on to order sidebar items
	$.fn.orderChildren = function(order) {
		this.each(function() {
			var el = $(this);
			for(var i = order.length - 1; i >= 0; i--) {
				el.prepend(el.children(order[i]));
			}
		});
		return this;
	};

	//Call the add-on
	$(".portfolio-filter.displayFilter").orderChildren([
		".js-widget-title",
		"[data-filter='.resource-item']",
		"[data-filter='.upcoming-webinars']",
		"[data-filter='.on-demand-webinars']",
		"[data-filter='.agency-perspectives']",
		"[data-filter='.blog']",
		"[data-filter='.case-study']",
		"[data-filter='.comparison-guides']",
		"[data-filter='.ebooks']",
		"[data-filter='.infographic']",
		"[data-filter='.white-paper']"
	]);

    //Sets the form up in the header for certain resources
    var body_tag = $('body');
	if (body_tag.hasClass('comparison-guides') || body_tag.hasClass('cool-stuff') || body_tag.hasClass('infographic') || body_tag.hasClass('white-paper') || body_tag.hasClass('agency-perspectives')) {
        ss_pull_myform_up();

        $(window).resize(function() {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function(){
                ss_pull_myform_up();
            }, 250);
        });
    }

	// Mobile form device hidden field
	// This will fire when document is ready:
	$(window).resize(function() {
		if($(window).width() >= 769) {
			// Desktop
			$(".device").html('<input type="hidden" name="Device" value="Desktop" class="wpcf7-form-control wpcf7-hidden">');
		} else {
			// Mobile
			$(".device").html('<input type="hidden" name="Device" value="Mobile" class="wpcf7-form-control wpcf7-hidden">');
		}
	}).resize(); // This will simulate a resize to trigger the initial run.

	/*************************************************************************************************************************************/
	// This will add a class noTaglineLandingPage to <body> if the page is a landing page and the title of the page contains Hustle or WSI
	// If the page is a landing page and the title of the page does not contain Hustle or WSI it will add class TaglineLandingPage to <body>
    // If the page is a not a landing page it will add class notLandingPage to <body>
	//The idea is to have a particular class to create style and target these particular pages.
    var title = document.title;
    if ($('body').hasClass('page-template-landing-page')) {
        if ((title.toLowerCase().indexOf("hustle") >= 0) || (title.toLowerCase().indexOf("wsi") >= 0)){
            /****Hustle or WSI Page ****/
            $('body').addClass('noTaglineLandingPage');

        } else {
            /****Not a Hustle or WSI Page ****/
            $('body').addClass('taglineLandingPage');
        }
    } else {
        /****Not a Landing Page ****/
        $('body').addClass('notLandingPage');
    }
    /*************************************************************************************************************************************/

    // preload icomoon css
    $('body').append('<link rel="stylesheet" href="/wp-content/themes/polo-child/fonts/icomoon/icomoon.css">');

    // js-btn-scroll-to hide on scroll 

    if($("a.js-btn-scroll-to.btn-scroll-to").length) {
	    var x = window.matchMedia("(max-width: 768px)")
	    if(x.matches) {
	        ss_btn_scroll_hide('a.js-btn-scroll-to.btn-scroll-to');
	    }
    }
});

function ss_pull_myform_up() {
	var my_width = window.innerWidth;
    if (my_width > 991 && jQuery('.page-title').length && jQuery('.m-t-minus-25-percent').length) {
		titlecor = jQuery('.page-title h1').offset();
		formcor = jQuery('.m-t-minus-25-percent').offset();
		jQuery('form').offset({top: titlecor.top + 50, left: formcor.left});
	}
	else {
		jQuery('form').css({top: 'auto', left: 'auto'});
	}
}

function ss_place_tooltips(target_items, name) {
    $(target_items).each(function(i){
    	var filter_id = $(this).attr('rel');
        var my_tooltip = $(".filter"+filter_id);
        var my_link = $(".filterlink"+filter_id+':eq(1)');
        var my_link_offset = my_link.width();
        $(this).hover(function(){
            my_tooltip.css({opacity:0.8, display:"none", left:my_link_offset}).show();

        }).mouseleave(function(){
            my_tooltip.fadeOut(400);
        });

    });
}

function ss_top_navigator_dropdown_menu_fix(){
	var $dropdownMenu = $('#mainMenu').find('.dropdown-menu');
	$dropdownMenu.each(function(){
			if(window.innerWidth > 991 && !$(this).parents('li').hasClass('align-right')) {
					$(this).css('min-width', $(this).width() + 10);
			} else {
					$(this).css('min-width', '');
			}
	});
}

function ss_top_navigator_translate_dropdown_menu_fix(){
	var $menuSiblings = $('#mainMenu #menu-mainnav>li:not(.circle-icon):not(.translate-dropdown)');
	if(window.innerWidth < 992) { //overwrite translate-dropdown functionality on mobile
			$('li.translate-dropdown.dropdown > a').unbind('touchstart click');
			$('li.translate-dropdown.dropdown > a').bind('touchstart click', function() {
					$(this).parent().toggleClass('resp-active');
					$menuSiblings.toggleClass('hidden');
					return false;
			});					
	} else {
			$('li.translate-dropdown.dropdown > a').unbind('touchstart click');
			$menuSiblings.removeClass('hidden');
			$('#mainMenu #menu-mainnav>li.translate-dropdown').removeClass('resp-active');
			$(".lines-button.x.tcon-transform").trigger('click');
			$('.js-btn-get-a-demo-mobile').removeClass('hidden');
	}
}

function ss_top_navigator_translate_dropdown_selected_lang(){
	var $activeLang = jQuery('html').attr('lang');
	var $langSelector = $('li.translate-dropdown.dropdown > a > span');
	if($activeLang !== 'en-US' && $activeLang !== 'en') {
			$langSelector.html($activeLang.toUpperCase());
	}
	$(document).on('touchstart click', 'li.translate-dropdown.dropdown > ul.dropdown-menu > li > a', function() {
			var selectedLang = $(this).html();
			$langSelector.html(selectedLang);
	});
}

function followTo (target_items, pos) {
    var $this = $(target_items),
        $window = $(windw);
    
    $window.scroll(function(e){
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'absolute',
                top: pos
            });
            $this.attr('style', 'display: none !important');
        } else {
            $this.css({
                position: 'fixed',
                top: 0
            });
            $this.attr('style', 'display: block !important');
        }
    });
}

function ss_btn_scroll_hide(target_items) {
	var $this = $(target_items);
	$(window).on('scroll', function() {
        if ($(window).scrollTop() > $('.wpcf7').offset().top - window.innerHeight && $(window).scrollTop() < $('.wpcf7').offset().top + $(".wpcf7").outerHeight(true)) { 
            console.log('You reached the form'); 
            $this.attr('style', 'display: none !important');
        }
        else {
            $this.attr('style', 'display: block !important');
        }
    });
}

//----------------------------------------------------/
// FIXED SUB NAV
//----------------------------------------------------/
function fixedSubNavStatus($fixedSubNav, fixedSubNavOffset) {
	var $header		 = $('#header');
	var $headerWrap	 = $('#header-wrap');

	if ($fixedSubNav.exists() && $('body').width() > 991) {
			if ($(window).scrollTop() > fixedSubNavOffset - $fixedSubNav.height()) {					
					if (!$fixedSubNav.hasClass("fixed")) {
							$fixedSubNav.addClass('fixed');
							$fixedSubNav.css('top', $headerWrap.height() + $header.offset().top);
					}
			} else {
				$fixedSubNav.removeClass('fixed');
				$fixedSubNav.css('top', '');
			}
	} else { //mobile resolution active
		$fixedSubNav.removeClass('fixed');
		$fixedSubNav.css('top', '');
	}
};

function fixedSubNav() {
	if ($('#fixed-sub-nav').length > 0) { 
			var $fixedSubNav = $('#fixed-sub-nav');
			var fixedSubNavOffset = $fixedSubNav.offset().top;

			$(window).on('scroll resize', function () {
					window.requestAnimationFrame(function () {
							fixedSubNavStatus($fixedSubNav, fixedSubNavOffset);
					});
			});
	}
};

function ss_btn_scroll_to() { // btn watch webinar ations
	if ($('.js-btn-scroll-to').length > 0 && $('.wpcf7').length > 0) {
			$(document).on('click', '.js-btn-scroll-to', function(e){
					e.preventDefault();
					$(this).addClass('hidden');
					var scrollToSelector = '.wpcf7';
					if ($('.myform').length > 0) {
						scrollToSelector = '.wpcf7 .myform';
					}
					$('html, body').animate({scrollTop: $(scrollToSelector).offset().top - 20}, 'slow');
					$(scrollToSelector).find('input[type=text]').filter(':visible:first').focus();
			});
	} else { // if no form is not present on the page hide the button
		$('.js-btn-scroll-to').addClass('hidden');
	}
}

/**
 * Show/Hide subnav menu as dropdown on medium and small devices.
 * 
 */
function ss_toggle_subnav_as_dropdown_menu(){
	var $subnavAsDropdownFilterToggle = $(".sub-nav-as-dropdown-container .app_mobile_filter");
	var $subnavAsDropdownFilterMenu = $('.sub-nav-as-dropdown-container .app_mobile_filter .widget_nav_menu');
	var $subnavAsDropdownFilterMenuLink = $('.sub-nav-as-dropdown-container .app_mobile_filter .widget_nav_menu a');
	var $subnavAsDropdownFilterSelected = $('.sub-nav-as-dropdown-container .app_mobile_filter .sub-nav-as-dropdown-selected');

	$(document).click(function(e){	
		if ($(window).width() < 769){
			if (e.which == 1){ // check if is left click.
				if ($subnavAsDropdownFilterToggle.has(e.target).length == 0 && !$subnavAsDropdownFilterToggle.is(event.target)){
					if ($subnavAsDropdownFilterMenu.length > 0){
						$subnavAsDropdownFilterMenu.fadeOut(350);
					}
				} else if ($subnavAsDropdownFilterMenuLink.is(event.target)){
					if ($subnavAsDropdownFilterMenu.length > 0){
						var btnText = e.target.innerHTML;
						
						$subnavAsDropdownFilterMenu.hide();
						$subnavAsDropdownFilterSelected.text(btnText);
					}
				} else {
					if ($subnavAsDropdownFilterMenu.length > 0){
						$subnavAsDropdownFilterMenu.show();
					}
				}
			}
		}
	});
}

// pricing page reveal
jQuery(document).ready(function($) {

    function changeClass() {
        $('.pricing-col').removeClass('selected');
        $(this).addClass('selected');
    }
    $('.pricing-col').on('click', changeClass);

    $('.pricing-col').hover(function() {
            if(!$(this).hasClass('selected')) {
                $(this).addClass('selected').addClass("wasSelected");
            }},
        function(){
            if($(this).hasClass("wasSelected")) {
                $(this).removeClass("wasSelected").removeClass("selected");
            }
        });

    $('.pricing-col').click(function() {
        $(this).removeClass("wasSelected");
    });

    $('.pricing-col').click(function() {
        $('.pricing-details').hide();
        $($(this).attr('href')).show();
    });

    $(".grp-smb-standard").click(function(){
        $(".grp-smb-standard-reveal").toggle();
    });
    $(".grp-smb-plus").click(function(){
        $(".grp-smb-plus-reveal").toggle();
    });
    $(".grp-smb-pro").click(function(e){
        $(".grp-smb-pro-reveal").toggle();
    });
    $(".grp-smb-agency").click(function(){
        $(".grp-smb-agency-reveal").toggle();
    });
    $(".grp-smb-enterprise").click(function(){
        $(".grp-smb-enterprise-reveal").toggle();
    });
		
		$(".grp-smb-standard").click(); //default selected
		$(".grp-smb-standard").addClass('selected'); //default selected

    ss_place_tooltips(".wiggle a","tooltip");
    ss_top_navigator_dropdown_menu_fix();

    jQuery('.wiggle').click(function (e) {
       jQuery('.wiggle').each(
           function (d) {
               jQuery('.wiggle').removeClass('ptf-active');
           }
       );
       setTimeout( function () {
           jQuery('html, body').animate({scrollTop: jQuery('#page-title').offset().top}, 'slow');
           jQuery(window).scrollTop(jQuery(window).scrollTop() - 1);
           jQuery(window).scrollTop(jQuery(window).scrollTop() + 1);
       }, 500);

    });

		jQuery(document).on('click','#acuity-scheduling-mobile-preview a', function(){
				setTimeout(function(){jQuery(window).resize();},250);
		});
		
		fixedSubNav();
		ss_btn_scroll_to();
		ss_top_navigator_translate_dropdown_menu_fix();
		ss_top_navigator_translate_dropdown_selected_lang();
		ss_toggle_subnav_as_dropdown_menu();
		
		$(document).on('touchstart click', '.lines-button.x.tcon-transform', function() {
				if($("li.translate-dropdown.resp-active").length > 0) { // if translate dropdown is open click on it to close the menu
						$("li.translate-dropdown.dropdown > a").trigger('click');
				}				
		});
		
		$(document).on('touchstart click', '.lines-button.x', function() {	
				if($(this).hasClass('tcon-transform')) {
						$('.js-btn-get-a-demo-mobile').addClass('hidden');
				} else {
						$('.js-btn-get-a-demo-mobile').removeClass('hidden');
				}
		});
		
		$(document).on('click', '.readMoreLink', function(e) {
				e.preventDefault();
				$(this).parents('.js-read-more-container').removeClass('collapsed');
				$(this).remove();
		});


});

jQuery(window).resize(function($) {
	ss_top_navigator_dropdown_menu_fix();
	ss_top_navigator_translate_dropdown_menu_fix();
});


/**
 * Show Hide Elements based on ShSp Lead Data
 * First obtain the contact object, then check various fields within to 
 * determine what data or html elements to show the visitor.
 **/
 // Functions and data objects to show and hide Free Trial elements on the site.
 const showFreeTrial= () => {
    $(".freeTrialCTA").removeClass('hidden');
    $(".freeTrialCTA-footer").removeClass('hidden');
    $(".getademoCTA-footer").addClass('hidden');
	$("#mega-menu-main-menu>li:nth-child(8)").removeClass("hidden");
};
const hideFreeTrial= () => {    
    $(".freeTrialCTA").addClass('hidden');
    $(".freeTrialCTA-footer").addClass('hidden');
    $(".getademoCTA-footer").removeClass('hidden');
};
const stages = ["demoset","Demo Agency","Demo-End User","neednewdemotime","reschedule","demo2","Billing - Contract Received","Partner","Partner Client"];
var freeTrial = 1;
var path = window.location.pathname;
var _ss = _ss || [];
const callThisOnReturn= resp =>{
    if (typeof resp === 'object' && resp !== null) {
        if (resp && resp.contact) {
            let leadStage = resp.contact['Communication Stage'];
            //console.log('Hi there ' + resp.contact['Communication Stage']);
            if (stages.includes(leadStage)) {
                //console.log("You have an open opportunity");
                freeTrial = 0;
            }
            else {
                //console.log("Wanna free trial? :)");
                freeTrial = 1;
            }
        }
    }
    else {
        console.log("Could not determine - object not found?");
    }
    freeTrial ? showFreeTrial() : hideFreeTrial(); 
};
_ss.push(['_setResponseCallback', callThisOnReturn]);	
