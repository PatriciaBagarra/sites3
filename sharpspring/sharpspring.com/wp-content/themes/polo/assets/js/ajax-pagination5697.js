(function ($) {
	'use strict';

	if (window.crum_pagination_data == undefined) {
		return false;
	}

	$(document).ready(function () {

		var page_num = parseInt(crum_pagination_data.startPage) + 1;
		var max_pages = parseInt(crum_pagination_data.maxPages);
		var next_link = crum_pagination_data.nextLink;

		var loaded_text = crum_pagination_data.loaded_text;

        var container = '';
		for(var i = 0; i < crum_pagination_data.container.length; i++){
			if($(crum_pagination_data.container[i]).size()>0){
                container = crum_pagination_data.container[i];
			}
		}
		var $container = $(container);
		var container_has_isotope = false;

		var $button = $('#ajax-pagination-load-more');

		if (page_num > max_pages) {
			$button.addClass('last-page').children('span').text(loaded_text);
		}

		$button.bind('click', function () {

			if (page_num <= max_pages && !$(this).hasClass('loading') && !$(this).hasClass('last-page')) {

				var itemWidth = function () {

					var columns = $container.attr('data-isotope-col') || "4",
						$elemContainer = $container,
						itemElement = $container.attr('data-isotope-item') || ".isotope-item",
						itemElementSpace = $container.attr('data-isotope-item-space') || 0;

					var $findElement = $elemContainer.find(itemElement);
					var $findElementLarge = $elemContainer.find(".large-item");

					var itemElementMargins = {
						"margin-right" : itemElementSpace + "%",
						"margin-bottom": itemElementSpace + "%",
					};

					if (columns == 1) {
						$findElement.width('100%');
						$findElementLarge.width('100%');
					}

					if (columns == 2) {
						$findElement.width(50 - itemElementSpace + '%').css(itemElementMargins);
						$findElementLarge.width(50 - itemElementSpace + '%').css(itemElementMargins);
					}

					if (columns == 3) {
						$findElement.width(33.33 - itemElementSpace + '%').css(itemElementMargins);
						$findElementLarge.width(66.66 - itemElementSpace + '%').css(itemElementMargins);
					}

					if (columns == 4) {
						$findElement.width(25 - itemElementSpace + '%').css(itemElementMargins);
						$findElementLarge.width(50 - itemElementSpace + '%').css(itemElementMargins);
					}

					if (columns == 5) {
						$findElement.width(20 - itemElementSpace + '%').css(itemElementMargins);
						$findElementLarge.width(40 - itemElementSpace + '%').css(itemElementMargins);
					}

					if (columns == 6) {
						$findElement.width(16.666666 - itemElementSpace + '%').css(itemElementMargins);
						$findElementLarge.width(33.333333 - itemElementSpace + '%').css(itemElementMargins);
					}


				};

				$.ajax({
					type      : 'GET',
					url       : next_link,
					dataType  : 'html',
					beforeSend: function () {
						$button.addClass('loading');
					},
					complete  : function (XMLHttpRequest) {
						window.t = XMLHttpRequest.responseText;
						$button.removeClass('loading');

						if (XMLHttpRequest.status == 200 && XMLHttpRequest.responseText != '') {
							page_num++;
							next_link = next_link.replace(/\/page\/[0-9]?/, '/page/' + page_num);

							if (page_num > max_pages) {
								$button.addClass('last-page').children('span').text(loaded_text);
							}
							if ($(XMLHttpRequest.responseText).find(container).length > 0) {

								if($container.hasClass('isotope')){
									container_has_isotope = true;
								}
								$(XMLHttpRequest.responseText).find(container).children().each(function () {
									if (!container_has_isotope) {
										$container.append($(this));
										$('body').trigger('container-add-item', $(this));
									} else {
										$container.isotope('insert', $(this));

										$('body').trigger('isotope-add-item', $(this));

										$container.imagesLoaded(function () {
											itemWidth();
											INSPIRO.carouselInspiro();
											$container.isotope('layout');
										});
									}
								});
							}
						}
					}
				});
			}

			return false;

		});

	});
}(jQuery));