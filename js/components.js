var locale; 

if((location.pathname.match("\/[a-z]{2}-[a-z]{4}/") != null)&&(location.pathname.match("\/[a-z]{2}-[a-z]{2}/")==null)){
    locale=location.pathname.match("\/[a-z]{2}-[a-z]{4}/")[0].substring(1,8);
}else if((location.pathname.match("\/[a-z]{2}-[a-z]{4}/") == null)&&(location.pathname.match("\/[a-z]{2}-[a-z]{2}/")!=null)){
    locale=location.pathname.match("\/[a-z]{2}-[a-z]{2}/")[0].substring(1,6);
}
locale = locale == "zh-hans" ? "zh-cn": locale;
locale = locale == "zh-hant" ? "zh-tw": locale;
//mapping
var sMarketplaceItemTypes = {
    all: { xforge_key: 'all', text: 'Most Popular' },
    resourcepack: { xforge_key: 'resourcepack', text: 'Texture Packs' },
    mashup: { xforge_key: 'mashup', text: 'Mash-ups' },
    skinpack: { xforge_key: 'skinpack', text: 'Skin Packs' },
    mini_game_world: { xforge_key: 'mini_game_world', text: 'Mini Games' },
    adventure_world: { xforge_key: 'adventure_world', text: 'Adventure Maps' },
    survival_spawn_world: { xforge_key: 'survival_spawn_world', text: 'Survival Spawns' },
    bundle: { xforge_key: 'bundle', text: 'Bundles' }
};
var sMarketplaceItemTypesNames = {
    "Most Popular": { xforge_key: 'all', text: 'Most Popular' },
    "Texture Packs": { xforge_key: 'resourcepack', text: 'Texture Packs' },
    "Mash-ups": { xforge_key: 'mashup', text: 'Mash-ups' },
    "Skin Packs": { xforge_key: 'skinpack', text: 'Skin Packs' },
    "Mini Games": { xforge_key: 'mini_game_world', text: 'Mini Games' },
    "Adventure Maps": { xforge_key: 'adventure_world', text: 'Adventure Maps' },
    "Survival Spawns": { xforge_key: 'survival_spawn_world', text: 'Survival Spawns' },
    "Bundles": { xforge_key: 'bundle', text: 'Bundles' }
};
var CategoryMapping = {                
                "skinpack": "Most Popular Minecraft Skins",
                "resourcepack": "Most Popular Minecraft Resources",
                "mashup":  "Most Popular Minecraft Mash-ups",
                "adventure_world":  "Most Popular Adventure",
                "mini_game_world": "Most Popular Minigames",
                "survival_spawn_world": "Most Popular Survival Spawn",
            };
//content types availaable
var productCategories = ["all", "skinpack", "resourcepack", "mashup", "mini_game_world", "adventure_world", "survival_spawn_world","bundle"];
var productCategoriesNames = ["Skin Packs", "Texture Packs", "Mash-ups", "Mini Games", "Adventure Maps", "Survival Spawns","Bundles"];
var productCategoriesSet1 = ["skinpack"];
var productCategoriesSet2 = ["resourcepack", "mashup", "mini_game_world", "adventure_world", "survival_spawn_world"];
var checkfordisprice = "true";
var showPrice = "true";
// Set target for all anchors on page
var anchorTarget = function () {
    var host = location.host;
    var path = location.pathname.split('/');
    var shortpathname = host + '/' + path[1] + '/' + path[2];
    var anchors = $('.body-content').find('a:not(.getInTouch)');                        //select all anchors in section
    anchors.each(function () {
        var href = $(this).attr("href");
        if (href != undefined && href != "#" && href != "" && href.indexOf(shortpathname) == -1 && href.indexOf('javascript:') != 0 && href.indexOf('/') != 0 && href.indexOf("minecraft.net") < 0 && href.startsWith("http")) {
            $(this).prop("target", "_blank");                                     //if external link open in new tab
        }        
    });
}




//image resize for IE11
var imageResize = function () {
    try {
        $("picture").each(function () {
            $(this).find("source").each(function () {
                var thisMedia = $(this).attr("media");
                if (window.matchMedia(thisMedia).matches) {
                    var src = $(this).attr("srcset");
                    $(this).siblings("img").attr("src", src);
                    return false;
                }
            })
        })
    }
    catch (exception) {
        console.log(exception);
    }
}

//Convert string to title case - Every word's first letter to Caps
function toTitleCase(str) {
    if(locale=="en-us")
    	return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    else
        return str;
}
//Fetch unique values in array of array
function getUniqueValuesInArray(results) {
    //remove elements of array if length==0
    results = results.filter(function (e) {
        return e.length > 0
    });
    if (results.length == 1)
        return results[0];
    else if (results.length == 0)
        return [];
    //If not above are not matched, execute below
    return results.reduce(function (a, b) {
        return a.concat(b);
    }, []).filter(function (elem, index, self) { // remove any duplicates from final list
        return index !== self.indexOf(elem);
    });
}

//fallback for startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

function isElementInViewport(el) {

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	var rect = el.getBoundingClientRect();

	return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}


$('document').ready(function () {
    //if (navigator.appVersion.indexOf('iPad') >= 0 && navigator.appVersion.indexOf('10_3_3') >= 0)
    //    $(".contetnwithimage .card-deck .card").css("height", "420px");
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) {
        $('body').addClass("IE11");
    }

    anchorTarget();

    //search box higlight text
     $('#search-box').on('input', function () { 
         var current = $(this);         
        if(current.val().length > 0) {                        
                var term = toTitleCase(current.val());
            setTimeout(function(){
            $(".searchresults li a").each(function() {
                if ($(this).text().indexOf(term) == 0)
                    $(this).html($(this).text().replace(term, "<span class=\"highlight\">" +term + "</span>"));
                }); 
                 }, 1000);
            }    

     });


});


$(window).on('load resize', function () {
    setTimeout(function () {
        $("slick .slick-arrow").attr("tabindex", "0");
        // key board clcik for slick arrows
        $("slick .slick-arrow").on('keydown', function () {
            if (event.keyCode == 13) {
                $(this).trigger('click');
            };
        });
    }, 500);

    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) 
        imageResize();
    setTimeout(function () {
    $('#AbsoluteImage img').each(function () {
        var image_hei = $(this).innerHeight();
        $(this).css('margin-top', -(image_hei / 2));
    });
    }, 100);
    //fix for ipad - contentplacement
 if (navigator.appVersion.indexOf('iPad') >= 0 && navigator.appVersion.indexOf('10_3_3') >= 0)
        $(".contetnwithimage .card-deck .card").css("height", "420px");
    $(".card-deck").find('.card .card-body').css('min-height', 0)
    $('.card-deck').each(function () {
        var max = 0;
        $(this).find('.card').each(function () {
            var cd = $(this).find('.card-body').outerHeight();
            if (cd > max) {
                max = cd;
            }
        });
        $(this).find('.card .card-body').css('min-height', max);
    });

});




//youtube
var player;
var player_init = 0;
function getYoutubeID(url) {
    var start=url.lastIndexOf("v=") + 2;
    var end = url.lastIndexOf("&");
    if (end >= 0)
        return url.substring(start, end);
    else
        return url.substring(start, url.length);   
}
function onYouTubeIframeAPIReady() {
    if($("#play-video-marketplace").length){
		player_init = 1;
    player = new YT.Player('product-video', {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1,
            rel: 0
        },
        videoId: getYoutubeID($("#play-video").attr("data-videoSource")),
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
    }
}

// when video ends
function onPlayerStateChange(event) {
    if (event.data === 0) {
        $("#product-video").hide();
    }
}

$('document').ready(function () {
    $(".product-hero").on("click","#play-video",function (e) {
        var ytUrrl = $("#play-video").attr("data-videoSource");
        window.open(ytUrrl, '_blank')
        e.preventDefault();
        if (player_init == 0) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        else {
            $("#product-video").show();
        }
    });
});


var app = angular.module('MostPopular',  ["ngSanitize"]);
app.run(['$rootScope', '$http', '$timeout', '$window', function ($rootScope, $http, $timeout, $window) {

    $http.get("/bin/minecraft/productmanagement.mostpopproducts.json?locale="+locale).then(function (response) {
        $rootScope.mostPopular = response.data;
    });

    if (checkfordisprice === "true") {
        $http.get("/bin/minecraft/productmanagement.promotiondetails.json?locale="+locale).then(function (response) {
            $rootScope.promotionData = response.status === 200 ? response.data.results : [];
            if (response.data.results.length) {
                var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                var currentOffer = response.data.results.filter(function (e) {
                    return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                         new Date(e.displayProperties.endDate) >= new Date(currentDate);
                }).sort(function (a, b) {
                    return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                });
                
            }
        });
    }
}]);

//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0 ; i < images.length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                    (
                        (top <= bottomFoldOffset) &&
                        (top >= topFoldOffset)
                    )
                ||
                    (
                        (bottom <= bottomFoldOffset) &&
                        (bottom >= topFoldOffset)
                    )
                ||
                    (
                        (top <= topFoldOffset) &&
                        (bottom >= bottomFoldOffset)
                    )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);
app.controller('MostPopular', ['$scope', '$rootScope','$window' , '$sce',function ($scope, $rootScope,$window, $sce) {
	$scope.showPrice =showPrice;   
    $scope.locale = locale;
    //Get the discounted price if available
    $scope.getDiscountedPrice = function (item, spantext) {
        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.Id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.Tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.DisplayProperties.bundleMSRP == null) {
                        var UUIDList = item.displayProperties.packIdentity != null ? item.displayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }
                    else {
                        return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === true) return Math.round(disc);
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].displayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.displayProperties.price;
                    }    

                    return disc > 0 && disc % 1 != 0 ? "<s>" + item.displayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.displayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === true) return Math.round(disc);
                return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.price + "</s> " + disc;
            }
            else {
                return item.DisplayProperties.price;
            }
        }
        else {
            if (item.Tags.indexOf("bundle") >= 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            }
            return item.DisplayProperties.price;
        }
    }


    //Get the width of rating
    $scope.getWidth = function (catalog) {
        var width = (catalog.AverageRating / 5) * 100;
        return { width: width + "%" };
    }

}]);
var productType = '';
var catalogVersion = 'MarketplaceDurableCatalog_V1.2';
var bundleCatalogVersion = 'BundleOffer_V1.0';
var jsonSearchResults =  {results:[]};
var jsonDataByCategory = [];
var jsonDataByCategoryResults = [];
var Searchpanelwidth = "100px";
var Navwidth = "200px";
var defaultnav = "all";
var LimitForNextSet = 16;

var app = angular.module('MarketPlace', ['ngSanitize']);
app.directive('ngEnter', function ($timeout) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                $timeout(function() {
                scope.$apply(function () {                    
                    scope.$eval(attrs.ngEnter);

                });
                    }, 0);
                event.preventDefault();
            }
        });
    };
});

