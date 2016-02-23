var startDate, endDate = '';
var dateSelectionChoice = [];
var today  =  new Date();
var page = 1;
var scroll_lock=false;
var waiting_for_ajax_response=false;
var hours = new Date().getHours();
var items_per_page = 15;
var sort_order = 'ASC';
var catSelected = [];
var searchTerm = '';
var isSinglePage = false;
var currentEvents = [];


var apiArguments = {
	'category':'',
	'city':'',
	'start_date':'',
	'end_date':'',
	'tags':'',
	'subcats':'',
	'where':'',
	'sort_by':'',
	'sort_order':'',
	'items_per_page':'',
	'page':'',
	'has':'',
	'except':'',
	'time':'all',	
	'start_before':'',
	'start_after':'',
};

var where = [];
var subcat = [];
var showmap = false;
(function($) {
$(document).ready(function(){

	if(showmap){
		$("#google_map_toggle").css({'height':'50px'});
		$("#google_map_toggle").attr('title', 'Click to Close Map');	
		$("#wazaap_map").css({'position':'relative','left':'0','top':'0','width':'990px'});
	}
	else{
		$("#google_map_toggle").css({'height':'40px'});
		$("#google_map_toggle").attr('title', 'Click to Open Map');
	}
		  		  
	//Select the the text form the textfield.
		
	$("#event_url").focusin(
		function(){
		  this.select();
		});
		
	$("#event_url").mouseup(
		function(){
		if (this.select()== true){
		  this.select();
		  }
		});
	
//Related Events Slider
	if($("#slider_container").length){

		// Declare variables
		var totalImages = $("#slider_container > li").length,
		imageWidth = $("#slider_container > li:first").outerWidth(true),
		totalWidth = imageWidth * totalImages,
		visibleImages = Math.round(jQuery(".rel-eve").width() / imageWidth),
		visibleWidth = visibleImages * imageWidth;
		stopPosition = (visibleWidth - totalWidth);

		jQuery("#slider_container").width(totalWidth);

		jQuery("#prevId").click(function(){
			if(jQuery("#slider_container").position().left < 0 && !jQuery("#slider_container").is(":animated")){
				jQuery("#slider_container").animate({left : "+=" + imageWidth + "px"});
			}else{
				jQuery("#slider_container").animate({left : "+=15px"},200,function(){
					jQuery("#slider_container").animate({left : "-=15px"},300);
				});
			}
			return false;
		});

		jQuery("#nextBtn").click(function(){
			if(jQuery("#slider_container").position().left > (stopPosition+23) && !jQuery("#slider_container").is(":animated")){
				jQuery("#slider_container").animate({left : "-=" + imageWidth + "px"});
			}else{
				jQuery("#slider_container").animate({left : "-=15px"},200,function(){
					jQuery("#slider_container").animate({left : "+=15px"},300);
				});
			}
		return false;
		});
	}	
		  

	 $("#new_custom_tag").keypress(function(e){
	 	if((e.which || e.keyCode)==13){
	 		$('#add_custom_tag').click();
	 	}
	 })

	$("user_invite_popup").click(function(){
		lightbox();	
	})	
	$('#add_custom_tag').click(function(){
		var ajaxflag = true;
		url = WEBADDR + "/wp-admin/admin-ajax.php";
		var data = {action: 'iajax_save', postid: $(".tag_info_custom").attr('data-postid'), tags:$(".tag_info_custom").attr('data-oldtags'), newtags:$("#new_custom_tag").val()}
		$("#no_tags_present").hide();
		old_tags = data['tags'].split(",");

		$.each(old_tags, function(k,v){
			if($("#new_custom_tag").val() == v){
				ajaxflag = false;
				$("#add_custom_tag").fadeOut(function(){
					$("#add_custom_tag").text("Tag Already Exists").fadeIn(function(){
						$("#add_custom_tag").delay(1000).fadeOut(function(){
							$("#add_custom_tag").text("Add New Tag").fadeIn()
						})
					});
				})
				return false;
			}
		})
			
		if(ajaxflag)
		{
			if($("#new_custom_tag") != "")
			{
				$.post( url, data, function(message){
					var temp = '<div class="single_tag"><div class="img"></div><div class="tag_info"><input type="checkbox" name="" value="" placeholder="">'+$("#new_custom_tag").val()+'</div></div>'
					$("#last_single_tag").before(temp);			
					$("#add_custom_tag").fadeOut(function(){
						$("#add_custom_tag").text("Added").fadeIn(function(){
							$("#add_custom_tag").delay(500).fadeOut(function(){
								$("#add_custom_tag").text("Add New Tag").fadeIn()
							})
						});
					})
					$("#new_custom_tag").val('')					
				});
			}
		}
	
		return false;
	})

		if($("#wazaap_login_pop").length)
		$("#wazaap_login_pop").center();

		$(document).click(function(){
			if($("#sort_events ul").is(":visible")){
				$("#sort_events a").click();
			}
		})

		$("#sort_events").click(function() {
			return false;
		})

		var flag = true;
		
		$.each($("div.menu-wazaap-filter-container > ul > li > a"), function(k,v){
			//ASH: ensure no dupes in the cat array
			if(jQuery.inArray($(this).attr("title"), catSelected) == -1)
				catSelected.push($(this).attr("title"))
		})
		
		apiArguments['category'] = catSelected.join(",").toLowerCase();

		if(searchTerm){
        	$("#wazaap_search").val(searchTerm);
        	searchterms(searchTerm, 13);
      	} 

		$("div.event_socialshare div.email").live('click', function(){			
			if(isLoggedIn){		
				postid = $(this).attr("data-postid");				
				$("#post_idh").val(postid);
				email_share_box($(this));
			}
			else
			{
				lightbox();
			}
		})
		
		if(isSinglePage)
		{			
			$(".email").click(function(){
				if(isLoggedIn){
					postid = $(this).attr("data-postid");				
					$("#post_idh").val(postid);
					email_share_box($(this));
				}
				else
				{
					lightbox();
				}
				
			});
		}
		
		
		$(".sendinvite").click(function(){				
				sendinvites_mail();
		})
		
		$("a.likes").live("click", function(){
					
		})

		/*$("#invite_text").click(function(){

			$("#invite_friends").center();

			$("#black_overlay").fadeIn(150, function(){
				$("#invite_friends").fadeIn();
			});


			$(document).keypress(function(e){
				var code = e.keyCode || e.which;
				if(code==27){
					$("#black_overlay").click();
				}
			})
			
			$("#black_overlay, #close_loginpopup").click(function(){
				$("#invite_friends").fadeOut(150,function(){
					$("#black_overlay").fadeOut();
					$("#black_overlay").unbind('click');
					$(document).unbind('keypress');
				});
			})
			
			$("#invite_friends").click(function(){
				return false;
			})
			
			
		})
		*/
		if(showmap){
			$("#google_map_toggle").toggle(function(){
						$(this).css({'height':'40px'});
						$(this).attr('title', 'Click to Open Map');
						$("#wazaap_map").slideToggle('slow');
					
					}, function(){
						$(this).css({'height':'50px'});	
						$(this).attr('title', 'Click to Close Map');
						$("#wazaap_map").css({'position':'relative','left':'0','top':'0','display':'none'});
						$("#wazaap_map").slideToggle('slow');
			
					});
		}
		else{
			$("#google_map_toggle").toggle(function(){
				$(this).css({'height':'50px'});	
				$(this).attr('title', 'Click to Close Map');
				$("#wazaap_map").css({'position':'relative','left':'0','top':'0','display':'none'});
				$("#wazaap_map").slideToggle('slow');			
			}, function(){				
				$(this).css({'height':'40px'});
				$(this).attr('title', 'Click to Open Map');
				$("#wazaap_map").slideToggle('slow');	
			});			
		}

		$("div.event_socialshare .tweetevent").live('click',function(){
			paren = $(this).parent().parent().parent();
			title = paren.find(".data-title").val();
			summary = (paren.find(".data-summary").val()== 'undefined')?'':paren.find(".data-summary").val();
			url1 = paren.find(".data-url").val();
			short_url = (paren.find(".data-short").val() == 'undefined')?'':paren.find(".data-url").val();
			url = "https://twitter.com/share?original_referer="+WEBADDR+"&source=tweetbutton&text="+title+"-"+summary+"&url="+short_url+"&via=wazaap_in";
			url =  encodeURI(url);
			window.open(url, "tweetwindow", 'width=500,height=340');
		})

		$("div.event_socialshare .fbevent").live('click',function(){
			paren = $(this).parent().parent().parent();
			url1 = paren.find(".data-url").val();
			img1 = (paren.find(".data-img").val())== 'undefined'?'':paren.find(".data-img").val();
			title = paren.find(".data-title").val();
			summary = (paren.find(".data-summary").val()== 'undefined')?'':paren.find(".data-summary").val();
			url = "http://www.facebook.com/sharer.php?s=100&p[url]="+url1+"&p[images][0]="+img1+"&p[title]="+title+"&p[summary]="+summary;
			url =  encodeURI(url);
			window.open(url, "fbwindow", 'width=500,height=340');
		})

	//jQuery Multiselect Plugin Execution
	//http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/	
	if($('select.location').length){
		$('select.location').multiselect({
			noneSelectedText: 'Select Location',
			selectedList: 1,
			header: true
		});
	}	
	
	if($('select.neighborhood').length){
	$('select.neighborhood').multiselect({
	  noneSelectedText: 'Neighborhoods',
	  selectedText: function(a,b,c){
		if(a>1){
	  		return a + " neighborhoods";
	  	}else{
	  		return a + " neighborhood"
	  	}
	  },
		click: function(event, ui){
			if(ui.checked)
				where.push(ui.value);
			else
				where.remove(ui.value);
			apiArguments['where'] = where.join(",");
			page=1;
			apiArguments['page'] = page;
			getData(catSelected, 'feed','',true);	
		},
		checkAll: function(){
			where = [];
			$.each($("select.neighborhood option"), function(k,v){
				where.push($(v).attr("value"));
			})
			apiArguments['where'] = where.join(",");			
			page=1;
			apiArguments['page'] = page;
			getData(catSelected, 'feed','',true);
		},
		uncheckAll: function(){
			where = [];
			$.each($("select.neighborhood option"), function(k,v){
				where.remove($(v).attr("value"));
			})	
			apiArguments['where'] = where.join(",");			
			page=1;
			apiArguments['page'] = page;
			getData(catSelected, 'feed','',true);
			
		}
	}).multiselectfilter();
	}	
   //jQuery Multiselect Plugin Execution Ends
		

	var latestDate = new Date().getWeek();
	
	//http://www.eyecon.ro/datepicker/
	if($( "div#datepicker" ).length){
	
	$( "div#datepicker" ).DatePicker({
		flat: true,
		date: [latestDate[0],latestDate[1]],
		current: latestDate[0],
		calendars: 1,
		mode: 'range',
		starts: 1,
		onChange: function(formated, dates){
			startDate = parseDate(formated[0]);
			endDate = parseDate(formated[1]);
			formated = [];
			if(startDate < today && endDate < today){
				startDate = today;
				endDate = today;
				//DO WE WANT TO RESET THE DATES ON THE CALENDAR?
			}
			else if(startDate < today && endDate > today){
				startDate = today;								
			}
			formated.push(startDate,endDate);						
			setDateRequest(formated[0],formated[1]);
		}
	});
	}
	
	$("#easyDate-today").click(function(){
		var a = [];
		toggleBold('easy_dates', $(this))
		$("div#datepicker").DatePickerSetDate(today, true);
		a[0] = today;a[1] = today;
		setDateRequest(a[0],a[1]);
	})

	$("#easyDate-tom").click(function(){
		toggleBold('easy_dates', $(this))
		$( "div#datepicker" ).DatePickerSetDate(today.getTomorrow(), true);
		var a = []
		a[0] = today.getTomorrow();a[1] = today.getTomorrow();
		setDateRequest(a[0],a[1]);
	})

	$("#easyDate-curweek").click(function(){
		var week = new Date().getWeek();
		toggleBold('easy_dates',$(this))
		$( "div#datepicker" ).DatePickerSetDate(week, true);
		week[0] =(week[0]<today)?today:week[0]; // get it confirmed what does this week means on weekend
		setDateRequest(week[0],week[1]);
	})

	$("#easyDate-curwend").click(function(){
		toggleBold('easy_dates',$(this))
		var end = new Date().getWeekend()
		$( "div#datepicker" ).DatePickerSetDate(end, true);	
		setDateRequest(end[0],end[1]);
	})
	$("#showhidecalender").click(function(){
			if($("div#datepicker").css("display") == "none"){
				/*
				$("#showhidecalender").css({
					'-moz-border-radius-bottomright':'0px',
					'-moz-border-radius-bottomleft':'0px',
					'-webkit-border-bottom-left-radius':'0px',
					'-webkit-border-bottom-right-radius':'0px',
				})
				*/
				$("#showhidecalender").removeClass('bottom-corners');
				$("#showhidecalender").html('Hide Calendar <span style="position:absolute;right:15px;">▲</span>');
			}
		$("div#datepicker").slideToggle(function(){		
			if($("div#datepicker").css("display") == "none"){
				
				$("#showhidecalender").addClass('bottom-corners');
				
				
				/* $("#showhidecalender").css({
					'-moz-border-radius-bottomright':'10px',
					'-moz-border-radius-bottomleft':'10px',
					'-webkit-border-bottom-left-radius':'10px',
					'-webkit-border-bottom-right-radius':'10px',
				}) */
				

				$("#showhidecalender").html('Show Calender <span style="position:absolute;right:15px;">▼</span>');
			}
		})
	});
	
	$("span.toggle_venue_address").live('click', function(event){
	//Venue address toggle on homepage
	var temp = $(this);
	if(temp.siblings(".venue_toggle").is(":visible")){
		temp.siblings(".venue_toggle").animate({'margin-top':'-21px'},300,function(){
			temp.siblings(".address_toggle").fadeIn();
			temp.siblings(".venue_toggle").css('margin-top','0px').hide();
		})
		temp.css('background-position','left top');
	}
	else {

		temp.siblings(".address_toggle").animate({'margin-top':'21px'},300,function(){
			temp.siblings(".venue_toggle").fadeIn();
			temp.siblings(".address_toggle").css('margin-top','0px').hide();
		})	
		temp.css('background-position','left bottom');
	}
	});
	
	//Sort Toggle
	$("#sort_events a, #sort_events img").click(function(){
		if($(this).is(":visible")){
				$("#sort_events a").css({'border-bottom':'0'})
			}

		$("#sort_events ul").slideToggle(function(){
			if($(this).is(":visible")){
				$("#sort_events a").css({'border-bottom':'1px #555 solid'})
			}
		})
	})
	
	//Filter Toggle
	$("div.menu-wazaap-filter-container > ul > li > a").toggle(function(){
	
		$("#select_all_filters").css('background', 'url('+TEMPLATEPATHJS+'/images/wazaap/select_all_no.png) no-repeat transparent left center');			
		$("#select_all_filters").attr("data-enabled","false");		
	
		allfilter_flag = (typeof $(this).parent().attr("enabled")
				== 'undefined')?false:true;		
		$.each($(this).parent().siblings(), function(){
			if(typeof $(this).attr("enabled") == 'undefined'){
				allfilter_flag = false;
				return false;				
			}
		})
		//If all the buttons are turned on
		if(allfilter_flag){
			$.each($(this).parent().siblings(), function(){
				$(this).children('a').css("background-image",$(this).children('a').css("background-image").replace("-pressed",""));
				$(this).children('a').parent().removeAttr("enabled");
				catSelected.remove($(this).children('a').attr("title"));
				removeSubs($(this).children('a').attr("title"));				
			})			
		}
		else{			
			if(typeof $(this).parent().attr("enabled") == 'undefined'){
				$(this).css("background-image",$(this).css("background-image").replace(".png","-pressed.png"));
				$(this).parent().attr("enabled",true);
				if(jQuery.inArray($(this).attr("title"), catSelected) == -1)
					catSelected.push($(this).attr("title"));
				/*$.each($(this).siblings(".sub-menu").children(), function(){
					if($(this).attr("id")){
						catSelected.push($(this).attr("id"))
					}
				})*/			
			}
			else{
				//check if everything else is disabled
				$.each($(this).parent().siblings(), function(){
					atleast_oneother = false;
					//atleast one other is enabled
					if($(this).attr("enabled")){
						atleast_oneother = true;
						return false;				
					}
				})
				if(atleast_oneother){
					$(this).css("background-image",$(this).css("background-image").replace("-pressed",""));
					$(this).parent().removeAttr("enabled");
					catSelected.remove($(this).attr("title"));
					//removeSubs($(this).attr("title"))
				}
				else{
					return false;
				}
			}
		}
		apiArguments['category'] = catSelected.join(",").toLowerCase();
		page=1;
		apiArguments['page'] = page;
		getData(catSelected, 'remove','',true);
		
	},function(){

		$("#select_all_filters").css('background', 'url('+TEMPLATEPATHJS+'/images/wazaap/select_all_no.png) no-repeat transparent left center');			
		$("#select_all_filters").attr("data-enabled","false");

		allfilter_flag = (typeof $(this).parent().attr("enabled")
				== 'undefined')?false:true;		
		$.each($(this).parent().siblings(), function(){
			if(typeof $(this).attr("enabled") == 'undefined'){
				allfilter_flag = false;
				return false;				
			}
		})
		//If all the buttons are turned on
		if(allfilter_flag){
			$.each($(this).parent().siblings(), function(){
				$(this).children('a').css("background-image",$(this).children('a').css("background-image").replace("-pressed",""));
				$(this).children('a').parent().removeAttr("enabled");
				catSelected.remove($(this).children('a').attr("title"));
				removeSubs($(this).children('a').attr("title"));				
			})			
		}
		else{
			if(typeof $(this).parent().attr("enabled") == 'undefined'){
				$(this).css("background-image",$(this).css("background-image").replace(".png","-pressed.png"));
				$(this).parent().attr("enabled",true);
				if(jQuery.inArray($(this).attr("title"), catSelected) == -1)
					catSelected.push($(this).attr("title"));
				/*$.each($(this).siblings(".sub-menu").children(), function(){
					if($(this).attr("id")){
						catSelected.push($(this).attr("id"))
					}
				})*/			
			}
			else{
				//check if everything else is disabled
				$.each($(this).parent().siblings(), function(){
					atleast_oneother = false;
					//atleast one other is enabled
					if($(this).attr("enabled")){
						atleast_oneother = true;
						return false;				
					}
				})
				if(atleast_oneother){
					$(this).css("background-image",$(this).css("background-image").replace("-pressed",""));
					$(this).parent().removeAttr("enabled");
					catSelected.remove($(this).attr("title"));
					//removeSubs($(this).attr("title"))
				}
				else{
					return false;
				}
			}
		}
		apiArguments['category'] = catSelected.join(",").toLowerCase();
		page=1;
		apiArguments['page'] = page;
		getData(catSelected, 'remove','',true);
	})
	

	
	
	//Show all filters
	$("#select_all_filters").click(function(){
		/*
			1. loop thru the elements - done
			2. find the one which is disabled - not reuired
			3. turn it on - 
			4. find the title which holds the name of the category - done 
			5. push it in the catselected - done 
			6. then execute the getData function - doing
		*/
		catSelected = [];

		$("#menu-wazaap-filter > li").each(function(k,v){
			catSelected.push($(this).attr('id'));
			$(this).attr('enabled','true');
			$(this).children().eq(0).css("background-image",'url('+TEMPLATEPATHJS+'/images/wazaap/'+$(this).attr('id')+'-pressed.png)');
		})

		$("#select_all_filters").css('background', 'url('+TEMPLATEPATHJS+'/images/wazaap/select_all_yes.png) no-repeat transparent left center');
		$("#select_all_filters").attr("data-enabled","true");

		apiArguments['category'] = catSelected.join(",").toLowerCase();    		
		page=1;
		apiArguments['page'] = page;
		getData(catSelected, 'remove','',true);		
	})

	//On Hover FadeIn Fadeout of the animations
	$('div.menu-wazaap-filter-container li a').hover(function(){
		$(this).siblings().css({'background-color':$(this).css('border-left-color')});
		if($('.sub-menu-selectall').length <= 0)
			$('ul.sub-menu').append("<li class='sub-menu-selectall'><a href='javascript:void(0)'>Select All</a></li>")
			
		$(this).siblings('ul').children().children().css('color',$(this).css('color'));		
		$(this).siblings().stop(true, true).fadeIn('slow');
	},function(){
		$(this).siblings().stop(true, true).fadeOut('slow');
	})

	$("ul.sub-menu").hover(function(){
		$(this).stop(true, true).show();
	},function(){
		$(this).stop(true, true).fadeOut('slow');
	})

	
	//Check Uncheck on Click
	$('.menu-wazaap-filter-container .sub-menu a').live('click', function(){
		var pare = $(this).parent();
		if(flag){
			if(pare.hasClass('sub-menu-selectall')){
				pare.parent().find('a').css('background-image','url('+TEMPLATEPATHJS+'/images/wazaap/unchecked.png)');
				$.each(pare.siblings(),function(index,val){
					catSelected.remove($(this).attr("id"));
				});
				parent_id=pare.parent().parent().attr("id");
				catSelected.remove(parent_id);
				$('#'+parent_id+' > a').css("background-image",$('#'+parent_id+' > a').css("background-image").replace("-pressed",""));	
			}
			else
			{
				$(this).css('background-image','url('+TEMPLATEPATHJS+'/images/wazaap/unchecked.png)');
				catSelected.remove($(this).parent().parent().parent().attr("id"));
				catSelected.remove($(this).parent().attr("id"));
			}
			apiArguments['category'] = catSelected.join(",").toLowerCase();
			
		}else{
			if(pare.hasClass('sub-menu-selectall')){
				pare.parent().find('a').css('background-image','url('+TEMPLATEPATHJS+'/images/wazaap/checked.png)');
					$.each(pare.siblings(),function(index,val){
						catSelected.push($(this).attr("id"));
				});
				parent_id=pare.parent().parent().attr("id");
				catSelected.push(parent_id);
				$('#'+parent_id+' > a').css("background-image",$('#'+parent_id+' > a').css("background-image").replace(".png","-pressed.png"));	
			}
			else
			{
				$(this).css('background-image','url('+TEMPLATEPATHJS+'/images/wazaap/checked.png)');
				catSelected.push($(this).parent().attr("id"));
				parent_id=pare.parent().parent().attr("id");
				$('#'+parent_id+' > a').css("background-image",$('#'+parent_id+' > a').css("background-image").replace(".png","-pressed.png"));	
			}	
			apiArguments['category'] = catSelected.join(",").toLowerCase();		
			
		}
		flag = !flag;
		page=1;
		apiArguments['page'] = page;
		getData(catSelected, 'remove','',true);
		
	})

	//Location Address Tickr
	$(".event_address").live('hover', function(){
		if(!($(this).parent().width() > $(this).width())){
			var scrollw = ($(this).parent().width() - $(this).width() - 5);
			if(scrollw > -50)
				$(this).animate({marginLeft:scrollw+'px'}, 1000,'linear');
			else
				$(this).animate({marginLeft:scrollw+'px'}, 2000,'linear');
		}
	},function(){
		$(this).stop().css({marginLeft:'0px'});
	})

	//Event Date Tickr
	$(".event_date").live('hover', function(){
		if(!($(this).parent().width() >= $(this).width())){
			var scrollw = ($(this).parent().width() - $(this).width() - 5);
			if(scrollw > -50)
				$(this).animate({marginLeft:scrollw+'px'}, 1000,'linear');
			else
				$(this).animate({marginLeft:scrollw+'px'}, 2000,'linear');
		}
	},function(){
		$(this).stop().css({marginLeft:'0px'});
	})

	
	$(".event_viewlike a.likes").live('click',function(){
		console.log("logged in?"+isLoggedIn);
		if(isLoggedIn){
			thisel = $(this);
			action = $(this).attr("data-status");
			$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
				{action: "voting", do: action, "post_id": thisel.attr("data-postid")},
				function(data) {
				  if(data.success){
					elem = thisel.find("span");
					//_(elem)
					curval = parseInt(elem.text());
					if(action == "vote"){
						elem.fadeOut(function(){
							elem.text(curval+1);
							elem.fadeIn();
						})			  		
						thisel.attr("data-status", "unvote")
					}else{			  		
						elem.fadeOut(function(){
							elem.text(curval-1);
							elem.fadeIn();
						})
						thisel.attr("data-status", "vote")
					}
					like_div=thisel.find("div");
					if(like_div.css("background-position") == "-145px 50%"){
						like_div.css("background-position","-112px 50%");
					}else{
						like_div.css("background-position","-145px 50%");
					}

					if(elem.css("color") == "rgb(255, 255, 255)"){
						elem.attr("style","color:rgb(255, 56, 56)");
					}
					if(elem.css("color") == "rgb(255, 56, 56)"){
						elem.attr("style","rgb(255, 255, 255)");
					}
				  }
				  
				}, "json"
			);
		}
		else
		{
			lightbox();
		}
	})


	$("#sort_events ul li").click(function(){
		currentSort = $("#selected_sort_type").text(); //;
		newSort = $(this).text();
		$("#selected_sort_type").text(newSort);
		$(this).text(currentSort);
		newSort = newSort.toLowerCase()
		switch (newSort){
			case "recently added":
			  $("#masonry-portfolio").isotope({sortBy: newSort, sortAscending : false})	
			  break;
			case "upcoming":
			  $("#masonry-portfolio").isotope({sortBy: newSort, sortAscending : true})	
			  break;
			case "featured":
			  $("#masonry-portfolio").isotope({sortBy: newSort, sortAscending : false})	
			  break;
		}
		//$("#masonry-portfolio").isotope({sortBy: newSort, sortAscending : false})	
		$("#sort_events a").click();
	})

	//Center the spinner
	if($("div#spinner").length)
	$("div#spinner").center();

	$("#wazaap_search").keypress(function(e){
		e = e.keyCode || e.which;

		if((isSinglePage) && (e==13)){
			window.location = WEBADDR+"?search="+$(this).val();
		}else{
			searchterms($(this).val(), e);				
		}

	})

	function searchterms(val, e){
		if (e == 13){
			apiArguments['has'] = val;
			page=1;
			apiArguments['page'] = page;
			getData(catSelected,"searchterms",'',true);
		
			
		}
		if(!($("#clear_search").is(":visible"))){
			$("#clear_search").show()
		}
	}
	
	$("#clear_search").live('click', function(){
		apiArguments['has'] = '';
		$("#wazaap_search").val("");
		page=1;
		apiArguments['page'] = page;
		getData(catSelected,"clear_search",'',true);
		$("#clear_search").hide()
		
	})




	$("#easy_times li a, #custom_time").click(function(){
		//Only if type the time by myself
		if($(this).attr("id") == "custom_time")
		{	
			$("input.start-time, input.end-time").css("border-color","#ccc")
			apiArguments['start_before'] = $("input.end-time").val().split(":")[0];
			apiArguments['start_after'] = $("input.start-time").val().split(":")[0];
			
			/* if($("input.start-time").val().split(":")[0] < today.getHours()){
				apiArguments['start_after'] = today.getHours();
				$("div.start-end .start-time").val( apiArguments['start_after'] + ":00");
			} */  // to avoide the check for right now for morning
			

			var bfr = $("input.end-time").val();
			var aftr = $("input.start-time").val();
			
			//Obsolete Military time format
			//var patt=/^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$/g;
			//var patt1=/^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$/g;

			var patt=/^(1[012]|[1-9]):[0-5][0-9]$/g;
			var patt1=/^(1[012]|[1-9]):[0-5][0-9]$/g;

			var result = patt1.test(bfr);
			var result1 = patt.test(aftr);
		}
		else
		{
			toggleBold('easy_times', $(this));
			apiArguments['start_before'] = $(this).attr("data-startbefore");
			
			//Convert military time into AM/PM time
			//http://www.crowderassoc.com/javascript/timeinstatus.html
			if($(this).attr("data-startafter") == ""){
				if(today.getHours()>12){
					apiArguments['start_after'] =(today.getHours() - 12);
				}else {
					apiArguments['start_after'] = today.getHours();
				}
			    if(today.getMinutes() < 10){ 
			    	apiArguments['start_after']+=":0" + today.getMinutes();
			    }
			   else{
				   apiArguments['start_after']+=":" + today.getMinutes();
			    }
			    
			    //AM or PM
			    if(today.getHours()>=12){
			    	apiArguments['start_phrase']="PM"; 
			     }
			     else{
			    	 apiArguments['start_phrase']=" AM";
			     } 			    
			}else{
				apiArguments['start_after'] = $(this).attr("data-startafter");
				apiArguments['start_phrase'] = $(this).attr("data-startphrase");
			}
			apiArguments['end_phrase'] = $(this).attr("data-endphrase");
			
			//if start_after or start_before contains :, then don't add the ":00"
			if(apiArguments['start_after'].indexOf(":")==-1)
				apiArguments['start_after'] = apiArguments['start_after'] + ":00";
			if(apiArguments['start_before'].indexOf(":")==-1)
				apiArguments['start_before'] = apiArguments['start_before'] + ":00";	
			
			$("div.start-end .start-time").val( apiArguments['start_after']);
			$("div.start-end .end-time").val( apiArguments['start_before']);
			$("div.start-end #start_time").text( apiArguments['start_phrase']);
			$("div.start-end #end_time").text( apiArguments['end_phrase']);
		}
		
		if(!result || !result1){	
			if(!result){
				$("input.end-time").css("border-color","red")
			}
			if(!result1){
				$("input.start-time").css("border-color","red")
			}
			return false;
		}
		page=1;
		apiArguments['page'] = page;
		getData(catSelected,"feed",'',true);
		
	})

	$("#countmeinthis").click(function(){
		if(isLoggedIn){
			var temp = '<div style="display:none" class="snap" id="user-'+isLoggedIn+'">'+userPic+'</div>';
			$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
					{action: "rsvp", "post_id": $(this).attr("data-postid")},
					function(data) {
						if(data.success){
							if($("#isuserrsvpd").val()=="1"){
								reduced_rsvp_count = parseInt($("#rsvp_ppl_count").val())-1;
								$("#rsvp_ppl_count").val(reduced_rsvp_count);
								$("#isuserrsvpd").val("0");
								$("#countmeinthis").empty().
								append('Count me In [<span id="span_rsvp_ppl_count">').
								append(reduced_rsvp_count).append(']</span>');								
								$("#user-"+isLoggedIn).fadeOut(function(){
									$(this).remove();
								});
								$("#countmeinthis").attr("class","countmein");
								
							}else{
								$("#isuserrsvpd").val("1")
								increased_rsvp_count = parseInt($("#rsvp_ppl_count").val())+1;
								$("#rsvp_ppl_count").val(increased_rsvp_count);
								$("div.counted_people").prepend(temp);
								$("#user-"+isLoggedIn).fadeIn();
								$("#countmeinthis").attr("class","countmein rsvped");
								$("#countmeinthis").text("You are in!");
							}
						}
					}, "json")					
			
		}else{
			lightbox();
		}
	})

	$("#clear_tags a").click(function(){
		$('#wazaap_subcats a.select').each(function(index) {
			$(this).css('font-weight','normal');
			$(this).removeClass('select');	
		});
		$('#wazaap_tags a.select').each(function(index) {
			$(this).css('font-weight','normal');
			$(this).removeClass('select');	
		});
		apiArguments['subcats'] = '';
		apiArguments['tags'] = '';
		page=1;
		apiArguments['page'] = page;
		getData(catSelected,"feed",'',true);			
	})

	$("#wazaap_subcats a").click(function(){
		//var tags = [];
		var subcats = [];
		if($(this).css('font-weight')==400 || $(this).css('font-weight')=='normal')
		{
			//apiArguments['tags'] += "," + $(this).attr("meta");
			$(this).css('font-weight','bold');
			$(this).addClass('select');
			$('#wazaap_subcats a.select').each(function(index) {
				subcats.push($(this).attr("meta"));			    
			});			
		}	
		
		else
		{
			//apiArguments['tags'] = tags_list;
			//apiArguments['tags'] = '';
			apiArguments['subcats'] = '';
			$(this).css('font-weight','normal');
			$(this).removeClass('select');			
			$('#wazaap_subcats a.select').each(function(index) {
				subcats.push($(this).attr("meta"));
			});
			
		}
			
		_($(this).css('font-weight'));		
		apiArguments['subcats'] = subcats.join(",");
		page=1;
		apiArguments['page'] = page;
		getData(catSelected,"feed",'',true);		
	})

		$("#wazaap_tags a").click(function(){
		var tags = [];
		if($(this).css('font-weight')==400 || $(this).css('font-weight')=='normal')
		{
			//apiArguments['tags'] += "," + $(this).attr("meta");
			$(this).css('font-weight','bold');
			$(this).addClass('select');
			$('#wazaap_tags a.select').each(function(index) {
				tags.push($(this).attr("meta"));			    
			});			
		}	
		
		else
		{
			//apiArguments['tags'] = tags_list;
			apiArguments['tags'] = '';
			$(this).css('font-weight','normal');
			$(this).removeClass('select');			
			$('#wazaap_tags a.select').each(function(index) {
				tags.push($(this).attr("meta"));
			});
			
		}
			
		_($(this).css('font-weight'));		
		//apiArguments['tags'] = tags.join(",");
		apiArguments['tags'] = tags.join(",");
		//console.log(apiArguments['tags']);
		page=1;
		apiArguments['page'] = page;
		getData(catSelected,"feed",'',true);		
	})
	

	$("div.event_countin a").live('click',function(){
		if(isLoggedIn){
			$tthis = $(this)
			if($(this).attr("data-userrsvpd") == 0){
				$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
					{action: "rsvp", "post_id": $(this).attr("data-postid")},
					function(data) {
					  if(data.success){
					  	$tthis.find("span").fadeOut(function(){
					  		$(this).text("You are in!");
					  		$(this).fadeIn();
					  	});
					  	$tthis.attr("data-userrsvpd", "1");
					  }
					}, "json"
				);	
			}else{
				$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
					{action: "rsvp", "post_id": $(this).attr("data-postid")},
					function(data) {
					  if(data.success){
					  	$tthis.find("span").fadeOut(function(){
					  		$(this).text("Count me in")
					  		$(this).fadeIn();
					  	});
					  	$tthis.attr("data-userrsvpd", "0");
					  }
					}, "json"
				);	
			}
		}else{
			lightbox();
		}
	})

	$("a#single_fav").live('click', function(){
		isuserlike = $(this).attr('data-userlike');
		elem = $(this);
		if(isLoggedIn){
			$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
				{action: "voting", do: $(this).attr("data-status"), "post_id": $(this).attr("data-postid")},
				function(data) {
					if(data.success){
						if(isuserlike == 1){
							elem.fadeOut(function(){
								elem.css("background","url("+TEMPLATEPATHJS+"/images/wazaap/single_fav.png) no-repeat");	
								cur = parseInt(elem.text());
								elem.text(cur-1);
								elem.attr('data-userlike','0')	
								elem.attr('data-status','vote')	

								elem.fadeIn();
							})
							
						}else{
							elem.fadeOut(function(){
								elem.css("background","url("+TEMPLATEPATHJS+"/images/wazaap/faved.png) no-repeat");	
								cur = parseInt(elem.text());
								elem.text(cur+1);
								elem.attr('data-userlike','1')
								elem.attr('data-status','unvote')	
									elem.fadeIn();
							})
						}
						
					}
				}, "json"
			);
		}
		else
		{
			lightbox();
		}
	})
	
	/*Notification section*/
	
	jQuery('#notification-main-ul > li > a').removeAttr('href');
	jQuery('#notification-main-ul > li > a').click(function(){
		jQuery('#notification-main-ul > li > ul').toggle();
	});

	if(jQuery('#notification-main-ul > li > a > span').html() > 9 ){
		jQuery(this).css('right','-15px');
	}
	
	jQuery("#preview_invite").click(function(){
		
		var invite_emails = jQuery("#invite_emails").val(); 
		var invite_message = jQuery("#custom_invite_message").val(); 
		
		if(invite_emails.length < 0)
			return false;
		
		jQuery.post(	
				googleAjax.ajaxurl,
				{    
					action : 'preview_beta_invite',         					
					invite_emails: invite_emails,
					invite_message: invite_message
				},
				function( response ) {
					jQuery("#preview_message").show();
					jQuery("#preview_message").html(response);
				}
			)		
		
	});
	
	jQuery("#show_address").toggle(function(){		
		jQuery("#event_venue_text").fadeOut(150, function(){
			jQuery("#event_address_text").show();	
		});
		jQuery("#show_address").html("Show Venue");
	},function(){
		jQuery("#event_address_text").fadeOut(150, function(){
			jQuery("#event_venue_text").show();	
		});
		jQuery("#show_address").html("Show Address");
	})


	
	jQuery("#send_invite").click(function(){			
		var invite_emails = jQuery("#invite_emails").val(); 
		var invite_message = jQuery("#custom_invite_message").val(); 
				
		if(invite_emails.length < 0)
			return false;
		
		var emails = invite_emails.split(',');
		if (emails.length > 10){
			jQuery("#invite_message").html("Only 10 email address are allowed");
			jQuery("#invite_message").show(); 
			return false;
		}
			
		jQuery.post(	
			googleAjax.ajaxurl,
			{    
				action : 'send_beta_invite',         					
				invite_emails: invite_emails,
				invite_message: invite_message
			},
			function( response ) {
				jQuery("#invite_message").html(" ");	
				if(response.success || !response.success){
					jQuery("#invite_emails").val(" ");
					jQuery("#custom_invite_message").val(" ");
					jQuery("#preview_message").html(" ");
					jQuery("#preview_message").hide();					
					jQuery("#invite_message").html(response.msg);
					jQuery("#invite_message").show(); 
				}
			},"json"
		)	
	});
	
})


