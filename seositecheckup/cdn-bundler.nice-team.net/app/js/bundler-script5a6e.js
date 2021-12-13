


/**
*	Bundler script
*	version number: 74
*	VOLUME DISCOUNTS
*/
if (typeof window.bundlerLoaded === 'undefined' ||  document.getElementById("bndlr-loaded") === null) {
	// Check for element with ID bndlr-loaded.
	// This is here to know when some shitty instant click apps load site through ajax requests
	
	try {
		// Mark bundler as loaded
		window.bundlerLoaded = true;
		
		var elem = document.createElement('div');
		elem.id = 'bndlr-loaded';
		elem.style.cssText = 'display:none;';
		document.body.appendChild(elem);
	} catch(e) {
		console.error(e); 
	}
	
	(function() {

		var loadScript = function(url, callback){
			var script = document.createElement("script")
			script.type = "text/javascript";
			script.async = true;
		 
			if (script.readyState){  //IE
				script.onreadystatechange = function(){
					if (script.readyState == "loaded" ||
							script.readyState == "complete"){
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {  //Others
				script.onload = function(){
					callback();
				};
			}
		 
			script.src = url;
			
			var x = document.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(script, x);
		};
		
		var idleCallback = function(callback) {
			if (typeof window.requestIdleCallback === 'function') {
				window.requestIdleCallback(callback);
			} else {
				callback();
			}
		}
		
		var debouncers = [];
		var debounce = function(key, callback, delay) {
			if (typeof debouncers[key] !== 'undefined') {
				clearTimeout(debouncers[key]);
			}
			debouncers[key] = setTimeout(callback, delay);			
		}
		
		// This variable will contain internal functions which can be shared between different modules
		// E.g.: a function which removes items from the cart which are already in a full bundle, so the funnel module can use only the other products
		var _internalFunctionCollection = {};
		
		// Main Bundler script
		var bundler = function($) {
			
			
				var bundlerConsole = {
					_canUseConsole: function() {
													return true;
											},
					log: function() {
						if (this._canUseConsole()) {
							window.console.log.apply(null, arguments);
						}
					},
					warn: function() {
						if (this._canUseConsole()) {
							window.console.warn.apply(null, arguments);
						}
					},
					info: function() {
						if (this._canUseConsole()) {
							window.console.info.apply(null, arguments);
						}
					},
					error: function() {
						if (this._canUseConsole()) {
							window.console.error.apply(null, arguments);
						}
					}
				};			
			
			// Object for accessing products from local storage
			var local = {
				maxAge: 60*1000*5, // Save product data for 5 minutes
				key : 'bndlr_data_',
				cache: {},
				save: function(key, data) {
					try {
						var ld = {};

						try {
							var localData = localStorage.getItem(this.getKey());
							localData = JSON.parse(localData);
						} catch(e) {
							console.log('no data yet');
						}
						
						if (typeof localData === 'object' && localData !== null) {
							ld = localData;
						}
						
						ld[key] = {
							product: data,
							time: (new Date().getTime())
						}

						ld = JSON.stringify(ld);
						localStorage.setItem(this.getKey(), ld);
						
						this.cache[key] = ld[key];

					} catch(e) {
						console.log('Error when saving data', e);
					}
				},
				get: function(key) {
					try {
						
						if (typeof this.cache[key] !== 'undefined') {
							var ld = this.cache[key];
						} else {
							var ld = localStorage.getItem(this.getKey());
							ld = JSON.parse(ld);
						}

						if (typeof ld[key] === 'undefined' ||  ld[key].time === 'undefined') {
							return false;
						}

						if (ld[key].time < (new Date().getTime() - this.maxAge)) {
							// data is too old
							return false;
						}
						
						return JSON.parse(JSON.stringify(ld[key].product));
					} catch(e) {
						return false;
					}
					return false;
				},
				getKey: function() {
					var localKey = this.key;
					var currency = '';
					if (typeof Shopify !== 'undefined' && Shopify.hasOwnProperty('currency') && Shopify.currency.hasOwnProperty('active')) {
						currency = Shopify.currency.active;
					}
					localKey += currency;
					return localKey;
				}
			};
			
			var cart = {
				cartCache: {},
				promises: {},
				get: function(whichEndpoint, checkCache) {
					if (typeof checkCache === 'undefined') {
						checkCache = true;
					}
					
					if (typeof whichEndpoint === 'undefined') {
						whichEndpoint = 'default';
					}
											var endpoint = 'cart.js';
										if (whichEndpoint == 'proxy') {
						var endpoint = 'a/bundles/cart/cart.json';
					}
					
					var url = nav.getRootUrl() + endpoint + '?bundler-cart-call';
					
					if (checkCache) {
						// Check if there is a response in the cache which isn't older than 1.5 seconds
						var timestamp = Date.now();
							timestamp = Math.round(timestamp / 1500);
						if (typeof cart.cartCache[url] !== 'undefined' && typeof cart.cartCache[url][timestamp] !== 'undefined') {
							// Return the response
							var deferred = $.Deferred().resolve(JSON.parse(JSON.stringify(cart.cartCache[url][timestamp])));
							return deferred.promise();
						}
					}
					
					if (checkCache && typeof cart.promises[url] !== 'undefined' && typeof cart.promises[url].readyState !== 'undefined' && cart.promises[url].readyState < 4) {
						// This logic here will return the pending promise if we request the same url multiple times before the first promise returns a response.
						// TODO we could add the timestamp to promises and use them as caching mecahnism, as if you add the .done() callback to an executed promise (readyState === 4), the callback gets executed immediately.
						// The only problem could be if the returned object gets modified in one of the callbacks
						return cart.promises[url];
					} else {
					
						var promise = $.ajax({
							url: url,
							dataType: 'json'
						}).done(function(cartData) {
							// Save response to cache for 1.5 seconds
							var timestamp = Date.now();
								timestamp = Math.round(timestamp / 1500);
								
							if (typeof cart.cartCache[url] === 'undefined') {
								cart.cartCache[url] = {};
							}
							
							cart.cartCache[url][timestamp] = JSON.parse(JSON.stringify(cartData));
						});
						
						// Add promise to the promises object
						cart.promises[url] = promise;
						
						return promise;
					}
				},
				removeUnusedProductProperties: function(product) {
					var unusedProperties = [
						'description',
						'published_at',
						'created_at',
						'compare_at_price',
						'compare_at_price_max',
						'compare_at_price_min',
						'compare_at_price_varies',
						'price',
						'price_max',
						'price_min',
						'price_varies',
						'tags',
						'type',
						'url',
						'vendor',
					];
					
					var unusedVariantProperties = [
						'barcode',
						'requires_shipping',
						'sku',
						'taxable',
						'weight',
					];

					for(var i = 0; i< unusedProperties.length; i++) {
						if (typeof product[unusedProperties[i]] !== 'undefined') {
							delete product[unusedProperties[i]];
						}
					}
					
					for(var i = 0; i < product.variants.length; i++) {
						for(var j = 0; j < unusedVariantProperties.length; j++) {
							if (typeof product.variants[i][unusedVariantProperties[j]] !== 'undefined') {
								delete product.variants[i][unusedVariantProperties[j]];
							}
						}
					}
					
					return product;
				},
				getProductData: function(rootUrl, productHandle) {
					
					var localProduct = local.get(productHandle);
					
					if (localProduct === false) {
						// Product is not in local storage or it's time has expired
						var productUrl = rootUrl+'products/'+productHandle+'.js';
						var ajax = $.ajax({
							url: productUrl,
							dataType: 'json'
						}).done(function(data) {
							data = cart.removeUnusedProductProperties(data);
							local.save(productHandle, data);
						});
						
						return ajax;
					} else {
						// Product was retrieved from local storage
						var deferred = $.Deferred().resolve(localProduct);
						return deferred.promise();
					}
				},
				getProductDataJSON: function(rootUrl, productHandle) {
					var productUrl = rootUrl+'products/'+productHandle;
					return $.ajax({
						url: productUrl,
						contentType: 'application/json',
						dataType: 'json'
					});
				},
				addToCart: function(rootUrl, id, quantity, properties) {
					var url = rootUrl+'cart/add.js?bundler-cart-call';
					
					return $.ajax({
						url: url,
						data: {
							id: id,
							quantity: quantity,
							properties: properties
						},
						type: 'POST',
						dataType: 'json'
					});
				},
				addMultipleItemsToCart: function(rootUrl, items) {
					// This is a non-standard way of adding the items to the cart
					var url = rootUrl+'cart/add.js?bundler-cart-call';
					
					// Merge items with the same variant ids and properties to one element.
					// If you don't merge them, an issue can occur where the cart doesn't get properly updated. It only hapens if you add the same producs to the cart in the same request.
					var totalQuantityCount = {};
					for(var i = 0; i<items.length; i++) {
						var key = JSON.stringify(items[i]);
						if (typeof totalQuantityCount[key] === 'undefined') {
							totalQuantityCount[key] = JSON.parse(JSON.stringify(items[i]));
							totalQuantityCount[key]['quantity'] = totalQuantityCount[key]['quantity']*1;
						} else {
							totalQuantityCount[key]['quantity'] += items[i]['quantity']*1;
						}
					}
					
					var items = [];
					for(var key in totalQuantityCount) {
						if (totalQuantityCount.hasOwnProperty(key)) {
							items.push(totalQuantityCount[key]);
						}
					}
					
					return $.ajax({
						url: url,
						data: {
							items: items
						},
						type: 'POST',
						dataType: 'json'
					});
				},
				updateCart: function() {
					this.get().done(function(data) {
						try {
							var itemCount = data.item_count;
							$('[data-cart-item-count]').html(itemCount);
							$('.header__cart-count').html(itemCount);
							$('.site-header__cart-count span[data-cart-count]').html(itemCount);
							
							if ($('#CartCount [data-cart-count]').length > 0) {
								$('#CartCount [data-cart-count]').html(itemCount);
							} else if ($('#CartCount').length > 0) {
								$('#CartCount').html($('#CartCount').html().replace(/(\d+)/, data.item_count));
								//$('#CartCount').html(itemCount);
							}
							
							if ($('#CartCount.hide').length>0) {
								$('#CartCount.hide').removeClass('hide');
							}

							if ($('#site-cart-handle .count-holder .count').length > 0) {
								$('#site-cart-handle .count-holder .count').html($('#site-cart-handle .count-holder .count').html().replace(/(\d+)/, data.item_count));
							}
							if ($('#minicart .count.cart-target').length > 0) {
								$('#minicart .count.cart-target').html($('#minicart .count.cart-target').html().replace(/(\d+)/, data.item_count));
							}
							if ($('#sidebar #meta .count').length > 0) {
								$('#sidebar #meta .count').html($('#sidebar #meta .count').html().replace(/(\d+)/, data.item_count));
							}
							
							if ($('.site-header__cart .site-header__cart-indicator').length > 0) {
								$('.site-header__cart .site-header__cart-indicator').html($('.site-header__cart .site-header__cart-indicator').html().replace(/(\d+)/, data.item_count));
								
								if (data.item_count>0) {
									$('.site-header__cart .site-header__cart-indicator').removeClass('hide');
								}
							}
							
							if ($('.cartCount[data-cart-count]').length > 0) {
								$('.cartCount[data-cart-count]').html($('.cartCount[data-cart-count]').html().replace(/(\d+)/, data.item_count));
							}
							
							if ($('.cart-item-count-header').length > 0) {
								var $itemCountHeader = $('.cart-item-count-header').first();
								if ($itemCountHeader.hasClass('cart-item-count-header--total') === true) {
									// Set rpice, as this theme shows price there
									if ($itemCountHeader.find('.money').length) {
										$itemCountHeader = $itemCountHeader.find('.money').first();
										$itemCountHeader.html(bndlr.formatPrice(data.items_subtotal_price));
									}
									
								} else {
									// Set item count as this theme uses item count there
									$itemCountHeader.html($itemCountHeader.html().replace(/(\d+)/, data.item_count));
								}
							}
							
														
							if (typeof refreshCart == 'function') {
								refreshCart(data);
							}
							if (typeof slate !== 'undefined' && typeof slate.cart !== 'undefined' && typeof slate.cart.updateCart == 'function') {
								slate.cart.updateCart();
							}
							
							if (typeof ajaxCart !== 'undefined' && typeof ajaxCart.load === 'function') {
								ajaxCart.load();
							}
							
							if ($('.mega-nav-count.nav-main-cart-amount.count-items').length > 0) {
								$('.mega-nav-count.nav-main-cart-amount.count-items').html($('.mega-nav-count.nav-main-cart-amount.count-items').html().replace(/(\d+)/, data.item_count));
								$('.mega-nav-count.nav-main-cart-amount.count-items.hidden').removeClass('hidden');
							}
							
							if (typeof Shopify !== 'undefined' && typeof Shopify.updateQuickCart !== 'undefined') {
								Shopify.updateQuickCart(data);
							}
							
							if (typeof bcActionList !== 'undefined' && typeof bcActionList.atcBuildMiniCartSlideTemplate === 'function') {
								bcActionList.atcBuildMiniCartSlideTemplate(data);
								
								if (typeof openMiniCart === 'function') {
									openMiniCart();
								}
							}
							
							if (typeof Shopify !== 'undefined' && 
								typeof Shopify.updateCartInfo !== 'undefined' && 
								$('.top-cart-holder .cart-target form .cart-info .cart-content').length > 0) {

								Shopify.updateCartInfo(data, '.top-cart-holder .cart-target form .cart-info .cart-content');
							}
							
							
							
							if (typeof clientSpecifics['update_cart'] !== 'undefined') {
								clientSpecifics['update_cart'].trigger(data);
							}
						} catch(e) {
							bundlerConsole.log(e);
						}
					});
					
					if (typeof window.SLIDECART_UPDATE !== 'undefined') {
						try {
							// #slidecarthq
							window.SLIDECART_UPDATE();
						} catch(e) {
							bundlerConsole.log(e);
						}
					}
					if (typeof window.SLIDECART_OPEN !== 'undefined') {
						setTimeout(function() {
							try {
								// meina-naturkosmetik-de
								// #slidecarthq
								window.SLIDECART_OPEN();
							} catch(e) {
								bundlerConsole.log(e);
							}
						}, 500);
					}
					
					if (typeof Shopify !== 'undefined' && typeof Shopify.theme !== 'undefined' && typeof Shopify.theme.jsAjaxCart !== 'undefined' && typeof Shopify.theme.jsAjaxCart.updateView === 'function') {
						Shopify.theme.jsAjaxCart.updateView();
					}
					
					if (typeof CartJS !== 'undefined' && typeof CartJS.getCart === 'function') {
						try {
							// Avone theme
							CartJS.getCart();
						} catch(e) {
							bundlerConsole.log(e);
						}
						
											}
					
					if ($('.sp-cart .sp-dropdown-toggle').length && typeof Shopify !== 'undefined' && typeof Shopify.getCart === 'function') {
						Shopify.getCart();
					}
				
					
					if ($('form.cart-drawer').length > 0) {
						// Trigger update of cart drawer in Narrative theme
						// Simulate edit on the template or actual input of one of the products in the cart
						$('.cart-drawer input').first().trigger('blur');
						setTimeout(function(){ 
							$('.cart-drawer input').first().trigger('input');
						}, 350);
					}
					
					if (typeof window.HsCartDrawer !== 'undefined' && typeof window.HsCartDrawer.updateSlideCart === 'function') {
						debounce('hscartdrawer', function() {
							try {
								// tesbros
								HsCartDrawer.updateSlideCart();
							} catch(e) {
								bundlerConsole.log(e);
							}
						}, 100);
					}
					
					
											bndlr.hideDynamicCheckoutButtons();
									}
			};
			
			var nav = {
				getRootUrl: function(withLocale) {
					if (typeof withLocale === 'undefined') {
						withLocale = false;
					}
					
					var locale = '';
					if (withLocale) {
						locale = this.getUrlLocale();
					}
					
					if (this.isShopPage() === false) {
						// Return Shopify URL on third party pages
						return 'https://hamptonshomeau.myshopify.com/';
					} else {
						var url = window.location.origin?window.location.origin+'/':window.location.protocol+'//'+window.location.host+'/';
						if (locale.length > 0) {
							// Locale is set in the current URL, add it to the root URL
							url += locale+'/';
						}
						return url;
					}
				},
				isShopPage: function() {
					if (typeof Shopify !== 'undefined' && Shopify.shop === 'hamptonshomeau.myshopify.com') {
						return true;
					}
					
					return false;
				},
				getInvoiceEndpoint: function() {
					var ssad = false; // Seal Subscriptions apply discount
					if (typeof window.SealSubs !== 'undefined' && typeof window.SealSubs.discounts_apply_on_initial_order === 'boolean') {
						ssad = SealSubs.discounts_apply_on_initial_order;
					}
					return this.getAppUrl() + 'cdo.php?v31&shop=hamptonshomeau.myshopify.com&ssad='+ssad.toString();
				},
				getAppUrl: function() {
					return 'https://bundler.nice-team.net/app/api/';
				},
				isCartPage: function() {
					if (/\/cart\/?/.test(window.location.href)) {
						return true;
					}
					return false;
				},
				isProductPage: function() {
					if (/\/products\/([^\?\/\n]+)/.test(window.location.href)) {
						return true;
					}
					return false;
				},
				getProductHandle: function() {
					var href = window.location.href;
					href = href.replace('/products/products/', '/products/');
					
					if (/\/products\/([^\?#\/\n]+)/i.test(href)) {
						var found = href.match(/\/products\/([^\?#\/\n]+)/i);
						if (typeof found[1] !== 'undefined') {
							return found[1];
						}
					}
					return false;
				},
				getVariantId: function() {
					var qp = this.getQueryParams(window.location.search);
					if (typeof qp['variant'] !== 'undefined') {
						return qp['variant'];
					}
					
					return '';
				},
				getQueryParams: function(qs) {
					qs = qs.split('+').join(' ');

					var params = {},
						tokens,
						re = /[?&]?([^=]+)=([^&]*)/g;

					while (tokens = re.exec(qs)) {
						params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
					}

					return params;
				},
				getQuickCheckoutUrl: function(name, id) {
					return 'https://hamptonshomeau.myshopify.com/a/bundles/checkout/'+utils.encodeName(name)+'-'+utils.encodeId(id);
				},
				getLandingPageUrl: function(name, id) {
					var url = 'a/bundles/'+utils.encodeName(name)+'-'+utils.encodeId(id);

					var rootUrl = this.getRootUrl(true);
					return rootUrl+url;
				},
				getLocale: function() {
					if (typeof Shopify !== 'undefined' && typeof Shopify.locale === 'string') {
						return Shopify.locale
					}
					
					return '';
				},
				getUrlLocale: function() {
					var baseUrl = this.getRootUrl();
					var locale 	= this.getLocale();
					
					if (locale !== '') {
						// Check if the baseurl + locale is present in the url
						if (window.location.href.indexOf(baseUrl+locale+'/') === 0) {
							return locale;
						}
					}

					return '';
				}
			};
			
			// Collection of dumb functions
			var utils = {
				getRandomString: function() {
				   var result           = '';
				   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
				   var charactersLength = characters.length;
				   var a = [];
				   for ( var i = 0; i < 15; i++) {
					  a.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
				   }
				   return a.join('');
				},
				encodeId: function(num) {
					var chrs = '0123456789abcdefghijklmnopqrstuvwxyz';

					var result = '';
					var l = chrs.length;
					while (num) {
						result = chrs.charAt(num%l) + result;
						num = parseInt(num/l);
					}

					return result;
				},
				deCompress: function(code) {
					var chrs = '0123456789abcdefghijklmnopqrstuvwxyz';
					var result = 0;
				   
					var cl = code.length;
					for (var i = 0; i < cl; i++) {       
						result = (result * chrs.length + chrs.indexOf(code.charAt(i)));       
					}
				   
					return result;
				},
				encodeName: function(name) {
					name = name.toLowerCase();
					name = name.replace(/\s/g, '-');
					name = name.replace(/[/$\\?%#]/g, '');

					return name;
				},
				formatMoney: function(cents, format, fallbackCurrency, directionFor50) {
					
					// The directionFor50 is used to let the function know how to round numbers if the decimals equal 50.
					// We are using this direction for discounted value if the user chooses the amount_no_decimals format, because we calculate the discounted value in here by 
					// subtracting original - discount. 
					// E.g. 
					// original = 100
					// discount = 0.5
					// discounted value = 99.5
					// Rounded discounted value would be 100 and the rounded discount would be 1.
					if (typeof directionFor50 === 'undefined') {
						var directionFor50 = 'up';
					}
					
					try {
						if (typeof cents == 'string') {
							cents = cents.replace('.','');
						}

						var value = '';
						var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
						var formatString = format;

						function defaultOption(opt, def) {
							return (typeof opt == 'undefined' ? def : opt);
						}

						function formatWithDelimiters(number, precision, thousands, decimal, directionFor50) {

							precision 		= defaultOption(precision, 2);
							thousands 		= defaultOption(thousands, ',');
							decimal   		= defaultOption(decimal, '.');
							directionFor50  = defaultOption(directionFor50, 'up');

							if (isNaN(number) || number == null) {
								return 0;
							}

							var originalNumber = number;
							number = (number/100.0).toFixed(precision);
							
							if (directionFor50 === 'down') {
								if (((originalNumber/100) - number) === -0.5) {
									// We have rounded in the wrong direction
									// Subtract 1 to fix this
									number -= 1;
									number = number.toString();
								}
							}

							var parts 	= number.split('.'),
							dollars 	= parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
							cents   	= parts[1] ? (decimal + parts[1]) : '';

							return dollars + cents;
						}

						switch(formatString.match(placeholderRegex)[1]) {
							case 'amount':
							value = formatWithDelimiters(cents, 2);
							break;
							case 'amount_no_decimals':
							value = formatWithDelimiters(cents, 0, ',', '.', directionFor50);
							break;
							case 'amount_with_comma_separator':
							value = formatWithDelimiters(cents, 2, '.', ',');
							break;
							case 'amount_no_decimals_with_comma_separator':
							value = formatWithDelimiters(cents, 0, '.', ',', directionFor50);
							break;
							case 'amount_with_apostrophe_separator':
							value = formatWithDelimiters(cents, 2, "'", '.');
							break;
						}
					

						return formatString.replace(placeholderRegex, value);
						
					} catch(e) {
						bundlerConsole.log(e.message);
						
						price = cents/100;
						
						return price.toLocaleString(undefined, { style: 'currency', currency: fallbackCurrency });
					}
				},
				convertMoney: function(value, rate, currency) {
					// Converts money and rounds up based on the defined policy
					if (value <= 0) {
						return 0;
					}
					
					value *= rate;
					
					var roundUp = [
						'USD', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD', 'GBP'
					];
					
					var roundTo100 = [
						'JPY'
					];
					
					var roundTo95 = [
						'EUR'
					];
					
					if (roundUp.indexOf(currency) !== -1) {
						// Round up
						value = Math.ceil(value);						
					} else if(roundTo100.indexOf(currency) !== -1) {
						// Round to nearest 100
						value = Math.ceil(value/100)*100
					} else if(roundTo95.indexOf(currency) !== -1) {
						// Round up to 0.95
						value = Math.ceil(value) - 0.05;
					}
					
					return value;
				},
				// Loops through object and returns a comma separated list of desired values (1st level only).
				getListOfValues: function(object, key) {
					var list = '';
					for(var k in object) {
						if (object.hasOwnProperty(k)) {
							if (typeof object[k][key] !== 'undefined') {
								list += object[k][key]+',';
							}
						}
					}
					
					// Remove last comma
					list = list.replace(/,+$/, '');
					
					return list;
				}
			};
			
			// This library contains basic get and set methods, so you can easily add products and get products from specific collection/library
function ProductsLib() {
	this._library = {};
};

ProductsLib.prototype.get = function(key) {
	if (typeof key === 'undefined') {
		return this._library;
	} else if(typeof this._library[key] !== 'undefined') {
		return this._library[key];
	} else {
		return {};
	}
};

ProductsLib.prototype.isEmpty = function(key) {
	if (typeof key === 'undefined') {
		return true;
	} else if(typeof this._library[key] !== 'undefined') {
		return (Object.keys(this._library[key]).length == 0);
	} else {
		return true;
	}
};

ProductsLib.prototype.set = function(key, products) {
	this._library[key] = JSON.parse(JSON.stringify(products));
};

// This library contains original product information, discounted products and required products
// All changes to the products are directly reflected in these collections and methods should get products directly from the library.
// Products library contains data about products by id or by variant id (it depends). 
// Reqired products contains data about required products for bundles
// Discounted products contains data about actually discounted products in the bundles
var Library = {
	Products			: new ProductsLib(),
	RequiredProducts	: new ProductsLib(),
	DiscountedProducts	: new ProductsLib(),
	MixAndMatchBundles	: new ProductsLib()
};			function ProductsTools() {};

// Fills the discountedProducts library and requiredProducts library with actual product data
ProductsTools.prototype.setLibraries = function(Library, bundleId) {

	// Set values for discounted products
	var discountedProducts = Library.DiscountedProducts.get();
	if (discountedProducts.hasOwnProperty(bundleId)) {
		var products = {};
		for (var productId in discountedProducts[bundleId]) {
			if (discountedProducts[bundleId].hasOwnProperty(productId)) {
				products[productId] = Library.Products.get(productId);
			}
		}
		Library.DiscountedProducts.set(bundleId, products);
	}
	
	// Set values for required products
	var requiredProducts = Library.RequiredProducts.get();
	if (requiredProducts.hasOwnProperty(bundleId)) {
		var products = {};
		for (var productId in requiredProducts[bundleId]) {
			if (requiredProducts[bundleId].hasOwnProperty(productId)) {
				products[productId] = Library.Products.get(productId);
			}
		}

		Library.RequiredProducts.set(bundleId, products);
	}
};

// Sets the linePrice and compareAtLinePrice to Required Products library
ProductsTools.prototype.setRequiredVariantLinePrices = function(Library, bundle) {	
	var requiredProducts = Library.RequiredProducts.get(bundle.id);
	
	for(var key in requiredProducts) {
		if (requiredProducts.hasOwnProperty(key)) {
			var productId = requiredProducts[key].product_id;

			if (typeof bundle.required_products[productId] !== 'undefined') {
				var quantity = bundle.required_products[productId].quantity;

				/*
				if (fromPOS) {
					quantity = requiredProducts[key].quantity;
				}
				*/
				
				for (var i = 0; i < requiredProducts[key].variants.length; i++) {
					var price 				= Tools.Price.getPrice(requiredProducts[key].variants[i].price)*quantity;
					var compareAtLinePrice 	= Tools.Price.priceOrZero(requiredProducts[key].variants[i].compare_at_price)*quantity;
					
					// Assign total original price with quantity
					requiredProducts[key].variants[i].linePrice		 		= price;
					requiredProducts[key].variants[i].compareAtLinePrice	= compareAtLinePrice;
				}
			}
		}
	}
	
	Library.RequiredProducts.set(bundle.id, requiredProducts);
}


function PriceTools() {};
PriceTools.prototype.getPrice = function(price) {
	if (typeof price.indexOf === 'function' && price.indexOf('.') !== -1) {
		// Price has decimals in it
		// Multiply to get without decimals
		price = price * 100;
	}
	
	return price;
};

// This method will price or 0 if the price was undefined, null or ''
PriceTools.prototype.priceOrZero = function(price) {
	if (typeof price === 'undefined' || price === '' || price === null) {
		return 0;
	}
	
	return this.getPrice(price);
};

var Tools = {
	Products: new ProductsTools(),
	Price	: new PriceTools()
};			/*
function ProductRetrievalStatus() {
	this._products = {};
};

ProductRetrievalStatus.prototype.get = function(key) {
	if(typeof this._products[key] !== 'undefined') {
		return this._products[key];
	} else {
		return false;
	}
};

ProductRetrievalStatus.prototype.addCallback = function(key, callback) {
	if (typeof this._products[key] === 'undefined') {
		this._products[key] = {
			retrieved: false,
			callbacks: []
		};
	}
	
	this._products[key].callbacks.push(callback);
};

ProductRetrievalStatus.prototype.productWasRetrieved = function(key, id) {
	if (typeof this._products[key] === 'undefined') {
		this._products[key] = {
			retrieved: true,
			product_id: id,
			callbacks: []
		};
	}
	
	this._products[key]['product_id'] = id;
	
	for(var i = 0; i<this._products[key].callbacks.length; i++) {
		this._products[key].callbacks[i](id);
	}
};

var ProductRetrievalStatus = new ProductRetrievalStatus();
*/


var ProductRetrievalRequests 	= {};
var ProductRetrievalStatus 		= {};			
			var BndlrAnalytics = {
	init: function() {

			},
	// Track event with Facebook
	track: function(what, productId, variantId, quantity) {

		if (what === 'addtocart') {
							if (typeof fbq === 'function') {
					try {
						var eventId = 'id_'+Date.now();
						fbq('track', 'AddToCart', {
							content_ids: [productId],
							content_type: 'product',
							contents: [{id: productId, quantity: parseInt(quantity, 10)}]
						}, {eventID: eventId});
					} catch(e) {
						console.log(e);
						// Something went wrong
					}
				}
					}
	}
};

BndlrAnalytics.init();

			
			var bundles = [{"id":53176,"name":"Alpine Lamp Bundle Deal","title":"Alpine Lamp Bundle Deal","description":"Get A Pair For $500 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"10","fixed_amount_value":"58","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2151223164985":{"id":"2151223164985","title":"BESTSELLER Alpine Fog Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19061062860857":{"id":"19061062860857","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"alpine-pale-blue-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":85796,"name":"Blue and White Lamp Bundle Deal","title":"Blue and White Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2215909326905":{"id":"2215909326905","title":"Blue and White Jar Shaped Table Lamp with Shade 76 cm H","quantity":2,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"19267799646265":{"id":"19267799646265","title":"","quantity":2,"discount_amount":0,"sequence":2,"required":0}},"handle":"blue-and-white-jar-shaped-table-lamp-with-shade-76-cm-h"}},"required_products":[],"volume_discounts":[]},{"id":53696,"name":"Blue Bird Panel Artwork Bundle Deal","title":"Blue Bird Panel Artwork Bundle Deal","description":"Get the matching set and save $30 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.024","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5640923283608":{"id":"5640923283608","title":"Hamptons Blue and White Bird Panel (Design 1) Framed Wall Art 54 cm by 54 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35780544430232":{"id":"35780544430232","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-bird-panel-design-1-framed-wall-art-54-cm-by-54-cm"},"5640959590552":{"id":"5640959590552","title":"Hamptons Blue and White Bird Panel (Design 2) Framed Wall Art 54 cm by 54 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35780684120216":{"id":"35780684120216","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-bird-panel-design-2-framed-wall-art-54-cm-by-54-cm"}},"required_products":[],"volume_discounts":[]},{"id":90044,"name":"Blue Fern Artwork Bundle Deal","title":"Blue Fern Artwork Bundle Deal","description":"Get the matching set and save another 5% + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6629835407512":{"id":"6629835407512","title":"Blue Boston Fern Print 100cm H","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"39592765522072":{"id":"39592765522072","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"blue-boston-fern-print-100cm-h"},"6629830918296":{"id":"6629830918296","title":"Blue Maiden Hair Fern Print 100cm H","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"39592739700888":{"id":"39592739700888","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"blue-maiden-hair-fern-print-100cm-h"}},"required_products":[],"volume_discounts":[]},{"id":113379,"name":"Blue Pineapple Lamp Bundle Deal","title":"Blue Pineapple Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2215825571897":{"id":"2215825571897","title":"Blue Pineapple Table Lamp With Natural Linen Shade 79 cm H","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19267561619513":{"id":"19267561619513","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"blue-pineapple-table-lamp-with-natural-linen-shade-79-cm-h"}},"required_products":[],"volume_discounts":[]},{"id":85791,"name":"Blue Scaled Lamp Bundle Deal","title":"Blue Scaled Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2215903690809":{"id":"2215903690809","title":"Blue Scaled Ceramic Table Lamp with White Shade 73 cm H","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19267785359417":{"id":"19267785359417","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"blue-scaled-ceramic-table-lamp-with-white-shade-73-cm-h"}},"required_products":[],"volume_discounts":[]},{"id":113386,"name":"Claydon Multi Bedside Lamp Bundle Deal","title":"Claydon Multi Bedside Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2149282021433":{"id":"2149282021433","title":"Claydon Multi Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19056221847609":{"id":"19056221847609","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"claydon-multi-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":113385,"name":"Crushed Duck Egg Blue Erica Lamp Bundle Deal","title":"Crushed Duck Egg Blue Erica Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4156634562617":{"id":"4156634562617","title":"Crushed Duck Egg Blue Erica Table Lamp 68 cm H","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"30235665006649":{"id":"30235665006649","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"crushed-duck-egg-blue-erica-table-lamp-68-cm-h"}},"required_products":[],"volume_discounts":[]},{"id":94212,"name":"Hydrangea Lamp Bundle Deal","title":"Hydrangea Lamp Bundle Deal","description":"Get A Pair For $500 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_price","percentage_value":"10","fixed_amount_value":"58","fixed_price_value":"500","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2149278580793":{"id":"2149278580793","title":"Hydrangea White and Indigo Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19056210346041":{"id":"19056210346041","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"hydrangea-white-and-indigo-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":113383,"name":"Jasmine Blush Pink Lamp Bundle Deal","title":"Jasmine Blush Pink Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2151168311353":{"id":"2151168311353","title":"Jasmine Blush Pink Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19060932673593":{"id":"19060932673593","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"jasmine-blush-pink-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":53695,"name":"Koi Fish Artwork Bundle Deal","title":"Koi Fish Artwork Bundle Deal","description":"Get the matching set and save $50 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"6.775","fixed_amount_value":"50","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4372601471033":{"id":"4372601471033","title":"Hamptons Koi Fish Blue and White Chinoiserie Bamboo Framed Wall Art (Design 1)","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31291295039545":{"id":"31291295039545","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-koi-fish-blue-and-white-chinoiserie-brown-bamboo-framed-wall-art-design-1-40-6-by-3-5-by-49-6-cm-1"},"4356107042873":{"id":"4356107042873","title":"Hamptons Koi Fish Blue and White Chinoiserie Bamboo Framed Wall Art (Design 2)","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31254110732345":{"id":"31254110732345","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-koi-fish-blue-and-white-chinoiserie-brown-bamboo-framed-wall-art-design-1-40-6-by-3-5-by-49-6-cm"}},"required_products":[],"volume_discounts":[]},{"id":53175,"name":"Miccah Jar Bundle Deal","title":"Miccah Jar Bundle Deal","description":"Get the set and save 10%","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4158334861369":{"id":"4158334861369","title":"Gloss White Miccah Temple Jar Large 38 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"30237986816057":{"id":"30237986816057","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"gloss-white-miccah-temple-jar-range-large-38-cm"},"4158333386809":{"id":"4158333386809","title":"Gloss White Miccah Temple Jar Medium 32 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"30237976821817":{"id":"30237976821817","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"gloss-white-miccah-temple-jar-medium-32-cm"},"4158329225273":{"id":"4158329225273","title":"Gloss White Miccah Temple Jar White Small 26 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"30237959323705":{"id":"30237959323705","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"gloss-white-miccah-temple-jar-white-small-26-cm"}},"required_products":[],"volume_discounts":[]},{"id":53174,"name":"Minx Jar Bundle Deal","title":"Minx Jar Bundle Deal","description":"Get the set and save 10%","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"1724706684985":{"id":"1724706684985","title":"White Extra Small Minx Temple Jar 21 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"17010792562745":{"id":"17010792562745","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"white-extra-small-white-minx-temple-jar-21-cm"},"2179643277369":{"id":"2179643277369","title":"White Medium Minx Temple Jar 50 cm H","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"19154134728761":{"id":"19154134728761","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"white-medium-minx-temple-jar-50-cm-h"},"2179661430841":{"id":"2179661430841","title":"White Small Minx Temple Jar 39 cm H","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"19154232999993":{"id":"19154232999993","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"white-small-white-minx-temple-jar-21-cm"}},"required_products":[],"volume_discounts":[]},{"id":54292,"name":"Mix and Match Artwork Print Bundle Deal","title":"Mix and Match Artwork Print","description":"Buy any 2 and save 5%","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4321367785529":{"id":"4321367785529","title":"Conch Shell Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31050369957945":{"id":"31050369957945","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0},"31050369990713":{"id":"31050369990713","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0},"31050370023481":{"id":"31050370023481","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0},"31436801474617":{"id":"31436801474617","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"conch-shell-blue-and-white-art-print"},"4321395769401":{"id":"4321395769401","title":"Scallop Shell Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"31050505551929":{"id":"31050505551929","title":"","quantity":10,"discount_amount":0,"sequence":5,"required":0},"31050505650233":{"id":"31050505650233","title":"","quantity":10,"discount_amount":0,"sequence":6,"required":0},"31050505781305":{"id":"31050505781305","title":"","quantity":10,"discount_amount":0,"sequence":7,"required":0},"31436931956793":{"id":"31436931956793","title":"","quantity":10,"discount_amount":0,"sequence":8,"required":0}},"handle":"scallop-shell-blue-and-white-art-print"},"4321379254329":{"id":"4321379254329","title":"Conus Shell Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":9,"required":0,"variants":{"31050423435321":{"id":"31050423435321","title":"","quantity":10,"discount_amount":0,"sequence":9,"required":0},"31050423468089":{"id":"31050423468089","title":"","quantity":10,"discount_amount":0,"sequence":10,"required":0},"31050423500857":{"id":"31050423500857","title":"","quantity":10,"discount_amount":0,"sequence":11,"required":0},"31436802621497":{"id":"31436802621497","title":"","quantity":10,"discount_amount":0,"sequence":12,"required":0}},"handle":"conus-shell-blue-and-white-art-print"},"4321384726585":{"id":"4321384726585","title":"Lionfish Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":13,"required":0,"variants":{"31050451681337":{"id":"31050451681337","title":"","quantity":10,"discount_amount":0,"sequence":13,"required":0},"31050451714105":{"id":"31050451714105","title":"","quantity":10,"discount_amount":0,"sequence":14,"required":0},"31050451746873":{"id":"31050451746873","title":"","quantity":10,"discount_amount":0,"sequence":15,"required":0},"31436932448313":{"id":"31436932448313","title":"","quantity":10,"discount_amount":0,"sequence":16,"required":0}},"handle":"lionfish-blue-and-white-art-print"},"4321390559289":{"id":"4321390559289","title":"Paua Shell Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":17,"required":0,"variants":{"31050475143225":{"id":"31050475143225","title":"","quantity":10,"discount_amount":0,"sequence":17,"required":0},"31050475208761":{"id":"31050475208761","title":"","quantity":10,"discount_amount":0,"sequence":18,"required":0},"31050475307065":{"id":"31050475307065","title":"","quantity":10,"discount_amount":0,"sequence":19,"required":0},"31436931858489":{"id":"31436931858489","title":"","quantity":10,"discount_amount":0,"sequence":20,"required":0}},"handle":"paua-shell-blue-and-white-art-print"},"4321404223545":{"id":"4321404223545","title":"Scotch Bunnet Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":21,"required":0,"variants":{"31050546872377":{"id":"31050546872377","title":"","quantity":10,"discount_amount":0,"sequence":21,"required":0},"31050546905145":{"id":"31050546905145","title":"","quantity":10,"discount_amount":0,"sequence":22,"required":0},"31050546937913":{"id":"31050546937913","title":"","quantity":10,"discount_amount":0,"sequence":23,"required":0},"31436932350009":{"id":"31436932350009","title":"","quantity":10,"discount_amount":0,"sequence":24,"required":0}},"handle":"scotch-bunnet-blue-and-white-art-print"},"4321407828025":{"id":"4321407828025","title":"Weedy Seadragon Blue and White Art Print","quantity":10,"discount_amount":0,"image":"","sequence":25,"required":0,"variants":{"31050563256377":{"id":"31050563256377","title":"","quantity":10,"discount_amount":0,"sequence":25,"required":0},"31050563289145":{"id":"31050563289145","title":"","quantity":10,"discount_amount":0,"sequence":26,"required":0},"31050563321913":{"id":"31050563321913","title":"","quantity":10,"discount_amount":0,"sequence":27,"required":0},"31436932382777":{"id":"31436932382777","title":"","quantity":10,"discount_amount":0,"sequence":28,"required":0}},"handle":"weedy-seadragon-blue-and-white-art-print"}},"required_products":[],"volume_discounts":[]},{"id":54304,"name":"Mix and Match Blue Coral Artwork Bundle Deal","title":"Mix and Match Blue Coral Artwork Bundle Deal","description":"Buy any 2 and save $20 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.025","fixed_amount_value":"20","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4356053893177":{"id":"4356053893177","title":"Hamptons Blue Coral White Framed Wall Art (Design 1) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31253910978617":{"id":"31253910978617","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-coral-white-framed-wall-art-design-1-61-cm-by-52-cm-by-2-cm"},"4356057923641":{"id":"4356057923641","title":"Hamptons Blue Coral White Framed Wall Art (Design 2) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31253917990969":{"id":"31253917990969","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-coral-white-framed-wall-art-design-2-61-cm-by-52-cm-by-2-cm"},"4356058841145":{"id":"4356058841145","title":"Hamptons Blue Coral White Framed Wall Art (Design 3)  61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31253926608953":{"id":"31253926608953","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-blue-coral-white-framed-wall-art-design-3-61-cm-by-52-cm-by-2-cm"},"4356062052409":{"id":"4356062052409","title":"Hamptons Blue Coral White Framed Wall Art (Design 4)  61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31253936078905":{"id":"31253936078905","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-blue-coral-white-framed-wall-art-design-4-61-cm-by-52-cm-by-2-cm"}},"required_products":[],"volume_discounts":[]},{"id":54307,"name":"Mix and Match Dark Rattan Artwork Bundle Deal (Large)","title":"Mix and Match Dark Rattan Artwork Bundle Deal (Large)","description":"Buy any 2 and save $50","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.775","fixed_amount_value":"50","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4644943462457":{"id":"4644943462457","title":"Hamptons Home Dark Rattan Banana Palm Framed Artwork  (Design 2) 93 cm x 74 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31649938636857":{"id":"31649938636857","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-home-dark-rattan-banana-palm-framed-artwork-design-2-93-cm-x-74-cm"},"4644959191097":{"id":"4644959191097","title":"Hamptons Home Dark Rattan Cocoa Palm Framed Artwork   (Design 4) 93 cm x 74 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31649993949241":{"id":"31649993949241","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-home-dark-rattan-cocoa-palm-framed-artwork-design-4-93-cm-x-74-cm"},"4644957126713":{"id":"4644957126713","title":"Hamptons Home Dark Rattan Date Nut Framed Artwork  (Design 3) 93 cm x 74 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31649989656633":{"id":"31649989656633","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-home-dark-rattan-date-nut-framed-artwork-design-3-93-cm-x-74-cm"},"4644581802041":{"id":"4644581802041","title":"Hamptons Home Dark Rattan Paw Paw (Design 1) Framed Artwork 93 cm x 74 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31649118847033":{"id":"31649118847033","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-home-dark-rattan-paw-paw-design-1-framed-artwork-93-cm-x-74-cm"}},"required_products":[],"volume_discounts":[]},{"id":54302,"name":"Mix and Match Deep Blue Sea Coral Artwork Bundle Deal","title":"Mix and Match Deep Blue Sea Coral Artwork Bundle Deal","description":"Buy any 2 and save $25 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.981","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5641047277720":{"id":"5641047277720","title":"Hamptons Deep Blue Sea Corals White Framed Wall Art (Design 1) 54 cm by 54 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35781055119512":{"id":"35781055119512","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-deep-blue-sea-corals-white-framed-wall-art-design-1-54-cm-by-54-cm"},"5641084240024":{"id":"5641084240024","title":"Hamptons Deep Blue Sea Corals White Framed Wall Art (Design 2) 54 cm by 54 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35781199102104":{"id":"35781199102104","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-deep-blue-sea-corals-white-framed-wall-art-design-2-54-cm-by-54-cm"},"5641108619416":{"id":"5641108619416","title":"Hamptons Deep Blue Sea Corals White Framed Wall Art (Design 3) 54 cm by 54 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"35781298815128":{"id":"35781298815128","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-deep-blue-sea-corals-white-framed-wall-art-design-3-54-cm-by-54-cm"},"5641127559320":{"id":"5641127559320","title":"Hamptons Deep Blue Sea Corals White Framed Wall Art (Design 4) 54 cm by 54 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"35781397577880":{"id":"35781397577880","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-deep-blue-sea-corals-white-framed-wall-art-design-4-54-cm-by-54-cm"}},"required_products":[],"volume_discounts":[]},{"id":54294,"name":"Mix and Match Ginger Jar Artwork Bundle Deal","title":"Mix and Match Ginger Jar Artwork Bundle Deal","description":"Buy any 2 and save $50 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.775","fixed_amount_value":"50","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4372608483385":{"id":"4372608483385","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 1) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31291319386169":{"id":"31291319386169","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-1-63-2-cm-by-83-2-cm"},"4372612775993":{"id":"4372612775993","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 2) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31291324727353":{"id":"31291324727353","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-2-63-2-cm-by-83-2-cm"},"4372614283321":{"id":"4372614283321","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 3) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31291330723897":{"id":"31291330723897","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-3-63-2-cm-by-83-2-cm"},"4372614709305":{"id":"4372614709305","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 4) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31291336032313":{"id":"31291336032313","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-4-63-2-cm-by-83-2-cm"}},"required_products":[],"volume_discounts":[]},{"id":54311,"name":"Mix and Match Hamptons Artwork Bundle Deal (Landscape Style)","title":"Mix and Match Hamptons Artwork Bundle Deal (Landscape Style)","description":"Buy any 2 and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4372539801657":{"id":"4372539801657","title":"Hamptons Beach Boat at Dock Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31291104854073":{"id":"31291104854073","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-beach-boat-at-dock-framed-wall-art-102-by-77-cm"},"4343551655993":{"id":"4343551655993","title":"Hamptons Beach Brown Hammock Coconut Trees Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31217397170233":{"id":"31217397170233","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-beach-brown-hammock-coconut-trees-framed-wall-art-102-cm-by-72-cm"},"4343486709817":{"id":"4343486709817","title":"Hamptons Veranda by the Sea Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31217250074681":{"id":"31217250074681","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-veranda-by-the-sea-framed-wall-art-102-cm-by-72-cm"},"4343565516857":{"id":"4343565516857","title":"Hamptons Veranda Mountain View Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31217849434169":{"id":"31217849434169","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-veranda-mountain-view-framed-wall-art-102-by-77-cm"},"4343547756601":{"id":"4343547756601","title":"Hamptons Beach White Hammock Coconut Trees Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"31217392222265":{"id":"31217392222265","title":"","quantity":10,"discount_amount":0,"sequence":5,"required":0}},"handle":"hamptons-beach-white-hammock-coconut-trees-framed-wall-art-102-cm-by-72-cm"},"4343585505337":{"id":"4343585505337","title":"Hamptons White Yacht Beach Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":6,"required":0,"variants":{"31218268176441":{"id":"31218268176441","title":"","quantity":10,"discount_amount":0,"sequence":6,"required":0}},"handle":"hamptons-white-yacht-beach-framed-wall-art-102-by-77-cm"},"4343570497593":{"id":"4343570497593","title":"Hamptons Beach Vista Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"31217956683833":{"id":"31217956683833","title":"","quantity":10,"discount_amount":0,"sequence":7,"required":0}},"handle":"hamptons-beach-vista-framed-wall-art-102-by-77-cm"},"4343492345913":{"id":"4343492345913","title":"Hamptons Beach Huts and Boats Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":8,"required":0,"variants":{"31217266851897":{"id":"31217266851897","title":"","quantity":10,"discount_amount":0,"sequence":8,"required":0}},"handle":"hamptons-beach-huts-and-boats-framed-wall-art-102-cm-by-72-cm"}},"required_products":[],"volume_discounts":[]},{"id":54310,"name":"Mix and Match Hamptons Artwork Bundle Deal (Portrait Style)","title":"Mix and Match Hamptons Portrait Artwork Bundle Deal","description":"Buy any 2 and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4343510466617":{"id":"4343510466617","title":"Hamptons Adirondack Chair at Beach Hut Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31217311318073":{"id":"31217311318073","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-adirondack-chair-at-beach-hut-framed-wall-art-102-cm-by-72-cm"},"4343506042937":{"id":"4343506042937","title":"Hamptons Adirondack Chairs Seaview Framed Wall Art 102 cm by 72 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31217302077497":{"id":"31217302077497","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-adirondack-chairs-seaview-framed-wall-art-102-cm-by-72-cm"},"4356048420921":{"id":"4356048420921","title":"Hamptons Hammock on Veranda Beach Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31253893382201":{"id":"31253893382201","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-hammock-on-veranda-beach-framed-wall-art-102-by-77-cm"},"4356045242425":{"id":"4356045242425","title":"Hamptons Hammock on Veranda Framed Wall Art 102 by 77 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31253878276153":{"id":"31253878276153","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-hammock-on-veranda-framed-wall-art-102-by-77-cm"}},"required_products":[],"volume_discounts":[]},{"id":54295,"name":"Mix and Match Ming Jar Artwork Bundle Deal","title":"Mix and Match Ming Jar Artwork Bundle Deal","description":"Buy any 2 and save $25 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.981","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5641156591768":{"id":"5641156591768","title":"Hamptons Ming Vase (Design 1) Bamboo Style Timber Frame 53 cm by 43.5 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35781564104856":{"id":"35781564104856","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-ming-vase-design-1-bamboo-style-timber-frame-53-cm-by-43-5-cm"},"5641172058264":{"id":"5641172058264","title":"Hamptons Ming Vase (Design 2) Bamboo Style Timber Frame 53 cm by 43.5 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35781637374104":{"id":"35781637374104","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-ming-vase-design-2-bamboo-style-timber-frame-53-cm-by-43-5-cm"},"5641199616152":{"id":"5641199616152","title":"Hamptons Ming Vase (Design 3) Bamboo Style Timber Frame 53 cm by 43.5 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"35781755797656":{"id":"35781755797656","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-ming-vase-design-3-bamboo-style-timber-frame-53-cm-by-43-5-cm"},"5641215279256":{"id":"5641215279256","title":"Hamptons Ming Vase (Design 4) Bamboo Style Timber Frame 53 cm by 43.5 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"35781833490584":{"id":"35781833490584","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-ming-vase-design-4-bamboo-style-timber-frame-53-cm-by-43-5-cm"}},"required_products":[],"volume_discounts":[]},{"id":70493,"name":"Mix and Match Outdoor Bean Bag Bundle Deal","title":"Mix and Match Outdoor Bean Bag Bundle Deal","description":"Get Any Two and Save 5% + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6150785728664":{"id":"6150785728664","title":"East Port Extra Large Outdoor Bean Bag (Various Colours)","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37629877387416":{"id":"37629877387416","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0},"37629877420184":{"id":"37629877420184","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0},"37629877452952":{"id":"37629877452952","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"cape-cod-extra-large-outdoor-bean-bag"},"6195210059928":{"id":"6195210059928","title":"Hamptons Bay Extra Long Bean Bag Chair (Various Colours)","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"37826977267864":{"id":"37826977267864","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0},"37826977300632":{"id":"37826977300632","title":"","quantity":10,"discount_amount":0,"sequence":5,"required":0},"37826977333400":{"id":"37826977333400","title":"","quantity":10,"discount_amount":0,"sequence":6,"required":0}},"handle":"hamptons-bay-bean-bag-chair-various-colours"},"6150831734936":{"id":"6150831734936","title":"Long Island Outdoor Bean Bag Chair (Various Colours)","quantity":10,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"37630087069848":{"id":"37630087069848","title":"","quantity":10,"discount_amount":0,"sequence":7,"required":0},"37630087102616":{"id":"37630087102616","title":"","quantity":10,"discount_amount":0,"sequence":8,"required":0},"37630087135384":{"id":"37630087135384","title":"","quantity":10,"discount_amount":0,"sequence":9,"required":0}},"handle":"long-island-outdoor-bean-bag-chair"},"6150810763416":{"id":"6150810763416","title":"Sag Harbor Outdoor Bean Bag Ottoman (Various Colours)","quantity":10,"discount_amount":0,"image":"","sequence":10,"required":0,"variants":{"37630007902360":{"id":"37630007902360","title":"","quantity":10,"discount_amount":0,"sequence":10,"required":0},"37630007935128":{"id":"37630007935128","title":"","quantity":10,"discount_amount":0,"sequence":11,"required":0},"37630007967896":{"id":"37630007967896","title":"","quantity":10,"discount_amount":0,"sequence":12,"required":0}},"handle":"sag-harbor-outdoor-bean-bag-ottoman"},"6150750634136":{"id":"6150750634136","title":"Southampton Outdoor Bean Bag Chair (Various Colours)","quantity":10,"discount_amount":0,"image":"","sequence":13,"required":0,"variants":{"37629719871640":{"id":"37629719871640","title":"","quantity":10,"discount_amount":0,"sequence":13,"required":0},"37629719904408":{"id":"37629719904408","title":"","quantity":10,"discount_amount":0,"sequence":14,"required":0},"37629719937176":{"id":"37629719937176","title":"","quantity":10,"discount_amount":0,"sequence":15,"required":0}},"handle":"southampton-outdoor-bean-bag-chair"}},"required_products":[],"volume_discounts":[]},{"id":63930,"name":"Mix and Match Pantry Label Gift Box Set","title":"Mix and Match Pantry Label Gift Box Set","description":"Buy any 2 and save 10% + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4388337549369":{"id":"4388337549369","title":"Retro Black and Grey Pantry Label Gift Box Set","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31320655790137":{"id":"31320655790137","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"retro-black-and-grey-pantry-label-gift-box-set"},"4387993354297":{"id":"4387993354297","title":"Vintage Black and White Pantry Label Gift Set","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31320473206841":{"id":"31320473206841","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"vintage-black-and-white-pantry-label-gift-set"}},"required_products":[],"volume_discounts":[]},{"id":54309,"name":"Mix and Match Rattan Artwork Bundle Deal (Small)","title":"Mix and Match Rattan Artwork Bundle Deal (Small)","description":"Buy any 2 and save $20 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.025","fixed_amount_value":"20","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4644571349049":{"id":"4644571349049","title":"Hamptons Home Banana Palm Small Framed Artwork  (Design 2) 53 cm x 43.5cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31649094762553":{"id":"31649094762553","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-home-banana-palm-small-framed-artwork-design-2-53-cm-x-43-5cm"},"4644578492473":{"id":"4644578492473","title":"Hamptons Home Cocoa Palm Small Framed Artwork  (Design 4) 53 cm x 43.5cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31649111113785":{"id":"31649111113785","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-home-cocoa-palm-small-framed-artwork-design-4-53-cm-x-43-5cm"},"4644575051833":{"id":"4644575051833","title":"Hamptons Home Date Palm Small Framed Artwork  (Design 3) 53 cm x 43.5cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31649101873209":{"id":"31649101873209","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-home-date-palm-small-framed-artwork-design-3-53-cm-x-43-5cm"},"4644563451961":{"id":"4644563451961","title":"Hamptons Home Pawpaw Palm Small Framed Artwork (Design 1) 53 cm x 43.5cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31649076510777":{"id":"31649076510777","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-home-pawpaw-palm-small-framed-artwork-design-1-53-cm-x-43-5cm"}},"required_products":[],"volume_discounts":[]},{"id":54306,"name":"Mix and Match Rustic Farmhouse Artwork Bundle Deal","title":"Mix and Match Rustic Farmhouse Artwork Bundle Deal","description":"Buy any 2 and save $30 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.576","fixed_amount_value":"30","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5640685912216":{"id":"5640685912216","title":"Hamptons Farm House Rustic (Design 1) Framed Wall Art 62 cm by 62 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35779395911832":{"id":"35779395911832","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-farm-house-rustic-design-1-framed-wall-art-62-cm-by-62-cm"},"5640740700312":{"id":"5640740700312","title":"Hamptons Farm House Rustic (Design 2) Framed Wall Art 62 cm by 62 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35779677454488":{"id":"35779677454488","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-farm-house-rustic-design-2-framed-wall-art-62-cm-by-62-cm"},"5640777433240":{"id":"5640777433240","title":"Hamptons Farm House Rustic (Design 3) Framed Wall Art 62 cm by 62 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"35779883204760":{"id":"35779883204760","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-farm-house-rustic-design-3-framed-wall-art-62-cm-by-62-cm"},"5640816623768":{"id":"5640816623768","title":"Hamptons Farm House Rustic (Design 4) Framed Wall Art 62 cm by 62 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"35780067098776":{"id":"35780067098776","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-farm-house-rustic-design-4-framed-wall-art-62-cm-by-62-cm"}},"required_products":[],"volume_discounts":[]},{"id":54305,"name":"Mix and Match White Coral Artwork Bundle Deal","title":"Mix and Match White Coral Artwork Bundle Deal","description":"Buy any 2 and save $20 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5.025","fixed_amount_value":"20","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4356081188921":{"id":"4356081188921","title":"Hamptons White Coral White Framed Wall Art (Design 1) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31254011641913":{"id":"31254011641913","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-white-coral-white-framed-wall-art-design-1-61-cm-by-52-cm-by-2-cm"},"4356083712057":{"id":"4356083712057","title":"Hamptons White Coral White Framed Wall Art (Design 2) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31254019276857":{"id":"31254019276857","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-white-coral-white-framed-wall-art-design-2-61-cm-by-52-cm-by-2-cm"},"4356085547065":{"id":"4356085547065","title":"Hamptons White Coral White Framed Wall Art (Design 3) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31254027993145":{"id":"31254027993145","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-white-coral-white-framed-wall-art-design-3-61-cm-by-52-cm-by-2-cm"},"4356088856633":{"id":"4356088856633","title":"Hamptons White Coral White Framed Wall Art (Design 4) 61cm x 52cm x 2cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31254038970425":{"id":"31254038970425","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-white-coral-white-framed-wall-art-design-4-61-cm-by-52-cm-by-2-cm"}},"required_products":[],"volume_discounts":[]},{"id":60338,"name":"Mix and Match Willow Artwork Bundle Deal","title":"Mix and Match Willow Artwork Bundle Deal","description":"Buy any two artwork in this collection and save $50","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"10","fixed_amount_value":"50","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"n_products","minimum_requirements_num":2,"minimum_requirements_n_max_products":2,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"true","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4372608483385":{"id":"4372608483385","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 1) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31291319386169":{"id":"31291319386169","title":"","quantity":10,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-1-63-2-cm-by-83-2-cm"},"4372612775993":{"id":"4372612775993","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 2) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31291324727353":{"id":"31291324727353","title":"","quantity":10,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-2-63-2-cm-by-83-2-cm"},"4372614283321":{"id":"4372614283321","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 3) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"31291330723897":{"id":"31291330723897","title":"","quantity":10,"discount_amount":0,"sequence":3,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-3-63-2-cm-by-83-2-cm"},"4372614709305":{"id":"4372614709305","title":"Hamptons Blue and White Ginger Jar Bamboo Framed Wall Art (Design 4) 63.2 cm by 83.2 cm","quantity":10,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"31291336032313":{"id":"31291336032313","title":"","quantity":10,"discount_amount":0,"sequence":4,"required":0}},"handle":"hamptons-blue-and-white-ginger-jar-bamboo-framed-wall-art-design-4-63-2-cm-by-83-2-cm"}},"required_products":[],"volume_discounts":[]},{"id":54299,"name":"Oars Artwork Bundle Deal","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5640996126872":{"id":"5640996126872","title":"Hamptons Oars (Design 1) White Washed Timber Frame 102 cm by 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35780866474136":{"id":"35780866474136","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-oars-design-1-white-washed-timber-frame-102-cm-by-72-cm"},"5641016246424":{"id":"5641016246424","title":"Hamptons Oars (Design 2) White Washed Timber Frame 102 cm by 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35780934369432":{"id":"35780934369432","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-oars-design-2-white-washed-timber-frame-102-cm-by-72-cm"}},"required_products":[],"volume_discounts":[]},{"id":53697,"name":"Parasol Artwork Bundle Deal A","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"35","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595310886969":{"id":"4595310886969","title":"Hamptons Coastal Beach Parasol (Design 1 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547007893561":{"id":"31547007893561","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-1-framed-wall-art-102-cm-x-72-cm"},"4595312492601":{"id":"4595312492601","title":"Hamptons Coastal Beach Parasol (Design 2 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547009171513":{"id":"31547009171513","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-2-framed-wall-art-102-cm-x-72-cm"}},"required_products":[],"volume_discounts":[]},{"id":53699,"name":"Parasol Artwork Bundle Deal B","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595319406649":{"id":"4595319406649","title":"Hamptons Coastal Beach Parasol (Design 3 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547012874297":{"id":"31547012874297","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-3-framed-wall-art-102-cm-x-72-cm"},"4595320586297":{"id":"4595320586297","title":"Hamptons Coastal Beach Parasol (Design 4 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547013300281":{"id":"31547013300281","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-4-framed-wall-art-102-cm-x-72-cm"}},"required_products":[],"volume_discounts":[]},{"id":85790,"name":"Shaynna Blaze Lamp - Glass Brass Bundle Deal","title":"Shaynna Blaze Lamp Bundle Deal ","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6110411554968":{"id":"6110411554968","title":"Shaynna Blaze Palm Beach Glass Brass Lamp 66 cm H","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37486941503640":{"id":"37486941503640","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"shaynna-blaze-palm-beach-glass-brass-lamp"}},"required_products":[],"volume_discounts":[]},{"id":85788,"name":"Shaynna Blaze Lamp - Glass Nickel Bundle Deal","title":"Shaynna Blaze Lamp Bundle Deal ","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6110391763096":{"id":"6110391763096","title":"Shaynna Blaze Palm Beach Glass Nickel Lamp 66 cm H","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37486834352280":{"id":"37486834352280","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"shaynna-blaze-palm-beach-glass-nickel-lamp"}},"required_products":[],"volume_discounts":[]},{"id":113381,"name":"Tahitian Kelly Green Lamp Bundle Deal","title":"Tahitian Kelly Green Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2151166738489":{"id":"2151166738489","title":"Tahitian Kelly Green Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19060927922233":{"id":"19060927922233","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"tahitian-kelly-green-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":60344,"name":"Tea Time Artwork Bundle Deal","title":"Tea Time Artwork Bundle Deal","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"6.775","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595322748985":{"id":"4595322748985","title":"Hamptons Blue and White Tea China Framed Wall Art 54 cm by 74 cm (Design 1)","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547025358905":{"id":"31547025358905","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-tea-china-framed-wall-art-54-cm-by-74-cm"},"4595324715065":{"id":"4595324715065","title":"Hamptons Blue and White Tea China Framed Wall Art 54 cm by 74 cm (Design 2)","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547031781433":{"id":"31547031781433","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-tea-china-framed-wall-art-54-cm-by-74-cm-1"}},"required_products":[],"volume_discounts":[]},{"id":113384,"name":"Venezia Mint Lamp Bundle Deal","title":"Venezia Mint Lamp Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"5","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2151058178105":{"id":"2151058178105","title":"Venezia Mint Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19060615381049":{"id":"19060615381049","title":"","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"venezia-mint-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]},{"id":117576,"name":"AGERY Dark Blue Cushion 30 cm by 50 cm Bundle Deal","title":"AGERY Dark Blue Cushion 30 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608251228312":{"id":"5608251228312","title":"AGERY Dark Blue Plain Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35664105537688":{"id":"35664105537688","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"agery-dark-blue-plain-velvet-cushion-cover-30-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":2,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Delivery ","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Delivery","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Delivery + Free Leather Keyring Gift Set","counter":3}]},{"id":117575,"name":"AGERY Dark Blue Cushion 55 cm by 55 cm Bundle Deal","title":"AGERY Dark Blue Cushion 55 cm by 55 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608251031704":{"id":"5608251031704","title":"AGERY Dark Blue Plain Velvet Cushion Cover 55 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664105308312":{"id":"35664105308312","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"agery-dark-blue-plain-velvet-cushion-cover-55-cm-by-55-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Shipping","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117594,"name":"BADEN Dark Blue Cushion 30 cm by 50 cm Bundle Deal","title":"BADEN Dark Blue Cushion 30 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608251523224":{"id":"5608251523224","title":"BADEN Dark Blue and White Panel Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664106750104":{"id":"35664106750104","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"baden-dark-blue-and-white-panel-velvet-cushion-cover-30-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":2,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Delivery ","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Delivery","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Delivery + Free Leather Keyring Gift Set","counter":3}]},{"id":117595,"name":"BADEN Dark Blue Cushion 50 cm by 50 cm Bundle Deal","title":"BADEN Dark Blue Cushion 50 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608251588760":{"id":"5608251588760","title":"BADEN Dark Blue and White Panel Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664106815640":{"id":"35664106815640","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"baden-dark-blue-and-white-panel-velvet-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Shipping","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117599,"name":"Black Cushion Cover Mix and Match Bundle Deal","title":"Black Cushion Cover Mix and Match Bundle Deal","description":"Mix and Match 2 Or More And Save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"5608250933400":{"id":"5608250933400","title":"AGERY Black Plain Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664105177240":{"id":"35664105177240","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"agery-black-plain-velvet-cushion-cover-30-cm-by-50-cm"},"5608250998936":{"id":"5608250998936","title":"AGERY Black Plain Velvet Cushion Cover 55 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35664105275544":{"id":"35664105275544","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"agery-black-plain-velvet-cushion-cover-55-cm-by-55-cm"},"5608251457688":{"id":"5608251457688","title":"BADEN Black and White Panel Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"35664106651800":{"id":"35664106651800","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"baden-black-and-white-panel-velvet-cushion-cover-50-cm-by-50-cm"},"5608252047512":{"id":"5608252047512","title":"CALDER Black and Jute Double Strip Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"35664107438232":{"id":"35664107438232","title":"","quantity":1,"discount_amount":0,"sequence":4,"required":0}},"handle":"calder-black-and-jute-double-strip-velvet-cushion-cover-30-cm-by-50-cm"},"5608251981976":{"id":"5608251981976","title":"CALDER Black and Jute Double Strip Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"35664107405464":{"id":"35664107405464","title":"","quantity":1,"discount_amount":0,"sequence":5,"required":0}},"handle":"calder-black-and-jute-double-strip-velvet-cushion-cover-50-cm-by-50-cm"},"5608252113048":{"id":"5608252113048","title":"CALDER Black and White Border Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":6,"required":0,"variants":{"35664107634840":{"id":"35664107634840","title":"","quantity":1,"discount_amount":0,"sequence":6,"required":0}},"handle":"calder-black-and-white-border-velvet-cushion-cover-50-cm-by-50-cm"},"5608252506264":{"id":"5608252506264","title":"DARLEY Black and White Circle Pattern Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"35664108028056":{"id":"35664108028056","title":"","quantity":1,"discount_amount":0,"sequence":7,"required":0}},"handle":"darley-black-and-white-circle-pattern-embroidered-velvet-cushion-cover-50-cm-by-50-cm"},"5608252604568":{"id":"5608252604568","title":"DARLEY Black and White Scallop Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":8,"required":0,"variants":{"35664108159128":{"id":"35664108159128","title":"","quantity":1,"discount_amount":0,"sequence":8,"required":0}},"handle":"darley-black-and-white-scallop-embroidered-velvet-cushion-cover-50-cm-by-50-cm"},"5608252571800":{"id":"5608252571800","title":"DARLEY Black and White Squares Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":9,"required":0,"variants":{"35664108126360":{"id":"35664108126360","title":"","quantity":1,"discount_amount":0,"sequence":9,"required":0}},"handle":"darley-black-and-white-squares-embroidered-velvet-cushion-cover-50-cm-by-50-cm"},"5608215117976":{"id":"5608215117976","title":"FLYNN Black and Silver Jute Thick Border Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":10,"required":0,"variants":{"35663961620632":{"id":"35663961620632","title":"","quantity":1,"discount_amount":0,"sequence":10,"required":0}},"handle":"flynn-black-and-silver-jute-thick-border-velvet-cushion-cover-50-cm-by-50-cm"},"5608215183512":{"id":"5608215183512","title":"FLYNN Black and Silver Jute Wide Panel Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":11,"required":0,"variants":{"35663961653400":{"id":"35663961653400","title":"","quantity":1,"discount_amount":0,"sequence":11,"required":0}},"handle":"flynn-black-and-silver-jute-wide-panel-velvet-cushion-cover-50-cm-by-50-cm"},"5608215216280":{"id":"5608215216280","title":"FLYNN Black Velvet and Silver Jute Reversible Velvet Cushion Cover 55 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":12,"required":0,"variants":{"35663961686168":{"id":"35663961686168","title":"","quantity":1,"discount_amount":0,"sequence":12,"required":0}},"handle":"flynn-black-velvet-and-silver-jute-reversible-velvet-cushion-cover-55-cm-by-55-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save  A Further 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save A Further 10% + Free Shipping ","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 Pieces Or More ","savings_text":"Save A Further 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117232,"name":"Chinoiserie Cushion Mix and Match Bundle Deal","title":"Chinoiserie Cushion Mix and Match Bundle Deal","description":"Choice of Ginger Jar, Pagoda or Plum Blossom Design","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6226918998168":{"id":"6226918998168","title":"Pagoda Blue and White Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37971532808344":{"id":"37971532808344","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"pagoda-blue-and-white-cushion-cover-30-cm-by-50-cm"},"6226926665880":{"id":"6226926665880","title":"Ginger Jar Blue and White Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"37971565314200":{"id":"37971565314200","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"ginger-jar-blue-and-white-cushion-cover-50-cm-by-50-cm"},"6226879774872":{"id":"6226879774872","title":"Plum Blossom Ginger Jar Trio Blue and White Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"37971374932120":{"id":"37971374932120","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"plum-blossom-ginger-jar-trio-blue-and-white-cushion-cover-30-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Purchase 2 Or More And Save A Further 5%","savings_text":"5% savings ","counter":1},{"min_items":4,"max_items":100,"discount_type":"percentage","discount_value":"10","range_type":"range","description":"Purchase 4 Or More","savings_text":"10% savings + Free Delivery + Free Leather Keyring Gift Set","counter":2}]},{"id":117591,"name":"DARLEY Scallop Cushion Cover 50 cm by 50 cm Bundle Deal","title":"DARLEY Scallop Cushion Cover 50 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608252801176":{"id":"5608252801176","title":"DARLEY Dark Blue and White Scallop Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664108486808":{"id":"35664108486808","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"darley-dark-blue-and-white-scallop-embroidered-velvet-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces ","savings_text":"Save 10% + Free Shipping","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117590,"name":"DARLEY Trellis Cushion Cover 50 cm by 50 cm Bundle Deal","title":"DARLEY Trellis Cushion Cover 50 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608252899480":{"id":"5608252899480","title":"DARLEY Dark Blue and White Trellis Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664108617880":{"id":"35664108617880","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"darley-dark-blue-and-white-trellis-embroidered-velvet-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces ","savings_text":"Save 10% + Free Shipping","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":119840,"name":"Fern Blue Framed Wall Art Bundle Deal","title":"Fern Blue Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6996934787224":{"id":"6996934787224","title":"Fern Blue Framed Wall Art (Design 1) 54.3 cm by 45.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"40873953132696":{"id":"40873953132696","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"fern-blue-framed-wall-art-design-1-54-3-cm-by-45-3-cm"},"6996959232152":{"id":"6996959232152","title":"Fern Blue Framed Wall Art (Design 2) 54.3 cm by 45.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"40874001563800":{"id":"40874001563800","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"fern-blue-framed-wall-art-design-2-54-3-cm-by-45-3-cm"},"6996968800408":{"id":"6996968800408","title":"Fern Blue Framed Wall Art (Design 3) 54.3 cm by 45.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"40874015719576":{"id":"40874015719576","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"fern-blue-framed-wall-art-design-3-54-3-cm-by-45-3-cm"},"6996972929176":{"id":"6996972929176","title":"Fern Blue Framed Wall Art (Design 4) 54.3 cm by 45.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"40874023583896":{"id":"40874023583896","title":"","quantity":1,"discount_amount":0,"sequence":4,"required":0}},"handle":"fern-blue-framed-wall-art-design-4-54-3-cm-by-45-3-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]},{"id":117601,"name":"Fog Blue Cushion Cover Mix and Match Bundle Deal","title":"Fog Blue Cushion Cover Mix and Match Bundle Deal","description":"Mix and Match 2 Or More And Save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"5608251064472":{"id":"5608251064472","title":"AGERY Fog Blue Plain Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664105373848":{"id":"35664105373848","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"agery-fog-blue-plain-velvet-cushion-cover-30-cm-by-50-cm"},"5608251621528":{"id":"5608251621528","title":"BADEN Fog Blue and White Panel Velvet Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35664106848408":{"id":"35664106848408","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"baden-fog-blue-and-white-panel-velvet-cushion-cover-30-cm-by-50-cm"},"5608251850904":{"id":"5608251850904","title":"BADEN Fog Blue and White Panel Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"35664107274392":{"id":"35664107274392","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"baden-fog-blue-and-white-panel-velvet-cushion-cover-50-cm-by-50-cm"},"5608251818136":{"id":"5608251818136","title":"BADEN White and Fog Blue Velvet Twin Strip Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"35664107176088":{"id":"35664107176088","title":"","quantity":1,"discount_amount":0,"sequence":4,"required":0}},"handle":"baden-white-and-fog-blue-velvet-twin-strip-cushion-cover-30-cm-by-50-cm"},"2151223164985":{"id":"2151223164985","title":"BESTSELLER Alpine Fog Blue Bedside Table Lamp","quantity":1,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"19061062860857":{"id":"19061062860857","title":"","quantity":1,"discount_amount":0,"sequence":5,"required":0}},"handle":"alpine-pale-blue-bedside-table-lamp"},"5608252211352":{"id":"5608252211352","title":"CALDER Fog Blue and White Border Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":6,"required":0,"variants":{"35664107700376":{"id":"35664107700376","title":"","quantity":1,"discount_amount":0,"sequence":6,"required":0}},"handle":"calder-fog-blue-and-white-border-velvet-cushion-cover-50-cm-by-50-cm"},"5608253292696":{"id":"5608253292696","title":"DARLEY Fog Blue and White Circle Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"35664109437080":{"id":"35664109437080","title":"","quantity":1,"discount_amount":0,"sequence":7,"required":0}},"handle":"darley-fog-blue-and-white-circle-embroidered-velvet-cushion-cover-50-cm-by-50-cm"},"5608253358232":{"id":"5608253358232","title":"DARLEY Fog Blue and White Scallop Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":8,"required":0,"variants":{"35664109502616":{"id":"35664109502616","title":"","quantity":1,"discount_amount":0,"sequence":8,"required":0}},"handle":"darley-fog-blue-and-white-scallop-embroidered-velvet-cushion-cover-50-cm-by-50-cm"},"5608253128856":{"id":"5608253128856","title":"DARLEY Fog Blue and White Squares Embroidered Velvet Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":9,"required":0,"variants":{"35664108847256":{"id":"35664108847256","title":"","quantity":1,"discount_amount":0,"sequence":9,"required":0}},"handle":"darley-fog-blue-and-white-squares-embroidered-velvet-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save  A Further 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save A Further 10% + Free Shipping ","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 Pieces Or More ","savings_text":"Save A Further 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117588,"name":"GRANGE Cushion 50 cm by 50 cm Mix and Match Bundle Deal","title":"GRANGE Cushion 50 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save, choose between dark blue or duck egg blue","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5608251031704":{"id":"5608251031704","title":"AGERY Dark Blue Plain Velvet Cushion Cover 55 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35664105308312":{"id":"35664105308312","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"agery-dark-blue-plain-velvet-cushion-cover-55-cm-by-55-cm"},"6267593195672":{"id":"6267593195672","title":"GRANGE Dark Blue Velvet White Piping Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"38118673481880":{"id":"38118673481880","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"grange-dark-blue-velvet-white-piping-cushion-cover-50-cm-by-50-cm"},"6267593392280":{"id":"6267593392280","title":"GRANGE Duck Egg Blue Velvet White Piping Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"38118674071704":{"id":"38118674071704","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"grange-duck-egg-blue-velvet-white-piping-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Shipping","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117587,"name":"GRANGE Cushion Cover 30 cm by 50 cm Mix and Match Bundle Deal","title":"GRANGE Cushion Cover 30 cm by 50 cm Mix and Match Bundle Deal","description":"Buy 2 or more and save, choose between dark blue or duck egg blue","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6267593162904":{"id":"6267593162904","title":"GRANGE Dark Blue Velvet White Piping Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"38118673449112":{"id":"38118673449112","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"grange-dark-blue-velvet-white-piping-cushion-cover-30-cm-by-50-cm"},"6267593326744":{"id":"6267593326744","title":"GRANGE Duck Egg Blue Velvet White Piping Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"38118673875096":{"id":"38118673875096","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"grange-duck-egg-blue-velvet-white-piping-cushion-cover-30-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":2,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Delivery ","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 3 pieces","savings_text":"Save 10% + Free Delivery","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 4 or more","savings_text":"Save 10% + Free Delivery + Free Leather Keyring Gift Set","counter":3}]},{"id":117589,"name":"Hamptons Tote Bag Bundle","title":"Hamptons Tote Bag Bundle","description":"Pre-order 2 or more and save, choose between two designs","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6912034406552":{"id":"6912034406552","title":"Take Me To The Hamptons\u2122  Jute Tote Bag","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"40546247901336":{"id":"40546247901336","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"take-me-to-the-hamptons-jute-tote-bag"},"6912039583896":{"id":"6912039583896","title":"The Hamptons\u2122 Jute Tote Bag","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"40546282242200":{"id":"40546282242200","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"the-hamptons-jute-tote-bag"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"14.85","range_type":"fixed_quantity","description":"Get Any 2 ","savings_text":"Pre-order Special: Save $9.90 + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"15","range_type":"min_limit_only","description":"Get 3 or more","savings_text":"Pre-order Special: Save 15% + Free Shipping","counter":2}]},{"id":117592,"name":"Hydrangea Cushion Cover 30 cm by 50 cm Bundle Deal","title":"Hydrangea Cushion Cover 30 cm by 50 cm Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6226935971992":{"id":"6226935971992","title":"Hydrangea Blue and White Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37971599687832":{"id":"37971599687832","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hydrangea-blue-and-white-cushion-cover-30-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"fixed_amount","discount_value":"5.95","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Enjoy Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Shipping ","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 pieces or more","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117570,"name":"IRIS Cushion Cover 50 cm by 50 cm Bundle Deal","title":"IRIS Cushion Cover 50 cm by 50 cm Bundle Deal","description":"Purchase 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"10815165010":{"id":"10815165010","title":"IRIS Floral Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"18549591539769":{"id":"18549591539769","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"iris-floral-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save 10% + Free Shipping ","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 Pieces Or More ","savings_text":"Save 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117598,"name":"KIRRA Outdoor Cushion Cover Mix and Match Bundle Deal","title":"KIRRA Outdoor Cushion Cover Mix and Match Bundle Deal","description":"Mix and Match 2 Or More And Save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6265894174872":{"id":"6265894174872","title":"KIRRA Dark Blue and White Double Stripe Outdoor Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"38113674100888":{"id":"38113674100888","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"kirra-dark-blue-and-white-double-stripe-outdoor-cushion-cover-30-cm-by-50-cm"},"6265894109336":{"id":"6265894109336","title":"KIRRA Dark Blue and White Four Corners Outdoor Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"38113674068120":{"id":"38113674068120","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"kirra-dark-blue-and-white-four-corners-outdoor-cushion-cover-50-cm-by-50-cm"},"6265893879960":{"id":"6265893879960","title":"KIRRA Dark Blue and White Panel Outdoor Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"38113673576600":{"id":"38113673576600","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"kirra-dark-blue-and-white-panel-outdoor-cushion-cover-50-cm-by-50-cm"},"6265894895768":{"id":"6265894895768","title":"KIRRA Dark Blue and White Panel Plain Outdoor Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"38113675575448":{"id":"38113675575448","title":"","quantity":1,"discount_amount":0,"sequence":4,"required":0}},"handle":"kirra-dark-blue-and-white-panel-plain-outdoor-cushion-cover-30-cm-by-50-cm"},"6265894338712":{"id":"6265894338712","title":"KIRRA Dark Blue and White Plain Outdoor Cushion Cover 55 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"38113674395800":{"id":"38113674395800","title":"","quantity":1,"discount_amount":0,"sequence":5,"required":0}},"handle":"kirra-dark-blue-and-white-plain-outdoor-cushion-cover-55-cm-by-55-cm"},"6265894502552":{"id":"6265894502552","title":"KIRRA Dark Blue and White Stripe Outdoor Cushion Cover 30 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":6,"required":0,"variants":{"38113674625176":{"id":"38113674625176","title":"","quantity":1,"discount_amount":0,"sequence":6,"required":0}},"handle":"kirra-dark-blue-and-white-stripe-outdoor-cushion-cover-30-cm-by-50-cm"},"6265893814424":{"id":"6265893814424","title":"KIRRA Dark Blue and White Stripe Outdoor Cushion Cover 50 cm by 50 cm","quantity":1,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"38113673412760":{"id":"38113673412760","title":"","quantity":1,"discount_amount":0,"sequence":7,"required":0}},"handle":"kirra-dark-blue-and-white-stripe-outdoor-cushion-cover-50-cm-by-50-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":3,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Get 2 pieces","savings_text":"Save  A Further 5% + Free Shipping","counter":1},{"min_items":3,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"fixed_quantity","description":"Get 3 pieces","savings_text":"Save A Further 10% + Free Shipping ","counter":2},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Get 4 Pieces Or More ","savings_text":"Save A Further 10% + Free Shipping + Free Leather Keyring Gift Set","counter":3}]},{"id":117022,"name":"Montauk Planter Box Bundle Deal","title":"Montauk Planter Box Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2454035857465":{"id":"2454035857465","title":"MONTAUK PVC Planter Box Square 45 cm by 45 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19749556125753":{"id":"19749556125753","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"montauk-pvc-planter-box-square-45-cm-by-45-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"fixed_quantity","description":"Purchase 2 Pieces And Save 5% + Free Delivery","savings_text":"5% savings","counter":1},{"min_items":3,"max_items":4,"discount_type":"percentage","discount_value":"10","range_type":"range","description":"Purchase 3 or more pieces and save 10% & Free Delivery","savings_text":"10% savings","counter":2},{"min_items":4,"max_items":100,"discount_type":"percentage","discount_value":"15","range_type":"range","description":"Purchase 5 Pieces Or More And Save 15% + Free Delivery","savings_text":" 15% savings","counter":3}]},{"id":117209,"name":"Nantucket Planter Box Bundle Deal","title":"Nantucket Planter Box Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2454030254137":{"id":"2454030254137","title":"NANTUCKET PVC Planter Box Rectangle 95 cm by 45 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19749549703225":{"id":"19749549703225","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"nantucket-pvc-planter-box-rectangle-95-cm-by-45-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"210","range_type":"fixed_quantity","description":"Purchase 2 Pieces And Save 5% + Free Delivery","savings_text":"5% savings","counter":1},{"min_items":3,"max_items":4,"discount_type":"percentage","discount_value":"10","range_type":"range","description":"Purchase 3 or more pieces and save 10% + Free Delivery","savings_text":"10% savings","counter":2},{"min_items":4,"max_items":100,"discount_type":"percentage","discount_value":"10","range_type":"range","description":"Purchase 5 Pieces Or More And Save 15% + Free Delivery","savings_text":"15% savings","counter":3}]},{"id":119842,"name":"Poolside Bamboo Framed Wall Art Bundle Deal","title":"Poolside Bamboo Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6997083685016":{"id":"6997083685016","title":"Poolside Bamboo Framed Wall Art (Design 1) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":5,"required":0,"variants":{"40874245030040":{"id":"40874245030040","title":"","quantity":1,"discount_amount":0,"sequence":5,"required":0}},"handle":"poolside-bamboo-framed-wall-art-design-1-107-3-cm-by-76-3-cm"},"6997087289496":{"id":"6997087289496","title":"Poolside Bamboo Framed Wall Art (Design 2) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":6,"required":0,"variants":{"40874253418648":{"id":"40874253418648","title":"","quantity":1,"discount_amount":0,"sequence":6,"required":0}},"handle":"poolside-bamboo-framed-wall-art-design-2-107-3-cm-by-76-3-cm"},"6997090566296":{"id":"6997090566296","title":"Poolside Bamboo Framed Wall Art (Design 3) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":7,"required":0,"variants":{"40874261676184":{"id":"40874261676184","title":"","quantity":1,"discount_amount":0,"sequence":7,"required":0}},"handle":"poolside-bamboo-framed-wall-art-design-3-107-3-cm-by-76-3-cm"},"6997094400152":{"id":"6997094400152","title":"Poolside Bamboo Framed Wall Art (Design 4) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":8,"required":0,"variants":{"40874272522392":{"id":"40874272522392","title":"","quantity":1,"discount_amount":0,"sequence":8,"required":0}},"handle":"poolside-bamboo-framed-wall-art-design-4-107-3-cm-by-76-3-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]},{"id":120158,"name":"Shaynna Blaze Hampton Ceramic Lamp with Blue Shade Bundle Deal","title":"Shaynna Blaze Hampton Ceramic Lamp with Blue Shade Bundle Deal","description":"Buy A Pair and Get 5% Off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6110281793688":{"id":"6110281793688","title":"Shaynna Blaze Hampton Ceramic Lamp with Blue Shade 63 cm H","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37486195277976":{"id":"37486195277976","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"shaynna-blaze-hampton-ceramic-lamp-with-blue-shade"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Buy A Pair","savings_text":"Save 5% Off + Free Shipping","counter":1}]},{"id":120159,"name":"Shaynna Blaze Hampton Ceramic Lamp with White Shade Bundle Deal","title":"Shaynna Blaze Hampton Ceramic Lamp with White Shade Bundle Deal","description":"Buy a pair and enjoy 5% off + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"6110282416280":{"id":"6110282416280","title":"Shaynna Blaze Hampton Ceramic Lamp with White Shade 63 cm H","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"37486197702808":{"id":"37486197702808","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"shaynna-blaze-hampton-ceramic-lamp-with-white-shade"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Buy A Pair","savings_text":"Save 5% Off + Free Shipping","counter":1}]},{"id":119839,"name":"Silver Botanical Bamboo Framed Wall Art Bundle Deal","title":"Silver Botanical Bamboo Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6996885995672":{"id":"6996885995672","title":"Silver Botanical Bamboo Framed Wall Art (Design 1) 83 cm by 63 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"40873850929304":{"id":"40873850929304","title":"","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"silver-botanical-bamboo-framed-wall-art-design-1-83-cm-by-63-cm"},"6996899561624":{"id":"6996899561624","title":"Silver Botanical Bamboo Framed Wall Art (Design 2) 83 cm by 63 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"40873876422808":{"id":"40873876422808","title":"","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"silver-botanical-bamboo-framed-wall-art-design-2-83-cm-by-63-cm"},"6996904378520":{"id":"6996904378520","title":"Silver Botanical Bamboo Framed Wall Art (Design 3) 83 cm by 63 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"40873887826072":{"id":"40873887826072","title":"","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"silver-botanical-bamboo-framed-wall-art-design-3-83-cm-by-63-cm"},"6996924891288":{"id":"6996924891288","title":"Silver Botanical Bamboo Framed Wall Art (Design 4) 83 cm by 63 cm","quantity":1,"discount_amount":0,"image":"","sequence":4,"required":0,"variants":{"40873933176984":{"id":"40873933176984","title":"","quantity":1,"discount_amount":0,"sequence":4,"required":0}},"handle":"silver-botanical-bamboo-framed-wall-art-design-4-83-cm-by-63-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]},{"id":119848,"name":"Tropical Hanging Palm Framed Wall Art Bundle Deal","title":"Tropical Hanging Palm Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6996705181848":{"id":"6996705181848","title":"Tropical Hanging Palm Framed Wall Art (Design 1) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":19,"required":0,"variants":{"40873430155416":{"id":"40873430155416","title":"","quantity":1,"discount_amount":0,"sequence":19,"required":0},"40873430188184":{"id":"40873430188184","title":"","quantity":1,"discount_amount":0,"sequence":20,"required":0},"40873430220952":{"id":"40873430220952","title":"","quantity":1,"discount_amount":0,"sequence":21,"required":0},"40873430253720":{"id":"40873430253720","title":"","quantity":1,"discount_amount":0,"sequence":22,"required":0},"40873430286488":{"id":"40873430286488","title":"","quantity":1,"discount_amount":0,"sequence":23,"required":0},"40873430319256":{"id":"40873430319256","title":"","quantity":1,"discount_amount":0,"sequence":24,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-1-95-cm-by-65-cm"},"6996750205080":{"id":"6996750205080","title":"Tropical Hanging Palm Framed Wall Art (Design 2) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":25,"required":0,"variants":{"40873575284888":{"id":"40873575284888","title":"","quantity":1,"discount_amount":0,"sequence":25,"required":0},"40873575317656":{"id":"40873575317656","title":"","quantity":1,"discount_amount":0,"sequence":26,"required":0},"40873575350424":{"id":"40873575350424","title":"","quantity":1,"discount_amount":0,"sequence":27,"required":0},"40873575383192":{"id":"40873575383192","title":"","quantity":1,"discount_amount":0,"sequence":28,"required":0},"40873575415960":{"id":"40873575415960","title":"","quantity":1,"discount_amount":0,"sequence":29,"required":0},"40873575448728":{"id":"40873575448728","title":"","quantity":1,"discount_amount":0,"sequence":30,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-2-95-cm-by-65-cm"},"6996788740248":{"id":"6996788740248","title":"Tropical Hanging Palm Framed Wall Art (Design 3) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":31,"required":0,"variants":{"40873660088472":{"id":"40873660088472","title":"","quantity":1,"discount_amount":0,"sequence":31,"required":0},"40873660121240":{"id":"40873660121240","title":"","quantity":1,"discount_amount":0,"sequence":32,"required":0},"40873660154008":{"id":"40873660154008","title":"","quantity":1,"discount_amount":0,"sequence":33,"required":0},"40873660186776":{"id":"40873660186776","title":"","quantity":1,"discount_amount":0,"sequence":34,"required":0},"40873660219544":{"id":"40873660219544","title":"","quantity":1,"discount_amount":0,"sequence":35,"required":0},"40873660252312":{"id":"40873660252312","title":"","quantity":1,"discount_amount":0,"sequence":36,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-3-95-cm-by-65-cm"},"6996807090328":{"id":"6996807090328","title":"Tropical Hanging Palm Framed Wall Art (Design 4) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":37,"required":0,"variants":{"40873715564696":{"id":"40873715564696","title":"","quantity":1,"discount_amount":0,"sequence":37,"required":0},"40873715630232":{"id":"40873715630232","title":"","quantity":1,"discount_amount":0,"sequence":38,"required":0},"40873715663000":{"id":"40873715663000","title":"","quantity":1,"discount_amount":0,"sequence":39,"required":0},"40873715695768":{"id":"40873715695768","title":"","quantity":1,"discount_amount":0,"sequence":40,"required":0},"40873715728536":{"id":"40873715728536","title":"","quantity":1,"discount_amount":0,"sequence":41,"required":0},"40873715761304":{"id":"40873715761304","title":"","quantity":1,"discount_amount":0,"sequence":42,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-4-95-cm-by-65-cm"},"6996816101528":{"id":"6996816101528","title":"Tropical Hanging Palm Framed Wall Art (Design 5) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":43,"required":0,"variants":{"40873726771352":{"id":"40873726771352","title":"","quantity":1,"discount_amount":0,"sequence":43,"required":0},"40873726836888":{"id":"40873726836888","title":"","quantity":1,"discount_amount":0,"sequence":44,"required":0},"40873726869656":{"id":"40873726869656","title":"","quantity":1,"discount_amount":0,"sequence":45,"required":0},"40873726902424":{"id":"40873726902424","title":"","quantity":1,"discount_amount":0,"sequence":46,"required":0},"40873726935192":{"id":"40873726935192","title":"","quantity":1,"discount_amount":0,"sequence":47,"required":0},"40873726967960":{"id":"40873726967960","title":"","quantity":1,"discount_amount":0,"sequence":48,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-5-95-cm-by-65-cm"},"6996853915800":{"id":"6996853915800","title":"Tropical Hanging Palm Framed Wall Art (Design 6) 95 cm by 65 cm","quantity":1,"discount_amount":0,"image":"","sequence":49,"required":0,"variants":{"40873778217112":{"id":"40873778217112","title":"","quantity":1,"discount_amount":0,"sequence":49,"required":0},"40873778249880":{"id":"40873778249880","title":"","quantity":1,"discount_amount":0,"sequence":50,"required":0},"40873778282648":{"id":"40873778282648","title":"","quantity":1,"discount_amount":0,"sequence":51,"required":0},"40873778315416":{"id":"40873778315416","title":"","quantity":1,"discount_amount":0,"sequence":52,"required":0},"40873778348184":{"id":"40873778348184","title":"","quantity":1,"discount_amount":0,"sequence":53,"required":0},"40873778380952":{"id":"40873778380952","title":"","quantity":1,"discount_amount":0,"sequence":54,"required":0}},"handle":"tropical-hanging-palm-framed-wall-art-design-6-95-cm-by-65-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]},{"id":119845,"name":"Tropical Living Framed Wall Art Bundle Deal","title":"Tropical Living Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6997145551000":{"id":"6997145551000","title":"Tropical Living Bamboo Framed Wall Art (Design 10) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":9,"required":0,"variants":{"40874526015640":{"id":"40874526015640","title":"","quantity":1,"discount_amount":0,"sequence":9,"required":0}},"handle":"tropical-living-bamboo-framed-wall-art-design-8-107-3-cm-by-76-3-cm"},"6997135327384":{"id":"6997135327384","title":"Tropical Living Bamboo Framed Wall Art (Design 9) 107.3 cm by 76.3 cm","quantity":1,"discount_amount":0,"image":"","sequence":10,"required":0,"variants":{"40874488463512":{"id":"40874488463512","title":"","quantity":1,"discount_amount":0,"sequence":10,"required":0}},"handle":"tropical-living-bamboo-framed-wall-art-design-7-107-3-cm-by-76-3-cm"},"6997103247512":{"id":"6997103247512","title":"Tropical Living Framed Wall Art (Design 1) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":11,"required":0,"variants":{"40874284023960":{"id":"40874284023960","title":"","quantity":1,"discount_amount":0,"sequence":11,"required":0}},"handle":"tropical-living-framed-wall-art-design-1-112-cm-by-81-cm"},"6997108261016":{"id":"6997108261016","title":"Tropical Living Framed Wall Art (Design 2) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":12,"required":0,"variants":{"40874300604568":{"id":"40874300604568","title":"","quantity":1,"discount_amount":0,"sequence":12,"required":0}},"handle":"tropical-living-framed-wall-art-design-2-112-cm-by-81-cm"},"6997114323096":{"id":"6997114323096","title":"Tropical Living Framed Wall Art (Design 3) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":13,"required":0,"variants":{"40874346512536":{"id":"40874346512536","title":"","quantity":1,"discount_amount":0,"sequence":13,"required":0}},"handle":"tropical-living-framed-wall-art-design-3-112-cm-by-81-cm"},"6997124972696":{"id":"6997124972696","title":"Tropical Living Framed Wall Art (Design 4) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":14,"required":0,"variants":{"40874459463832":{"id":"40874459463832","title":"","quantity":1,"discount_amount":0,"sequence":14,"required":0}},"handle":"tropical-living-framed-wall-art-design-4-112-cm-by-81-cm"},"6997128216728":{"id":"6997128216728","title":"Tropical Living Framed Wall Art (Design 5) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":15,"required":0,"variants":{"40874464018584":{"id":"40874464018584","title":"","quantity":1,"discount_amount":0,"sequence":15,"required":0}},"handle":"tropical-living-framed-wall-art-design-5-112-cm-by-81-cm"},"6997131591832":{"id":"6997131591832","title":"Tropical Living Framed Wall Art (Design 6) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":16,"required":0,"variants":{"40874474209432":{"id":"40874474209432","title":"","quantity":1,"discount_amount":0,"sequence":16,"required":0}},"handle":"tropical-living-framed-wall-art-design-6-112-cm-by-81-cm"},"6997150236824":{"id":"6997150236824","title":"Tropical Living Framed Wall Art (Design 7) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":17,"required":0,"variants":{"40874538139800":{"id":"40874538139800","title":"","quantity":1,"discount_amount":0,"sequence":17,"required":0}},"handle":"tropical-living-framed-wall-art-design-7-112-cm-by-81-cm"},"6997164064920":{"id":"6997164064920","title":"Tropical Living Framed Wall Art (Design 8) 112 cm by 81 cm","quantity":1,"discount_amount":0,"image":"","sequence":18,"required":0,"variants":{"40874579230872":{"id":"40874579230872","title":"","quantity":1,"discount_amount":0,"sequence":18,"required":0}},"handle":"tropical-living-framed-wall-art-design-8-112-cm-by-81-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]},{"id":119849,"name":"Yachts Framed Wall Art Bundle Deal","title":"Yachts Framed Wall Art Bundle Deal","description":"Buy 2 or more and save","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":100,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","minimum_requirements":"volume_discounts","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"true","product_target_type":"specific_products","volume_bundle_combine_quantites":"true","products":{"6996862632088":{"id":"6996862632088","title":"Yachts Framed Wall Art (Design 1) 75 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":19,"required":0,"variants":{"40873793159320":{"id":"40873793159320","title":"","quantity":1,"discount_amount":0,"sequence":19,"required":0},"40873793224856":{"id":"40873793224856","title":"","quantity":1,"discount_amount":0,"sequence":20,"required":0},"40873793257624":{"id":"40873793257624","title":"","quantity":1,"discount_amount":0,"sequence":21,"required":0},"40873793323160":{"id":"40873793323160","title":"","quantity":1,"discount_amount":0,"sequence":22,"required":0},"40873793355928":{"id":"40873793355928","title":"","quantity":1,"discount_amount":0,"sequence":23,"required":0},"40873793421464":{"id":"40873793421464","title":"","quantity":1,"discount_amount":0,"sequence":24,"required":0}},"handle":"yachts-framed-wall-art-design-1-75-cm-by-55-cm"},"6996873773208":{"id":"6996873773208","title":"Yachts Framed Wall Art (Design 2) 75 cm by 55 cm","quantity":1,"discount_amount":0,"image":"","sequence":25,"required":0,"variants":{"40873827336344":{"id":"40873827336344","title":"","quantity":1,"discount_amount":0,"sequence":25,"required":0},"40873827369112":{"id":"40873827369112","title":"","quantity":1,"discount_amount":0,"sequence":26,"required":0},"40873827401880":{"id":"40873827401880","title":"","quantity":1,"discount_amount":0,"sequence":27,"required":0},"40873827434648":{"id":"40873827434648","title":"","quantity":1,"discount_amount":0,"sequence":28,"required":0},"40873827467416":{"id":"40873827467416","title":"","quantity":1,"discount_amount":0,"sequence":29,"required":0},"40873827500184":{"id":"40873827500184","title":"","quantity":1,"discount_amount":0,"sequence":30,"required":0}},"handle":"yachts-framed-wall-art-design-2-75-cm-by-55-cm"}},"required_products":[],"volume_discounts":[{"min_items":2,"max_items":null,"discount_type":"percentage","discount_value":"5","range_type":"min_limit_only","description":"Purchase 2 or more","savings_text":"Save 5% + Free Shipping","counter":1},{"min_items":4,"max_items":null,"discount_type":"percentage","discount_value":"10","range_type":"min_limit_only","description":"Purchase 4 Pieces Or More ","savings_text":"Save 10% + Free Delivery","counter":2}]}];
			
			// Change discount based on current currency exchange rate
			// It would be good to also get the defined rounding policy
			if (typeof Shopify !== 'undefined' && Shopify.hasOwnProperty('currency') && Shopify.currency.hasOwnProperty('rate')) {
				var rate = Shopify.currency.rate;
				var currency = Shopify.currency.active;
				
				if (rate !== "1.0") {

					for(var i = 0; i < bundles.length; i++) {

						// There is actually no need for this if
						if (bundles[i].discount_type === 'products_discounts' || bundles[i].discount_type === 'fixed_amount') {

							bundles[i].fixed_amount_value = utils.convertMoney(bundles[i].fixed_amount_value, rate, currency);
						
							for(var pkey in bundles[i].products) {
								var product = bundles[i].products[pkey];
								product.discount_amount = utils.convertMoney(product.discount_amount, rate, currency);
								
								for(var vkey in product.variants) {
									var variant = product.variants[vkey];
									variant.discount_amount = utils.convertMoney(variant.discount_amount, rate, currency);
								}
							}
						} else if (bundles[i].discount_type === 'fixed_price') {
							bundles[i].fixed_price_value = utils.convertMoney(bundles[i].fixed_price_value, rate, currency);
						}
					}
				}
			}
			
			// WidgetView contains functions for direct manipulation with the HTML of the bundle widget
			var widgetView = {
								addToCartButton: {
					showCheckmark: function($button) {
						var htmlContent = $button.html();
						
						$button.html(htmlUtils.svgCheckmark);
						
						if ($button.closest('[data-bndlr-keep-success-indicator]').length === 0) {
							setTimeout(function() {
								
								$button.find('.bndlr-checkmark').first().fadeOut(450, function() {
									$button.html(htmlContent);
								});
							}, 4000);
						}
					}
				},
				getBundleTitle: function(title, name, id) {
					var titleHtml = '<h2 class="bndlr-bundle-title">' + title + '</h2>';
					
											
						var addLink = true;
													if (typeof window.bndlrPage === 'undefined' || window.bndlrPage !== 'bundles-listing') {
								addLink = false;
							}
												
						if (typeof window.BndlrIsBundleLandingPage !== 'undefined' && window.BndlrIsBundleLandingPage) {
							// Don't add link if we are on bundle landing page
							addLink = false;
						}
						
						if (addLink) {
							
															var linkTarget = 'target="_blank"';
														
							titleHtml = '<h2 class="bndlr-bundle-title"><a title="'+title.replace('"', '')+'" alt="'+title.replace('"', '')+'" ' + linkTarget + ' href="' + nav.getLandingPageUrl(name, id) + '">' + title + '</a></h2>';
						}
										
					return titleHtml;					
				},
				getBundleImage: function(imageSrc, title, name, id) {
					var imageHtml = '<img class="bndlr-bundle-image" src="'+imageSrc+'" />';
					
										
					return imageHtml;					
				},
				drawSelectedProducts: function(bundleKey, products) {
					
					var bundleId = $('[data-bndlr-key="'+bundleKey+'"]').closest('[data-bundle]').attr('data-bundle');
					bundleId = parseInt(bundleId);
					
					var bundle = bndlr.getBundleById(bundleId);
					var discountedProducts = Library.DiscountedProducts.get(bundle.id);
					
					var html = '';
					var statusBoxProductsHtml = '';
					
					for(var key in products) {
						if (products.hasOwnProperty(key)) {
							var productId = products[key].product_id;
							var variantId = products[key].variant_id;
							
							var productData;
							if (bundle.product_level == 'product') {
								productData = discountedProducts[productId];
							} else {
								productData = discountedProducts[variantId];
							}
							
							var selectedProductHtml = bndlr.getSelectedProductHtml(products[key], productData, bundle, key);
							html += selectedProductHtml;
							
							var statusBoxProductHtml = bndlr.getStatusBoxProductHtml(products[key], productData, bundle);
							statusBoxProductsHtml += statusBoxProductHtml;
						}
					}
					
					$('[data-bndlr-key="'+bundleKey+'"] .bndlr-mnm-selected-products').html(html);
					$('#bndlr-mnm-status-box[data-bndlr-bundle-key="'+bundleKey+'"] .bdnlr-mnm-status-box-products-container').html(statusBoxProductsHtml);
				},
				MixNMatch: {
					hideAddtoBundleButtons: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-add-to-bundle').addClass('bndlr-hidden');
					},
					showAddtoBundleButtons: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-add-to-bundle').removeClass('bndlr-hidden');
					},
					hideAddtoBundleButton: function(bundleKey, productId) {
						$('[data-bndlr-key="'+bundleKey+'"] [data-product-id="'+productId+'"] .bndlr-add-to-bundle').addClass('bndlr-hidden');
					},
					showAddtoBundleButton: function(bundleKey, productId) {
						$('[data-bndlr-key="'+bundleKey+'"] [data-product-id="'+productId+'"] .bndlr-add-to-bundle').removeClass('bndlr-hidden');
					},
					fadeInSelectedProducts: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-toggle.bndlr-hidden').removeClass('bndlr-hidden');
					},
					fadeOutSelectedProducts: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-toggle').addClass('bndlr-hidden');
					},
					fadeInAddToCartButton: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-add-bundle-to-cart.bndlr-hidden').removeClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-mnm-total-price.bndlr-hidden').removeClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-bundle-checkout-warning.bndlr-hidden').removeClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.sealsubs-target-element-bundle').css({'display':'block'});
						
						$('#bndlr-mnm-status-box[data-bndlr-bundle-key="'+bundleKey+'"]').find('.bndlr-status-box-add-to-cart.bndlr-hidden').removeClass('bndlr-hidden');
					},
					fadeOutAddToCartButton: function(bundleKey) {
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-add-bundle-to-cart').addClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-mnm-total-price').addClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.bndlr-bundle-checkout-warning').addClass('bndlr-hidden');
						$('[data-bndlr-key="'+bundleKey+'"]').find('.sealsubs-target-element-bundle').css({'display':'none'});
						
						$('#bndlr-mnm-status-box[data-bndlr-bundle-key="'+bundleKey+'"]').find('.bndlr-status-box-add-to-cart').addClass('bndlr-hidden');
					},
				}
			};
			
			var htmlUtils = {
				moneySpan: function(value, currency, classes, customAttribute, numericValue) {
					var valueNoHtml = value.replace(/(<([^>]+)>)/gi, "");
					if (typeof customAttribute !== 'string') {
						customAttribute = '';
					}
					valueNoHtml = valueNoHtml.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
										if (typeof numericValue !== 'undefined') {
						return '<span class="'+classes+' bndlr-money conversion-bear-money money gt_currency gt_currency--'+currency+'" '+customAttribute+' data-money-convertible data-currency-'+currency+'="'+valueNoHtml+'" data-currentprice="'+numericValue+'">'+value+'</span>';
					} else {
						return '<span class="'+classes+' bndlr-money conversion-bear-money money" '+customAttribute+' data-money-convertible data-currency-'+currency+'="'+valueNoHtml+'">'+value+'</span>';
					}
					
				},
				svgCheckmark: '<svg class="bndlr-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -2 40 40"><path fill="none" d="M4.1 18.2 l7.1 7.2 l16.7-16.8" /></svg>',
				svgCheckmarkPreselected: '<svg class="bndlr-preselected-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -2 40 40"><path fill="none" d="M4.1 18.2 l7.1 7.2 l16.7-16.8" /></svg>'
			};
			
						
			if (typeof clientSpecifics === 'undefined') {
				// This will contain a list of all client specific functions
				var clientSpecifics = {};
			}
						// Observer mutations and trigger local event when a cart change is detected.
// A cart change can be:
// - something changes in the cart drawer dynamically

function cartChangeDetectorFunction() {
	this.mutationsInProgress 			= 0;
	this.dispatchCartDrawerEventTimeout = false;
};

cartChangeDetectorFunction.prototype.beforeMutation = function() {
	this.mutationsInProgress++;
}

cartChangeDetectorFunction.prototype.afterMutation = function() {
	var self = this;
	setTimeout(function() {
		// Delay the decrease of the counter to allow changes to propagate through mutation observers
		self.mutationsInProgress--;
	}, 100);
}

cartChangeDetectorFunction.prototype.getMutationsInProgress = function() {
	return this.mutationsInProgress;
}

cartChangeDetectorFunction.prototype.observeCart = function() {
	try {
		// Create observer for cart drawer
		var self = this;
		var callback = function(mutationsList, observer) {

			if (self.getMutationsInProgress() === 0) {

				if (typeof self.dispatchCartDrawerEventTimeout !== 'undefined') {
					clearTimeout(self.dispatchCartDrawerEventTimeout);
				}
				
				self.dispatchCartDrawerEventTimeout = setTimeout(function() {
					var event = new Event('bndlr:cart_drawer_mutation');
					// Dispatch the event.
					window.dispatchEvent(event);
				}, 90);
			}
		};

		var observer = new MutationObserver(callback);

		// list of cart drawer selectors (they are found with jQuery).
		// we could just watch the cart total values though
		var cartDrawersList = [
			'#ajaxifyMini',
			'#CartDrawer .drawer__inner', // if you observe the normal drawer, the fera countdown can cause the app to constantly check for discount
			'#ajaxifyModal #ajaxifyCart',
			'#qikify-stickycart-app',
			'.sp-cart .sp-dropdown-menu .sp-dropdown-inner .sp-cart-layout',
			'#CartDrawer #CartContainer',
			'#sidebar-cart',
			'#cartSlideoutWrapper',
			'div.right-drawer-vue',
			'#theme-ajax-cart .ajax-cart--mini-cart',
			'.off-canvas--container .cart--root',
			'#cartSidebar',
			'.top-cart-holder .cart-target',
			'.go-cart__drawer.js-go-cart-drawer .go-cart-drawer',
			'.cart-mini .cart-mini-sidebar',
			'#slidedown-cart'
			//'#Cart.cart-container.open'
		];
		
		// loop through cart drawers and set the observers
		for(var i = 0; i<cartDrawersList.length; i++) {
			if ($(cartDrawersList[i]).length) {
				observer.observe($(cartDrawersList[i])[0], {attributes: true, childList: true, subtree: true});
			}
		}
		
	} catch(e) {
		console.log(e);
	}
}
	
var cartChangeDetector = new cartChangeDetectorFunction();
cartChangeDetector.observeCart();
cartChangeDetectorFunction.prototype.hookToAddToCartEvent = function() {
	
	(function(w) {
		if (typeof w.fetch === 'function') {
			try {
				// Override the fetch function to listen for cart refresh actions
				var oldFetch = w.fetch;  // must be on the global scope
				w.fetch = function() {
					var promise = oldFetch.apply(this, arguments);
					try  {

						if (typeof arguments[0] === 'string' && arguments[0].length > 0) {
							var rurl = arguments[0];
							promise.then(function(data) {
								try  {
									if (typeof rurl === 'string' && rurl.length > 0) {
										handleAddToCart(rurl, data);
									}
								} catch (t) {
									console && console.warn && console.warn('[Bundler cart event listener] Error in fetch:  ' + t.message)
								}
							});
						}
					} catch(e) {
						console.error(e);
					}
					// Return the promise
					return promise;
				}
			} catch(e) {
				console.log(e);
			}
		}
		
		function handleAddToCart(url, data) {
			var types = [
				'/cart/change.js',
				'/cart/change.json',
				'/cart/change',
				'/cart/add.js',
				'/cart/add.json',
				'/cart/add'
			];

			for(var i = 0; i<types.length; i++) {
				if (url.indexOf(types[i]) !== -1 && url.indexOf('bundler-cart-call') === -1) {
					var event = new CustomEvent('bndlr:cart_was_modified');
					// Dispatch the event.
					document.dispatchEvent(event);
					
					// Stop the loop
					i = types.length;
				}
			}
		}
		
	})(window);
};

if (typeof cartChangeDetector !== 'undefined') {
	cartChangeDetector.hookToAddToCartEvent();
}			
			var bndlr = {
				outputBundles: function() {
					bundlerConsole.log(JSON.parse(JSON.stringify(bundles)));
				},
				getBundles: function() {
					return JSON.parse(JSON.stringify(bundles));
				},
				outputProductUrls: function() {
					var urls = [];
					
					for(var i = 0; i<bundles.length; i++) {
						for (var key in bundles[i].products) {
							if (bundles[i].products.hasOwnProperty(key)) {
								urls.push(nav.getRootUrl()+'products/'+bundles[i].products[key].handle);
							}
						}
					}
					bundlerConsole.log(JSON.parse(JSON.stringify(urls)));
				},
				// When set to false, the clicks on checkout buttons will go straight to normal checkout
				useBundlerCheckout: true,
				// Checkout params is an object with additional GET parameters which will be appended to the checkout URL to pre-fill the checkout form
				checkoutParams: {},
				// Public method, used for setting checkout parameters by other apps
				setCheckoutParams: function(params) {
					if (Object.keys(params).length > 0) {
						bndlr.checkoutParams = params;
					}
				},
				// Public method, used for preventing the Bundler from going to the checkout
				preventBundlerCheckout: function() {
					bndlr.externalAppPreventCheckout.prevent = true;
					bundlerConsole.log('Third party requested prevention of Bundler checkout');
				},
				// Object, used for storing configuration and logic for checkout prevention by external apps
				externalAppPreventCheckout: {
					prevent: false,
					counter: 0,
					canCheckout: function() {
						// If external app required a checkout prevention and the checkout was never prevented before, return false.
						// Otherwise, allow Bundler checkout logic to proceed
						/*
						if (this.prevent && this.counter < 30) {
							this.counter++;
							return false;
						}
						*/
						if (typeof clientSpecifics['can_checkout'] !== 'undefined') {
							var canCheckout = clientSpecifics['can_checkout'].get();
							if (canCheckout === false) {
								return false;
							}
						}
						
						if (this.prevent) {
							return false;
						}
						
						return true;
					}
				},
				addCheckoutParams: function(url) {
					
					var locale = this.getLocale();
					if (locale !== '' && typeof this.checkoutParams['locale'] === 'undefined') {
						this.checkoutParams['locale'] = locale;
					}
					
					if (Object.keys(this.checkoutParams).length > 0) {
						// Add checkout params
						if (url.indexOf('?') === -1) {
							url += '?';
						} else {
							url += '&';
						}
						
						for (var key in this.checkoutParams) {
							if (this.checkoutParams.hasOwnProperty(key)) {
								url += key + '=' + this.checkoutParams[key] + '&';
							}
						}
						url = url.replace(/\&$/, '');
					}
					
					return url;
				},
				getLocale: function() {
					if (typeof Shopify !== 'undefined' && typeof Shopify.locale === 'string') {
						return Shopify.locale
					}
					
					return '';
				},
									hideDynamicCheckoutButtons: function() {
						DiscountEstimator.runIfCanGetDiscount(function() {
							if ($('#bndlr-dynamic-checkout-cart-css').length === 0) {
								$('body').append('<style id="bndlr-dynamic-checkout-cart-css">' +
									'#dynamic-checkout-cart {' +
										'display:none !important;' +
									'}' +
								'</style>');
							}
						}, function() {
							if ($('#bndlr-dynamic-checkout-cart-css').length === 1) {
								$('#bndlr-dynamic-checkout-cart-css').remove();
							}
						});
					},
								init: function() {

										
					var self = this;
					// Checkout selectors
					var checkoutSelector = "input[type='submit'][name='checkout']:not(.productForm-submit), button[type='submit'][name='checkout']:not(.productForm-submit):not([disabled]), button.checkout-button[name='checkout'], form.cart-form a.btn-checkout, a[href='/checkout'], #dropdown-cart button.btn-checkout, .cart-popup-content a.btn-checkout, .cart__popup a.checkout-button, .widget_shopping_cart_content a[href='/checkout'], .jas_cart_page button.checkout-button, .mini-cart-info button.mini-cart-button, a.checkout-link, a.mini-cart-checkout-button, .shopping_cart_footer .actions button";
					checkoutSelector += ', #dropdown-cart button.btn[onclick="window.location=\'/checkout\'"], form[action="/cart"] button[name="checkout"], .bundler-checkout-button, input.action_button[type="submit"][value="Checkout"]';
					checkoutSelector += ', button.Cart__Checkout[type="submit"][name="checkout"] span';
					checkoutSelector += ', .popup-cart a[href^="/checkout"], #slidecarthq .footer button.button';
					checkoutSelector += ', button.cart__checkout-cta, button.sidecart__checkout-cta';
					checkoutSelector += ', button.bc-atc-slide-checkout-btn';
					checkoutSelector += ', #ajax-cart__content .ajax-cart__button.button--add-to-cart';
					checkoutSelector += ', .cart_container form.js-cart_content__form button.add_to_cart.action_button';
					checkoutSelector += ', .cart_container .js-cart_content__form input.action_button[type="submit"]';
					checkoutSelector += ', #checkout_shipping_continue_btn';
					checkoutSelector += ', .spurit-occ2-checkout a[name="checkout"][href="/checkout/"]';
					checkoutSelector += ', #checkout-button';
					checkoutSelector += ', button.btn-checkout';
					checkoutSelector += ', button.rebuy-button';
					checkoutSelector += ', .go-cart__button[href*="/checkout/"]';
					checkoutSelector += ', a[href*="/checkout/"]';
										// .template-cart .alertify .ajs-button.positive
																				
					//$(document).ready(function() {
					// Commented that on 2020-12-09 because it created the bundler_bundle_widget_created event listener too late

					var $document = $(document);
					var $body = $('body');

						$(checkoutSelector).on('click', function (e) {
							if (bndlr.useBundlerCheckout && bndlr.externalAppPreventCheckout.canCheckout()) {
								e.preventDefault();
								e.stopPropagation();
								$(this).addClass('bndlr-checkout-button-clicked');
								self.prepareInvoice();
							}
						});
						
						$document.on('click', checkoutSelector, function (e) {
							if (bndlr.useBundlerCheckout && bndlr.externalAppPreventCheckout.canCheckout()) {
								e.preventDefault();
								e.stopPropagation();
								$(this).addClass('bndlr-checkout-button-clicked');
								self.prepareInvoice();
							}
						});
						
						$document.on('click', '.bndlr-message-yes', function() {
							$(this).addClass('bndlr-loading');
							self.prepareInvoice();
						});
						
						$document.on('bundler_trigger_normal_checkout', function() {
							
							bndlr.useBundlerCheckout = false;
							var cartSelector = 'form[action="/cart"][method="post"], form.cart[action="/cart"][method="post"], form.cart[method="post"], #cart form';
							var clickWasHandled = false;
							
							var tryToClickOnTheSameButton = true;
							if (typeof window.PARCELY_APP !== 'undefined') {
								// The Parcely app uses Vuejs for click handling, which only processes trusted events (e.isTrusted).
								tryToClickOnTheSameButton = false;
							}
							
							if (tryToClickOnTheSameButton === true) {
								var $clickedButton = $('.bndlr-checkout-button-clicked');
								if ($clickedButton.length === 1) {
									// Try to first trigger the click on the same element as the user previously clicked
									if ($clickedButton.prop('tagName') !== 'A') {
										// The problem is that the jQuery click event can't trigger the navigation on a elements.
										clickWasHandled = true;
										if ($clickedButton.is('[disabled]')) {
											// remove disabled attribute, otherwise the click won't get recognized (miasma-records)
											$clickedButton.removeAttr('disabled');
										}
										try {
											$clickedButton.click();
										} catch(e) {
											// Something went wrong. It could be that the script listening to the event wanted tohave the originalEvent passed in the click
											// Mark click as not handled, so that we go into the fallback logic.
											clickWasHandled = false;
											
											console.error(e);
										}
									}
								} else if ($(cartSelector).find(checkoutSelector).length) {
									clickWasHandled = true;
									$(cartSelector).find(checkoutSelector).first().click();
								}
							}
							
							if (clickWasHandled !== true) {
								if (typeof window.SealSubs !== 'undefined' && typeof window.SealSubs.discounts_apply_on_initial_order === 'boolean' && typeof window.SealSubs.checkout === 'function') {
									if (SealSubs.discounts_apply_on_initial_order) {
										window.SealSubs.checkout();
										clickWasHandled = true;
									}
								}
							}
							
							if (clickWasHandled !== true) {								
								window.location.href = bndlr.addCheckoutParams('/checkout');
							}
						});
						
						$document.on('click', '.bndlr-message-close', function() {
															bndlr.setCookie('bndlr_hide_discount_message', 'hide', 0);
														self.closeMessage();
						});
						
						$document.on('click', '.bndlr-message-no', function() {
														self.closeMessage();
						});

						$document.on('click', '.bndlr-add-to-cart', function() {
							bndlr.addToCart($(this));
						});
						$document.on('keydown', '.bndlr-add-to-cart', function(e) {
							if(e.which == 13) { // Enter
								bndlr.addToCart($(this));
							}
							
							if(e.which == 32) { // Space
								e.preventDefault();
								bndlr.addToCart($(this));
							}
						});
						
						$document.on('change', '.bndlr-select-variant', function() {
							bndlr.updatePriceDisplay($(this));
							bndlr.changeDisplayedImage($(this));
							bndlr.convertCurrency();
						});
						
						$document.on('show_bundle', 'body', function (e, $el) {
							self.showBundleOnElementWithHandle($el);
													});
						
												
						// Start of MixNMatch listeners
						$document.on('click', '.bndlr-add-to-bundle', function() {
							bndlr.MixNMatch.addToBundle($(this));
						});
						$document.on('keydown', '.bndlr-add-to-bundle', function(e) {
							if(e.which == 13) { // Enter
								bndlr.MixNMatch.addToBundle($(this));
							}
							
							if(e.which == 32) { // Space
								e.preventDefault();
								bndlr.MixNMatch.addToBundle($(this));
							}
						});
						
						$document.on('click', '.bndlr-add-bundle-to-cart', function() {
							// Bundle add to cart button was clicked in the widget
							// Add bundle to the cart. The app knows which bundle to add to the cart based on the $(this) parameter.
							bndlr.MixNMatch.addMixAndMatchBundleToCart($(this));
						});
						$document.on('keydown', '.bndlr-add-bundle-to-cart', function(e) {
							if(e.which == 13) { // Enter
								bndlr.MixNMatch.addMixAndMatchBundleToCart($(this));
							}
							
							if(e.which == 32) { // Space
								e.preventDefault();
								bndlr.MixNMatch.addMixAndMatchBundleToCart($(this));
							}
						});

						
						$document.on('click', '.bndlr-mix-and-match .bndlr-close', function() {
							bndlr.MixNMatch.removeFromBundle($(this));
						});
						$document.on('keydown', '.bndlr-mix-and-match .bndlr-close', function(e) {
							if(e.which == 13) { // Enter
								bndlr.MixNMatch.removeFromBundle($(this));
							}
							
							if(e.which == 32) { // Space
								e.preventDefault();
								bndlr.MixNMatch.removeFromBundle($(this));
							}
						});
						
													if (typeof window.BndlrIsBundleLandingPage !== 'undefined' && window.BndlrIsBundleLandingPage === true) {
								$document.on('click', '.bndlr-status-box-add-to-cart', function() {
									// Add bundle to cart has been click on the button outside of the bundle (on the floating button)
									// Get the actual button from the actual bundle and trigger the add to cart action.
									// This only works for mix&match bundles
									
									var bundleKey = $(this).closest('[data-bndlr-bundle-key]').attr('data-bndlr-bundle-key');
									bndlr.MixNMatch.addMixAndMatchBundleToCart($('[data-bndlr-key="'+bundleKey+'"] .bndlr-add-bundle-to-cart').first(), $(this));
								});
								
								$document.on('keydown', '.bndlr-status-box-add-to-cart', function(e) {
									if(e.which == 13 || e.which == 32) { // Enter OR Space
										if(e.which == 32) { // Space
											e.preventDefault();
										}
										var bundleKey = $(this).closest('[data-bndlr-bundle-key]').attr('data-bndlr-bundle-key');
										bndlr.MixNMatch.addMixAndMatchBundleToCart($('[data-bndlr-key="'+bundleKey+'"] .bndlr-add-bundle-to-cart').first(), $(this));
										
									}
								});
								
								var MixNMatchScrollTimeout = false;
								$(window).scroll(function() {
									if (MixNMatchScrollTimeout !== false) {
										clearTimeout(MixNMatchScrollTimeout);
									}

									MixNMatchScrollTimeout = setTimeout(bndlr.MixNMatch.showHideStatusBox, 200);
								});
							}
												// End of MixNMatch listeners
						
																		
												
							$document.on('click', 'button.add_to_cart, #cart_form .js-change-quantity, .product-quantity-box .js-change-quantity, .btn--add-to-cart, .cart-functions  button.button[name="add"]', function (e) {
								// Trigger discount estimator when the user clicks the button
								setTimeout(function() {
									DiscountEstimator.showPopup();
								}, 1000);
							});
												
												
													//var cartUpdateTimeout = false;
							
							// listen for cart refresh function and update the discounts in cart when it gets triggered
							if (typeof window.jQuery !== 'undefined') {
								window.jQuery(document).on('cart.requestComplete', function() {
									debounce('cart-update', DiscountEstimator.showPopup.bind(DiscountEstimator), 10);
																	});
							}
							
							// We have now started observing the ajax events (change, add), as they are more reliable
							$document.on('change', '.sidebar-cart .cart__qty-input, .mini-cart__quantity .quantity-selector__value, #shopify-section-cart-template .quantity-selector__value, .ajaxcart__quantity .js-qty__num, .cart-product__quantity .inputCounter', function() {
								debounce('cart-update', DiscountEstimator.showPopup.bind(DiscountEstimator), 700);
								
															});
							
							$document.on('click', '.product-form .product-form__cart-submit, .sidebar-cart [data-cart-remove], .mini-cart__quantity .quantity-selector__button, #shopify-section-cart-template .quantity-selector__button, form.product-single__form .payment-buttons .add-to-cart, .ajaxcart__quantity .js-qty__adjust, .cart-product__quantity .inputCounter__btn', function() {
								debounce('cart-update', DiscountEstimator.showPopup.bind(DiscountEstimator), 700);
								
															});
							
							try {
								// Set listener for the cart drawer mutation
								window.addEventListener('bndlr:cart_drawer_mutation', function() {
									DiscountEstimator.updateCartDiscounts();								
								});
							} catch(e) {
								bundlerConsole.log(e);
							}
							
							try {
								// Set listener for the cart add/change actions
								document.addEventListener('bndlr:cart_was_modified', function() {
									debounce('cart-update', DiscountEstimator.showPopup.bind(DiscountEstimator), 250);							
								});
							} catch(e) {
								bundlerConsole.log(e);
							}
							
												
						
						var bundleWidgetCreatedTimeout = false;
						$document.on('bundler_bundle_widget_created', function() {
							
							if (bundleWidgetCreatedTimeout !== false) {
								clearTimeout(bundleWidgetCreatedTimeout);
							}
							bundleWidgetCreatedTimeout = setTimeout(function() {
								// trigger change on option element so the options will get disabled and enabled correctly
								$('.bndlr-product').each(function(i, el) {
									$(el).find('.bndlr-select-option').first().trigger('change');
								});

								bndlr.convertCurrency();
								
								if (
									(
										$('.bndlr-container:not([data-available="false"]) .bndlr-product-title').first().height() === 0 
										&& $('.bndlr-container:not([data-available="false"]) .bndlr-product-title').first().text() !== ''
										&& $('.bndlr-container:not([data-available="false"]) .bndlr-bundle-image').length === 0
									) || (
										$('.bndlr-container:not([data-available="false"]) .bndlr-bundle-image').length > 0 
										&& $('.bndlr-container:not([data-available="false"]) .bndlr-bundle-image').first().height() === 0
									)
								) {
									// Font size set by theme is probably 0. Set font size!
									$('.bundler-target-element').css({'font-size':'16px', 'line-height': '1.5'});
								}
								
															}, 500);
						});
						
												
						
						$(window).on('resize', function() {
							if (typeof bndlr.repositionTimeout !== 'undefined') {
								clearTimeout(bndlr.repositonTimeout);
							}
							
							bndlr.repositonTimeout = setTimeout(bndlr.repositionPlusSigns, 50);
						});
						
						
												
												
													// Detect default product variant selector change and also change the product variant in the bundler widget
							$('#SingleOptionSelector-0, #SingleOptionSelector-1').on('change', function() {	
								var variantSelector = '#ProductSelect-product-template option:selected, #ProductSelect-product-template option:selected';
								var variant = $(variantSelector).val();
								if (typeof variant == 'undefined') {
									var variant =  $(variantSelector).val();
								}
								
								$('select.bndlr-select-variant option[value="'+variant+'"]').parent('select').val(variant);
								$('select.bndlr-select-variant option[value="'+variant+'"]').parent('select').trigger('change');
							});
												
												
																		
												

						// Set listener for direct checkout button on product pages
												try {
							document.addEventListener('click', function (event) {
								
								try {
									if (bndlr.useBundlerCheckout && event.target.matches('form[action="/cart/add"] .shopify-payment-button__button') && bndlr.externalAppPreventCheckout.canCheckout()) {
										event.preventDefault();
										event.stopPropagation();
										event.stopImmediatePropagation();
										
										var form = $(event.target).closest('form');
										var url = form.attr('action');

										$.ajax({
											type: "POST",
											url: url,
											data: form.serialize(),
											success: function(data) {
												self.prepareInvoice();
											}
										});
									}
								} catch(e) {
									bundlerConsole.log(e.message);
								}
							}, true);
						} catch(e) {
							bundlerConsole.log(e.message);						
						}
					//});

					try {
						// Try to attach the default aggressive event listener to trigger before other events
						// Some older browsers don't support it.
						document.addEventListener('click', function (event) {
							
							try {
								if (bndlr.useBundlerCheckout && event.target.matches(checkoutSelector) && bndlr.externalAppPreventCheckout.canCheckout()) {
									event.preventDefault();
									event.stopPropagation();
									event.stopImmediatePropagation();
									
									try {
										$(event.target).addClass('bndlr-checkout-button-clicked');
									} catch(e) {
										console.error(e);
									}
									self.prepareInvoice();
								}
							} catch(e) {
								bundlerConsole.log(e.message);
							}
						}, true);
					} catch(e) {
						//bundlerConsole.log(e.message);						
					}

					var productWidthStandard = 230;
					var productWidthLandingPage = 330;
					if (typeof clientSpecifics['product_dimensions'] !== 'undefined') {
						productWidthStandard 	= clientSpecifics['product_dimensions'].getStandardWidth();
						productWidthLandingPage = clientSpecifics['product_dimensions'].getLadingPageWidth();
					}
					
					$body.append('<style>' +
						'.bndlr-container {' +
							'width:100%;' +
							'text-align:center;' +
							'margin-top:20px;' +
							'padding-top: 20px;' +
							'clear: both;' +
							'box-sizing: border-box;' +
							'line-height:1.5;' +
							//'font-size:16px;' +
						'}' +
						'.bndlr-product {' +
							'max-width:230px;' +
							'max-width:'+productWidthStandard+'px;' +
							'display:inline-block;' +
							'vertical-align: top;' +
							'margin: 5px 5px;' +
							'position:relative;' +
							'border: 1px solid rgba(198, 198, 198, 0.55);' +
							'padding: 5px 5px;' +
							'vertical-align: middle;' +
							'box-sizing: border-box;' +
						'}' +
						
						'.bndlr-product-overlay {' +
							'width:100%;' +
							'height:100%;' +
							'position:absolute;' +
							'top:0;' +
							'left:0;' +
							'background:rgba(255, 255, 255, 0.5);' +
							'box-sizing: border-box;' +
							'display:none;' +
						'}' +
						
						'.bndlr-product-overlay .bndlr-product-overlay-checkmark  {' +
							'position:absolute;' +
							'width: auto;' + 
							'height: 1.5em;' + 
							'display: block;' +
							'background:white;' +
							'background: #FFFFFF;' +
							'top:0;' +
							'right:0;' +
						'}' +
						
						'.bndlr-product-overlay .bndlr-product-overlay-checkmark .bndlr-preselected-checkmark {' +
							'width: auto;' +
							'height: 1.5em;' +
							'display: block;' +
							'stroke-width: 3;' +
							'stroke: rgb(70, 103, 167);' +
							'stroke: #4667A7;' +
							'margin:0 auto;' +
						'}' +
						
						'.bndlr-product:not(:last-of-type)::after {' +
							'position: absolute;' +
							'display: block;' +
							'right: calc(-0.5em - 6px);' +
							'top: 50%;' +
							'transform: translateY(-50%);' +
							'z-index: 9;' +
							'z-index: 1;' +
							'content: "+";' +
							'font-weight: bold;' +
							'color: white;' +
							'color: #FFFFFF;' +
							'background: #4667a7;' +
							'background: rgb(137, 207, 240);' +
							'border-radius:50%;' +
							'width: 1em;' +
							'height: 1em;' +
							'line-height: 1.05em;' +
							'font-size:25px;' +
							'font-family:arial;' +							
						'}' +
						'.bndlr-product.bndlr-no-plus-sign::after {' +
							'display:none;' +
						'}' +
												'.bndlr-container .bndlr-break-plus-signs .bndlr-add-to-cart {' +
							'max-width:230px;' +
						'}' +
						/* Bundler landing page */
						'.bndlr-landing-page .bndlr-product {' +
							'max-width:330px;' +
							'max-width:'+productWidthLandingPage+'px;' +
						'}' +
						'.bndlr-landing-page .bndlr-mnm-selected-products .bndlr-product {' +
							'max-width:250px;' +
						'}' +
						'.bndlr-landing-page .bndlr-container {' +
							'margin-top:0;' +
							'padding-top:0;' +
						'}' +
						'.bndlr-landing-page .bndlr-break-plus-signs .bndlr-add-to-cart {' +
							'max-width:330px;' +
						'}' +
						'@media screen and (max-width: 554px) {' +
							'.bndlr-landing-page .bndlr-container .bndlr-add-to-cart {' +
								'max-width:330px;' +
							'}' +
						'}' +
						/* ------------- */
						'.bndlr-break-plus-signs .bndlr-product:not(:last-of-type)::after {' +
							'right: calc(-0.5em - 6px);' +
							'left: 50%;' +
							'transform: translateX(-50%);' +
							'bottom: calc(-0.5em - 6px);' +
							'top:initial;' +
						'}' +
						'.bndlr-products-container {' +
							'display:inline-block;' +
							'padding:7px;' +
							'border-radius:2px;' +
							'margin-bottom: 20px;' +
							'position:relative;' +
						'}' +
						'.bndlr-inner-products-container {' +
							'display:inline-block;' +
						'}' +
						'.bndlr-mixnmatch .bndlr-inner-products-container {' +
							'padding-top:5px;' +
						'}' +
						'.bndlr-bundle-description {' +
							'width:80%;' +
							'margin:0 auto;' +
						'}' +
						'.bndlr-bundle-title {' +
							'margin-bottom: 0.3em;' +
							'margin-top: 0.2em;' +
						'}' +
						'.bndlr-container h2.bndlr-bundle-title {'+
							'text-align:center;' +
						'}' +
						'.bndlr-bundle-checkout-warning {' +
							'width:80%;' +
							'margin:0 auto 0.2em auto;' +
							'font-size:0.8em;' +
							'opacity:0.8;' +
							'margin-top: 0.5em;' +
						'}' +
						'.bndlr-add-to-cart {' +
							'display:block;' +
							'width: calc(100% - 10px);' +
							'margin:5px auto 0 auto;' +
							'background: #4667a7;' +
							'background: rgb(137, 207, 240);' +
							'padding: 0.6em 0;' +
							'color: white;' +
							'color: #FFFFFF;' +
							'border-radius: 2px;' +
							'cursor: pointer;' +
							'max-width: 710px;' +
						'}' +
						'.bndlr-add-to-bundle {' +
							'display:block;' +
							'width: 100%;' +
							'margin:5px auto 0 auto;' +
							'background: #4667a7;' +
							'background: rgb(137, 207, 240);' +
							'padding: 0.6em 0;' +
							'color: white;' +
							'color: #FFFFFF;' +
							'border-radius: 2px;' +
							'cursor: pointer;' +
							'max-width: 710px;' +
							'user-select: none;' +
						'}' +
						'.bndlr-add-to-bundle:active {' +
							'opacity:0.5;'+
						'}' +
						'.bndlr-add-bundle-to-cart {' +
							'display:block;' +
							'width: 100%;' +
							'margin:5px auto 0 auto;' +
							'background: #4667a7;' +
							'background: rgb(137, 207, 240);' +
							'padding: 0.6em 0;' +
							'color: white;' +
							'color: #FFFFFF;' +
							'border-radius: 2px;' +
							'cursor: pointer;' +
							'max-width: 710px;' +
						'}' +
													'.bndlr-add-to-cart[data-active="false"] {' +
								'opacity:0.8;' +
								'cursor: default;' +
							'}' +
												
						'.bndlr-checkmark {' +
							'width: auto;' +
							'height: 1.5em;' + // Must be the same as line height
							'display: block;' +
							'stroke-width: 4;' +
							'stroke: #FFFFFF;' +
							'margin:0 auto;' +
							'stroke-dasharray: 45;' +
							'stroke-dashoffset: 45;' +
							'-moz-animation: bndlr-stroke 0.35s linear forwards;' +
							'-webkit-animation: bndlr-stroke 0.35s linear forwards;' +
							'-o-animation: bndlr-stroke 0.35s linear forwards;' +
							'-ms-animation: bndlr-stroke 0.35s linear forwards;' +
							'animation: bndlr-stroke 0.35s linear forwards;' +
						'}' +
						
						'.bndlr-product.bndlr-mix-and-match .bndlr-checkmark {' +
							'stroke: #FFFFFF;' +
						'}' +
						
						// Don't animate checkmark in internet explorer and edge, as they don't support it. Edge should support it, but who knows :D
						'_:-ms-lang(x), .bndlr-checkmark {' +
							'stroke-dasharray: 0px;' +
							'stroke-dashoffset: 0px;' +
						'}' +
						
						'@keyframes bndlr-stroke {' +
							'100% {' +
								'stroke-dashoffset: 0px;' +
							'}' +
						'}' +
						
						'.bndlr-product-image-url {' +
							'display: block;' +
							'text-decoration: none;' +
							'border: none !important;' +
							'padding: 0 !important;' +
						'}' +
						'.bndlr-product-image-url::after {' +
							'display: none !important;' +
						'}' +
						'.bndlr-product-image {' +
							'border-radius:2px;' +
							'max-width:100%;' +
							'width:100%;' +
							'display:block;' +
							'margin-bottom:5px;' + 
							'margin-left: 0 !important;' +
							'opacity: 1 !important;' + /* To prevent image from disappearing because of lazyloading scripts */
						'}' +
						'.bndlr-product-title {' +
							'font-weight:bold;' +
							'border: none !important;' +
							'padding: 0 !important;' +
															'color: #282828 !important;' +
														
						'}' +
						'.bndlr-product-quantity {' +
							'font-weight:bold;' +
							'color: #788188;' +
							'display: inline-block;' +
							'margin-right: 5px;' +
						'}' +
						'.bndlr-old-price {' +
							'text-decoration: line-through !important;' + /* We need important because of the .money class */
							/*'margin-right:0.5em;' + No need for margin as we use one space to allow word break */
							'margin-right:0.25em;' +
							'color: #788188 !important;' +
							'color: rgb(120, 129, 136) !important;' +
							'font-weight:bold !important;' +
						'}' +
						'.bndlr-new-price {' +
							'color: #788188 !important;' +
							'color: rgb(120, 129, 136) !important;' +
							'font-weight:bold !important;' +
						'}' +
						'.bndlr-total-price,.bndlr-mnm-total-price {' +
							'font-weight:bold;' +
						'}' +
						'.bndlr-total-price .bndlr-old-price, .bndlr-total-price .bndlr-new-price, .bndlr-mnm-total-price .bndlr-old-price, .bndlr-mnm-total-price .bndlr-new-price {' +
							'color:inherit;' +
						'}' +
						'.bndlr-price-per-unit {' +
							'color: #788188 !important;' +
							'color: rgb(120, 129, 136) !important;' +
							'font-weight:normal !important;' +
							'font-style:italic;' +
							'font-size: 0.8em;' +
							'vertical-align: middle;' +
							'vertical-align: top;' +
						'}' +		 
						'.bndlr-select-variant {' +
							'font-family: inherit;' +
							'font-weight: inherit;' +
							'font-style: inherit;' +
							'-webkit-font-smoothing: antialiased;' +
							'-webkit-text-size-adjust: 100%;' +
							'border-radius: 2px;' +
							'max-width: 100%;' +
							'font-size: .82em;' +
							'padding: .445em 10px;' +
							'padding-right: 10px;' +
							'padding-right: 10px;' +
							'line-height: 1.6;' +
							'border: 1px solid #E3E3E3;' +
							'width: 100%;' +
							'max-width: 100%;' +
							'display: block;' +
							'margin-top: 5px;' +
							'margin-bottom: 0px !important;' +
							'color:rgb(47, 47, 47);' +
							'-webkit-appearance: none;' +
							'-moz-appearance: none;' +
							'appearance: none;' +
							'background-image: url(https://cdn-bundler.nice-team.net/app/img/app/dwn.svg?v2) !important;' +
							'background-repeat: no-repeat !important;' +
							'background-position: right 10px center !important;' +
							'background-color: #fff !important;' +
							'background-color: #FFFFFF !important;' +
							'padding-right: 28px;' +
							'text-indent: 0.01px;' +
							'text-overflow: "";' +
							'cursor: pointer;' +
							'background-size: auto;' +
							'min-height: unset !important;' +
							'height: auto;' +
						'}' +
						'select.bndlr-select-variant::-ms-expand {' +
							'display:none;' +
						'}' +
						'.bndlr-loading {' +
							'color: rgba(0,0,0,0) !important;' +
							'position:relative;' +
						'}' +
						'.bndlr-loading svg.bndlr-checkmark {' +
							'opacity:0;' +
						'}' +
						'.bndlr-loading:after {' +
							'display: block;' +
							'content: "";' +
							'border: 2px solid white;' +
							'border: 2px solid #FFFFFF;' +							
							'width: 1em;' +
							'height: 1em;' +
							'border-radius: 50%;' +
							'border-top: 2px solid transparent;' +
							'position: absolute;' +
							'left: 50%;' +
							'top: 50%;' +
							'animation-name: bndlr-spin;' +
							'animation-duration: 500ms;' +
							'animation-iteration-count: infinite;' +
							'animation-timing-function: linear;' +
						'}' +
						'@keyframes bndlr-spin {' +
							'from {' +
								'transform:translateY(-50%) translateX(-50%) rotate(0deg);' +
							'}' +
							'to {' +
								'transform:translateY(-50%) translateX(-50%) rotate(360deg);' +
							'}' +
						'}' +
						'.bndlr-bundle-loading {' +
							'height:6rem;' +
							'position:relative;' +
						'}' +
						'.bndlr-bundle-loading:after {' +
							'display: block;' +
							'content: "";' +
							'border: 2px solid #cdcdcd;' +
							'width: 3em;' +
							'height: 3em;' +
							'border-radius: 50%;' +
							'border-top: 2px solid transparent;' +
							'position: absolute;' +
							'left: 50%;' +
							'top: 50%;' +
							'animation-name: bndlr-spin;' +
							'animation-duration: 500ms;' +
							'animation-iteration-count: infinite;' +
							'animation-timing-function: linear;' +
						'}' +
						'#bndlr-discount-message {' +
							'position:fixed;' +
							'display:block;' +
							'width:auto;' +
							'height:auto;' +
							'background:rgb(246, 239, 220);' +
							'background:rgb(246, 239, 220);' +
							'color:#262626;' +
							'color:#262626;' +
							'padding: 30px 20px;' +
															'right:10px;' +
								'bottom:-100%;' +
														'z-index:99999;' +
							'box-shadow: 1px 1px 2px 1px #a5a5a5;' +
							'border-radius: 2px;' +
							'text-align:center;' +
							'font-size:20px;' +
							'border: 3px solid rgb(47, 47, 47);' +
							'border: 3px solid rgb(47, 47, 47);' +							
															'margin-left:10px;' +
													'}' +
						'.bndlr-message-title {' +
							'font-style:italic;' +
							'font-size: 0.8em;' +
							'font-weight: normal;' +
						'}' +
						'.bndlr-message-and-text {' +
							'font-size: 0.8em;' +
							'font-weight: normal;' +
						'}' +
						'.bndlr-message-question {' +
							'font-size: 0.7em;' +
							'font-weight: normal;' +
							'padding: 0 20px;' +
							'margin: 15px 0 10px 0;' +
						'}' +
						'.bndlr-message-discount-value {' +
							'border-top: 1px solid black;' +
							'border-top: 1px solid #262626;' +
							'border-bottom: 1px solid black;' +
							'border-bottom: 1px solid #262626;' +
							'font-weight:bold;' +
							'margin: 10px;' +
							'line-height: 1.5;' +
						'}' +
						'.bndlr-message-yes {' +
							'font-size: 0.7em;' +
							'background: rgb(70, 167, 98);' +
							'background: rgb(70, 167, 98);' +
							'color: white;' +
							'color: #ffffff;' +
							'display: inline-block;' +
							'padding: 5px 15px;' +
							'border: 1px solid rgb(0, 0, 0);' +
							'border: 1px solid #262626;' +
							'border-radius: 2px;' +
							'margin:0 10px;' +
							'cursor:pointer;' +
						'}' +
						'.bndlr-message-no {' +
							'font-size: 0.7em;' +
							'background: transparent;' +
							'display: inline-block;' +
							'padding: 5px 15px;' +
							'border: 1px solid rgb(0, 0, 0);' +
							'border: 1px solid #262626;' +
							'border-radius: 2px;' +
							'margin:0 10px;' +
							'cursor:pointer;' +
						'}' +
						'.bndlr-message-close {' +
							'position:absolute;' +
							'width:32px;' +
							'height:32px;' +
							'top:-5px;' +
							'right:-5px;' +
							'cursor:pointer;' +
							'border: none;' +
							'box-sizing: border-box;' +
						'}' +
						'.bndlr-message-close:before, .bndlr-message-close:after {' +
							'position: absolute;' +
							'left: calc(16px - 1px);' +
							'content: "";' +
							'height: 16px;' +
							'top: 8px;' +
							'width: 2px;' +
							'background-color: rgb(38, 38, 38);' +
							'background-color: rgb(38, 38, 38);' +
						'}' +
						'.bndlr-message-close:before {' +
							'transform: rotate(45deg);' +
						'}' +
						'.bndlr-message-close:after {' +
							'transform: rotate(-45deg);' +
						'}' +
						/*
						'.bndlr-message-close::after {' +
							'content: "";' +
							'display: block;' +
							'height: 2px;' +
							'width: 100%;' +
							'background-color: rgb(38, 38, 38);' +
							'background-color: rgb(38, 38, 38);' +
							'position: absolute;' +
							'left: 0;' +
							'top: 7px;' +
						'}' +
						'.bndlr-message-close::before {' +
							'content: "";' +
							'display: block;' +
							'height: 100%;' +
							'width: 2px;' +
							'background-color: rgb(38, 38, 38);' +
							'background-color: rgb(38, 38, 38);' +
							'position: absolute;' +
							'left: 7px;' +
							'top: 0;' +
						'}' +
						'.bndlr-message-close {' +
							'width: 16px;' +
							'height: 16px;' +
							'-webkit-transform: rotate(45deg);' +
							'-x-transform: rotate(45deg);' +
							'-o-transform: rotate(45deg);' +
							'transform: rotate(45deg);' +
							'position: absolute;' +
							'right: 3px;' +
							'top: 3px;' +
							'border: none;' +
							'cursor: pointer;' +
							'box-sizing: border-box;' +
						'}' +
						*/
						'.bndlr-warning {' +
							'position:absolute;' +
							'bottom:2px;' +
							'left:2px;' +
							'background:white;' +
							'color: #292929;' +
							'font-size:1em;' +
							'display:block;' +
							'padding: 5px;' +
							//'z-index: 1000;' +
							'border-radius:2px !important;' +
							'border: 1px solid #cdcdcd;' +
							'cursor:help;' +
							'left: 50%;' +
							'transform: translateX(-50%);' +
							'width: 90%;' +
						'}' +
						/* Accessibility CSS */
						'.bndlr-add-to-cart:focus, .bndlr-select-variant:focus, .bndlr-product a:focus, .bndlr-add-to-bundle:focus, .bndlr-add-bundle-to-cart:focus, .bndlr-close:focus {' +
							'outline:1px dotted rgb(134, 134, 134);' +
							'outline-offset: 1px;' +
						'}' +
						'.bndlr-add-to-cart:focus, .bndlr-select-variant:active, .bndlr-add-to-bundle:focus, .bndlr-add-bundle-to-cart:focus  {' +
							'opacity:0.9;' +
						'}' +
						'.bndlr-select-variant:hover {' +
							'outline:1px solid rgb(221, 221, 221);' +
						'}' +
						
						/* Rich text editor overrides */
						'.rte img.bndlr-product-image {' +
							'margin:0;' +
							'margin-bottom: 5px;' +
							'margin-left: 0 !important;' +
						'}' +
						'.rte .bundler-target-element a {' +
							'text-decoration:initial;' +
							'text-underline-position:initial;' +
						'}' +
						'.rte .bundler-target-element h2::after {' +
							'margin:0;' +
							'padding:0;' +
						'}' +
						'.rte .bundler-target-element h2 {' +
							'margin-top:0.2em;' +
							'margin-bottom:0.3em;' +
						'}' +
						
						/* Gecko 4.4 theme fix */
						'#jas-content .jas-row .bundler-target-element {' +
							'flex:1 1 auto;' +
						'}' +
						
						/* Custom bundle image */
						'img.bndlr-bundle-image {' +
							'border: 1px solid rgba(198, 198, 198, 0.55);' +
							'padding: 5px 5px;' +
							'max-width:100%;' +
							'max-width:calc(100% - 10px);' +
							'width:auto;' +
							'margin: 5px;' +
							'vertical-align: bottom;' +
							'box-sizing: border-box;' +
						'}' +
						'.bndlr-product-names-list {' + 
							'max-width: 710px;' +
							'margin:0 auto;' +
							'padding-bottom: 0.25em;' +
						'}' +
						
						'.bndlr-product-names-list .bndlr-price-per-unit {' + 
							'vertical-align: middle;' +
							'padding-left: 0.5em;' +
							'font-size: 0.7em;' +
						'}' +
						
						'#bndlr-loaded {' + 
							'width:0;' +
							'height:0;' +
						'}' +
												
												
						'.bundler-target-element {' +
							'clear:both;' +
							'direction:ltr;' +
						'}' +
						
												
													'.bndlr-cross-out {' +
								'text-decoration:line-through !important;' +
							'}' +
							'.bndlr-minus:before {' +
								'display:inline;' +
								'content:"-";' +
								'transform: translateX(-12px);' +
								'position: absolute;' +
							'}' +
							'section#cart form div.row div.total span.bndlr-cart-values {' +
								'margin-top:0;' +
							'}' +
												
												'.template-product section.page.page-product-header[itemtype="http://schema.org/Product"][data-section-type="product"] .bndlr-container {' +
							'padding-bottom:100px;' +
						'}' +
						
						'.bndlr-error {' +
							'text-align: center;' +
							'color:rgba(142, 142, 142, 0.46);' +
							'font-size: 0.7em;' +
							'font-style: italic;' +
						'}' +
						'span.bndlr-cart-values {' +
							'display:inline;' +
						'}' +

						/* Mix & Match bundle style */
						
						'.bndlr-mnm-second-container {' +
							'display:flex;' +
							'flex-direction:column;' +
						'}' +
						/*
						'.bndlr-mnm-available-products {' +
							'padding:5px;' +
						'}' +
						*/
						'.bndlr-mnm-selected-products-title {' +
							'text-align:center;' +
							'padding:5px 10px 0 10px;' +
							'font-size: 1.1em;' +
							'font-weight: bold;' +
							'font-style: italic;' +
						'}' +
						'.bndlr-mnm-selected-products {' +
							'flex: 1 1 50%;' +
							'display: flex;' +
							'padding:5px 0;' +
						'}' +
						'.bndlr-mnm-selected-products .bndlr-product {' +
							'max-width:200px;' +
						'}' +
						'.bndlr-mnm-add-to-cart-wrapper {' +
							'flex: 1 1 auto;' +
							'padding:5px;' +
						'}' +
						
						'.bndlr-mnm-selected-products .bndlr-product {' +
							'box-shadow: 1px 1px 5px 0px rgb(128, 128, 128);' +
							'border:none;' +
						'}' +
						
						'.bndlr-mnm-instructions-text {' +
							'color: rgb(232, 35, 35);' +
							'color: rgb(232, 35, 35);' +
						'}' +
						
	
						'.bndlr-product[data-mnm-required="true"]::before {' +
							'display:block;' +
							'content:"Required";' +
							'content:"Required";' +
							'position:absolute;' +
							'opacity: 1;' +
							'left: 0;' +
							'top: 0;' +
							'background:rgb(219, 54, 24);' +
							'background: rgb(219, 54, 24);' +
							'color:white;' +
							'color: rgb(255, 255, 255);' +
							'padding: 5px 7px;' +
							'font-weight: normal;' +
							'z-index:1;' +
							'border-bottom-right-radius: 2px;' +
						'}' +
						
						'#bndlr-mnm-status-box {' +
							'position:fixed;' +
							'bottom: 1em;' +
							'left:50%;' +
							'transform:translateX(-50%);' +
							'min-width:250px;' +
							'max-width:90%;' +
							'text-align:center;' +
							'z-index:2;' +
						'}' +
						
						'@media only screen and (max-width: 440px) {' +
							'#bndlr-mnm-status-box {' +
								'min-width:90%;' +
							'}' +
						'}' +
						
						'.bdnlr-mnm-status-box-info-container {'+
							'background:black;' +
							'background: #000000;' +
							'padding: 1em;' +
							'border-radius: 5px;' +
						'}' +
						
						'.bdnlr-mnm-status-box-products-container {' +
							//'margin-bottom: -0.5em;' +
							//'height: 67px;' +
							'text-align: center;' +
							'padding-left: 5px;' +
						'}' +
						
						'.bndlr-status-box-product {' +
							'width: 67px;' +
							'height: 67px;' +
							'display: inline-block;' +
							'margin-left: -10px;' +
							'margin-bottom: -0.5em;' +
							'vertical-align:bottom;' +
						'}' +
						'.bndlr-status-box-product-quantity {' +
							'position: absolute;' +
							'margin-top: -0.5em;' +
							'margin-left: -0.5em;' +
							'color: gray;' +
							'color: rgb(128, 128, 128);' +
							'font-style: italic;' +
							'font-size: 0.8em;' +
							'text-shadow: 1px 1px 0px rgb(193, 192, 192);' +
						'}' +
						
						'.bndlr-status-box-product-url {' +
							'display:block;' +
						'}' +
						
						'.bndlr-status-box-product-image {' +
							'width: 67px;' +
							'border-radius: 50%;' +
							'height: 67px;' +
							'object-fit: cover;' +
							'background:white;' +
							'box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.7);' +
						'}' +
						
						'#bndlr-mnm-status-box .bndlr-mnm-instructions-text {' +
							'color: white;' +
							'color: #FFFFFF;' +
						'}' +
						
						'.bndlr-status-box-add-to-cart {' +
							'display:block;' +
							'width: 100%;' +
							'margin:0 auto;' +
							'background: #4667a7;' +
							'background: #89CFF0;' +
							'padding: 0.6em 0;' +
							'color: white;' +
							'color: #FFFFFF;' +
							'border-radius: 2px;' +
							'cursor: pointer;' +
							'max-width: 710px;' +
						'}' +
						
						
						// Start of visibility animation
'.bndlr-visibility-hidden {' +
	'visibility:hidden;' +
	'opacity:0;' +
	'transition: visibility 0.5s, opacity 0.5s linear;' +
'}' +
'.bndlr-visibility-visible {' +
	'visibility: visible;' +
	'opacity:1;' +
	'transition: visibility 0.5s, opacity 0.5s linear;' +
'}' +
// End of visibility animation						
						'.bndlr-hidden {' +
							'display:none;' +
						'}' +
						
						'.bndlr-close::after {' +
							'content: "";' +
							'display: block;' +
							'height: 2px;' +
							'width: 100%;' +
							'background-color: rgb(70, 70, 70);' +
							'position: absolute;' +
							'left: 0;' +
							'top: 7px;' +
							'outline: 1px solid rgb(255, 255, 255);' +
						'}' +
						'.bndlr-close::before {' +
							'content: "";' +
							'display: block;' +
							'height: 100%;' +
							'width: 2px;' +
							'background-color: rgb(70, 70, 70);' +
							'position: absolute;' +
							'left: 7px;' +
							'top: 0;' +
							'outline: 1px solid rgb(255, 255, 255);' +
						'}' +
						'.bndlr-close {' +
							'width: 16px;' +
							'height: 16px;' +
							'-webkit-transform: rotate(45deg);' +
							'-x-transform: rotate(45deg);' +
							'-o-transform: rotate(45deg);' +
							'transform: rotate(45deg);' +
							'position: absolute;' +
							'right: 3px;' +
							'top: 3px;' +
							'border: none;' +
							'cursor: pointer;' +
							'box-sizing: border-box;' +
						'}' +
						
						'#ajaxifyModal #ajaxifyCart .bndlr-cart-values {'+
							// Smaller font size for Supply theme
							'font-size:80%;'+
						'}'+
						
						'.bndlr-dn {' +
							'display:none;' +
						'}' +
						'.bndlr-no-click {' +
							'pointer-events:none;' +
						'}' +
						
													// Volume discounts
							'.bndlr-volume {' +
								'text-align:center;' +
								'padding-top: 2em;' +
								'color:black;' +
								'color:#000000;' +
								'padding-bottom: 2em;' +
							'}' +
							
							'.bndlr-volume-title {' +
								'margin-bottom: 0.3em;' +
								'margin-top: 0.2em;' +
								'font-size: 1.25em;' +
								'line-height: 1.2;' +
							'}' +
							
							'.bndlr-volume-discounts {' +
								'margin-top: 0.75em;' + 
							'}' +
							
							'.bndlr-volume-discount {' +
								'border: 2px solid rgba(189, 189, 189, 0.55);' +
								'border: 2px solid rgba(189, 189, 189, 0.55);' +
								'padding: 0.75em;' +
								'margin-bottom: .5em;' +
								'text-align:center;' +
								'border-radius:5px;' +
								'position:relative;' +
								'color:black;' +
								'color:#000000;' +
								'background:white;' +
								'background:rgba(255,255,255,0);' +
							'}' +
							
							'.bndlr-volume-style-0.bndlr-volume-discount.bndlr-has-savings-text {' +
								'padding: 0.5em 0.75em 1.1em 0.75em;' +
								'margin-bottom: 1.2em;' +
							'}' +
							
							'.bndlr-volume-style-0 .bndlr-volume-saving-text {' +
								'position:absolute;' +
								'left:50%;' +
								'transform:translate(-50%, 50%);' +
								'bottom:0;' +
								'border-radius:5px;' +
								'background:rgb(70, 103, 167);' +
								'background:#4667a7;' +
								'color:white;' +
								'color:#FFFFFF;' +
								'font-size:0.75em;' +
								'padding:4px 45px;' +
								'white-space: nowrap;' +
								'font-weight:bold;' +
								'line-height:1.6;' +
							'}' +
							
																			
						
						'#bundler-target-element:empty, .bundler-target-element:empty, .bundler-volume-target-element:empty {' + // Fix for Dawn theme
							'display:block !important;' +
						'}' +
						
						'#__pf [data-pf-type="Section"] .bundler-volume-target-element {' + // Fix for Dawn theme
							'max-width:500px;' +
						'}' +
						
																																																																																																																														
													// Align elements version 2
							'.bndlr-inner-products-container > div:first-child {' + 
								'display: flex;' +
								'flex-wrap: wrap;' +
								'justify-content: center;' +
							'}' +
							'.bndlr-product {' + 
								'display: flex;' +
								'flex-direction: column;' +
								'justify-content: center;' +
							'}' +
							
							'.bndlr-product-image-url {' +
								'margin-top:auto;' +
								'margin-bottom:auto;' +
							'}' +
							
							/*
							// To align the product image at the top and make the products the same width
							// Will look good if images are the same height and some of the products don't have variant selectors.
							// Will look bad if images are NOT the same height and some of the products don't have variant selectors.
							'.bndlr-product-image-url {'+
								'margin-top:0;'+
								'margin-bottom:0;'+
							'}'+
							'.bndlr-bottom-pusher {'+
								'margin-bottom:auto;'+
							'}'+
							// Make products same width
							'.bndlr-landing-page .bndlr-product {'+
								'flex:1 1 0px;'+ // Could cause issue in IE
							'}'+
							*/
							
							// IE fixes
							'_:-ms-lang(x), .bndlr-inner-products-container > div:first-child {' + 
								'display: block;' +
							'}' +
							'_:-ms-lang(x), .bndlr-product {' + 
								'display: inline-block;' +
							'}' +/*
							'_:-ms-lang(x), .bndlr-bottom-pusher {' +
								'margin-top:0;' +
							'}' +*/
							'_:-ms-lang(x), .bndlr-product-image-url {' +
								'margin-top:0;' +
								'margin-bottom:0;' +
							'}' +
							/*
							'.bndlr-product-image-url {' + // Makes the picture centered and other info at the bottom. 
								'flex: 1 1 auto;' +
								'justify-content: center;' +
								'display: flex;' +
								'align-items: center;' +
							'}' +*/
							
													
						'.bndlr-mnm-available-products, .bndlr-mnm-selected-products {' + 
							'display: flex;' +
							'flex-wrap: wrap;' +
							'justify-content: center;' +
						'}' +
						'.bndlr-product.bndlr-mix-and-match {' + 
							'display: flex;' +
							'flex-direction: column;' +
							'justify-content: center;' +
							'flex: 1 1 auto;' +
						'}' +
						'.bndlr-mix-and-match .bndlr-product-image-url {' +
							'margin-top:auto;' +
							'margin-bottom:auto;' +
						'}' +
						'.bndlr-mix-and-match .bndlr-bottom-pusher {' +
							'margin-bottom:unset;' +
						'}' +
						// IE fixes
						'_:-ms-lang(x), .bndlr-mnm-available-products, .bndlr-mnm-selected-products {' + 
							'display: block;' +
						'}' +
						'_:-ms-lang(x), .bndlr-product.bndlr-mix-and-match {' + 
							'display: inline-block;' +
						'}' +
						'_:-ms-lang(x), .bndlr-mix-and-match .bndlr-product-image-url {' +
							'margin-top:0;' +
							'margin-bottom:0;' +
						'}' +
						
												
												
						// 2020-03-12 make padding and margin smaller for custom bundle elements
						'.bundler-target-element[data-bndlr-ccid] .bndlr-container {' +
							'margin-top:10px;' +
							'padding-top:10px;' +
						'}' +
						
						'.bndlr-medium .bndlr-product {' +
							'max-width:190px;' +
						'}' +
						
												
						
						'.bundler-widgets-side-by-side, .bundler-widgets-side-by-side #bundler-target-element {' +
							'display: flex;' +
							'clear: both;' +
							'max-width: 1500px;' +
							'margin: 0 auto;' +
							'flex-wrap:wrap;' +
						'}' +
						'.bundler-widgets-side-by-side .bundler-target-element {' +
							'display: flex;' +
							'flex: 1 1 auto;' +
							//'flex: 1 1 0px;' +
							'align-self: flex-end;' +
							'justify-content: center;' +
							'max-width:740px;' +
							'min-width: 320px;' +
						'}' +
						'.bundler-widgets-side-by-side .bndlr-products-container {' +
							'display:block;' +
						'}' +
						
					'</style>');
					
					if (nav.isShopPage() === false) {
						// We are on a third party page
						// Append special style
						$body.append('<style>' +
							'.bndlr-container {' +
								'margin-top:0;' +
								'padding-top:0;' +
							'}' +
						'</style>');
					}
					
										
										
										
					
					if (typeof clientSpecifics['init'] !== 'undefined') {
						clientSpecifics['init'].trigger();
					}
					
										
					//$('body').append('<div id="bndlr-loaded"></div>');

					bundlerConsole.info('%c App loaded: Bundler - Product Bundles (6E):', 'background: #1960bc; color: #fff', 'https://apps.shopify.com/bundler-product-bundles');
				},
				convertCurrency: function(selector) {
					
					if (typeof selector === 'undefined') {
						selector = '.bndlr-product .bndlr-money, .bndlr-total-price .bndlr-money';
					}

					if (typeof DoublyGlobalCurrency !== 'undefined' && typeof DoublyGlobalCurrency.currentCurrency !== 'undefined' && typeof DoublyGlobalCurrency.convertAll !== 'undefined') {

						try {
							var newCurrency = DoublyGlobalCurrency.currentCurrency;
							DoublyGlobalCurrency.convertAll(newCurrency, selector);
						} catch(e) {}
						
					} else if (typeof Currency !== 'undefined' && typeof Currency.currentCurrency !== 'undefined' && typeof Currency.convertAll !== 'undefined') {

						var oldCurrency = bndlr.getDefaultCurrency();
						var newCurrency = Currency.currentCurrency;

						// Convert currency if old currency is not the same as new currency
						// if currency rate is set to 1.0, which means that the conversion was not automatically performed by Shopify backend
						if (oldCurrency !== newCurrency && 
							newCurrency !== '' && 
							typeof Shopify !== 'undefined' && 
							typeof Shopify.currency !== 'undefined' && 
							typeof Shopify.currency.rate !== 'undefined' &&
							Shopify.currency.rate === "1.0") {

															try {
									Currency.convertAll(oldCurrency, newCurrency, selector);
								} catch(e) {
									// New currency can sometimes be empty string and an error will occur
									// TODO check why does this happen
								}
													}
					}
					
					if (typeof conversionBearAutoCurrencyConverter !== 'undefined' && typeof conversionBearAutoCurrencyConverter.convertPricesOnPage === 'function') {
						conversionBearAutoCurrencyConverter.convertPricesOnPage();
					}
					
										
										
					if (typeof BOLDCURRENCY !== 'undefined' && typeof BOLDCURRENCY.converter !== 'undefined' && typeof BOLDCURRENCY.converter.refresh !== 'undefined') {								
						BOLDCURRENCY.converter.refresh();
					}
					
					// luxespaceofficial
					if (typeof window.store !== 'undefined' 
						&& typeof window.store.update !== 'undefined' 
						&& typeof window.GemCurrency !== 'undefined' 
						&& typeof window.GemCurrency.currentCurrency !== 'undefined') {
							try {
								window.store.update('dataCurrency', window.GemCurrency.currentCurrency);
							} catch(e) {
								console.log(e);
							}
						}
				},
				canUseCheckout: function() {
											// Function which is exposed to external apps so they can check if the Bundler can checkout (sealsubs).
						return bndlr.useBundlerCheckout && bndlr.externalAppPreventCheckout.canCheckout();
									},
				prepareInvoice: function(fallbackToCheckout, callback, triggerNormalCheckout) {
					// Main function to trigger invoice creation
					// Don't use this/self, so we can call the method from external apps
					
					if (typeof fallbackToCheckout === 'undefined') {
						fallbackToCheckout = true;
					}
					// triggerNormalCheckout is used to trigger a checkout from external apps and prevent an infinite loop, as the customer gets redirected directly to the checkout apage
					if (typeof triggerNormalCheckout === 'undefined') {
						triggerNormalCheckout = true;
					}
					
					cart.get('default', false).done(function(cartData) {
						
							// Get checkout note
							var cartNoteSelector = '#CartSpecialInstructions, .cart-note__input, #note, [name="cart[note]"], [name="note"]';
							if ($(cartNoteSelector).first().length > 0 && $(cartNoteSelector).first().val().length > 0) {
								cartData.note = $(cartNoteSelector).first().val();
							}
							
							try {
								if (nav.isCartPage() && $('.bundler-target-element').length === 0) {
									// Check if we are on the cart page and there isn't any bundle offer on it.
									// Find any input items on cart page, loop through them and change the quantity if needed
									var cartItemKeyRegex = /\d+:[a-z0-9]+/;
									$('[name="updates[]"]').each(function(key, el) {
										var id = $(el).attr('id');

										if (typeof id === 'string') {
											var match = id.match(cartItemKeyRegex);
											if (match !== null && typeof match[0] === 'string') {
												var itemKey = match[0];
												var itemQuantity = $(el).val()*1;
												if (itemQuantity > 0) {
													// Loop thorugh cart items and correct quantity if needed
													for (var j = 0; j<cartData.items.length; j++) {
														if (cartData.items[j].key === itemKey && cartData.items[j].quantity != itemQuantity) {
															// Set new item quantity
															cartData.items[j].quantity 				= itemQuantity;
															cartData.items[j].line_price 			= itemQuantity*cartData.items[j].price; // No need to actually set this, just the quantity is important
															cartData.items[j].original_line_price 	= itemQuantity*cartData.items[j].original_price; // No need to actually set this, just the quantity is important
															cartData.items[j].final_line_price 		= itemQuantity*cartData.items[j].final_price; // No need to actually set this, just the quantity is important
														}
													}
												}
											}
										}
									});
								}
							} catch(e) {
								console.error(e);
							}
							
							try {
								// Use try catch block as this is not core functionality
								// Get attributes for Zapiet Pickup & delivery app
								var cartSelector = 'form[action="/cart"][method="post"], form.cart[method="post"], #cart form';
								if ($(cartSelector).length > 0) {
									// Get checkout url with attributes
									var url = $(cartSelector).attr('action');
									var urlParams = url.match(/(?:cart\?)(.*)/);
									if (urlParams !== null && typeof urlParams[1] !== 'undefined' && urlParams[1].length > 0) {
										// Url has some extra parameters
										var additionalParams = nav.getQueryParams(urlParams[1]);
										bndlr.setCheckoutParams(additionalParams);
									}
									
									// Get attributes
									$(cartSelector).find('input[name^="attributes["], select[name^="attributes["], textarea[name^="attributes["]').each(function(ix, el) {
										if (typeof cartData.attributes === 'undefined') {
											// Set attributes key if it is missing
											cartData.attributes = {}
										}
										
										var key = $(el).attr('name').replace('attributes[', '').replace(']', '');
										var value = $(el).val();
										
											
										var $el = $(el);
										var addAttribute = true;
										if ($el.attr('type') === 'checkbox') {
											if ($el.is(':checked') === false) {
												// Only the checked checkboxes are sent to the server
												addAttribute = false;
											}
										}
										
										// Check if value is not empty string or if the attribute doesn't yet exist in the cart data.
										if (addAttribute && ((value !== '' && value !== null) || typeof cartData.attributes[key] == 'undefined')) {
											// Add attribute to cart data
											cartData.attributes[key] = value;
										}
										
										
									});
									
								}
							} catch(e) {
								bundlerConsole.log(e);
							}
						
							bndlr.getInvoice(cartData).done(function(data) {
								if (typeof callback === 'function') {
									//$('.bndlr-add-to-cart').removeClass('bndlr-loading');
									callback();
								} else {
									bndlr.useInvoice(data, triggerNormalCheckout);
								}
								
							}).fail(function(f) {
								//bundlerConsole.log('Something went wrong.');
								//bundlerConsole.log('Falling back to normal checkout.');
								if (fallbackToCheckout === true) {
									// Fallback to normal checkout url
									window.location.href = bndlr.addCheckoutParams('/checkout');
								} else {
									$('.bndlr-add-to-cart').removeClass('bndlr-loading');
								}
							});
					});
					
				},
				getInvoice: function(cartData) {
					
					var exchangeRate = 1;
					if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.currency !== 'undefined' && typeof window.Shopify.currency.rate !== 'undefined') {
						exchangeRate = window.Shopify.currency.rate;
					}
					
					// Get invoice url from backend
					return $.ajax({
						url: nav.getInvoiceEndpoint(),
						type: 'POST',
						data: {
							cart: cartData,
							er: exchangeRate
							
						},
						dataType: 'json',
						timeout: 15000
					});
				},
				useInvoice: function(invoice, triggerNormalCheckout) {
					
					// triggerNormalCheckout is used to trigger a checkout from external apps and prevent an infinite loop, as the customer gets redirected directly to the checkout apage
					if (typeof triggerNormalCheckout === 'undefined') {
						triggerNormalCheckout = true;
					}
					
					// Redirect ot invoice url
					if (typeof invoice.url !== 'undefined') {
						if (invoice.url === '/checkout') {
							if (triggerNormalCheckout) {
								$(document).trigger('bundler_trigger_normal_checkout');
							} else {
								window.location.href = this.addCheckoutParams('/checkout');
							}
							// window.location.href = '/checkout';
						} else {
							
							invoice.url = this.addCheckoutParams(invoice.url);
							
															if (typeof invoice.status_code !== 'undefined' && invoice.status_code == 202) {
									// This order requires pooling
									// Wait some time before you redirect to it.
									setTimeout(function() {
										window.location = invoice.url;
									}, 1000);
								} else {
									// This orders seems okay, redirect immediately
									window.location = invoice.url;
								}
								/*
								setTimeout(function() {
									window.location = invoice.url;
								}, 500);
								*/
													}
					} else {
						//bundlerConsole.log('Something went wrong', invoice);
						// Fallback to normal checkout url
						window.location.href = this.addCheckoutParams('/checkout');
					}
				},
				showBundleOnElementWithHandle: function($el) {
					var productHandle = $el.attr('data-product-handle');

					if (productHandle !== false) {
						
						var self = this;							
						cart.getProductData(nav.getRootUrl(), productHandle).done(function(productData) {
							productData = self.remapProductData(productData);
							
							var bundle = self.findBundle(productData.id, productData.variants);

							var uniqueKey = utils.getRandomString();
							$el.attr('data-b-key', uniqueKey);
							var keySelector = '[data-b-key="'+uniqueKey+'"]';
							
							$el.attr('data-bundle', bundle.id);
							$el.html('<div class="bndlr-bundle-loading"></div>');							
							
							if (bundles !== false) {
								self.getProducts(bundle, function() {
									self.displayBundle(bundle, keySelector);
								});
							}
						});
					}
				},
				showBundle: function(removePreviousBundles) {
					// removePreviousBundles is used when switching bundles based on selected variant change.
					
					var bundleFound = false;

										
					
											$('.bundler-target-element[data-bndlr-ccid]').each(function(index, el) {
							$el = $(el);
							if ($el.find('.bndlr-container').length === 0) {
								// Element doesn't yet contain the bundle
							
								var code = $el.attr('data-bndlr-ccid');
								
								if (typeof code !== 'undefined' && code.length > 0) {
									var bndleId = utils.deCompress(code);
									$el.attr('data-bundle', bndleId);
									
									if (bndlr.getBundleById(bndleId) !== false) {
										$el.html('<div class="bndlr-bundle-loading"></div>');
									}
								}
							}
						});
										
					// Check if there is a custom bundle element
					if ($('#bundler-target-element[data-bundle], .bundler-target-element[data-bundle]').length > 0) {
						var bundlesList = [];
						$('#bundler-target-element[data-bundle], .bundler-target-element[data-bundle]').each(function(index, el) {
							
							$el = $(el);
							if ($el.find('.bndlr-container').length === 0) {
								// Element doesn't yet contain the bundle
								// The element doesn't yet have the bundle key
								
								$el.addClass('bundler-target-element');
								
								var uniqueKey = $el.attr('data-bndlr-k');
								
								if (typeof uniqueKey !== 'string') {
									uniqueKey = utils.getRandomString();
									$el.attr('data-bndlr-k', uniqueKey);
									
									
									$el.attr('id', '_bndl_key_'+uniqueKey);
									
								}
								
								var keySelector = '#_bndl_key_'+uniqueKey;
								
								bundlesList.push({
									id			: $el.attr('data-bundle'),
									keySelector	: keySelector
								});
							}
						});

						var bundleDataList = [];
						for(var i = 0; i < bundlesList.length; i++) {
							if (bundlesList[i].id.length) {
							
								bundleDataList[i] = {
									bundle		: this.getBundleById(bundlesList[i].id),
									keySelector	: bundlesList[i].keySelector
								};

								if (bundleDataList[i].bundle !== false) {
									bundleFound = true;
								}

								if (bundleDataList[i].bundle !== false) {
									var self = this;

									var bundle = bundleDataList[i].bundle;

									self.getProducts(bundle, (function() {
											var bundleTmp = bundle;
											var keySelectorTmp = bundleDataList[i].keySelector;
											return function(products) {
												self.setObserver(bundleTmp, keySelectorTmp);
											}
										}
									)());
								}
							}
						}						
					}
					
											if (bundleFound === false) {
							// Trigger to display bundle on product page
							var productHandle = nav.getProductHandle();

							if (productHandle !== false && ((typeof removePreviousBundles !== 'undefined' && removePreviousBundles) || $('.bndlr-automatic').length <= 0)) {
								// $('.bndlr-automatic').length check makes sure that we don't add bundle widgets on the page too many times if we call the .refresh() method.
								// Except if we set the removePreviousBundles parameter to true, as we want to refresh the bundle widget because of the variant change
									
								var self = this;
								
								cart.getProductData(nav.getRootUrl(), productHandle).done(function(productData) {
									
									productData = self.remapProductData(productData);

																		
										var bndls = self.findBundles(productData.id, productData.variants);

																				
										if (Object.keys(bndls).length > 0) { // Make sure that at least one bundle was found
										
											self.loopThroughSelectors(function($element, htmlSelector) {
												
												if ($element.length === 1 && $element.closest('#judgeme_product_reviews').length === 0) {
								
													var dataBundleAttr = $element.attr('data-bundle');
													if (typeof dataBundleAttr === 'undefined' || dataBundleAttr === false) {
												
														var elementAppended = false;
														for (var bndleId in bndls) {
															if (bndls.hasOwnProperty(bndleId)) {
																var $el = $('<div class="bundler-target-element bndlr-automatic" data-bundle="'+bndls[bndleId].id+'"><div class="bndlr-bundle-loading"></div></div>');
																//$el.attr('data-bundle', bndls[bndleId].id);
																//$el.html('<div class="bndlr-bundle-loading"></div>');
																
																if (typeof self.productHtmlSelectorsActions[htmlSelector] !== 'undefined') {
																	// use positioning function
																	var positioningFunction = self.productHtmlSelectorsActions[htmlSelector];

																	$element[positioningFunction]($el);
																} else {
																	// deafult action is append
																	$element.append($el);
																}
																
																elementAppended = true;
															}
														}
														
														if (elementAppended) {
															// Recursivelly call itself to actually load the bundles
															self.showBundle();
														}
														
														return false;
													}
												}
											});
										}
	
																	});
							}
						}
									},
				
				loopThroughSelectors: function(callback) {
					
					for(var i = 0; i < this.productHtmlSelectors.length; i++) {
						var htmlSelector = this.productHtmlSelectors[i];
						
						if (htmlSelector === '.bundler-target-only-visible-element') {
							var $element = $(htmlSelector).filter(':visible');
						} else {
							var $element = $(htmlSelector);
						}
						
						if (callback($element, htmlSelector) === false) {
							break;
						}						
					}
				},
				isVariantStockAvailable: function(variant) {
					if (variant.inventory_quantity <= 0 && variant.inventory_policy === 'deny') {
						return false;
					}
					
					return true;
				},
				// This method will price or 0 if the price was undefined, null or ''
				priceOrZero: function(price) {
					if (typeof price === 'undefined' || price === '' || price === null) {
						return 0;
					}
					
					return this.getPrice(price);
				},
				remapProductData: function(productData, variantId) {
					if (typeof productData.product !== 'undefined' && typeof productData.id === 'undefined') {
						// product data is in a sub product object if you request a .json file or by content type header
						// productData = productData.product;
						
						var source = productData.product;

						var product = {
							id: source.id,
							title: source.title,
							handle: source.handle,
							variants: [],
							images: [],
							featured_image: source.images[0].src
						};
						
						var variants = [];

						for (var z = 0; z < source.variants.length; z++) {
	
							var variant = {
								id:			 		source.variants[z].id,
								public_title: 		source.variants[z].public_title,
								name: 				source.variants[z].name,
								title: 				source.variants[z].title,
								price: 				this.getPrice(source.variants[z].price),
								compare_at_price:	this.priceOrZero(source.variants[z].compare_at_price),
								featured_image: 	{
									src: this.getVariantsFeaturedImage(source, source.variants[z])
								},
								available:			this.isVariantStockAvailable(source.variants[z])
							};
							
							variants.push(variant);
						}

						product.variants = variants;
						
						var images = [];
						for (var z = 0; z<source.images.length; z++) {
							images.push(source.images[z].src);
						}
						
						product.images = images;
						
						productData = product;
					}
					
					if (typeof variantId !== 'undefined' && variantId !== null) {
						// Remap product data for this variant id, as this product is included in a variant level bundle
						var variants = [];

						for (z = 0; z < productData.variants.length; z++) {

							if (productData.variants[z].id == variantId) {

								variants.push(productData.variants[z]);
								
								productData.id 		= productData.variants[z].id;
								
								var variantTitle = this.getVariantTitle(productData.variants[z]);
								
								if (productData.title !== variantTitle) {
									productData.title 	= productData.title + ' - ' + this.getVariantTitle(productData.variants[z]);
								} else {
									productData.title 	= productData.title;
								}
								
								break;
							}
						}
						
						if (variants.length === 0) {
							console.warn('Could not get variant '+variantId+' data for product '+productData.title+'!');
							// Assign the required variant ID to this product, as we then use this id to map the product to the actual data
							productData.id = variantId;
						}
						
						productData.variants = variants;
					}
					
					productData.product_id = productData.id;
					
					return productData;
					
									},
				getVariantTitle: function(variant) {
					var name = variant.public_title;
					if (typeof name == 'undefined' || name === null) {
						name = variant.name;
					}
					
					if (typeof name == 'undefined' || name === null) {
						name = variant.title;
					}
					
					return name;
					
				},
				findBundle: function(productId, variants, volumeDiscountType) {
					if (typeof volumeDiscountType === 'undefined') {
						volumeDiscountType = false;
					}
					// This method find the bundle, relevant to the currently viewed product.
					// If there are multiple same priority variant level bundles, then the one with the currently selected variant will be displayed
					
					var currentPriority = 0;
					var foundPreferredVariantBundle = null;
					var foundNonPreferredVariantBundle = null;
					
					var bndls = bundles;
					if (typeof clientSpecifics['before_find_bundle_reorder'] !== 'undefined') {
						bndls = clientSpecifics['before_find_bundle_reorder'].reorder(bndls);
					}
					
					// Finds bundle in bundles
					for (var i = 0; i<bndls.length; i++) {
						
						if (bndls[i].show_bundle === 'false') {
							continue;
						}
						
						if (volumeDiscountType === true && bndls[i].minimum_requirements !== 'volume_discounts') {
							// The bundle is not the volume discount bundle
							continue;
						}
						
						if (volumeDiscountType === false && bndls[i].minimum_requirements === 'volume_discounts') {
							// The bundle is the volume discount bundle, but we don't want it
							continue;
						}
						
						if (volumeDiscountType === true && bndls[i].minimum_requirements === 'volume_discounts' && bndls[i].product_target_type === 'all_products') {
							return bndls[i];
						}
						
						if (bndls[i].priority !== currentPriority) {
							// Priority level has changed. Flush any variant level bundles
							if (foundPreferredVariantBundle !== null) {
								return foundPreferredVariantBundle;
							}
							
							if (foundNonPreferredVariantBundle !== null) {
								return foundNonPreferredVariantBundle;
							}
						}
						
						currentPriority = bndls[i].priority;
						
						if (this.isVariantBundle(bndls[i]) === false) {
							// Product level bundles
							if (typeof bndls[i].products[productId] !== 'undefined') {
								return bndls[i];
							}
							if (typeof bndls[i].required_products[productId] !== 'undefined') {
								return bndls[i];
							}
						} else {
							// Variant level bundles
							var preferredVariant = nav.getVariantId();
							
							if (preferredVariant === '') {
								// The variant is not in the URL. Fallback to the product variant selector on the product page.
								var selectedVariant = $('select.product-single__variants[name="id"] option:selected');
								if (selectedVariant.length) {
									preferredVariant = selectedVariant.val();
								}
							}

							if (preferredVariant !== '') {
								
								// First loop will try to find a bundle, relevant to the currently selected variant
								for (var pid in bndls[i].products) {
									if (bndls[i].products.hasOwnProperty(pid)) {

										var bundleVariants = bndls[i].products[pid].variants;
								
										if (typeof bundleVariants[preferredVariant] !== 'undefined') {
											foundPreferredVariantBundle = bndls[i];
										}
									}
								}
								
								if (foundPreferredVariantBundle === null) {
									// Check required products if a bundle wasn't found with discounted products
									for (var pid in bndls[i].required_products) {
										if (bndls[i].required_products.hasOwnProperty(pid)) {

											var bundleVariants = bndls[i].required_products[pid].variants;

											if (typeof bundleVariants[preferredVariant] !== 'undefined') {
												foundPreferredVariantBundle = bndls[i];
											}
										}
									}
								}
							}

							// Second loop is the default one. Will find first bundle which has at least one variant included from the currently viewed product.
							for (var pid in bndls[i].products) {
								if (bndls[i].products.hasOwnProperty(pid)) {

									var bundleVariants = bndls[i].products[pid].variants;
									
									for (var x = 0; x < variants.length; x++) { // Variants of current product
										var variantId = variants[x].id;
										
										if (typeof bundleVariants[variantId] !== 'undefined') {
											foundNonPreferredVariantBundle = bndls[i];
										}
									}
								}
							}
							
							if (foundNonPreferredVariantBundle === null) {
								// Check required products if a bundle wasn't found with discounted products
								for (var pid in bndls[i].required_products) {
									if (bndls[i].required_products.hasOwnProperty(pid)) {

										var bundleVariants = bndls[i].required_products[pid].variants;
										
										for (var x = 0; x < variants.length; x++) { // Variants of current product
											var variantId = variants[x].id;
											
											if (typeof bundleVariants[variantId] !== 'undefined') {
												foundNonPreferredVariantBundle = bndls[i];
											}
										}
									}
								}
							}
						}
					}
					
					if (foundPreferredVariantBundle !== null) {
						return foundPreferredVariantBundle;
					}
					
					if (foundNonPreferredVariantBundle !== null) {
						return foundNonPreferredVariantBundle;
					}
					
					return false;
				},
									findBundles: function(productId, variants, volumeDiscountType) {
						if (typeof volumeDiscountType === 'undefined') {
							volumeDiscountType = false;
						}
						
						var bundlesCopy = bundles;
						if (typeof clientSpecifics['before_find_bundle_reorder'] !== 'undefined') {
							bundlesCopy = clientSpecifics['before_find_bundle_reorder'].reorder(bundlesCopy);
						}
						
						var bndls = {};
						// Finds bundle in bundles for the current product
						for (var i = 0; i<bundlesCopy.length; i++) {
							if (bundlesCopy[i].show_bundle === 'true') {
								
								if (volumeDiscountType === true && bundlesCopy[i].minimum_requirements !== 'volume_discounts') {
									// The bundle is not the volume discount bundle
									continue;
								}
								
								if (volumeDiscountType === false && bundlesCopy[i].minimum_requirements === 'volume_discounts') {
									// The bundle is the volume discount bundle, but we don't want it
									continue;
								}
								
								var bundleKey = bundlesCopy[i].priority + '_' + bundlesCopy[i].id;
								
								if (this.isVariantBundle(bundlesCopy[i]) === false) {
									if (typeof bundlesCopy[i].products[productId] !== 'undefined' && typeof bndls[bundleKey] === 'undefined') {
										bndls[bundleKey] = bundlesCopy[i];
									} else if (typeof bundlesCopy[i].required_products[productId] !== 'undefined' && typeof bndls[bundleKey] === 'undefined') {
										bndls[bundleKey] = bundlesCopy[i];
									}
								} else {
									for (var pid in bundlesCopy[i].products) {
										if (bundlesCopy[i].products.hasOwnProperty(pid)) {

											var bundleVariants = bundlesCopy[i].products[pid].variants;
											
											for (var x = 0; x < variants.length; x++) {
												var variantId = variants[x].id;
												
												if (typeof bundleVariants[variantId] !== 'undefined' && typeof bndls[bundleKey] === 'undefined') {
													bndls[bundleKey] = bundlesCopy[i];
												}
											}
										}
									}
									
									if (typeof bndls[bundleKey] === 'undefined') {
										for (var pid in bundlesCopy[i].required_products) {
											if (bundlesCopy[i].required_products.hasOwnProperty(pid)) {

												var bundleVariants = bundlesCopy[i].required_products[pid].variants;
												
												for (var x = 0; x < variants.length; x++) {
													var variantId = variants[x].id;
													
													if (typeof bundleVariants[variantId] !== 'undefined' && typeof bndls[bundleKey] === 'undefined') {
														bndls[bundleKey] = bundlesCopy[i];
													}
												}
											}
										}
									}
								}
							}
						}
						
						return bndls;
					},
								isVariantBundle: function(bundle) {
					if (typeof bundle.product_level !== 'undefined' && bundle.product_level == 'variant') {
						return true;
					}
					
					return false;
				},
				getBundleById: function(bundleId) {
					// Finds bundle in bundles
					for (var i = 0; i<bundles.length; i++) {
						if (typeof bundles[i].id !== 'undefined' && bundles[i].id == bundleId) {
							return bundles[i];
						}
					}
					
					return false;
				},
				processBundlesWithRetrievedProducts: function() {
					// bundlerConsole.log('ProductRetrievalRequests', JSON.parse(JSON.stringify(ProductRetrievalRequests)));
					// bundlerConsole.log('ProductRetrievalStatus', 	JSON.parse(JSON.stringify(ProductRetrievalStatus)));
					
					// Loop through bundles and check if every required product was successfully retrieved
					for(var bundleId in ProductRetrievalRequests) {
						if (ProductRetrievalRequests.hasOwnProperty(bundleId)) {

							var allBundleProductsWereRetrieved = true;
							
							for (var handle in ProductRetrievalRequests[bundleId].products) {
								if (ProductRetrievalRequests[bundleId].products.hasOwnProperty(handle)) {
									// Check if the product was already retrieved
									if (ProductRetrievalRequests[bundleId].products[handle] !== 'retrieved') {
										allBundleProductsWereRetrieved = false;
									}
								}
							}

							if (allBundleProductsWereRetrieved) {								
								// All products were retrieved, so we can set up the libraries for this bundle and execute the callback
								Tools.Products.setLibraries(Library, bundleId);

								//ProductRetrievalRequests[bundleId].callback();
																
								for(var i = 0; i < ProductRetrievalRequests[bundleId].callback.length; i++) {
									setTimeout(ProductRetrievalRequests[bundleId].callback[i], 1);
								}

								delete ProductRetrievalRequests[bundleId];
							}
						}
					}
					
				},
				handleProductRetrievalError: function(handle) {
					// Display error message for the bundles which were waiting for this product's data
					// FIND EACH BUNDLE WHICH REQUESTED THIS PRODUCT'S DATA		
					for(var bundleId in ProductRetrievalRequests) {

						if (ProductRetrievalRequests.hasOwnProperty(bundleId)) {
							
							if (typeof ProductRetrievalRequests[bundleId].products[handle] !== 'undefined') {
								// This bundle was waiting for this product
								if (typeof ProductRetrievalStatus[handle].error !== 'undefined') {
									errorHandler.displayError(ProductRetrievalStatus[handle].error, bundleId);
								}
							}
						}
					}

				},
				// forHandle parameter is optional. It is used when retrieving product data through JSON type, because the original handle does not exist anymore (the merchant changed it in admin).
				markProductAsRetrieved: function(productData, forHandle) {
					if (typeof productData.product !== 'undefined' && typeof productData.id === 'undefined') {
						productData = productData.product;
					}
					
					if (typeof forHandle !== 'undefined') {
						var handle = forHandle;
					} else {
						var handle = productData.handle;
					}
					
					ProductRetrievalStatus[handle].retrieved 	= true;
					ProductRetrievalStatus[handle].product_id 	= productData.id;
					ProductRetrievalStatus[handle].data 		= productData
				},
				setProductLibrariesForBundlesInQueue: function(forHandle) {
					// After the product is retrieved from JSON endpoint, this method will set the libraries for all bundles which were waiting for the retrieval request to be completed
					// This also has to be fired if we want to display the bundle after the products were already retrieved.
					// This method marks the product for bundles in queue (ProductRetrievalRequests[bundleId].products[handle]) as retrieved and sets the necessary libraries which the app needs
					// forHandle parameter is required for products which had the handle changed (the merchant changed it and we retrieved the data via the redirect)
					
					var handle = forHandle;
					if (typeof ProductRetrievalStatus[handle] !== 'undefined' && ProductRetrievalStatus[handle].retrieved === true) {
						var productData = ProductRetrievalStatus[handle].data;
					
						
						// SET PRODUCT LIBRARY FOR EVERY PRODUCT IN THE BUNDLE					
						for(var bundleId in ProductRetrievalRequests) {
							// Each retrieval request has bundle data, products which it wants and a callback
							if (ProductRetrievalRequests.hasOwnProperty(bundleId)) {
								
								if (typeof ProductRetrievalRequests[bundleId].products[handle] !== 'undefined' && ProductRetrievalRequests[bundleId].products[handle] != 'retrieved') {
									// Product for this bundle was retrieved
									
									// DISCOUNTED PRODUCTS
									// Set the product data in the library for the products in this bundle
									for (var key in ProductRetrievalRequests[bundleId].bundle.products) {
										if (ProductRetrievalRequests[bundleId].bundle.products.hasOwnProperty(key)) {
											
											var bndlrProduct = ProductRetrievalRequests[bundleId].bundle.products[key];

											if (bndlrProduct.handle === handle) {

												if (Library.Products.isEmpty(bndlrProduct.id)) {
													// Save product to library only if the current value is empty
												
													// This product was waiting for our data
													// Set it in library
													if (ProductRetrievalRequests[bundleId].bundle.product_level == 'variant') {
														// Variant level bundle
														var remappedData = bndlr.remapProductData(JSON.parse(JSON.stringify(productData)), bndlrProduct.id);
													} else {
														// Product level bundle
														var remappedData = bndlr.remapProductData(JSON.parse(JSON.stringify(productData)));
													}

													//bundlerConsole.log('setting product data in library', handle);
													// Set the remapped data to products library
													Library.Products.set(bndlrProduct.id, remappedData);
												}
											}
										}
									}
									
									// REQUIRED PRODUCTS
									// Set the required product data in the library for the required products in this bundle
									if (ProductRetrievalRequests[bundleId].bundle.minimum_requirements === 'specific_products') {
										for (var key in ProductRetrievalRequests[bundleId].bundle.required_products) {
											if (ProductRetrievalRequests[bundleId].bundle.required_products.hasOwnProperty(key)) {
												
												var bndlrProduct = ProductRetrievalRequests[bundleId].bundle.required_products[key];

												if (bndlrProduct.handle === handle) {

													if (Library.Products.isEmpty(bndlrProduct.id)) {
														// Save product to library only if the current value is empty
													
														// This product was waiting for our data
														// Set it in library
														if (ProductRetrievalRequests[bundleId].bundle.product_level == 'variant') {
															// Variant level bundle
															var remappedData = bndlr.remapProductData(JSON.parse(JSON.stringify(productData)), bndlrProduct.id);
														} else {
															// Product level bundle
															var remappedData = bndlr.remapProductData(JSON.parse(JSON.stringify(productData)));
														}

														// Set the remapped data to products library
														Library.Products.set(bndlrProduct.id, remappedData);
													}
												}
											}
										}
									}
									
									// Mark the product as retrieved for this bundle request
									ProductRetrievalRequests[bundleId].products[handle] = 'retrieved';
								}
							}
						}
					}
				},
				setVariantProductData: function(productData) {
					// Loop through variants and set them as separate products in the library
					if (typeof productData.variants !== 'undefined') {
						
						for(var i=0; i< productData.variants.length; i++) {
							var variantProductData = bndlr.remapProductData(JSON.parse(JSON.stringify(productData)), productData.variants[i].id);
							Library.Products.set(variantProductData.id, variantProductData);
						}
					}
				},
				getProducts: function(bundle, callback) {
					// Gets product data and fires callback after all data is retrieved

					var products = {};
					var totalProducts = 0;
					var processedProducts = 0;
					var strippedProducts = JSON.parse(JSON.stringify(bundle.products));
					
					Library.DiscountedProducts.set(bundle.id, bundle.products);
					
					if (bundle.minimum_requirements === 'specific_products') {
						// Merge bundle products with required products so we can get info for all of these products
						// strippedProducts = Object.assign({}, strippedProducts, bundle.required_products);
						
						Library.RequiredProducts.set(bundle.id, bundle.required_products);
						
						var requiredProducts = JSON.parse(JSON.stringify(bundle.required_products));				
						
						Object.keys(requiredProducts).forEach(function(key) { 
							strippedProducts[key] = requiredProducts[key]; 
						});
					}
	
	
					if (typeof ProductRetrievalRequests[bundle.id] === 'undefined') {
						ProductRetrievalRequests[bundle.id] = {
							products: 	{},
							callback: 	[callback],
							bundle:		bundle
						};
					} else {
						ProductRetrievalRequests[bundle.id].callback.push(callback);
					}
					// Set product retrieval requests for this bundle
					for (var productId in strippedProducts) {
						if (strippedProducts.hasOwnProperty(productId)) {
							var handle = strippedProducts[productId].handle;
							if (typeof ProductRetrievalRequests[bundle.id].products[handle] === 'undefined') {
								ProductRetrievalRequests[bundle.id].products[handle] = 'retrieving';
							}
						}
					}
					
					// bundlerConsole.log(JSON.parse(JSON.stringify(ProductRetrievalRequests)));
					// bundlerConsole.log(JSON.parse(JSON.stringify(ProductRetrievalStatus)));

					// Process product retrieval requests
					for(var bundleId in ProductRetrievalRequests) {
						if (ProductRetrievalRequests.hasOwnProperty(bundleId)) {
							for (var productHandle in ProductRetrievalRequests[bundleId].products) {
								if (typeof ProductRetrievalStatus[productHandle] === 'undefined') {									
									// Product was never retrieved
									// Retrieve product
									
									ProductRetrievalStatus[productHandle] = {
										retrieved: false
									};
									
									cart.getProductData(nav.getRootUrl(), productHandle).done((function() {
											return function(productData) {
												// Product was successfully retrieved
												// Set the product data in Products Library
												// Mark product as retrieved
												bndlr.markProductAsRetrieved(productData);
												
												bndlr.setProductLibrariesForBundlesInQueue(productData.handle);
												bndlr.processBundlesWithRetrievedProducts();
											}
										})()).fail((function() {
											var handle = productHandle;
											return function(jqXHR) {

												if (jqXHR.status == 404) {
													// Initial request failed with 404.
													// Request data by content type
													cart.getProductDataJSON(nav.getRootUrl(), handle).done(function(productData) {
														if (typeof productData.product !== 'undefined') {
															bndlr.markProductAsRetrieved(productData, handle);
															bndlr.setProductLibrariesForBundlesInQueue(handle);
															bndlr.processBundlesWithRetrievedProducts();
														} else {
															var errorMessage = 'Bundler: Can\'t get product data: ' + nav.getRootUrl() + 'products/' + handle +'.<br />To show the bundle widget, just make sure that the product is active in your online shop.';
															console.warn(errorMessage);
															ProductRetrievalStatus[handle]['error'] = errorMessage;
															bndlr.handleProductRetrievalError(handle);
														}
														
													}).fail(function() {
														var errorMessage = 'Bundler: Can\'t get product data: ' + nav.getRootUrl() + 'products/' + handle +'.<br />To show the bundle widget, just make sure that the product is active in your online shop.';
														console.warn(errorMessage);
														ProductRetrievalStatus[handle]['error'] = errorMessage;
														bndlr.handleProductRetrievalError(handle);
														// errorHandler.displayError(errorMessage, bundleId);
													});
												}			
											}
										}
									)());
									
								} else if (ProductRetrievalStatus[productHandle].retrieved === true) {									
									// Product was already retrieved
									// Mark the product in this bundle as retrieved. This is crucial when we want to switch the displayed bundle when the customer selects a different variant.
									// If we don't mark the product as retrieved for this bundle request, then the bundle won't get displayed ;)
									
									// Mark the product in this bundle inqueue as retrieved and set the necessary libraries
									bndlr.setProductLibrariesForBundlesInQueue(productHandle);
									// Process all retrieved products
									bndlr.processBundlesWithRetrievedProducts();
									
								}  else if (ProductRetrievalStatus[productHandle].retrieved === false) {
									// Product is being retrieved
									// Wait
								} 
							}
						}
					}
				},
				productHtmlSelectors: [
																																																																						'#bundler-target-element', // Custom target element
					'.bundler-target-element', // Custom target element by class
					'.bundler-target-only-visible-element', 
					'div.product-template[itemtype="http://schema.org/Product"] .product__content.page-width',
					'#ProductSection-product-template .product.grid',
					'#ProductSection-product-template section[itemtype="http://schema.org/Product"]',
					'#__pf [data-pf-type="Layout"] [data-pf-type="Column"] [data-pf-type="ProductBox"]', // weird theme Exgym-home1, yoursafeathlete-unequal
					'#MainContent #shopify-section-product-template #ProductSection-product-template,product-template__container.page-width', // Resolves the issue where the bundle isn't centered on mobile devices in Debut theme
					'#ProductSection-product-template .product-single.grid',
					'#ProductSection-product-template',
					'.product-main .box_product_page .product-essential',
					'#ProductSection .product-single',
					'div#section-product.product--section[itemtype="//schema.org/Product"] .box__product-content.site-box .site-box-content', //utilitario-mexicano
					'div[itemtype="http://schema.org/Product"] #layoutmaincontent',
					'#shopify-section-product-template #section-product-template .product-single .wrapper .product-details .product-single__meta div[itemprop="offers"][itemtype="http://schema.org/Offer"]',
					'#shopify-section-product-template [data-section-id="product-template"] .product-block-list .product-block-list__item--info form.product-form',
					'#shopify-section-product-template .product-section .page-content .page-width',
					'div[itemtype="http://schema.org/Product"]',
					'div[itemtype="//schema.org/Product"]',
					'div[itemtype="http://data-vocabulary.org/Product"] .product_section',
					'#shopify-section-product-template .main_content_area .product_section[itemtype="http://schema.org/Product"]',
					'#ProductSection-product-template-default .product-default .product_top .product-shop',
					'#ProductSection-product-template-default .product_bottom',
					'#shopify-section-single-product-tab',
					'#shopify-section-product-template .sixteen.columns [class|="product"] [itemtype="http://schema.org/Product"]',
					'#shopify-section-product-template div[class^="product-"] div[itemtype="http://schema.org/Product"].product_section',
					'#shopify-section-product-template .product-template .product-right .shopify-product-form',
					'#shopify-section-product-template .section-product .product-single',
					'#shopify-section-product-template.shopify-section--product-template div.one-whole.column[class*="product-"]',
					'#shopify-section-product-template div.product_section.is-flex',
					'#shopify-section-product-template div.product_section',
					'#shopify-section-product-template div.product-section:first',
					'#shopify-section-product-template',
					'section.grid-hold.product.content',
					'#shopify-section-product [data-section-id="product"] .pro_main_c > div.row',
					'#PageContainer main > div[itemtype="http://schema.org/Product"]',
					'#shopify-section-static-product .product--container article.product--outer',
					'#shopify-section-static-product article.product--outer',
					'#shopify-section-product-detail-main [data-section-id="product-detail-main"]',
					'article[itemtype="http://schema.org/Product"]',
					'#ProductSection-product .product-page .product-single',
					'div[itemtype="http://schema.org/Product"] .ten.columns.omega',
					'#shopify-section-static-product.shopify-section.section-product',
					'div[class^="product-"] div[itemtype="http://schema.org/Product"].product_section',
					'.template-product .shg-product:first',
					'div#product-details[itemtype="http://schema.org/Product"]',
					'div#product_page_content[itemtype="http://schema.org/Product"]',
					'.product-template-section .product_section',
					'#shopify-section-product-template-control div[itemtype="http://schema.org/Product"]:first',
					'#MainContent .module-wrap[data-label="Product"][data-status="dynamic"]',
					'section[itemtype="http://schema.org/Product"]',
					'.template-product .gryffeditor .module-wrap[data-label="Product"]:first',
					'article#single-product .product__right',
					'#PageContainer #shopify-section-product-template-alt',
					'#shopify-section-product .product--template[data-section-id="product"][data-section-type="product"][data-product-template]',
					'div[data-section-type="product"]',
					'#ProductSection-product .product-page .product-single:not(.product-single--medium-image)',
					'#template-product .product_section .product__information',
					'div[class*="product-"][itemtype="http://schema.org/Product"]',
					'#shopify-section-product .product-container .product-details-wrapper .product-message',
					'#jas-content .product > .jas-row',
					'.product #shopify-section-product-page-description',
					'.product .product-infors .theiaStickySidebar',
					'#MainContent section[keyword="product"] .gt_container',
					'div[data-type="product"] .lh-product-single .lh-details-product',
					'#shopify-section-static-product .module-wrapper .module-product .product-wrap .product-tabs',
					'.template-product .product-tabs .product-tabs-body #product-tab-description',
					'#shopify-section-product-page article#section-product-page .product-content',
					'.product-template.product-details-section .section.product_section',
					'#PageContainer .product-template .section-description',
					'#shopify-section-product.shopify-section.section--products',
					'#shopify-section-product-template .product .page__content-wrapper',
					'#shopify-section-product-sections-template .product-section .page-content .page-width .product-single__description-full',
					'#shopify-section-bbar-product-template #product-view',
					'#shopify-section-template--product',
					'div[data-section-type="product-page"] .product-page__main',
					'.shopify-section .product-section .page-content',
					'.site-box-container.product--section .box__product-content .site-box-content',
					'#shopify-section-product--static .product-form-product--static',
					'#shopify-section-product--static',
					'#shopify-section-product-description-bottom-template .product_form form.shopify-product-form',
					'#shopify-section-template-product #template-product .container--product',
					'#shopify-section-module-product [data-section-id="module-product"]',
					'#shopify-section-product #content .pro_main_c > .row:first',
					'#shopify-section-product-sections-template .page-content .page-width .product-single__meta',
					'#shopify-section-product-template > div[class^="product-"]',
					'.product-page--right-column--container .product-form--root form.product-form--container',
					'.product .product__info-container',
					'#shopify-section-product-template-new'
				],
				productHtmlSelectorsActions: {
					// Warning: using the after selector can cause the app to show the bundles in a reverse order on product pages!
					'#ProductSection-product-template-default .product-default .related-products'													: 'before',
					'#shopify-section-product .product-container .product-details-wrapper .product-message'											: 'before',
					'#shopify-section-product-template .product-template .product-right .shopify-product-form'										: 'after',
					'#shopify-section-product-template [data-section-id="product-template"] .product-block-list .product-block-list__item--info form.product-form'	: 'after',
					'#shopify-section-static-product .module-wrapper .module-product .product-wrap .product-tabs'									: 'after',
					'#PageContainer .product-template .section-description'																			: 'after',
					'#shopify-section-product.shopify-section.section--products'																	: 'after',
					'#shopify-section-product-sections-template .product-section .page-content .page-width .product-single__description-full'		: 'before',
					'#shopify-section-bbar-product-template #product-view'																			: 'after',
					'#shopify-section-product--static .product-form-product--static'																: 'after',
					'#shopify-section-static-product .product--container article.product--outer'													: 'after',
					'#shopify-section-product .product--template[data-section-id="product"][data-section-type="product"][data-product-template]'	: 'after',
					'#shopify-section-product-description-bottom-template .product_form form.shopify-product-form'									: 'after',
					'#shopify-section-module-product [data-section-id="module-product"]'															: 'after',
					'#shopify-section-product #content .pro_main_c > .row:first'																	: 'after',
					'#shopify-section-product-template div.product_section.is-flex'																	: 'after',
					'.product-page--right-column--container .product-form--root form.product-form--container'										: 'after'
				},
				discountedBundleProducts: {},
				activeBundle: {},
				objectToArray: function(object) {
					var array = [];
					var order = [];
					for (var property in object) {
						if (object.hasOwnProperty(property)) {
							if (object[property].hasOwnProperty('sequence')) {
								var sequence = object[property]['sequence'];
								if (typeof order[sequence] === 'undefined') {
									order[sequence] = object[property];
								} else {
									order.push(object[property]);
								}
							}
						}
					}

					if (order.length > 0) {
						for(var i = 0; i<order.length; i++) {
							if (typeof order[i] !== 'undefined') {
								array.push(order[i]);
							}
						}
					} else {
						for (var property in object) {
							if (object.hasOwnProperty(property)) {
								array.push(object[property]);
							}
						}
					}
					return array;
				},
				// Flag which is switched to false if one of the products isn't in stock or the variants are misconfigured.
				widgetCanBeDisplayed: true,
				renderedBundles: {}, // contains a list of bundle keys which are already rendered
				setObserver: function(bundle, keySelector, customCallback) {
					// Set intersection observer
											if (typeof customCallback !== 'function') {
							this.displayBundle(bundle, keySelector);
						} else {
							customCallback();
						}
									},
				displayBundle: function(bundle, keySelector) {
					// Could cause problems in popups or is the same bundle is more than once in the same page. We should also pass the selector to the function, so we don't modify other widgets of the same bundle on the page ;)

					this.widgetCanBeDisplayed = true;
					
					// Displays bundle on product page
					var bundleKey = utils.getRandomString();

					// Recalculate discounted product prices and save the new values to the lib
					var discountedProducts = Library.DiscountedProducts.get(bundle.id);
					discountedProducts = this.modifyProductsPrices(bundle, discountedProducts);
					Library.DiscountedProducts.set(bundle.id, discountedProducts);
					
					// Set linePrice and compareAtPrice for requiredProducts
					Tools.Products.setRequiredVariantLinePrices(Library, bundle);
					
					var requiredProducts 	= Library.RequiredProducts.get(bundle.id);
					var allProducts 		= Library.Products.get();

					var orderedProducts = this.objectToArray(bundle.products);
					
					var bundleRequiredProducts = [];
					if (bundle.minimum_requirements == 'specific_products') {
						bundleRequiredProducts = this.objectToArray(bundle.required_products);
					}
					
					var bundleName = bundle.name.replace('"', '').replace(/<[^>]*>?/gm, '');
					
					var canDisplayBundle = true;
					
					var hideProductsIfImageIsSet = true;
										
					
					if (bundle.mix_and_match_display === 'true' && bundle.minimum_requirements === 'n_products') {
						
						try {
							var bundleHtml = ''+
								'<div id="_bndl_'+bundleKey+'" class="bndlr-container bndlr-mixnmatch" data-bndlr-key="'+bundleKey+'" data-bundle-name="'+ bundleName +'">' + 
									'<div class="bndlr-products-container">';
										bundleHtml += widgetView.getBundleTitle(bundle.title, bundle.name, bundle.id);
										bundleHtml += '<div class="bndlr-bundle-description">' + bundle.description + '</div>';
										
										bundleHtml += '<div class="bndlr-inner-products-container">';
											
											if (bundle.product_level == 'variant' && bundle.bundle_image !== '') {
												// Show custom bundle image
												bundleHtml += widgetView.getBundleImage(bundle.bundle_image, bundle.title, bundle.name, bundle.id);
											}
											
											bundleHtml += '<div class="bndlr-mnm-available-products">';

												for (var p = 0; p < orderedProducts.length; p++) {
													var productId = orderedProducts[p].id;
													if (typeof discountedProducts[productId] !== 'undefined') {

														var isRequired = (orderedProducts[p].required === 1 ? true: false);
														var productHtml = this.getMixAndMatchProductHtml(discountedProducts[productId], bundle, isRequired);
														
														bundleHtml += productHtml;
													}
												}
												
											bundleHtml += '</div>';
											
											bundleHtml += '<div class="bndlr-mnm-second-container">';
											
												bundleHtml += '<div class="bndlr-mnm-selected-products-title bndlr-hidden bndlr-toggle">';
													bundleHtml += 'Your bundle:';
												bundleHtml += '</div>';
											
												bundleHtml += '<div class="bndlr-mnm-selected-products bndlr-hidden bndlr-toggle">';
												bundleHtml += '</div>';
												
												bundleHtml += '<div class="bndlr-mnm-add-to-cart-wrapper">';
													bundleHtml += '<span class="bndlr-mnm-instructions-text">';
														bundleHtml += this.MixNMatch.getInstructionsText(bundle, 0, true);
													bundleHtml += '</span>';
													
																										
													if (bundle.total_price_text !== '') {
														bundleHtml += '<div class="bndlr-mnm-total-price bndlr-hidden"></div>';
													}
													
													var addToCartButtonText = bundle.button_text;										
													bundleHtml += '<div class="bndlr-add-bundle-to-cart bndlr-hidden" title="'+addToCartButtonText.replace('"', '')+'" data-active="'+this.widgetCanBeDisplayed.toString()+'" tabindex="0" role="button">' + addToCartButtonText + '</div>';
													bundleHtml += '<div class="bndlr-bundle-checkout-warning bndlr-hidden">'+ bundle.discount_warning +'</div>';
													
												bundleHtml += '</div>';
											
											bundleHtml += '</div>';
										bundleHtml += '</div>';
									bundleHtml += '</div>';
								bundleHtml += '</div>';
							
							var htmlSelector = '.bundler-target-element[data-bundle="'+bundle.id+'"]';
							
															if (typeof window.BndlrIsBundleLandingPage !== 'undefined' && window.BndlrIsBundleLandingPage === true) {
									// We are on a bundle landing page
									// Add bundle status box
									var bundleStatusBox = '<div id="bndlr-mnm-status-box" class="bndlr-visibility-visible" data-bndlr-bundle-key="'+bundleKey+'">'+
										'<div class="bdnlr-mnm-status-box-products-container">' +
										'</div>' +
										'<div class="bdnlr-mnm-status-box-info-container">' +
											'<span class="bndlr-mnm-instructions-text">' +
												this.MixNMatch.getInstructionsText(bundle, 0, true) +
											'</span>' +
											'<div class="bndlr-status-box-add-to-cart bndlr-hidden" title="'+addToCartButtonText.replace('"', '')+'" data-active="'+this.widgetCanBeDisplayed.toString()+'" tabindex="0" role="button">' + addToCartButtonText + '</div>';
										'</div>' +
									'</div>';
									$('body').append(bundleStatusBox);
									this.MixNMatch.showHideStatusBox();
								}
													
						} catch(e) {
							bundlerConsole.log(e);
							canDisplayBundle = false;
						}
						
					} else {
					
						try {
							var bundleHtml = ''+
								'<div id="_bndl_'+bundleKey+'" class="bndlr-container" data-bndlr-key="'+bundleKey+'" data-bundle-name="'+ bundleName +'">' + 
									'<div class="bndlr-products-container">';
										bundleHtml += widgetView.getBundleTitle(bundle.title, bundle.name, bundle.id);
										bundleHtml += '<div class="bndlr-bundle-description">' + bundle.description + '</div>';
										
										bundleHtml += '<div class="bndlr-inner-products-container">';
											
											if (bundle.product_level == 'variant' && bundle.bundle_image !== '') {
												// Show custom bundle image
												bundleHtml += widgetView.getBundleImage(bundle.bundle_image, bundle.title, bundle.name, bundle.id);
											}
											
											var style = ''
											if (bundle.product_level == 'variant' && bundle.bundle_image !== '' && hideProductsIfImageIsSet) {
												// Hide products because we will show custom bundle image
												style='display:none;';
											}

											bundleHtml += '<div style="'+style+'">';

												for (var p = 0; p < bundleRequiredProducts.length; p++) {
													var productId = bundleRequiredProducts[p].id;
													if (typeof requiredProducts[productId] !== 'undefined') {

														var productHtml = this.getProductHtml(requiredProducts[productId], bundle, true);
														
														bundleHtml += productHtml;
													}
												}
											
												for (var p = 0; p < orderedProducts.length; p++) {
													var productId = orderedProducts[p].id;
													if (typeof discountedProducts[productId] !== 'undefined') {

														var productHtml = this.getProductHtml(discountedProducts[productId], bundle);
														
														bundleHtml += productHtml;
													}
												}
												
											bundleHtml += '</div>';

											

											if (bundle.product_level == 'variant' && bundle.bundle_image !== '' && bundle.list_product_names === 'true' && hideProductsIfImageIsSet) {
												// Add list of product names
												bundleHtml += '<div class="bndlr-product-names-list">';
												
													var listSeparator = ', ';
																									
													// Get required and bundle products and show their names!
													for (var p = 0; p < orderedProducts.length; p++) {
														var productId = orderedProducts[p].id;
														if (typeof discountedProducts[productId] !== 'undefined') {

															var productHtml = this.getProductListName(discountedProducts[productId], bundle, false, bundleKey);
															
															bundleHtml += productHtml + listSeparator;
														}
													}
													
													for (var p = 0; p < bundleRequiredProducts.length; p++) {
														var productId = bundleRequiredProducts[p].id;
														if (typeof requiredProducts[productId] !== 'undefined') {

															var productHtml = this.getProductListName(requiredProducts[productId], bundle, true, bundleKey);

															bundleHtml += productHtml + listSeparator;
														}
													}
													
													// Strip last comma
													bundleHtml = bundleHtml.replace(/,\s*$/, '').replace(/,<br \/>$/, '');

												bundleHtml += '</div>';
											}

																						
											
											if (bundle.total_price_text !== '') {
												bundleHtml += '<div class="bndlr-total-price">' + this.getTotalPriceText(bundle, bundleKey) + '</div>';
												
												
												
																							}
											
											var addToCartButtonText = bundle.button_text;
																							if (this.widgetCanBeDisplayed === false) {
													addToCartButtonText = 'Out of stock';
												}
																						
																							bundleHtml += '<div class="bndlr-add-to-cart" title="'+addToCartButtonText.replace('"', '')+'" data-active="'+this.widgetCanBeDisplayed.toString()+'" tabindex="0" role="button">' + addToCartButtonText + '</div>';
																						
											
											
											
										bundleHtml += '</div>';
							
										
										bundleHtml += '<div class="bndlr-bundle-checkout-warning">'+ bundle.discount_warning +'</div>';
							
									bundleHtml += '</div>';
								bundleHtml += '</div>';
							
							var htmlSelector = '.bundler-target-element[data-bundle="'+bundle.id+'"]';
						
						} catch(e) {
							bundlerConsole.log(e);
							canDisplayBundle = false;
						}
					
					}
					
					if (canDisplayBundle === false) {
						bundlerConsole.log('Skipping bundle', bundle.name);
						return true;
					}
					
					if (typeof keySelector === 'string') {
						$element = $(keySelector);
					} else {
						$element = $(htmlSelector);
					}
					
										
					if ($element.length > 0) {
						
						var $bundle = $(bundleHtml);
													if (this.widgetCanBeDisplayed === false) {
								$bundle.attr('data-available', 'false');
							}
												
						var $addtcButton = $bundle.find('.bndlr-add-to-cart');
						$addtcButton.off('click');
						$addtcButton.click(function(e) {
							bndlr.addToCart($(this));
							e.stopPropagation();
						});
						
						$element.html($bundle);
						bndlr.renderedBundles[bundleKey] = true;
						
						// Calculate the perfect product width
													this.setProductWidth(htmlSelector, $element);
											}					
					
					idleCallback(function() {
						/*
						if (bndlr.repositionPlusSignsTimeout != false) {
							clearTimeout(bndlr.repositionPlusSignsTimeout);
						}
						var self = this;
						bndlr.repositionPlusSignsTimeout = setTimeout(function() {
							self.repositionPlusSigns('#_bndl_'+bundleKey);
						}, 200);*/
						var self = this;
						debounce('reposition-plus-signs', function() {
							self.repositionPlusSigns('#_bndl_'+bundleKey, $bundle);
						}, 200);
						
						$(document).trigger('bundler_bundle_widget_created');
					
						try {
							var event = new CustomEvent("bundler:bundle_widget_created", {
								detail: {
									products: JSON.parse(JSON.stringify(allProducts))
								}
							});
							document.dispatchEvent(event);
						} catch(e) {
							bundlerConsole.log(e);
						}
						
					}.bind(bndlr));
					
					
					
					// Select the preselected products
					/*
					if (bundle.mix_and_match_display === 'true' && bundle.minimum_requirements === 'n_products') {
						bndlr.MixNMatch.addPreselectedProductsToBundle($(htmlSelector));
					}*/
				},
				repositionPlusSignsTimeout: false,
				repositionPlusSigns: function(selector, $element) {
					// reposition plus signs id the total height of elements is the same as height of their's container element
					if (typeof $element !== 'undefined') {
						if ($element.length > 0) {
							this.repositionPlusSign($element);
							this.repositionPlusSignForMixNMatch($element);
						}
					} else if (typeof selector !== 'undefined') {
						var el = $(selector);
						if (el.length > 0) {
							this.repositionPlusSign(el);
							this.repositionPlusSignForMixNMatch(el);
						}
						
					} else {
						$('.bundler-target-element .bndlr-container').each(function(key, el) {
							bndlr.repositionPlusSign($(el));
						});
						
						// Check the selected products for mix&match bundles
						$('.bundler-target-element .bndlr-mnm-selected-products').each(function(key, el) {
							bndlr.repositionPlusSignForMixNMatch($(el));
						});
					}					
				},
				repositionPlusSign: function($el) {
					
					if ($el.hasClass('bndlr-mixnmatch') || $el.find('.bndlr-mixnmatch').length) {
						// This is a mix&match bundle widget
						// Skip it.
						return true;
					}
					var totalHeight = 0;
					$el.find('.bndlr-product').each(function(key, el) {
						totalHeight += $(el).outerHeight(true);
					});
					
					if (Math.floor(totalHeight) == Math.floor($el.find('.bndlr-inner-products-container div').first().height())) {
						$el.find('.bndlr-inner-products-container').addClass('bndlr-break-plus-signs');
					} else {
						$el.find('.bndlr-inner-products-container').removeClass('bndlr-break-plus-signs');
					}
				},
				repositionPlusSignForMixNMatch: function($el) {
					var totalHeight = 0;
					$el.find('.bndlr-product').each(function(key, el) {
						totalHeight += $el.outerHeight(true);
					});

					if (Math.floor(totalHeight) == Math.floor($el.height())) {
						$el.closest('.bndlr-inner-products-container').addClass('bndlr-break-plus-signs');
					} else {
						$el.closest('.bndlr-inner-products-container').removeClass('bndlr-break-plus-signs');
					}
				},
				setProductWidth: function(bundleSelector, $element) {
					
											"undefined"==typeof $element&&($element=$(bundleSelector));var boundingClientWidth=$element[0].getBoundingClientRect().width,paddingValue=14,isInPopup=!1;if(0<$element.closest(".bundles-bundler-hop-full-page-overlay").length&&(400>$("body")[0].getBoundingClientRect().width&&(boundingClientWidth=.9*$("body")[0].getBoundingClientRect().width-18,isInPopup=!0),paddingValue=0),0<boundingClientWidth){boundingClientWidth-=paddingValue;var productsNum=$(bundleSelector+" .bndlr-product").length;if(2<=productsNum){if("undefined"!=typeof window.BndlrIsBundleLandingPage&&window.BndlrIsBundleLandingPage){var productWidth=340;"undefined"!=typeof clientSpecifics.product_dimensions&&(productWidth=clientSpecifics.product_dimensions.getLadingPageWidth()+10)}else{var productWidth=240;"undefined"!=typeof clientSpecifics.product_dimensions&&(productWidth=clientSpecifics.product_dimensions.getStandardWidth()+10)}var minProducts=2,minProductWidth=140;if(550>=boundingClientWidth&&(minProductWidth=120),isInPopup&&(minProductWidth=70),minProducts=6<productsNum?6:productsNum,productWidth*minProducts>boundingClientWidth){var perfectWidth=boundingClientWidth/minProducts-10,$products=$element.find(".bndlr-product");if(perfectWidth>minProductWidth&&perfectWidth<productWidth)$products.css({"max-width":Math.floor(perfectWidth)});else{var widthFound=!1;0==minProducts%2&&(perfectWidth=boundingClientWidth/2-10,perfectWidth>minProductWidth&&220>perfectWidth&&($products.css({"max-width":Math.floor(perfectWidth)}),widthFound=!0));for(var currentProductsNum=minProducts-1;!1==widthFound&&1<=currentProductsNum;)perfectWidth=boundingClientWidth/currentProductsNum-10,perfectWidth>minProductWidth&&perfectWidth<productWidth?($products.css({"max-width":Math.floor(perfectWidth)}),widthFound=!0):currentProductsNum--;!1==widthFound&&$products.css({"max-width":Math.floor(minProductWidth-10)})}}}}
															},
				// Calculates total price and replaces total price text with old and new price
				getTotalPriceText: function(bundle, bundleKey) {
					// calculate total price
					// calculate discounted price
					// replace text with prices
					// update this text on variant select change
					var pricesHtmls = this.getPricesHtmls(bundle, bundleKey);
					
					var modifiedText 	= bundle.total_price_text.replace('{original_price}', pricesHtmls.original_price_html);
					modifiedText 		= modifiedText.replace('{discounted_price}', pricesHtmls.discounted_price_html);
					modifiedText 		= modifiedText.replace('{savings}', pricesHtmls.savings_html);

					return modifiedText;
				},
				// Calculates total price and replaces total price text with old and new price
				getMixNMatchTotalPriceText: function(bundle, products) {
					var pricesHtmls = this.getPricesHtmls(null, null, products);
					
					var modifiedText 	= bundle.total_price_text.replace('{original_price}', pricesHtmls.original_price_html);
					modifiedText 		= modifiedText.replace('{discounted_price}', pricesHtmls.discounted_price_html);
					modifiedText 		= modifiedText.replace('{savings}', pricesHtmls.savings_html);

					return modifiedText;
				},
				// Replaces placeholders {discounter_price}, {original_price}, {savings} with actual values from the bundle
				replacePricePlaceholders: function(string, bundle, bundleKey) {
					var pricesHtmls = this.getPricesHtmls(bundle, bundleKey);
					
					var modifiedText 	= string.replace('{original_price}', pricesHtmls.original_price_html);
					modifiedText 		= modifiedText.replace('{discounted_price}', pricesHtmls.discounted_price_html);
					modifiedText 		= modifiedText.replace('{savings}', pricesHtmls.savings_html);

					return modifiedText;
				},
				getPricesHtmls: function(bundle, bundleKey, products) {
					// Returns all total prices html
					// If you set the third parameter (products), then it will calculate prices just based on the values in this object

					var originalPrice = 0;
					var discountedPrice = 0;
					
					if (typeof products === 'undefined') {
						// Normal bundles
						var bundleId = bundle.id;
						
						var discountedProducts = Library.DiscountedProducts.get(bundleId);

						for(var productId in discountedProducts) {
							if (discountedProducts.hasOwnProperty(productId)) {
								var product = discountedProducts[productId];
								discountedPrice += this.getSelectedVariantPrice(product, bundleKey, bundleId);
								originalPrice 	+= this.getSelectedVariantOldPrice(product, bundleKey, bundleId);
							}
						}
						
						var requiredProducts = Library.RequiredProducts.get(bundleId);
						
						for(var productId in requiredProducts) {
							if (requiredProducts.hasOwnProperty(productId)) {
								var product = requiredProducts[productId];
								var price = this.getSelectedVariantOldPrice(product, bundleKey, bundleId, true);
								discountedPrice += price;
								originalPrice += price;
							}
						}
					} else {
						// For mix and match bundles
						for(var key in products) {
							if (products.hasOwnProperty(key)) {
								var dPrice = 0;
								var oPrice = 0;
								
								var productVariant = products[key].variants[0];
								
								oPrice = this.getVariantOldPrice(productVariant);
								dPrice = this.getVariantDiscountedPrice(productVariant);
								
								discountedPrice += dPrice;
								originalPrice 	+= oPrice;
							}
						}
					}

					var savings = originalPrice - discountedPrice;
					if (savings < 0) {
						savings = 0;
					}
					
					var currency = this.getDefaultCurrency();
					
					var originalPriceHtml = this.formatPrice(originalPrice);
					originalPriceHtml = htmlUtils.moneySpan(originalPriceHtml, currency.toLowerCase(), 'bndlr-old-price', '', originalPrice);
					
					var discountedPriceHtml = this.formatPrice(discountedPrice, undefined, 'down');
					discountedPriceHtml = htmlUtils.moneySpan(discountedPriceHtml, currency.toLowerCase(), 'bndlr-new-price', '', discountedPrice);
					
					var savingsHtml = this.formatPrice(savings);
					savingsHtml = htmlUtils.moneySpan(savingsHtml, currency.toLowerCase(), 'bndlr-savings', '', savings);
					
					return {
						'original_price_html' 	: originalPriceHtml,
						'discounted_price_html' : discountedPriceHtml,
						'savings_html' 			: savingsHtml,
						'raw_discounted_price'	: discountedPrice
					};
				},
				getSelectedVariant: function(productId, bundleKey, bundleId, forRequiredProduct) {
					
					if (typeof forRequiredProduct === 'undefined') {
						forRequiredProduct = false;
					}
					
					var reqProductSelector = '';
					if (forRequiredProduct) {
						reqProductSelector = '.bndlr-product[data-required="true"]';
					} else {
						reqProductSelector = '.bndlr-product[data-required="false"]';
					}					
					
					if (typeof this.renderedBundles[bundleKey] !== 'undefined') {
						if (typeof bundleKey !== 'undefined' && bundleKey !== '') {
							// Get selected variant id by bundle key
							var variantId = $('#_bndl_'+bundleKey).find(reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
						} else if(typeof bundleId !== 'undefined' && bundleId !== '') {
							console.log('Retrieving selected variant id by bundle id'); // Shouldn't happen at all
							// Get selected variant id by bundle id
							var variantId = $('[data-bundle="'+bundleId+'"] '+reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
						} else {
							// Get one of the selected variant ids (Shouldn't happen).
							bundlerConsole.log('bundle id and bundle key are missing');
							
							var variantId = $(reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
						}
					}

/*
					if (typeof bundleKey !== 'undefined' && bundleKey !== '') {
						// Get selected variant id by bundle key
						var variantId = $('[data-bndlr-key="'+bundleKey+'"] '+reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
					} else if(typeof bundleId !== 'undefined' && bundleId !== '') {
						// Get selected variant id by bundle id
						var variantId = $('[data-bundle="'+bundleId+'"] '+reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
					} else {
						// Get one of the selected variant ids (Shouldn't happen).
						bundlerConsole.log('bundle id and bundle key are missing');
						
						var variantId = $(reqProductSelector+' select.bndlr-select-variant.id_'+productId+' option:selected').val();
					}*/
					
					if (typeof variantId === 'undefined') {
						/* Variant selector doesn't exist yet. Return first variant id which is discounted in the bundle. */
						/* discountedBundleProducts are already retrieved products from Shopify */
						/* activeBundle is active bundle with variant definition */
						var bundle = this.getBundleById(bundleId);
						
						if (forRequiredProduct) {
							var productsLib = Library.RequiredProducts.get(bundleId);
						} else {
							var productsLib = Library.DiscountedProducts.get(bundleId);
						}
						
						if (productsLib[productId] !== 'undefined' 
								&& (
									(
										forRequiredProduct === false
										&& typeof bundle.products !== 'undefined' 
										&& typeof bundle.products[productId] !== 'undefined'
									) || (
										forRequiredProduct
										&& typeof bundle.required_products !== 'undefined' 
										&& typeof bundle.required_products[productId] !== 'undefined'
									)
								)
							) {

							var productVariants = productsLib[productId].variants;

							if (forRequiredProduct) {
								var productFromBundle = bundle.required_products[productId];
							} else {
								var productFromBundle = bundle.products[productId];
							}
							
							for (var vi = 0; vi < productVariants.length; vi++) {
								// Loop through all variants
								
																
								if (typeof productFromBundle.variants[productVariants[vi].id] !== 'undefined') {
									// Variant found
									return productVariants[vi].id;
								}
							}
						}

						return false;
					} else {
						return variantId;
					}
				},
				getPrice: function(price) {
					if (typeof price.indexOf === 'function' && price.indexOf('.') !== -1) {
						// Price has decimals in it
						// Multiply to get without decimals
						price = price * 100;
					}
					
					return price;
				},
				getTotalOriginalAmount: function(bundle, products, fromPOS, bundleKey) {
					
					var totalOriginalAmount = 0;
					for(var key in products) {
						if (products.hasOwnProperty(key)) {
							var productId = products[key].product_id;
							
							if (fromPOS && typeof products[key].type !== 'undefined' && products[key].type === 'required') {
								// Skip this product, as it is required and can't be discounted.
								continue;
							}
							
							if (typeof bundle.products[productId] !== 'undefined') {

								var selectedVariant = fromPOS ? false : this.getSelectedVariant(productId, bundleKey, bundle.id);
								
								var quantity = bundle.products[productId].quantity;
								
								if (fromPOS) {
									quantity = products[key].quantity;
								}
								
								if (selectedVariant === false) {
									// Use value of first variant
									// Used in POS
									// Or if the configured variant_id doesn't exist anymore
									totalOriginalAmount += this.getPrice(products[key].variants[0].price)*quantity;
									//totalOriginalAmount += this.getPrice(this.getFirstNonUndefined(products[key].variants[0][priceKeySelector], products[key].variants[0].price))*quantity;
									
								} else {
									for (var i = 0; i < products[key].variants.length; i++) {
										if (selectedVariant == products[key].variants[i].id) {
											//totalOriginalAmount += this.getPrice(this.getFirstNonUndefined(products[key].variants[i][priceKeySelector], products[key].variants[i].price))*quantity;
											totalOriginalAmount += this.getPrice(products[key].variants[i].price)*quantity;
										}
									}
								}
							}
						}
					}
					
					return totalOriginalAmount;
				},
				applyPercentageDiscount: function(bundle, products, discountRatio, fromPOS, bundleKey, onlyToSelectedVariant) {
					var totalAppliedAmount = 0;
					
					for(var key in products) {
						if (products.hasOwnProperty(key)) {
							var productId = products[key].product_id;
							
							if (fromPOS && typeof products[key].type !== 'undefined' && products[key].type === 'required') {
								// Skip this product, as it is required and can't be discounted.
								continue;
							}

							if (typeof bundle.products[productId] !== 'undefined' || 
								(bundle.product_target_type === 'all_products' && bundle.minimum_requirements === 'volume_discounts')) {
								// Only go in if the product is in the bundle or the bundle is a volume bundle targeting all products
								
								if (bundle.product_target_type === 'all_products' && bundle.minimum_requirements === 'volume_discounts') {
									var quantity = products[key].quantity;
								} else {
									var quantity = bundle.products[productId].quantity;
								}

								if (fromPOS) {
									quantity = products[key].quantity;
								}
								
								var selectedVariant = false;
								if (onlyToSelectedVariant) {
									selectedVariant = fromPOS ? false : this.getSelectedVariant(productId, bundleKey, bundle.id);
									
									if (selectedVariant === false) {
										// Get the first selected variant
										selectedVariant = products[key].variants[0].id;
									}
								}
								
								for (var i = 0; i < products[key].variants.length; i++) {
									
									if (onlyToSelectedVariant === false || selectedVariant == products[key].variants[i].id) {
									
										var productPrice		= this.getPrice(products[key].variants[i].price);
										var price 				= this.getPrice(products[key].variants[i].price)*quantity;
										var compareAtLinePrice 	= this.priceOrZero(products[key].variants[i].compare_at_price)*quantity;
										
										// Assign total original price with quantity
										products[key].variants[i].linePrice		 		= price;
										products[key].variants[i].compareAtLinePrice	= compareAtLinePrice;

										// The discount has to be applied and rounded on product level, as this is how we also apply it in the draft order.
										// It can be multiplied by quantity AFTER that.
										var discountAm = Math.round(productPrice * discountRatio)*quantity;
										
										products[key].variants[i].discountedPrice 			= price - discountAm;
										
										if (typeof products[key].variants[i].deliveriesNum === 'number' && products[key].variants[i].deliveriesNum>1) {
											// Increase the discounted price for the number of deliveries (pre-paid subscriptions)
											products[key].variants[i].discountedPrice *= products[key].variants[i].deliveriesNum;
										}
										
										// Quantity which was used when calculating the discounted price
										products[key].variants[i].discountedPriceQuantity 	= quantity;
										
										totalAppliedAmount += discountAm;
										
										if (onlyToSelectedVariant === true) {
											// Break the loop
											i = products[key].variants.length;
										}
									}
								}
							}
						}
					}
					
					return totalAppliedAmount;
				},
				applyRemainingDiscount: function(bundle, products, fromPOS, bundleKey, maxDiscount, appliedAmount) {
					// Loop again through products and apply any remaining discount amount
					if (appliedAmount !== maxDiscount) {
						var discountDifference = maxDiscount - appliedAmount;
						
						for(var key in products) {
							if (products.hasOwnProperty(key)) {
								var productId = products[key].product_id;
								
								if (fromPOS && typeof products[key].type !== 'undefined' && products[key].type === 'required') {
									// Skip this product, as it is required and can't be discounted.
									continue;
								}
								
								if (typeof bundle.products[productId] !== 'undefined') {
						
									var selectedVariant = fromPOS ? false : this.getSelectedVariant(productId, bundleKey, bundle.id);
									
									if (selectedVariant === false) {
										// Get the first selected variant
										selectedVariant = products[key].variants[0].id;
									}
									
									// Calculate price for the selected variant
									for (var i = 0; i < products[key].variants.length; i++) {
										if (selectedVariant == products[key].variants[i].id) {											
											// Add the difference only if the difference is divisible by the variant quantity?
											//if (products[key].variants[i].discountedPrice > discountDifference && discountDifference%products[key].variants[i].discountedPriceQuantity === 0) {
											if (products[key].variants[i].discountedPrice > discountDifference) {
												products[key].variants[i].discountedPrice -= discountDifference;
												discountDifference -= discountDifference;
											}
											// Break the loop
											i = products[key].variants.length;
										}
									}
									
								}
							}
						}
					}
				},
				modifyProductsPrices: function(bundle, products, fromPOS, bundleKey) { // bundleKey is never used
				
					// Local function used to set discounted keys such as (linePrice, discountedPrice, etc.)
					function setDiscountedKeysFixedAmount(self, variant, quantity, totalOriginalAmount, maxDiscount, totalDiscountedAmount) {
						var price = self.getPrice(variant.price)*quantity;
						var discountablePrice = price;
						
						var compareAtLinePrice 	= self.priceOrZero(variant.compare_at_price)*quantity;
						
						if (price > compareAtLinePrice) {
							compareAtLinePrice = price;
						}
						
						// Assign total original price with quantity
						variant.linePrice 			= price;
						variant.compareAtLinePrice 	= compareAtLinePrice;
						
						if (totalOriginalAmount <= maxDiscount) {
							// Original amount is bigger than total amount
							// Give 100% discount
							variant.discountedPrice = 0;
						} else {
							var discountAmount 		= Math.round((discountablePrice/totalOriginalAmount) * maxDiscount);													
							variant.discountedPrice = discountablePrice - discountAmount;
							
							totalDiscountedAmount += discountAmount;
						}
						
						if (typeof variant.deliveriesNum === 'number' && variant.deliveriesNum>1) {
							// Increase the discounted price for the number of deliveries (pre-paid subscriptions)
							variant.discountedPrice *= variant.deliveriesNum;
						}
						
						// Quantity which was used when calculating the discounted price
						variant.discountedPriceQuantity 	= quantity;
						
						return totalDiscountedAmount;
					}

					if (bundle.mix_and_match_display === 'true' && bundle.minimum_requirements === 'n_products' && fromPOS !== true) {
						// Prepare products with the original prices, as we have a mix and match display AND we are not in POS
						for(var key in products) {
							if (products.hasOwnProperty(key)) {
								var productId = products[key].product_id;

								if (typeof bundle.products[productId] !== 'undefined') {
									var quantity = bundle.products[productId].quantity;
									
									for (var i = 0; i < products[key].variants.length; i++) {
										var price 				= this.getPrice(products[key].variants[i].price);
										
										var compareAtLinePrice 	= this.priceOrZero(products[key].variants[i].compare_at_price);
										
										if (price > compareAtLinePrice) {
											compareAtLinePrice = price;
										}
										
										// Assign total original price with quantity
										products[key].variants[i].linePrice		 			= price;
										products[key].variants[i].compareAtLinePrice		= price;

										products[key].variants[i].discountedPrice 			= price;
										
										// Quantity which was used when calculating the discounted price
										products[key].variants[i].discountedPriceQuantity 	= 1;
									}
								}
							}
						}
					} else {
						
						if (fromPOS === true) {
														var volumeDiscount = [];
							for(var pkey in products) {
								if (products.hasOwnProperty(pkey)) {
									if (typeof products[pkey] !== 'undefined' && typeof products[pkey].volume_discount !== 'undefined') {
										discountType 	= products[pkey].volume_discount.discount_type;
										volumeDiscount 	= products[pkey].volume_discount;
										
										// Simulate the bundle discount for this volume discount
										bundle.discount_type 		= volumeDiscount.discount_type;
										bundle.percentage_value 	= volumeDiscount.discount_value;
										bundle.fixed_amount_value 	= volumeDiscount.discount_value;
										break;
									}
								}
							}							
						}
				
						if (bundle.discount_type == 'percentage') {
							var ratio = bundle.percentage_value/100;
							
							this.applyPercentageDiscount(bundle, products, ratio, fromPOS, bundleKey, false);
							
						} else if(bundle.discount_type == 'fixed_amount') {
							var maxDiscount = bundle.fixed_amount_value * 100;

							var totalOriginalAmount = this.getTotalOriginalAmount(bundle, products, fromPOS, bundleKey);
							
							var totalDiscountedAmount = 0;
							
							for(var key in products) {
								if (products.hasOwnProperty(key)) {
									var productId = products[key].product_id;
									
									if (fromPOS && typeof products[key].type !== 'undefined' && products[key].type === 'required') {
										// Skip this product, as it is required and can't be discounted.
										continue;
									}								
									
									if (typeof bundle.products[productId] !== 'undefined') {

										var selectedVariant = fromPOS ? false : this.getSelectedVariant(productId, bundleKey, bundle.id);
										var quantity = bundle.products[productId].quantity;
										
										if (fromPOS) {
											quantity = products[key].quantity;
										}
										
										if (selectedVariant === false) { // Used in POS
										
											totalDiscountedAmount = setDiscountedKeysFixedAmount(this, products[key].variants[0], quantity, totalOriginalAmount, maxDiscount, totalDiscountedAmount);
											
										} else {
											// Calculate price for the selected variant
											for (var i = 0; i < products[key].variants.length; i++) {
												if (selectedVariant == products[key].variants[i].id) {
													totalDiscountedAmount = setDiscountedKeysFixedAmount(this, products[key].variants[i], quantity, totalOriginalAmount, maxDiscount, totalDiscountedAmount);
												}
											}
											
										}
									}
								}
							}
							
							// Loop again through products and apply any remaining discount amount
							this.applyRemainingDiscount(bundle, products, fromPOS, bundleKey, maxDiscount, totalDiscountedAmount);
							
						} else if(bundle.discount_type == 'fixed_price') {
							// Calculate the total discount in percentage and apply it to the bundle
							var finalPrice 			= bundle.fixed_price_value * 100;
							var totalOriginalAmount = this.getTotalOriginalAmount(bundle, products, fromPOS, bundleKey);
							var discountAmount 		= totalOriginalAmount - finalPrice;

							if (discountAmount < 0) {
								discountAmount = 0;
							}
							
							var discountRatio = discountAmount/totalOriginalAmount;
							
							// Apply discounts to products by reference
							var totalAppliedAmount = this.applyPercentageDiscount(bundle, products, discountRatio, fromPOS, bundleKey, true);

							// Check if the price is really the same as it was specified. The discount is changed by reference.
							this.applyRemainingDiscount(bundle, products, fromPOS, bundleKey, discountAmount, totalAppliedAmount);
							
						} else if (bundle.discount_type == 'products_discounts') {
							
							
							for(var key in products) {
								if (products.hasOwnProperty(key)) {
									var productId = products[key].product_id;
									
									if (fromPOS && typeof products[key].type !== 'undefined' && products[key].type === 'required') {
										continue;
									}
									
									if (typeof bundle.products[productId] !== 'undefined') {

										var quantity = bundle.products[productId].quantity;
										
										if (fromPOS) {
											quantity = products[key].quantity;
										}

										for (var i = 0; i < products[key].variants.length; i++) {
											var price 				= this.getPrice(products[key].variants[i].price)*quantity;
											var compareAtLinePrice 	= this.priceOrZero(products[key].variants[i].compare_at_price)*quantity;
											
											var finalDiscount = bundle.products[productId].discount_amount*100;
											
											if (bundle.minimum_requirements === 'n_products') {
												finalDiscount = finalDiscount*quantity;
											}
											
											if (finalDiscount<0) {
												finalDiscount = 0;
											}
											
											// Assign total original price with quantity
											products[key].variants[i].linePrice		 		= price;
											products[key].variants[i].compareAtLinePrice	= compareAtLinePrice;
											
											var finalPrice = Math.round(price - finalDiscount);
											if (finalPrice < 0) {
												finalPrice = 0;
											}
											products[key].variants[i].discountedPrice 	= finalPrice;
											
											if (typeof products[key].variants[i].deliveriesNum === 'number' && products[key].variants[i].deliveriesNum>1) {
												// Increase the discounted price for the number of deliveries (pre-paid subscriptions)
												products[key].variants[i].discountedPrice *= products[key].variants[i].deliveriesNum;
											}
											
											// Quantity which was used when calculating the discounted price
											products[key].variants[i].discountedPriceQuantity 	= quantity;
										}
									}
								}
							}
						}
					}
					
					return products;
				},
				isVariantAvailable: function(variantId, productId, bundle, fromRequiredProducts) {
					var arrayKey = 'products';
					if (fromRequiredProducts) {
						arrayKey = 'required_products';
					}
					
					if (typeof bundle[arrayKey][productId] !== 'undefined') {
						if (typeof bundle[arrayKey][productId].variants[variantId] !== 'undefined') {
							return true;
						}
					}
					
					return false;
				},
				getMixAndMatchProductHtml: function(product, bundle, isRequired) {

					var variantSelectDisplay = '';
					var options = '';
									
					var variants = '<select class="bndlr-select-variant id_'+product.id+'" aria-label="variant" name="variant_id" ';

					var allowedVariants = [];
					for(var i = 0; i < product.variants.length; i++) {		
						if (this.isVariantAvailable(product.variants[i].id, product.id, bundle, false)) {
							
														
							allowedVariants.push(product.variants[i]);
						}
					}
					
					var variantsAreAvailable = true;
					if (allowedVariants.length === 0) {
						this.widgetCanBeDisplayed = false;
						variantsAreAvailable = false;
						console.warn('Bundler: The configured variants for product "' + product.title + '" are not available. If you set the app to hide unavailable variants, then please make sure that the selected variants are in stock. If the issue persists, try to edit the bundle, select the products again and save the bundle.');
					}
					
					if (allowedVariants.length <= 1) {
						variantSelectDisplay = 'display:none;';
					}
					variants += 'style="'+variantSelectDisplay+'"';
					variants += '>';
					
					for(var i = 0; i < allowedVariants.length; i++) {
						var name = this.getVariantTitle(allowedVariants[i]);
						
						var dataAttrs = '';
												
						variants += '<option value="' + allowedVariants[i].id + '" '+dataAttrs+'>' + name + '</option>';
					}
					variants += '</select>';

					var productUrl = nav.getRootUrl(true) + 'products/' + product.handle;
					
					// Get featured image for the currently selected variant
					var featuredImage = this.getFeaturedImage(product, '', bundle.id);
					
											var linkTarget = 'target="_blank"';
										
					var productTitle = product.title;					
					var productTitleAttr = productTitle.replace('"', '').replace(/<[^>]*>?/gm, '');
					
					var addToBundleText			= 'Add';
					var addToBundleButtonClass 	= '';
					
											if (variantsAreAvailable === false) {
							addToBundleText 		= 'Out of stock';
							addToBundleButtonClass 	= 'bndlr-no-click';
						}
										
					var html = '' + 
						'<div class="bndlr-product bndlr-mix-and-match bndlr-no-plus-sign" '+
								'data-quantity="1" ' +
								'data-required="false" '+
								'data-mnm-required="'+isRequired.toString()+'" '+
								'data-available="'+ variantsAreAvailable.toString() +'" '+
								'data-product-id="'+product.id+'" ' +
								'>';
															html += '' +
								'<a href="'+ productUrl +'" class="bndlr-product-image-url" '+linkTarget+'>' +
									'<img title="' + productTitleAttr + '" class="bndlr-product-image id_'+product.id+'" src="'+ this.getProductImage(featuredImage, '500X500') +'" '+ this.getSrcSet(featuredImage) +'>' +
								'</a>';
							
							html += ''+ 
							'<div class="bndlr-product-qn-container">';

																	html += '' +
									'<a href="'+ productUrl +'" class="bndlr-product-title" '+linkTarget+' title="' + productTitleAttr + '">' + productTitle + '</a>';
															
							html += '' +
							'</div>' +
							'<div class="bndlr-product-price id_'+product.id+'">' +
								this.getProductPriceHtml(product, '', bundle.id, true) +
							'</div>' +
																 
							'<div class="bndlr-bottom-pusher"></div>' +
							options +
							variants +
							'<div class="bndlr-add-to-bundle ' + addToBundleButtonClass + '" title="'+addToBundleText+'" tabindex="0" role="button">'+addToBundleText+'</div>' +
						'</div>' +
					'';
					
					return html;
				},
				getStatusBoxProductHtml: function(lineItem, product, bundle) {
					
					var productUrl = nav.getRootUrl(true) + 'products/' + product.handle;
					
					var variantName = '';
					
					// Get featured image for the currently selected variant
					var featuredImage = '';

					// Get the product image and variant name
					for (var i = 0; i < product.variants.length; i++) {

						if (lineItem.variant_id == product.variants[i].id) {

							if (typeof product.variants[i].featured_image !== 'undefined' && 
								product.variants[i].featured_image !== null) {

								featuredImage = product.variants[i].featured_image.src;
							} else {
								// When you request json format, the featured_image is missing
								featuredImage = this.getVariantsFeaturedImage(product, product.variants[i]);
							}
							variantName = product.variants[i].name;
						}
					}
					
					// Get featured image of the product (if set)
					var customProductImage = this.getCustomProductImage(bundle.id, product.id);
					if (customProductImage !== '') {
						featuredImage = customProductImage;
					}
					
					
											var linkTarget = 'target="_blank"';
					
					var variantNameAttr	= variantName.replace('"', '').replace(/<[^>]*>?/gm, '');
					
					var html = '' + 
						'<div class="bndlr-status-box-product">';
							if (lineItem.quantity > 1) {
								html += '<div class="bndlr-status-box-product-quantity">'+lineItem.quantity+'x'+'</div>';
							}
															html += '' +
								'<a href="'+ productUrl +'" class="bndlr-status-box-product-url" '+linkTarget+'>' +
									'<img title="' + variantNameAttr + '" class="bndlr-status-box-product-image addtc-np" src="'+ this.getProductImage(featuredImage, '500X500') +'" '+ this.getSrcSet(featuredImage) +'>' +
								'</a>';
													html += '</div>';

					return html;
				},
				getSelectedProductHtml: function(lineItem, product, bundle, lineItemKey) {

					var variantSelectDisplay = '';
					var options = '';

					var productUrl = nav.getRootUrl(true) + 'products/' + product.handle;
					
					var variantName = '';
					
					// Get featured image for the currently selected variant
					var featuredImage = '';

					// Get the product image and variant name
					for (var i = 0; i < product.variants.length; i++) {

						if (lineItem.variant_id == product.variants[i].id) {

							if (typeof product.variants[i].featured_image !== 'undefined' && 
								product.variants[i].featured_image !== null) {

								featuredImage = product.variants[i].featured_image.src;
							} else {
								// When you request json format, the featured_image is missing
								featuredImage = this.getVariantsFeaturedImage(product, product.variants[i]);
							}
							
							variantName = product.variants[i].name;
						}
					}
					
					// Get featured image of the product (if set)
					var customProductImage = this.getCustomProductImage(bundle.id, product.id);
					if (customProductImage !== '') {
						featuredImage = customProductImage;
					}
					
					
											var linkTarget = 'target="_blank"';
					
					var variantNameAttr	= variantName.replace('"', '').replace(/<[^>]*>?/gm, '');
					
					
					var html = '' + 
						'<div class="bndlr-product bndlr-mix-and-match" data-line-item-key="'+lineItemKey+'" data-variant-id="'+lineItem.variant_id+'">';
															html += '' +
								'<a href="'+ productUrl +'" class="bndlr-product-image-url" '+linkTarget+'>' +
									'<img title="' + variantNameAttr + '" class="bndlr-product-image id_'+product.id+'" src="'+ this.getProductImage(featuredImage, '500X500') +'" '+ this.getSrcSet(featuredImage) +'>' +
								'</a>';
														
							html += '' +
							'<div class="bndlr-product-qn-container">' +
								'<div class="bndlr-product-quantity">' +
									lineItem.quantity+'x'+
								'</div>';
																	html += '' +
									'<a href="'+ productUrl +'" class="bndlr-product-title" '+linkTarget+' title="' + variantNameAttr + '">' + variantName + '</a>';
															html += '' +
							'</div>' +
																							 
							'<div class="bndlr-bottom-pusher"></div>' +
							'<div class="bndlr-close" tabindex="0"></div>' +
						'</div>' +
					'';
					
					return html;
				},
				// Creates product html to include it in the bundle
				getProductHtml: function(product, bundle, fromRequiredProducts) {

					var variantSelectDisplay = '';
					var options = '';
									
					var variants = '<select class="bndlr-select-variant id_'+product.id+'" aria-label="variant" name="variant_id" ';
					
					if (typeof fromRequiredProducts === 'undefined') {
						fromRequiredProducts = false;
					}

					var allowedVariants = [];
					for(var i = 0; i < product.variants.length; i++) {		
						if (this.isVariantAvailable(product.variants[i].id, product.id, bundle, fromRequiredProducts)) {
							
														
							allowedVariants.push(product.variants[i]);
						}
					}
					
					var variantsAreAvailable = true;
					if (allowedVariants.length === 0) {
						this.widgetCanBeDisplayed = false;
						variantsAreAvailable = false;
						console.warn('Bundler: The configured variants for product "' + product.title + '" are not available. If you set the app to hide unavailable variants, then please make sure that the selected variants are in stock. If the issue persists, try to edit the bundle, select the products again and save the bundle.');
					}
					
					if (allowedVariants.length <= 1) {
						variantSelectDisplay = 'display:none;';
					}
					variants += 'style="'+variantSelectDisplay+'"';
					variants += '>';
					
					for(var i = 0; i < allowedVariants.length; i++) {
						var name = this.getVariantTitle(allowedVariants[i]);
						
						var dataAttrs = '';
												
						variants += '<option value="' + allowedVariants[i].id + '" '+dataAttrs+'>' + name + '</option>';
					}
					variants += '</select>';

					var productUrl = nav.getRootUrl(true) + 'products/' + product.handle;
					
					// Get featured image for the currently selected variant
					var featuredImage 		= this.getFeaturedImage(product, '', bundle.id, fromRequiredProducts);
					//var featuredImageData 	= this.getFeaturedImageData(product, featuredImage);
					
											var linkTarget = 'target="_blank"';
										
					var productTitle = product.title;
										
					var productTitleAttr = productTitle.replace('"', '').replace(/<[^>]*>?/gm, '');
					
					var productQuantity = this.getProductQuantity(product.id, bundle, fromRequiredProducts);
					
										
					var html = '' + 
						'<div class="bndlr-product" '+
								'data-quantity="'+productQuantity+'" '+
								'data-required="'+ fromRequiredProducts.toString() +'" '+
								'data-available="'+ variantsAreAvailable.toString() +'" '+
								'data-product-id="'+product.id+'" '+
								'>';
															html += '' +
								'<a href="'+ productUrl +'" class="bndlr-product-image-url" '+linkTarget+'>' +
									'<img title="' + productTitleAttr + '" class="bndlr-product-image id_'+product.id+'" src="'+ this.getProductImage(featuredImage, '500X500') +'" '+ this.getSrcSet(featuredImage) +
									//' style="'+ this.getWidthAndHeightParam(featuredImageData) +'" ' +
									'>' +
								'</a>';
														
							html += '' +
							'<div class="bndlr-product-qn-container">' +
								this.getQuantityHtml(productQuantity);
								
																	html += '' +
									'<a href="'+ productUrl +'" class="bndlr-product-title" '+linkTarget+' title="' + productTitleAttr + '">' + productTitle + '</a>';
																
							html += '' +	
							'</div>' +
														'<div class="bndlr-product-price id_'+product.id+'">' +
								this.getProductPriceHtml(product, '', bundle.id, !fromRequiredProducts) +
							'</div>' +
																 
							'<div class="bndlr-bottom-pusher"></div>' +
							options +
							variants +
							
							'<div ' +
								'class="bndlr-product-overlay" '+
								'style="display: var(--preproduct-'+(fromRequiredProducts ? 'required-' : '')+product.id+'-overlay-display, none);" '+
							'>' +
								'<div ' +
								'class="bndlr-product-overlay-checkmark" '+
								'>'+htmlUtils.svgCheckmarkPreselected+'</div>' +
							'</div>' +
						'</div>' +
					'';
					
					return html;
				},
				getProductListName: function(product, bundle, requiredProduct, bundleKey) {
					// bundleKey is used to get the discounted value of the price per unit

					var productUrl = nav.getRootUrl(true) + 'products/' + product.handle;
					var productTitleAttr = product.title.replace('"', '').replace(/<[^>]*>?/gm, '');
					
											var linkTarget = 'target="_blank"';
										
					var html = '' + 
						this.getProductQuantityHtml(product.id, bundle, requiredProduct) +
						'<a href="'+ productUrl +'" class="bndlr-product-title" '+linkTarget+' title="' + productTitleAttr + '">' + product.title + '</a>' +
					'';
					
										
					return html;
				},
				getProductImage: function(imageSrc, size) {

					if (imageSrc === null) {
						imageSrc = '//cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081';
					} else {
						var resizeMatches = imageSrc.match(/_\d+x\d+\./gi);
						var resizeMatches2 = imageSrc.match(/\d+x\.(jpg|png)\?/gi);
						if(imageSrc.indexOf('shopify') !== -1 && imageSrc.indexOf('@') === -1 && resizeMatches === null && resizeMatches2 === null) {
							
							imageSrc = imageSrc.replace(/\.jpg\?/, "_"+size+'.jpg?');
							imageSrc = imageSrc.replace(/\.jpeg\?/, "_"+size+'.jpeg?');
							imageSrc = imageSrc.replace(/\.png\?/, "_"+size+'.png?');
							
							imageSrc = imageSrc.replace(/\.JPG\?/, "_"+size+'.JPG?');
							imageSrc = imageSrc.replace(/\.JPEG\?/, "_"+size+'.JPEG?');
							imageSrc = imageSrc.replace(/\.PNG\?/, "_"+size+'.PNG?');
						}
					}
					
					return imageSrc;
				},
				getSrcSet: function(imageSrc, valueOnly) {
					
					if (typeof valueOnly === 'undefined') {
						valueOnly = false;
					}
					
					if (typeof window.BndlrIsBundleLandingPage !== 'undefined' && window.BndlrIsBundleLandingPage) {
						var sizes = [
							318 // This is the maximum size on landing pages
							/*
							350,
							700,
							1400
							*/
						];
					} else {
						var sizes = [
							218 // This is the maximum size of the image in the element
							/*
							250,
							500,
							1000
							*/
						];
					}

					if (typeof clientSpecifics['image_dimensions'] !== 'undefined') {
						sizes = clientSpecifics['image_dimensions'].getSizes();
					}
					
					var srcset = '';
					for (var i = 0; i < sizes.length; i++) {
						//srcset += this.getProductImage(imageSrc, sizes[i]+'X'+sizes[i]*2) + ' '+(i+1) + 'x,';
						srcset += this.getProductImage(imageSrc, sizes[i]+'X'+sizes[i]*3) + ' '+ sizes[i] + 'w,';
					}
					
					srcset = srcset.replace(/,$/, '');
					
					if (valueOnly) {
						return srcset;
					} else {
						return 'srcset="'+srcset+'"';
					}
				},
				getProductPriceHtml: function(product, bundleKey, bundleId, canBeDiscounted) {
					
					if (typeof canBeDiscounted === 'undefined') {
						canBeDiscounted = true;
					}
					
					// Returns html with product price
					var price 		= this.getSelectedVariantPrice(product, bundleKey, bundleId, !canBeDiscounted);

					if (canBeDiscounted) {
						var oldPrice 	= this.getSelectedVariantOldPrice(product, bundleKey, bundleId);
					} else {
						var oldPrice = price;
					}
					
					var showOldPrice = false;
					if (oldPrice > price) {
						showOldPrice = true;
					}

					var savings = oldPrice - price;

					var priceHtml 		= this.formatPrice(price);
					var oldPriceHtml 	= this.formatPrice(oldPrice);
					
					var currency = this.getDefaultCurrency();
					
					if (showOldPrice) {
						var priceHtml = '' +
								htmlUtils.moneySpan(oldPriceHtml, 	currency.toLowerCase(), 'bndlr-old-price', '', oldPrice)+' ' + /* Space is essential here */
								htmlUtils.moneySpan(priceHtml, 		currency.toLowerCase(), 'bndlr-new-price', 'data-savings="'+savings+'"', price);
					} else {
						var priceHtml = htmlUtils.moneySpan(priceHtml, currency.toLowerCase(), 'bndlr-new-price', 'data-savings="'+savings+'"', price);
					}
					
					return priceHtml;
				},
				getVariantData: function(product, variantId) {
					for (var i = 0; i < product.variants.length; i++) {
						if (variantId === false) {
							return product.variants[i]
						} else {
							if (product.variants[i].id == variantId) {
								return product.variants[i]
							}
						}
					}
				},
												  
				getProductQuantityHtml: function(productId, bundle, isRequiredProduct) {
					var quantity = this.getProductQuantity(productId, bundle, isRequiredProduct);

					return this.getQuantityHtml(quantity);
				},
				getQuantityHtml: function(quantity) {

					if (quantity > 1) {
						var html = '<div class="bndlr-product-quantity">'+quantity+'x</div>';
						return html;
					}
					
					return '';
				},
				getProductQuantity: function(productId, bundle, isRequiredProduct) {
					// returns quantity for the product id
					// it works on product level (not on variant)
					if (isRequiredProduct) {
						if (typeof bundle.required_products[productId] !== 'undefined') {
							return bundle.required_products[productId].quantity;
						}
					} else {
						if (typeof bundle.products[productId] !== 'undefined') {
							return bundle.products[productId].quantity;
						}
					}
					
					return 1;
				},
				getSelectedVariantPrice: function(product, bundleKey, bundleId, fromRequiredProducts, forOneItem) {
					
					if (typeof fromRequiredProducts === 'undefined') {
						fromRequiredProducts = false;
					}
					
					if (typeof forOneItem === 'undefined') {
						forOneItem = false;
					}
					
					// Returns discounted price for the currently selected product variant.
					var selectedVariant = this.getSelectedVariant(product.id, bundleKey, bundleId, fromRequiredProducts);

					for (var i = 0; i < product.variants.length; i++) {
						if (selectedVariant === false) {
							return this.getVariantDiscountedPrice(product.variants[i], forOneItem);
						} else {
							if (product.variants[i].id == selectedVariant) {
								return this.getVariantDiscountedPrice(product.variants[i], forOneItem);
							}
						}
					}
					
					//bundlerConsole.log('Could not get variant discounted price.');
					return product.price;
				},
				getVariantDiscountedPrice: function(variant, forOneItem) {
					
					if (typeof forOneItem === 'undefined') {
						forOneItem = false;
					}
					
					var price = 0;
					
					if (typeof variant.discountedPrice === 'undefined') {
						price = variant.price;
					} else {
						price = variant.discountedPrice;
					}
					
					if (forOneItem === true) {
						if (typeof variant.discountedPrice === 'undefined' || typeof variant.discountedPriceQuantity === 'undefined') {
							price = price;
						} else {
							price = Math.round(price/ variant.discountedPriceQuantity);
						}
					}
					
					return price;
				},				
				getFirstNonUndefined: function() {
					for (var i = 0; i < arguments.length; ++i) {
						if (typeof arguments[i] !== 'undefined') {
							return arguments[i];
						}
					}
					return undefined;
				},
				getSelectedVariantOldPrice: function(product, bundleKey, bundleId, forRequiredProduct) {
					
					if (typeof forRequiredProduct === 'undefined') {
						forRequiredProduct = false;
					}
					
					// Returns normal price for currently selected product variant
					var selectedVariant = this.getSelectedVariant(product.id, bundleKey, bundleId, forRequiredProduct);

					for (var i = 0; i < product.variants.length; i++) {
						if (selectedVariant === false || product.variants[i].id == selectedVariant) {
							return this.getVariantOldPrice(product.variants[i]);
						}
					}
					
					//bundlerConsole.log('Could not get variant price.');
					return product.price;
				},
				getVariantOldPrice: function(variant) {
										
											if (typeof variant.linePrice === 'undefined') {
							console.trace();
						}
						return this.getPrice(variant.linePrice);
									},
				updatePriceDisplay: function($this) {
					// Updates displayed prices
					// Triggered when variant select changes
					var bundleId 	= $this.closest('[data-bundle]').attr('data-bundle');
					var bundleKey 	= $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
					var bundle 		= this.getBundleById(bundleId);
					
					var required = 'false';
					var canBeDiscounted = true;
					if ($this.closest('[data-required]').attr('data-required') === 'true') {
						// Variant was switched for the required product
						required = 'true';
						canBeDiscounted = false;
						
						var products = Library.RequiredProducts.get(bundleId);

					} else {
						// Variant was switched for normal bundled product
						required = 'false';
						canBeDiscounted = true;
						
						var products = Library.DiscountedProducts.get(bundleId);
						products = this.modifyProductsPrices(bundle, products, false, bundleKey);
						Library.DiscountedProducts.set(bundleId, products);
					}
					
					for (var productId in products) {
						if (products.hasOwnProperty(productId)) {
							var priceHtml = this.getProductPriceHtml(products[productId], bundleKey, bundleId, canBeDiscounted);
							
							$('#_bndl_'+bundleKey).find('[data-required="'+required+'"] .bndlr-product-price.id_'+productId).html(priceHtml);

													}
					}
					
					$('#_bndl_'+bundleKey).find('.bndlr-total-price').html(this.getTotalPriceText(bundle, bundleKey));
				},
				processPriceUpdate: function(eventDetails) {
					
					var $el = $(eventDetails.element);
					if (typeof eventDetails.price !== 'undefined') {
						var newPrice = eventDetails.price;
						
						var pricePerDelivery = newPrice;
						var deliveriesNum = 1;
						
						var bundleId = $el.closest('[data-bundle]').attr('data-bundle');
						var bundleKey = $el.closest('[data-bndlr-key]').attr('data-bndlr-key');
						
						if (typeof bundleId === 'undefined' || typeof bundleKey === 'undefined') {
							return true;
						}
						
						var required 		= false;
						var canBeDiscounted = true;
						var isMixNMatch		= false;
						
						if ($el.closest('.bndlr-product.bndlr-mix-and-match[data-line-item-key]').length) {
							// Get lineItemKey, which is essentially the variant_id
							var lineItemKey = $el.closest('.bndlr-product.bndlr-mix-and-match[data-line-item-key]').attr('data-line-item-key');
							isMixNMatch 	= true;
							var products = Library.DiscountedProducts.get(bundleId);
							
						} else if ($el.closest('[data-required]').attr('data-required') === 'true') {
							// The price update was triggered for the required product
							required = true;
							canBeDiscounted = false;
							
							var products = Library.RequiredProducts.get(bundleId);

						} else {
							// The price update was triggered for the normal bundled product
							required = false;
							canBeDiscounted = true;
							
							var products = Library.DiscountedProducts.get(bundleId);
						}
						
						
						
						if (isMixNMatch) {

							for(var key in products) {
								if (products.hasOwnProperty(key)) {
									for(var pi = 0; pi < products[key].variants.length; pi++) {
										if (products[key].variants[pi].id == lineItemKey) {
											products[key].variants[pi].price 					= pricePerDelivery;
											products[key].variants[pi].priceForAllDeliveries 	= newPrice;
											products[key].variants[pi].deliveriesNum 			= deliveriesNum;
											
											products[key].variants[pi].linePriceForAllDeliveries = newPrice*products[key].variants[pi].discountedPriceQuantity;
											
											if (products[key].variants[pi].compareAtLinePrice < products[key].variants[pi].linePriceForAllDeliveries) {
												// The original compareatlineprice is smaller than the line price. Set it to the same value.
												products[key].variants[pi].compareAtLinePrice = products[key].variants[pi].linePriceForAllDeliveries;
											}
										}
									}
								}
							}
							
							Library.DiscountedProducts.set(bundleId, products);
							this.MixNMatch.refreshDisplay(bundleKey);
							
						} else {
							var productId 		= $el.closest('[data-product-id]').attr('data-product-id');
							
							if (typeof productId !== 'undefined') {
							
								var selectedVariant = this.getSelectedVariant(productId, bundleKey, bundleId, required);
								
								for(var key in products) {
									if (products.hasOwnProperty(key)) {
										// There is some issue where we somewhere set 'undefined' as key in the products object
										if (typeof products[key].variants !== 'undefined') {
											for(var pi = 0; pi < products[key].variants.length; pi++) {
												if (products[key].variants[pi].id == selectedVariant) {
													products[key].variants[pi].price 					= pricePerDelivery;
													products[key].variants[pi].priceForAllDeliveries 	= newPrice;
													products[key].variants[pi].deliveriesNum 			= deliveriesNum;
													
													
													products[key].variants[pi].linePriceForAllDeliveries = newPrice*products[key].variants[pi].discountedPriceQuantity;
													
													if (products[key].variants[pi].compareAtLinePrice < products[key].variants[pi].linePriceForAllDeliveries) {
														// The original compareatlineprice is smaller than the line price. Set it to the same value.
														products[key].variants[pi].compareAtLinePrice = products[key].variants[pi].linePriceForAllDeliveries;
													}
													
													if (required) {
														products[key].variants[pi].linePrice 			= pricePerDelivery;
														products[key].variants[pi].compareAtLinePrice 	= pricePerDelivery;
													}
													
												}
											}
										}
									}
								}
								
								if (required) {
									Library.RequiredProducts.set(bundleId, products);
								} else {
									Library.DiscountedProducts.set(bundleId, products);
								}
								
								this.updatePriceDisplay($el);
							}
						}
					}
					
				},
				changeDisplayedImage: function($this) {
					// Change displayed image on variant change
					// Triggered when variant select changes		

					var bundleId = $this.closest('[data-bundle]').attr('data-bundle');
					var bundleKey = $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
					var bundle = this.getBundleById(bundleId);
					
					var required = 'false';
					var canBeDiscounted = true;
					if ($this.closest('[data-required]').attr('data-required') === 'true') {
						// Variant was switched for the required product
						required = 'true';
						canBeDiscounted = false;
						
						var products = Library.RequiredProducts.get(bundleId);

					} else {
						// Variant was switched for normal bundled product
						required = 'false';
						canBeDiscounted = true;
						
						var products = Library.DiscountedProducts.get(bundleId);
					}
					
					for(var productId in products) {
						if (products.hasOwnProperty(productId)) {
							var featuredImage = this.getFeaturedImage(products[productId], bundleKey, bundleId, !canBeDiscounted);

							if (featuredImage !== null && featuredImage.length > 0) {
								$('.bundler-target-element [data-bndlr-key="'+bundleKey+'"] [data-required="'+required+'"] .bndlr-product-image.id_'+productId).attr('src', this.getProductImage(featuredImage, '500X500'));
								$('.bundler-target-element [data-bndlr-key="'+bundleKey+'"] [data-required="'+required+'"] .bndlr-product-image.id_'+productId).attr('srcset', this.getSrcSet(featuredImage, true));
								
							}
						}
					}
				},
				getFeaturedImage: function(product, bundleKey, bundleId, fromRequiredProducts) {
					
					if (typeof fromRequiredProducts === 'undefined') {
						fromRequiredProducts = false;
					}
					
					var featuredImage = '';
					var productId = product.id;
					
					if (fromRequiredProducts === false) {
						// Only bundled products have an option to use custom product image
						var customProductImage = this.getCustomProductImage(bundleId, productId);
						if (customProductImage !== '') {
							return customProductImage;
						}
					}

					var selectedVariant = this.getSelectedVariant(productId, bundleKey, bundleId, fromRequiredProducts);

					if (selectedVariant === false) {
						// Use value of first variant
						if (typeof product.featured_image === 'undefined') {
							// When you request json format, the featured_image is missing
							featuredImage = this.getVariantsFeaturedImage(product, product.variants[0]);
						} else {
							featuredImage = product.featured_image;
						}
					} else {
						for (var i = 0; i < product.variants.length; i++) {

							if (selectedVariant == product.variants[i].id) {

								if (typeof product.variants[i].featured_image !== 'undefined' && 
									product.variants[i].featured_image !== null) {

									featuredImage = product.variants[i].featured_image.src;
								} else {
									// When you request json format, the featured_image is missing
									featuredImage = this.getVariantsFeaturedImage(product, product.variants[i]);
								}
							}
						}
					}
					
					if (featuredImage === '') {
						// Not needed fallback
						featuredImage = product.featured_image;
					}
					
					return featuredImage;
				},
				getCustomProductImage: function(bundleId, productId) {
					var bundle = this.getBundleById(bundleId);
					if (typeof bundle.products[productId] !== 'undefined' && typeof bundle.products[productId].image !== 'undefined') {
						return bundle.products[productId].image;
					}
					
					return '';
				},
				getVariantsFeaturedImage: function(product, variant) {
					var imageSrc = '';
					if (typeof variant.image_id !== 'undefined' && variant.image_id !== null) {
						for (var n=0; n<product.images.length; n++) {							
							if (product.images[n].id == variant.image_id) {

								if (typeof product.images[n] == 'string') {
									// .js has string
									imageSrc = product.images[n];
								} else {
									// No .js has object
									imageSrc = product.images[n].src;
								}
							}
						}
					}
					
					if (imageSrc.length == 0) {
						// Variant probably doesn't have an image
						// Return default image
						if (typeof product.featured_image !== 'undefined') {
							// .js
							return product.featured_image;
						} else {
							// No .js
							return product.image.src;
						}
					}
					
					return imageSrc;
				},
				formatPrice: function(price, currency, directionFor50) {
					price = Math.floor(price);
					
											
						var format = '${{amount}}';						
						price = utils.formatMoney(price, format, (currency || this.getDefaultCurrency()), directionFor50);
						
										
					return price;
				},
				getDefaultCurrency: function() {
					if (typeof Shopify !== 'undefined' && typeof Shopify.currency.active !== 'undefined') {
						var currency = Shopify.currency.active;
					} else {
													var currency = 'AUD';
											}
					
					return currency;
				},
				MixNMatch: {
					// Adds bundle product to the bundle (for mix & match bundles)
					addToBundle: function($this) {
						
						var bundleKey = $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
						var properties = {};
						
						var $product = $this.closest('.bndlr-product');					
						
						var variantId 	= $product.find('select.bndlr-select-variant[name="variant_id"] option:selected').val();
						var productId 	= $product.attr('data-product-id');
						var quantity 	= 1;

						if (typeof variantId === 'undefined') {
							// It looks like the variant selector is without any options. Display error message.
							var productTitle = $product.find('.bndlr-product-title').first().text();
							// Show warning/error message. It has to be sent in the correct format (HTTP response).
							bndlr.showWarningMessage({
								responseJSON: {
									description: 'Product: '+productTitle+' is not available.'
								}
							}, bundleKey);
						} else {						
							var products = Library.MixAndMatchBundles.get(bundleKey);

							if (typeof products[variantId] !== 'undefined') {
								products[variantId].quantity += 1;
							} else {
								products[variantId] = {
									product_id: productId,
									variant_id: variantId,
									quantity:	quantity
								}
							}
							
							Library.MixAndMatchBundles.set(bundleKey, products);

							widgetView.drawSelectedProducts(bundleKey, products);
							widgetView.MixNMatch.fadeInSelectedProducts(bundleKey);
							
							widgetView.addToCartButton.showCheckmark($this);
						}
						
						this.refreshDisplay(bundleKey);
						
					},
										// Update total price, button, etc. in the mix and match bundle widget
					refreshDisplay: function(bundleKey) {
						// Get bundle
						var htmlId = '#_bndl_'+bundleKey;
						var $element = $(htmlId);

						var bundleId = $element.closest('[data-bundle]').attr('data-bundle');
						bundleId = parseInt(bundleId);
						var bundle = bndlr.getBundleById(bundleId);
						
						// Show or hide add to bundle buttons
						this.showHideAddToBundleButtons(bundleKey);
						// Refresh the instructions text
						this.refreshInstructionsText(bundleKey, bundle);
						
						// Show or hide add to cart button if the bundle already fulfills the minimum requirements
						// Get number of container products
						var numberOfSelectedProducts = this.getNumOfselectedProducts(bundleKey);
						var numberofMissingProducts = this.getNumberOfRemainingProducts(bundle, numberOfSelectedProducts);
						// Get true|false if the bundle is missing one or more required products
						var isMissingRequiredProducts = this.isMissingRequiredProducts(bundleKey, bundle);
						
						if (numberofMissingProducts === 0 && isMissingRequiredProducts === false) {
							widgetView.MixNMatch.fadeInAddToCartButton(bundleKey);
						} else {
							widgetView.MixNMatch.fadeOutAddToCartButton(bundleKey);
						}
						
						// Recalculate total price
						var selectedProducts = Library.MixAndMatchBundles.get(bundleKey);
						var products = Library.DiscountedProducts.get(bundleId);
						
						// Recreate bundle and set the selected products in it so we can calculate the total price like we would normally do it
						var recreatedBundle = JSON.parse(JSON.stringify(bundle));
						recreatedBundle.mix_and_match_display = 'false';

						var recreatedProducts = {};

						for (var key in selectedProducts) {
							if (selectedProducts.hasOwnProperty(key)) {
								var variantId 	= selectedProducts[key].variant_id;
								var productId 	= selectedProducts[key].product_id;
								var quantity 	= selectedProducts[key].quantity;
								var product = {};

								if (bundle.product_level == 'product') {
									product = products[productId];
								} else {
									product = products[productId];
								}

								var prd = JSON.parse(JSON.stringify(product));
								
								for (var i = 0; i<product.variants.length; i++) {
									if (product.variants[i].id == variantId) {
										var variant = JSON.parse(JSON.stringify(product.variants[i]));

										prd.quantity = quantity;
										prd.variants = [product.variants[i]];
									}
								}
								
								recreatedProducts[key] = prd;
							}							
						}

						if (this.getNumberOfRemainingProducts(bundle, numberOfSelectedProducts) === 0) {
							recreatedProducts = bndlr.modifyProductsPrices(recreatedBundle, recreatedProducts, true); // Simulate POS
						}
						
												
						var totalPriceText = bndlr.getMixNMatchTotalPriceText(recreatedBundle, recreatedProducts);
						$element.find('.bndlr-mnm-total-price').html(totalPriceText);
						
						bndlr.setProductWidth(htmlId+' .bndlr-mnm-second-container', $element.find('.bndlr-mnm-second-container'));
						
													// Trigger check for the status box display with a timeout to give it a chance to render completely
							window.requestAnimationFrame(this.showHideStatusBox);
												
						if (bndlr.repositionPlusSignsTimeout != false) {
							clearTimeout(bndlr.repositionPlusSignsTimeout);
						}
						bndlr.repositionPlusSignsTimeout = setTimeout(function() {
							bndlr.repositionPlusSigns('#_bndl_'+bundleKey);
						}, 200);
					},
					refreshInstructionsText: function(bundleKey, bundle) {
						
						var numberOfSelectedProducts = this.getNumOfselectedProducts(bundleKey);
						
						var isMissingRequiredProducts = this.isMissingRequiredProducts(bundleKey, bundle);
						
						var content = this.getInstructionsText(bundle, numberOfSelectedProducts, isMissingRequiredProducts);
						
						$('[data-bndlr-key="'+bundleKey+'"] .bndlr-mnm-instructions-text').html(content);
						$('#bndlr-mnm-status-box[data-bndlr-bundle-key="'+bundleKey+'"] .bndlr-mnm-instructions-text').html(content);
					},
					getNumOfselectedProducts: function(bundleKey) {
						var products 		= Library.MixAndMatchBundles.get(bundleKey);
						var productsCount 	= 0;
						for (var key in products) {
							if (products.hasOwnProperty(key)) {
								productsCount += products[key].quantity;
							}
						}
						return productsCount;
					},
					isMissingRequiredProducts: function(bundleKey, bundle) {						
						var products 		= Library.MixAndMatchBundles.get(bundleKey);
						
						var numOfRequiredProducts 		= 0;
						var containedRequiredProducts 	= 0;
						
						for(var key in bundle.products) {
							if (bundle.products.hasOwnProperty(key)) {
								if (bundle.products[key].required === 1) {
									numOfRequiredProducts++;
									
									var productIsContained = false;
									for(var k in products) {
										if (products.hasOwnProperty(k)) {
											if (products[k].product_id == bundle.products[key].id) {
												// The required product IS in the configured bundle
												containedRequiredProducts++;
												productIsContained = true;
												// Break the loop, so we don't count the same product multiple times, as this could increase the contained products count too much
												break;
											}
										}
									}
									
									if (productIsContained === false) {
										// Return true to save loops, as the product is required, but not in the bundle.
										return true;
									}
								}
							}
						}
						
						if (containedRequiredProducts === numOfRequiredProducts) {
							return false;
						} else {
							return true;
						}					
					},
					showHideAddToBundleButtons: function(bundleKey) {
						if (bndlr.MixNMatch.canAddMoreProducts(bundleKey) === false) {
							// Checks if there are already more products selected then they are allowed to be
							widgetView.MixNMatch.hideAddtoBundleButtons(bundleKey);
						} else {
							// there are less than max allowed products selected
							// Loop through products and check if any of them can't be selected anymore
							$('[data-bndlr-key="'+bundleKey+'"] .bndlr-mnm-available-products .bndlr-product').each(function(key, el) {
								var productId = $(el).attr('data-product-id');
								if (bndlr.MixNMatch.canAddMoreProduct(bundleKey, productId) === false) {
									widgetView.MixNMatch.hideAddtoBundleButton(bundleKey, productId);
								} else {
									widgetView.MixNMatch.showAddtoBundleButton(bundleKey, productId);
								}
							});
						}
					},
					canAddMoreProducts: function(bundleKey) {
						// check if any product can still be added to the mix and match bundle
						var bundleId = $('[data-bndlr-key="'+bundleKey+'"]').closest('[data-bundle]').attr('data-bundle');
						bundleId = parseInt(bundleId);
						
						var bundle = bndlr.getBundleById(bundleId);
						var numberOfSelectedProducts = this.getNumOfselectedProducts(bundleKey);
						
						if (bundle.minimum_requirements_n_max_products === null) {
							return true;
						}
						
						if (bundle.minimum_requirements_n_max_products > numberOfSelectedProducts) {
							return true;
						}
						
						return false;
					},
					canAddMoreProduct: function(bundleKey, productId) {
						// check if this product can still be added to the mix and match bundle
						var bundleId 	= $('[data-bndlr-key="'+bundleKey+'"]').closest('[data-bundle]').attr('data-bundle');
						bundleId 		= parseInt(bundleId);
						
						var bundle = bndlr.getBundleById(bundleId);
						
						var products = Library.MixAndMatchBundles.get(bundleKey);
						
						var allowedTotalProductQuantity = bundle.products[productId].quantity;
						
						for(var key in products) {
							if (products.hasOwnProperty(key)) {
								
								if (bundle.product_level == 'product') {
									
									if (products[key].product_id == productId) {
										// Decrease the total allowed for this product by the current variant quantity.
										// This is so because you can have multiple quantities of the same product, but only allow N total items of this product across the variants.
										allowedTotalProductQuantity -= products[key].quantity;
										
										if (allowedTotalProductQuantity <= 0) {
											return false;
										}
										/*
										if (products[key].quantity >= bundle.products[productId].quantity) {
											return false;
										} else {
											return true;
										}*/
									}
								} else {
									if (products[key].variant_id == productId) {
										if (products[key].quantity >= bundle.products[productId].quantity) {
											return false;
										} else {
											return true;
										}
									}
								}
							}
						}
						
						if (allowedTotalProductQuantity > 0) {
							return true;
						} else {
							return false;
						}
					},
					removeFromBundle: function($this) {
						// removes item from mix and match bundle
						var lineItemKey = $this.closest('[data-line-item-key]').attr('data-line-item-key');
						var bundleKey = $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
						
						var products = Library.MixAndMatchBundles.get(bundleKey);

						if (typeof products[lineItemKey] !== 'undefined') {
							delete products[lineItemKey];
							
							Library.MixAndMatchBundles.set(bundleKey, products);

							widgetView.drawSelectedProducts(bundleKey, products);
							if (Object.keys(products).length === 0) {
								widgetView.MixNMatch.fadeOutSelectedProducts(bundleKey);
							}
							this.refreshDisplay(bundleKey);
						}
					},
					productsToString: function(products) {
						// Transforms products object to a string p-product_id:variant_id=quantity&...
						var productsString = '';
						for(var key in products) {
							if (products.hasOwnProperty(key)) {
								productsString += 'p-'+products[key].product_id+'-'+products[key].variant_id+'='+products[key].quantity+'&';
							}
						}
						
						return productsString;
						
					},
					addMixAndMatchBundleToCart: function($this, $outOfWidgetButton) {

						var bundleKey = $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
						var $bundleContainer = $this.closest('[data-bndlr-key]');
						
						var products = Library.MixAndMatchBundles.get(bundleKey);

						$this.addClass('bndlr-loading');
						if (typeof $outOfWidgetButton !== 'undefined') {
							$outOfWidgetButton.addClass('bndlr-loading');
						}
						
						
													if (nav.isShopPage() === false) {
								// This is a third party page.
								// Redirect the user to the quick checkout with a list of selected products
								$this.addClass('bndlr-loading');
								
								var id 		= $this.closest('.bundler-target-element').attr('data-bundle');
								var name 	= $this.closest('[data-bundle-name]').attr('data-bundle-name');
								
								var quickCheckout = nav.getQuickCheckoutUrl(name, id);
								quickCheckout += '?mixnmatch=1&'+this.productsToString(products);
								
								window.location.href = quickCheckout;
								
								return true;
							}
												
						
						var queueKey = 'mixandmatchaddtocart';

						var items = [];
						
						for (var key in products) {
							if (products.hasOwnProperty(key)) {

								(function() {
								
									var variantId 	= products[key].variant_id;
									var quantity 	= products[key].quantity;									
									
									var $el = $bundleContainer.find('.bndlr-mnm-selected-products .bndlr-product[data-line-item-key="'+key+'"]').first();
									// Get all line item properties (mostly subscription props).
									var prodProperties = bndlr.getLineItemProperties($el);
									var props = JSON.parse(JSON.stringify(prodProperties));
									
									// Get all line item properties (mostly subscription props).
									var sellingPlan = bndlr.getSellingPlan($el);
						
									
									// Add item to the array so we can add them to the cart with one ajax call
									items.push({
										id			: variantId,
										quantity	: quantity,
										properties	: props,
										selling_plan: sellingPlan
									});
									
								})();
							}
						}
						
						bndlr.addItemsToCart(items, queueKey, bundleKey, $this, $outOfWidgetButton);
						queue.process(queueKey);
					},
					getInstructionsText: function(bundle, numberOfProducts, isMissingRequiredProducts) {
						var content = '';
						
						var remainingProducts = this.getNumberOfRemainingProducts(bundle, numberOfProducts);
						
						if (remainingProducts>0) {
							content = 'Your bundle needs {{n}} more item(s).';
							content = content.replace('{{n}}', remainingProducts);
						} else if(isMissingRequiredProducts) {
							content = 'Your bundle is missing the required products.';
						}
						
						return content;
					},
					getNumberOfRemainingProducts: function(bundle, numberOfProducts) {
						var remainingProducts = bundle.minimum_requirements_num - numberOfProducts;
						
						if (remainingProducts>0) {
							return remainingProducts;
						}
						
						return 0;
					}
											,
						showHideStatusBox: function() {
							if ($('.bndlr-mnm-add-to-cart-wrapper .bndlr-add-bundle-to-cart').first().is(':visible') === false) {
								$('#bndlr-mnm-status-box').removeClass('bndlr-visibility-hidden').addClass('bndlr-visibility-visible');
							} else {
								var cartButton = $('.bndlr-mnm-add-to-cart-wrapper .bndlr-add-bundle-to-cart').first();
								
								var cbOffsetTop 	= cartButton.offset().top;
								var cbHeight 		= cartButton.height() + 40;
								var windowHeight 	= $(window).height();
								var windowScrollTop = $(window).scrollTop();

								if ((cbOffsetTop+cbHeight) > (windowHeight + windowScrollTop) || (cbOffsetTop) < (windowScrollTop)) {
									// Add bundle to the cart button is NOT in the viewport									
									$('#bndlr-mnm-status-box').removeClass('bndlr-visibility-hidden').addClass('bndlr-visibility-visible');
								} else {
									// Add bundle to the cart button is visible
									$('#bndlr-mnm-status-box').removeClass('bndlr-visibility-visible').addClass('bndlr-visibility-hidden');
								}
							}
						}
									},
				getLineItemProperties: function($productEl) {
					var properties = {};
					
					try {
						$productEl.find('input[name^="properties"]').each(function(i, prop) {
							var val 	= $(prop).val();
							var name 	= $(prop).attr('name').replace('properties[', '').replace(']', '');
							
							properties[name] = val;
						});
					} catch(e) {
						bundlerConsole.log(e);
					}
					
					var productId = $productEl.attr('data-product-id');
					
					$bundleContainer = $productEl.closest('[data-bndlr-key]');
					try {
						// Get line item properties from the whole bundle
						var $subsEl = $bundleContainer.find('.sealsubs-target-element-bundle').first();
						
						$subsEl.find('input[name^="properties"]').each(function(i, prop) {
							var val = $(prop).val();
							var name = $(prop).attr('name').replace('properties[', '').replace(']', '');
							
							properties[name] = val;
						});
						
						if (typeof productId !== 'undefined') {
							// Handle special case for seal subscriptions, where each product has it's own discount hash
							$subsEl.find('input[name^="'+productId+'_properties"]').each(function(i, prop) {
								var val = $(prop).val();
								var name = $(prop).attr('name').replace(productId+'_properties[', '').replace(']', '');
								
								properties[name] = val;
							});	
						}
					} catch(e) {
						bundlerConsole.log(e);
					}
					
					return properties;
				},
				getSellingPlan: function($productEl) {
					var sellingPlan = '';
					
					try {
						sellingPlan = $productEl.find('input[name^="selling_plan"]').val();
					} catch(e) {
						bundlerConsole.log(e);
					}
					
					return sellingPlan;
				},
				productsToString: function(products) {
					// Transforms products object to a string r-p-product_id-variant_id=quantity&...
					var productsString = '';
					for(var key in products) {
						if (products.hasOwnProperty(key)) {
							var prefix = '';
							if (products[key].required) {
								prefix = 'r-';
							}
							productsString += prefix+'p-'+products[key].product_id+'-'+products[key].variant_id+'='+products[key].quantity+'&';
						}
					}
					
					return productsString;
					
				},
				addToCart: function($this) {					
					// Adds bundle products to the cart
					
					if (typeof clientSpecifics['add_to_cart_control'] !== 'undefined') {
						var canContinue = clientSpecifics['add_to_cart_control'].trigger($this.closest('.bundler-target-element'));
					} else {
						var canContinue = true;
					}
					
											if (nav.isShopPage() === false) {
							// This is a third party page.
							// Redirect the user to the quick checkout
							$this.addClass('bndlr-loading');
							
							// Get name and id
							var id 		= $this.closest('.bundler-target-element').attr('data-bundle');
							var name 	= $this.closest('[data-bundle-name]').attr('data-bundle-name');
							
							// Get selected products
							var products = [];
							$this.closest('.bndlr-container').find('.bndlr-product').each(function(key, el) {
								var $el = $(el);
								
								var required = false;
								if ($(el).attr('data-required') === 'true') {
									required = true;
								}
								
								var productId 	= $el.attr('data-product-id');
								var variantId 	= $el.find('select.bndlr-select-variant[name="variant_id"] option:selected').val();
								var quantity 	= $el.attr('data-quantity');
								
								products.push({
									product_id	: productId,
									variant_id	: variantId,
									quantity	: quantity,
									required	: required
								});
							});
							
							
							var quickCheckout = nav.getQuickCheckoutUrl(name, id);
								quickCheckout += '?'+this.productsToString(products); // We should put this function in a separate utility
								
							window.location.href = quickCheckout;
							
							canContinue = false;
						}
										
					if (!canContinue) {
						// Stop here and return, as the client specific logic already handled it
						return false;
					}
					
											if ($this.attr('data-active') === 'false') {
							bundlerConsole.log('One or more products in the bundle are unavailable.');
							return true;
						}
										
					var bundleKey = $this.closest('[data-bndlr-key]').attr('data-bndlr-key');
					
					$this.addClass('bndlr-loading');
					
					var queueKey = 'addtocart';
					

					var properties = {};
					
										
					
					var allProductsAreAvailable = true;

					var items = [];
					
					
					// Get preselected required products from the promotion popup
					var cartItems = [];
					try {
						if ($this.closest('[data-cart-items]').length > 0) {
							cartItems = JSON.parse($this.closest('[data-cart-items]').attr('data-cart-items'));
						}
					} catch(e) {
						console.error(e);
					}
					
					// Get preselected rpoducts from the promotion popup
					var preselectedProducts = [];
					try {
						if ($this.closest('[data-bdnlr-preselected-products]').length > 0) {
							preselectedProducts = JSON.parse($this.closest('[data-bdnlr-preselected-products]').attr('data-bdnlr-preselected-products'));
						}
					} catch(e) {
						console.error(e);
					}
					// Get preselected required products from the promotion popup
					var preselectedProductsRequired = [];
					try {
						if ($this.closest('[data-bdnlr-preselected-products-required]').length > 0) {
							preselectedProductsRequired = JSON.parse($this.closest('[data-bdnlr-preselected-products-required]').attr('data-bdnlr-preselected-products-required'));
						}
					} catch(e) {
						console.error(e);
					}

					$this.closest('.bndlr-container').find('.bndlr-product').each(function(key, el) {
						
						var $el = $(el);
						
												
						// Get all line item properties (mostly subscription props).
						var prodProperties = bndlr.getLineItemProperties($el);
						
						// Add other predefined properties
						for(var k in properties) {
							if (properties.hasOwnProperty(k)) {
								prodProperties[k] = properties[k];
							}
						}
						
						// Get all line item properties (mostly subscription props).
						var sellingPlan = bndlr.getSellingPlan($el);
						
						var variantId 	= $(el).find('select.bndlr-select-variant[name="variant_id"] option:selected').val();
						var quantity 	= $(el).attr('data-quantity');
						
						// Check if this product is already in the cart and we don't have to add it again
						if ($(el).attr('data-required') === 'false') {
							//var productId = $(el).attr('data-product-id');
							if (preselectedProducts.length > 0) {
								for (var j = 0; j<preselectedProducts.length; j++) {
									
									//if (preselectedProducts[j].product_id == productId && preselectedProducts[j].variant_id == variantId) {
									if (preselectedProducts[j].variant_id == variantId) {
										if (preselectedProducts[j].quantity == quantity) {
											// Skip this product, as it is already in the cart
											return;
										}
									}									
								}
							}
						} else if ($(el).attr('data-required') === 'true') {
							//var productId = $(el).attr('data-product-id');
							if (preselectedProductsRequired.length > 0) {
								for (var j = 0; j<preselectedProductsRequired.length; j++) {
									
									//if (preselectedProductsRequired[j].product_id == productId && preselectedProductsRequired[j].variant_id == variantId) {
									if (preselectedProductsRequired[j].variant_id == variantId) {
										if (preselectedProductsRequired[j].quantity == quantity) {
											// Skip this product, as it is already in the cart
											return;
										}
									}									
								}
							}
						}
						
						// loop through cart items which were passed from the promotion and use any of the products there to just increase the quantity
						// (to keep the line item properties
						for (var k = 0; k<cartItems.length; k++) {
							if (cartItems[k].quantity > 0 && cartItems[k].quantity < quantity && cartItems[k].variant_id == variantId) {
								
								quantity = quantity - cartItems[k].quantity;
								cartItems[k].quantity = 0;
								
								if (Object.keys(prodProperties).length === 0 && cartItems[k].properties !== null && Object.keys(cartItems[k].properties).length > 0) {
									// If the item from the bundle doesn't have any properties and the one in the cart has, add properties to the new item from the item which is already in the cart
									prodProperties = JSON.parse(JSON.stringify(cartItems[k].properties));
								}
							}
						}

						if (typeof variantId === 'undefined') {
							// It looks like the variant selector is without any options. Display error message.
							var productTitle = $(el).find('.bndlr-product-title').first().text();
							// Show warning/error message. It has to be sent in the correct format (HTTP response).
							bndlr.showWarningMessage({
								responseJSON: {
									description: 'Product: '+productTitle+' is not available.'
								}
							}, bundleKey);
							allProductsAreAvailable = false;
						} else {
						
							var props = JSON.parse(JSON.stringify(prodProperties));
							
							// Add item to the array so we can add them to the cart with one ajax call
							items.push({
								id			: variantId,
								quantity	: quantity,
								properties	: props,
								selling_plan: sellingPlan
							});
						}
					});
					
					bndlr.addItemsToCart(items, queueKey, bundleKey, $this);
					
					if (allProductsAreAvailable) {
						// Process queue only if all products were available (not even 1 was missing a variant selector.
						queue.process(queueKey);
					} else {
						// Cancel the queue as one or more products were unavailable
						queue.cancel(queueKey);
					}
				},
				addItemsToCart: function(items, queueKey, bundleKey, $this, $outOfWidgetButton) {
					queue.add(queueKey, function() {
						cart.addMultipleItemsToCart(nav.getRootUrl(), items).done(function(response) {
							
							queue.tick(queueKey);
							for (var n = 0; n < items.length; n++) {
															
								try {
									var productId = 0;
									var variantId = items[n].id;
									// Get product id from the response, as we can't get it otherwise
									for(var m = 0; m<response.items.length; m++) {
										if (response.items[m].variant_id == variantId) {
											productId = response.items[m].product_id;
											break;
										}
									}
									//console.log('addtocart', productId, variantId, items[n].quantity);
									BndlrAnalytics.track('addtocart', productId, variantId, items[n].quantity);
								} catch(e) {
									bundlerConsole.log(e);
								}
							}
							
							
						}).fail(function(r) {
							// Todo handle case where product is not in stock and can't be added to the cart.
							
							$this.removeClass('bndlr-loading');
							if (typeof $outOfWidgetButton !== 'undefined') {
								$outOfWidgetButton.removeClass('bndlr-loading');
							}
							
							bndlr.showWarningMessage(r, bundleKey);
							queue.cancel(queueKey);
						});
					}, function() {

												
						if ($this.closest('.bundler-target-element[data-bdnlr-preselected-products]').length > 0) {
							
							$('.bndlr-add-to-cart').removeClass('bndlr-loading');
							widgetView.addToCartButton.showCheckmark($this);
							//bndlr.afterAddToCartAction();
							// Trigger event which lets the promo part of the app know that the bundle was added to the cart
							$(document).trigger('bndlr:bundle_added_to_cart');
							
							$('body').trigger('added.ajaxProduct');
							cart.updateCart();
							
						} else {
															var urlLocale = nav.getUrlLocale();
								if (urlLocale !== '') {
									window.location.href = '/'+urlLocale+'/cart';
								} else {
									window.location.href = '/cart';
								}							
													}
						
					}
				);
				},
				afterAddToCartAction: function() {
										$('body').trigger('added.ajaxProduct');

					cart.updateCart();

					if ($('#sidebar-cart').length > 0 ||
						$('#slidecarthq').length > 0 || 
						$('form.cart-drawer').length > 0 || 
						$('#mini-cart').length > 0) {

						// This theme has a sidebar cart 
						// Delay price update so the drawer can get updated
						setTimeout(function() {
							DiscountEstimator.showPopup();
						}, 1000);
					} else {
						DiscountEstimator.showPopup();
					}
				},
				closeMessage: function() {
					
											$('#bndlr-discount-message').animate({bottom: '-100%'}, 1000);
									},
				setCookie: function(cname, cvalue, exdays) {
					var d = new Date();
					if (exdays > 0) {
						d.setTime(d.getTime() + (exdays*24*60*60*1000));
						var expires = "expires="+ d.toUTCString();
						document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
					} else {
						document.cookie = cname + "=" + cvalue + ";path=/";
					}					
				},
				getCookie: function(cname) {
					var name = cname + "=";
					var decodedCookie = decodeURIComponent(document.cookie);
					var ca = decodedCookie.split(';');
					for(var i = 0; i <ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) == ' ') {
							c = c.substring(1);
						}
						if (c.indexOf(name) == 0) {
							return c.substring(name.length, c.length);
						}
					}
					return "";
				},
				showWarningMessage: function(response, bundleKey) {

					this.stopAddtcAnimation(bundleKey);
					var c = 'This product was not added to cart.';
					c = 'undefined' == typeof response.responseJSON ? $.parseJSON(response.responseText).description : response.responseJSON.description,
					warningHtml = '<div class="bndlr-warning" style="display:none">' + c + '</div>';
					$.each($('[data-bndlr-key="'+bundleKey+'"] .bndlr-warning'), function (d, e) {
						$(e).remove()
					});
					$('[data-bndlr-key="'+bundleKey+'"] .bndlr-products-container').first().append($(warningHtml)),
					$('[data-bndlr-key="'+bundleKey+'"] .bndlr-warning').fadeIn(500, function () {
						setTimeout(function () {
							$('[data-bndlr-key="'+bundleKey+'"] .bndlr-products-container').children('.bndlr-warning').first().fadeOut(500)
						}, 4e3)
					})
				},
				stopAddtcAnimation: function(bundleKey) {
					$('[data-bndlr-key="'+bundleKey+'"] .bndlr-add-to-cart').removeClass('bndlr-loading');
				}
			};
			
			var DiscountEstimator = {
	showPopup: function() {
		if (nav.isShopPage()) {						
			this.calculateDiscounts();
		}
	},
	updateCartDiscountsTimeout: false,
	updateCartDiscounts: function() {
		if (this.updateCartDiscountsTimeout !== false) {
			clearTimeout(this.updateCartDiscountsTimeout);
		}
		
		this.updateCartDiscountsTimeout = setTimeout(function() {
			DiscountEstimator.calculateDiscounts(false);
		}, 410);
		
	},
			isEligibleForDiscount: '',
		runIfCanGetDiscount: function(successCallback, failCallback) {
			// Not sure why we use this flag. Probably to avoid too many requests to the cart.
			if (this.isEligibleForDiscount === '') {
			
				var self = this;
				
				var cartEndpoint = 'default';						
				cart.get(cartEndpoint).done(function(cartData) {
					var discountValue = self.calculateDiscount(cartData);
					
					if (discountValue > 0) {
						self.isEligibleForDiscount = true;
						successCallback();
					} else {
						self.isEligibleForDiscount = false;
						
						if (typeof failCallback === 'function') {
							failCallback();
						}
						
						setTimeout(function() {
							// Reset this flag
							self.isEligibleForDiscount = '';
						}, 400);
					}							
				});
			} else {
				if (this.isEligibleForDiscount === true) {
					successCallback();
				} else {
					if (typeof failCallback === 'function') {
						failCallback();
					}
				}
			}
		},
		calculateDiscounts: function(showPopup) {
		if (typeof showPopup === 'undefined') {
			showPopup = true;
		}
		
					var self = this;
			
			var cartEndpoint = 'default';
						
			cart.get(cartEndpoint).done(function(cartData) {

								
				var discountValue 				= self.calculateDiscount(cartData);
				var canGetFreeShippingDiscount 	= self.canGetFreeShippingDiscount(cartData);
				
								
								
					
				if (showPopup === true) {
									}
				
									self.displayDiscountInCart(discountValue, cartData);
								
			});
			},
		getMultiplier: function(applicableCombo) {
		var multiplier = 1;
		if (typeof applicableCombo.multiplier === 'number') {
			multiplier = applicableCombo.multiplier;
		}
		
		return multiplier;
	},
	canGetFreeShippingDiscount: function(cartData) {
		var isEligibleForFreeShippingDiscount = false;
		
					cartData.items = cartData.items.sort(function(a, b) {
				return a.quantity - b.quantity;
			});
			
			var $applicableBundles 	= this.getApplicableBundles(cartData);
			var applicableCombos 	= this.getApplicableCombosAll(cartData, $applicableBundles);					
			
			var appliedCombos = {};
			
			applicableCombosLoop:
			for (var i = 0; i < applicableCombos.length; i++) {
				
				for (var productId in applicableCombos[i]) {
					
					if (applicableCombos[i].hasOwnProperty(productId)) {
						var item = applicableCombos[i][productId];

						for (var k = 0; k < $applicableBundles.length; k++) {
							if ($applicableBundles[k].id == item.bundle_id) {
								var $bundle = $applicableBundles[k];
								
								// stop loop
								k = $applicableBundles.length;
							}
						}
						
						if (typeof $bundle.free_shipping !== 'undefined' && $bundle.free_shipping === 'true') {
							isEligibleForFreeShippingDiscount = true;
							break applicableCombosLoop;
						}
					}
				}
			}
				
		return isEligibleForFreeShippingDiscount;
	},
	removeBundledItemsFromCart: function(cartItems) {					
		// For all bundles
		for (var k = 0; k < bundles.length; k++) {
			// Prepare all applicable combos for this bundle and remove the quantity for these products from the cart.
			// We don't actually need the combos variable. We just want to reduce the quantity of items from the cart (by reference).
			var combos = this.getApplicableCombosForBundle(cartItems, bundles[k]);
		}
		
		// No need to actually return anything because we reduce quantity by reference, but we are returning here just for the sake of simplicity and easier understanding of the code
		return cartItems;
	},
	calculateDiscount: function(cartDataVar) {
		// Deep copy the cart data
		var cartData = JSON.parse(JSON.stringify(cartDataVar));
		
		cartData.items = cartData.items.sort(function(a, b) {
			return a.quantity - b.quantity;
		});
		
		
				
		var $applicableBundles 	= this.getApplicableBundles(cartData);
		var applicableCombos 	= this.getApplicableCombosAll(cartData, $applicableBundles);

		

		// bundlerConsole.log(JSON.parse(JSON.stringify($applicableBundles)));
		// bundlerConsole.log(JSON.parse(JSON.stringify(applicableCombos)));
		
		
		// Calculate discounts for each applicable item
		var totalDiscountValue = 0;
		var appliedCombos = {};

		for (var i = 0; i < applicableCombos.length; i++) {

			var $bundle = null;
			var originalAmount = 0;
			
			var totalBundleDiscountAmount = 0;
			
			for (var productId in applicableCombos[i]) {
				if (typeof appliedCombos[i] == 'undefined') {
					
					if (applicableCombos[i].hasOwnProperty(productId)) {
					
						var item = applicableCombos[i][productId];

						if ($bundle === null) {
							for (var k = 0; k < $applicableBundles.length; k++) {
								if ($applicableBundles[k].id == item.bundle_id) {
									$bundle = $applicableBundles[k];
									// break loop
									k = $applicableBundles.length;
								}
							}
							
							originalAmount = this.getTotalOriginalAmount(applicableCombos[i])/100;
						}
						
						var discountType 	= $bundle.discount_type;
						var volumeDiscount = [];
						if (typeof item.volume_discount !== 'undefined') {
							discountType 	= item.volume_discount.discount_type;
							volumeDiscount 	= item.volume_discount;
							
							// Simulate the bundle discount for this volume discount
							$bundle.discount_type 		= item.volume_discount.discount_type;
							$bundle.percentage_value 	= item.volume_discount.discount_value;
							$bundle.fixed_amount_value 	= item.volume_discount.discount_value;
						}
					
						var itemDiscountAmount = 0;
						
						if (item.type === 'discounted') {
							if (discountType === 'fixed_amount') {
								
								// Apply max bundle price or normal discount amount
								var maxAmount = originalAmount;
								
								var ratio = (item.price/100 * item.quantity)/originalAmount;
								itemDiscountAmount = ratio*(1*$bundle.fixed_amount_value);
								
								if (itemDiscountAmount < 0) {
									itemDiscountAmount = 0;
								}
								
								// Check if we have to reduce the discount amount because of rounding
								if ((totalBundleDiscountAmount + itemDiscountAmount) > (1*$bundle.fixed_amount_value)) {
									itemDiscountAmount = (1*$bundle.fixed_amount_value) - totalBundleDiscountAmount;
								}
								
								totalBundleDiscountAmount += itemDiscountAmount;
								
							} else if (discountType === 'fixed_price') {

								var ratio = 1 - (1*$bundle.fixed_price_value)/originalAmount;
								itemDiscountAmount = item.price/100 * item.quantity * ratio;
								var maxDiscount = originalAmount - (1*$bundle.fixed_price_value);
								
								if (itemDiscountAmount < 0) {
									itemDiscountAmount = 0;
								}
								
								if ((totalBundleDiscountAmount + itemDiscountAmount) > maxDiscount) {
									itemDiscountAmount = maxDiscount - totalBundleDiscountAmount;
								}
								
								totalBundleDiscountAmount += itemDiscountAmount;
								
							} else if (discountType === 'percentage') {
								// 2020-07-20 round on product level and then multiply by quantity, otherwise the discount might be different from the actually applied discount
								// e.g. 4 mugs ($12.5 each), 50.1% discount. discount per mug is $6.2625, which gets rounded to $6.26x4 = 25.04. But if you multiply by 4 first, then the total
								// discount will be $25.05 <- 1 cent difference
								itemDiscountAmount = (Math.round(($bundle.percentage_value/100) * item.price) * item.quantity) / 100;
								
							}  else if (discountType === 'products_discounts') {

								var productId = item.product_id;
								var variantId = item.variant_id;
								if (typeof $bundle.products[productId].variants[variantId].discount_amount !== 'undefined') {
									var discountAmount = $bundle.products[productId].variants[variantId].discount_amount*1;
									var itemPrice = item.price*item.quantity/100;

									if ($bundle.minimum_requirements == 'n_products') {
										discountAmount = discountAmount*item.quantity;
									}

									if (itemPrice - discountAmount >= 0) {
										itemDiscountAmount = discountAmount;
									} else {
										// Item price is lower than the discount
										itemDiscountAmount = itemPrice;
									}
								}
							}
						}
						
						// The multiplier is used for the pre-paid subscriptions
						totalDiscountValue += itemDiscountAmount*this.getMultiplier(item);
					}
				}
			}
		}

		totalDiscountValue = Math.round(totalDiscountValue * 100) / 100; // Round to 2 decimal points
		totalDiscountValue = totalDiscountValue * 100; // Increase total number to remove decimals
		//this.displayCartValue(totalDiscountValue, cartData);
		
		return totalDiscountValue;
	},
	/**
	 * Returns total original amount for all products in the combo
	 */
	getTotalOriginalAmount: function(combo) {
		var totalAmount = 0;
		for(var productId in combo) {
			if (combo.hasOwnProperty(productId)) {
				if (typeof combo[productId] !== 'undefined' && combo[productId].type === 'discounted') {
					totalAmount += bndlr.getPrice(combo[productId].price)*combo[productId].quantity;
				}
			}
		}
		
		return totalAmount;
	},
	canApplyBundle: function(items, bundle) {
		
		var requiredProductsCounter = 0;
		
		if (bundle.minimum_requirements === 'volume_discounts') {
			return true;
		}
		
		// For bundle products
		for (var productId in bundle.products) {
			if (bundle.products.hasOwnProperty(productId)) {
				var isInCart = false;
				
				var product = bundle.products[productId];
				// for bundle product variants
				for (var variantId in product.variants) {
					if (product.variants.hasOwnProperty(variantId)) {
						
						// for cart items
						for (var i = 0; i < items.length; i++) {
							if (variantId == items[i].variant_id) {
								
								if (bundle.minimum_requirements === 'all_products' || bundle.minimum_requirements === 'specific_products') {
									isInCart = true;
								} else if (bundle.minimum_requirements === 'n_products') {
									isInCart = true;
									if (product.quantity < items[i].quantity) {
										// Actual quantity in cart is bigger than max allowed quantity
										requiredProductsCounter += product.quantity;
									} else {
										requiredProductsCounter += items[i].quantity;
									}
								}
							}
						}
					}
				}
				
				if (bundle.minimum_requirements === 'all_products' || bundle.minimum_requirements === 'specific_products') {
					if (isInCart === false) {
						return false;
					}
				}
			}
		}
		
		if (bundle.minimum_requirements === 'n_products') {
			if (requiredProductsCounter >= bundle.minimum_requirements_num) {
				return true;
			} else {
				return false; 
			}
		} else {
			return true;
		}
	},
	getApplicableBundles: function(cartData) {
		// Get bundles which can be applied to the cart items
		var $applicableBundles = [];
		
		for (var i = 0; i < bundles.length; i++) {
			// Why do we even have to check if we can apply the bundle?
			// We will check it in the next step
			if (this.canApplyBundle(cartData.items, bundles[i])) {
				$applicableBundles.push(bundles[i]);
			}
			
		}

		return $applicableBundles;
	},
	/**
	 * Substracts quantity from cart and creates list of combos (bundles) with their products and bundle id.
	 */
	getApplicableCombosAll: function(cartData, $applicableBundles) {

		// Get applicable items from cart for the applicable bundles					
		var $applicableItems = {};
		var applicableCombos = [];
		var cartCopy = JSON.parse(JSON.stringify(cartData));
		
		var cartItems = JSON.parse(JSON.stringify(cartData.items));
		
		// For applicable bundles
		for (var k = 0; k < $applicableBundles.length; k++) {

			// Get applicable combos for this bundle
			var combos = this.getApplicableCombosForBundle(cartItems, $applicableBundles[k]);

			for (var i = 0; i < combos.length; i++) {
				var canApplyCombo = true;
				
				if (typeof combos[i] === 'undefined') {
					// Skip empty slots
					continue;
				}

				// for combos 
				// subsctract quantity from cart items
				for (var productId in combos[i]) {
					if (combos[i].hasOwnProperty(productId)) {
						var canApplyProduct = false;
						var product = combos[i][productId];
						for (var j = 0; j < cartCopy.items.length; j++) {
							var lineItem = cartCopy.items[j];
							if (lineItem.variant_id == product.variant_id) {

								if (lineItem.quantity >= product.quantity && j == product.line_item_id) {
									canApplyProduct = true;
									lineItem.quantity -= product.quantity;
								}
							}
						}
						
						if (canApplyProduct === false) {
							canApplyCombo = false;
						}
					}
				}
				
				if (canApplyCombo) {
					// Why do we even have to check again if we can apply the combo? It was already checked in the previous method.
					applicableCombos.push(combos[i]);
				} else {
					// TODO return quantity back to cart copy?
				}
			}
		}
		
		return applicableCombos;
	},
	getApplicableCombosForBundle: function(cartItems, bundle) {
		// Quantity in cartItems object is reduced by reference so each item gets applied only the number of times it is in the cart

		var combos = [];
		var comboId = 0;
		var loop = true;
		// product quantity count is used for making sure that we don't apply more than maximum allowed number of products to the combo
		var productQuantityCount = 0;

		while(loop) {
			
			if (comboId > 10000) {
				loop=false;
				bundlerConsole.log('-- Terminating loop --');
			}
			
			if (bundle.minimum_requirements === 'specific_products') {

				// for required bundle products
				for (var productId in bundle.required_products) {
					if (bundle.required_products.hasOwnProperty(productId)) {
						var product 		= bundle.required_products[productId];
						var productVariants = bundle.required_products[productId].variants;

						cartItemsLoop:
						// for cart items
						for (var i = 0; i < cartItems.length; i++) {
							// for required bundle product variants
							for (var variantId in productVariants) {
								if (productVariants.hasOwnProperty(variantId)) {
									
									var quantity = product.quantity;

									if (variantId == cartItems[i].variant_id) {
									
										var applyCombo = false;
										var apQuantity = cartItems[i].quantity;
										
										if (cartItems[i].quantity >= quantity) {
											apQuantity = quantity;
											applyCombo = true;
										}
			
										if (applyCombo) {
											if (typeof combos[comboId] === 'undefined') {
												combos[comboId] = {};
											}

											var key = i;
											
											var origLineItem = i;
											if (typeof cartItems[i].orig_line_item_id !== 'undefined') {
												// Shopify POS integration needs original line item id so it knows on which item to set the discount
												// The items are sorted by ascending quantity
												origLineItem = cartItems[i].orig_line_item_id;
											}
											
											combos[comboId]['required_'+key] = {
												product_id 			: productId,
												variant_id 			: cartItems[i].variant_id,
												line_item_id 		: i,
												orig_line_item_id	: origLineItem,
												bundle_id 			: bundle.id,
												price				: cartItems[i].price,
												quantity 			: apQuantity,
												discount_type		: bundle.discount_type,
												type				: 'required'
											};
											
											cartItems[i].quantity -= apQuantity;

											break cartItemsLoop;
										}
									}
								}
							}
						}
					}
				}
			}
			
			productQuantityCount = 0;
			// Object which contains quantity counter for each product for mix&match bundle. 
			// This way, we can limit the total variants from the product according to the actual specification.
			var remainingEachProductQuantity = {};
			
			// Add required products from Mix & Match bundle to the combo. This allows us to set a few products in the mix & match bundles as required.
			// For example, get a discount on product A if you buy it together with any other product. 
			if (bundle.minimum_requirements === 'n_products') {
				// For bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						var product 		= bundle.products[productId];
						var productVariants = bundle.products[productId].variants;
						
						if (typeof remainingEachProductQuantity[productId] === 'undefined') {
							remainingEachProductQuantity[productId] = product.quantity;
						}
					
						// For bundle product variants
						for (var variantId in productVariants) {
							if (productVariants.hasOwnProperty(variantId)) {
								
								if (productVariants[variantId].required === 1) {
								
									var quantity = product.quantity;
									
									// For cart items
									for (var i = 0; i < cartItems.length; i++) {
										
										if (variantId == cartItems[i].variant_id) {
										
											var applyCombo = false;
											var apQuantity = cartItems[i].quantity;
											
											if (cartItems[i].quantity > 0) {
												var remainingQuantity = remainingEachProductQuantity[productId];
												
												if (cartItems[i].quantity > remainingQuantity) {
													// Reduce the variant quantity to the maximum remaining allowed quantity
													// The max quantity limit has to be applied across all variants of this product
													apQuantity = remainingQuantity;
												}
												
												
												// Check if merchant set max allowed products for the bundle
												// Check if total quantity will be more than maximum allowed one
												if (bundle.minimum_requirements_n_max_products !== null 
													&& bundle.minimum_requirements_n_max_products !== '' 
													&& (productQuantityCount + apQuantity) > bundle.minimum_requirements_n_max_products) {
													
													// Reduce the applied quantity to maximum allowed one
													apQuantity = bundle.minimum_requirements_n_max_products - productQuantityCount;
												}
												
												// If quantity is still more than 0, apply it to the bundle
												if (apQuantity > 0) {
												
													// Subtract the applied quantity from the max allowed quantity
													quantity 								-= apQuantity;
													// Subtract the applied quantity from the total allowed quantity for this product
													remainingEachProductQuantity[productId] -= apQuantity;
													productQuantityCount 					+= apQuantity;														
												
													applyCombo = true;
												}
												
												
												if (applyCombo) {
													if (typeof combos[comboId] === 'undefined') {
														combos[comboId] = {};
													}
													
													// Use item id, as the same product can be in the order multiple times (with different properties)
													var key = i;
													
													var origLineItem = i;
													if (typeof cartItems[i].orig_line_item_id !== 'undefined') {
														// Shopify POS integration needs original line item id so it knows on which item to set the discount
														// The items are sorted by ascending quantity
														origLineItem = cartItems[i].orig_line_item_id;
													}
													
													combos[comboId][key] = {
														product_id 			: productId,
														variant_id 			: cartItems[i].variant_id,
														line_item_id 		: i,
														orig_line_item_id	: origLineItem,
														bundle_id 			: bundle.id,
														price				: cartItems[i].price,
														quantity 			: apQuantity,
														discount_type		: bundle.discount_type,
														type				: 'discounted'
													};
													
													cartItems[i].quantity -= apQuantity;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			
							if (bundle.minimum_requirements === 'volume_discounts') {
					
					// Loop through volume discounts, bundle products, cart items and cpush in as many products as you can for each volume discount
					
					for (var p = (bundle.volume_discounts.length - 1); p >= 0; p--) {
						
						var volumeDiscount = bundle.volume_discounts[p];
						
						var minTotal 	= volumeDiscount.min_items; // The minimum quantity requirements are checked below
						var max 		= volumeDiscount.max_items;
						var rangeType 	= volumeDiscount.range_type; // Possible values: fixed_quantity, range, min_limit_only

						var totalItemsInCombo 			= 0;
						var totalProductQuantityInCombo = {};
					
						if (bundle.product_target_type === 'all_products') {
							// ALL PRODUCTS 
							
							var maxQuantity = minTotal;
									
							if (rangeType === 'range' && max !== '' && max !== null) {
								maxQuantity = max;
							}
							
							if (rangeType === 'min_limit_only') {
								// Set max quantity to null, as we don't have any limit set up
								maxQuantity = null;
							}
							
							var originalMaxQuantity = maxQuantity;

							// Firs tcart items loop
							for (var j = 0; j < cartItems.length; j++) {
								var productId = cartItems[j]['product_id'];
								totalProductQuantityInCombo[productId] = 0;

								// Second cart items loop
								for (var i = 0; i < cartItems.length; i++) {
									
									if (productId == cartItems[i]['product_id']) {
										// Product ID has to be the same
									
										var apQuantity = cartItems[i].quantity;
										var applyCombo = false;
										
										if (apQuantity > 0) {
											
											if (maxQuantity !== null && apQuantity > maxQuantity) {
												apQuantity = maxQuantity;
											}
											
											// If quantity is still more than 0, apply it to the bundle
											if (apQuantity > 0) {
												
												applyCombo = true;
											
												if (maxQuantity !== null) {
													// Subtract the applied quantity from the max allowed quantity
													maxQuantity -= apQuantity;
												}
											}
											
											
											if (applyCombo) {
												if (typeof combos[comboId] === 'undefined') {
													combos[comboId] = {};
												}
												
												// Use item id, as the same product can be in the order multiple times (with different properties)
												var key = i;
												
												var origLineItem = i;
												if (typeof cartItems[i].orig_line_item_id !== 'undefined') {
													// Shopify POS integration needs original line item id so it knows on which item to set the discount
													// The items are sorted by ascending quantity
													origLineItem = cartItems[i].orig_line_item_id;
												}
												
												combos[comboId][key] = {
													product_id 			: productId,
													variant_id 			: cartItems[i].variant_id,
													line_item_id 		: i,
													orig_line_item_id	: origLineItem,
													bundle_id 			: bundle.id,
													price				: cartItems[i].price,
													quantity 			: apQuantity,
													discount_type		: bundle.discount_type,
													type				: 'discounted',
													volume_discount		: JSON.parse(JSON.stringify(volumeDiscount))
												};
												
												cartItems[i].quantity -= apQuantity;
												
												totalItemsInCombo 						+= apQuantity;
												totalProductQuantityInCombo[productId] 	+= apQuantity;
											}
										}
									}
								}
								
								if (bundle.volume_bundle_combine_quantites !== 'true') {
									
									if (totalProductQuantityInCombo[productId] < volumeDiscount.min_items*1) {
										// Return quantity back to cart
										this.returnQuantityToCartItem(cartItems, combos[comboId]);
										// Reset the combo as it doesn't fulfill the needs
										combos[comboId] = {};
									}
									
									// Reset the max quantity to the original one, as it was reduced to get all products
									maxQuantity = originalMaxQuantity;
									
									totalProductQuantityInCombo[productId] = 0;
									
									comboId++;
								}
							}
						} else {
							// SPECIFIC PRODUCTS
							
							// For bundle products
							for (var productId in bundle.products) {
								if (bundle.products.hasOwnProperty(productId)) {
									var product 		= bundle.products[productId];
									var productVariants = bundle.products[productId].variants;
									
									var maxQuantity = minTotal;
									
									if (rangeType === 'range' && max !== '' && max !== null) {
										maxQuantity = max;
									}
									
									if (rangeType === 'min_limit_only') {
										// Set max quantity to null, as we don't have any limit set up
										maxQuantity = null;
									}
									
									var originalMaxQuantity = maxQuantity;
									
									totalProductQuantityInCombo[productId] = 0;
								
									// For bundle product variants
									for (var variantId in productVariants) {
										if (productVariants.hasOwnProperty(variantId)) {

											// For cart items
											for (var i = 0; i < cartItems.length; i++) {
												
												if (variantId == cartItems[i].variant_id) {
												
													var apQuantity = cartItems[i].quantity;
													var applyCombo = false;
													
													if (apQuantity > 0) {
														
														if (maxQuantity !== null && apQuantity > maxQuantity) {
															apQuantity = maxQuantity;
														}
														
														// If quantity is still more than 0, apply it to the bundle
														if (apQuantity > 0) {
															
															applyCombo = true;
														
															if (maxQuantity !== null) {
																// Subtract the applied quantity from the max allowed quantity
																maxQuantity -= apQuantity;
															}
														}
														
														
														if (applyCombo) {
															if (typeof combos[comboId] === 'undefined') {
																combos[comboId] = {};
															}
															
															// Use item id, as the same product can be in the order multiple times (with different properties)
															var key = i;
															
															var origLineItem = i;
															if (typeof cartItems[i].orig_line_item_id !== 'undefined') {
																// Shopify POS integration needs original line item id so it knows on which item to set the discount
																// The items are sorted by ascending quantity
																origLineItem = cartItems[i].orig_line_item_id;
															}
															
															combos[comboId][key] = {
																product_id 			: productId,
																variant_id 			: cartItems[i].variant_id,
																line_item_id 		: i,
																orig_line_item_id	: origLineItem,
																bundle_id 			: bundle.id,
																price				: cartItems[i].price,
																quantity 			: apQuantity,
																discount_type		: bundle.discount_type,
																type				: 'discounted',
																volume_discount		: JSON.parse(JSON.stringify(volumeDiscount))
															};
															
															cartItems[i].quantity -= apQuantity;
															
															totalItemsInCombo 						+= apQuantity;
															totalProductQuantityInCombo[productId] 	+= apQuantity;
														}
													}
												}
											}
											
										}
									}
									
									if (bundle.volume_bundle_combine_quantites !== 'true') {
										
										if (totalProductQuantityInCombo[productId] < volumeDiscount.min_items*1) {
											// Return quantity back to cart
											this.returnQuantityToCartItem(cartItems, combos[comboId]);
											// Reset the combo as it doesn't fulfill the needs
											combos[comboId] = {};
										}
										
										// Reset the max quantity to the original one, as it was reduced to get all products
										maxQuantity = originalMaxQuantity;
										
										totalProductQuantityInCombo[productId] = 0;
										
										comboId++;
									}
								}
							}
						}
						
						if (totalItemsInCombo < volumeDiscount.min_items*1) {
							// Return quantity back to cart
							this.returnQuantityToCartItem(cartItems, combos[comboId]);
							// Reset the combo as it doesn't fulfill the needs
							combos[comboId] = {};
						}
						comboId++;
					}
					// This is the end of this volume discount bundle, so just return the combos back to the invoker
					return combos;
				}
						
			// for bundle products
			for (var productId in bundle.products) {
				if (bundle.products.hasOwnProperty(productId)) {
					var product 		= bundle.products[productId];
					var productVariants = bundle.products[productId].variants;
					
					if (typeof remainingEachProductQuantity[productId] === 'undefined') {
						remainingEachProductQuantity[productId] = product.quantity;
					}
				
					productsLoop:
					// for bundle product variants
					for (var variantId in productVariants) {
						if (productVariants.hasOwnProperty(variantId)) {
							
							var quantity = product.quantity;
							
							
							variantsLoop:
							// for cart items
							for (var i = 0; i < cartItems.length; i++) {
								
								if (variantId == cartItems[i].variant_id) {
								
									var applyCombo = false;
									var apQuantity = cartItems[i].quantity;
									
									if ((bundle.minimum_requirements === 'all_products' || bundle.minimum_requirements === 'specific_products')
										&& cartItems[i].quantity >= quantity) {

										apQuantity = quantity;
										applyCombo = true;
									} else if(bundle.minimum_requirements === 'n_products' && cartItems[i].quantity > 0) {
										
										var remainingQuantity = remainingEachProductQuantity[productId];
										
										if (cartItems[i].quantity >= remainingQuantity) {
											// Reduce the variant quantity to the maximum remaining allowed quantity
											// The max quantity limit has to be applied across all variants of this product
											apQuantity = remainingQuantity;
										}
										
										
										// Check if merchant set max allowed products for the bundle
										// Check if total quantity will be more than maximum allowed one
										if (bundle.minimum_requirements_n_max_products !== null 
											&& bundle.minimum_requirements_n_max_products !== '' 
											&& (productQuantityCount + apQuantity) > bundle.minimum_requirements_n_max_products) {
											
											// Reduce the applied quantity to maximum allowed one
											apQuantity = bundle.minimum_requirements_n_max_products - productQuantityCount;
										}
										
										// If quantity is still more than 0, apply it to the bundle
										if (apQuantity > 0) {
										
											// Subtract the applied quantity from the max allowed quantity
											quantity 								-= apQuantity;
											// Subtract the applied quantity from the total allowed quantity for this product
											remainingEachProductQuantity[productId] -= apQuantity;
											productQuantityCount 					+= apQuantity;														
										
											applyCombo = true;
										}
									}
									
									if (applyCombo) {
										if (typeof combos[comboId] === 'undefined') {
											combos[comboId] = {};
										}
										
										if (bundle.minimum_requirements === 'n_products' || bundle.minimum_requirements === 'specific_products') {
											// var key = variantId;
											// Use item id, as the same product can be in the order multiple times (with different properties)
											var key = i;
										} else {
											var key = productId;
										}
										
										var origLineItem = i;
										if (typeof cartItems[i].orig_line_item_id !== 'undefined') {
											// Shopify POS integration needs original line item id so it knows on which item to set the discount
											// The items are sorted by ascending quantity
											origLineItem = cartItems[i].orig_line_item_id;
										}
										
										combos[comboId][key] = {
											product_id 			: productId,
											variant_id 			: cartItems[i].variant_id,
											line_item_id 		: i,
											orig_line_item_id	: origLineItem,
											bundle_id 			: bundle.id,
											price				: cartItems[i].price,
											quantity 			: apQuantity,
											discount_type		: bundle.discount_type,
											type				: 'discounted'
										};
										
										cartItems[i].quantity -= apQuantity;
										
										if (bundle.minimum_requirements === 'n_products') {
											// break variantsLoop;
										} else {
											break productsLoop;
										}
									}
								}
							}
						}
					}
				}
			}

			// Check if all products were found for the last combo
			var appliedProducts 		= 0;
			var appliedRequiredProducts = 0;
			var appliedQuantity 		= 0;
			
			// We use these two variables to make sure that all of the required products from the Mix & Match bundle are included in the combo
			//var numOfRequiredMixNMatchProductsApplied 	= 0;
			//var numOfRequiredMixNMatchProducts 			= 0;
			// These two objects must have the same number of elements in them, so we know that all of the required products from the Mix & Match bundle are included in the combo
			var numOfRequiredMixNMatchProductsArray 		= {};
			var numOfRequiredMixNMatchProductsAppliedArray 	= {};

			
			if (bundle.minimum_requirements === 'all_products') {
				// for bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						if (typeof combos[comboId] !== 'undefined' && typeof combos[comboId][productId] !== 'undefined') {
							appliedProducts++;
						}
					}
				}
			} else if (bundle.minimum_requirements === 'n_products') {
				// for bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						
						if (bundle.products[productId].required === 1) {
							//numOfRequiredMixNMatchProducts++;
							numOfRequiredMixNMatchProductsArray[productId] = 1;
						}
						
						if (typeof combos[comboId] !== 'undefined') {
							// for combo products
							for (var id in combos[comboId]) {
								if (combos[comboId].hasOwnProperty(id)) {
									if (combos[comboId][id].product_id == productId) {
										appliedQuantity += combos[comboId][id]['quantity'];
										
										if (bundle.products[productId].required === 1) {
											//numOfRequiredMixNMatchProductsApplied++;
											numOfRequiredMixNMatchProductsAppliedArray[productId] = 1;
										}
									}
								}
							}
						}
					}
				}
			} else if (bundle.minimum_requirements === 'specific_products') {
				// for bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						if (typeof combos[comboId] !== 'undefined') {
							// for combo products
							for (var id in combos[comboId]) {
								if (combos[comboId].hasOwnProperty(id)) {
									if (combos[comboId][id].type === 'discounted' && combos[comboId][id].product_id == productId) {
										appliedProducts++;
									}
								}
							}
						}
					}
				}
				
				// for bundle products
				for (var productId in bundle.required_products) {
					if (bundle.required_products.hasOwnProperty(productId)) {
						if (typeof combos[comboId] !== 'undefined') {
							// for combo products
							for (var id in combos[comboId]) {
								if (combos[comboId].hasOwnProperty(id)) {
									if (combos[comboId][id].type === 'required' && combos[comboId][id].product_id == productId) {
										appliedRequiredProducts++;
									}
								}
							}
						}
					}
				}
			}

			// Remove any incomplete combos and return quantities to the cart
			if (bundle.minimum_requirements === 'all_products') {
				if (appliedProducts !== Object.keys(bundle.products).length) {
					loop = false;
					
					if (typeof combos[comboId] !== 'undefined' && Object.keys(combos[comboId]).length) {
						// Return quantity back to cart
						this.returnQuantityToCartItem(cartItems, combos[comboId]);
					}
					
					// Last combo is not complete, remove it
					delete combos[comboId];
				}
				
			} else if (bundle.minimum_requirements === 'n_products') {	

				// Check if applied quantity is within bounds
				if (appliedQuantity < bundle.minimum_requirements_num || 
						(bundle.minimum_requirements_n_max_products !== null 
						&& bundle.minimum_requirements_n_max_products !== '' 
						&& appliedQuantity > bundle.minimum_requirements_n_max_products) ||
						Object.keys(numOfRequiredMixNMatchProductsAppliedArray).length < Object.keys(numOfRequiredMixNMatchProductsArray).length //numOfRequiredMixNMatchProductsApplied < numOfRequiredMixNMatchProducts
					) {
					loop = false;
					
					if (typeof combos[comboId] !== 'undefined' && Object.keys(combos[comboId]).length) {
						// Return quantity back to cart
						this.returnQuantityToCartItem(cartItems, combos[comboId]);
					}
					
					// Last combo is not complete, remove it
					delete combos[comboId];
				}
				
			} else if (bundle.minimum_requirements === 'specific_products') {
				
				if (appliedProducts !== Object.keys(bundle.products).length 
					|| appliedRequiredProducts !== Object.keys(bundle.required_products).length) {

					loop = false;
					
					if (typeof combos[comboId] !== 'undefined' && Object.keys(combos[comboId]).length) {
						// Return quantity back to cart
						this.returnQuantityToCartItem(cartItems, combos[comboId]);
					}
					
					// Last combo is not complete, remove it
					delete combos[comboId];
				}
				
			} else {
				return false;
			}
			
			comboId++;
		}

		return combos;
	},
	returnQuantityToCartItem: function(cartItems, combo) {
		
		for (var variantId in combo) {
			if (combo.hasOwnProperty(variantId)) {
				var product = combo[variantId];
				var lineItemId = product['line_item_id'];
				if (typeof cartItems[lineItemId] !== 'undefined') {
					cartItems[lineItemId].quantity += product.quantity;
				}
			}
		}
	},
	displayCartValue: function(value, cartData, canGetFreeShipping) {
		
		if (typeof canGetFreeShipping === 'undefined') {
			canGetFreeShipping = false;
		}
		
		var currency = cartData.currency;
		
		if (value > 0 || canGetFreeShipping === true) {
			
			var totalCompareAtValue	= cartData.total_price;
						
			if ($('#bndlr-discount-message').length === 0) {
				$('body').append('<div id="bndlr-discount-message" class="bndlr-go-to-checkout"></div>');
			}
			
							var customText = '';
						
			
			var popupTitle 			= 'You got';
			var popupSubtitle 		= '{{savings}} OFF your order';
			var popupAndText	 	= '&';
			var popupFreeShipping 	= 'FREE SHIPPING';
			var popupQuestion 		= 'Apply discount and go to checkout?';
			var popupYes  			= 'Yes, please';
			var popupNo  			= 'No';
			
			// var priceHtml = '<span class="bndlr-cart-price money">' + bndlr.formatPrice(value, currency) + '</span>';
			var priceHtml = htmlUtils.moneySpan(bndlr.formatPrice(value, currency), currency, 'bndlr-cart-price');

			popupTitle 		= popupTitle.replace('{{savings}}', priceHtml);
			popupSubtitle 	= popupSubtitle.replace('{{savings}}', priceHtml);
			popupQuestion 	= popupQuestion.replace('{{savings}}', priceHtml);
			popupYes 		= popupYes.replace('{{savings}}', priceHtml);
			popupNo 		= popupNo.replace('{{savings}}', priceHtml);
			
			var discountHtml = '';
			if (value > 0 && canGetFreeShipping) {
				discountHtml = '<div class="bndlr-message-discount-value">' + 
					popupSubtitle +
					'<div class="bndlr-message-and-text">' + popupAndText + '</div>' +
					popupFreeShipping +
				'</div>';
			} else if (value > 0) {
				discountHtml = '<div class="bndlr-message-discount-value">' + 
					popupSubtitle +
				'</div>';
			} else if (canGetFreeShipping) {
				discountHtml = '<div class="bndlr-message-discount-value">' + 
					popupFreeShipping +
				'</div>';
			}
			
			$('#bndlr-discount-message').html(''+
				'<div class="bndlr-message-title">'+popupTitle+'</div>' + 
				discountHtml +
				customText +
				'<div class="bndlr-message-question">'+popupQuestion+'</div>' + 
				'<div class="bndlr-message-options">' +
					'<div class="bndlr-message-yes">'+popupYes+'</div>' +
					'<div class="bndlr-message-no">'+popupNo+'</div>' +
				'</div>' +
				'<div class="bndlr-message-close"></div>' +
			'');
			
												$('#bndlr-discount-message').animate({bottom: '10px'}, 1000);
										
			bndlr.convertCurrency('.bndlr-cart-price');
		}
	},
			displayDiscountInCart: function(value, cartData) {

			var currency = cartData.currency;
			
			// TODO figure out what to do with this one
			var cartDiscountSelector = '.order-discount-card-wrapper, .Cart__Discount, .subtotal .cart_savings.sale';
			
						
			if (value>0 && $('#bundler-hide-discounts').length === 0) {
				$('body').append('<style id="bundler-hide-discounts">'+
					cartDiscountSelector+' {' +
						'display:none !important;' +
					'}' +
				'</style>');
			} else if(value <= 0) {
				$('#bundler-hide-discounts').remove();
			}
			
			if (value > 0) {
				
				/*
					// Have elements with correct calsses to place the value in correct targets.
					// Block container with initial total, discounts and discounted price
					// .bundler-cart-price-info-container
					// .bundler-cart-price-info-container-inline
					
					// Inline target elements
					// .bundler-cart-total-original
					// .bundler-cart-total-discounted
					// .bundler-cart-discount-value
					// .bundler-cart-discount-value-no-minus
					// .bundler-cart-discount-percent
					
				*/
				var selectorsConfig = {
					'bundler-cart-price-info-container' : [
						// Fills with original, discount and discounted value vertically (with <br />)
						'.bundler-cart-price-info-container',
						'.cart-quickview__footer .cart-subtotal__price[data-cart-subtotal]',
						'#cart_form .cart-breakdown .subtotal_amount strong',
						//'.cart__subtotal:not(.js-cart-subtotal) span.subtotal + span',
						'.cart__footer .cart__item-sub [data-subtotal]',
						'.cart-subtotal__price, .cart__subtotal-price, .cart__subtotal:not(.js-cart-subtotal), .template-cart .cart-subtotal--price, .template-cart .cart-subtotal--price small:first-child, .cart-footer__subtotal, .cart-drawer__subtotal-price, .cart-recap__price-line-price',
						'#bk-cart-subtotal-price',
						'.jas_cart_page .frm_cart_page .order-total .wh-original-cart-total',
						'#revy-cart-subtotal-price',
						'.wh-original-cart-total .wh-original-price .cart__subtotal',
						'.wh-original-cart-total .wh-original-price',
						'.Cart .Cart__Total span:not(.bndlr-cart-values):not(.wh-cart-total)',
						'.cart form[action="/cart"] .cart__total__value',
						'form[action="/cart"] div.cart .cart__row:last-of-type .grid .grid__item:last-of-type .table-cell:last-of-type p',
						'div.cart-checkout .subtotal .price',
						'form.cart .checkout .total span.price',
						'.cart_totals tr.order-total .shopify-Price-amount.amount',
						'.mini_cart_header .wrap-btcart .summary .total .price',
						'form.cart-form .subtotal-block .subtotal .price',
						'form.cart .cart__footer .grid .grid__item div span:nth-child(2)', // Debut theme
						'form.cart-form .cart-totals .cart-price',
						'#cart-summary .cart-original-total',
						/*'#cartform .wholesale-original-cart-total[style="display: none;"] + .wholesale-cart-total',*/
						'#cartform .wholesale-original-cart-total',
						'.off-canvas--viewport .off-canvas--main-content .layout--main-content .cart--root .cart--form .cart--footer .cart--total .cart--total--price:visible:first',
						'.cart_totals tr.order-total td',
						'#shopify-section-cart-template .total .price',
						'.cart__footer .cart_tot_price',
						'#shopping-cart #basket-right h4 span.money',
						'.cart-totals .cart-price-info .cart-price span[data-cart-subtotal]',
						'.ajaxcart__footer-total span.money',
						'form.cart[action="/cart"] div.cart__row--table',
						'div[data-section-id="cart-template"] #main-checkout-form .bottom-cart-total .cart__subtotal',
						'#shopify-section-template--cart .cart-totals--wrapper #cart-total-final-price',
						'#shopify-section-cart-template .cart-subtotal span.theme-money',
						'.cart__container .cart__footer .cart__footer-right p.ff-heading.fs-heading-base',
						'table.total-checkout .cart-amount',
						'.cart .row.cart-info .cart-subtotal',
						'.subtotal-row .subtotal .amount',
						'.cart--total #xtotalPrice',
						'form.cart .cart-tools .totals .price',
						'#cartform .subtotal span.theme-money',
						'#cartform .subtotal-row .subtotal-amount',
						'form[action="/cart"] .grid .grid__item .cart__price',
						'.main form.cart-form .cart__footer .cart__footer-total span.money:not(.bndlr-cart-values)',
						'.ajaxcart-draw form.cart-form .cart__footer .cart__footer-total span.money:not(.bndlr-cart-values)'
						
					],
					'bundler-cart-price-info-container-inline': [
						// Fills with original and discounted value inline
						'.bundler-cart-price-info-container-inline',
						'.Drawer .Cart__Checkout.Button span[data-money-convertible]:not(.bndlr-cart-values), .cart_container form.js-cart_content__form li.cart_subtotal span.right',
						'#ajaxifyDrawer form.cart-form .cart-subtotal--price small:first-child',
						'header.cart-title .cart-title-total span.money',
						'section.cartitems--container .cart-final-total .cart-subtotal span.money',
						'form#cart_form .cart_subtotal span.right',
						'form.main-cart-form .cart-total-wrapper .cart-total span.sign + span',
						'#nav-shopping-cart-dialog .cart-total .nav-cart-dialog-total-amount',
						'#total-cart-bottom',
						'#total-cart-top',
						'#site-cart #CartTotal span:first',
						'#site-cart #CartTotal span:first, .site-box-content #CartTotal span:first',
						'.js-cart_content__form .js-cart_subtotal span.right:first',
						'#CartDrawer .cart__detail-info span[data-cart-subtotal]',
						'#CartContainer .cart.ajaxcart .ajaxcart__subtotal p',
						'.cart__header-content .cart-price-grid .js-cart-subtotal',
						'.cart-checkout-field .cart-price-grid .js-cart-subtotal',
						'#cartPopup .cart-popup__subtotal .cart-popup__subtotal-price',
						'.footer-row .slidecart-subtotal',
						'.drawer__footer .ajaxcart__price',
						'#cart_form .subtotal-price',
						'.jas-mini-cart .total .shopify-Price-amount .wh-original-cart-total',
						'#CartDrawer .ajaxcart__footer .ajaxcart__subtotal',
						'.bc-atc-slide-subtotal .bc-atc-slide-subtotal-price',
						'#ajaxifyCart .cart-subtotal .cart-subtotal--price',
						'.cart_subtotal.js-cart_subtotal > span.right',
						'.mini-products-list .cart-subtotal-row .product-price',
						'#qikify-stickycart-app .qsc-wrapper .qsc-cart__price-value',
						'form.ajaxcart #common-subtotal .custom-ajaxcart__subtotal.text-right',
						'.sp-cart .sp-dropdown-inner .sp-cart-total-price',
						'form[action="/cart"] span.total-price.money',
						'#CartDrawer #CartContainer .ajaxcart__footer .total span.cart-original-total',
						'form#mini-cart .mini-cart__recap .mini-cart__recap-price-line > span:nth-child(2)',
						'#header-cart-canvas .hc__total__price',
						'#cartSlideoutWrapper #cart-price',
						'#header .ajax-cart__subtotal.ajax-cart__details-row span[class=""]',
						'.cart--total .cart--total--price',
						'.tt-shopcart-col #grandtotal td',
						'#dropdown-cart .has-items .summary .total .price', // mitcha-store
						'.minicart .minicart__footer .cart__total:nth-of-type(2)', // ausreo-pty-ltd
						'#template-cart .cart .cart__summary .cart__total:nth-of-type(2)', // ausreo-pty-ltd
						//'.cart__totals .cart__subtotal:not(.js-cart-subtotal) span.subtotal + span',
						'.custom_checkout_right .custom_checkout_right_inner .sub_right', // gurhanjewelry
						'#header-cart .mini-products-list .total .product-price', // gurhanjewelry
						'#cartSidebarContainer .cart__subtotal .text-right.cart__subtotal-price > p',
						'.cart-summary .cart-detail-info .tt-price',
						'.cart-total-col .cart-tt-price:visible',
						'.go-cart-drawer__subtotal-price',
						'.cart-form .cart-total-price .cart-total-price__value',
						'.cart-mini-subtotal .cart-mini-subtotal-value',
						'#slidedown-cart .summary .total .price',
						'#header .ajax-cart__form .ajax-cart__subtotal span.money',
						'#mobile-header .ajax-cart__form .ajax-cart__subtotal span.money',
						'#cart-summary .wholesale-cart-total'
						//'form.cart-form .cart__footer .cart__footer-total span.mon--ey:not(.bndlr-cart-values)'
					],
					'bundler-cart-total-original' : [
						'.bundler-cart-total-original',
						'#basket-right .subtotal .subtotal-price',
						'#updateform .sp-shopcart-box tr#subtotal td'//,
						//'.wcp-cart-total'
					],
					'bundler-cart-total-discounted' : [
						// Just fills the discounted value. Useful for header cart totals
						'.bundler-cart-total-discounted',
						'#toolbar .toolbar-cart .current-cart .beside-svg .theme-money, header #CartButton #CartCost',
						'.head_cart #CartCost',
						'.cart-count .cartTotalSelector',
						'.header--container .cart--external--total-price',
						'#ajaxifyCart .total .total-price',
						'#basket-right .total .total-price',
						'#updateform .sp-shopcart-box tr#grandtotal td',
						'.total_price #total_price',
						'.cart-item-count-header.cart-item-count-header--total'
						//,
						//'.wcp-original-cart-total'
					],
					'bundler-cart-discount-value' : [
						'.bundler-cart-discount-value',
						'.discounts_normal #discounts_price'
						//'#basket-right .discounts',
					],
					'bundler-cart-discount-value-no-minus' : [
						'.bundler-cart-discount-value-no-minus',
						'.card__section .cart-recap__amount-saved span'
					],
					'bundler-cart-discount-percent' : [
						'.bundler-cart-discount-percent'
					]
				};
				
					
				
				if (typeof clientSpecifics['cart_selectors'] !== 'undefined') {
					selectorsConfig = clientSpecifics['cart_selectors'].modify(selectorsConfig);
				}					
				
				var selectorsValues = {};

				var discountedTotal 			= cartData.original_total_price - value;
				var totalCompareAtValue			= cartData.original_total_price;
								
				var discountedTotalFormatted	=  bndlr.formatPrice(discountedTotal, currency);
				
				var discount 	= bndlr.formatPrice(value, currency);
				var cartTotal 	= bndlr.formatPrice(totalCompareAtValue, currency);
				
				var currencyAttr = 'data-currency-'+currency.toLowerCase();
				
				
				var plainDiscountHtml = htmlUtils.moneySpan(discount, currency.toLowerCase(), 'bndlr-minus bndlr-cart-values bndlr-cart-discount-value');
				
				var discountHtml		= '<br />'+plainDiscountHtml;
				var discountedTotalHtml = '<br />'+htmlUtils.moneySpan(discountedTotalFormatted, currency.toLowerCase(), 'bndlr-cart-values bndlr-cart-discounted-value');

				var discountedInlineTotalHtml 	= htmlUtils.moneySpan(discountedTotalFormatted, currency.toLowerCase(), 'bndlr-cart-values');

				var cartTotalHtml = htmlUtils.moneySpan(cartTotal, currency.toLowerCase(), 'bndlr-cart-values bndlr-cross-out bndlr-cart-orig-price');
				
				// Value for the price info container (displays values vertically)
				var priceInfoContainerValue = cartTotalHtml;
				priceInfoContainerValue += discountHtml;
				priceInfoContainerValue += discountedTotalHtml;
				selectorsValues['bundler-cart-price-info-container'] = priceInfoContainerValue;
				
				// Value for the inline price info container (displays values horizontally)
				var priceInfoContainerInlineValue = htmlUtils.moneySpan(cartTotal, currency.toLowerCase(), 'bndlr-cart-values bndlr-cart-values-old-price bndlr-cross-out')+'&nbsp;';
				priceInfoContainerInlineValue += discountedInlineTotalHtml;
				selectorsValues['bundler-cart-price-info-container-inline'] = priceInfoContainerInlineValue;
				
				// Value for the inline price info. Useful for headers.
				var cartTotalDiscountedValue = htmlUtils.moneySpan(discountedTotalFormatted, currency.toLowerCase(), 'bndlr-cart-values');
				selectorsValues['bundler-cart-total-discounted'] = cartTotalDiscountedValue;
				
				// Value for the in inline discount.
				selectorsValues['bundler-cart-discount-value'] = plainDiscountHtml;
				
				// Value for the inline discount without any minus symbol
				selectorsValues['bundler-cart-discount-value-no-minus'] = htmlUtils.moneySpan(discount, currency.toLowerCase(), 'bndlr-cart-values bndlr-cart-discount-value');
				
				// Discount percentage
				selectorsValues['bundler-cart-discount-percent'] = Math.round((totalCompareAtValue - discountedTotal)/totalCompareAtValue*100, 2);
				
				// Value for original cart total
				selectorsValues['bundler-cart-total-original'] = cartTotalHtml;
				
				
				if (typeof clientSpecifics['cart_discounts'] !== 'undefined') {
					clientSpecifics['cart_discounts'].beforeMutation();
				}
				cartChangeDetector.beforeMutation();
				
				
				for(var selector in selectorsValues) {
					if (selectorsValues.hasOwnProperty(selector)) {
						var value = selectorsValues[selector];
						// We have the value.
						// Now find the element where to inject it into.

						var selectors = selectorsConfig[selector];
						selectorsLoop:
						for(var i=0; i<selectors.length; i++) {

							if ($(selectors[i]).length>0) {

																
								$(selectors[i]).last().html(value);

								if (selector === 'bundler-cart-price-info-container') {
									// Some custom logic
									$(selectors[i]).removeAttr('data-money-convertible');
								}
								
								if (selector === 'bundler-cart-discount-value') {
									// Add class to the parent element, so we can show it
									$(selectors[i]).last().closest('.bundler-cart-discount-value--parent').addClass('bundler-has-discount');
								}
								if (selector === 'bundler-cart-discount-value-no-minus') {
									// Add class to the parent element, so we can show it
									$(selectors[i]).last().closest('.bundler-cart-discount-value-no-minus--parent').addClass('bundler-has-discount');
								}
								
																	if (selector === 'bundler-cart-price-info-container') {
										// Break loop for the full cart price info
										// Continue for every other value
										break selectorsLoop;
									}
															}
						}
						
						
					}
				}
				
				bndlr.convertCurrency('.bndlr-cart-values');
				
				if (typeof clientSpecifics['cart_discounts'] !== 'undefined') {
					clientSpecifics['cart_discounts'].afterMutation();
				}
				cartChangeDetector.afterMutation();
			}
		}
	};var GlobalUtility = {
	setObserver: function(keySelector, customCallback) {
		// Set intersection observer
					customCallback();
			},
	liquidReplaceMulti: function(string, keyValue) {
		
		for(var key in keyValue) {
			if (keyValue.hasOwnProperty(key)) {
				string = this.liquidReplace(string, key, keyValue[key]);
			}
		}
		
		return string;
	},
	liquidReplace: function(string, key, value) {
		var regex = new RegExp("{{\\s*" + key + "\\s*}}",'i');
		string = string.replace(regex, value);
		return string;
	}
};var VolumeDiscounts = {
	targetElementSelectors: {
		'#bundler-target-element-volume-discounts' 							: 'prepend',
		//'form.pf-product-form [data-pf-type="Row"] [data-pf-type="Column"]' : 'append',
		'form[action*="/cart/add"]' 										: 'after',
		'#add-to-cart-product form[action*="/cart/add"]' 					: 'after',
		'form#cart-form[action*="/cart/add"]' 								: 'after',
		'form.product-form[action*="/cart/add"]' 							: 'after',
		'.product-info #wait_li_form' 										: 'after',
		'form.productForm[action*="/cart/add"]'			 					: 'after',
		'form.shopify-product-form'			 								: 'after',
		'form#AddToCartForm'			 									: 'after',
		'#shopify-section-product-template form#product-form' 				: 'after',
		'.product-page-info form[action="/cart/add"]' 						: 'after',
		'.product-form-container form.shopify-product-form' 				: 'after',
		'#ProductSection-product-template-default form#add-to-cart-form'	: 'after',
		'.modal-wrapper.is-open form.product-form[data-product-handle]'		: 'after',
		'[data-pf-type="Section"]:not(.pf-hide) form.pf-product-form button[data-pf-type="ProductATC"]' : {
			'closest' : '[data-pf-type="Block"]', // Go back to the closest parent element
			'action' : 'after' // Action after the closest element is found
		}
			},
	// volume discounts
	showVolumeDiscountBundle: function() {
		var bundleFound = false;
		
					if (bundleFound === false) {
				// Trigger to display bundle on product page
				var productHandle = nav.getProductHandle();
				
				if (productHandle === false) {
					if ($('[data-product-handle]').length === 1) {
						// We are in Express theme and product modal is open
						productHandle = $('[data-product-handle]').attr('data-product-handle');
						if (productHandle === null || productHandle === '') {
							productHandle = false;
						}
					}
				}

				if (productHandle !== false) {
					// $('.bndlr-automatic').length check makes sure that we don't add bundle widgets on the page too many times if we call the .refresh() method.
					// Except if we set the removePreviousBundles parameter to true, as we want to refresh the bundle widget because of the variant change

					var self = this;
					
					cart.getProductData(nav.getRootUrl(), productHandle).done(function(productData) {
						
						productData = bndlr.remapProductData(productData);

						var bundle = bndlr.findBundle(productData.id, productData.variants, true);

						if (bundle !== false) {

							var uniqueKey = utils.getRandomString();
							var keySelector = '#_bndl_key_'+uniqueKey;
						
							self.loopThroughVolumeSelectors(function($element, htmlSelector, action) {
								
								if ($element.length === 1 && $element.closest('#judgeme_product_reviews').length === 0) {
									
									var dataBundleAttr 	= $element.attr('data-bundle');
									
									if (typeof dataBundleAttr === 'undefined' || dataBundleAttr === false) {

										$element[action]('<div id="_bndl_key_'+uniqueKey+'" class="bundler-volume-target-element bndlr-automatic-volume-bundle" data-bundle="' + bundle.id + '" data-bndlr-k="'+uniqueKey+'"></div>');
										
										return false;
									}
								}
							});
							
							
							GlobalUtility.setObserver(keySelector, function() {
								idleCallback(function() {
									self.displayVolumeBundle(bundle, keySelector)
								});
							});
						}
					});
				}
			}
			},
	loopThroughVolumeSelectors: function(callback) {
		
		for(var selector in this.targetElementSelectors) {
			if (this.targetElementSelectors.hasOwnProperty(selector)) {
				var action = this.targetElementSelectors[selector];
				var $element = $(selector);

				if (typeof action !== 'string' && typeof action.closest === 'string') {
					$element 	= $element.closest(action.closest);
					action 		= action.action;
				}

				if (callback($element, selector, action) === false) {
					break;
				}
			}
		}
	},
	displayVolumeBundle: function(bundle, keySelector) {
		
		this.widgetCanBeDisplayed = true;
		
		var bundleKey = utils.getRandomString();
		
		var bundleName = bundle.name.replace('"', '').replace(/<[^>]*>?/gm, '');
		
		var canDisplayBundle = true;				
		
		try {
			var bundleHtml = ''+
				'<div id="_bndl_'+bundleKey+'" class="bndlr-volume" data-bndlr-key="'+bundleKey+'" data-bundle-name="'+ bundleName +'">' + 
					'<h2 class="bndlr-volume-title">'+ bundle.title +'</h2>' +
					'<div class="bndlr-volume-description">'+ bundle.description +'</div>' +
						'<div class="bndlr-volume-discounts">';

						for (var r = 0; r < bundle.volume_discounts.length; r++) {
							var volumeDiscount = bundle.volume_discounts[r];
							var hasSavingsText = volumeDiscount.savings_text.length > 0 ? true : false;
							
							var discountUnit = '';
							if (typeof Shopify !== 'undefined' && typeof Shopify.currency !== 'undefined' && typeof Shopify.currency.active === 'string') {
								discountUnit = Shopify.currency.active;
							}
							
							if (volumeDiscount.discount_type === 'percentage') {
								discountUnit = '%';
							}
							
							var maxQuantity = '';
							if (volumeDiscount.range_type === 'range' && volumeDiscount.max_items !== null) {
								maxQuantity = volumeDiscount.max_items
							}
							
							var keyValue = {
								'quantity' 			: volumeDiscount.min_items,
								'max_quantity' 		: maxQuantity,
								'discount_value' 	: volumeDiscount.discount_value,
								'discount_unit' 	: discountUnit
							};
							
							var extraClass = '';
							if (hasSavingsText) {
								extraClass = ' bndlr-has-savings-text ';
							}
							
							bundleHtml += '<div class="bndlr-volume-discount bndlr-volume-style-0 '+extraClass+'">';
							
								bundleHtml += '<div class="bndlr-volume-main-text">' +
									GlobalUtility.liquidReplaceMulti(volumeDiscount.description, keyValue) + 
								'</div>';
								
								
								// Show savings text
								if (hasSavingsText) {
									bundleHtml += '<div class="bndlr-volume-saving-text">' +
										GlobalUtility.liquidReplaceMulti(volumeDiscount.savings_text, keyValue) + 
									'</div>';
								}
							bundleHtml += '</div>';
						}
					bundleHtml += '</div>';
				bundleHtml += '</div>';
		
		} catch(e) {
			bundlerConsole.log(e);
			canDisplayBundle = false;
		}
	
		
		
		if (canDisplayBundle === false) {
			bundlerConsole.log('Skipping bundle', bundle.name);
			return true;
		}
		
		$element = $(keySelector);
		
		if ($element.length > 0) {
			var $bundle = $(bundleHtml);
			$element.html($bundle);
		}
		
		idleCallback(function() {
			
			$(document).trigger('bundler_bundle_widget_created');
		
			try {
				var event = new CustomEvent("bundler:bundle_widget_created", {
					detail: {
						products: []
					}
				});
				document.dispatchEvent(event);
			} catch(e) {
				bundlerConsole.log(e);
			}
			
		}.bind(bndlr));
		
		
	},
	init: function() {
		if (typeof clientSpecifics['volume_discounts_modify_selectors'] !== 'undefined') {
			this.targetElementSelectors = clientSpecifics['volume_discounts_modify_selectors'].modify(this.targetElementSelectors);
		}
	}
};			
						
			var errorHandler = {
				displayError: function(message, bundleId) {
					var $bundleContainer = $('.bundler-target-element[data-bundle="'+bundleId+'"]');
					
					if ($bundleContainer.length === 0) {
						return true;
					}
					
					if ($bundleContainer.find('.bndlr-error').length === 0) {
						$bundleContainer.append('<div class="bndlr-error"></div>');
						$bundleContainer.attr('data-bundle-widget-status', 'error');
					}
					
					$bundleContainer.find('.bndlr-bundle-loading').remove();
					
					$bundleErrorContainer = $bundleContainer.find('.bndlr-error').first();
					
					var hash = this.getHash(message);
					if ($bundleErrorContainer.find('span[data-hash="'+hash+'"]').length === 0) {
						$bundleErrorContainer.append('<span data-hash="'+hash+'">' + message+'</span><br />');
					}
					
					
				},
				getHash: function(string) {
					var hash = 0, i, chr;
					if (this.length === 0)  {
						return hash;
					}
					var chr = 0;
					for (var i = 0; i<string.length; i++) {
						chr = string.charCodeAt(i);
						hash  = ((hash << 5) - hash) + chr;
						hash |= 0; // Convert to 32bit integer
					}
					
					return 'h'+hash;					
				}
			}

			// Queue for handling multiple ajax requests and triggering callback after they are all finished
			var queue = {
				queue: {},
				add: function(key, action, afterFinish) {
					if (typeof this.queue[key] === 'undefined') {
						this.queue[key] = {
							finish: afterFinish,
							q: [],
							tick: 0
						};
					}
					this.queue[key].q.push(action);
				},
				process: function(key) {
					if (typeof this.queue[key] !== 'undefined') {
						var total = this.queue[key].q.length;
						
						var tick = this.queue[key].tick;
						if (typeof this.queue[key].q[tick] !== 'undefined') {
							this.queue[key].q[tick]();
						}
					}
				},
				tick: function(key) {
					if (typeof this.queue[key] !== 'undefined') {
						this.queue[key].tick++;
						
						if (this.queue[key].tick === this.queue[key].q.length) {
							this.queue[key].finish();
							
							delete this.queue[key];
						} else {
							this.process(key);
						}
					}
				},
				cancel: function(key) {
					delete this.queue[key];
				}
			};
			
			
			if (typeof clientSpecifics['before_init'] !== 'undefined') {
				// Useful for disabling the app based on custom logic (e.g. wholesale customers, etc.)
				clientSpecifics['before_init'].trigger();
			}
			
						
						
				// completelyDisableBundlerApp allows merchants to disable the app based on a custom logic (e.g. wholesale customers, etc.)
				if (typeof window.completelyDisableBundlerApp === 'undefined' || window.completelyDisableBundlerApp === false) {
				
					idleCallback(bndlr.init.bind(bndlr));
					
					if (typeof window.bndlrPOS === 'undefined') {
						idleCallback(bndlr.showBundle.bind(bndlr));
													idleCallback(VolumeDiscounts.init.bind(VolumeDiscounts));
							idleCallback(VolumeDiscounts.showVolumeDiscountBundle.bind(VolumeDiscounts));
												
						idleCallback(DiscountEstimator.showPopup.bind(DiscountEstimator));
						
													bndlr.hideDynamicCheckoutButtons();
											}

				} else {
					bundlerConsole.log('Bundler app was disabled via JavaScript variable completelyDisableBundlerApp');
				}
						
			// These are publicly exposed methods, which can be used by other apps and integrations
			// methods which start with an underscore (_) are meant for internal usage between different app components
			window.bndlr = {
				checkout				: bndlr.prepareInvoice,
				goToCheckout			: (function() {bndlr.prepareInvoice(undefined, undefined, false);}),
				canUseCheckout			: bndlr.canUseCheckout,
				setCheckoutParams		: bndlr.setCheckoutParams,
				preventBundlerCheckout	: bndlr.preventBundlerCheckout,
				outputBundles			: bndlr.outputBundles,
				outputProductUrls		: bndlr.outputProductUrls,
				getBundles				: bndlr.getBundles,
				refresh					: (function() {bndlr.showBundle.bind(bndlr)();}),
				refreshVolumeDiscounts	: (function() {
											idleCallback(VolumeDiscounts.showVolumeDiscountBundle.bind(VolumeDiscounts));
									})
			};
			
			// Add the removeBundledItemsFromCart method to the collection of internal functiona so we can use it in the funnels functionality
			_internalFunctionCollection['removeBundledItemsFromCart'] = (function(items) {DiscountEstimator.removeBundledItemsFromCart.bind(DiscountEstimator)(items);});
			
			Object.freeze(window.bndlr);
			
			if (typeof window.bndlrPOS !== 'undefined') {
				window.bndlrPOS.init(bndlr, bundles, DiscountEstimator, queue);
			}
			
			var event = new CustomEvent("bundler:loaded");
			document.dispatchEvent(event);
			
			document.addEventListener('bundlerPOS:triggerPOSsystem', function() {
				if (typeof window.bndlrPOS !== 'undefined') {
					window.bndlrPOS.init(bndlr, bundles, DiscountEstimator, queue);
				}
			});
			
			
					};
		
		/**
*	Promotions
*/

var BundlerPromotions = function($) {

	var promotions = [{"id":587,"name":"Blue Bird Panel Artwork Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53696,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53696,"name":"Blue Bird Panel Artwork Bundle Deal","title":"Blue Bird Panel Artwork Bundle Deal","description":"Get the matching set and save $30 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.024","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5640923283608":{"id":"5640923283608","title":"Hamptons Blue and White Bird Panel (Design 1) Framed Wall Art 54 cm by 54 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35780544430232":{"id":"35780544430232","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-bird-panel-design-1-framed-wall-art-54-cm-by-54-cm"},"5640959590552":{"id":"5640959590552","title":"Hamptons Blue and White Bird Panel (Design 2) Framed Wall Art 54 cm by 54 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35780684120216":{"id":"35780684120216","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-bird-panel-design-2-framed-wall-art-54-cm-by-54-cm"}},"required_products":[],"volume_discounts":[]}},{"id":588,"name":"Alpine Lamp Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53176,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53176,"name":"Alpine Lamp Bundle Deal","title":"Alpine Lamp Bundle Deal","description":"Get A Pair For $500 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"10","fixed_amount_value":"58","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"2151223164985":{"id":"2151223164985","title":"BESTSELLER Alpine Fog Bedside Table Lamp","quantity":2,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"19061062860857":{"id":"19061062860857","title":"Default Title","quantity":2,"discount_amount":0,"sequence":1,"required":0}},"handle":"alpine-pale-blue-bedside-table-lamp"}},"required_products":[],"volume_discounts":[]}},{"id":589,"name":"Koi Fish Artwork Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53695,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53695,"name":"Koi Fish Artwork Bundle Deal","title":"Koi Fish Artwork Bundle Deal","description":"Get the matching set and save $50 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"6.775","fixed_amount_value":"50","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4372601471033":{"id":"4372601471033","title":"Hamptons Koi Fish Blue and White Chinoiserie Bamboo Framed Wall Art (Design 1)","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31291295039545":{"id":"31291295039545","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-koi-fish-blue-and-white-chinoiserie-brown-bamboo-framed-wall-art-design-1-40-6-by-3-5-by-49-6-cm-1"},"4356107042873":{"id":"4356107042873","title":"Hamptons Koi Fish Blue and White Chinoiserie Bamboo Framed Wall Art (Design 2)","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31254110732345":{"id":"31254110732345","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-koi-fish-blue-and-white-chinoiserie-brown-bamboo-framed-wall-art-design-1-40-6-by-3-5-by-49-6-cm"}},"required_products":[],"volume_discounts":[]}},{"id":590,"name":"Miccah Jar Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53175,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53175,"name":"Miccah Jar Bundle Deal","title":"Miccah Jar Bundle Deal","description":"Get the set and save 10%","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"false","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4158334861369":{"id":"4158334861369","title":"Gloss White Miccah Temple Jar Large 38 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"30237986816057":{"id":"30237986816057","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"gloss-white-miccah-temple-jar-range-large-38-cm"},"4158333386809":{"id":"4158333386809","title":"Gloss White Miccah Temple Jar Medium 32 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"30237976821817":{"id":"30237976821817","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"gloss-white-miccah-temple-jar-medium-32-cm"},"4158329225273":{"id":"4158329225273","title":"Gloss White Miccah Temple Jar White Small 26 cm","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"30237959323705":{"id":"30237959323705","title":"Default Title","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"gloss-white-miccah-temple-jar-white-small-26-cm"}},"required_products":[],"volume_discounts":[]}},{"id":591,"name":"Minx Jar Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53174,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53174,"name":"Minx Jar Bundle Deal","title":"Minx Jar Bundle Deal","description":"Get the set and save 10%","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"10","fixed_amount_value":"","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"1724706684985":{"id":"1724706684985","title":"White Extra Small Minx Temple Jar 21 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"17010792562745":{"id":"17010792562745","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"white-extra-small-white-minx-temple-jar-21-cm"},"2179643277369":{"id":"2179643277369","title":"White Medium Minx Temple Jar 50 cm H","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"19154134728761":{"id":"19154134728761","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"white-medium-minx-temple-jar-50-cm-h"},"2179661430841":{"id":"2179661430841","title":"White Small Minx Temple Jar 39 cm H","quantity":1,"discount_amount":0,"image":"","sequence":3,"required":0,"variants":{"19154232999993":{"id":"19154232999993","title":"Default Title","quantity":1,"discount_amount":0,"sequence":3,"required":0}},"handle":"white-small-white-minx-temple-jar-21-cm"}},"required_products":[],"volume_discounts":[]}},{"id":592,"name":"Oars Artwork Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":54299,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":54299,"name":"Oars Artwork Bundle Deal","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"5640996126872":{"id":"5640996126872","title":"Hamptons Oars (Design 1) White Washed Timber Frame 102 cm by 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"35780866474136":{"id":"35780866474136","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-oars-design-1-white-washed-timber-frame-102-cm-by-72-cm"},"5641016246424":{"id":"5641016246424","title":"Hamptons Oars (Design 2) White Washed Timber Frame 102 cm by 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"35780934369432":{"id":"35780934369432","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-oars-design-2-white-washed-timber-frame-102-cm-by-72-cm"}},"required_products":[],"volume_discounts":[]}},{"id":593,"name":"Parasol Artwork Bundle Deal A","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53697,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53697,"name":"Parasol Artwork Bundle Deal A","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"35","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595310886969":{"id":"4595310886969","title":"Hamptons Coastal Beach Parasol (Design 1 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547007893561":{"id":"31547007893561","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-1-framed-wall-art-102-cm-x-72-cm"},"4595312492601":{"id":"4595312492601","title":"Hamptons Coastal Beach Parasol (Design 2 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547009171513":{"id":"31547009171513","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-2-framed-wall-art-102-cm-x-72-cm"}},"required_products":[],"volume_discounts":[]}},{"id":594,"name":"Parasol Artwork Bundle Deal B","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53699,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":53699,"name":"Parasol Artwork Bundle Deal B","title":"Get a discount!","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"percentage","percentage_value":"6.69","fixed_amount_value":"25","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595319406649":{"id":"4595319406649","title":"Hamptons Coastal Beach Parasol (Design 3 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547012874297":{"id":"31547012874297","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-3-framed-wall-art-102-cm-x-72-cm"},"4595320586297":{"id":"4595320586297","title":"Hamptons Coastal Beach Parasol (Design 4 ) Framed Wall Art 102 cm x 72 cm","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547013300281":{"id":"31547013300281","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-coastal-beach-parasol-design-4-framed-wall-art-102-cm-x-72-cm"}},"required_products":[],"volume_discounts":[]}},{"id":416,"name":"Planter Box Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":53182,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"true","bundle_data":{"id":"","name":"","title":"","description":"","button_text":"","discount_warning":"","discount_type":"","percentage_value":"","fixed_amount_value":"","fixed_price_value":"","priority":"","status":"","product_level":"","total_price_text":"","landing_page_content":"","landing_page_content_location":"","minimum_requirements":"","minimum_requirements_num":"","minimum_requirements_n_max_products":"","show_bundle":"","bundle_image":"","list_product_names":"","auto_add_variants":"","mix_and_match_display":"","free_shipping":"","is_volume_bundle":"","product_target_type":"","volume_bundle_combine_quantites":"","products":[],"required_products":[],"volume_discounts":[]}},{"id":417,"name":"Tea Time Art Bundle Deal","add_to_cart_text":"Add to cart","checkout_text":"To checkout","close_text":"Close","priority":10,"bundle_id":60344,"show_on_cart_page_on_load":"true","show_on_cart_page_on_change":"false","show_on_others_on_load":"false","show_on_others_on_change":"false","bundle_data":{"id":60344,"name":"Tea Time Artwork Bundle Deal","title":"Tea Time Artwork Bundle Deal","description":"Get the matching set and save $40 + Free Shipping","button_text":"Add to cart","discount_warning":"Discounts will be applied at checkout.","discount_type":"fixed_amount","percentage_value":"6.775","fixed_amount_value":"40","fixed_price_value":"","priority":10,"status":"enabled","product_level":"product","total_price_text":"Total: {original_price} {discounted_price}","landing_page_content":"","landing_page_content_location":"before_bundle","minimum_requirements":"all_products","minimum_requirements_num":1,"minimum_requirements_n_max_products":null,"show_bundle":"true","bundle_image":"","list_product_names":"true","auto_add_variants":"false","mix_and_match_display":"false","free_shipping":"true","is_volume_bundle":"false","product_target_type":"specific_products","volume_bundle_combine_quantites":"false","products":{"4595322748985":{"id":"4595322748985","title":"Hamptons Blue and White Tea China Framed Wall Art 54 cm by 74 cm (Design 1)","quantity":1,"discount_amount":0,"image":"","sequence":1,"required":0,"variants":{"31547025358905":{"id":"31547025358905","title":"Default Title","quantity":1,"discount_amount":0,"sequence":1,"required":0}},"handle":"hamptons-blue-and-white-tea-china-framed-wall-art-54-cm-by-74-cm"},"4595324715065":{"id":"4595324715065","title":"Hamptons Blue and White Tea China Framed Wall Art 54 cm by 74 cm (Design 2)","quantity":1,"discount_amount":0,"image":"","sequence":2,"required":0,"variants":{"31547031781433":{"id":"31547031781433","title":"Default Title","quantity":1,"discount_amount":0,"sequence":2,"required":0}},"handle":"hamptons-blue-and-white-tea-china-framed-wall-art-54-cm-by-74-cm-1"}},"required_products":[],"volume_discounts":[]}}];
	
	$('body').append('<style>' +
		'.bundles-bundler-hop-full-page-overlay {' +
			'position:fixed;' +
			'top:0;' +
			'left:0;' +
			'width:100%;' +
			'height:100%;' +
			'background:rgba(132, 132, 132, 0.29);' +
			'cursor:pointer;' +
			'z-index:2147483647;' +
		'}' +
		
		'.bundles-bundler-hop-content {' +
			'position:absolute;' +
			'background:white;' +
			'background:#FFFFFF;' +
			'border-radius:0.5em;' +
			'max-width:1024px;' +
			'width:90%;' +
			'width:auto;' +
			'min-height:300px;' +
			'max-height: calc(100% - 2em);' +
			'height:auto;' +
			'overflow:visible;' +
			'top:50%;' +
			'left:50%;' +
			'transform:translateX(-50%) translateY(-50%);' +
			'cursor:auto;' +
			'padding:9px;' +
			'box-shadow:1px 1px 3px 1px rgba(128, 128, 128, 0.36);' +
			'display:flex;' +
			'flex-direction: column;' +
		'}' +
		
		'.bundles-bundler-hop-bundle-container {' +
			'width:100%;' +
			'height:100%;' +
			'overflow:auto;' +
			'flex:1 1 auto;' +
		'}' +
			
		'.bundles-bundler-hop-x-button {' +
			'position:absolute;' +
			'width:2em;' +
			'height:2em;' +
			'top:-.75em;' +
			'right:-.75em;' +
			'background: rgb(70, 103, 167);' +
			'background: #4667A7;' +
			'border-radius: 50%;' +
			'cursor:pointer;' +
		'}' +
		
		'.bundles-bundler-hop-x-button:before, .bundles-bundler-hop-x-button:after {' +
			'position: absolute;' +
			'left: calc(1em - 1px);' +
			'content: "";' +
			'height: 1em;' +
			'top: 0.5em;' +
			'width: 2px;' +
			'background-color: white;' +
			'background-color: #FFFFFF;' +
		'}' +
		'.bundles-bundler-hop-x-button:before {' +
			'transform: rotate(45deg);' +
		'}' +
		'.bundles-bundler-hop-x-button:after {' +
			'transform: rotate(-45deg);' +
		'}' +
		
		'@media screen and (max-width: 800px) {' +
			'.bundles-bundler-hop-content {' +
				'width:90%;' +
			'}' +
		'}' +
		
		// Default bundle style overrides
		'.bundles-bundler-hop-content .bndlr-container {' +
			'margin-top:0;' +
			'padding-top:0;' +
		'}' +
		'.bundles-bundler-hop-content .bndlr-products-container {' +
			'margin-bottom:0;' +
			'padding:0;' +
			'overflow:hidden;' +
		'}' +
		'.bundles-bundler-hop-content .bndlr-container h2.bndlr-bundle-title {' +
			'padding:0 1.5em;' +
			'padding:0;' +
			'max-width:calc(100% - 10px);' +
			'margin-left: auto;' +
			'margin-right: auto;' +
		'}' +
		'.bundles-bundler-hop-content .bndlr-container .bndlr-bundle-description {' +
			'padding:0;' +
			'max-width:calc(100% - 10px);' +
		'}' +
		// 
		
		'.bundles-bundler-hop-buttons-container {' +
			'display: block;' +
			'width: calc(100% - 24px);' +
			'width: calc(100% - 10px);' +
			'margin: 5px 12px;' +
			'margin: 5px 5px;' +
			'padding: 0;' +
			'display:flex;' +
			'flex-direction:row;' +
		'}' +
		
		'.bundles-bundler-hop-button-to-checkout {' +
			'display: block;' +
			'width: calc(75% - 5px);' +
			'margin: 0 0 0 5px;' +
			'background: rgb(70, 103, 167);' +
			'background: #4667A7;' +
			'padding: 0.6em 0;' +
			'color: white;' +
			'color: #FFFFFF;' +
			'border-radius: 2px;' +
			'cursor: pointer;' +
			'max-width: 710px;' +
			'text-align: center;' +
			'flex: 1 1 auto;' +
			'position:relative;' +
			'transition: opacity 0.25s ease;' +
			'opacity: 0;' +
		'}' +
		'.bundles-bundler-hop-animate .bundles-bundler-hop-button-to-checkout {' +
			'opacity: 1;' +
		'}' +
		'.bundles-bundler-hop-button-to-checkout:after {' +
			'display: block;' +
			'content:\'\';' +
			'border:2px solid white;' +
			'border:2px solid #FFFFFF;' +
			'border-top:2px solid transparent;' +
			'border-left:2px solid transparent;' +
			'transform:rotate(-45deg) translateY(-50%);' +
			'width: 0.75em;' +
			'height: 0.75em;' +
			'position: absolute;' +
			'top: 50%;' +
			'transform-origin: 50% 0%;' +
			'transition: right 1s ease, opacity 0.5s ease;' +
			'right: 95%;' +
			'opacity: 0;' +
		'}' +
		'.bundles-bundler-hop-animate .bundles-bundler-hop-button-to-checkout:after {' +
			'right: 0.75em;' +
			'opacity: 1;' +
		'}' +
		
		'.bundles-bundler-hop-close-offer {' +
			'display: block;' +
			'width: calc(25% - 5px);' +
			'margin: 0 5px 0 0;' +
			'background: white;' +
			'background: #FFFFFF;' +
			'padding: 0.6em 0;' +
			'color: rgb(70, 103, 167);' +
			'color: #4667A7;' +
			'border-radius: 2px;' +
			'cursor: pointer;' +
			'max-width: 710px;' +
			'text-align: center;' +
			'border: 1px solid rgb(70, 103, 167);' +
			'border: 1px solid #4667A7;' +
			'flex: 1 1 auto;' +
			'opacity: 0;' +
			'transition: opacity 0.25s ease;' +
		'}' +
		'.bundles-bundler-hop-animate .bundles-bundler-hop-close-offer {' +
			'opacity: 1;' +
		'}' +
		
		'.bundles-bundler-hop-checkout-loading {' +
			'color: rgba(0,0,0,0) !important;' +
			'position:relative;' +
		'}' +
		'.bundles-bundler-hop-checkout-loading:after {' +
			'display: block;' +
			'content: "";' +
			'border: 2px solid white;' +
			'border: 2px solid #FFFFFF;' +							
			'width: 1em;' +
			'height: 1em;' +
			'border-radius: 50%;' +
			'border-top: 2px solid transparent;' +
			'position: absolute;' +
			'left: 50%;' +
			'top: 50%;' +
			'animation-name: bundles-bundler-hop-spin;' +
			'animation-duration: 500ms;' +
			'animation-iteration-count: infinite;' +
			'animation-timing-function: linear;' +
			'transform-origin: 50% 50%;' +
		'}' +
		
		'@keyframes bundles-bundler-hop-spin {' +
			'from {' +
				'transform:translateY(-50%) translateX(-50%) rotate(0deg);' +
			'}' +
			'to {' +
				'transform:translateY(-50%) translateX(-50%) rotate(360deg);' +
			'}' +
		'}' +
		
		'.bundles-bundler-hop-hide-addtc-button .bndlr-add-to-cart {' +
			//'display:none;' +
			'pointer-events: none;' +
			'opacity: 0.5;' +
		'}' +
		
		'.bundles-bundler-hop-hidden {' +
			'display:none;' +
		'}' +
		
				
		'.bundles-bundler-hop-animate .bundles-bundler-hop-button-to-checkout {' +
			'animation: bundles-bundler-hop-shake 8s cubic-bezier(.34,.05,.17,.95) infinite 5s both;' +
			'transform: translate3d(0, 0, 0);' +
			'backface-visibility: hidden;' +
			'perspective: 2000px;' +
		'}' +
		'.bundles-bundler-hop-animate .bundles-bundler-hop-checkout-loading.bundles-bundler-hop-button-to-checkout {' +
			'animation: none;' +
		'}' +

		'@keyframes bundles-bundler-hop-shake {' +
			'1%, 9% {' +
				'transform: translate3d(-1px, 0, 0);' +
			'}' +
			'2%, 8% {' +
				'transform: translate3d(2px, 0, 0);' +
			'}' +
			'3%, 5%, 7% {' +
				'transform: translate3d(-4px, 0, 0);' +
			'}' +
			'4%, 6% {' +
				'transform: translate3d(4px, 0, 0);' +
			'}' +
			'10%, 100% {' +
				'transform: translate3d(0, 0, 0);' +
			'}' +
		'}' +
		
		/* Accessibility CSS */
		'.bundles-bundler-hop-close-offer:focus, .bundles-bundler-hop-button-to-checkout:focus, .bundles-bundler-hop-x-button:focus {' +
			'outline:1px dotted rgb(134, 134, 134);' +
			'outline-offset: 1px;' +
		'}' +
		'.bundles-bundler-hop-close-offer:focus, .bundles-bundler-hop-button-to-checkout:focus, .bundles-bundler-hop-x-button:focus {' +
			'opacity:0.9;' +
		'}' +
	'</style>');
	
	var template = '<div :class="{{ runtime.overlay_visibility_class }} bundles-bundler-hop-full-page-overlay">'+
			'<div class="bundles-bundler-hop-content">'+
				'<div :class="{{ runtime.addtc_button_hide_class }} bundles-bundler-hop-bundle-container">' +
					'<div class="bundler-target-element" '+
						':data-bundle="{{ active_promotion.bundle_id }}" ' +
						':style="{{ active_promotion.css_vars }}" ' +
						':data-bdnlr-preselected-products="{{ active_promotion.preselected_products }}" ' +
						':data-bdnlr-preselected-products-required="{{ active_promotion.preselected_products_required }}" ' +
						':data-cart-items="{{ active_promotion.cart_items }}" ' +
						'data-bndlr-no-redirect ' +
						'data-bndlr-keep-success-indicator>' +
						'<div class="bndlr-bundle-loading"></div>' +
					'</div>' +
				'</div>' +
				'<div :class="{{ runtime.buttons_visibility_class }}  {{ runtime.buttons_animation_class }} bundles-bundler-hop-buttons-container">' +
					'<div class="bundles-bundler-hop-close-offer" tabindex="0">' +
						'{{ runtime.close_text }}' +
					'</div>' +
					'<div :class="{{ runtime.buttons_checkout_loading_class }} bundles-bundler-hop-button-to-checkout" tabindex="0">' +
						'{{ runtime.to_checkout_text }}' +
					'</div>' +					
				'</div>' +
				'<div class="bundles-bundler-hop-x-button" tabindex="0" :data-hop-id="{{ active_promotion.id }}" ></div>' +
			'</div>' +
			
		'</div>';
		
	var data = {
		active_promotion: {
			id: '',
			bundle_id: '',
			preselected_products: '',			// Already selected products from the default set of products
			preselected_products_required: '',	// Already selected products from the required set of products
			cart_items: '', 					// Will contain cart items with a decreased quantity, so the Bundler can still use them when adding the products to the cart
			css_vars: ''
		},
		runtime: {
			overlay_visibility_class: 'bundles-bundler-hop-hidden',
			buttons_visibility_class: 'bundles-bundler-hop-hidden',
			addtc_button_hide_class: '',
			buttons_checkout_loading_class: '',
			buttons_animation_class: '',
			close_text: 'Close',
			to_checkout_text: 'To checkout',
			promotion_id: ''
		}			
	};

	/* --------------------- TRANSLATOR --------------------- */
	var Translator = (function() {
		
		function stripQuotes(string) {
			return string.replace("'", '').replace("'", '');
		}
		
		return {
			stripQuotes: stripQuotes
		}
	})();
	
	/* --------------------- MODEL --------------------- */
	var Model = (function() {
		
		function setValue(path, value) {
			if (path.indexOf('.') !== -1) {
				path = path.split('.');

				var tmpCopy = data;
				for (var i = 0; i < path.length; i++) {
					tmpCopy = setValueByPath(path[i], tmpCopy, value, (i === (path.length - 1)));
				}
			} else {
				data[path] = value;
			}
			
			return true;
		}
		
		function setValueByPath(key, object, value, isLast) {
			if (typeof object[key] === 'undefined') {
				object[key] = {};
			}
			// property exists in this object
			if (isLast) {
				object[key] = value;
				return object[key];
			} else {
				return object[key];
			}

			return object;
		}
		
		function getValue(path) {
			if (typeof path !== 'undefined') {
				if (path.indexOf('.') !== -1) {
					path = path.split('.');

					var tmpCopy = data;
					for (var i = 0; i < path.length; i++) {
						tmpCopy = tmpCopy[path[i]];
						if (i === (path.length - 1)) {
							return tmpCopy;
						}
					}
				} else {
					return data[path];
				}
			} else {
				return data;
			}
		}
		
		return {
			set: setValue,
			get: getValue
		}
	})();
	
	/* --------------------- MEDIATOR --------------------- */
	var Mediator = (function() {
		var actions = [];
		
		function addAction(key, action) {
			// Level will group actions by importance (number of dots in it)
			var level = key.split('.').length - 1;
			
			if (typeof actions[level] === 'undefined') {
				actions[level] = {};
			}
			
			actions[level][key] = action;
		}
		
		function runActions(key) {
			// dot level loop
			for (var i = 0; i < actions.length; i++) {
				// key loop
				for (var property in actions[i]) {
					if (actions[i].hasOwnProperty(property)) {
						if (key === property || property.indexOf(key) === 0 || key.indexOf(property) === 0) {
							// Execute action!
							actions[i][property]();
						}
					}
				}
			}
		}
		
		function updateModel(key, value) {
			var val = Model.get(key);
			
			Model.set(key, value);
			
			if (value !== val) {
				// Run actions only if the value was changed
				runActions(key);
			}
		}
		
		return {
			addAction: addAction,
			updateModel: updateModel
		}
		
	})();
	
	/* --------------------- VIEW --------------------- */
	var View = (function() {
		
				function RenderTemplate(html, options) {
			var re = /{(?:%|{)(.+?(?=%|}}))?(?:%|})}/g, 
			//reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, // temporarily disabled the advanced logic
			//code = 'var r=[];\n', 
			code = '', 
			cursor = 0, 
			match;
			var add = function(line, js) {
								js? (code += Model.get(line.replace(/\s/g, ''))) : (code += (line != '' ? line : ''));
				//return add;
			}
			
			while(match = re.exec(html)) {
				add(html.slice(cursor, match.index));
				if (match[0].indexOf('{{') === 0) {
					add(match[1].replace(/\s*/, ''), true);
				} else {
					add(match[1], true);
				}
				cursor = match.index + match[0].length;
			}
			add(html.substr(cursor, html.length - cursor));
			code += '';

						return code.replace(/[\r\t\n]/g, ' ');
		}
		
		// Subscribe attributes starting with : for any changes in the model (e.g. :class="{{ runtime.class }} some other class names")
		function SubscribeAttributes(html) {
			var re = /:(([a-zA-Z\-]+)="([^"]*)")/g, // regex to match :class="something"
			reKey = /{{(.+?(?=}}))?}}/g,
			cursor = 0, 
			subscribedHtml = '',
			match,
			keyMatch;
			
			var attributeSubscriptions = {};
			
			var add = function(line) {
				subscribedHtml += line;
			}
			
			while(match = re.exec(html)) {
				add(html.slice(cursor, match.index));
				
				var key = 'data-b-'+getRandomString(10);
				
				var modelKeys = [];
				while(keyMatch = reKey.exec(match[3])) {
					// Find each variable use in the attribute, so we can subscribe it to it's change
					var modelKey = keyMatch[1].replace(/[\r\t\n]/g, ' ').replace(/\s+/g, '');
				
					modelKeys.push(modelKey);
				}
				// Save key with the code which controlls the update
				attributeSubscriptions[key] = {
					attribute	: match[2],
					code		: match[3],
					modelKeys	: modelKeys
				}
				subscribeAttribute(key, attributeSubscriptions[key]);
				// Add key to the HTML
				add(' '+key);
				
				// Add actual attribute, without the : prefix
				add(' '+match[1]); 

				cursor = match.index + match[0].length;
			}
			add(html.substr(cursor, html.length - cursor));

			return subscribedHtml;
		}
		
		function subscribeAttribute(key, config) {
			if (config.modelKeys.length > 0) {
				for(var i = 0; i<config.modelKeys.length; i++) {
					var modelKey = config.modelKeys[i];
					Mediator.addAction(modelKey, function() {
						updateAttribute(key, config.attribute, config.code);
					});
				}
			}
		}
		
		function updateAttribute(key, attribute, code) {
			var value = RenderTemplate(code, Model.get());
			var element = document.querySelector('['+key+']');
			if (element !== null) {
				element.setAttribute(attribute, value);
			}
		}
		
		function getRandomString(length) {
			var result           = '';
			var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			var a = [];
			for ( var i = 0; i < length; i++) {
				a.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
			}
			return a.join('');
		}
		
		function render() {
			var data = Model.get();
		
			var html 	= SubscribeAttributes(template);
			html 		= RenderTemplate(html, data);
			
			$('body').append(html);
		}
		
		return {
			render: render
		}
	})();
	
	/* --------------------- Utility --------------------- */
	// Collection of various utilities
	var Utility = (function() {
		var cart = {
			get: function() {
				var endpoint = 'cart.js';
				return $.ajax({
					url: nav.getRootUrl() + endpoint,
					dataType: 'json'
				});
			}
		}
		
		// Navigation object
		var nav = {
			getRootUrl: function(withLocale) {
				if (typeof withLocale === 'undefined') {
					withLocale = false;
				}
				
				var locale = '';
				if (withLocale) {
					locale = this.getUrlLocale();
				}
				
				if (this.isShopPage() === false) {
					// Return Shopify URL on third party pages
					return 'https://hamptonshomeau.myshopify.com/';
				} else {
					var url = window.location.origin?window.location.origin+'/':window.location.protocol+'//'+window.location.host+'/';
					if (locale.length > 0) {
						// Locale is set in the current URL, add it to the root URL
						url += locale+'/';
					}
					return url;
				}
			},
			isShopPage: function() {
				if (typeof Shopify !== 'undefined' && Shopify.shop === 'hamptonshomeau.myshopify.com') {
					return true;
				}
				
				return false;
			},
			getLocale: function() {
				if (typeof Shopify !== 'undefined' && typeof Shopify.locale === 'string') {
					return Shopify.locale
				}
				
				return '';
			},
			getUrlLocale: function() {
				var baseUrl = this.getRootUrl();
				var locale 	= this.getLocale();
				
				if (locale !== '') {
					// Check if the baseurl + locale is present in the url
					if (window.location.href.indexOf(baseUrl+locale+'/') === 0) {
						return locale;
					}
				}

				return '';
			},
			isCartPage: function() {
				if (/\/cart\/?/.test(window.location.href)) {
					return true;
				}
				return false;
			}
		};
		
		var local = {
			//maxAge: 60*1000*60*10, // Timer for how long will the closed hop remain closed
			maxAge: 60*1000*60*1, // Timer for how long will the closed hop remain closed. Reduced to 1h on 2021-01-18.
			key : 'bndlr_hop',
			save: function(key, value) {
				try {
					var ld = {};

					try {
						var localData = localStorage.getItem(this.getKey());
						localData = JSON.parse(localData);
					} catch(e) {
						//console.log('no data yet');
					}
					
					if (typeof localData === 'object' && localData !== null) {
						ld = localData;
					}
					
					ld[key] = {
						value: value,
						time: (new Date().getTime())
					}

					ld = JSON.stringify(ld);
					localStorage.setItem(this.getKey(), ld);

				} catch(e) {
					console.log('Error when saving data', e);
				}
			},
			get: function(key) {
				try {
					
					var ld = localStorage.getItem(this.getKey());
					ld = JSON.parse(ld);

					if (typeof ld[key] === 'undefined' ||  ld[key].time === 'undefined') {
						return null;
					}

					if (ld[key].time < (new Date().getTime() - this.maxAge)) {
						// data is too old
						return null;
					}

					return ld[key].value;
				} catch(e) {
					return null;
				}
				return null;
			},
			getAll: function() {
				var results = {};
				try {
					
					var ld = localStorage.getItem(this.getKey());
					ld = JSON.parse(ld);

					for (var key in ld) {
						if (ld[key].time >= (new Date().getTime() - this.maxAge)) {
							// Value is still relevant
							results[key] = ld[key].value;
						}
					}

				} catch(e) {
					console.log(e);
				}
				return results;
			},
			getKey: function() {
				return this.key;
			}
		};

		
		return {
			cart	: cart,
			nav		: nav,
			local	: local
		}
	})();
	
	/* --------------------- CONTROLLER --------------------- */
	var Controller = (function() {		
		
		function init() {
			showPromotion(true);
			
			if (canShowAnyPromotion(false)) {
				// Add cart hooks only if we can actually show any promotion after the add to cart action
				// Hook to add to cart events
				hookToAddToCartEvent();
			}
			
			setGlobalListeners();
		}
		
		function hookToAddToCartEvent() {
			(function(open) {
				XMLHttpRequest.prototype.open = function() {
					var rurl = '';
					if (typeof arguments[1] === 'string' && arguments[1].length > 0) {
						rurl = arguments[1];
						
						this.addEventListener('load', function() {
							try  {
								if (typeof rurl === 'string' && rurl.length > 0) {
																		handleAddToCart(rurl, this.response);
								}
							} catch (t) {
								console && console.warn && console.warn('[Bundler event listener] Error in handleXhrDone:  ' + t.message)
							}
						})
					}
					return open.apply(this, arguments);
				}
				
				function handleAddToCart(url, product) {
					try {
						if (product.length > 0) {
							var product = JSON.parse(product);
							
							if (typeof product.variant_id === 'number') {
								
								var types = [
									'/cart/add.js',
									'/cart/add.json',
									'/cart/add'
								];
								
								for(var i = 0; i<types.length; i++) {
									if (url.indexOf(types[i]) !== -1 && url.indexOf('bundler-cart-call') === -1) {
										// Trigger bundler hops event
										var event = new CustomEvent('bndlr:show_hops', {
											detail: {
												variant_id : product.variant_id
											}
										});
										// Dispatch the event.
										document.dispatchEvent(event);
										
										// Stop the loop
										i = types.length;
									}
								}
							}
						}
					} catch(e) {
						//console && console.warn && console.warn('[Bundler event listener] Error in handleAddToCart:  ' + e.message)
					}
				}
				
			})(XMLHttpRequest.prototype.open);
			
						(function(w) {
				if (typeof w.fetch === 'function') {
					try {
						// Override the fetch function to listen for cart refresh actions
						var oldFetch = w.fetch;  // must be on the global scope
						w.fetch = function() {
							var promise = oldFetch.apply(this, arguments);
							try  {

								if (typeof arguments[0] === 'string' && arguments[0].length > 0) {
									var rurl = arguments[0];
									promise.then(function(data) {
										try  {
											if (typeof rurl === 'string' && rurl.length > 0) {
												handleAddToCart(rurl, data);
											}
										} catch (t) {
											console && console.warn && console.warn('[Bundler event listener] Error in fetch:  ' + t.message)
										}
									});
								}
							} catch(e) {
								console.error(e);
							}
							// Return the promise
							return promise;
						}
					} catch(e) {
						console.log(e);
					}
				}
				
				function handleAddToCart(url, data) {
					var types = [
						'/cart/add.js',
						'/cart/add.json',
						'/cart/add'
					];
					
					for(var i = 0; i<types.length; i++) {
						if (url.indexOf(types[i]) !== -1 && url.indexOf('bundler-cart-call') === -1) {
							// Clone the response, so others can also read it and then read it
							data.clone().json().then(function(p) {

								if (typeof p.variant_id === 'number') {
									// Trigger bundler hops event
									var event = new CustomEvent('bndlr:show_hops', {
										detail: {
											variant_id : p.variant_id
										}
									});
									// Dispatch the event.
									document.dispatchEvent(event);
								}
							});
							
							// Stop the loop
							i = types.length;
						}
					}
				}
				
			})(window);
		}
		
		function canShowAnyPromotion(isOnInit, forVariantId) {
			
			for(var i=0; i<promotions.length; i++) {
				if (canShowPromotion(promotions[i], isOnInit, forVariantId)) {
					return true;
				}
			}
			return false;
		}
		
		function canShowPromotion(promotion, isOnInit, forVariantId) {
			var isCartPage = Utility.nav.isCartPage();
			var closedHops = Utility.local.getAll();
			
			var promotionId = promotion.id+'';
			
							if (typeof closedHops[promotionId] !== 'undefined') {
					// This promotion was closed. Continue to next one.
					return false;
				}
						
			if (Object.keys(promotion.bundle_data).length == 0) {
				// This promotion has no bundle data with it
				return false;
			}
			
			if (promotion.bundle_data.status !== 'enabled') {
				// The bundle in the promotion is disabled
				return false;
			}
			
			if (isCartPage) {
				// We are on cart page
				if (isOnInit) {
					// Page load
					if (promotion.show_on_cart_page_on_load !== 'true') {
						// Can't show this promotion on page load on cart page
						return false;
					}
				} else {
					// On cart change (product added to the cart)
					if (promotion.show_on_cart_page_on_change !== 'true') {
						// Can't show this promotion on cart change on cart page
						return false;
					}
				}
			} else {
				// We are on other page
				if (isOnInit) {
					// Page load
					if (promotion.show_on_others_on_load !== 'true') {
						// Can't show this promotion on page load on other pages
						return false;
					}
				} else {
					// On cart change (product added to the cart)
					if (promotion.show_on_others_on_change !== 'true') {
						// Can't show this promotion on cart change on other pages
						return false;
					}
				}
			}
			
			if (typeof forVariantId === 'number') {
				if (!isVariantInBundle(promotion.bundle_data, forVariantId)) {
					return false;
				}
			}
			
			return true;
		}
		
		// Check if a specific variant if is in bundle. It can be either in a products object or in the required products boject
		function isVariantInBundle(bundle, variantId) {
			var productSets = [
				'products',
				'required_products'
			];
			// Loop through product sets
			for (var i = 0; i< productSets.length; i++) {
				if (typeof bundle[productSets[i]] !== 'undefined') {
					// Loop through products
					for(var k in bundle[productSets[i]]) {
						if (bundle[productSets[i]].hasOwnProperty(k)) {
							// Loop through variants
							for (var v in bundle[productSets[i]][k].variants) {
								if (bundle[productSets[i]][k].variants.hasOwnProperty(v)) {
									// Check if the variant id matched the currently checked variant
									if (bundle[productSets[i]][k].variants[v].id === variantId+'') {
										return true;
									}
								}
							}
						}
					}
				}
			}
			
			return false;
		}
		
		function showPromotion(onInit, forVariantId) {
			if (typeof onInit === 'undefined') {
				onInit = false;
			}

			if (canShowAnyPromotion(onInit, forVariantId)) {

				if ($('.bundles-bundler-hop-full-page-overlay').length === 0) {
					View.render();
					setViewListeners();
					checkFontSize();
				}
				
				// Get cart contents
				// Check if there is any product from the promoted bundle in the cart
				// Display promotion if it is
				Utility.cart.get().done(function(cartData) {
					var relatedPromotion = false;
					
					relatedPromotion = getRelatedPromotion(cartData.items, onInit, forVariantId);
					
					if (relatedPromotion !== false) {
						Mediator.updateModel('active_promotion', relatedPromotion);
						Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-visible');
						bndlr.refresh();
					}
				});
			}
		}
		
		var debouncers = [];
		function debounce(key, callback, delay) {
			if (typeof debouncers[key] !== 'undefined') {
				clearTimeout(debouncers[key]);
			}
			debouncers[key] = setTimeout(callback, delay);			
		}
		
		// Object for accessing products from local storage
		
		var viewListenersAreSet = false;
		function setViewListeners() {
			if (viewListenersAreSet === false) {
				var clickWasInHopContentDiv = false;
				// Click on pop content
				$(document).on('click', '.bundles-bundler-hop-content', function(e) {
					clickWasInHopContentDiv = true;
					//e.stopPropagation();
					//e.stopImmediatePropagation();
				});
				
				// Click anywhere outside of the popup
				$(document).on('click', '.bundles-bundler-hop-full-page-overlay', function() {
					
					if (clickWasInHopContentDiv === false) {
						Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-hidden');
					} else {
						// Reset the variable, so it is ready for the next click
						clickWasInHopContentDiv = false;
					}
				});
				
				// Click on X button (top right corner)
				$(document).on('click', '.bundles-bundler-hop-x-button', function() {
					Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-hidden');

					if (typeof $(this).attr('data-hop-id')  !== 'undefined' && $(this).attr('data-hop-id') !== '') {
						// Promotion was closed through the X button. Mark it as closed.
						Utility.local.save($(this).attr('data-hop-id'), 'closed');
					}
				});
				// Accessibility
				$(document).on('keydown', '.bundles-bundler-hop-x-button', function(e) {
					if (e.which == 13 || e.which == 32) { // 13 = Enter, 32 = Space
						Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-hidden');
						if (typeof $(this).attr('data-hop-id') !== 'undefined' && $(this).attr('data-hop-id') !== '') {
							// Promotion was closed through the X button. Mark it as closed.
							Utility.local.save($(this).attr('data-hop-id'), 'closed');
						}
					}
				});
				
				// Click on Close button
				$(document).on('click', '.bundles-bundler-hop-close-offer', function() {
					Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-hidden');
				});
				// Accessibility
				$(document).on('keydown', '.bundles-bundler-hop-close-offer', function(e) {
					if (e.which == 13 || e.which == 32) { // 13 = Enter, 32 = Space
						Mediator.updateModel('runtime.overlay_visibility_class', 'bundles-bundler-hop-hidden');
					}
				});
				
				// Click on to checkout button
				$(document).on('click', '.bundles-bundler-hop-button-to-checkout', function() {
					Mediator.updateModel('runtime.buttons_checkout_loading_class', 'bundles-bundler-hop-checkout-loading');
					bndlr.checkout();
				});
				// Accessibility
				$(document).on('keydown', '.bundles-bundler-hop-button-to-checkout', function(e) {
					if (e.which == 13 || e.which == 32) { // 13 = Enter, 32 = Space
						Mediator.updateModel('runtime.buttons_checkout_loading_class', 'bundles-bundler-hop-checkout-loading');
						bndlr.checkout();
					}
				});
				
				// After the bundle gets added to the cart
				$(document).on('bndlr:bundle_added_to_cart', function() {
					
					
						Mediator.updateModel('runtime.buttons_visibility_class', 'bundles-bundler-hop-visible');
						setTimeout(function() {
							Mediator.updateModel('runtime.buttons_animation_class', 'bundles-bundler-hop-animate');
						}, 100);
						
						Mediator.updateModel('runtime.addtc_button_hide_class', 'bundles-bundler-hop-hide-addtc-button');
										
				});
				
				var autoSelectVariantsTimeout = 0;
				$(document).on('bundler_bundle_widget_created', function() {
					clearTimeout(autoSelectVariantsTimeout);
					autoSelectVariantsTimeout = setTimeout(selectProductVariantsInWidgets, 50);
				});
				
				viewListenersAreSet = true;
			}
		}
		
		var globalListenersAreSet 	= false;
		function setGlobalListeners() {
			if (globalListenersAreSet === false) {
				// Event which can be used to trigger the script to display the popup
				document.addEventListener('bndlr:show_hops', function(e) {
					if (typeof e.detail !== 'undefined' && typeof e.detail.variant_id === 'number') {
						debounce('show_promotion', function() {
							showPromotion(false, e.detail.variant_id);
						}, 1000);
					}
				});
				
				globalListenersAreSet = true;
			}
		}		
		
		function selectProductVariantsInWidgets() {
			// Get preselected products and select the correct variants
			$('.bundles-bundler-hop-bundle-container [data-bdnlr-preselected-products]').each(function(i, el) {

				// Get the preselected products
				var preselectedProducts = [];
				try {
					if ($(el).attr('data-bdnlr-preselected-products').length > 0) {
						preselectedProducts = JSON.parse($(el).attr('data-bdnlr-preselected-products'));
					}
				} catch(e) {
					console.error(e);
				}
				
				for(var i = 0; i<preselectedProducts.length; i++) {
					var productId = preselectedProducts[i].product_id;
					var variantId = preselectedProducts[i].variant_id;
					var variantSelector = '.bndlr-product[data-required="false"][data-product-id="'+productId+'"] .bndlr-select-variant option[value="'+variantId+'"]';
					
					var variant = $(el).find(variantSelector);
					if (variant.length > 0) {
						variant.parent('select').val(variant.val()).change();
					}
				}
			});
			
			// Get preselected REQUIRED products and select the correct variants
			$('.bundles-bundler-hop-bundle-container [data-bdnlr-preselected-products-required]').each(function(i, el) {

				// Get preselected required products
				var preselectedProductsRequired = [];
				try {
					if ($(el).attr('data-bdnlr-preselected-products-required').length > 0) {
						preselectedProductsRequired = JSON.parse($(el).attr('data-bdnlr-preselected-products-required'));
					}
				} catch(e) {
					console.error(e);
				}
				
				for(var i = 0; i<preselectedProductsRequired.length; i++) {
					var productId = preselectedProductsRequired[i].product_id;
					var variantId = preselectedProductsRequired[i].variant_id;
					var variantSelector = '.bndlr-product[data-required="true"][data-product-id="'+productId+'"] .bndlr-select-variant option[value="'+variantId+'"]';
					
					var variant = $(el).find(variantSelector);
					
					if (variant.length > 0) {
						variant.parent('select').val(variant.val()).change();
					}
				}
			});
		}
		
		function getRelatedPromotion(cartItems, isOnInit, forVariantId) {
			
			if (typeof _internalFunctionCollection.removeBundledItemsFromCart !== 'undefined') {
				// Call the method which will reduce the quantity of items which are already in full bundles.
				// The quantity will be reduced by reference.
				_internalFunctionCollection.removeBundledItemsFromCart(cartItems);
			}

			// This is smart enough to display the offer only if a few products are missing from the bundle
			for(var i=0; i<promotions.length; i++) {

				if (canShowPromotion(promotions[i], isOnInit, forVariantId)) {
					
					var productIdSelector = 'product_id';
					if (promotions[i].bundle_data.product_level === 'variant') {
						// change it to variant_id, as we have a variant level product
						productIdSelector = 'variant_id';
					}
					
					var missingAndContainerProducts = getMissingAndContainedProducts(cartItems, promotions[i].bundle_data);
					
					var one_product_is_at_least_partially_in_cart 	= missingAndContainerProducts.one_product_is_at_least_partially_in_cart;
					var contained 									= missingAndContainerProducts.contained_variants.concat(missingAndContainerProducts.contained_variants_required);
					var missing 									= missingAndContainerProducts.missing_products.concat(missingAndContainerProducts.missing_products_required);
					
					//if ((contained.length > 0 && missing.length > 0) || missingAndContainerProducts.mix_n_match_is_incomplete) {
					if (one_product_is_at_least_partially_in_cart && missing.length > 0) {
						var promotion = JSON.parse(JSON.stringify(promotions[i]));
						promotion['preselected_products'] 			= JSON.stringify(missingAndContainerProducts.contained_variants);
						promotion['preselected_products_required'] 	= JSON.stringify(missingAndContainerProducts.contained_variants_required);
						
						var cart_items = [];
						for(var iitem=0; iitem<missingAndContainerProducts.cart_items.length; iitem++) {
							cart_items.push({
								product_id	: missingAndContainerProducts.cart_items[iitem].product_id,
								variant_id	: missingAndContainerProducts.cart_items[iitem].variant_id,
								quantity	: missingAndContainerProducts.cart_items[iitem].quantity,
								properties	: missingAndContainerProducts.cart_items[iitem].properties
							});
						}
						promotion['cart_items']					 	= JSON.stringify(cart_items);
						
						var css_vars = '';
						// Set CSS vars for classic products
						for (var j = 0; j<missingAndContainerProducts.contained_variants.length; j++) {
							css_vars += '--preproduct-'+missingAndContainerProducts.contained_variants[j][productIdSelector]+'-overlay-display:block;';
						}
						// Set CSS vars for required non-discounted products
						for (var j = 0; j<missingAndContainerProducts.contained_variants_required.length; j++) {
							css_vars += '--preproduct-required-'+missingAndContainerProducts.contained_variants_required[j][productIdSelector]+'-overlay-display:block;';
						}
						promotion['css_vars'] = css_vars;
						
						return promotion;
					}
				}
			}
			
			return false;
		}
		
		function getMissingAndContainedProducts(cartItems, bundle) {
			var missingProducts 	= [];
			var containedVariants 	= [];
			
			var missingRequiredProducts 	= [];
			var containedRequiredVariants 	= [];
			
			var mixnmatchIsIncomplete = false;
			
			var oneProductIsAtLeastPartiallyInCart = false;
			
			if (bundle.minimum_requirements === 'all_products') {
				// Classic bundle
				// For bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						
						var product = bundle.products[productId];
						var isContained = false;
						// For bundle product variants
						variants_loop_classic:
						for (var varKey in product.variants) {
							if (product.variants.hasOwnProperty(varKey)) {
								
								// For cart items
								for (var i = 0; i < cartItems.length; i++) {
									
									if (product.variants[varKey].id == cartItems[i].variant_id && cartItems[i].quantity > 0) {
										// Shouldn't we add a cartItems[i].quantity > 0 check and set the oneProductIsAtLeastPartiallyInCart = true here?
										// The problem can be with any additional line item properties, which can differ if the product is added to the cart multiple times, and each item has different properties.
										oneProductIsAtLeastPartiallyInCart = true;
										
										if (cartItems[i].quantity >= product.variants[varKey].quantity) {
											
											//oneProductIsAtLeastPartiallyInCart = true;
										
											var quantity = 1;
											// Decrease the quantity for this cart item
											if (cartItems[i].quantity >= product.variants[varKey].quantity) {
												quantity = product.variants[varKey].quantity;
											} else {
												quantity = cartItems[i].quantity;
											}
											
											containedVariants.push({
												product_id: product.id,
												variant_id: cartItems[i].variant_id,
												quantity: quantity
											});
											
											isContained = true;
											// Decrease the quantity for this cart item
											cartItems[i].quantity = cartItems[i].quantity - quantity;
											
											break variants_loop_classic;
										}											
									}
								}
							}
						}
						
						if (isContained === false) {
							missingProducts.push({
								product_id: product.id
							});
						}
					}
				}
			} else if (bundle.minimum_requirements === 'specific_products') {
				// Required non-discounted products
				
				// For bundle products
				for (var productId in bundle.products) {
					if (bundle.products.hasOwnProperty(productId)) {
						
						var product = bundle.products[productId];
						var isContained = false;
						// For bundle product variants
						variants_loop_specific:
						for (var varKey in product.variants) {
							if (product.variants.hasOwnProperty(varKey)) {
								
								// For cart items
								for (var i = 0; i < cartItems.length; i++) {
									
									if (product.variants[varKey].id == cartItems[i].variant_id && cartItems[i].quantity > 0) {

										oneProductIsAtLeastPartiallyInCart = true;

										if (cartItems[i].quantity >= product.variants[varKey].quantity) {
											var quantity = 1;
											// Decrease the quantity for this cart item
											if (cartItems[i].quantity >= product.variants[varKey].quantity) {
												quantity = product.variants[varKey].quantity;
											} else {
												quantity = cartItems[i].quantity;
											}
											
											containedVariants.push({
												product_id: product.id,
												variant_id: cartItems[i].variant_id,
												quantity: quantity
											});
											
											if (product.variants[varKey].quantity ===  quantity) {
												// Only if the full quantity matches, the product is in the bundle
												isContained = true;
											}
											// Decrease the quantity for this cart item
											cartItems[i].quantity = cartItems[i].quantity - quantity;
											
											break variants_loop_specific;
										}										
									}
								}
							}
						}
						
						if (isContained === false) {
							missingProducts.push({
								product_id: product.id
							});
						}
					}
				}
				
				// For required products
				for (var productId in bundle.required_products) {
					if (bundle.required_products.hasOwnProperty(productId)) {
						
						var product = bundle.required_products[productId];
						var isContained = false;
						// For bundle required product variants
						variants_loop_specific_required:
						for (var varKey in product.variants) {
							if (product.variants.hasOwnProperty(varKey)) {
								
								// For cart items
								for (var i = 0; i < cartItems.length; i++) {
									
									if (product.variants[varKey].id == cartItems[i].variant_id && cartItems[i].quantity > 0) {

										oneProductIsAtLeastPartiallyInCart = true;

										if (cartItems[i].quantity >= product.variants[varKey].quantity) {
											var quantity = 1;
											// Decrease the quantity for this cart item
											if (cartItems[i].quantity >= product.variants[varKey].quantity) {
												quantity = product.variants[varKey].quantity;
											} else {
												quantity = cartItems[i].quantity;
											}
											
											containedRequiredVariants.push({
												product_id: product.id,
												variant_id: cartItems[i].variant_id,
												quantity: quantity
											});
											
											if (product.variants[varKey].quantity ===  quantity) {
												// Only if the full quantity matches, the product is in the bundle
												isContained = true;
											}
											// Decrease the quantity for this cart item
											cartItems[i].quantity = cartItems[i].quantity - quantity;
											break variants_loop_specific_required;
										}										
									}
								}
							}
						}
						
						if (isContained === false) {
							missingRequiredProducts.push({
								product_id: product.id
							});
						}
					}
				}
				
			} 			
			return {
				one_product_is_at_least_partially_in_cart	: oneProductIsAtLeastPartiallyInCart,
				missing_products							: missingProducts,
				contained_variants							: containedVariants,
				contained_variants_required					: containedRequiredVariants,
				missing_products_required					: missingRequiredProducts,
				mix_n_match_is_incomplete					: mixnmatchIsIncomplete,
				cart_items									: cartItems
			};
		}
		
		function checkFontSize() {
			
			try {
				var el = document.querySelector('.bundles-bundler-hop-full-page-overlay');
				var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
				var fontSize = parseFloat(style); 

				if (fontSize < 14) {
					$('.bundles-bundler-hop-full-page-overlay').css({'font-size': '14px'});
				}
			} catch(e) {}
		}
		
		
		return {
			init: init
		}
	})();

	Controller.init();	
}		
		if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 3) || typeof jQuery.ajax === 'undefined') {
							var jqueryUrl = '//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
						
			
			loadScript(jqueryUrl, function(){

				jQuery341 = jQuery.noConflict(true);
				bundler(jQuery341);
				if (typeof BundlerPromotions === 'function') {
					BundlerPromotions(jQuery341);
				}
			});
		} else {
			bundler(jQuery);
			
			if (typeof BundlerPromotions === 'function') {
				BundlerPromotions(jQuery);
			}
		}
		
		// Mark bundler as loaded
		window.bundlerLoaded = true;
	})();
}