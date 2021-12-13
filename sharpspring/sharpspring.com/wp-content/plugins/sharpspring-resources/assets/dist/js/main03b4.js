/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!********************************************************************************************************************************************************!*\
  !*** C:/Users/gucio/Local Sites/sharpspring/app/public/wp-content/plugins/sharpspring-resources/node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "../../node_modules/@babel/runtime/helpers/createClass.js":
/*!*****************************************************************************************************************************************************!*\
  !*** C:/Users/gucio/Local Sites/sharpspring/app/public/wp-content/plugins/sharpspring-resources/node_modules/@babel/runtime/helpers/createClass.js ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "../../node_modules/stickyfilljs/dist/stickyfill.js":
/*!***********************************************************************************************************************************************!*\
  !*** C:/Users/gucio/Local Sites/sharpspring/app/public/wp-content/plugins/sharpspring-resources/node_modules/stickyfilljs/dist/stickyfill.js ***!
  \***********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
  * Stickyfill – `position: sticky` polyfill
  * v. 2.1.0 | https://github.com/wilddeer/stickyfill
  * MIT License
  */

;(function(window, document) {
    'use strict';
    
    /*
     * 1. Check if the browser supports `position: sticky` natively or is too old to run the polyfill.
     *    If either of these is the case set `seppuku` flag. It will be checked later to disable key features
     *    of the polyfill, but the API will remain functional to avoid breaking things.
     */
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var seppuku = false;
    
    var isWindowDefined = typeof window !== 'undefined';
    
    // The polyfill can’t function properly without `window` or `window.getComputedStyle`.
    if (!isWindowDefined || !window.getComputedStyle) seppuku = true;
    // Dont’t get in a way if the browser supports `position: sticky` natively.
    else {
            (function () {
                var testNode = document.createElement('div');
    
                if (['', '-webkit-', '-moz-', '-ms-'].some(function (prefix) {
                    try {
                        testNode.style.position = prefix + 'sticky';
                    } catch (e) {}
    
                    return testNode.style.position != '';
                })) seppuku = true;
            })();
        }
    
    /*
     * 2. “Global” vars used across the polyfill
     */
    var isInitialized = false;
    
    // Check if Shadow Root constructor exists to make further checks simpler
    var shadowRootExists = typeof ShadowRoot !== 'undefined';
    
    // Last saved scroll position
    var scroll = {
        top: null,
        left: null
    };
    
    // Array of created Sticky instances
    var stickies = [];
    
    /*
     * 3. Utility functions
     */
    function extend(targetObj, sourceObject) {
        for (var key in sourceObject) {
            if (sourceObject.hasOwnProperty(key)) {
                targetObj[key] = sourceObject[key];
            }
        }
    }
    
    function parseNumeric(val) {
        return parseFloat(val) || 0;
    }
    
    function getDocOffsetTop(node) {
        var docOffsetTop = 0;
    
        while (node) {
            docOffsetTop += node.offsetTop;
            node = node.offsetParent;
        }
    
        return docOffsetTop;
    }
    
    /*
     * 4. Sticky class
     */
    
    var Sticky = function () {
        function Sticky(node) {
            _classCallCheck(this, Sticky);
    
            if (!(node instanceof HTMLElement)) throw new Error('First argument must be HTMLElement');
            if (stickies.some(function (sticky) {
                return sticky._node === node;
            })) throw new Error('Stickyfill is already applied to this node');
    
            this._node = node;
            this._stickyMode = null;
            this._active = false;
    
            stickies.push(this);
    
            this.refresh();
        }
    
        _createClass(Sticky, [{
            key: 'refresh',
            value: function refresh() {
                if (seppuku || this._removed) return;
                if (this._active) this._deactivate();
    
                var node = this._node;
    
                /*
                 * 1. Save node computed props
                 */
                var nodeComputedStyle = getComputedStyle(node);
                var nodeComputedProps = {
                    position: nodeComputedStyle.position,
                    top: nodeComputedStyle.top,
                    display: nodeComputedStyle.display,
                    marginTop: nodeComputedStyle.marginTop,
                    marginBottom: nodeComputedStyle.marginBottom,
                    marginLeft: nodeComputedStyle.marginLeft,
                    marginRight: nodeComputedStyle.marginRight,
                    cssFloat: nodeComputedStyle.cssFloat
                };
    
                /*
                 * 2. Check if the node can be activated
                 */
                if (isNaN(parseFloat(nodeComputedProps.top)) || nodeComputedProps.display == 'table-cell' || nodeComputedProps.display == 'none') return;
    
                this._active = true;
    
                /*
                 * 3. Check if the current node position is `sticky`. If it is, it means that the browser supports sticky positioning,
                 *    but the polyfill was force-enabled. We set the node’s position to `static` before continuing, so that the node
                 *    is in it’s initial position when we gather its params.
                 */
                var originalPosition = node.style.position;
                if (nodeComputedStyle.position == 'sticky' || nodeComputedStyle.position == '-webkit-sticky') node.style.position = 'static';
    
                /*
                 * 4. Get necessary node parameters
                 */
                var referenceNode = node.parentNode;
                var parentNode = shadowRootExists && referenceNode instanceof ShadowRoot ? referenceNode.host : referenceNode;
                var nodeWinOffset = node.getBoundingClientRect();
                var parentWinOffset = parentNode.getBoundingClientRect();
                var parentComputedStyle = getComputedStyle(parentNode);
    
                this._parent = {
                    node: parentNode,
                    styles: {
                        position: parentNode.style.position
                    },
                    offsetHeight: parentNode.offsetHeight
                };
                this._offsetToWindow = {
                    left: nodeWinOffset.left,
                    right: document.documentElement.clientWidth - nodeWinOffset.right
                };
                this._offsetToParent = {
                    top: nodeWinOffset.top - parentWinOffset.top - parseNumeric(parentComputedStyle.borderTopWidth),
                    left: nodeWinOffset.left - parentWinOffset.left - parseNumeric(parentComputedStyle.borderLeftWidth),
                    right: -nodeWinOffset.right + parentWinOffset.right - parseNumeric(parentComputedStyle.borderRightWidth)
                };
                this._styles = {
                    position: originalPosition,
                    top: node.style.top,
                    bottom: node.style.bottom,
                    left: node.style.left,
                    right: node.style.right,
                    width: node.style.width,
                    marginTop: node.style.marginTop,
                    marginLeft: node.style.marginLeft,
                    marginRight: node.style.marginRight
                };
    
                var nodeTopValue = parseNumeric(nodeComputedProps.top);
                this._limits = {
                    start: nodeWinOffset.top + window.pageYOffset - nodeTopValue,
                    end: parentWinOffset.top + window.pageYOffset + parentNode.offsetHeight - parseNumeric(parentComputedStyle.borderBottomWidth) - node.offsetHeight - nodeTopValue - parseNumeric(nodeComputedProps.marginBottom)
                };
    
                /*
                 * 5. Ensure that the node will be positioned relatively to the parent node
                 */
                var parentPosition = parentComputedStyle.position;
    
                if (parentPosition != 'absolute' && parentPosition != 'relative') {
                    parentNode.style.position = 'relative';
                }
    
                /*
                 * 6. Recalc node position.
                 *    It’s important to do this before clone injection to avoid scrolling bug in Chrome.
                 */
                this._recalcPosition();
    
                /*
                 * 7. Create a clone
                 */
                var clone = this._clone = {};
                clone.node = document.createElement('div');
    
                // Apply styles to the clone
                extend(clone.node.style, {
                    width: nodeWinOffset.right - nodeWinOffset.left + 'px',
                    height: nodeWinOffset.bottom - nodeWinOffset.top + 'px',
                    marginTop: nodeComputedProps.marginTop,
                    marginBottom: nodeComputedProps.marginBottom,
                    marginLeft: nodeComputedProps.marginLeft,
                    marginRight: nodeComputedProps.marginRight,
                    cssFloat: nodeComputedProps.cssFloat,
                    padding: 0,
                    border: 0,
                    borderSpacing: 0,
                    fontSize: '1em',
                    position: 'static'
                });
    
                referenceNode.insertBefore(clone.node, node);
                clone.docOffsetTop = getDocOffsetTop(clone.node);
            }
        }, {
            key: '_recalcPosition',
            value: function _recalcPosition() {
                if (!this._active || this._removed) return;
    
                var stickyMode = scroll.top <= this._limits.start ? 'start' : scroll.top >= this._limits.end ? 'end' : 'middle';
    
                if (this._stickyMode == stickyMode) return;
    
                switch (stickyMode) {
                    case 'start':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: this._offsetToParent.top + 'px',
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'middle':
                        extend(this._node.style, {
                            position: 'fixed',
                            left: this._offsetToWindow.left + 'px',
                            right: this._offsetToWindow.right + 'px',
                            top: this._styles.top,
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'end':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: 'auto',
                            bottom: 0,
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0
                        });
                        break;
                }
    
                this._stickyMode = stickyMode;
            }
        }, {
            key: '_fastCheck',
            value: function _fastCheck() {
                if (!this._active || this._removed) return;
    
                if (Math.abs(getDocOffsetTop(this._clone.node) - this._clone.docOffsetTop) > 1 || Math.abs(this._parent.node.offsetHeight - this._parent.offsetHeight) > 1) this.refresh();
            }
        }, {
            key: '_deactivate',
            value: function _deactivate() {
                var _this = this;
    
                if (!this._active || this._removed) return;
    
                this._clone.node.parentNode.removeChild(this._clone.node);
                delete this._clone;
    
                extend(this._node.style, this._styles);
                delete this._styles;
    
                // Check whether element’s parent node is used by other stickies.
                // If not, restore parent node’s styles.
                if (!stickies.some(function (sticky) {
                    return sticky !== _this && sticky._parent && sticky._parent.node === _this._parent.node;
                })) {
                    extend(this._parent.node.style, this._parent.styles);
                }
                delete this._parent;
    
                this._stickyMode = null;
                this._active = false;
    
                delete this._offsetToWindow;
                delete this._offsetToParent;
                delete this._limits;
            }
        }, {
            key: 'remove',
            value: function remove() {
                var _this2 = this;
    
                this._deactivate();
    
                stickies.some(function (sticky, index) {
                    if (sticky._node === _this2._node) {
                        stickies.splice(index, 1);
                        return true;
                    }
                });
    
                this._removed = true;
            }
        }]);
    
        return Sticky;
    }();
    
    /*
     * 5. Stickyfill API
     */
    
    
    var Stickyfill = {
        stickies: stickies,
        Sticky: Sticky,
    
        forceSticky: function forceSticky() {
            seppuku = false;
            init();
    
            this.refreshAll();
        },
        addOne: function addOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) node = node[0];else return;
            }
    
            // Check if Stickyfill is already applied to the node
            // and return existing sticky
            for (var i = 0; i < stickies.length; i++) {
                if (stickies[i]._node === node) return stickies[i];
            }
    
            // Create and return new sticky
            return new Sticky(node);
        },
        add: function add(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) nodeList = [nodeList];
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) return;
    
            // Add every element as a sticky and return an array of created Sticky instances
            var addedStickies = [];
    
            var _loop = function _loop(i) {
                var node = nodeList[i];
    
                // If it’s not an HTMLElement – create an empty element to preserve 1-to-1
                // correlation with input list
                if (!(node instanceof HTMLElement)) {
                    addedStickies.push(void 0);
                    return 'continue';
                }
    
                // If Stickyfill is already applied to the node
                // add existing sticky
                if (stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        addedStickies.push(sticky);
                        return true;
                    }
                })) return 'continue';
    
                // Create and add new sticky
                addedStickies.push(new Sticky(node));
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                var _ret2 = _loop(i);
    
                if (_ret2 === 'continue') continue;
            }
    
            return addedStickies;
        },
        refreshAll: function refreshAll() {
            stickies.forEach(function (sticky) {
                return sticky.refresh();
            });
        },
        removeOne: function removeOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) node = node[0];else return;
            }
    
            // Remove the stickies bound to the nodes in the list
            stickies.some(function (sticky) {
                if (sticky._node === node) {
                    sticky.remove();
                    return true;
                }
            });
        },
        remove: function remove(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) nodeList = [nodeList];
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) return;
    
            // Remove the stickies bound to the nodes in the list
    
            var _loop2 = function _loop2(i) {
                var node = nodeList[i];
    
                stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        sticky.remove();
                        return true;
                    }
                });
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                _loop2(i);
            }
        },
        removeAll: function removeAll() {
            while (stickies.length) {
                stickies[0].remove();
            }
        }
    };
    
    /*
     * 6. Setup events (unless the polyfill was disabled)
     */
    function init() {
        if (isInitialized) {
            return;
        }
    
        isInitialized = true;
    
        // Watch for scroll position changes and trigger recalc/refresh if needed
        function checkScroll() {
            if (window.pageXOffset != scroll.left) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                Stickyfill.refreshAll();
            } else if (window.pageYOffset != scroll.top) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                // recalc position for all stickies
                stickies.forEach(function (sticky) {
                    return sticky._recalcPosition();
                });
            }
        }
    
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    
        // Watch for window resizes and device orientation changes and trigger refresh
        window.addEventListener('resize', Stickyfill.refreshAll);
        window.addEventListener('orientationchange', Stickyfill.refreshAll);
    
        //Fast dirty check for layout changes every 500ms
        var fastCheckTimer = void 0;
    
        function startFastCheckTimer() {
            fastCheckTimer = setInterval(function () {
                stickies.forEach(function (sticky) {
                    return sticky._fastCheck();
                });
            }, 500);
        }
    
        function stopFastCheckTimer() {
            clearInterval(fastCheckTimer);
        }
    
        var docHiddenKey = void 0;
        var visibilityChangeEventName = void 0;
    
        if ('hidden' in document) {
            docHiddenKey = 'hidden';
            visibilityChangeEventName = 'visibilitychange';
        } else if ('webkitHidden' in document) {
            docHiddenKey = 'webkitHidden';
            visibilityChangeEventName = 'webkitvisibilitychange';
        }
    
        if (visibilityChangeEventName) {
            if (!document[docHiddenKey]) startFastCheckTimer();
    
            document.addEventListener(visibilityChangeEventName, function () {
                if (document[docHiddenKey]) {
                    stopFastCheckTimer();
                } else {
                    startFastCheckTimer();
                }
            });
        } else startFastCheckTimer();
    }
    
    if (!seppuku) init();
    
    /*
     * 7. Expose Stickyfill
     */
    if ( true && module.exports) {
        module.exports = Stickyfill;
    } else if (isWindowDefined) {
        window.Stickyfill = Stickyfill;
    }
    
})(window, document);