function getData(d, flag, x,remove_old){		
	if(scroll_lock && page >1)
	{
		$("#spinner").css({"background-image":"none"}).html("Sorry! No new events could be found!").center()
		$("#spinner").delay(2000).fadeOut(function(){
			$(this).css("background-image", "url("+TEMPLATEPATHJS+"/images/wazaap/spinner.svg)").html("").center();		
		})
		return; // is no events scroll-lock is set to true;
	}
	else if( page ==1)
	{
		scroll_lock = false;
	}
	$("#spinner").show();

	url = TEMPLATEPATHJS + "/../../plugins/wz_reloaded/action.php?action=search";
	
	exception = currentEvents.join(",")
	var currentArgs = {};
	
	for(var i in apiArguments){
		if((flag.indexOf("searchterms") == -1) &&
			(typeof apiArguments[i] == 'undefined') || !apiArguments[i] || apiArguments[i]== null){
			switch(i)
			{
				case 'category':  apiArguments[i] = getCatSelected();break;		  
				case 'city':	apiArguments[i] = 'san-francisco';break;
				case 'start_date':  apiArguments[i] = getStartEnd()[0];break;
				case 'end_date':  apiArguments[i] = getStartEnd()[1];break;
				case 'tags':  break;  
				case 'subcats':  break;
				case 'where': 
				//Problem with neighborhood is that the get Data is trigged before
				//change in state. The only workaround is not to look it up unless
				//where is null or undefined
				if(apiArguments[i]){apiArguments[i] = getNeighborhood(); }break;
				case 'time':  break;  
				case 'sort_by': apiArguments[i] = getSortType(); break;    
				case 'sort_order':  apiArguments[i] = get_current_sort(); break;
				case 'items_per_page': apiArguments[i] = items_per_page; break;
				case 'page': apiArguments[i] = page; break;
				case 'has':  break;
				case 'except': break;
				case 'start_before': break;
				case 'start_after': break;  
				default:
			}
		}
		//console.log(i+'='+apiArguments[i]);		
		if(apiArguments[i]){
			currentArgs[i] = apiArguments[i];		
		}
	}
		
	
	$.get(url,
		currentArgs,
		function(data){
			presentData(data, flag,remove_old);
		},
		"json"
	);	
	
	return false;/* */

}