app.directive('ratingWidth', function () {
    return {
        link: function (scope, element, attrs) {
            var width = (attrs.ratingWidth / 5) * 100;            		
            attrs.$set('style', 'width:' + width +'%');
        }
    }
});
app.directive('priceDirective', function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            var item=JSON.parse(attrs.priceCatalog);
			var spantext=attrs.priceSpantext;
            var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.id) > -1
                    && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.Tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.DisplayProperties.bundleMSRP == null) {
                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        if (spantext === "true") {
                        	attrs.$set('data-price', item.DisplayProperties.price);                        
                    	}
                        else
                            element[0].innerHTML =  "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }
                    else {
                        if (spantext === "true") {
                        	attrs.$set('data-price', item.DisplayProperties.price);                        
                    	}
                        else
                            element[0].innerHTML =  "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === "true") {
                        attrs.$set('data-price', Math.round(disc));                        
                    }
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        element[0].innerHTML =  "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }

                    element[0].innerHTML =  disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === "true"){
                    attrs.$set('data-price', Math.round(disc));                   
                }
                else{
                	element[0].innerHTML =  disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.price + "</s> " + disc;
                }}

            else {
                if (spantext === "true")
                    attrs.$set('data-price', Math.round(disc));                                   
                else
                	element[0].innerHTML =  item.DisplayProperties.price;
            }
        }
        else {
            if (item.Tags.indexOf("bundle") >= 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    element[0].innerHTML =  "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    element[0].innerHTML =  "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            }
           else if (spantext === "true")
                    attrs.$set('data-price', Math.round(disc));                                   
            else
              element[0].innerHTML =  item.DisplayProperties.price;
        }
        }
    }
});
app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });


            attrs.$observe('ngSrc', function (value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });

            attrs.$observe('ngSrc', function (value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

app.directive('ngHideDropdown', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 27) {
                event.preventDefault();
                scope.callSearchResultsList = [];
                scope.$apply(scope.callSearchResultsList);
            }
        });
    };
});
app.filter('getCategoryItems', function () {
    return function (items, category, type) {
        var version = type === "bundle" ? bundleCatalogVersion : catalogVersion;
        if (category.toLowerCase() === "Newly Added".toLowerCase() && type.length > 0 && type !== "all" ) {
           
        }

        var topFour = [];
        jsonDataByCategoryResults.filter(function (e) {
            return e.category === category
           //return category.indexOf(e.category ) !== -1
        }).sort(function (a, b) {
            return a.rank - b.rank
        }).forEach(function (e) {
            topFour = topFour.concat(items.filter(function (elem) {               
                     return elem.Id === e.productid && elem.ContentType === version;
            }))
        });

        if (topFour.length < 4) {
            return topFour.concat(jsonSearchResults.results.filter(function (e) {
                return topFour.map(function (elem) { return elem.Id }).indexOf(e.Id) === -1
            }).sort(function (a, b) {
                return new Date(b.CreationDate) - new Date(a.CreationDate)
            }).slice(0, 24 - topFour.length));
        }
        else
            return topFour;
    };
});
app.filter('RemoveCharecters', function () {
    return function (title) {
        return title.replace(/[`~!@#$%^&*–()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/  +/g, ' ').replace(/ /g, "-").toLowerCase();
    };
});
app.factory('LoadMoreService', function () {
    var factory = {};
    factory.loadMore = function (data, classname, loadedCount, limit) {
        return data.slice(loadedCount, loadedCount + limit);
    }
    return factory;
});
app.directive('slick', ['$timeout', function ($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            initOnload: '@',
            data: '=',
            currentIndex: '=',
            accessibility: '@',
            adaptiveHeight: '@',
            arrows: '@',
            asNavFor: '@',
            appendArrows: '@',
            appendDots: '@',
            autoplay: '@',
            autoplaySpeed: '@',
            centerMode: '@',
            centerPadding: '@',
            cssEase: '@',
            customPaging: '&',
            dots: '@',
            draggable: '@',
            easing: '@',
            fade: '@',
            focusOnSelect: '@',
            infinite: '@',
            initialSlide: '@',
            lazyLoad: '@',
            onBeforeChange: '&',
            onAfterChange: '&',
            onInit: '&',
            onReInit: '&',
            onSetPosition: '&',
            pauseOnHover: '@',
            pauseOnDotsHover: '@',
            responsive: '=',
            rtl: '@',
            slide: '@',
            slidesToShow: '@',
            slidesToScroll: '@',
            speed: '@',
            swipe: '@',
            swipeToSlide: '@',
            touchMove: '@',
            touchThreshold: '@',
            useCSS: '@',
            variableWidth: '@',
            vertical: '@',
            prevArrow: '@',
            nextArrow: '@'
        },
        link: function (scope, element, attrs) {
            var destroySlick, initializeSlick, isInitialized;
            destroySlick = function () {
                return $timeout(function () {
                    var slider;
                    slider = $(element);
                    slider.slick('unslick');
                    slider.find('.slick-list').remove();
                    return slider;
                });
            };
            initializeSlick = function () {
                return $timeout(function () {
                    var currentIndex, customPaging, slider;
                    slider = $(element);
                    if (scope.currentIndex != null) {
                        currentIndex = scope.currentIndex;
                    }
                    customPaging = function (slick, index) {
                        return scope.customPaging({
                            slick: slick,
                            index: index
                        });
                    };
                    slider.slick({
                        accessibility: scope.accessibility !== 'false',
                        adaptiveHeight: scope.adaptiveHeight === 'true',
                        arrows: scope.arrows !== 'false',
                        asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
                        appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
                        appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
                        autoplay: scope.autoplay === 'true',
                        autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                        centerMode: scope.centerMode === 'true',
                        centerPadding: scope.centerPadding || '50px',
                        cssEase: scope.cssEase || 'ease',
                        customPaging: attrs.customPaging ? customPaging : void 0,
                        dots: scope.dots === 'true',
                        draggable: scope.draggable !== 'false',
                        easing: scope.easing || 'linear',
                        fade: scope.fade === 'true',
                        focusOnSelect: scope.focusOnSelect === 'true',
                        infinite: scope.infinite !== 'false',
                        initialSlide: scope.initialSlide || 0,
                        lazyLoad: scope.lazyLoad || 'ondemand',
                        beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
                        onReInit: attrs.onReInit ? scope.onReInit : void 0,
                        onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
                        pauseOnHover: scope.pauseOnHover !== 'false',
                        responsive: scope.responsive || void 0,
                        rtl: scope.rtl === 'true',
                        slide: scope.slide || 'div',
                        slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                        slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                        speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                        swipe: scope.swipe !== 'false',
                        swipeToSlide: scope.swipeToSlide === 'true',
                        touchMove: scope.touchMove !== 'false',
                        touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                        useCSS: scope.useCSS !== 'false',
                        variableWidth: scope.variableWidth === 'true',
                        vertical: scope.vertical === 'true',
                        prevArrow: '<a  tabindex="0" class="slick-prev slick-arrow btn hovereffect btn-primary btn-primary--carousel btn-primary--grow" aria-label="Previous" role="button"><span class="grow"></span><svg role="img" title="left" class="svg-icon" focusable="false"><use xlink:href="#pixel-arrow-left"></use><svg viewBox="0 0 512 512" class="pixel-arrow-left" width="100%" height="100%" focusable="false"><path d="M96 288v64h64v64h64v64h64V288h192v-64H288V32h-64v64h-64v64H96v64H32v64h64z"></path></svg></svg></a>',
                        nextArrow: '<a  tabindex="0" class="slick-next slick-arrow btn hovereffect btn-primary btn-primary--carousel btn-primary--grow" aria-label="next" role="button"><span class="grow"></span><svg role="img" title="right" class="svg-icon" focusable="false"><use xlink:href="#pixel-arrow-right"></use><svg viewBox="0 0 512 512" class="pixel-arrow-right" width="100%" height="100%" focusable="false"><path d="M416 224v-64h-64V96h-64V32h-64v192H32v64h192v192h64v-64h64v-64h64v-64h64v-64h-64z"></path></svg></svg></a>'
                    });
                    slider.on('init', function (sl) {
                        if (attrs.onInit) {
                            scope.onInit();
                        }
                        if (currentIndex != null) {
                            return sl.slideHandler(currentIndex);
                        }
                    });
                    slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                        if (scope.onAfterChange) {
                            scope.onAfterChange();
                        }
                        if (currentIndex != null) {
                            return scope.$apply(function () {
                                currentIndex = currentSlide;
                                return scope.currentIndex = currentSlide;
                            });
                        }
                    });
                    return scope.$watch('currentIndex', function (newVal, oldVal) {
                        if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                            return slider.slick('slickGoTo', newVal);
                        }
                    });
                });
            };
            if (scope.initOnload) {
                isInitialized = false;
                return scope.$watch('data', function (newVal, oldVal) {
                    if (newVal != null) {
                        if (isInitialized) {
                            destroySlick();
                        }
                        initializeSlick();
                        return isInitialized = true;
                    }
                });
            } else {
                return initializeSlick();
            }
        }
    };
}
]);

//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0 ; i < images.length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                    (
                        (top <= bottomFoldOffset) &&
                        (top >= topFoldOffset)
                    )
                ||
                    (
                        (bottom <= bottomFoldOffset) &&
                        (bottom >= topFoldOffset)
                    )
                ||
                    (
                        (top <= topFoldOffset) &&
                        (bottom >= bottomFoldOffset)
                    )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);
app.directive('categorydata', ['$http', "$rootScope", function ($http, $rootScope) {
	return {
		restrict: 'E',		
		scope: {
			mapping: "@",
			category: "@",
			showprice: "@",
			by: "@",
			pdplink: "@",			
			freetext: "@",
			limitforcategory: "@",
            mineconalt :"@",
            pdpimage:"@",
            mineconimage:"@"
		},
		template: '<div class="col-12 col-sm-6 col-md-3 category-item card" ng-repeat="catalog in CategoryResults | limitTo:limitforcategory">'+
                                            '<a ng-cloak href="{{pdplink.toLowerCase()}}?id={{catalog.id}}" aria-label="{{catalog.Title[locale] == undefined ? catalog.Title.neutral  : catalog.Title[locale] | uppercase}}"  price-directive price-catalog="{{catalog}}" price-spantext="true">'+
                                                '<img class="animated card-img-top" ng-cloak ng-src="{{pdpimage}}" bn-lazy-src="{{catalog.Images[0].url}}?width=500" err-src="{{pdpimage}}" alt="{{catalog.Title[locale] == undefined ? catalog.Title.neutral  : catalog.Title[locale]}}" />'+
                                                '<h4 ng-cloak>{{catalog.Title[locale] == undefined ? catalog.Title.neutral  : catalog.Title[locale]}}</h4>'+
                                               ' <p ng-cloak class="creator">{{by}} {{catalog.DisplayProperties.creatorName}}</p>'+
                                                '<p class="rating" ng-if="catalog.TotalRatingsCount >= 5"><span>★★★★★</span><span rating-width="{{catalog.AverageRating}}">★★★★★</span></p>'+
        										'<div>'+
                                                    '<p ng-cloak class="price" ng-show="catalog.DisplayProperties.price!=null && catalog.DisplayProperties.price>0">'+
                                                        '<span price-directive price-catalog="{{catalog}}" price-spantext="false"></span>'+
                                                       ' <span><img ng-src="{{mineconimage}}" alt="{{mineconalt}}" /></span></p>'+
                                                    '<p ng-cloak class="price" ng-show="catalog.DisplayProperties.price == null">'+
													'<span>0</span>'+
                                                        '<span> <img ng-src="{{mineconimage}}" alt="{{mineconalt}}" /> </span> </p><p class="price" ng-show="catalog.DisplayProperties.price == 0">{{freetext}}</p>'+
                                                      '</div>  </a> </div>',
		controller: function ($scope) {	
            $scope.locale = locale;        
			$scope.CategoryResults = [];			
			var version = $scope.mapping ===  "bundle" ? bundleCatalogVersion : catalogVersion
			if ($scope.category === "Newly Added" && $scope.mapping !== "all") {
				$http.get("/bin/minecraft/productmanagement.productsinfobytype.json?locale=" + locale + "&type=" + $scope.mapping + "&limit=4&skip=0" ).then(function (response) {
                	$scope.CategoryResults = response.status === 200 ? response.data.sort(function (a, b) {
                    return new Date(b.CreationDate) - new Date(a.CreationDate)
                }) : []; 
            	});				
			} 
            else if($scope.mapping === "all"){
                if($scope.category === "Special Collection") {
                    console.log($scope);
                    $http.get("/bin/minecraft/productmanagement.productsinfobytype.json?locale=" + locale + "&type=" + collectionTag + "&limit=24" ).then(function (response) {
                        $scope.CategoryResults = response.status === 200 ? response.data.sort(function (a, b) {
                                return new Date(b.CreationDate) - new Date(a.CreationDate)
                            }) : [];
                    });
                } else {
                    $http.get("/bin/minecraft/productmanagement.categorydata.json?locale=" + locale + "&type=" + $scope.mapping + "&category=" + $scope.category + "&limit=24").then(function (response) {
                        $scope.CategoryResults = response.status === 200 ? response.data.sort(function (a, b) {
                            return new Date(b.CreationDate) - new Date(a.CreationDate)
                        }) : [];
                    });
                }
            }
            else {
				$http.get("/bin/minecraft/productmanagement.categorydata.json?locale=" + locale + "&type=" + $scope.mapping+"&category="+CategoryMapping[$scope.mapping]+"&limit=4" ).then(function (response) {
                	$scope.CategoryResults = response.status === 200 ? response.data.sort(function (a, b) {
                    return new Date(b.CreationDate) - new Date(a.CreationDate)
                }) : [];                
            	});	
			}			
		}
	}
}]);

app.factory('SearchService', function ($http) {
    var getData = function (url) {

        return $http.get(url).then(function (response) {
            if (response.status === 200 && response.data.length) {
                return response.data;
            }
            else
                return [];

        });
    };

    return { getSearchResults: getData };
});
app.run(['$rootScope', '$http', '$timeout', '$window', function ($rootScope, $http, $timeout, $window) {

    if (checkfordisprice === "true") {
        $http.get("/bin/minecraft/productmanagement.promotiondetails.json?locale=" + locale).then(function (response) {
            $rootScope.promotionData = response.status === 200 ? response.data.results : [];            
			$rootScope.currentoffer = [];
            if (response.data.results.length) {
                var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                var currentOffer = response.data.results.filter(function (e) {
                    return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                        new Date(e.displayProperties.endDate) >= new Date(currentDate);
                }).sort(function (a, b) {
                    return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                });
                $rootScope.currentoffer = currentOffer;
                
            }
        });
    }
}]);

app.controller('CatalogSearch', ['$scope', 'LoadMoreService', '$window', '$rootScope', '$timeout', '$interval', '$http', 'SearchService', function ($scope, LoadMoreService, $window, $rootScope, $timeout, $interval, $http, SearchService) {
    $scope.locale = locale;
    $scope.localeCase = locale != "" ? locale.split("-")[0] + "-" + locale.split("-")[1].toUpperCase() : "en-US";
    //global declarations
    $scope.sMarketplaceItemTypes = {
        all: { xforge_key: 'all', text: catAllLabel },
        resourcepack: { xforge_key: 'resourcepack', text: catResourcePackLabel },
        mashup: { xforge_key: 'mashup', text: catMashupLabel },
        skinpack: { xforge_key: 'skinpack', text: catSkinPackLabel },
        adventure_world: { xforge_key: 'adventure_world', text: catAdventureMapsLabel },
        mini_game_world: { xforge_key: 'mini_game_world', text: catMiniGamesLabel },
        survival_spawn_world: { xforge_key: 'survival_spawn_world', text: catSurvivalSpawnsLabel },
        bundle: { xforge_key: 'bundle', text: catBundlesLabel }
    };
    $scope.sMarketplaceItemTypesNames = {
        "ALL": { xforge_key: 'all', text: catAllLabel },
        "Texture Packs": { xforge_key: 'resourcepack', text: catResourcePackLabel },
        "Mash-ups": { xforge_key: 'mashup', text: catMashupLabel },
        "Skin Packs": { xforge_key: 'skinpack', text: catSkinPackLabel },
        "Adventure Maps": { xforge_key: 'adventure_world', text: catAdventureMapsLabel },
        "Mini Games": { xforge_key: 'mini_game_world', text: catMiniGamesLabel },
        "Survival Spawns": { xforge_key: 'survival_spawn_world', text: catSurvivalSpawnsLabel },
        "Bundles": { xforge_key: 'bundle', text: catBundlesLabel }
    };
    $scope.nameMapping = {
        "Newly Added": recentlyAdded,
        "Special Collection": specialCollection,
        "Most Popular": mostPopular == undefined ? "" : mostPopular.toUpperCase(),
        "Most Popular Minecraft Skins": popularSkins,
        "Most Popular Minecraft Resources": popularTexture,
        "Most Popular Minecraft Mash-ups": popularMashup,
        "Most Popular Adventure": popularMaps,
        "Most Popular Minigames": popularMinigames,
        "Most Popular Survival Spawn": popularSpawns,
    };
    //content types availaable
    $scope.Productcataloglist = [        
        {
            mapingid: 'skinpack',
            mappingtext: catSkinPackLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'resourcepack',
            mappingtext: catResourcePackLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'mashup',
            mappingtext: catMashupLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'adventure_world',
            mappingtext: catAdventureMapsLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'mini_game_world',
            mappingtext: catMiniGamesLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'survival_spawn_world',
            mappingtext: catSurvivalSpawnsLabel,
            Cataloginnerlist: [
                newlyAdded,
                mostPop
            ]
        },
        {
            mapingid: 'all',
            mappingtext: catAllLabel,
            Cataloginnerlist: [
                "Deals",
                "Special Collection",
                "Newly Added",
                "Most Popular",
                "Most Popular Minecraft Skins",
                "Most Popular Minecraft Resources",
                "Most Popular Minecraft Mash-ups",
                "Most Popular Adventure",
                "Most Popular Minigames",
                "Most Popular Survival Spawn",
            ],
            CataloginnerlistMapping: {
                "Deals": ["all", ""],
                "Special Collection": [collectionTag, specialCollection],
                "Newly Added": ["all", ""],
                "Most Popular": ["all", ""],
                "Most Popular Minecraft Skins": ["skinpack", catSkinPackLabel],
                "Most Popular Minecraft Resources": ["resourcepack", catResourcePackLabel],
                "Most Popular Minecraft Mash-ups": ["mashup", catMashupLabel],
                "Most Popular Adventure": ["adventure_world", catAdventureMapsLabel],
                "Most Popular Minigames": ["mini_game_world", catMiniGamesLabel],
                "Most Popular Survival Spawn": ["survival_spawn_world", catSurvivalSpawnsLabel],
            }        

        }
    ];


    $scope.productCategories = ["all", "skinpack", "resourcepack", "mashup", "adventure_world", "mini_game_world", "survival_spawn_world", "bundle"];
    $scope.productCategoriesNames = ["All", "Skin Packs", "Texture Packs", "Mash-ups", "Adventure Maps", "Mini Games", "Survival Spawns", "Bundles"];

    $scope.showPrice = showPrice;
    $scope.Searchbuttontext = Searchplaceholdertext;
    $scope.EmptySearchterm = EmptySearchterm;
    $scope.defaultnav = defaultnav;
    $scope.LimitForNextSet = 6;
    $scope.autoSuggestResults = [];
    $scope.limit = !LimitForNextSet.length ? parseInt(LimitForNextSet) : 16; //limit to show
    $scope.LoadedCount = 0;
    $scope.jsonSearchResults = []; //copy of search results from API
    $scope.jsonRenderedResults = []; //Results appends to DOM    
    $scope.flagForSearchResults = false;
    $scope.searchterm = "";
    $scope.limitForCategory = 4;
    $scope.moreLinkclicked = false;
    $scope.placeholder = Searchplaceholdertext;
    $scope.isQueried = 0; //Flag for search initiate
    $scope.callSearchResultsList = [];
    $scope.focusedIndex = -1;// arrow key navigation
    $scope.springpromotionproducts = [];
    $scope.jsonCategoryRenderedList = [];
    $scope.CategoryRenderedList = [];
    $scope.totalItems = 0;
    $scope.fladForLoadMore = true;
    $scope.loadMore = function () {
        if($scope.url.indexOf("skip=") > 0 )
            $scope.url = $scope.url.split("skip=")[0]+ "skip=" +$scope.totalItems;
        $http.get($scope.url).then(function (response) {
            $scope.jsonSearchResults = response.status === 200 ? $scope.jsonSearchResults.concat(response.data) : [];
            $scope.totalItems += response.status === 200 ? response.data.length : 0;
            if (response.status === 200 && response.data.length < 16)
                $scope.fladForLoadMore = false;
            setTimeout(()=>{
                const element=document.getElementById(response.data[0].id);
                element.focus()
            },2000)
        });
    }
    //Tabs
    $scope.tab = "skinpack";



    //Filter results based on tab selected. 
    $scope.setTab = function (type, ev) {
        if (ev !== undefined)
            ev.preventDefault();
        var version = type === "bundle" ? bundleCatalogVersion : catalogVersion;
        $scope.tab = type;
        $scope.moreLinkclicked = false;
        $scope.fladForLoadMore = true;
        $scope.totalItems = 0;
        $scope.CategoryRenderedList = $scope.jsonCategoryRenderedList;
        $scope.limitForCategory = 4;
        $scope.isQueried = 0;
        $scope.placeholder = Searchplaceholdertext;
        //$scope.jsonCategoryRenderedResults(0);// Reset the more link items
        $scope.searchterm = "";
        if (type !== defaultnav) {
            $scope.jsonRenderedResults = [];
            $scope.jsonSearchResults = [];//Reset results and add current tab results
            //add logic to remove already displayed items
            $scope.totalItems =4; //removes first four products
			$scope.url = "/bin/minecraft/productmanagement.productsinfobytype.json?locale=" + locale + "&type=" + $scope.tab + "&limit=20&skip=" + $scope.totalItems;
            $http.get($scope.url ).then(function (response) {
                $scope.jsonSearchResults = response.status === 200 ? response.data : [];
                $scope.totalItems += response.status === 200 ? response.data.length : 0;
                $scope.url = "/bin/minecraft/productmanagement.productsinfobytype.json?locale=" + locale + "&type=" + $scope.tab + "&limit=16&skip=" + $scope.totalItems;
                if (response.status === 200 && response.data.length < 20)
                    $scope.fladForLoadMore = false;
            });
        }
    };
    $scope.isSet = function (type) {
        return $scope.tab === type;
    };
    $scope.getQueryStringValue = function (key) {
        $scope.productType = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")).split(".html")[0];
        return true;
    };
    //sett tab if query string contains type
    if ($scope.getQueryStringValue("type") && sMarketplaceItemTypesNames[toTitleCase($scope.productType)])
        $scope.setTab(sMarketplaceItemTypesNames[toTitleCase($scope.productType)].xforge_key);
    //Move all section to front
    angular.element(document).ready(function () {           
    	var navList = document.querySelectorAll('.nav-tabs li');
		navList[0].parentNode.insertBefore(navList[6], navList[0]);
    	navList[6].firstElementChild.click();
    	});

    // filter results of auto suggest based on search term - Auto Suggest
    $scope.SearchResultsList = function () {
        var list = [];
        if ($scope.searchterm.length) {
            $http.get("/bin/minecraft/productmanagement.autosuggest.json?locale=" + locale + "&term=" + $scope.searchterm).then(function (response) {
                if (response.status === 200 && response.data.length) {
                    $scope.callSearchResultsList = response.data.map(function (element) {
                        return (element.ContentType === catalogVersion || element.ContentType === bundleCatalogVersion) && element.Tags !== null && element.Tags.length > 0 && (element.Tags.filter(function (e) {
                            return sMarketplaceItemTypes[e] != null
                        })).map(function (elem) {
                            return (element.Title[locale] === undefined || element.Title[locale] === null) ? toTitleCase(element.Title.neutral) + " " + inText.toLowerCase() + " " + toTitleCase(sMarketplaceItemTypes[elem].text)
                                : toTitleCase(element.Title[locale]) + " " + inText.toLowerCase() + " " + toTitleCase(sMarketplaceItemTypes[elem].text)
                        })
                    }).join(',').split(',').concat(
                        response.data.map(function (element) {
                            return (element.Title[locale] === undefined || element.Title[locale] === null) ? toTitleCase(element.Title.neutral)
                                : toTitleCase(element.Title[locale])
                        }).join(',').split(',')
                    ).concat(productCategoriesNames.filter(function (e) { return e.toLowerCase().startsWith($scope.searchterm.toLowerCase()) })).filter(function (elem, index, self) {
                        return index == self.indexOf(elem);
                    }).slice(0, 10);
                }
                else
                    $scope.callSearchResultsList = productCategoriesNames.filter(function (e) { return e.toLowerCase().startsWith($scope.searchterm.toLowerCase()) });
            });
        } else {
            $scope.callSearchResultsList = [];
        }

    }
    //user is updating search term
    $scope.searchtermChange = function () {
        //        $scope.isQueried = 0;
        $scope.focusedIndex = -1; // set focus to first item
        if (!$scope.searchterm.length) {
            $scope.setTab('skinpack');
        }
        $scope.fladForLoadMore = false;
        $scope.flagForSearchResults = false;
        $scope.SearchResultsList();

    }
    //set selected item in search box
    $scope.setSearchTerm = function (ev) {
        ev.preventDefault();
        $scope.searchterm = ev.target.innerText;
        $timeout(function() {
        	$scope.filterResults();
        }, 100);
        $scope.flagForSearchResults = true;
    }



    //Show filter results on UI
    $scope.filterResults = function () {
        document.getElementById("search-box").blur();//remove focus from input element
        $scope.searchtermtext = $scope.searchterm;
        //$scope.flagForSearchResults = true;        
        if ($scope.searchterm.length) {
            // Scroll page to top
            //$window.scrollTo(0, document.getElementById('scroll-1').offsetTop + document.getElementById('header').clientHeight)
            $scope.tab = "";            
            $scope.jsonSearchResults = []; 
            $scope.isQueried = 0;
            $scope.totalItems = 0;
            //if user search for free items
            if ($scope.searchterm.toLowerCase() === freetext.toLowerCase()) {
                $scope.url = "/bin/minecraft/productmanagement.freeproducts.json?locale=" + locale+"&limit=20&skip=" + $scope.totalItems;
            }
            // If search term is product category, get all items in that category.
            else if (productCategoriesNames.indexOf(toTitleCase($scope.searchterm)) !== -1) {
                var type = sMarketplaceItemTypesNames[productCategoriesNames[productCategoriesNames.indexOf(toTitleCase($scope.searchterm))]].xforge_key;
                $scope.url = "/bin/minecraft/productmanagement.productsinfobytype.json?locale=" + locale + "&type=" + type + "&limit=20&skip=" + $scope.totalItems;
            }
            else if ($scope.searchterm.lastIndexOf(" " + inText.toLowerCase() + " ") > 0) {
                var title = $scope.searchterm.substr(0, $scope.searchterm.lastIndexOf(" " + inText.toLowerCase() + " "));
                $scope.url = "/bin/minecraft/productmanagement.autosuggest.json?locale=" + locale + "&term=" + title;
            }
            else {
                $scope.url = "/bin/minecraft/productmanagement.autosuggest.json?locale=" + locale + "&term=" + $scope.searchterm;
            }

            var dataPromise = SearchService.getSearchResults($scope.url);
            dataPromise.then(function (results) {
                if (results.length == 0) {
                    $scope.url = "/bin/minecraft/productmanagement.filterproduct.json?locale=" + locale + "&creatorId=" + $scope.searchterm + "&limit=20" + "&skip=" + $scope.totalItems;
                    SearchService.getSearchResults($scope.url).then(function (response) {
                        if (response.length) {                           
                            $scope.jsonSearchResults = response;
                            $scope.totalItems += response.length;
                            $scope.isQueried = 1;
                             if($scope.jsonSearchResults.length < 20)
								$scope.fladForLoadMore = false;
                			 else
								$scope.fladForLoadMore = true;
                            				// set limit to 16
                if($scope.url.indexOf("limit=") > 0)
                    $scope.url =$scope.url.split("limit=")[0]+"limit="+16+"&skip=20";
                        }
                        else{
							//get based on description
                            SearchService.getSearchResults("/bin/minecraft/productmanagement.productsbydescrpition.json?locale=" + locale + "&term=" + $scope.searchterm ).then(function (response) {
								if (response.length) {                                   
                            		$scope.jsonSearchResults = response.slice(0,16);
                            		$scope.totalItems += response.length;
                                    $scope.isQueried = 1;
                        		}
                                else {
									$scope.jsonSearchResults=[];      
                                    $scope.isQueried = 1;
                                }

                            });
                        }
                    });
                }
                else if (results.length) {                    
                    $scope.jsonSearchResults = results;
                    $scope.totalItems += results.length;
                    $scope.isQueried = 1;
                }
                else {					                  
                    $scope.tab = "";                    
                }
                if($scope.jsonSearchResults.length < 20)
					$scope.fladForLoadMore = false;
                else
					$scope.fladForLoadMore = true;

				// set limit to 16
                if($scope.url.indexOf("limit=") > 0)
                    $scope.url =$scope.url.split("limit=")[0]+"limit="+16+"&skip=20";


            });
        } else {
            //show error message
            $scope.placeholder = EmptySearchterm;
        }
    }


    //Categories initial load
    $scope.loadInitial = function () {
        if (location.search.toLowerCase().indexOf("showresults=true") >= 0)
            $scope.tab = "";
        else if ($scope.productType.length == 0)
            $scope.setTab('skinpack');
        else
            $scope.setTab(sMarketplaceItemTypesNames[toTitleCase($scope.productType)].xforge_key);


        if (checkfordisprice === "true") {
            $scope.$watch(function () {
                return $rootScope.promotionData;
            }, function () {
                $scope.getSalePromotionData();
            }, true);
        }

    }
    $scope.loadInitial();
    //Show 24 items on more link click
    $scope.jsonMoreCategoryResults = function (ev, category, mapping) {
        ev.preventDefault();
        //Scroll to top
        $window.scrollTo(0, document.getElementById('catalog-search').offsetTop);
        $scope.moreLinkclicked = true;
        $scope.tab = "";
        $scope.placeholder = Searchplaceholdertext;        
        $scope.limitForCategory = 24;
        $scope.fladForLoadMore = false;
        $scope.jsonSearchResults = []; 
        $scope.currentCategory = category + mapping;
    }

    //Trigger jsonMoreCategoryResults if query string has show results
    if (location.search.toLowerCase().indexOf("showresults=true") >= 0) {
        var stop = $interval(function () {
            if (document.getElementById('Most Popular all').querySelectorAll("a")[0] !== undefined) {
                $timeout(function () {
                    var el = document.getElementById('Most Popular all').querySelectorAll("a")[0];
                    angular.element(el).triggerHandler('click');
                    $interval.cancel(stop);
                });
            }

        }, 100);
    }
    //Hide panels that are doesnt belongs to current mapping on more link click
    $scope.isCurrentCategory = function (mapping) {
        if ($scope.moreLinkclicked)
            return $scope.currentCategory == mapping;
        else
            return true;
    }

    /*$scope.getPromotionProduct = function (discountItem) {
        var list = ArraySale.sort(function (a, b) {
                return b.displayProperties.discount - a.displayProperties.discount;
            }).map(function (e) {
                return e.displayProperties.offerIds
            }).join().split(",");
        $scope.springpromotionproducts = jsonSearchResults.results.filter(function (e) {
            return list.indexOf(e.Id) > -1;
        });

         return $scope.springpromotionproducts.map(function (item) {
            var n = list.indexOf(item.Id);
            list[n] = '';
            return [n, item]
        }).sort().map(function (j) { return j[1] }); 
    }*/

    //New logic for Spring Sale promotion
    //We want "DoorBusters" to show first then the random regular items.

    $scope.getPromotionProduct = function (discountItem) {
        var list = [];

        $.each(discountItem, function (index, value) {
            tempArray = value.displayProperties.offerIds.join().split(",");
            //List is empty
            if (list.length === 0) {
                list = tempArray;
            }
            else {
                //If Regular Sale add at the end else add at beginning
                if (value.description["neutral"].match("Regular") != null) {
                    //This function randomizes the Regular items 
                    tempArray.sort(function (a, b) { return 0.5 - Math.random() });
                    //Append to the end
                    list = list.concat(tempArray);
                }
                else
                    //Appen beginnging
                    list = tempArray.concat(list);
            }
        });
        return list;


    }




    //Logic to show more items (SpringPromotion)
    $scope.getSalePromotionData = function () {
        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            $scope.promotionIDs = $scope.getPromotionProduct(discountItem);               
            if(discountItem.length > 0){
				 $http.get("/bin/minecraft/productmanagement.saleproducts.json?locale=" + locale + "&id=" + $scope.promotionIDs.splice(0,24).toString()).then(function (response) {
                     $scope.salePromotionData = response.status === 200 ? response.data : [];
                 });                
            }
            else
				$scope.salePromotionData = [];
        }
        else
            $scope.salePromotionData = [];
    }

    //load more for spring sales
    $scope.loadMore_SalePromotion = function (count) {       
        $http.get("/bin/minecraft/productmanagement.saleproducts.json?locale=" + locale + "&id=" + $scope.promotionIDs.splice($scope.limitForCategory,16).toString()).then(function (response) {
             $scope.salePromotionData = response.status === 200 ? $scope.salePromotionData.concat(response.data) : [];
            $scope.limitForCategory = response.data.length ? $scope.limitForCategory + 16 : $scope.limitForCategory;
        });  
    }



    //hide dropdown when focus lost in input.
    $scope.hideDropdown = function () {
        $scope.callSearchResultsList = [];
    }

    //Arrow key navigation
    $scope.handleKeyDown = function ($event) {
        var keyCode = $event.keyCode;
        if (keyCode === 40) {
            // Down
            $event.preventDefault();
            if ($scope.focusedIndex !== $scope.callSearchResultsList.length - 1) {
                $scope.focusedIndex++;
            }
        }
        else if (keyCode === 38) {
            // Up
            $event.preventDefault();
            if ($scope.focusedIndex !== 0) {
                $scope.focusedIndex--;
            }
        }
        else if (keyCode === 13 && $scope.focusedIndex >= 0) {
            // Enter
            $event.preventDefault();
            if ($scope.callSearchResultsList.length)
                $scope.searchterm = $scope.callSearchResultsList[$scope.focusedIndex];
            $scope.fv();
            $scope.flagForSearchResults = true;
        }
    };

}]);


var flagforanimate = 1;
var InViewport = function (el) {
    if (!el.length)
        return 0;
    var elementTop = el.offset().top;
    var elementBottom = elementTop + el.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};
var imageDrag = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || navigator.maxTouchPoints === 10,
    imageDrag: function () {        
        var start = this.isMobile ? "touchstart" : "mousedown";
        var stop = this.isMobile ? "touchend" : "mouseup";
        var move = this.isMobile ? "touchmove" : "mousemove";
        var _DRAGGGING_STARTED = 0;
        var _LAST_MOUSEMOVE_POSITION = { x: null, y: null };
        var _DIV_OFFSET = $('#image-container').offset();
        var _CONTAINER_WIDTH = 0;
        var _CONTAINER_HEIGHT = 0;
        var _IMAGE_WIDTH;
        var _IMAGE_HEIGHT;
        var _IMAGE_LOADED = 0;

        $('#image-container').off(start);
        $('#image-container').off(stop);
        $('#image-container').off(move);
        // Check whether image is cached or wait for the image to load 
        // This is necessary before calculating width and height of the image
        if ($('#drag-image').length > 0 && $('#drag-image').get(0).complete) {
            ImageLoaded();
        }
        else {
            $('#drag-image').on('load', function () {
                ImageLoaded();               
            });
        }

        // Image is loaded
        function ImageLoaded() {
            _IMAGE_WIDTH = $("#drag-image").width();
            _IMAGE_HEIGHT = $("#drag-image").height();
            _CONTAINER_WIDTH = $("#image-container").outerWidth();
            _CONTAINER_HEIGHT = $("#image-container").innerHeight();
            _IMAGE_LOADED = 1;
            if(_IMAGE_WIDTH < _CONTAINER_WIDTH )
                $("#image-container .absolute-content").hide();
            else
                $("#image-container").addClass("has-opacaity")
        }
        $("#image-container").bind('dragstart', function () {
            return false;
        });
        $('#image-container').on(start, function (event) {
            ImageLoaded();
            $("#image-container").removeClass("has-opacaity");
            $("#image-container .absolute-content").hide();
            /* Image should be loaded before it can be dragged */
            if (_IMAGE_LOADED == 1) {
                _DRAGGGING_STARTED = 1;

                /* Save mouse position */
                if (/Android/i.test(navigator.userAgent) || navigator.maxTouchPoints === 10)
                    _LAST_MOUSE_POSITION = { x: event.touches[0].pageX - _DIV_OFFSET.left, y: event.touches[0].pageY - _DIV_OFFSET.top };
                else
                    _LAST_MOUSE_POSITION = { x: event.pageX - _DIV_OFFSET.left, y: event.pageY - _DIV_OFFSET.top };
            }
        });

        $('#image-container').on("mouseleave", function (event) {

            if (_IMAGE_WIDTH > _CONTAINER_WIDTH){
					$("#image-container").addClass("has-opacaity");
                $("#image-container .absolute-content").show();
            }

            event.preventDefault();
            _DRAGGGING_STARTED = 0;
        });
        $('body').on(stop, function () {           
            _DRAGGGING_STARTED = 0;
        });
        $('#image-container').on(stop, function () {

            if (_IMAGE_WIDTH > _CONTAINER_WIDTH){
                $("#image-container").addClass("has-opacaity");
                $("#image-container .absolute-content").show();
            }
            _DRAGGGING_STARTED = 0;
        });

        $('#image-container').on(move, function (event) {
            var current_mouse_position = {};
            if (_DRAGGGING_STARTED == 1 && _IMAGE_WIDTH > _CONTAINER_WIDTH) {
                if (/Android/i.test(navigator.userAgent) || navigator.maxTouchPoints === 10)
                    current_mouse_position = { x: event.touches[0].pageX - _DIV_OFFSET.left, y: event.touches[0].pageY - _DIV_OFFSET.top };
                else
                    current_mouse_position = { x: event.pageX - _DIV_OFFSET.left, y: event.pageY - _DIV_OFFSET.top };
                var change_x = current_mouse_position.x - _LAST_MOUSE_POSITION.x;
                var change_y = current_mouse_position.y - _LAST_MOUSE_POSITION.y;

                /* Save mouse position */
                _LAST_MOUSE_POSITION = current_mouse_position;

                var img_top = parseInt($("#drag-image").css('top'), 10);
                var img_left = parseInt($("#drag-image").css('left'), 10);

                var img_top_new = img_top + change_y;
                var img_left_new = img_left + change_x;

                /* Validate top and left do not fall outside the image, otherwise white space will be seen */
                if (img_top_new > 0)
                    img_top_new = 0;
                if (img_top_new < (_CONTAINER_HEIGHT - _IMAGE_HEIGHT))
                    img_top_new = _CONTAINER_HEIGHT - _IMAGE_HEIGHT;

                if (img_left_new > 0)
                    img_left_new = 0;
                if (img_left_new < (_CONTAINER_WIDTH - _IMAGE_WIDTH))
                    img_left_new = _CONTAINER_WIDTH - _IMAGE_WIDTH;
                $("#drag-image").css({ left: img_left_new + 'px' });
            }
        });
    },
    init: function () {        
        $("#drag-image").css({ left: -($("#drag-image").width() - $("#image-container").outerWidth()) / 2 + 'px' });
        this.imageDrag();
        //if ($("#image-container").outerWidth() < $("#drag-image").width())
        //    this.imageDrag();
        //else {
        //    $("#image-container .absolute-content").hide();
        //}
            
    }
};

$(window).on("load resize", function () {
    imageDrag.init();          
});
$(window).scroll(function () {
    var container_width = $("#image-container").outerWidth();
    var image_width = $("#drag-image").width();
    if (InViewport($("#image-container")) && flagforanimate && (image_width -container_width >= 50)) {
        flagforanimate = 0;
        $("#image-container img").animate({ left: (-($("#drag-image").width() - $("#image-container").outerWidth()) / 2 ) -100}, 1000, function () {
            $("#image-container img").animate({ left: (-($("#drag-image").width() - $("#image-container").outerWidth()) / 2) }, 1000);
        });
    }
});


var onelink = "https://minecraft.onelink.me/1010960778?pid=minecraftnet&amp;is_retargeting=true&amp;af_sub1={guid}&amp;af_sub2={pname}&amp;af_sub3={pprice}&amp;af_dp=minecraft%3A%2F%2FopenStore%2F%3FshowStoreOffer%3D{prod-id}";
var android_ios = "minecraft://openStore/?showStoreOffer={prod-id}";
var app = angular.module('productApp', ["ngSanitize"]);

//get the promotion details 
app.run(['$rootScope', '$http', '$timeout', '$window', function ($rootScope, $http, $timeout, $window) {
    if (checkfordisprice === "true") {
        $http({
            method: "GET",
            url: "/bin/minecraft/productmanagement.promotiondetails.json?locale=" + locale
        }).then(function (response) {
            if (response.data && response.data.results) {
                $rootScope.promotionData = response.status === 200 ? response.data.results : [];
                if (response.data.results.length) {
                    var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                    var currentOffer = response.data.results.filter(function (e) {
                        return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                            new Date(e.displayProperties.endDate) >= new Date(currentDate);
                    }).sort(function (a, b) {
                        return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                    });
                    
                }
            }
        }, function myError(response) {
            $scope.errorMessage = response;
        });
    }
}]);

app.factory('GetDeviceDetails', function () {
    var factory = {};
    var nAgt = navigator.userAgent;
    factory.getBrowser = function () {
        var browser = "";
        //EDGE
        if (nAgt.indexOf('Edge') != -1) {
            browser = 'Edge';
        }
        // MSIE
        else if (nAgt.indexOf('MSIE') != -1) {
            browser = 'IE';
        }
        // Chrome
        else if (nAgt.indexOf('Chrome') != -1) {
            browser = 'Chrome';
        }
        // Safari
        else if (nAgt.indexOf('Safari') != -1) {
            browser = 'Safari';
        }
        // Firefox
        else if (nAgt.indexOf('Firefox') != -1) {
            browser = 'Firefox';
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'IE11';
        }
        return browser;
    }
    factory.getOS = function () {
        var clientStrings = [
            { s: 'Win10', r: /(Windows 10.0|Windows NT 10.0)/ },
            { s: 'Android', r: /Android/ },
            { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
            { s: 'MacX', r: /Mac OS X/ },
            { s: 'Mac', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ }
        ];
        return clientStrings.filter(function (e) {
            return e.r.test(nAgt);
        });
    }
    return factory;
});
//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0; i < images.length; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0; i < images.length; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0; i < visible.length; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                (
                    (top <= bottomFoldOffset) &&
                    (top >= topFoldOffset)
                )
                ||
                (
                    (bottom <= bottomFoldOffset) &&
                    (bottom >= topFoldOffset)
                )
                ||
                (
                    (top <= topFoldOffset) &&
                    (bottom >= bottomFoldOffset)
                )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);

app.controller('productCtrl', function ($scope, $http, $window, $sce, $rootScope, GetDeviceDetails) {
    $scope.locale = locale;
    $scope.localeCase = locale != "" ? locale.split("-")[0] + "-" + locale.split("-")[1].toUpperCase() : "en-US";
    $scope.productInfo = {};
    $scope.carosal = [];
    $scope.errorMessage = '';
    $scope.videoUrl = '#';
    $scope.panorama = '';
    $scope.moreProductsByThisCreator = [];
    $scope.jsonSearchResults = [];
    $scope.uMightAlsoLike = [];
    $scope.productCategories = ["skinpack", "resourcepack", "mashup", "mini_game_world", "adventure_world", "survival_spawn_world", "bundle"];
    $scope.bundleCatalogVersion = "BundleOffer_V1.0";
    $scope.catalogVersion = 'MarketplaceDurableCatalog_V1.2';
    $scope.sMarketplaceItemTypes = {
        resourcepack: {
            xforge_key: "resourcepack",
            text: "Texture Packs"
        },
        mashup: {
            xforge_key: "mashup",
            text: "Mash-ups"
        },
        skinpack: {
            xforge_key: "skinpack",
            text: "Skin Packs"
        },
        mini_game_world: {
            xforge_key: "mini_game_world",
            text: "Mini Games"
        },
        adventure_world: {
            xforge_key: "adventure_world",
            text: "Adventure Maps"
        },
        survival_spawn_world: {
            xforge_key: "survival_spawn_world",
            text: "Survival Spawns"
        },
        bundle: {
            xforge_key: "bundle",
            text: "Bundles"
        }
    };
    $scope.SetCurrentimage = function (image) {
        $scope.Currentimage = image;
    }
    $scope.changeImage = function (ev, image) {
        ev.stopPropagation();
        $scope.Currentimage = image;
    }
    $scope.getProductDetails = function () {
        var qpArray = window.location.search.split("?");
        var id = "";
        if (qpArray.length > 1) {
            id = qpArray[1];
        }
        if (id) {
            $http({
                method: "GET",
                url: "/bin/minecraft/productmanagement.productdetails.json?" + id
            }).then(function (response) {
                if (response.data) {
                    $scope.processProductData(response.data);
                    $scope.productInfo = response.data;
                    $scope.populateUmightAlsoLike();
                    $scope.thumbnail = response.data.images.filter(function (e) { return e.tag == 'Thumbnail' })[0].url
                    setTimeout(function () {
                        $scope.initCaroasal();
                        imageDrag.init();
                    }, 200);
                    if (response.data.creatorId) {
                        $scope.getMorebyThisCreator(response.data.displayProperties.creatorName);
                    }
                    setTimeout(function () {
                        var pSection = jQuery('.panoramaText p');
                        var cSection = jQuery('.carosalText p');
                        if (pSection) {
                            if (pSection.length > 1) {
                                jQuery(pSection[pSection.length - 1]).append(' ' + ($scope.productInfo.title[$scope.localeCase] != null ? $scope.productInfo.title[$scope.localeCase] : $scope.productInfo.title.neutral) + ' ' + fromtext + ' ' + $scope.productInfo.displayProperties.creatorName + '.');
                            } else if (pSection.length == 1) {
                                jQuery(pSection).append(' ' + ($scope.productInfo.title[$scope.localeCase] != null ? $scope.productInfo.title[$scope.localeCase] : $scope.productInfo.title.neutral) + ' ' + fromtext + ' ' + $scope.productInfo.displayProperties.creatorName + '.');
                            }
                        }
                        if (cSection) {
                            if (cSection.length > 1) {
                                jQuery(cSection[cSection.length - 1]).append(' ' + ($scope.productInfo.title[$scope.localeCase] != null ? $scope.productInfo.title[$scope.localeCase] : $scope.productInfo.title.neutral) + ' ' + fromtext + ' ' + $scope.productInfo.displayProperties.creatorName + '.');
                            } else if (cSection.length == 1) {
                                jQuery(cSection).append(' ' + ($scope.productInfo.title[$scope.localeCase] != null ? $scope.productInfo.title[$scope.localeCase] : $scope.productInfo.title.neutral) + ' ' + fromtext + ' ' + $scope.productInfo.displayProperties.creatorName + '.');
                            }
                        }
                    }, 200);

                    if ($scope.productInfo.tags.indexOf("bundle") >= 0) {
                        $scope.BundleProducts = [];
                        var UUIDList = $scope.productInfo.displayProperties.packIdentity != null ? $scope.productInfo.displayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];
                        $http.get("/bin/minecraft/productmanagement.uuiddata.json?locale=" + locale + "&uuid=" + UUIDList.toString()).then(function (response) {
                            $scope.BundleProducts = response.status === 200 ? response.data.filter(function (a) {
        return !this[a.id] && (this[a.id] = true);
    }, Object.create(null)) : [];
                        });
                    }

                }


          }, function myError(response) {
            $scope.errorMessage = response;
        });
        }
  };
$scope.flatternProductData = function (obj) {
    var thumbnailImageObj = _.find(obj.images, function (images) {
        return images.type == 'Thumbnail';
    });
    obj.thumbnailImage = thumbnailImageObj ? thumbnailImageObj.url : '';
    obj.averageRating = obj.rating ? ((obj.rating.averageRating * 20) + '%') : '';
}
$scope.getMorebyThisCreator = function (creatorId) {
    if (creatorId) {
        $http({
            method: "GET",
            url: "/bin/minecraft/productmanagement.filterproduct.json?limit=10&creatorId=" + creatorId + "&locale=" + locale + "&skip=0"
        }).then(function (response) {
            if (response.data) {
                _.forEach(response.data, function (obj) {
                    $scope.flatternProductData(obj);
                });
                var qpArray = window.location.search.split("?id=");
                var id = "";
                if (qpArray.length > 1) {
                    id = qpArray[1];
                }
                $scope.moreProductsByThisCreator = response.data.filter(function (e) {
                    return e.id !== id;
                }).sort(function (a, b) {
                    return new Date(b.CreationDate) - new Date(a.CreationDate)
                }).slice(0, 4);
                ;
            }
        }, function myError(response) {
            $scope.errorMessage = response;
        });
    }
};
$scope.initCaroasal = function () {
    jQuery('.center').slick({
        centerMode: true, centerPadding: '60px', slidesToShow: 1, variableWidth: true,
        prevArrow: '<button tabindex="0" class="slick-prev slick-arrow btn hovereffect btn-primary btn-primary--carousel btn-primary--grow" aria-label="Previous" role="button"><span title="Previous"><span class="grow"></span><svg role="img" title="left" class="svg-icon" focusable="false"><use xlink:href="#pixel-arrow-left"></use><svg viewBox="0 0 512 512" class="pixel-arrow-left" width="100%" height="100%" focusable="false"><path d="M96 288v64h64v64h64v64h64V288h192v-64H288V32h-64v64h-64v64H96v64H32v64h64z"></path></svg></svg></span></button>',
        nextArrow: '<button tabindex="0" class="slick-next slick-arrow btn hovereffect btn-primary btn-primary--carousel btn-primary--grow" aria-label="next" role="button"><span title="Next"><span class="grow"></span><svg role="img" title="right" class="svg-icon" focusable="false"><use xlink:href="#pixel-arrow-right"></use><svg viewBox="0 0 512 512" class="pixel-arrow-right" width="100%" height="100%" focusable="false"><path d="M416 224v-64h-64V96h-64V32h-64v192H32v64h192v192h64v-64h64v-64h64v-64h64v-64h-64z"></path></svg></svg></span></button>',
        responsive: [{
            breakpoint: 641,
            settings: {
                centerPadding: '0px',
                centerMode: false,
                variableWidth: false,
            }
        }
        ]
    });
}
$scope.processProductData = function (data) {
    $scope.carosal = [];
    _.each(data.images, function (item) {
        if (item.tag == 'screenshot') {
            $scope.carosal.push(item.url);
        } else if (item.tag == 'Thumbnail') {
            data.thumbnailImage = item.url;
        } else if (item.tag == 'panorama') {
            $scope.panorama = item.url;
        }
    });
    $scope.videoUrl = _.get(data, 'displayProperties.videoUrl', '');
    if ($scope.videoUrl) {
        $scope.videoUrl = $sce.trustAsResourceUrl($scope.videoUrl.replace('watch?v=', 'embed/'));
        data.thumbnailImage = '';
    }
}
$scope.getProductDetails();
$scope.socialShare = function (i) {
    i.preventDefault();
    var j = i.currentTarget.getAttribute("href") + encodeURIComponent(location.href);
    if (i.currentTarget.getAttribute("id") === "reddit") {
        j = j + "&title=" + encodeURIComponent($('meta[name="twitter:description"]').attr("content"))
    } else {
        if (i.currentTarget.getAttribute("id") === "twitter") {
            j = j + "&text=" + encodeURIComponent($('meta[name="twitter:description"]').attr("content"))
        }
    }
    window.open(j, "sharer", "toolbar=0,status=0,resizable=yes,width=955,height=442")
}
$scope.populateUmightAlsoLike = function () {
    var type = $scope.productInfo.tags != null ? $scope.productInfo.tags.filter(function (e) {
        return $scope.productCategories.indexOf(e) !== -1;
    }) : [];
    var version = type.indexOf("bundle") >= 0 ? $scope.bundleCatalogVersion : $scope.catalogVersion;
    $scope.type = type.length ? $scope.sMarketplaceItemTypes[type[0]].text : "";
    var producttype = type.indexOf("bundle") >= 0 ? "bundle" : type[0];
    $http({
        method: "GET",
        url: "/bin/minecraft/productmanagement.productsinfobytype.json?limit=10&skip=0&type=" + producttype + "&locale=" + locale
    }).then(function (response) {
        if (response.data) {
            _.forEach(response.data, function (obj) {
                $scope.flatternProductData(obj);
            });
            $scope.jsonSearchResults = response.data;
            $scope.mightAlsoLike(type, producttype, version);
        }
    }, function myError(response) {
        $scope.errorMessage = response;
    });
};
$scope.mightAlsoLike = function (type, producttype, version) {

    $scope.uMightAlsoLike = $scope.jsonSearchResults.filter(function (element) {
        return element.Tags !== null && element.Tags.length > 0 && type.length > 0 && element.Tags.indexOf(producttype) >= 0
            && element.id !== $scope.productInfo.id && element.ContentType === version;
    }).sort(function (a, b) {
        return new Date(b.CreationDate) - new Date(a.CreationDate)
    }).slice(0, 4);
}

    $scope.getDiscountedPriceHero = function (item, spantext) {
		if(item.id== undefined)
   			 return;

        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.displayProperties.bundleMSRP == null) {
                        var UUIDList = item.displayProperties.packIdentity != null ? item.displayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        if (spantext === true) 
                            return item.displayProperties.price;
                        else 
                        	return "<s>" + totalMinecoin + "</s> " + item.displayProperties.price;
                    }
                    else {
						if (spantext === true) 
                            return item.displayProperties.price;
                        else 
                        	return "<s>" + item.displayProperties.bundleMSRP + "</s> " + item.displayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === true) return Math.round(disc);
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].displayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.displayProperties.price;
                    }    

                    return disc > 0 && disc % 1 != 0 ? "<s>" + item.displayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.displayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                $scope.hasDiscount = true;
                var disc = (item.displayProperties.price - (discountItem[0].displayProperties.discount * item.displayProperties.price));
                if (spantext === true) return Math.round(disc);
                return disc > 0 && disc % 1 != 0 ? "<s>" + item.displayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.displayProperties.price + "</s> " + disc;
            }
            else {
                return item.displayProperties.price;
            }
        }
        else {
            if (item.tags.indexOf("bundle") >= 0) {
                if (item.displayProperties.bundleMSRP == null) {
                    var UUIDList = item.displayProperties.packIdentity != null ? item.displayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.displayProperties.packIdentity !== null && UUIDList.indexOf(e.displayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].displayProperties.price);
                    }
                    if (spantext === true) 
                            return item.displayProperties.price;
                        else 
                    return "<s>" + totalMinecoin + "</s> " + item.displayProperties.price;
                }
                else {
                    if (spantext === true) 
                            return item.displayProperties.price;
                        else 
                    return "<s>" + item.displayProperties.bundleMSRP + "</s> " + item.displayProperties.price;
                }
            }
            return item.displayProperties.price;
        }
    }


//price function for more by/ you might like
//Get the discounted price if available
$scope.getDiscountedPrice = function (item, spantext) {
    if (item.Tags == undefined)
        return;
    var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
    if ($rootScope.promotionData !== undefined) {
        var discountItem = $rootScope.promotionData.filter(function (e) {
            return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.Id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                new Date(e.displayProperties.endDate) >= new Date(currentDate);
        });
        if (item.Tags.indexOf("bundle") >= 0) {
            if (discountItem.length == 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            } else {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === true) return Math.round(disc);
                if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }

                return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + disc;
            }
        }
        else if (discountItem.length > 0) {
            var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
            if (spantext === true) return Math.round(disc);
            return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                : "<s>" + item.DisplayProperties.price + "</s> " + disc;
        }
        else {
            return item.DisplayProperties.price;
        }
    }
    else {
        if (item.Tags.indexOf("bundle") >= 0) {
            if (item.DisplayProperties.bundleMSRP == null) {
                var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                    return e.uuid;
                }) : [];

                var bundledProducts = jsonSearchResults.results.filter(function (e) {
                    return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                        && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                });
                var totalMinecoin = 0;
                for (var key in bundledProducts) {
                    totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                }
                return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
            }
            else {
                return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
            }
        }
        return item.DisplayProperties.price;
    }
}


$scope.getCookie = function (cookie_name) {
    var name = cookie_name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$scope.redirectToPDP = function (event, ptitle, productInfo, price) {
    $scope.isclickinitiated = true;
    var OS = GetDeviceDetails.getOS();
    var os_name = OS.length ? OS[0].s : "";
    if (os_name === "Win10") {
        $scope.isValidOS = true;
        $window.open(android_ios.replace("{prod-id}", productInfo.id), '_blank');
    } else if (os_name === "Android" || os_name === "iOS") {
        $scope.isValidOS = true;
        var guid = $scope.getCookie("MSFPC");
        guid = guid.indexOf("GUID") >= 0 ? guid.slice(5, guid.indexOf('&')) : "";
        var title = ptitle.replace(/[`~!@#$%^&*–()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/  +/g, ' ').replace(/ /g, "-").toLowerCase();
        var onelink_formatted = onelink.replace("{guid}", guid).replace("{pname}", title).replace("{pprice}", price).replace(/&amp;/g, "&").replace("{prod-id}", productInfo.id);
        //alert(onelink_formatted)            
        $window.open(onelink_formatted, '_blank');
    }
    else {
        event.currentTarget.children[0].className += ' inactive';
    }
}

//Get the width of rating
$scope.getWidth = function (catalog) {
    var width = (catalog.AverageRating / 5) * 100;
    return { width: width + "%" };
}


});
app.filter('urlencode', function () {
    return function (input) {
        return window.encodeURIComponent(input);
    }
});






var app = angular.module('creatorApp', ["ngSanitize"]);

//get the promotion details
app.run(['$rootScope', '$http','$timeout', '$window', function ($rootScope, $http,$timeout, $window) {
    if (checkfordisprice === "true") {
      $http({
        method : "GET",
        url : "/bin/minecraft/productmanagement.promotiondetails.json?locale="+locale
      }).then(function (response) {
        if(response.data && response.data.results){          
			 $rootScope.promotionData = response.status === 200 ? response.data.results : [];
            if (response.data.results.length) {
                var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                var currentOffer = response.data.results.filter(function (e) {
                    return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                         new Date(e.displayProperties.endDate) >= new Date(currentDate);
                }).sort(function (a, b) {
                    return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                });
                
            }
        } 
      }, function myError(response) {
          $scope.errorMessage = response;
      });
    }
}]);




//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0 ; i < images.length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                    (
                        (top <= bottomFoldOffset) &&
                        (top >= topFoldOffset)
                    )
                ||
                    (
                        (bottom <= bottomFoldOffset) &&
                        (bottom >= topFoldOffset)
                    )
                ||
                    (
                        (top <= topFoldOffset) &&
                        (bottom >= bottomFoldOffset)
                    )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);
