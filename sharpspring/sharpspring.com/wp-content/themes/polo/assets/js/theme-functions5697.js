//Global var
var INSPIRO = {};

(function ($) {

    // USE STRICT
    "use strict";

    //----------------------------------------------------/
    // Predefined Variables
    //----------------------------------------------------/
    var $window = $(window),
        $document = $(document),
        $body = $('body'),
        $wrapper = $('.wrapper'),
        $topbar = $('#topbar'),
        $header = $('#header'),


        //Logo
        logo = $('#logo').find('.logo'),
        logoImg = logo.find('img').attr('src'),
        logoDark = logo.attr('data-dark-logo'),

        //Main menu
        $mainmenu = $('#mainMenu'),
        $mainmenuitems = $mainmenu.find('.dropdown > a'),
        $mainsubmenuitems = $mainmenu.find('li.dropdown-submenu > a, li.dropdown-submenu > span'),
        $itemClick = $('#mainMenu > ul > li > a'),

        //Vertical Dot Menu
        navigationItems = $('#vertical-dot-menu a'),

        //Side panel
        sidePanel = $('#side-panel'),
        sidePanellogo = $('#panel-logo').find('.logo'),
        sidePanellogoImg = sidePanellogo.find('img').attr('src'),
        sidePanellogoDark = sidePanellogo.attr('data-dark-logo'),

        //Fullscreen panel
        fullScreenPanel = $('#fullscreen-panel'),

        $topSearch = $('#top-search'),
        $parallax = $('.parallax'),
        $textRotator = $('.text-rotator'),

        //Window size control
        $fullScreen = $('.fullscreen') || $('.section-fullscreen'),
        $halfScreen = $('.halfscreen'),


        //Elements
        dataAnimation = $("[data-animation]"),
        $counter = $('.counter:not(.counter-instant)'),
        $countdownTimer = $('.countdown'),
        $progressBar = $('.progress-bar'),
        $pieChart = $('.pie-chart'),
        accordionType = "accordion",
        toogleType = "toggle",
        accordionItem = "ac-item",
        itemActive = "ac-active",
        itemTitle = "ac-title",
        itemContent = "ac-content",

        $lightbox_gallery = $('[data-lightbox-type="gallery"]'),
        $lightbox_image = $('[data-lightbox-type="image"]'),
        $lightbox_iframe = $('[data-lightbox-type="iframe"]'),
        $lightbox_ajax = $('[data-lightbox-type="ajax"]'),

        //Widgets
        $flickr_widget = $('.flickr-widget'),

        //Utilites
        classFinder = ".";

	//----------------------------------------------------/
	// Problem solving when clicking on a link in the menu
	//----------------------------------------------------/
	$itemClick.on('touchstart', function (e) {
        var href = $(this).attr('href');
        var $parent = $(this).parent('li');
        
        if (!$parent.hasClass('menu-item-has-children')) {
            return;
        }
        
        e.preventDefault();
        if ($parent.hasClass('clicked')) {
            window.location = href;
        } else {
            $parent.addClass('clicked');
        }
    });

    //----------------------------------------------------/
    // UTILITIES
    //----------------------------------------------------/

    //Check if function exists
    $.fn.exists = function () {
        return this.length > 0;
    };
    //Add class to tables

    $('table').addClass('table').addClass('table-bordered');


    //----------------------------------------------------/
    // MOBILE CHECK
    //----------------------------------------------------/
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


    //----------------------------------------------------/
    // RESPONSIVE CLASSES
    //----------------------------------------------------/
    INSPIRO.responsiveClasses = function () {

        var jRes = jRespond([
            {
                label: 'smallest',
                enter: 0,
                exit: 479
            }, {
                label: 'handheld',
                enter: 480,
                exit: 767
            }, {
                label: 'tablet',
                enter: 768,
                exit: 991
            }, {
                label: 'laptop',
                enter: 992,
                exit: 1199
            }, {
                label: 'desktop',
                enter: 1200,
                exit: 10000
            }
        ]);
        jRes.addFunc([
            {
                breakpoint: 'desktop',
                enter: function () {
                    $body.addClass('device-lg');
                },
                exit: function () {
                    $body.removeClass('device-lg');
                }
            }, {
                breakpoint: 'laptop',
                enter: function () {
                    $body.addClass('device-md');
                },
                exit: function () {
                    $body.removeClass('device-md');
                }
            }, {
                breakpoint: 'tablet',
                enter: function () {
                    $body.addClass('device-sm');
                },
                exit: function () {
                    $body.removeClass('device-sm');
                }
            }, {
                breakpoint: 'handheld',
                enter: function () {
                    $body.addClass('device-xs');
                },
                exit: function () {
                    $body.removeClass('device-xs');
                }
            }, {
                breakpoint: 'smallest',
                enter: function () {
                    $body.addClass('device-xxs');
                },
                exit: function () {
                    $body.removeClass('device-xxs');
                }
            }
        ]);
    };

    //----------------------------------------------------/
    // PAGE LOADER
    //----------------------------------------------------/
    INSPIRO.loader = function () {

        if (!$body.hasClass('no-page-loader')) {

            var pageInAnimation = $body.attr('data-animation-in') || "fadeIn",
                pageOutAnimation = $body.attr('data-animation-out') || "fadeOut",
                pageLoaderStylePath = $body.attr('data-animation-icon-path') || "library/img/svg-loaders/",
                pageLoaderStyle = $body.attr('data-animation-icon') || "ring.svg",
                pageInDuration = $body.attr('data-speed-in') || 1000,
                pageOutDuration = $body.attr('data-speed-out') || 500;

            $wrapper.animsition({
                inClass: pageInAnimation,
                outClass: pageOutAnimation,
                inDuration: pageInDuration,
                outDuration: pageOutDuration,
                linkElement: '#mainMenu a:not([target="_blank"]):not([href*="#"]), .animsition-link',
                loading: true,
                loadingParentElement: 'body', //animsition wrapper element
                loadingClass: 'animsition-loading',
                loadingInner: '<img src="' + pageLoaderStylePath + pageLoaderStyle + '">', // e.g '<img src="loading.svg" />'
                timeout: false,
                timeoutCountdown: 5000,
                onLoadEvent: true,
                browser: ['animation-duration', '-webkit-animation-duration'],
                // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
                // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
                overlay: false,
                overlayClass: 'animsition-overlay-slide',
                overlayParentElement: 'body',
                transition: function (url) {
                    window.location.href = url;
                }

            });

            //Skip loader if page has an js error or not loading for more than 5 seconds!
            setTimeout(function () {
                if ($(".animsition-loading").length) {
                    $body.addClass("no-page-loader");
                    $(".animsition-loading").hide();
                }
            }, 5000);
        }
    };

    INSPIRO.screenSizeControl = function () {
        if ($fullScreen.exists()) {

            var headerHeight = $header.height();
            var topbarHeight = $topbar.height();

            $fullScreen.each(function () {
                var $elem = $(this),
                    elemHeight = $window.height();

                $elem.css('height', elemHeight);
            });
        }

        if ($halfScreen.exists()) {
            $halfScreen.each(function () {
                var $elem = $(this),
                    elemHeight = $window.height();

                $elem.css('height', elemHeight / 1.5);
            });
        }
    };

    //----------------------------------------------------/
    // CAROUSEL SLIDER
    //----------------------------------------------------/

    INSPIRO.carouselInspiro = function () {

        var $sliderCarousel = $('.carousel') || $('.owl-carousel'),
            $postCarousel = $(".post-mini-slider");

        if ($sliderCarousel.exists()) {
            $sliderCarousel.each(function () {
                var element = $(this),

                    sliderCarouselColumns = element.attr('data-carousel-col') || "4",
                    sliderCarouselColumnsMedium = element.attr('data-carousel-col-md') || "4",
                    sliderCarouselColumnsSmall = element.attr('data-carousel-col-sm') || "3",
                    sliderCarouselColumnsExtraSmall = element.attr('data-carousel-col-xs') || "1",
                    $sliderCarouselMargins = element.attr('data-carousel-margins') || "20",
                    $sliderCarouseDots = element.attr('data-carousel-dots') || false,
                    $sliderCarouseNav = false,
                    $sliderCarouseAutoPlay = element.attr('data-carousel-autoplay') || false,
                    $sliderCarouseInfinite = element.attr('data-carousel-autoplay') || false,
                    $sliderCarouseAutoPlayDelay = element.attr('data-carousel-autoplay-delay') || '5000',
                    $sliderCarouseVideo = element.attr('data-carousel-video') || false,
                    $sliderCarouseAutoPlaySpeed = element.attr('data-carousel-autoplay-delay') ? '1000' : false;


                if ($sliderCarouseDots === false) {
                    $sliderCarouseNav = true;
                } else {
                    $sliderCarouseDots = true;
                }

                if (sliderCarouselColumns == 1) {
                    element.owlCarousel({
                        margin: Number($sliderCarouselMargins),
                        nav: $sliderCarouseNav,
                        navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                            '<i class="fa fa-arrow-right icon-white"></i>'],
                        autoplay: $sliderCarouseAutoPlay,
                        loop: $sliderCarouseInfinite,
                        autoplayTimeout : $sliderCarouseAutoPlayDelay,
                        autoplaySpeed: 800,
                        autoplayHoverPause: true,
                        dots: $sliderCarouseDots,
                        items: 1,
                        autoHeight: false,
                        video: $sliderCarouseVideo,

                    });


                } else {

                    element.owlCarousel({
                        margin: Number($sliderCarouselMargins),
                        nav: $sliderCarouseNav,
                        navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                            '<i class="fa fa-arrow-right icon-white"></i>'],
                        autoplay: $sliderCarouseAutoPlay,
                        loop: $sliderCarouseInfinite,
                        autoplayHoverPause: true,
                        autoplayTimeout : $sliderCarouseAutoPlayDelay,
                        autoplaySpeed: $sliderCarouseAutoPlaySpeed,
                        dots: $sliderCarouseDots,
                        video: $sliderCarouseVideo,
                        responsive: {
                            0: {
                                items: sliderCarouselColumnsExtraSmall
                            },
                            600: {
                                items: sliderCarouselColumnsSmall
                            },
                            1000: {
                                items: sliderCarouselColumnsMedium
                            },
                            1200: {
                                items: sliderCarouselColumns
                            }
                        }
                    });


                }

            });
        }

        if ($postCarousel.exists()) {
            $postCarousel.each(function () {
                setTimeout(function () {
                    $postCarousel.owlCarousel({
                        autoplay: true,
                        autoplayHoverPause: true,
                        dots: true,
                        mouseDrag: false,
                        touchDrag: false,
                        items: 1,
                        autoHeight: true,
                    });
                }, 100);

            });
        }

        if ($("#slider-carousel").exists()) {
            $("#slider-carousel").each(function () {
                $("#slider-carousel").owlCarousel({
                    margin: 0,
                    loop: true,
                    nav: true,
                    navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                        '<i class="fa fa-arrow-right icon-white"></i>'],
                    autoplay: true,
                    dots: false,
                    autoplayHoverPause: true,
                    navigation: true,
                    items: 1,
                    animateOut: 'fadeOut'


                });

                var owl = $("#slider-carousel");

                $('.owl-item.active .slider-content').addClass("animated fadeIn");


                owl.on('changed.owl.carousel', function (event) {

                    $('.owl-item:not(.active)').siblings().find(".slider-content").removeClass("animated fadeIn");
                    setTimeout(function () {
                        $('.owl-item.active .slider-content').addClass("animated fadeIn");
                    }, 300);


                    //stop embed videos if they exists
                    if ($("#slider-carousel .owl-item.active .slider-content iframe").length) {
                        var url = $("#slider-carousel .owl-item.active .slider-content iframe").attr("src");
                        $('iframe').attr('src', '');
                        $('iframe').attr('src', url);

                    }

                });


            });
        }
        // News ticker
        if ($('.news-ticker-content').exists()) {
            $('.news-ticker-content').each(function () {
                $('.news-ticker-content').owlCarousel({
                    autoplay: true,
                    autoplayHoverPause: true,
                    dots: false,
                    mouseDrag: true,
                    touchDrag: true,
                    margin: 40,
                    autoWidth: true,
                    autoplayTimeout: "3000",
                    loop: true,
                });

            });
        }

        if ($('.tab-carousel').exists()) {

            if ($('.tab-carousel').parent().hasClass('active')) {
                $('.tab-carousel').owlCarousel({
                    navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                        '<i class="fa fa-arrow-right icon-white"></i>'],
                    margin: 0,
                    nav: true,
                    dots: false,
                    items: 1
                });
            } else {
                $('.tabs-navigation li a').click(function () {
                    $('.tab-carousel').owlCarousel({
                        navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                            '<i class="fa fa-arrow-right icon-white"></i>'],
                        margin: 0,
                        nav: true,
                        dots: false,
                        items: 1
                    });
                });
            }
        }

    };


    //----------------------------------------------------/
    // GO TO TOP
    //----------------------------------------------------/
    INSPIRO.goToTop = function () {

        if ($('.gototop').length > 0) {

            var $goToTop = $('.gototop'),
                scrollOffsetFromTop = 800;

            if ($window.scrollTop() > scrollOffsetFromTop) {
                $goToTop.fadeIn("slow");
            } else {
                $goToTop.fadeOut("slow");
            }

            $goToTop.on("click", function () {
                $('body,html').stop(true).animate({
                    scrollTop: 0
                }, 1500, 'easeInOutExpo');
                return false;
            });
        }

    };

    //----------------------------------------------------/
    // LOGO STATUS
    //----------------------------------------------------/
    INSPIRO.logoStatus = function () {

        if ($header.hasClass('header-navigation-light') && $window.width() < 991) {
            logo.find('img').attr('src', logoImg);
        } else {

            if ($header.hasClass('header-dark')) {

                if (logoDark) {
                    logo.find('img').attr('src', logoDark);
                } else {
                    logo.find('img').attr('src', logoImg);
                }

            } else {
                logo.find('img').attr('src', logoImg);
            }
        }

    };

    //----------------------------------------------------/
    // STICKY HEADER
    //----------------------------------------------------/
    INSPIRO.stickyHeaderStatus = function () {
        var $mobile_width = 768;
        if ($header.hasClass('mobile-sticky')){
            $mobile_width = 0;
        }

        if ($header.exists() && $body.width() > $mobile_width) {
            var headerOffset = $header.offset().top;

            if ($window.scrollTop() > headerOffset) {

                if (!$header.hasClass("header-no-sticky")) {
                    $header.addClass('header-sticky');
                }
                if ($header.hasClass('header-navigation-light')) {
                    logo.find('img').attr('src', logoImg);
                }
            } else {
                $header.removeClass('header-sticky');
            }
        }
    };

    INSPIRO.stickyHeader = function () {
        $window.on('scroll resize', function () {
            window.requestAnimationFrame(function () {
            INSPIRO.stickyHeaderStatus();
            });
        });
        $window.on('resize', function () {
            window.requestAnimationFrame(function () {
                INSPIRO.logoStatus();
            });
        });
    };

    //----------------------------------------------------/
    // TOP BAR
    //----------------------------------------------------/
    INSPIRO.topBar = function () {
        if ($topbar.exists()) {
            $("#topbar .topbar-dropdown .topbar-form").each(function (index, element) {
                if ($window.width() - ($(element).width() + $(element).offset().left) < 0) {
                    $(element).addClass('dropdown-invert');
                }
            });
        }
    };

    //----------------------------------------------------/
    // TOP SEARCH
    //----------------------------------------------------/
    $("#top-search-trigger").on("click", function () {
        $body.toggleClass('top-search-active');
        $topSearch.find('input').focus();
        return false;
    });

    //----------------------------------------------------/
    // MAIN MENU
    //----------------------------------------------------/


    $mainmenuitems.on('touchstart click', function (e) {
        if ($body.is('.device-sm, .device-xs, .device-xxs, .side-panel-static')) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).parent('li').hasClass("resp-active")) {
                var a_link = $(this).attr('href');
                if (a_link == '#') {
                    $(this).parent('li').toggleClass("resp-active", 1000, "easeOutSine")
                } else {
                    location.href = a_link;
                }
            } else {
                $(this).parent('li').siblings().removeClass('resp-active');
                $(this).parent('li').addClass("resp-active", 1000, "easeOutSine");
            }
        }
    });
    $mainsubmenuitems.on('touchstart click', function (e) {
        if ($body.is('.device-sm, .device-xs, .device-xxs, .side-panel-static')) {
        e.stopPropagation();
        e.preventDefault();
            if ($(this).parent('li').hasClass("resp-active")) {
                var a_link = $(this).attr('href');
                if (a_link == '#') {
                    $(this).parent('li').toggleClass("resp-active", 1000, "easeOutSine")
                } else {
                    location.href = a_link;
                }
            } else {
                $(this).parent('li').siblings().removeClass('resp-active');
                $(this).parent('li').toggleClass("resp-active", 1000, "easeOutSine");
            }
        }
    });

    INSPIRO.menuFix = function () {
        if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
            $('ul.main-menu .dropdown:not(.mega-menu-item) ul ul').each(function (index, element) {
                if ($window.width() - ($(element).width() + $(element).offset().left) < 0) {
                    $(element).addClass('menu-invert');
                }
            });
        }
    };


    INSPIRO.mainMenu = function () {


        if ($mainmenu.hasClass("slide-menu")) {
            $(".nav-main-menu-responsive").addClass("slide-menu-version");
            $(".lines-button").on("click", function () {
                $(this).toggleClass("tcon-transform");
                $(".navigation-wrap").toggleClass("navigation-active");
                $mainmenu.toggleClass("items-visible");
            });
        } else {
            $(".lines-button").on("click", function () {
                $(this).toggleClass("tcon-transform");
                $(".navigation-wrap").toggleClass("navigation-active");
            });
        }
        $(".navigation-wrap").removeClass("navbar-collapse collapse main-menu-collapse");
    }

    //----------------------------------------------------/
    // Side panel
    //----------------------------------------------------/

    $(document).on('click','#side-panel li.menu-item-has-children>a',function(event){
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        var ul = $(this).next();
        ul.toggleClass('open');
    });

    INSPIRO.sidePanel = function () {
        if (sidePanel.exists()) {

            if ($body.hasClass("side-panel-static")) {
                $body.addClass("side-push-panel side-panel-left side-panel-active");

            } else {
                $(".side-panel-button button").on("click", function () {
                    if ($body.hasClass("side-panel-active")) {
                        $body.removeClass("side-panel-active");
                    } else {
                        $body.addClass("side-panel-active");
                    }
                    return false;
                });

                $body.removeClass("side-panel-active");
                $body.addClass("side-push-panel side-panel-left");
            }

        } else {
            $body.removeClass("side-push-panel side-panel-left");
        }

        //Side Panel Dark logo version
        if (sidePanel.hasClass('side-panel-dark')) {

            if (sidePanellogoDark) {
                sidePanellogo.find('img').attr('src', sidePanellogoDark);
            } else {
                sidePanellogo.find('img').attr('src', sidePanellogoImg);
            }

        } else {
            sidePanellogo.find('img').attr('src', sidePanellogoImg);
        }

    };

    //----------------------------------------------------/
    // SMOTH SCROLL NAVIGATION
    //----------------------------------------------------/
    INSPIRO.naTo = {
        $allLinks: null,
        $menuLinks: null,
        $sections: jQuery(),
        init: function () {
            var _this = this;
            this.$allLinks = jQuery( 'a.scroll-to, a.nav-to' );
            this.$menuLinks = this.$allLinks.filter( function () {
                var $parent = jQuery( this ).closest( '#menu-primary-navigation' );
                return $parent.length ? true : false;
            } );

            this.$menuLinks.each( function () {
                _this.$sections = _this.$sections.add( jQuery( this.hash ) );
            } );

            this.addEventListeners();
        },
        addEventListeners: function () {
            var _this = this;
            this.$allLinks.on( 'click', function () {
                var $anchor = jQuery( this );

                jQuery( 'html, body' ).stop( true, false ).animate( {
                    scrollTop: jQuery( $anchor.attr( 'href' ) ).offset().top
                }, 1500, 'easeInOutExpo' );
                return false;
            } );

            jQuery( window ).scroll( function () {
                var scrollDistance = jQuery( window ).scrollTop();

                _this.$sections.each( function ( i ) {
                    var $self = jQuery( this );
                    var top = $self.position().top;
                    
                    if ( _this.isScrolledIntoView($self) ) {
                        _this.$menuLinks.removeClass( 'active' );

                        _this.$menuLinks.each( function () {
                            var $link = jQuery( this );
                            if ( this.hash.replace( '#', '' ) === $self.attr( 'id' ) ) {
                                $link.addClass( 'active' );
                            }
                        } );
                    }

                } );
            } ).scroll();
        },
        isScrolledIntoView: function ( $elem ) {
            var docViewTop = $( window ).scrollTop();
            var docViewBottom = docViewTop + $( window ).height();

            var elemTop = $elem.offset().top;
            var elemBottom = elemTop + $elem.height();

            return ( ( elemBottom <= docViewBottom ) && ( elemTop >= docViewTop ) );
        }
    };

    //----------------------------------------------------/
    // FULLSCREEN MENU
    //----------------------------------------------------/

    INSPIRO.fullScreenPanel = function () {
        if (fullScreenPanel.exists()) {
            $("#fullscreen-panel-button").on("click", function () {
                $body.toggleClass('fullscreen-panel-active');
                return false;
            });
        }
    };


    //----------------------------------------------------/
    // TEXT ROTATOR
    //----------------------------------------------------/
    INSPIRO.textRotator = function () {
        if ($textRotator.exists()) {
            $textRotator.each(function () {
                var $elem = $(this),
                    dataTextSeperator = $elem.attr('data-rotate-separator') || ",",
                    dataTextEffect = $elem.attr('data-rotate-effect') || "flipInX",
                    dataTextSpeed = $elem.attr('data-rotate-speed') || 2000;

                $textRotator.Morphext({
                    animation: dataTextEffect,
                    separator: dataTextSeperator,
                    speed: Number(dataTextSpeed)
                });
            });
        }
    };

    //----------------------------------------------------/
    // ACCORDION
    //----------------------------------------------------/
    INSPIRO.accordion = function () {
        var $accs = $(classFinder + accordionItem);

        $accs.length && ($accs.each(function () {
            var $item = $(this);

            $item.hasClass(itemActive) ? $item.addClass(itemActive) : $item.find(classFinder + itemContent).hide();
        }), $(classFinder + itemTitle).on("click", function (e) {

            var $link = $(this),
                $item = $link.parents(classFinder + accordionItem),
                $acc = $item.parents(classFinder + accordionType);

            $item.hasClass(itemActive) ? $acc.hasClass(toogleType) ? ($item.removeClass(itemActive), $link.next(classFinder + itemContent).slideUp("fast")) : ($acc.find(classFinder + accordionItem).removeClass(itemActive), $acc.find(classFinder + itemContent).slideUp("fast")) : ($acc.hasClass(toogleType) || ($acc.find(classFinder + accordionItem).removeClass(itemActive), $acc.find(classFinder + itemContent).slideUp("fast")), $item.addClass(itemActive),
                    $link.next(classFinder + itemContent).slideToggle("fast")
            ),
                e.preventDefault();
            return false;
        }));

        if ($('.carousel').exists()) {
            $('.carousel').imagesLoaded(function () {
                INSPIRO.carouselInspiro();
            });
        }

    };

    /* ---------------------------------------------------------------------------
     * TABS
     * --------------------------------------------------------------------------- */
    INSPIRO.tabs = function () {
        var $tabNavigation = $(".tabs-navigation a");
        if ($tabNavigation.exists()) {
            $tabNavigation.on("click", function (e) {
                $(this).tab("show"), e.preventDefault();
                return false;
            });


        }
    };

    /* ---------------------------------------------------------------------------
     * Animations
     * --------------------------------------------------------------------------- */
    INSPIRO.animations = function () {

        if (dataAnimation.exists() && $body.hasClass('device-lg') || $body.hasClass('device-md')) {
            dataAnimation.each(function () {
                $(this).addClass("animated");
                var $elem = $(this),
                    animationType = $elem.attr("data-animation") || "fadeIn",
                    animationDelay = $elem.attr("data-animation-delay") || 200,
                    animationDirection = ~animationType.indexOf("Out") ? "back" : "forward";


                if (animationDirection == "forward") {
                    $elem.appear(function () {
                        setTimeout(function () {
                            $elem.addClass(animationType + " visible");
                        }, animationDelay);


                    }, {
                        accX: 0,
                        accY: -120
                    }, 'easeInCubic');

                } else {
                    $elem.addClass("visible");
                    $elem.on("click", function () {
                        $elem.addClass(animationType);
                        return false;
                    });
                }


                if ($elem.parents('.demo-play-animations').length) {
                    $elem.on("click", function () {
                        $elem.removeClass(animationType);
                        setTimeout(function () {
                            $elem.addClass(animationType);
                        }, 50);
                        return false;
                    });
                }
            });
        }
    };

    /* ---------------------------------------------------------------------------
     * RESPONSIVE VIDEOS
     * --------------------------------------------------------------------------- */
    INSPIRO.resposniveVideos = function () {
        if ($().fitVids) {
            $("section, .content, .post-content, .ajax-quick-view,#slider:not(.revslider-wrap)").fitVids();
        }
    };


    /* ---------------------------------------------------------------------------
     * COUNTER NUMBERS
     * --------------------------------------------------------------------------- */
    INSPIRO.counters = function () {
        if ($counter.exists()) {
            $counter.each(function () {
                var $elem = $(this);

                if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
                    $elem.appear(function () {
                        $elem.find('span').countTo();
                    });
                } else {
                    var countTo = $elem.find('span').attr('data-to');
                    $elem.find('span').html(countTo);
                }
            });
        }
    };

    /* ---------------------------------------------------------------------------
     * COUNTDOWN TIMER
     * --------------------------------------------------------------------------- */
    INSPIRO.countdownTimer = function () {

        if ($countdownTimer.exists()) {
            setTimeout(function () {
                $('[data-countdown]').each(function () {
                    var $this = $(this),
                        finalDate = $(this).data('countdown'),
                        labels = 'Days,Hours,Minutes,Seconds';
                    labels = $this.data('labels');
                    labels = labels.split(',');

                        $this.countdown(finalDate, function (event) {
                        $this.html(event.strftime('<div class="countdown-container"><div class="countdown-box"><div class="number">%-D</div><span>' + labels[0] + '</span></div>' +
                            '<div class="countdown-box"><div class="number">%H</div><span>' + labels[1] + '</span></div>' +
                            '<div class="countdown-box"><div class="number">%M</div><span>' + labels[2] + '</span></div>' +
                            '<div class="countdown-box"><div class="number">%S</div><span>' + labels[3] + '</span></div></div>'));

                    });
                });
            }, 1000);
        }
    };


    /* ---------------------------------------------------------------------------
     * PROGRESS BARS
     * --------------------------------------------------------------------------- */
    INSPIRO.progressBar = function () {

        if ($progressBar.exists()) {
            $progressBar.each(function (i, elem) {
                var $elem = $(this),
                    percent = $elem.attr('data-percent') || "100",
                    delay = $elem.attr('data-delay') || "100",
                    type = $elem.attr('data-type') || "%";

                if (!$elem.hasClass('progress-animated')) {
                    $elem.css({
                        'width': '0%'
                    });
                }

                var progressBarRun = function () {
                    $elem.animate({
                        'width': percent + '%'
                    }, 'easeInOutCirc').addClass('progress-animated');

                    $elem.delay(delay).append('<span class="progress-type animated fadeIn">' + type + '</span><span class="progress-number animated fadeIn">' + percent + '</span>');
                };

                if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
                    $(elem).appear(function () {
                        setTimeout(function () {
                            progressBarRun();
                        }, delay);
                    });
                } else {
                    progressBarRun();
                }


            });


        }
    };

    /* ---------------------------------------------------------------------------
     * PRI CHARTS
     * --------------------------------------------------------------------------- */
    INSPIRO.pieChart = function () {

        if ($pieChart.exists()) {
            $pieChart.each(function () {

                var $elem = $(this),
                    pieChartSize = $elem.attr('data-size') || "160",
                    pieChartAnimate = $elem.attr('data-animate') || "2000",
                    pieChartWidth = $elem.attr('data-width') || "6",
                    pieChartColor = $elem.attr('data-color') || "#00c0e9",
                    pieChartTrackColor = $elem.attr('data-trackcolor') || "rgba(0,0,0,0.10)";

                $elem.find('span, i').css({
                    'width': pieChartSize + 'px',
                    'height': pieChartSize + 'px',
                    'line-height': pieChartSize + 'px'
                });

                $elem.appear(function () {
                    $elem.easyPieChart({
                        size: Number(pieChartSize),
                        animate: Number(pieChartAnimate),
                        trackColor: pieChartTrackColor,
                        lineWidth: Number(pieChartWidth),
                        barColor: pieChartColor,
                        scaleColor: false,
                        lineCap: 'square',
                        onStep: function (from, to, percent) {
                            $elem.find('span.percent').text(Math.round(percent));
                        }
                    });
                });
            });
        }
    };


    /* ---------------------------------------------------------------------------
     * MASONRY ISOTOPE
     * --------------------------------------------------------------------------- */
    INSPIRO.masonryIsotope = function () {

        var $isotops = $(".isotope");
        $isotops.each(function () {
            var isotopeTime,
                $elem = $(this),
                defaultFilter = $elem.data("isotopeDefaultFilter") || 0,
                id = $elem.attr("id"),
                mode = $elem.attr('data-isotope-mode') || "masonry",
                columns = $elem.attr('data-isotope-col') || "4",
                $elemContainer = $elem,
                itemElement = $elem.attr('data-isotope-item') || ".isotope-item",
                itemElementSpace = $elem.attr('data-isotope-item-space') || 0;


            $elem.isotope({
                filter: defaultFilter,
                itemSelector: itemElement,
                layoutMode: mode,
                transitionDuration: '0.6s',
                resizesContainer: true,
                resizable: true,
                animationOptions: {
                    duration: 400,
                    queue: !1
                }

            });

            function refreshOwlCarousel(){
                var $carousel = $elem.find('.carousel');
                $carousel.each( function () {
                    $(this).trigger('destroy.owl.carousel');
                    $(this).html($(this).find('.owl-stage-outer').html()).removeClass('owl-loaded');
                    $(this).owlCarousel({
                        autoplay: true,
                        autoplayHoverPause: true,
                        dots: false,
                        nav: true,
                        mouseDrag: true,
                        touchDrag: false,
                        items: 1,
                        autoHeight: false,
                        navText: ['<i class="fa fa-arrow-left icon-white"></i>',
                            '<i class="fa fa-arrow-right icon-white"></i>']
                    });
                });

                setTimeout(function () {
                    $elem.isotope("layout");
                }, 100)

            }
            if ($elem.find('.post-slider').length){
                $elem.one( 'layoutComplete', refreshOwlCarousel);
            }


                $window.resize(function () {

                    $elemContainer.css('margin-right', '-' + itemElementSpace + '%');

                    if ($body.hasClass('device-md')) {
                        itemWidth(3, $elemContainer, itemElement, itemElementSpace);
                    } else if ($body.hasClass('device-sm') || $body.hasClass('device-xs')) {
                        itemWidth(2, $elemContainer, itemElement, itemElementSpace);
                    } else if ($body.hasClass('device-xxs')) {
                        itemWidth(1, $elemContainer, itemElement, itemElementSpace);
                    } else {
                        itemWidth(columns, $elemContainer, itemElement, itemElementSpace);
                    }

                    if (columns == 1 && $body.hasClass('device-sm') || columns == 1 && $body.hasClass('device-xs')) {
                        itemWidth(1, $elemContainer, itemElement, itemElementSpace);
                    }

                    clearTimeout(isotopeTime), isotopeTime = setTimeout(function () {
                        $elem.isotope("layout");
                    }, 300);
                });


            var $menu = $('[data-isotope-nav="' + id + '"]');

            // store filter for each group
            var filters = {};
            // flatten object by concatting values

            $menu.length && $menu.find("li:not('.link-only')").on("click", function (e) {
                var $link = $(this);

                $(".filter-active-title").empty().append($link.text());

                var $buttonGroup = $link.parents('.button-group');
                var filterGroup = $buttonGroup.attr('data-filter-group');
                // set filter for group
                filters[ filterGroup ] = $link.attr('data-filter');
                // combine filters
                var filterValue = concatValues( filters );

                if (!$link.hasClass("ptf-active")) {
                    $link.parents(".portfolio-filter").eq(0).find(".ptf-active").removeClass("ptf-active"), $link.addClass("ptf-active"), $elem.isotope({
                        filter: filterValue
                    });
                }

                e.preventDefault();
                return false;
            }), $window.resize();

            function concatValues( obj ) {
                var value = '';
                for ( var prop in obj ) {
                    value += obj[ prop ];
                }
                return value;
            }

        });

    };

    // Intellegent Grid
    var itemWidth = function (columns, $elemContainer, itemElement, itemElementSpace) {

        var $findElement = $elemContainer.find(itemElement);
        var $findElementLarge = $elemContainer.find(".large-item");

        var itemElementMargins = {
            "margin-right": itemElementSpace + "%",
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


    /* ---------------------------------------------------------------------------
     * TOOLTIPS
     * --------------------------------------------------------------------------- */
    INSPIRO.tooltip = function () {
        var $tooltip = $('[data-toggle="tooltip"]');
        if ($tooltip.exists()) {
            $('[data-toggle="tooltip"]').tooltip();
        }

    };

    /* ---------------------------------------------------------------------------
     * POPOVER
     * --------------------------------------------------------------------------- */
    INSPIRO.popover = function () {
        var $popover = $('[data-toggle="popover"]');
        if ($popover.exists()) {
            $('[data-toggle="popover"]').popover({
                container: 'body',
                html: true
            });
        }
    };

    /* ---------------------------------------------------------------------------
     * LIGHTBOX
     * --------------------------------------------------------------------------- */
    INSPIRO.lightBoxInspiro = function () {

        if ($lightbox_image.exists()) {
            $lightbox_image.magnificPopup({
                type: 'image',
                removalDelay: 500, //delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function () {
                        // just a hack that adds mfp-anim class to markup
                        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                        this.st.mainClass = 'mfp-zoom-in';
                    }
                },
                closeOnContentClick: true,
                midClick: true
            });
        }

        if ($lightbox_gallery.exists()) {
            $lightbox_gallery.each(function () {
                $(this).magnificPopup({
                    delegate: 'a[data-lightbox="gallery-item"]',
                    type: 'image',
                    gallery: {
                        enabled: true
                    },
                    removalDelay: 500, //delay removal by X to allow out-animation
                    callbacks: {
                        beforeOpen: function () {
                            // just a hack that adds mfp-anim class to markup
                            this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                            this.st.mainClass = 'mfp-zoom-in';
                        }
                    },
                    closeOnContentClick: true,
                    midClick: true
                });
            });
        }

        if ($lightbox_iframe.exists()) {
            $lightbox_iframe.each(function () {
                $(this).magnificPopup({
                    type: 'iframe'
                });
            });
        }

        if ($lightbox_ajax.exists()) {
            $lightbox_ajax.each(function () {
                $(this).magnificPopup({
                    type: 'ajax',
                    callbacks: {
                        ajaxContentAdded: function (mfpResponse) {
                            INSPIRO.carouselInspiro();
                            INSPIRO.resposniveVideos();
                            INSPIRO.accordion();
                        }
                    }
                });
            });
        }
    };


    /* ---------------------------------------------------------------------------
     * Push footer to bottom
     * --------------------------------------------------------------------------- */
    INSPIRO.bottom_footer = function () {
        var docHeight = $(window).height();
        var footer = $('#footer');
        if (footer.length > 0) {
            var footerHeight = footer.height();
            var footerTop = footer.position().top + footerHeight;

            if (footerTop < docHeight) {
                footer.css('margin-top', docHeight - footerTop);
            }
        }
    };

    /* ---------------------------------------------------------------------------
     * Unstyled list with icons
     * --------------------------------------------------------------------------- */
    INSPIRO.styled_lists = function () {
        $(".styled-list").each(function () {
            var $this = $(this);
            var $icon  = $(this).data('icon');
            if ($icon.length){
                $this.find('li').wrapInner('<div class="ovh"></div>');
                $this.find('li').prepend('<i class="'+$icon+'"></i>');
            }
        });
    };
    /* ---------------------------------------------------------------------------
     * FLICKR WIDGET
     * --------------------------------------------------------------------------- */
    INSPIRO.flickr_widget = function () {

        if ($flickr_widget.exists()) {
            $flickr_widget.each(function () {

                var $elem = $(this),
                    $flickrId = $elem.attr('data-flickr-id') || "52617155@N08",
                    $flickrImages = $elem.attr('data-flickr-images') || "9";

                $flickr_widget.jflickrfeed({
                    limit: $flickrImages,
                    qstrings: {
                        id: $flickrId
                    },
                    itemTemplate: '<a href="{{image}}" title="{{title}}"><img src="{{image_s}}" alt="{{title}}" /></a>'
                }, function () {
                    $elem.magnificPopup({
                        delegate: 'a',
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    });
                });
            });
        }
    };


    //----------------------------------------------------/
    // Mouse Scroll
    //----------------------------------------------------/
    INSPIRO.mouseScroll = function () {

        if ($body.hasClass('mouse-scroll') && $window.width() > 767) {

            var $offset = 0;

            if ($header.hasClass('header-transparent')) {
                $offset = -$header.height() - 20;
            }

            $.scrollify({
                section: "section",
                sectionName: "section-name",
                scrollSpeed: 1100,
                offset: $offset,
                scrollbars: true,
            });
        }
    };

    //----------------------------------------------------/
    // FIT text large
    //----------------------------------------------------/
    INSPIRO.fitText = function () {

        jQuery(".custom-heading h2").fitText(1.1, { minFontSize: '20px', maxFontSize: '40px' });
    };


    //Window load functions
    $window.load(function () {
        INSPIRO.progressBar();
        INSPIRO.pieChart();
        INSPIRO.carouselInspiro();
        INSPIRO.masonryIsotope();
        INSPIRO.animations();
        INSPIRO.menuFix();
        INSPIRO.bottom_footer();
    });


    //Document ready functions
    $document.ready(
        INSPIRO.loader(),
        INSPIRO.fitText(),
        INSPIRO.responsiveClasses(),
        INSPIRO.mainMenu(),
        INSPIRO.stickyHeader(),
        INSPIRO.logoStatus(),
        INSPIRO.mouseScroll(),
        INSPIRO.screenSizeControl(),
        INSPIRO.naTo.init(),
        INSPIRO.sidePanel(),
        INSPIRO.fullScreenPanel(),
        INSPIRO.textRotator(),
        INSPIRO.accordion(),
        INSPIRO.tabs(),
        INSPIRO.counters(),
        INSPIRO.countdownTimer(),
        INSPIRO.lightBoxInspiro(),
        INSPIRO.resposniveVideos(),
        INSPIRO.tooltip(),
        INSPIRO.popover(),
        INSPIRO.flickr_widget(),
        INSPIRO.goToTop(),
        INSPIRO.topBar(),
        INSPIRO.bottom_footer(),
        INSPIRO.styled_lists()
    );

    //Document resize functions
    $window.resize(function () {
        INSPIRO.logoStatus();
        INSPIRO.screenSizeControl();
        INSPIRO.menuFix();
        INSPIRO.bottom_footer();
    });

    //Document scrool functions
    $window.scroll(function () {

        INSPIRO.goToTop();

    });

    /*
    * Document ajax add item
    * */
    $body.on('container-add-item',function(){
        INSPIRO.carouselInspiro();
    });


})(jQuery);