/**************************************************************
***************************************************************
**********************HELPER FUNCTIONS************************
***************************************************************
***************************************************************/

function getCatSelected(){
	var tmpCats = [];
	$.each($("div.menu-wazaap-filter-container > ul > li > a"), function(k,v){
		tmpCats.push($(this).attr("title"))
	})
	return tmpCats.join(",").toLowerCase();
}

function getStartEnd(){
	var sed = [];
	//console.log($("div#datepicker").is(':empty'));
	if(!($("div#datepicker").is(':empty'))){
		da = $("div#datepicker").DatePickerGetDate(true);
		if(da.length == 1){	
			t_start_date = t_end_date = new Date(parseDate(da)).getAPIFormat();
		}else{
			t_start_date = new Date(parseDate(da[0])).getAPIFormat();
			t_end_date = new Date(parseDate(da[1])).getAPIFormat();
		}
		sed[0] = t_start_date;
		sed[1] = t_end_date;
	}
	return sed;
}

function setDateRequest(t_start_date,t_end_date){
	apiArguments['start_date'] = new Date(t_start_date).getAPIFormat();
	apiArguments['end_date'] = new Date(t_end_date).getAPIFormat();
	page=1;
	apiArguments['page'] = page;
	getData(catSelected, "date", t_start_date,true);	
}

