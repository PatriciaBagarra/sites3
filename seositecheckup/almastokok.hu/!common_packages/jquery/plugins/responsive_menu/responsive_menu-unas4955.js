(function($){
	
	$.fn.responsive_menu = function(options) {  

		return this.each(function() { 
		
			var obj=$(this);
			if(obj.data('resp_menu')) return;
			var resp_menu = new my_responsive_menu(this, options);
			obj.data('resp_menu', resp_menu);
		});  
	};  

	var my_responsive_menu = function(object, options) {

		var main_menu_num=0;

		var obj = $(object);
		var content_obj = $(obj.parent());
		var menu_obj = obj.parents(".responsive_menu:first");
		var act_ul_obj=obj;
		var act_level=0;
		var obj_width=0;
		
		var defaults = {
			
			next_menu_div: "next_level_arrow",

			active_menu_div: "active_menu",	
			
			menu_id: "responsive_cat_menu",
			
			jumt_to_act: true,

			////////////////////////////////////////////////////
			
			ajax_param_div: ".ajax_param", 
			
			ajax_param_str: "param1|param2|param3",
			
			ajax_menu_num_nil: "[menu_num_nil]", 
			
			ajax_type: "POST",
			
			ajax_cache: false,
			
			ajax_url: "",
			
			ajax_data: "",

            scroll_top: "",
		};  
		var options = $.extend(defaults, options);

		var ajax_request = function(nl, options, cat_param_arr, my_event) {
			
			var next_level_obj = $(nl);
			
			var data='';
			$.each(cat_param_arr, function(key, value){ data+='&'+key+'='+value; });
	
			$.ajax({
				type: options.ajax_type,
				cache: options.ajax_cache,		
				url: options.ajax_url,
				data: options.ajax_data+data,
				success: function(result){
					if(result!="") {
						if(result==options.ajax_menu_num_nil) {
							next_level_obj.remove();
						} else {
							next_level_obj.html(result);
							next_level_obj.addClass("ul_level_"+act_level);
							show_next_level(next_level_obj, my_event);			
						}
					}
				}
			});
	
		}
		
		var set_cat_info = function() {

			var responsive_menu_navbottom=$(menu_obj.find(".responsive_menu_navbottom:first"));
			
			if(act_level<1) {
				responsive_menu_navbottom.html("");
				responsive_menu_navbottom.hide();
			} else {
			
				var hierarchy_arr=new Array();
				var act_while_obj = act_ul_obj;
				var while_control = (act_while_obj.parent().hasClass("responsive_menu_item")) ? true : false;

				while(while_control) {
					
					var while_a_obj=$(act_while_obj.parent().find("a:first"));
					hierarchy_arr.push("<a href='"+while_a_obj.attr("href")+"'>"+while_a_obj.html()+"</a>");
					act_while_obj = $(act_while_obj.parents("ul:first"));
					while_control = (act_while_obj.parent().hasClass("responsive_menu_item")) ? true : false;
				}
			
				hierarchy_arr.reverse();
                var hierarchy_str=' <span class="maincat parentcat" id="parent_level_0">.. / </span>';
				var parent_span=false;
				for(var i=0;i<hierarchy_arr.length;i++) { 
					if(i+1 != hierarchy_arr.length) {
						hierarchy_str+='<span class="parentcat" id="parent_level_'+(i+1)+'">'+hierarchy_arr[i]+'</span><span class="parent_div">&nbsp;&nbsp;&raquo;&nbsp;&nbsp;</span>';
					} else {
						hierarchy_str+='<span class="actcat"';
						if (act_ul_obj.parent().attr("id")!=undefined) hierarchy_str+=' id="'+act_ul_obj.parent().attr("id")+'_actual"';
                        hierarchy_str+='>'+hierarchy_arr[i]+'</span>';
						parent_span=true;
					}
				}

				responsive_menu_navbottom.html(hierarchy_str);
				if(hierarchy_str!="") { 
					responsive_menu_navbottom.show(); 				
					if(parent_span && obj.data("parentcat")!="done") {
						obj.data("parentcat", "done");
						$('#responsive_cat_menu').on("click", "span.parentcat", function() { jump_to_a_specific_level($(this).attr("id").replace(/parent_level_/g,"")); });
					}
				} else { 
					responsive_menu_navbottom.hide(); 
				}
				
			}

            hide_list_items();
			
		}

		var set_start_position = function() {
			
			var active_menu_bool=false;
			var active_menu_a={};
			$("li",act_ul_obj).each(function() {
				if($(this).hasClass("active_menu")) {
					active_menu_bool=true;
					active_menu_a=$(this).find("a:first");
				}
			});
			
			if(active_menu_bool) get_new_level(active_menu_a, "init");
		}
		
		var jump_to_a_specific_level = function(level) {
			
			var target_obj=$(act_ul_obj.parents("ul:first"));
			target_obj.hide();
			if(!target_obj.hasClass("ul_level_"+level)) {
				var while_control = true;
				while(while_control) {
					target_obj = $(target_obj.parents("ul:first"));
					target_obj.hide();
					while_control = (!target_obj.hasClass("ul_level_"+level)) ? true : false;
					if(!target_obj.hasClass("responsive_menu_sub")) break;
				}	
			}
			
			target_obj.show();
			set_content_height(target_obj);
			
			act_level=level;
			var left_pos=obj_width*act_level;
			left_pos=(left_pos==0) ? 0 : "-"+left_pos;
			
			obj.stop().animate({ left: left_pos+"%" }, 150, function() {
				act_ul_obj.hide();	
				act_ul_obj=target_obj;
				set_cat_info();
			});
			
			if(act_level<1) menu_obj.removeClass("black_active");
		}
		
		var set_new_level = function(next_level_obj) {
			
			$("ul",act_ul_obj).each(function() { $(this).hide(); });

			next_level_obj.show();
			next_level_obj.css("z-index",(10*act_level));	
			var li_size= $("li",next_level_obj).length;

			$("li",next_level_obj).each(function(li_num) {
				
					var class_str="";
					if($(this).hasClass(options.active_menu_div)) class_str+=options.active_menu_div;
					if(li_size==(li_num+1)) class_str+=" last_menu_item";	
					if($(this).find('> .'+options.next_menu_div).length > 0) class_str+=" nl_arrow";
					class_str+=" responsive_menu_item";
					//$(this).attr("class",class_str);
                	$(this).addClass(class_str);
					if($(this).find('> .'+options.next_menu_div).length > 0) $(this).append('<ul class="responsive_menu_sub">[closed_menu]</ul>');
			});
			
			set_content_height(next_level_obj);
		}

		var set_content_height = function(my_obj) {
            setTimeout(function() {
                content_obj.animate({"height": my_obj.height()},200);
            }, 200);
            setTimeout(function() {
                content_obj.animate({"height": my_obj.height()},200);
            }, 400);
		}
		
		var show_next_level = function(next_level_obj, my_event) {
		
			set_new_level(next_level_obj);

			var left_pos=obj_width*act_level;
			var speed=(my_event=="init") ? 0 : 150;
			obj.stop().animate({ left:"-"+left_pos+"%" }, speed, function() {
				
				act_ul_obj=next_level_obj;
				set_cat_info();
				if(my_event=="init") set_start_position();
				
			});
			
			menu_obj.addClass("black_active");
	
		}
		
		var show_prev_level = function() {

			var prev_level_obj=$(act_ul_obj.parents("ul:first"));
            $(prev_level_obj).find("li").css("display","block");
            $(prev_level_obj).find("li").removeClass("actual_parent");
			prev_level_obj.show();
			set_content_height(prev_level_obj);
		
			act_level--;
			var left_pos=obj_width*act_level;
			left_pos=(left_pos==0) ? 0 : "-"+left_pos;

			obj.stop().animate({ left: left_pos+"%" }, 150, function() {
				act_ul_obj.hide();	
				act_ul_obj=prev_level_obj;
				set_cat_info();
			});
			
			if(act_level<1) menu_obj.removeClass("black_active");
		}

		var get_new_level = function(a, my_event) {
			
			var a_obj=$(a);
			var li_obj=$(a_obj.parent());
			var end_category=(li_obj.find('> .'+options.next_menu_div).length > 0) ? 0 : 1;
			
			if(end_category!=1 && (options.not_end_category_load!="yes" || my_event=="init")) {
				
				var next_level_obj=$(li_obj.find('ul.responsive_menu_sub:first'));
				var first_time=(next_level_obj.html()=="[closed_menu]") ? true : false;
				var act_level_obj=$(li_obj.parent());	
				act_level=(act_level_obj.parents("ul").length+1);

				//first time
				if(first_time) {
					
					//param
					var ajax_param_div_t=li_obj.find(options.ajax_param_div).html().split("|");
					var ajax_param_str_t=options.ajax_param_str.split("|");
					
					var ajax_param_arr_t='';
					for(var param_i=0;param_i<ajax_param_div_t.length;param_i++) {
						if(ajax_param_arr_t!='') ajax_param_arr_t+=", ";
						ajax_param_arr_t += "'"+ajax_param_str_t[param_i]+"':"+ajax_param_div_t[param_i];
					}
					var cat_param_arr=eval('('+"{"+ajax_param_arr_t+"}"+')');
					
					next_level_obj.html('<div class="cat_loading"></div>');
					ajax_request(next_level_obj, options, cat_param_arr, my_event);
					
				} else {
				
					show_next_level(next_level_obj);
				}
		
			} else {
				if(my_event!="init") document.location.href=a_obj.attr("href");
			}
			
		}

		var add_events = function() {
			
			//next
			$('#responsive_cat_menu').on("click", "a.resp_clickable", function() {

                $(this).parent().addClass("actual_parent");
				get_new_level(this, "clicked");
				if (options.scroll_top!="no") {
                	$('html, body').animate({
                	    scrollTop: $("#responsive_cat_menu").offset().top
                	}, 500);
                    $('#responsive_cat_menu').scrollTop(0);
                }

				return false;
			});	
			
			//prev
			menu_obj.find(".responsive_menu_back").click(function() {
			
				if(menu_obj.hasClass("black_active")) show_prev_level();	
			});	
			
			//hover
            $('#responsive_cat_menu').on("mouseenter","ul.responsive_menu li",function () { $(this).addClass("li_hover"); });
            $('#responsive_cat_menu').on("mouseleave","ul.responsive_menu li",function () { $(this).removeClass("li_hover"); });

			//close
			menu_obj.find(".responsive_menu_close").click(function() { responsive_cat_menu(); });
			//$("#center").click(function() { responsive_cat_menu(); });
			//$("#footer").click(function() { responsive_cat_menu(); });
			//$("#provider").click(function() { responsive_cat_menu(); });
			
		};


		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// init
		obj.show();

		main_menu_num=$("li",obj).length;
		var start_position_bool=false;
		obj.attr("class","responsive_menu");
        $("ul.responsive_menu").addClass("ul_level_0");
		$("li",obj).each(function(li_num) {
			
			var class_str="";
			if($(this).hasClass(options.active_menu_div)) {
				class_str+=options.active_menu_div+" responsive_menu_item resp_main_menu_item resp_main_menu_"+(li_num+1);
				$(this).find('a:first').addClass(options.active_menu_div+'_a');
				if(options.jumt_to_act) start_position_bool=true;
			} else {
				class_str+="responsive_menu_item resp_main_menu_item resp_main_menu_"+(li_num+1);
			}
			if($(this).find('> .'+options.next_menu_div).length > 0) class_str+=" nl_arrow";
			//$(this).attr("class",class_str);
            $(this).addClass(class_str);

			$(this).append('<ul class="responsive_menu_sub">[closed_menu]</ul>');
		});
		
		if(options.ajax_url!="" && options.ajax_data!="") {	
			setTimeout(function() {
				set_content_height(obj);
				//obj_width=obj.width()
                obj_width=100;
				add_events();
				if(start_position_bool) set_start_position();
			}, 100);
		} else {
			alert('multilevel_menu - Az ajax híváshoz szükséges még az "ajax_url" és a "ajax_data" konfigurálása!');	
		}

	};
 
})(jQuery);