app.controller('creatorCtrl', function($scope, $http, $window, $sce,$rootScope) {
    $scope.locale=locale;
    $scope.scroll_flag = false;
    $scope.creatorRow1 = [];
    $scope.creatorRow2 = [];
    $scope.creatorRow3 = [];
    var flagForDBCall = true;
    var results = [];
    $scope.length =0;
	$scope.totalItems =0;
	var creatorName = "";

    $scope.getMorebyThisCreator = function() {       
        var qpArray = window.location.search.split("?name=");        
        if(qpArray.length >1){
            creatorName = decodeURIComponent(qpArray[1].split("&date=")[0]);
        }
        if(creatorName){
          $http({
            method : "GET",
            url : "/bin/minecraft/productmanagement.filterproduct.json?locale="+locale+"&creatorId="+creatorName+"&limit=20"+"&skip="+$scope.totalItems
          }).then(function (response) {
            if(response.data.length){
              _.forEach(response.data, function(obj){
                $scope.flatternProductData(obj);
              });

			  results = response.data;
               $scope.length = results.length;
               $scope.totalItems += $scope.length;
              if(results.length >8){
                $scope.creatorRow3 = _.slice(results, 8);
              }

              if(results.length >4){
                $scope.creatorRow2 = _.slice(results, 4, 8);
              }
              if(results.length >0){
                $scope.creatorRow1 = _.slice(results, 0, 4);

              }
            } 
          }, function myError(response) {
              $scope.errorMessage = response;
          });
        }
    };
    $scope.flatternProductData = function(obj){
		var thumbnailImageObj = _.find(obj.Images, function(images){
            return images.type == 'Thumbnail';
        });
        obj.thumbnailImage = thumbnailImageObj ? thumbnailImageObj.url: '';
        obj.averageRating = obj.rating ? ((obj.rating.averageRating * 20) + '%') : '';
    }

  $scope.getMorebyThisCreator();
  $scope.socialShare = function(i) {
      i.preventDefault();
      var j = i.currentTarget.getAttribute("href") + encodeURIComponent(location.href);
      if (i.currentTarget.getAttribute("id") === "reddit") {
          j = j + "&title=" + encodeURIComponent($('meta[name="twitter:description"]').attr("content"))
      } else {
          if (i.currentTarget.getAttribute("id") === "twitter") {
              j = j + "&text=" + encodeURIComponent($('meta[name="twitter:description"]').attr("content"))
          }
      }
      window.open(j, "sharer", "toolbar=0,status=0,resizable=yes,width=955,height=442")
  }
//Get the discounted price if available
    $scope.getDiscountedPrice = function (item, spantext) {
        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.Tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.DisplayProperties.bundleMSRP == null) {
                        var UUIDList = item.displayProperties.packIdentity != null ? item.displayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }
                    else if(item.DisplayProperties.bundleMSRP == item.DisplayProperties.price){
                    	return  item.DisplayProperties.price;
                	}
                    else {
                        return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === true) return Math.round(disc);
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].displayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.displayProperties.price;
                    } 
                    else if(item.DisplayProperties.bundleMSRP == item.DisplayProperties.price){
                    	return  item.DisplayProperties.price;
                	}

                    return disc > 0 && disc % 1 != 0 ? "<s>" + item.displayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.displayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === true) return Math.round(disc);
                return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.price + "</s> " + disc;
            }
            else {
                return item.DisplayProperties.price;
            }
        }
        else {
            if (item.Tags.indexOf("bundle") >= 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            }
            return item.DisplayProperties.price;
        }
    }

     //Get the width of rating
    $scope.getWidth = function (catalog) {
        var width = (catalog.AverageRating / 5) * 100;
        return { width: width + "%" };
    }

    $window.onscroll = function() {	       
        if (isElementInViewport($(".scroll-div")) && !$scope.scroll_flag) {	            
			if( $scope.totalItems>0 && flagForDBCall){
                $scope.scroll_flag = true;
        $http({
            method : "GET",
            url : "/bin/minecraft/productmanagement.filterproduct.json?locale="+locale+"&creatorId="+creatorName+"&limit=16"+"&skip="+$scope.totalItems
          }).then(function (response) {
            if(response.data.length){
				$scope.creatorRow3 = $scope.creatorRow3.concat(response.data);
            	$scope.totalItems += response.data.length ;
            }
            else
				flagForDBCall = false;
            $scope.scroll_flag =false;
        });
       }
		}
	};
});
var app = angular.module('RealmsPlus',  ["ngSanitize"]);
app.run(['$rootScope', '$http', '$timeout', '$window', function ($rootScope, $http, $timeout, $window) {

    if (checkfordisprice === "true") {
        $http.get("/bin/minecraft/productmanagement.promotiondetails.json?locale="+locale).then(function (response) {
            $rootScope.promotionData = response.status === 200 ? response.data.results : [];
            if (response.data.results.length) {
                var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                var currentOffer = response.data.results.filter(function (e) {
                    return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                         new Date(e.displayProperties.endDate) >= new Date(currentDate);
                }).sort(function (a, b) {
                    return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                });
                
            }
        });
    }
}]);

