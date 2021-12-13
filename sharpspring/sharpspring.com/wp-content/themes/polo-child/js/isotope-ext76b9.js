/* 
 * Isotope-ext
 */

var keyPressed = false;
var app_data_filter = "";

jQuery(document).ready( function() {
    jQuery(document).on('keydown', function(e) {
        if (keyPressed === false) {
            if (e.keyCode === 8 || e.keyCode === 46) {
                keyPressed = true;
            }
        }
        jQuery(this).on('keyup', function() {
            if (keyPressed === true) {
                app_data_filter = jQuery('.js-quicksearch').val();
                keyPressed = false;
                if (app_data_filter.length > 0) {
                    onHashchange();
                }
                else {
                    refresh_isotope(null, true);
                }
            }
        });
    });

	// quick search regex
	var qsRegex;

	// init Isotope
	var $grid = $('.portfolio-items');
	
	// use value of search field to filter
	var $appQuicksearch = $('.js-quicksearch').keyup( debounce( function() {
		$('#primary-sidebar .portfolio-filter .ptf-active').removeClass('ptf-active');
		qsRegex = new RegExp( $appQuicksearch.val(), 'gi' );
		
		if ($appQuicksearch.val().length >= 1){
			$grid.isotope({
				filter: function() {
					return qsRegex ? $(this).text().match( qsRegex ) : true;
				}
			});
            //trigger the scroll just in case lazy images are stuck
            setTimeout( function () {
                $('body,html').scroll();
            }, 800);
		} else {
		    if (app_data_filter.length > 0) {
                onHashchange();
            }
            else {
                refresh_isotope(null, true);
            }
		}
	}, 200 ) );

	$(window).load(function () {
		$('#primary-sidebar .portfolio-filter .wiggle').click(function() {
			var $filterBtn = $(this);
			updateUrl($filterBtn);
			$('.js-quicksearch').val('');
		});

		$('#primary-sidebar .portfolio-filter .js-widget-title, #primary-sidebar .portfolio-filter .js-widget-title .widget-title').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

        $('.mobile_category_filter').change(function(e) {
            app_marketplace_mobile_filter($(this), $('.mobile_integration_filter option[value="*"]'));
        });

        $('.mobile_integration_filter').change(function(e) {
        	app_marketplace_mobile_filter($(this), $('.mobile_category_filter option[value="*"]'));
        });

        $('#app_mobile_filter_toggle').click(function(e) {
            $('#app_marketplace_filter_selector').toggle();
            e.stopPropagation();
        })

        $('#app_category_filter_toggle').click(function(e) {
            $('#app_category_filter_selector').toggle();
            e.stopPropagation();
        });

        $('html').click(function(){
            if ($('#app_marketplace_filter_selector').is(':visible')) {
                $('#app_marketplace_filter_selector').fadeOut(400);
            }
            if ($('#app_category_filter_selector').is(':visible')) {
                $('#app_category_filter_selector').fadeOut(400);
            }
        });

        $('.app_mobile_optgroup,.app_mobile_opt').click(function(e) {
            var app_filter = $(this).attr('data-target');
            $("#app_marketplace_filter").val(app_filter);
            $('#app_marketplace_filter_selected').text($(this).text());
            $('#app_marketplace_filter_toggle').toggle();
            app_marketplace_mobile_filter($("#app_marketplace_filter"), $('.mobile_integration_filter option[value="*"]'));
        });

        $('.app_mobile_cat_opt').click(function(e) {
        	var app_cat = $(this).attr('data-target');
            $('#app_category_filter option[value="'+app_cat+'"]').attr('selected','selected');
            $('#app_category_filter_selected').text($(this).text());

            var integration_cat = $('.mobile_category_filter').val();
            if (app_cat !== '*') {
                var cat_filter = '.' + integration_cat + '.' + app_cat;
            }
            else {
            	var cat_filter = '.'+integration_cat;
			}
            jQuery('#isotope').isotope({ filter: cat_filter });
            updateUrl($('.pft-active:first'));
            //trigger lazy images
            setTimeout( function () {
                $(window).scroll();
            }, 500);
        });

        $('.wiggle').click(function (e) {
			refresh_isotope($(this));
        })
		
		onHashchange();
		
		$('.portfolio-items .items-overlay').fadeOut(250);

		//once loaded add an isotope re-layout if scrolling so lazy images are arranged
        var iScrollPos = 0;
        $(window).scroll(function () {
            var iCurScrollPos = $(this).scrollTop();
            if (iCurScrollPos >= iScrollPos) {
                //Scrolling Down
                $grid.isotope('layout');
            }
            iScrollPos = iCurScrollPos;
        });
		//trigger the scroll just in case lazy images are stuck
        setTimeout( function () {
            $('body,html').scroll();
        }, 1000);

	});
	
	//$(window).on('hashchange', onHashchange);

	$(document).on('click', '.js-quicksearch-btn', function(e) {
		e.preventDefault();
	});		
	
	// debounce so filtering doesn't happen every millisecond
	function debounce( fn, threshold ) {
		var timeout;
		return function debounced() {
			if ( timeout ) {
				clearTimeout( timeout );
			}
			function delayed() {
				fn();
				timeout = null;
			}
			timeout = setTimeout( delayed, threshold || 100 );
		}
	}
	
	function getHashFilter() {
		var $filters = $('#primary-sidebar .portfolio-filter');
		var hash = location.hash;
		var matches = hash.match( /category=([^&]+)/i );
		var hashFilter = matches && matches[1];
		//has filter might be secondary filtered - split by .
        var secondary_index = hashFilter.indexOf(".");
        if (secondary_index >= 0) {
        	$('select.app_category_filter').val(hashFilter.substr(parseInt(secondary_index) + 1));
        	hashFilter = hashFilter.substr(0, secondary_index);
		}
		var filterCategory = $filters.find('[data-filter="' + '.' + hashFilter + '"]');
		
		if (filterCategory.length == 0){
			hashFilter = 'all';
		}
		return hashFilter &&  decodeURIComponent( hashFilter );
	} 

	function onHashchange() {
        jQuery('p.info').html('&nbsp;');
        jQuery('.app_category_filter').css('left', 'initial');
        var $filters = $('#primary-sidebar .portfolio-filter');
        var hash = location.hash;
        var matches = hash.match( /category=([^&]+)/i );
        var hashFilter = matches && matches[1];

        if (!hashFilter || hashFilter === null) {
            return;
        }

        //has filter might be secondary filtered - split by .
        var secondary_index = hashFilter.indexOf(".");
        if (secondary_index >= 0) {
            $('select#app_category_filter').val(hashFilter.substr(parseInt(secondary_index) + 1));
            hashFilter = hashFilter.substr(0, secondary_index);
        }
        var filterCategory = $filters.find('[data-filter="' + '.' + hashFilter + '"]');

        if (filterCategory.length == 0){
            hashFilter = 'all';
        }
		

		if (hashFilter == 'all'){
			hashFilter = '*';
		} else {
			hashFilter = '.' + hashFilter
		}
		
		// filter isotope $grid.isotope({ filter: hashFilter });
		if ( hashFilter ) {
            $('.js-quicksearch').val('');
            setTimeout(function() {
                $filters.find('[data-filter="' + hashFilter + '"]>span>a').click();
                $filters.find('.ptf-active').removeClass('ptf-active');
                $filters.find('[data-filter="' + hashFilter + '"]').addClass('ptf-active').click();
            }, 500);
        }

	}
	
	function updateUrl($selector){
		var filterAttr = $selector.attr('data-filter');
		if (filterAttr === undefined) {
			filterAttr = app_data_filter;
            var filterValue = filterAttr;
		}
		else {
            var filterValue = filterAttr.substring(1);
		}

		if (filterAttr === '*'){
			filterValue = 'all';
		}
        var category_filter = jQuery('#app_category_filter').val();
		if (category_filter !== undefined && category_filter !== null && category_filter.length > 0 && filterValue !== 'integration' && filterValue !== 'service-partners') {
			filterValue = filterValue+'.'+category_filter;
		}
	    // set filter in hash
		location.hash = 'category=' + encodeURIComponent( filterValue );

	    $('.js-quicksearch').val('');
	}

    function app_marketplace_mobile_filter(element, element_to_clear) {
        tax_page_filter = element.val();
        console.log(tax_page_filter);
        jQuery('.wiggle').removeClass('ptf-active');
        if (tax_page_filter === "*") {
            jQuery('#isotope').isotope({ filter: tax_page_filter });
        }
        else if (tax_page_filter === 'integration' || tax_page_filter === 'service-partners' || tax_page_filter === 'portfolio-item') {
            jQuery('#isotope').isotope({ filter: '.' + tax_page_filter });
		}
        else {
            var filterCat = jQuery('#app_category_filter').val();
            if (filterCat !== undefined && filterCat !== null && filterCat.length > 1) {
                var cat_filter = tax_page_filter + '.' + filterCat;
                jQuery('#app_category_filter_selected').text(jQuery('#app_category_filter option:selected').text());
            }
            else {
            	cat_filter = tax_page_filter;
			}
            jQuery('#isotope').isotope({filter: '.' + cat_filter});
        }
        jQuery('li[data-filter=".'+tax_page_filter+'"]').each(function() {
            jQuery(this).addClass('ptf-active');
        });
        //trigger lazy images
        setTimeout( function () {
            $(window).scroll();
        }, 500);
        $('.js-quicksearch').val('');
        element_to_clear.attr('selected','selected');
        element.blur();
    }

    function refresh_isotope($selector, $skip_filter=false) {
        var filterValue = 'integration';
        var filterAttr = 'integration';
	    if (!$skip_filter) {
            filterAttr = jQuery($selector).attr('data-filter');
            if (filterValue.length > 0) {
                filterValue = filterAttr.substring(1);
            }
        }
        app_data_filter = filterValue;
        jQuery('#app_category_filter_selector').hide();
        jQuery('#app_category_filter').val('*');
        jQuery('#app_category_filter_selected').text('Select a category');

        jQuery('#app_marketplace_filter option[value='+filterValue+']').attr('selected','selected');
        jQuery('#app_marketplace_filter_selected').text(jQuery('#app_marketplace_filter option[value='+filterValue+']').text());
        if (filterAttr !== '.integration' && filterAttr !== '.service-partners' && filterAttr !== 'portfolio-item') {
            setTimeout(function () {
                var filterCat = jQuery('#app_category_filter').val();
                if (filterCat !== undefined && filterCat !== null && filterCat.length > 1) {
                    var cat_filter = '.' + filterValue + '.' + filterCat;
                    jQuery('#app_category_filter_selected').text(jQuery('#app_category_filter option:selected').text());
                }
                else {
                    cat_filter = filterAttr;
                }
                jQuery('#isotope').isotope({ filter: cat_filter });
                jQuery('.app_category_filter').css('left', '200px');
            }, 200);
        }
        else {
            setTimeout(function () {
                jQuery('.app_category_filter').val('');
            }, 200);
            jQuery('.app_mobile_cat_opt').show();
            jQuery('.selectedCategory').text('');
            jQuery('p.info').html('&nbsp;');
            jQuery('.app_category_filter').css('left', 'initial');
        }
        //trigger lazy images
        setTimeout( function () {
            jQuery('.app_mobile_cat_opt').hide();
            jQuery("div[itemref='all']").show();
            jQuery(window).scroll();
            if (jQuery("#app_marketplace_filter").length) {
                app_marketplace_mobile_filter(jQuery("#app_marketplace_filter"), jQuery('.mobile_integration_filter option[value="*"]'));
            }
        }, 400);
        setTimeout( function () {
            jQuery('.portfolio-item').each(function (index, value) {
                if (jQuery(this).is(':visible')) {
                    var classList = jQuery(this).attr('class').split(/\s+/);
                    jQuery.each(classList, function(index, item) {
                        jQuery("div[itemref='"+item+"']").show();
                    });
                }
            });
        }, 700);
	}

    jQuery('.filter-category').click(function(e) {
        e.preventDefault();
        tax_page_filter = jQuery(this).attr('rel');
        jQuery('#isotope').isotope({ filter: '.'+tax_page_filter });
        jQuery('.wiggle').removeClass('ptf-active');
        jQuery('li[data-filter=".'+tax_page_filter+'"]').each(function() {
            jQuery(this).addClass('ptf-active');
        });

        //trigger lazy images
        setTimeout( function () {
            $(window).scroll();
        }, 500);
    });
});