function getNeighborhood(){
	return $('select.neighborhood').val();
}

function getSortType(){
	return $("#selected_sort_type").text().toLowerCase();	
}

function getSortOrder(){
	return get_current_sort();
}

/**************************************************************
***************************************************************
***************************************************************
***************************************************************/

function presentData(result, flag,remove_old){
	/*
	 * currentEvents are the events on the page
	 * newEvents are the results returned from the ajax call
	 * toRemove are ids which need to be removed from currentEvents
	 * toAdd are ones which need to be added
	 * toShow = currentEvents + toAdd - toRemove
	 * Meaning toShow = currentEvents + newEvents - overlap
	 * remove_old is false for infinite scrolling
	 */
	newEvents =[];
	toRemove = [];
	toAdd = [];
	dynamicLocation = []; //Mappress
	//make changes when the success is true otherwise do no stuff
	if(result.meta.success)
	{
		if(result.events.length)
		{
			scroll_lock = false;
		}
		else
		{
			scroll_lock = true;
		}
		
		//create array of the id of the results
		$.each(result.events, function(k,v){
			newEvents.push(v.uid);
			if(flag=="date" && currentEvents.find(v.uid)){
				//Edge case if event datetime changes based on new date filter
				curdate_year = $("div.post-"+v.uid).find('div.event_time').attr('data-eventtime');
				if(!(typeof curdate_year == 'undefined') 
						&& (v.date_year) != curdate_year)
				{
					//console.log("uid="+v.uid + " title="+v.title+" new="+v.date_year+" current="+curdate_year);
					toRemove.push(v.uid);
					toAdd.push(v.uid);
				}
			}
		});
		

			if(remove_old)
			{
				overlap = [];
				$.each(currentEvents, function(k,v){
					if(!newEvents.find(v))
						toRemove.push(v);
					else
						overlap.push(v);
				});
				//console.log("newEvents="+newEvents);
				//console.log("toRemove="+toRemove);
				$("#masonry-portfolio").isotope('remove', $($("div.post-1")));
				if(toRemove){	
					//console.log(toRemove.length);
					var $div_arr = $();
					$.each(toRemove, function(k,v){
						$div_arr = $div_arr.add($("div.post-"+v));
					})					
					//console.log($div_arr);
					$("#masonry-portfolio").isotope('remove', $div_arr);
					//$("#masonry-portfolio").isotope('reLayout');
					currentEvents = overlap.slice();
					toRemove = [];					
				}
			}
			
			$.each(newEvents, function(key,value){
				if(!currentEvents.find(value)){
					toAdd.push(value);
				}
			})

			//console.log("currentEvents="+currentEvents);
			//console.log("newEvents again="+newEvents);
			//console.log("toAdd="+toAdd);
			
			$.each(result.events, function(k,v)
			{			
				if(toAdd.find(v.uid)){
					$newBox = (getEventBoxHTML(v.uid, v.image, v.title, v.permalink, v.description, 
							v.location,v.address, v.posted_on, v.views, v.likes, v.rsvp, v.category, v.date, 
							v.time, v.event_message, v.tags, v.subcats, v.popularity, v.social_points, v.featured, 
							v.user_rsvp, v.user_like,v.date_year, v.address, v.lat, v.long, v.short_url, v.event_url,v.performer_name));
					if(remove_old)
					{
						$("#masonry-portfolio").isotope('insert', $newBox); // else add
					}
					else
					{
						$("#masonry-portfolio").append($newBox).isotope('appended', $newBox); //append
					}
					if(jQuery.inArray(v.uid, currentEvents) == -1)
						currentEvents.push(v.uid);
					dynamicLocation.push(v);
				}
				else
				{
			
				}				

			});
			
			//console.log("new currentEvents="+currentEvents);
			
			//IN CASE NO RESULTS ARE FOUND & remove_old is true
			if(!result.events.length && remove_old)
			{
				// there were no events and we remove old so, this is adding new events
				currentEvents = [];
				currentEvents.push(1);
				$newBox = (getNoEventBoxHTML(1));
				$("#masonry-portfolio").isotope('insert', $newBox);
				//$("#masonry-portfolio").prepend( $newBox).isotope( 'reloadItems' );
				$("#spinner").fadeOut(function(){
					$(this).css("background-image", "url("+TEMPLATEPATHJS+"/images/wazaap/spinner.svg)").html("").center();		
				});	
				return;
			}	
			
		//}
		$("#spinner").fadeOut(function(){
			$(this).css("background-image", "url("+TEMPLATEPATHJS+"/images/wazaap/spinner.svg)").html("").center();		
		});
		//$("#masonry-portfolio").isotope('reLayout')
	}
	else
	{
		var $div_arr = $();
		$.each(currentEvents, function(k,v){
			$div_arr = $div_arr.add($("div.post-"+v));
		});
		$("#masonry-portfolio").isotope('remove', $div_arr);
		$("#masonry-portfolio").isotope('reLayout');
		currentEvents = [];
		toRemove = [];
		
		$("#spinner").fadeOut(function(){
			$(this).css("background-image", "url("+TEMPLATEPATHJS+"/images/wazaap/spinner.svg)").html("").center();		
		});
		
		//div.post-1 is no results found
		$("#masonry-portfolio").isotope('remove', $($("div.post-1")));	
		$("#masonry-portfolio").isotope('reLayout');
		currentEvents = [];
		currentEvents.push(1);
		//$("#masonry-portfolio").isotope('reloadItems');
		// there were no events and we remove old so, this is adding new events
		$newBox = (getNoEventBoxHTML(1));
		$("#masonry-portfolio").isotope('insert', $newBox);

		//$("#masonry-portfolio").prepend( $newBox).isotope( 'reloadItems' );//isotope('insert', );
		
	}
	/*
	var mapdata = {
		zoom:12
	}
	$.each(dynamicLocation, function(k, v){
		mapp0.addPOI({
             "point":{"lat":v.lat,"lng":v.long},
             "title":v.title,
             "url":v.permalink,
             "body":v.description,
             "address":v.address,
             "correctedAddress":v.address,
             "iconid":null,
             "viewport":{"sw":{"lat":37.7753,"lng":-122.4194},"ne":{"lat":37.7753,"lng":-122.4194}},
             "user":false,"showPoiList":true,"poiListTemplate":null})    
             
	})
	ccc = {"sw":{"lat":37.7753,"lng":-122.4194},"ne":{"lat":37.7753,"lng":-122.4194}};
	mapp0.recenter(ccc, 12);
	*/
	window.setTimeout(function(){$("#masonry-portfolio").isotope('reLayout')},3000)
	waiting_for_ajax_response = false;
}