/***/ }),

/***/ "./images/services/facebook.svg":
/*!**************************************!*\
  !*** ./images/services/facebook.svg ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/facebook.svg");

/***/ }),

/***/ "./images/services/linkedin.svg":
/*!**************************************!*\
  !*** ./images/services/linkedin.svg ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/linkedin.svg");

/***/ }),

/***/ "./images/services/mail.svg":
/*!**********************************!*\
  !*** ./images/services/mail.svg ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/mail.svg");

/***/ }),

/***/ "./images/services/twitter.svg":
/*!*************************************!*\
  !*** ./images/services/twitter.svg ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/twitter.svg");

/***/ }),

/***/ "./images/share.svg":
/*!**************************!*\
  !*** ./images/share.svg ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/share.svg");

/***/ }),

/***/ "./images/sharpsring_logo_black.png":
/*!******************************************!*\
  !*** ./images/sharpsring_logo_black.png ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/sharpsring_logo_black.png");

/***/ }),

/***/ "./js/components/goto.ts":
/*!*******************************!*\
  !*** ./js/components/goto.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./js/utils/index.ts");
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



var isHTMLElement = function isHTMLElement(element) {
  return !!element;
};

var HIDDEN_CLASS = 'is-hidden';
/**
 * Handles Go To Form button behavior.
 *
 * @param button
 * @param form
 * @param mobileOnly
 * @param position
 */