//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0 ; i < images.length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                    (
                        (top <= bottomFoldOffset) &&
                        (top >= topFoldOffset)
                    )
                ||
                    (
                        (bottom <= bottomFoldOffset) &&
                        (bottom >= topFoldOffset)
                    )
                ||
                    (
                        (top <= topFoldOffset) &&
                        (bottom >= bottomFoldOffset)
                    )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);
app.controller('RealmsPlus', ['$scope', '$rootScope','$window' , '$sce', '$http',function ($scope, $rootScope,$window, $sce,$http) {
    $scope.locale=locale;
	$scope.showPrice =showPrice;    
	var flagForDBCall = true;
	$scope.totalItems =0;
	$scope.scroll_flag = false;
	$http.get("/bin/minecraft/productmanagement.productsinfobytype.json?locale="+locale+"&type=realms_plus&limit=20&skip=0").then(function (response) {
        $scope.realms_plus_items = response.status === 200 ? response.data : [];  
        $scope.totalItems = response.status === 200 ? response.data.length : 0;
    });

    //Get the discounted price if available
    $scope.getDiscountedPrice = function (item, spantext) {
        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.Id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.Tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.DisplayProperties.bundleMSRP == null) {
                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }
                    else {
                        return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === true) return Math.round(disc);
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }    

                    return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === true) return Math.round(disc);
                return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.price + "</s> " + disc;
            }
            else {
                return item.DisplayProperties.price;
            }
        }
        else {
            if (item.Tags.indexOf("bundle") >= 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            }
            return item.DisplayProperties.price;
        }
    }


    //Get the width of rating
    $scope.getWidth = function (catalog) {
        var width = (catalog.AverageRating / 5) * 100;
        return { width: width + "%" };
    }


    $window.onscroll = function() {
        if (isElementInViewport($(".scroll-div")) &&  !$scope.scroll_flag) {					
					if( $scope.totalItems>0 && flagForDBCall){
                        $scope.scroll_flag = true;
        $http({
            method : "GET",
            url : "/bin/minecraft/productmanagement.productsinfobytype.json?locale="+locale+"&type=realms_plus&limit=20&skip="+$scope.totalItems
          }).then(function (response) {
            if(response.data.length){
				$scope.realms_plus_items = $scope.realms_plus_items.concat(response.data);
            	$scope.totalItems += response.data.length ;
            }
            else
				flagForDBCall = false;
            $scope.scroll_flag = false;
        });
       }
		}
	};

}]);
var app = angular.module('EducationProducts',  ["ngSanitize"]);
app.run(['$rootScope', '$http', '$timeout', '$window', function ($rootScope, $http, $timeout, $window) {

    if (checkfordisprice === "true") {
        $http.get("/bin/minecraft/productmanagement.promotiondetails.json?locale="+locale).then(function (response) {
            $rootScope.promotionData = response.status === 200 ? response.data.results : [];
            if (response.data.results.length) {
                var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
                var currentOffer = response.data.results.filter(function (e) {
                    return e.displayProperties !== null && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                         new Date(e.displayProperties.endDate) >= new Date(currentDate);
                }).sort(function (a, b) {
                    return new Date(a.displayProperties.endDate) - new Date(b.displayProperties.endDate)
                });
                
            }
        });
    }
}]);