function getEventBoxHTML(id, image, title, permalink, excerpt, location, address, postedon, view, like, rsvp, category, date, time, event_message, tags, 
				subcats, popularity,social_points, featured, userrsvpd, userlike,date_year,address, lat, long, short_url, event_url,performer_name){

	category = category.split("-");
	//assuming that there won't be any negative popularity, if it is then make 0(zero) as the least value for the null popularity
	popularity = (popularity==null)?0:popularity;
	
	var sendBackData = '<div class="newposts category-'+category[0]+' hentry post-'+id+' " data-popularity="'+popularity+' " data-featured="'+featured+'">';

	if(image){
		sendBackData += '<div class="post-thumb clearfix">\
                              <a href="'+permalink+'">\
                                   <img src="'+TEMPLATEPATHJS+'/includes/timthumb.php?src='+image.src+'&h=170&w=303&q=100"/>\
                              </a>\
                              <div class="arrow"></div>\
                         </div>\
                         <h2 class="entry-title"><a href="'+permalink+'">'+title+'</a></h2>';
	}else{
		sendBackData += '<div class="title-wrap clearfix">\
                          <span class="icon"></span>\
                          <a href="'+permalink+'">'+title+'</a>\
                          <div class="arrow"></div>\
                        </div>';						
	}

	sendBackData += '<div class="meta_division" style="margin-top:0px !important;"></div>';
	if(excerpt && !image){
		sendBackData += '<div class="entry-excerpt" style="padding-top:2px;padding-bottom:10px;">\
						<a href="'+permalink+'">'+excerpt+'</a>\
                    	</div>';
	}else{
		sendBackData += '<div class="entry-excerpt" style="padding-top:2px;padding-bottom:10px;"><a href="'+permalink+'">'+excerpt.substring(0,70)+'</a></div>';
	}
	
    if(date_year != null){ 
	    sendBackData += '<div class="event_time event_meta" data-eventtime="'+date_year+'">\
							<div class="meta_icons" title="Event Date" alt="Event Date"></div>\
	    						<div class="moreinfo_tickr">\
	    							<div class="event_date">'+event_message+date+(!(time==='')?' &middot; '+time:'')+'</div>\
								</div>\
						</div>';
	}
	if(location != null){
		sendBackData +='<div class="event_location event_meta">\
					  <div class="meta_icons" title="Event Location" alt="Event Location"></div>\
					  <div class="moreinfo_tickr">\
					  	<div class="event_address venue_toggle">'+location+'</div>\
					  	<div class="event_address address_toggle">'+address+'</div><span class="toggle_venue_address"></span>\
					  </div>\
					</div>';
	}
	if(tags != ''){
		sendBackData +='<div class="event_tags event_meta">\
	                        <div class="meta_icons" title="Tags" alt="Tags"></div>\
    	                    <span>'+tags+'</span>\
        	            </div>';
	}

	if(category == 'deals' && performer_name!=null && performer_name!=''){
		sendBackData += '<div class="event_info event_meta"><div class="meta_icons" title="Source" alt="Source"></div><span>'+performer_name+'</span></div>';
	}
	
        sendBackData +='<div class="meta_division"></div>\
               			<div class="event_posted event_meta" data-timestamp="'+Date.parse(postedon)+'">\
							    <div class="meta_icons" title="Posted On" alt="Posted On"></div>\
							    <span>'+prettyDate(postedon)+'</span>\
						</div>\
						<div class="event_viewlike event_meta">';

	if(view != 0){
		sendBackData += '<a href="javascript:void(0)" class="cur_def">\
					      <div class="meta_icons view" title="Views" alt="Views"></div>\
					      <span>'+view+'</span>\
					    </a>';
	}
		
		if(userlike){
			like_stat = "unvote";
			css = "background:url("+TEMPLATEPATHJS+"/images/wazaap/icon-sprite.png) -145px center no-repeat transparent"
		}else{
			like_stat = "vote";
			css = "background:url("+TEMPLATEPATHJS+"/images/wazaap/icon-sprite.png) -112px center no-repeat transparent"
		}

		if(userrsvpd == null){
			userrsvpd = 0;
		}

		if(userrsvpd){
			if(rsvp == 1){
				ttxt = "You are in!";
			}else{
				ttxt = rsvp + " You"
			}
		}else{
			if(rsvp=='')
				rsvp=0;
			ttxt = "Count me in ["+rsvp+"]"
		}

		like = (like=="")?0:like;
		sendBackData += '<a href="javascript:void(0)" class="likes" data-postid='+id+' data-status='+like_stat+'>\
						      <div class="meta_icons like" style="'+css+'" title="Like" alt="Like"></div>\
						      <span>'+like+'</span>\
						    </a>\
						</div>\
						<div class="clear"></div>\
						<div class="event_countin event_meta" title="Count me in" alt="Count me in">\
						  <a href="javascript:void(0)" data-postid='+id+' data-userrsvpd='+userrsvpd+'>\
						      <div class="meta_icons"></div>\
						      <span>'+ttxt+'</span>\
						  </a>\
						</div>\
						<div class="event_socialshare event_meta">\
						 <a href="javascript:void(0)" id="tweet_click">\
						 <div class="meta_icons tweetevent" title="Share on Twitter" alt="Share on Twitter"></div>\
						 </a>\
                  <a href="javascript:void(0)" style="margin-left:3px">\
                  <div class="meta_icons fbevent" title="Share on Facebook" alt="Share on Facebook"></div>\
                  </a>\
                  <a href="javascript:void(0)" style="margin-left:3px">\
                  <div class="meta_icons email" title="Email Share" alt="Email Share"></div>\
                  </a>\
              </div>\
              <input class="data-title" type="hidden" value="'+title+'">\
              <input class="data-url" type="hidden" value="'+permalink+'">\
              <input class="data-img" type="hidden" value="'+((image)?(TEMPLATEPATHJS+'/includes/timthumb.php?src='+image+'&h=150&w=100&q=100'):'')+'">\
              <input class="data-short" type="hidden" value="'+short_url+'">\
              <input class="data-summary" type="hidden" value="'+excerpt.substring(0, 65)+'...'+'">\
			              <div class="clear pb10"></div>\
			          </div>';
		         
		return $(sendBackData);
}