var goto = function goto() {
  var button = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('.go-to-form');
  var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.querySelector('.ssr-form-wrap.mobile');
  var mobileOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'top';

  if (!document.body.classList.contains('resource-template-ssr')) {
    return;
  }

  if (!isHTMLElement(button) || !isHTMLElement(form)) {
    return;
  }

  var _isMobile = function _isMobile() {
    return window.getComputedStyle(form).display === 'block';
  };

  var isMobile = _isMobile();

  var handleResize = Object(lodash__WEBPACK_IMPORTED_MODULE_0__["debounce"])(function () {
    isMobile = _isMobile();
  }, 250);

  var domContentLoaded = function domContentLoaded() {
    var formTop = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getPosition"])(form).y;
    var halfVH = window.innerHeight / 2;
    var threshold = 'top' === position ? formTop - halfVH : formTop + halfVH;

    var handleClick = function handleClick() {
      if (mobileOnly && !isMobile) {
        return;
      }

      window.scrollTo({
        behavior: 'smooth',
        top: formTop
      });
    };

    var handleScroll = function handleScroll() {
      if (mobileOnly && !isMobile) {
        return;
      }

      if (('top' === position && window.scrollY > threshold || 'bottom' === position && window.scrollY < threshold) && !button.classList.contains(HIDDEN_CLASS)) {
        button.classList.add(HIDDEN_CLASS);
      } else if (('top' === position && window.scrollY < threshold || 'bottom' === position && window.scrollY > threshold) && button.classList.contains(HIDDEN_CLASS)) {
        button.classList.remove(HIDDEN_CLASS);
      }
    };

    button.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
  };

  window.addEventListener('resize', handleResize);
  document.addEventListener('DOMContentLoaded', domContentLoaded);
};