function hide_list_items(){
    //Remove all parent list items except actual
    var act = $("#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu").css("left");
    switch(act){
        case "-384px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li:not(.actual_parent)').css("display","none");
            break;
        case "-768px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li:not(.actual_parent)').css("display","none");
            break;
        case "-1152px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li:not(.actual_parent)').css("display","none");
            break;
        case "-1536px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li:not(.actual_parent)').css("display","none");
            break;
        case "-1920px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li:not(.actual_parent)').css("display","none");
            break;
        case "-2304px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li ul.ul_level_5 > li:not(.actual_parent)').css("display","none");
            break;
        case "-2688px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li ul.ul_level_5 > li ul.ul_level_6 > li:not(.actual_parent)').css("display","none");
            break;
        case "-3072px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li ul.ul_level_5 > li ul.ul_level_6 > li ul.ul_level_7 > li:not(.actual_parent)').css("display","none");
            break;
        case "-3456px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li ul.ul_level_5 > li ul.ul_level_6 > li ul.ul_level_7 > li ul.ul_level_8 > li:not(.actual_parent)').css("display","none");
            break;
        case "-3840px":
            $('#responsive_cat_menu_content .responsive_menu_content ul.responsive_menu > li ul.ul_level_1 > li ul.ul_level_2 > li ul.ul_level_3 > li ul.ul_level_4 > li ul.ul_level_5 > li ul.ul_level_6 > li ul.ul_level_7 > li ul.ul_level_8 > li ul.ul_level_9 > li:not(.actual_parent)').css("display","none");
            break;
    }
}