function getNoEventBoxHTML(id){

	var image = false;
	
	var sendBackData = '<div class="newposts category-blank hentry post-'+id+' " data-popularity="0">';

	if(image){
		sendBackData += '<div class="post-thumb clearfix">\
                              <a title="No events founds" href="#">\
                                   <img src="'+TEMPLATEPATHJS+'/includes/timthumb.php?src='+image+'&h=170&w=303&q=100"/>\
                              </a>\
                              <div class="arrow"></div>\
                         </div>\
                         <h2 class="entry-title"><a href="#">No events found</a></h2>';
	}else{
		sendBackData += '<div class="title-wrap clearfix">\
                          <span class="icon"></span>\
                          <a href="#">No events found</a>\
                          <div class="arrow"></div>\
                        </div>';						
	}

	sendBackData += '<div class="meta_division" style="margin-top:0px !important;"></div>';
	if(!image){
		sendBackData += '<div class="entry-excerpt" style="padding-top:2px;padding-bottom:10px;">\
                        	Oops!!! Looks like we don\'t have any events matching your search\
                    	</div>';
	}
   				
	
        sendBackData +='<div class="meta_division"></div>\
               			<div class="event_posted event_meta" data-timestamp="NaN">\
							<a href="javascript:void(0)">\
							    <div class="meta_icons"></div>\
							    <span></span>\
							</a>\
						</div>\
						<div class="event_viewlike event_meta">';


		sendBackData += '<a href="javascript:void(0)" class="cur_def">\
					      <div class="meta_icons view"></div>\
					      <span></span>\
					    </a>';	
		sendBackData += '<a href="javascript:void(0)" class="likes" data-postid='+id+' data-status="">\
						      <div class="meta_icons like" style=""></div>\
						      <span></span>\
						    </a>\
						</div>\
						<div class="clear"></div>\
						<div class="event_countin event_meta">\
						  <a href="javascript:void(0)" data-postid='+id+' data-userrsvpd=0>\
						      <div class="meta_icons"></div>\
						      <span></span>\
						  </a>\
						</div>\
						<div class="event_socialshare event_meta">\
						 <a href="javascript:void(0)" id="tweet_click">\
                    <div class="meta_icons tweetevent"></div>\
                  </a>\
                  <a href="javascript:void(0)" style="margin-left:3px">\
                    <div class="meta_icons fbevent"></div>\
                  </a>\
                  <a href="javascript:void(0)" style="margin-left:3px">\
                    <div class="meta_icons"></div>\
                  </a>\
              </div>\
              <input class="data-title" type="hidden" value="#">\
              <input class="data-url" type="hidden" value="#">\
			              <div class="clear pb10"></div>\
			          </div>';
		         
		return $(sendBackData);
}


