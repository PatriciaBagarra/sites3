/*
 * Async Treeview 0.1 - Lazy-loading extension for Treeview
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

;(function($) {

function load(settings, root, child, container) {
	function createNode(data) {
		var current = $("<li/>").attr("id", data.id || "").html("<span>" + data.text + "</span>").appendTo(this);
		if (data.classes) {
			current.children("span").addClass(data.classes);
		}
		if (data.expanded) {
			current.addClass("open");
		}
		if (data.hasChildren || data.children && data.children.length) {
			var branch = $("<ul/>").appendTo(current);
			if (data.hasChildren) {
				current.addClass("hasChildren");
				createNode.call(branch, {
					classes: "placeholder",
					text: "&nbsp;",
					children:[]
				});
			}
			if (data.children && data.children.length) {
				data.children.forEach(createNode, branch);
				//$.each(data.children, createNode, [branch])
			}
		}
	}
	$.ajax($.extend(true, {
		url: settings.url,
		dataType: "json",
		data: {
			root: root
		},
		success: function(response) {
			child.empty();
			response.forEach(createNode, child);
			//$.each(response, createNode, [child]);
	        $(container).treeview({add: child});
	    }
	}, settings.ajax));
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	if (!container.children().length)
		load(settings, "source", this, container);
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				load(settings, this.id, childList, container);
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
};

})(jQuery);