//----------------------------------------------------/
// SMOTH SCROLL NAVIGATION
//----------------------------------------------------/
setTimeout(function () {
    ;
    (function (window, document, undefined) {

        'use strict';

        // Cut the mustard
        var supports = 'querySelector' in document && 'addEventListener' in window;
        if (!supports) return;

        // Get all anchors
        var anchors = document.querySelectorAll('a[href*="#"]:not([data-vc-tabs])');

        // Add smooth scroll to all anchors
        for (var i = 0, len = anchors.length; i < len; i++) {
            var url = new RegExp(window.location.hostname + window.location.pathname);
            var index = anchors[i].href.lastIndexOf('/');
            var slug = anchors[i].href.substr(index);
            if (!url.test(anchors[i].href)) continue;
            if (slug != '/#'){
                anchors[i].setAttribute('data-scroll', true);
            }
        }

        smoothScroll.init({
            selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
            speed: 600, // Integer. How fast to complete the scroll in milliseconds
            easing: 'easeOutQuad', // Easing pattern to use
            offset: 80,
            updateURL: false, // Boolean. If true, update the URL hash on scroll
            callback: function (anchor, toggle) {
            } // Function to run after scrolling
        });

    })(window, document);
}, 200);

setTimeout(function () {
    if ( window.location.hash ) {
        var hash = smoothScroll.escapeCharacters( window.location.hash ); // Escape the hash
        var toggle = document.querySelector( 'a[href*="' + hash + '"]' ); // Get the toggle (if one exists)
        var options = {}; // Any custom options you want to use would go here
        smoothScroll.animateScroll( hash, toggle, options );
    }
}, 300);