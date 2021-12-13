/**
 * Created by brittanydemers on 10/12/17.
 */


var searchRad = 40; // 322 = 200 mi.radius
var sites = [];

var init = function() {
    initializeMap();
};

jQuery(function($) {
    $.ajax({
        type: "GET",
        url: "//app.sharpspring.com/publicjson/getpartners",
        contentType: "application/json",
        dataType: "jsonp",
        async: false,
        success: function(resp) {
            sites = resp;
        },
        error: function(xhr, status, error) {
            console.warn(error, status);
        }
    }).done(init);

    $('body').on('click', '.desc-trigger', function(){
        $(this).next('.agency-description').toggleClass('open');
        $(this).text(function(i, text){
            return text === "See more..." ? "See less..." : "See more...";
        });
    })
});

function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

var sortAgencies = function(a, b) {
    if (b[3] != a[3]) {
        return (b[3] - a[3]);
    }

    return (a[9] + '').localeCompare(b[9]);
};

var sortNearAgencies = function(a, b){
		return a.distance - b.distance;
};

 function calculateDistance(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = Math.PI * lat1/180
		var radlat2 = Math.PI * lat2/180
		var radlon1 = Math.PI * lon1/180
		var radlon2 = Math.PI * lon2/180
		var theta = lon1-lon2
		var radtheta = Math.PI * theta/180
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist)
		dist = dist * 180/Math.PI
		dist = dist * 60 * 1.1515
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist
}

function nearbyPartners(sites, result) {
    resultLat		= result.lat();
    resultLong	= result.lng();
    centerPoint = { lat:resultLat, lng:resultLong };
    matches			= [];
    nearSites		= [];
		
    sites.sort(sortAgencies);
    for (var i = 0; i < sites.length; i++) {
        siteCert	= sites[i][3];
        siteLat		= sites[i][1];
        siteLong	= sites[i][2];
        sitePoint = { lat:siteLat, lng:siteLong };
        if (arePointsNear(sitePoint, centerPoint, searchRad)) { //default 200mi radius - changed to 25mi radius
						nearSites.push(sites[i]);
        }				
    }
		
		for ( i = 0; i < nearSites.length; i++) {
				nearSites[i]["distance"] = calculateDistance(centerPoint.lat, centerPoint.lng, nearSites[i][1], nearSites[i][2], "K");
		}

		var nearSitesPlatinumCert	= [];
		var nearSitesGoldCert			= [];
		var nearSitesSilverCert		= [];
		var nearSitesNotCert			= [];
		for ( i = 0; i < nearSites.length; i++) {		
				if(nearSites[i][3] == 3) {
						nearSitesPlatinumCert.push(nearSites[i]);
				} else if(nearSites[i][3] == 2) {
						nearSitesGoldCert.push(nearSites[i]);
				} else if(nearSites[i][3] == 1) {
						nearSitesSilverCert.push(nearSites[i]);
				} else {
						nearSitesNotCert.push(nearSites[i]);
				}
		}
		
		nearSitesGoldCert.sort(sortNearAgencies);
		nearSitesSilverCert.sort(sortNearAgencies);
		nearSitesNotCert.sort(sortNearAgencies);

		nearSites = nearSitesPlatinumCert.concat(nearSitesGoldCert).concat(nearSitesSilverCert).concat(nearSitesNotCert);

		for (var i = 0; i < nearSites.length; i++) {
				var siteDescription = nearSites[i][6] ? '<p>' + nearSites[i][6] + '</p>' : '';
				var siteIsB2B				= nearSites[i][7] ? '<span class="workType">B2B</span>' : '';
				var siteIsB2C				= nearSites[i][8] ? '<span class="workType">B2C</span>' : '';
				var agencyModal			= nearSites[i][6] ? '<a class="desc-trigger">See more...</a><div class="agency-description">' + siteDescription + '</div>' : '<a>&nbsp;</a>';
				var htmlPayload			= nearSites[i][4] + siteIsB2B + siteIsB2C + agencyModal;
				matches.push(htmlPayload);
		}
		
    return matches;
}

var initializeMap = function() {
    var infowindow				= null;
    var geocoder					= new google.maps.Geocoder();
    var searchResults			= jQuery('#partnersearchResults');
    var searchResultsWrap = jQuery('.partner-search-results');

		var input					= document.getElementById('partner-search');
		var autocomplete	= new google.maps.places.Autocomplete(input);				
		
    function codeAddress() {
        var address = document.getElementById('partner-search').value;
        geocoder.geocode( { 'address': address}, function(results, status) {


            if (status == google.maps.GeocoderStatus.OK) {
                latLng = results[0].geometry.location;
                matches = nearbyPartners(sites, results[0].geometry.location);

                searchResultsWrap.addClass('active');
                searchResults.html(matches);

                map.setCenter(results[0].geometry.location);
                map.setZoom(9);

            } else {
                searchResultsWrap.addClass('active');
                searchResults.html('<small>No matches found</small>');
            }
        });
    }

    function setMarkers(map, markers) {
        for (var i = 0; i < markers.length; i++) {
            var sites = markers[i];
            var siteLatLng = new google.maps.LatLng(sites[1], sites[2]);
            var marker = new google.maps.Marker({
                icon:     '/wp-content/themes/polo-child/img/marker-certified.svg',
                position: siteLatLng,
                map:      map,
                title:    'sites[0]', //changed to string to remove error in console
                zIndex:   sites[3],
                html:     sites[4],
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, "click", function() {
                infowindow.setContent(this.html);
                infowindow.open(map, this); });
        }
    }
		
		function fixAutocomplete(map, markers) {
				//Set new top to autocomplete dropdown - fix top position
				if($('.pac-container').length > 0) {
						if($('.smartbar-popup').length > 0) {		
								$('.pac-container').css('margin-top', '-' + $('.smartbar-popup .sumome-smartbar-popup').height() + 'px');
						} else {
								$('.pac-container').css('margin-top', '0px');
						}
				}
		}

    var myLatlng = new google.maps.LatLng(34.741612, -40.957031);

    var myOptions = {
        zoom:        2,
        scrollwheel: false,
        center:      myLatlng,
        mapTypeId:   google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    infowindow = new google.maps.InfoWindow();
    setMarkers(map, sites);

    jQuery('#partner-search').keyup(function() {
        delay(function(){
            codeAddress();
						fixAutocomplete();
        }, 500 );				
    });
		
		jQuery('#partner-search').focus(function() {
				fixAutocomplete();		
    });

    jQuery('body').on('change', '#searchRadius', function(){
        searchRad = jQuery(this).val();
        codeAddress();
    });
};

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