/* harmony default export */ __webpack_exports__["default"] = (goto);

/***/ }),

/***/ "./js/components/index.ts":
/*!********************************!*\
  !*** ./js/components/index.ts ***!
  \********************************/
/*! exports provided: Popup, goto, stickyForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup */ "./js/components/popup.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Popup", function() { return _popup__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _goto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./goto */ "./js/components/goto.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "goto", function() { return _goto__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _sticky_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sticky-form */ "./js/components/sticky-form.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stickyForm", function() { return _sticky_form__WEBPACK_IMPORTED_MODULE_2__["default"]; });





/***/ }),

/***/ "./js/components/popup.ts":
/*!********************************!*\
  !*** ./js/components/popup.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Popup; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "../../node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "../../node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);



var Popup = /*#__PURE__*/function () {
  function Popup(slug) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Popup);

    this.slug = slug;
    this.popup = document.querySelector(".".concat(this.slug));
    this.btn = document.querySelector(".".concat(this.slug, "-btn"));
    this.closeBtn = document.querySelector('.ssr-close-btn');

    if (!this.popup || !this.btn || !this.closeBtn) {
      return;
    }

    this.btn.addEventListener('click', this.openPopup.bind(this));
    this.closeBtn.addEventListener('click', this.closePopup.bind(this));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Popup, [{
    key: "openPopup",
    value: function openPopup(e) {
      e.preventDefault();
      document.documentElement.style.overflow = 'hidden';
      this.popup.classList.add('ssr-is-active');
    }
  }, {
    key: "closePopup",
    value: function closePopup(e) {
      e.preventDefault();
      document.documentElement.style.overflow = '';
      this.popup.classList.remove('ssr-is-active');
    }
  }]);

  return Popup;
}();