//directive for lazy loading of images
app.directive("bnLazySrc", ["$window", "$document", function ($window, $document) {
    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function () {
        // I maintain a list of images that lazy-loading
        // and have yet to be rendered.
        var images = [];
        // I define the render timer for the lazy loading
        // images to that the DOM-querying (for offsets)
        // is chunked in groups.
        var renderTimer = null;
        var renderDelay = 100;
        // I cache the window element as a jQuery reference.
        var win = $($window);
        // I cache the document document height so that
        // we can respond to changes in the height due to
        // dynamic content.
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        // I determine if the window dimension events
        // (ie. resize, scroll) are currenlty being
        // monitored for changes.
        var isWatchingWindow = false;
        // ---
        // PUBLIC METHODS.
        // ---
        // I start monitoring the given image for visibility
        // and then render it when necessary.
        function addImage(image) {
            images.push(image);
            if (!renderTimer) {
                startRenderTimer();
            }
            if (!isWatchingWindow) {
                startWatchingWindow();
            }
        }
        // I remove the given image from the render queue.
        function removeImage(image) {
            // Remove the given image from the render queue.
            for (var i = 0 ; i < images.length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }
            // If removing the given image has cleared the
            // render queue, then we can stop monitoring
            // the window and the image queue.
            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I check the document height to see if it's changed.
        function checkDocumentHeight() {
            // If the render time is currently active, then
            // don't bother getting the document height -
            // it won't actually do anything.
            if (renderTimer) {
                return;
            }
            var currentDocumentHeight = doc.height();
            // If the height has not changed, then ignore -
            // no more images could have come into view.
            if (currentDocumentHeight === documentHeight) {
                return;
            }
            // Cache the new document height.
            documentHeight = currentDocumentHeight;
            startRenderTimer();
        }
        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {
            // Log here so we can see how often this
            // gets called during page activity.
            //console.log("Checking for visible images...");
            var visible = [];
            var hidden = [];
            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();
            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);
            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {
                var image = images[i];
                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                    visible.push(image);
                } else {
                    hidden.push(image);
                }
            }
            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {
                visible[i].render();
            }
            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;
            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();
            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {
                stopWatchingWindow();
            }
        }
        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {
            renderTimer = setTimeout(checkImages, renderDelay);
        }
        // I start watching the window for changes in dimension.
        function startWatchingWindow() {
            isWatchingWindow = true;
            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);
            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {
            isWatchingWindow = false;
            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");
            // Stop watching for document changes.
            clearInterval(documentTimer);
        }
        // I start the render time if the window changes.
        function windowChanged() {
            if (!renderTimer) {
                startRenderTimer();
            }
        }
        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });
    })();
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I represent a single lazy-load image.
    function LazyImage(element) {
        // I am the interpolated LAZY SRC attribute of
        // the image as reported by AngularJS.
        var source = null;
        // I determine if the image has already been
        // rendered (ie, that it has been exposed to the
        // viewport and the source had been loaded).
        var isRendered = false;
        // I am the cached height of the element. We are
        // going to assume that the image doesn't change
        // height over time.
        var height = null;
        // ---
        // PUBLIC METHODS.
        // ---
        // I determine if the element is above the given
        // fold of the page.
        function isVisible(topFoldOffset, bottomFoldOffset) {
            // If the element is not visible because it
            // is hidden, don't bother testing it.
            if (!element.is(":visible")) {
                return (false);
            }
            // If the height has not yet been calculated,
            // the cache it for the duration of the page.
            if (height === null) {
                height = element.height();
            }
            // Update the dimensions of the element.
            var top = element.offset().top;
            var bottom = (top + height);
            // Return true if the element is:
            // 1. The top offset is in view.
            // 2. The bottom offset is in view.
            // 3. The element is overlapping the viewport.
            return (
                    (
                        (top <= bottomFoldOffset) &&
                        (top >= topFoldOffset)
                    )
                ||
                    (
                        (bottom <= bottomFoldOffset) &&
                        (bottom >= topFoldOffset)
                    )
                ||
                    (
                        (top <= topFoldOffset) &&
                        (bottom >= bottomFoldOffset)
                    )
            );
        }
        // I move the cached source into the live source.
        function render() {
            isRendered = true;
            renderSource();
        }
        // I set the interpolated source value reported
        // by the directive / AngularJS.
        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I load the lazy source value into the actual
        // source value of the image element.
        function renderSource() {
            element[0].src = source;
            element.addClass("fadeIn");
        }
        // Return the public API.
        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });
    }
    // ------------------------------------------ //
    // ------------------------------------------ //
    // I bind the UI events to the scope.
    function link($scope, element, attributes) {
        var lazyImage = new LazyImage(element);
        // Start watching the image for changes in its
        // visibility.
        lazyLoader.addImage(lazyImage);
        // Since the lazy-src will likely need some sort
        // of string interpolation, we don't want to
        attributes.$observe(
            "bnLazySrc",
            function (newSource) {
                lazyImage.setSource(newSource);
            }
        );
        // When the scope is destroyed, we need to remove
        // the image from the render queue.
        $scope.$on(
            "$destroy",
            function () {
                lazyLoader.removeImage(lazyImage);
            }
        );
    }
    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
}
]);
app.controller('EducationProducts', ['$scope', '$rootScope','$window' , '$sce','$http',function ($scope, $rootScope,$window, $sce, $http) {
    $scope.locale=locale;
    $scope.localeCase= locale != "" ? locale.split("-")[0]+"-"+locale.split("-")[1].toUpperCase() : "en-US";
	$scope.showPrice =showPrice;
	var flagForDBCall = true;
	$scope.totalItems =0;
    $scope.scroll_flag = false;

    $http.get("/bin/minecraft/productmanagement.productsinfobytype.json?locale="+locale+"&type=tag.edu_content&limit=20&skip=0").then(function (response) {
        $scope.education_products = response.status === 200 ? response.data : []; 
        $scope.totalItems = response.status === 200 ? response.data.length : 0;
    });

    //Get the discounted price if available
    $scope.getDiscountedPrice = function (item, spantext) {
        var currentDate = location.search.indexOf("date=".toLowerCase()) >= 0 ? location.search.split("date=")[1] : new Date();
        if ($rootScope.promotionData !== undefined) {
            var discountItem = $rootScope.promotionData.filter(function (e) {
                return e.displayProperties !== null && e.displayProperties.offerIds !== undefined && e.displayProperties.offerIds.indexOf(item.Id) > -1
                && new Date(e.displayProperties.startDate) <= new Date(currentDate) &&
                    new Date(e.displayProperties.endDate) >= new Date(currentDate);
            });
            if (item.Tags.indexOf("bundle") >= 0) {
                if (discountItem.length == 0) {
                    if (item.DisplayProperties.bundleMSRP == null) {
                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }
                    else {
                        return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                    }
                } else {
                    var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                    if (spantext === true) return Math.round(disc);
                    if (item.DisplayProperties.bundleMSRP == null || item.DisplayProperties.bundleMSRP == undefined) {

                        var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                            return e.uuid;
                        }) : [];

                        var bundledProducts = jsonSearchResults.results.filter(function (e) {
                            return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                                && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                        });
                        var totalMinecoin = 0;
                        for (var key in bundledProducts) {
                            totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                        }
                        return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                    }    

                    return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + Math.round(disc)
                        : "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + disc;
                }
            }
            else if (discountItem.length > 0) {
                var disc = (item.DisplayProperties.price - (discountItem[0].displayProperties.discount * item.DisplayProperties.price));
                if (spantext === true) return Math.round(disc);
                return disc > 0 && disc % 1 != 0 ? "<s>" + item.DisplayProperties.price + "</s> " + Math.round(disc)
                    : "<s>" + item.DisplayProperties.price + "</s> " + disc;
            }
            else {
                return item.DisplayProperties.price;
            }
        }
        else {
            if (item.Tags.indexOf("bundle") >= 0) {
                if (item.DisplayProperties.bundleMSRP == null) {
                    var UUIDList = item.DisplayProperties.packIdentity != null ? item.DisplayProperties.packIdentity.map(function (e) {
                        return e.uuid;
                    }) : [];

                    var bundledProducts = jsonSearchResults.results.filter(function (e) {
                        return e.Tags.indexOf('bundle') == -1 && e.DisplayProperties !== null
                            && e.DisplayProperties.packIdentity !== null && UUIDList.indexOf(e.DisplayProperties.packIdentity[0].uuid) >= 0;
                    });
                    var totalMinecoin = 0;
                    for (var key in bundledProducts) {
                        totalMinecoin += parseInt(bundledProducts[key].DisplayProperties.price);
                    }
                    return "<s>" + totalMinecoin + "</s> " + item.DisplayProperties.price;
                }
                else {
                    return "<s>" + item.DisplayProperties.bundleMSRP + "</s> " + item.DisplayProperties.price;
                }
            }
            return item.DisplayProperties.price;
        }
    }


    //Get the width of rating
    $scope.getWidth = function (catalog) {
        var width = (catalog.AverageRating / 5) * 100;
        return { width: width + "%" };
    }

    $scope.showMore = function (){        
        if( $scope.totalItems>0 && flagForDBCall){
        $http({
            method : "GET",
            url : "/bin/minecraft/productmanagement.productsinfobytype.json?locale="+locale+"&type=tag.edu_content&limit=20&skip="+$scope.totalItems
          }).then(function (response) {
            if(response.data.length){
				$scope.realms_plus_items = $scope.realms_plus_items.concat(response.data);
            	$scope.totalItems += response.data.length ;
            }
            else
				flagForDBCall = false;
        });
       }
    }
    $window.onscroll = function() {
        if (isElementInViewport($(".scroll-div")) && !$scope.scroll_flag) {					
			if( $scope.totalItems>0 && flagForDBCall){
               $scope.scroll_flag = true; 
        $http({
            method : "GET",
            url : "/bin/minecraft/productmanagement.productsinfobytype.json?locale="+locale+"&type=tag.edu_content&limit=20&skip="+$scope.totalItems
          }).then(function (response) {
            if(response.data.length){
				$scope.realms_plus_items = $scope.realms_plus_items.concat(response.data);
            	$scope.totalItems += response.data.length ;
            }
            else
				flagForDBCall = false;

            $scope.scroll_flag = false;
        });
       }
		}
	};

}]);
var map,searchManager,apiKey,center,centerLat,centerLon;function loadMapScenario(){map=new Microsoft.Maps.Map(document.getElementById("bingMap"),{credentials:apiKey}),setView(),Microsoft.Maps.Events.addHandler(map,"click",getLatlng)}function setView(){map.setView({center:new Microsoft.Maps.Location(centerLat,centerLon),zoom:10})}function reverseGeocode(e){if(searchManager){var t={location:e,callback:function(e){$(".binglat").val(e.location.latitude),$(".binglong").val(e.location.longitude),$(".bingCountryName").val(e.address.countryRegion),$(".bingStreet").val(e.address.addressLine),$(".bingStreet2").val(e.address.district),$(".bingPostalCode").val(e.address.postalCode),$(".bingPostalTown").val(e.address.district),$(".bingState").val(e.address.adminDistrict)},errorCallback:function(e){alert(Granite.I18n.get("reversegeocodefail"))}};searchManager.reverseGeocode(t)}else Microsoft.Maps.loadModule("Microsoft.Maps.Search",(function(){searchManager=new Microsoft.Maps.Search.SearchManager(map),reverseGeocode(e)}))}function getLatlng(e){for(var t=map.entities.getLength()-1;t>=0;t--){map.entities.get(t)instanceof Microsoft.Maps.Pushpin&&map.entities.removeAt(t)}if("map"==e.targetType){var n=new Microsoft.Maps.Point(e.getX(),e.getY()),a=e.target.tryPixelToLocation(n),o=new Microsoft.Maps.Location(a.latitude,a.longitude),r=new Microsoft.Maps.Pushpin(o,{draggable:!1});map.entities.push(r)}reverseGeocode(o)}function clearSearchBox(){map.entities.clear(),$("#searchTbx").val(""),setView(),reverseGeocode(new Microsoft.Maps.Location(centerLat,centerLon))}function search(){searchManager?(map.entities.clear(),geocodeQuery(document.getElementById("searchTbx").value)):Microsoft.Maps.loadModule("Microsoft.Maps.Search",(function(){searchManager=new Microsoft.Maps.Search.SearchManager(map),search()}))}function searchWithZip(e){if(searchManager){var t={bounds:map.getBounds(),where:e,callback:function(e,t){$(".binglat").val(e.results[0].location.latitude),$(".binglong").val(e.results[0].location.longitude),$(".bingCountryName").val(e.results[0].address.countryRegion),$(".bingState").val(e.results[0].address.adminDistrict)}};searchManager.geocode(t)}else Microsoft.Maps.loadModule("Microsoft.Maps.Search",(function(){searchManager=new Microsoft.Maps.Search.SearchManager(map),searchWithZip(e)}))}function geocodeQuery(e){var t={where:e,callback:function(e){if(e&&e.results&&e.results.length>0){var t,n,a=[];t=new Microsoft.Maps.Pushpin(e.results[0].location,{draggable:!1}),a.push(t),map.entities.push(a),n=e.results[0].bestView,map.setView({bounds:n})}reverseGeocode(e.results[0].location)},errorCallback:function(e){alert(Granite.I18n.get("validlocation"))}};searchManager.geocode(t)}$(document).ready((function(){var e=$("html")[0].lang,t=$(".attribution__details .pubDate"),n=t.attr("data-value");if(n){n=n.replace("+","");var a=new Date(n).toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"});e.indexOf("ko")>=0&&(a=a.replace(". ","-").replace(". ","-")),t.html(a)}var o=$("#author-avatar").attr("alt");$("#author-avatar").attr("alt",o+" "+a)})),$(document).on("change",".bedrock-server-card .check-to-proceed input[type=checkbox]",(function(){var e=$(this),t=e.closest(".check-to-proceed").find("a.btn"),n=e.closest("label.form-check-label");e.is(":checked")?(t.removeClass("btn-disabled-outline").addClass("btn-primary"),t.attr("tabindex","0"),n.removeClass("animation-bounce--down animation-run-infinite mark")):(t.removeClass("btn-primary").addClass("btn-disabled-outline"),t.attr("tabindex","-1"))})),$(document).on("click",".bedrock-server-card .check-to-proceed a.btn",(function(){var e=$(this).closest(".check-to-proceed").find("input[type=checkbox]"),t=e.closest("label.form-check-label");if(!e.is(":checked"))return t.addClass("animation-bounce--down animation-run-infinite mark"),!1})),$(document).on("mouseover",".bedrock-server-card .check-to-proceed label.form-check-label",(function(){$(this).removeClass("animation-bounce--down animation-run-infinite")})),$(document).ready((function(){if($(".event-handrow").length){apiKey=$("#bingapikey").val(),center=$("#bingmapcenter").val(),centerLat=center.split("|")[0],centerLon=center.split("|")[1];var e=document.createElement("script");e.type="text/javascript",e.src="https://www.bing.com/api/maps/mapcontrol?callback=loadMapScenario",document.getElementById("bingMap").appendChild(e)}})),$(document).ready((function(){$(".desktops,.consoles,.devices").on("click","li",(function(e){var t=$(this).attr("data-bg-image");t&&$(".device-selection__edition-details").css("background-image","url("+t+")")}))})),$(document).ready((function(){$(".card .downloadlink").each((function(e){var t=$(this),n=t.attr("href"),a=t.closest(".card").find("label:first"),o=a.find(".form-check-input");t.click((function(e){o.length>0&&!o.prop("checked")&&(e.preventDefault(),e.stopPropagation(),a.addClass("animation-bounce--down animation-run-infinite mark"))})),a.click((function(e){a.removeClass("animation-bounce--down animation-run-infinite mark"),t.attr("tabindex","0"),1==o.prop("checked")?(t.removeClass("btn-disabled-outline").addClass("btn-primary"),t.prop("href",n),t.attr("aria-disabled","false")):(t.addClass("btn-disabled-outline").removeClass("btn-primary"),t.prop("href","#"),t.attr("aria-disabled","true"))}))}))}));var stopProp=!1;function getCookie(e){for(var t=e+"=",n=document.cookie.split(";"),a=0;a<n.length;a++){for(var o=n[a];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}function injectOptimizely(){if(!(window.location.search.indexOf("hideChrome")>0||window.location.href.indexOf("nintendo-switch")>0)&&("undefined"==typeof mscc||mscc.hasConsent())){var e=document.createElement("script");e.type="text/javascript",e.src="//az725175.vo.msecnd.net/scripts/jsll-4.js",document.getElementsByTagName("head")[0].appendChild(e)}}$((function(){var e=$("#event-details-form"),t=$(".binglat").val(),n=$(".binglong").val();e.submit((function(a){if(stopProp)a.preventDefault(),a.stopPropagation();else{var o=$(".startDate").val(),r=$(".startTime").val(),i=$(".endDate").val(),c=$(".endTime").val(),s=$(".timezone").val().split("GMT")[1],l=o+"T"+r+s,d=i+"T"+c+s;$("#utcEnd").val(d),$("#utcStart").val(l),$("#showLocation").is(":checked")&&$("#showLocationHidden").attr("disabled",!0),$("#isPaid").is(":checked")&&$("#isPaidHidden").attr("disabled",!0),t&&n||searchWithZip($(".bingPostalCode").val()),$.ajax({type:e.attr("method"),url:e.attr("action"),data:e.serialize(),success:function(e){$(".alert-success").fadeIn(2e3).fadeOut(2e3)},error:function(){}}),a.preventDefault()}}))})),$(".startDate,.endDate").change((function(){var e=new Date($(".startDate").val()),t=new Date($(".endDate").val()).getTime()-e.getTime();Math.ceil(t/864e5)<0?($("#dateError").removeClass("hide"),stopProp=!0):($("#dateError").addClass("hide"),stopProp=!1)})),$(document).ready((function(){$(".event-handrow").length&&("Yes"==$("#showLoc").val()&&$("#showLocation").attr("checked","checked"),"Yes"==$("#isPaidFormVal").val()&&$("#isPaid").attr("checked","checked"),$(".bingPostalCode").blur((function(){searchWithZip($(".bingPostalCode").val())})))})),function(){var e=function(e){for(var t=e+"=",n=document.cookie.split(";"),a=0;a<n.length;a++){for(var o=n[a];" "==o.charAt(0);)o=o.substring(1,o.length);if(0===o.indexOf(t))return o.substring(t.length,o.length)}return null};createCookieMsgcc=function(e,t,n){var a;if(n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3),a="; expires="+o.toGMTString()}else a="";document.cookie=e+"="+t+a+"; path=/"};var t=function(){return!(void 0!==window.mscc&&"function"==typeof window.mscc.hasConsent&&!window.mscc.hasConsent())};window.msgcc=t()?"granted":"notgranted",e("MSGCC")!=window.msgcc&&createCookieMsgcc("MSGCC",window.msgcc,360),"granted"!=window.msgcc&&$(document).one("mousedown","a, button",(function(){createCookieMsgcc("MSGCC","granted",360),window.msgcc="granted"})),$(window).unload((function(){(window.msgcc=e("MSGCC"),window.msgcc)&&((t()?"granted":"notgranted")!=window.msgcc&&createCookieMsgcc("MSGCC",window.msgcc,360))}))}(),$(document).ready((function(){window.location.search.includes("hideChrome")&&($("main").removeClass("site-body"),$("main").addClass("bg-sand"),$(".hide-chrome-display-content a").each((function(){var e=this.getAttribute("href");$(" <i> &nbsp; "+e+"</i>").insertAfter($(this)),$(this).removeAttr("href")}))),$(".hide-chrome-display-content").show()}));var result,elements=$(".home-hero .hero-outer-wrapper"),parts=window.location.pathname.split("/");if(result=window.location.pathname.indexOf(".html")>0?parts[parts.length-1]:parts[parts.length-2],void 0===Handlebars)var Handlebars="noHandleBar";jQuery(function(e,t){"use strict";var n,a,o=1,r=!0;n={fetchEvents:function(t){var n,i;a=t,t&&(n=t.coords.latitude,i=t.coords.longitude);var c=e("#eventlistingpage").val(),s=e("#eventlistingtag").val();e.ajax({url:c+"/jcr:content.fetchevents.json",type:"get",data:{latitude:n,longitude:i,eventListingTag:s,page:o,count:5},success:function(t){r=!(o>1),function(t){r&&e(".events-container").find(".event").remove();var n=Object.keys(t)[0];n<=5*o?e(".show-more-button").hide():e(".show-more-button").show(),e.each(t[n],(function(t,n){var a,o,r;"noHandleBar"!=Handlebars&&(Handlebars.registerHelper("tickets",(function(){return Granite.I18n.get("TICKETS")})),a=e("#event-item-template").html(),o=Handlebars.compile(a)),r=o(n),e(".events-container").append(r)}))}(t)},error:function(e){console.log("No events present")}})}},e(document).ready((function(){e(".minecon-events").length&&n.fetchEvents()})),e("#position-sort-btn").click((function(){navigator.geolocation&&(o=1,navigator.geolocation.getCurrentPosition(n.fetchEvents))})),e(".show-more-button").click((function(){o+=1,a?n.fetchEvents(a):n.fetchEvents()}))}(jQuery)),$(document).ready((function(){0!=$("#netease-promotion-modal").length&&($("#netease-promotion-modal").closest(".geo-loc-wrapper-edit-content").length>0?$("#netease-promotion-modal").remove():($("#netease-promotion-modal").parents("body").hasClass("modal-open")&&$("#netease-promotion-modal").parents("body").removeClass("modal-open"),$("#netease-promotion-modal").parents("body").addClass("modal-open"),$("#netease-promotion-modal").addClass("show"),$("#popup-btn").on("click",(function(){$("#netease-promotion-modal").find("show"),$("#netease-promotion-modal").removeClass("show"),$("#netease-promotion-modal").parents("body").removeClass("modal-open")}))))}));var platformDownload=$(".platform-download");if(null!==deviceInfo&&void 0!==deviceInfo){var info=deviceInfo;if(info&&platformDownload.length>0){var selector="div.default-platform-text",downloadPlatform=info.downloadPlatform;downloadPlatform&&"none"!==downloadPlatform&&(selector="div.container-"+info.downloadPlatform),platformDownload.find(selector).removeAttr("hidden")}}$(document).ready((function(){$(".aem-GridColumn.text .end-with-block").last().find("p").last().addClass("what-block")})),$(document).ready((function(){if(0==$(".salescounter").length)return;!function(){const e=JSON.stringify({metricKeys:["item_sold_minecraft","prepaid_card_redeemed_minecraft"]});$.get("/content/minecraft-net/_jcr_content.salescounter.json",{salescounterparams:e},(function(e){null!=e.error?console.error(e.errorMessage):null!=e.total&&$(".counter").html(e.total)}))}()})),$((function(){0!=$(".js-scroll-to-top-button").length&&$(".js-scroll-to-top-button").css("transform","translate3d(68px, 0, 0)")})),$(document).ready((function(){$(".sub-heroes-wrapper").find("a").last().removeClass("col-sm-6")}));