function toggleBold(par, elem){
		$("#" + par).find("a").css("font-weight","normal")
		elem.css("font-weight","bold")
}




/**************************************************************
***************************************************************
**********************UTILITY FUNCTIONS************************
***************************************************************
***************************************************************/


//Date object extension to find the start and end week
Date.prototype.getWeek= function(start){
    start= start || 0;
    var today2= new Date(this.setHours(0, 0, 0, 0));
    var today3= new Date(this.setHours(0, 0, 0, 0));
    var day= today.getDay() - start;
    var date= today.getDate() - day;

    var startday= new Date(today2.setDate(date+1));
    var endday= new Date(today3.setDate(date+ 7));
    return [startday, endday];
}

Date.prototype.getWeekend = function(start){
	start= start || 0;
	var today= new Date(this.setHours(0, 0, 0, 0));
	var today1= new Date(this.setHours(0, 0, 0, 0));
    var day= today.getDay() - start;
    var date= today.getDate() - day;
	var startday = new Date(today.setDate(date+6));
    var endday = new Date(today1.setDate(date+7));
    return [startday, endday];
}

Date.prototype.getMyFormat = function(){
	var today = new Date();
	var newFormat = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
	return (newFormat.toString());
}


Date.prototype.getWazaapFormat = function(){
	var mon = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
	return this.getDate() + " " + mon[this.getMonth()] + ", " + this.getFullYear();	
}