/***/ }),

/***/ "./js/components/sticky-form.ts":
/*!**************************************!*\
  !*** ./js/components/sticky-form.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _goto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./goto */ "./js/components/goto.ts");

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var form = document.querySelector('.ssr-form-content.position-sticky');

  if (!form) {
    return;
  }

  var button = document.querySelector('.go-to-form-desktop');

  if (button) {
    Object(_goto__WEBPACK_IMPORTED_MODULE_0__["default"])(button, form, false, 'bottom');
  }

  var adjust = function adjust() {
    var _window$getComputedSt = window.getComputedStyle(form),
        top = _window$getComputedSt.top,
        marginBottom = _window$getComputedSt.marginBottom;

    var minWindowHeight = form.clientHeight + parseInt(top) + parseInt(marginBottom);

    if (minWindowHeight > window.innerHeight && !form.classList.contains('is-static')) {
      form.classList.add('is-static');
      button.classList.remove('disabled');
    } else if (minWindowHeight < window.innerHeight && form.classList.contains('is-static')) {
      form.classList.remove('is-static');
      button.classList.add('disabled');
    }
  };

  window.addEventListener('DOMContentLoaded', adjust);
  window.addEventListener('resize', adjust);
});

/***/ }),

/***/ "./js/main.ts":
/*!********************!*\
  !*** ./js/main.ts ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var stickyfilljs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stickyfilljs */ "../../node_modules/stickyfilljs/dist/stickyfill.js");