Date.prototype.getTomorrow = function(){
	var today= new Date(this.setHours(0, 0, 0, 0));
    var date = today.getDate();
	tom = new Date(today.setDate(date+1));
	return tom;
}

Date.prototype.getAPIFormat = function(){
	var today = new Date();
	var newFormat = this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate();
	return (newFormat.toString());
}


//parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}

//Remove an object from array
Array.prototype.remove = function(elem) {
    var match = -1;
    while( (match = this.indexOf(elem)) > -1 ) {
        this.splice(match, 1);
    }
};

//Find a value in the array - retuns boolean
Array.prototype.find = function(val){
	return (this.indexOf(val) != -1);
}


// Jquery center
jQuery.fn.center = function () {
	this.css('position','fixed');
	//_('scroll top: '+$(window).scrollTop());//+ $(window).scrollTop()
    this.css("top", (($(window).height() - this.outerHeight()) / 2)  + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

function _(x){
	//console.log(x);
}

function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
	
	if ( isNaN(day_diff) || day_diff < 0  ) 
		return;
	//|| day_diff >= 31 removed by amit		
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "1 day ago" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
		Math.round( day_diff / 31 )==1 && "1 month ago"||
		Math.round( day_diff / 31 )>1 && Math.round( day_diff / 31 ) + " months ago";
}


function removeSubs(parentCat){
	xcv = catSelected;
	trr = [];
	
	$.each(xcv, function(k,v){
		if(v){
			if(v.split("-")[0] == parentCat){
				trr.push(v);
			}
		}
	})

	$.each(trr, function(k, v){
		catSelected.remove(v);
	})
}


function get_current_sort()
{
		currentSort = $("#selected_sort_type").text().toLowerCase();		
		switch (currentSort){
			case "recently added":
				return 'DESC';
			  break;
			case "upcoming":
			   return 'ASC';
			  break;
			case "featured":
			  return 'DESC';
			  break;
		}
		return '';
}

//Infinite Scrolling Custom Script
$(window).scroll(function () { 
	if (typeof isHomePage == 'undefined')	
	{
		return false;
	}
	if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
		//check and decide

		if(!waiting_for_ajax_response)
		{
			page++;
			apiArguments['items_per_page'] = items_per_page;
			apiArguments['page'] = page;
			sort_type = $("#selected_sort_type").text().toLowerCase();
			apiArguments['sort_by'] = sort_type;
			apiArguments['sort_order'] = get_current_sort();
			apiArguments['category'] = catSelected.join(",").toLowerCase();
			waiting_for_ajax_response = true;
			getData(catSelected, 'remove','',false);
		}

	}
	
});

/*Add uservoice tab*/
(function() {
	var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
	uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/yGKPx7i6O7LlYwTL8jVQ.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
	})();
	
function sendinvites_mail(){
		
	postid = $("#post_idh").val();	
	var temp = '<div style="display:none" class="snap" id="user-'+isLoggedIn+'">'+userPic+'</div>';
	$.post(TEMPLATEPATHJS + '/../../../wp-content/plugins/wz_reloaded/action.php',
			{action: "email", "emails": $("#email_inputs1").val(),'post_id':postid},
			function(data) {			
				if(data.success){
						alert("Invites Sent");
						hide_lightbox();						
						$("#wazaap_login_pop1").hide();
				}
				else{
					alert(data.reason);	
					hide_lightbox();
					$("#wazaap_login_pop1").hide();
				}
			}, "json")	
			
}	

function hide_lightbox(){
	$("#email_inputs").val('');
	$("#wazaap_login_pop").fadeOut(150,function(){
	$("#black_overlay").fadeOut();
	$("#black_overlay").unbind('click');
	$(document).unbind('keypress');
	});
}
// $() will work as an alias for jQuery() inside of this function
})(jQuery);
function lightbox(x){
		jQuery("#black_overlay").fadeIn(150, function(){
			jQuery("#wazaap_login_pop").fadeIn();
		});
		
		jQuery("#black_overlay, #close_loginpopup").click(function(){
			jQuery("#wazaap_login_pop").fadeOut(150,function(){
				jQuery("#black_overlay").fadeOut();
				jQuery("#black_overlay").unbind('click');
				jQuery(document).unbind('keypress');
			});
		})
		
		//dont remove lightbox if clicke on the list box
		jQuery("#wazaap_login_pop").click(function(){
			//return false;
		})
		
		//remove lightbox when escape key is pressed
		jQuery(document).keypress(function(e){
			var code = e.keyCode || e.which;
			if(code==27){
				jQuery("#black_overlay").click();
			}
		})

		if(x){
			jQuery("#lightox_desc p").text("You can invite you friends by entering their email addresses below.")
			jQuery(".login-title").html('<span class="login">Send Invites</span>');
			jQuery("#login_n_signup").hide();
			jQuery("#invite_email").show();
		}else{
			jQuery("#lightox_desc p").text("Use Facebook to connect with your friends & make new ones.")
			jQuery(".login-title").html('<span class="login">Log In</span><span class="signup"><a href="./register"> or sign up</a></span>');
			jQuery("#invite_email").hide();
			jQuery("#login_n_signup").show();
			
		}
}


function email_share_box(a){

	jQuery("#wazaap_login_pop1").center();
	jQuery("#invite_email").center();
//	console.log(a.parent('.hentry'));
	jQuery("#black_overlay").fadeIn(150, function(){
		jQuery("#wazaap_login_pop1").fadeIn();
	});
	
	jQuery("#black_overlay, #close_loginpopup").click(function(){
		jQuery("#wazaap_login_pop1").fadeOut(150,function(){
			jQuery("#black_overlay").fadeOut();
			jQuery("#black_overlay").unbind('click');
			jQuery(document).unbind('keypress');
		});
	})
	
	jQuery(document).keypress(function(e){
		var code = e.keyCode || e.which;
		if(code==27){
			jQuery("#black_overlay").click();
		}
	})
}