/* harmony import */ var stickyfilljs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(stickyfilljs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./js/utils/index.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./js/components/index.ts");
/* harmony import */ var _images_services_facebook_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../images/services/facebook.svg */ "./images/services/facebook.svg");
/* harmony import */ var _images_services_linkedin_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../images/services/linkedin.svg */ "./images/services/linkedin.svg");
/* harmony import */ var _images_services_mail_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../images/services/mail.svg */ "./images/services/mail.svg");
/* harmony import */ var _images_services_twitter_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../images/services/twitter.svg */ "./images/services/twitter.svg");
/* harmony import */ var _images_share_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../images/share.svg */ "./images/share.svg");
/* harmony import */ var _images_sharpsring_logo_black_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../images/sharpsring_logo_black.png */ "./images/sharpsring_logo_black.png");
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */









stickyfilljs__WEBPACK_IMPORTED_MODULE_0___default.a.add(document.querySelectorAll('.position-sticky'));
Object(_utils__WEBPACK_IMPORTED_MODULE_1__["fixOverflow"])();
Object(_components__WEBPACK_IMPORTED_MODULE_2__["goto"])();
Object(_components__WEBPACK_IMPORTED_MODULE_2__["stickyForm"])();
new _components__WEBPACK_IMPORTED_MODULE_2__["Popup"]('ssr-resource-popup');

/***/ }),

/***/ "./js/utils/index.ts":
/*!***************************!*\
  !*** ./js/utils/index.ts ***!
  \***************************/
/*! exports provided: fixOverflow, getPosition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixOverflow", function() { return fixOverflow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPosition", function() { return getPosition; });
var fixOverflow = function fixOverflow() {
  var body = document.querySelector('body.resource-template-ssr');

  if (body) {
    body.style.overflow = 'visible';
    body.parentNode.style.overflow = 'visible';
  }
};
var getPosition = function getPosition(element) {
  var positionX = 0;
  var positionY = 0;

  while (element) {
    positionX += element.offsetLeft - element.scrollLeft + element.clientLeft;
    positionY += element.offsetTop - element.scrollTop + element.clientTop;
    element = element.offsetParent;
  }

  return {
    x: positionX,
    y: positionY
  };
};

/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./js/main.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\gucio\Local Sites\sharpspring\app\public\wp-content\plugins\sharpspring-resources\assets\src\js\main.ts */"./js/main.ts");


/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["lodash"]; }());

/***/ })

/******/ });
//# sourceMappingURL=main.js.map