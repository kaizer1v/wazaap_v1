	//This variable is to store the checked neighbourhood values
	//Since it is a global variable and is also used in another .js file, it is defined outside the declaration of JQuery
	var checkedValues;
	function homepageImageHandler(){
		$(".img-b1, .img-b2, .img-b3, .img-b4, .img-b5").error(function(){		
			//console.log("error");
			$(this).parent().next().css("width","100%");
			$(this).parent().hide();			
		})
		
		$.each($(".homepage-title-img"), function(k,v){
			if($(this).attr("src") == ""){
				$(this).parent().next().css("width","100%");
				$(this).parent().hide();
			}		
		})
	}
$(document).ready(function() {
// **********************************************************************
// By default variables
// **********************************************************************
	//No categories are selected
	var noCatsSelected = false;
	//Zaap Button is Enabled
	var zaapButton = true;
	//"Post To Facebook" checkbox is false
	var fbchecked = false;
	//Stores the email addresses when clicked on the share event button link
	var emails;
	//This is to store the Post ID of the post to be shared / sent via email.
	var sharePostID;
	
	
// **********************************************************************
// User Details sent from Header
// **********************************************************************	
	//Stores the Username of the user
	wazaap.user = user_details.user;
	//Stores the City Name
	wazaap.place = user_details.place;
	//Stores the Date object (complete)
	var d = user_details.date;

	//Break Down the date object into parts in order to store date/month/year/day name etc. in different variables
	//Suffix as 1 (varName1) - stands for start
	//Suffix as 2 (varName2) - stands for end
	var nextSun = Date.today().next().sunday();
	
	var day1 = $.datepicker.formatDate('DD', d);
	var day2 = $.datepicker.formatDate('DD', nextSun);
	var date1 = $.datepicker.formatDate('dd', d);
	var date2 = $.datepicker.formatDate('dd', nextSun);
	var mont1 = $.datepicker.formatDate('mm', d);
	var mont2 = $.datepicker.formatDate('mm', nextSun);
	var month1 = $.datepicker.formatDate('MM', d);
	var month2 = $.datepicker.formatDate('MM', nextSun);
	var year1 = $.datepicker.formatDate('yy', d);
	var year2 = $.datepicker.formatDate('yy', nextSun);

	//Setting the Date, Month and Year on WHEN? part of the Zaap-Bar as current date by default
	$(".chosenDate, .today").html(date1+" "+month1+" "+year1+" - "+date2+" "+month2+" "+year2);
	//Set the status message by default with the current date in it
	wazaap.updateStatus();
// **********************************************************************

// **********************************************************************
// Storing of all Sub Categories into an Object
// **********************************************************************
		//This variable will store all the subcategories as KEY => VALUE pair
		//THIS IS AN OBJECT NOT AN ARRAY
		defaultAllSubCats = {};
				
		//This variable stores the default sub categories for adding sub cats on the Zaap-Bar
		//Do NOT DELETE THIS
		subCats = everything[0];

		//This variable will store all the subcategories as ID => NAME pair in array format
		$.each(everything[0], function(i, v) {
			$.each(v, function(i, v) {
				defaultAllSubCats[v.id] = v.name;
			})
		})
// **********************************************************************
	
// **********************************************************************
// Storing of all Sub Categories into an Object
// **********************************************************************
		//All the default Parent Categories
		defaultAllParentCats = {};
		//This variable will store all the subcategories as ID => NAME pair in array format
		$.each(everything[1], function(i, v) {
			defaultAllParentCats[i] = v;
		})
// *********************************************************************

	$("#single-post-image").error(function(){
		alert(10);
		$(this).parent().remove();
	})
	
	$(".singleAtt").error(function(){
		alert(10);
		$(this).remove();
	})
// **********************************************************************
// Variables that are not needed as of now
// **********************************************************************
	//wazaap.monthArr = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	//wazaap.rangeStart = true;
	//wazaap.dateStart = '';
	//wazaap.dateEnd = '';
	wazaap.month = $.datepicker.formatDate('M', d);
	wazaap.date = $.datepicker.formatDate('d', d);
	wazaap.year = $.datepicker.formatDate('yy', d);
// *********************************************************************

	$("#example").multiselect();
	wazaap.selected = [];
	wazaap.repush = wazaaprepush;
	wazaap.isWC = true;
	wazaap.isWhC = true;
	//Set the current date everywhere
	
	


// **********************************************************************
// Function: Share Button for events 
// **********************************************************************
	$(".share").click(function() {
		sharePostID = $(this).attr("id").substr(6);
		if(hide) {
			var foo = '<div class="shareBox"><div class="share_details">\
							<div><input type="text" /><button class="addEmail"></button></div>\
						</div>\
						<div class="buttons">\
							<input type="button" value="Cancel" class="cancelShare" />\
							<input type="button" value="Send" class="sendEmail" />\
						</div></div>';
			$(this).parent().append(foo);
		}
		else {
			$(".cancelShare").click();
		}
		hide = !hide;
	})
	
	function validEmail(email) {
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if(emailPattern.test(email)) {
			return true;
		}
		else {
			return false;
		}
	}

	$(".addEmail").live("click",function() {
		var elem = $("<div><input type='text' /><button class='addEmail'></button></div>");

		if($(this).parent().children().eq(0).val() != "" && validEmail($(this).parent().children().eq(0).val())) {
			$(".share_details").append(elem);
			$(this).attr("class", "removeEmail");
			$(this).parent().children().eq(0).css("border-color", "#666");
		}
		else {
			alert("This is not a valid Email");
			$(this).parent().children().eq(0).css("border-color", "red");
		}
		elem.children().eq(0).focus();
	})
			
	$(".removeEmail").live("click",function() {
		$(this).parent().remove();
	})
	
	$(".sendEmail").live("click", function() {
		emails = [];
		if($(".share_details").children().last().children().eq(0).val() != "" && validEmail($(".share_details").children().last().children().eq(0).val())) {
			$.each($(".share_details").children(), function(i, v) {						
				emails.push($(v).children().eq(0).val());
			})
			$(".share_details").children().last().children().eq(0).css("border-color", "#666");
		}
		else {
			alert("This is not a valid Email");
			$(".share_details").children().last().children().eq(0).css("border-color", "red");
		}
		$(this).parent().parent().hide();
		//Finally send the email to the selected emails
		//Sned emails via ajax		
		$.ajax({
			url: TEMPLATE_URL+'/../../plugins/theme_actions/ajaxUrl.php',
			type: 'POST',
			dataType: 'JSON',
			data: {
				'action'		: 'sendEmail',
				'emailIDs'		: emails,
				'sharePostID'	: sharePostID
			},
			success: function(data) {
				//Append the number of emails sent on the share button for this user.
				//If user is logged in, append it with the number else simply write "Share" or show a message that can only be done by logged in users
				if(data.loggedin == true) {
					$("#share-"+data.sharePostID).text("Share ("+data.emailSentCount+")");
				}
				else {
					//alert(data.msg);
					tooltipMsgShow(data.msg);
				}
			}
		})
	})
	
	var hide = true;
	
	$(".cancelShare").live("click", function() {
		hide = !hide;
		$(this).parent().parent().hide();
		$(".share_details").remove();
		$(".buttons").remove();
	})
	
// **********************************************************************
// END: Share Button for Events	
// **********************************************************************

//*********************************************************************
// Put Categories From Session
//*********************************************************************
	var mainCats = "";
	var attr = '';
	var categories_selected = '';

	var categoriz=  {'3':'Loot!','4':'Nightlife','5':'Offbeat','6':'Challenges','7':'My|Box'};	
	
	category_length = sessionData.catIDs.length-1;
	
	$.each(sessionData.catIDs, function(k,v){
		
		if(k==category_length){
			attr = 'margin-right:10px !important';			
			categories_selected += " and " + categoriz[v];
		}else if(k == (category_length-1)){
			categories_selected += categoriz[v];
		}else{
			categories_selected += categoriz[v] + ", ";
		}
			
		category_main = '<div style="margin:0 0 10px 10px;'+attr+'" class="left cats real-title cate-'+v+'"><div id="cat-'+v+'" class="left the_title">'+categoriz[v]+'</div><div class="left cats-up"><span id="cat_sel_'+v+'">All</span></div></div>';
		mainCats += category_main;
		
	})

	$("div.categories").html(mainCats);
	
	status_text = "interested in "+ categories_selected + "";
	$("div.tag-line h2").text(status_text);
	
	var date_range = "";
	
	date_range_start = Date.parse(sessionData.startMonth + "/" + sessionData.startDate + "/" + sessionData.startYear);
	date_range_end =  Date.parse(sessionData.endMonth + "/" + sessionData.endDate + "/" + sessionData.endYear);
	
	if(sessionData.startDate == sessionData.endDate && sessionData.startMonth == sessionData.endMonth && sessionData.startYear == sessionData.endYear) {
		//Its a single Date
		date_range = $.datepicker.formatDate("d MM yy", date_range_start);
	}
	else {
		date_range = $.datepicker.formatDate("d MM yy", date_range_start)+" - "+$.datepicker.formatDate("d MM yy", date_range_end);
	}
	
	$(".statusmsg").val(wazaap.user + " is " + status_text + "@ San Francisco for this " + date_range);
	$(".today").text(date_range);
	$(".chosenDate").text(date_range);
	
// **********************************************************************
// END: Categories back from session
// **********************************************************************

// **********************************************************************
// FUNCTION: Thumbs Up
// **********************************************************************

$('.thumb').click(function() {
	var clicked_ele = $(this);
	//Get the post ID of the thumb
	var post_id = $(this).attr('id').substr(3);
	
	//Means, I have already voted this post, so now that I have already clicked, I un-vote
	if($(this).hasClass('i_voted'))
	{
		//~ I have already voted
		i_voted = true;
	}
	else
	{
		//~ I haven't voted yet
		i_voted = false;
	}
	
	$.ajax({
		//You need to send the information to the server via Ajax (below line)
		data: { 'i_voted' : !i_voted, 'post_id' : post_id, 'action': 'thumbsup' },
		url: TEMPLATE_URL+'/../../plugins/theme_actions/ajaxUrl.php',
		type: 'POST',
		dataType: 'json',
		
		success:function(data) {
			if(data.success) {
				if(data.total_votes == 0) {
					$('#count_'+post_id).html("")
				}
				else {
					$('#count_'+post_id).html(data.total_votes)
				}
				//~ data.total_votes = (data.total_votes==0)?'':data.total_votes
				//~ $('#count_'+post_id).html(data.total_votes)
				
				if(i_voted)
					clicked_ele.removeClass('i_voted')
				else
					clicked_ele.addClass('i_voted')
			}
			else
				//alert(data.reason)
				tooltipMsgShow(data.reason)
		}
	})
})

// **********************************************************************
// END: Thumbs Up
// **********************************************************************


// **********************************************************************
// FUNCTION: RSVP
// **********************************************************************

$('.countMeIn').click(function() {
	var clicked_ele = $(this);
	//Get the post ID of the rsvp
	var post_id = $(this).attr('id').substr(5);
	
	//Means, I have already rsvp-ed this post, so now that I have already clicked, I un-rsvp
	if($(this).hasClass('i_rsvp')) {
		//~ I have rsvp-ed
		i_rsvp = true;
	}
	else {
		//~ I haven't rsvp-ed yet
		i_rsvp = false;
	}
	
	$.ajax({
		//You need to send the information to the server via Ajax (below line)
		data: { 'i_rsvp' : !i_rsvp, 'post_id' : post_id, 'action': 'rsvp' },
		url: TEMPLATE_URL+'/../../plugins/theme_actions/ajaxUrl.php',
		type: 'POST',
		dataType: 'json',
		
		success:function(data) {
			if(data.success) {
				//console.log($('#rsvp-'+post_id).text());
				if(data.total_rsvp == 0) {
					$('#rsvp-'+post_id).text("Count Me In")
				}
				else {
					$('#rsvp-'+post_id).text("Count Me In "+data.total_rsvp)
				}
				
				if(i_rsvp)
					clicked_ele.removeClass('i_rsvp')
				else
					clicked_ele.addClass('i_rsvp')
			}
			else
				//alert(data.reason)
				tooltipMsgShow(data.reason);
		}
	})
})

// **********************************************************************
// END: RSVP
// **********************************************************************


// **********************************************************************
// FUNCTION: Disable the Zaap Button when there is no text in it
// **********************************************************************
	$(".statusmsg").keyup(function() {
		if($(this).val().length == 0) {
			$(".zaap-it img").attr("src", TEMPLATE_URL+"/images/zaap-it-disabled.png")
			zaapButton = false;
		}
		else  {
			$(".zaap-it img").attr("src", TEMPLATE_URL+"/images/zaap-it.png")
			zaapButton = true;
		}
	})
// **********************************************************************

// **********************************************************************
// FUNCTION: WHEN? part of the Zaap-Bar
// **********************************************************************
	$(".toda").click(function() {
		$(".chosenDate").html($.datepicker.formatDate('d', d) + " " + $.datepicker.formatDate('M', d) + " " + $.datepicker.formatDate('yy', d));
		$(".todTom").html("Today");
		//When a single date is selected, both the start and end date would be the same
		date1 = $.datepicker.formatDate('dd', d);
		date2 = $.datepicker.formatDate('dd', d);
		day1 = $.datepicker.formatDate('DD', d);
		day2 = $.datepicker.formatDate('DD', d);
		mont1 = $.datepicker.formatDate('mm', d);
		mont2 = $.datepicker.formatDate('mm', d);
		month1 = $.datepicker.formatDate('MM', d);
		month2 = $.datepicker.formatDate('MM', d);
		year1 = $.datepicker.formatDate('yy', d);
		year2 = $.datepicker.formatDate('yy', d);
		wazaap.updateStatus();
	})
	
	
	
	$(".tomo").click(function() {
		var tomorrow = new Date().add(1).day();
		tomorrow = new Date(tomorrow);
		$(".chosenDate, .today").html(tomorrow.getDate() + " " + $.datepicker.formatDate('M', tomorrow) + " " + tomorrow.getFullYear());
		$(".todTom").html("");
		wazaap.updateStatus();
		//When a single date is selected, both the start and end date would be the same
		date1 = $.datepicker.formatDate('dd', tomorrow);
		date2 = $.datepicker.formatDate('dd', tomorrow);
		day1 = $.datepicker.formatDate('DD', tomorrow);
		day2 = $.datepicker.formatDate('DD', tomorrow);
		mont1 = $.datepicker.formatDate('mm', tomorrow);
		mont2 = $.datepicker.formatDate('mm', tomorrow);
		month1 = $.datepicker.formatDate('MM', tomorrow);
		month2 = $.datepicker.formatDate('MM', tomorrow);
		year1 = $.datepicker.formatDate('yy', tomorrow);
		year2 = $.datepicker.formatDate('yy', tomorrow);
	});
	
	$(".wend").click(function() {
		var sat = Date.today().next().saturday();
		var sun = Date.today().next().sunday();
		day1 = $.datepicker.formatDate('DD', sat);
		day2 = $.datepicker.formatDate('DD', sun);
		date1 = $.datepicker.formatDate('dd', sat);
		date2 = $.datepicker.formatDate('dd', sun);
		mont1 = $.datepicker.formatDate('mm', sat);
		mont2 = $.datepicker.formatDate('mm', sun);
		month1 = $.datepicker.formatDate('MM', sat);
		month2 = $.datepicker.formatDate('MM', sun);
		year1 = $.datepicker.formatDate('yy', sat);
		year2 = $.datepicker.formatDate('yy', sun);
		sat = new Date(sat);
		sun = new Date(sun);
		$(".chosenDate, .today").html($.datepicker.formatDate('d', sat) + " " + $.datepicker.formatDate('M', sat) + " " + $.datepicker.formatDate('yy', sat) +" - "+ $.datepicker.formatDate('d', sun) + " " + $.datepicker.formatDate('M', sun) + " " + $.datepicker.formatDate('yy', sun));
		$(".todTom").html("");
		wazaap.updateStatus();
	});
	
	$(".tweek").click(function() {
		var nextSun = Date.today().next().sunday();
		
		day1 = $.datepicker.formatDate('DD', d);
		day2 = $.datepicker.formatDate('DD', nextSun);
		date1 = $.datepicker.formatDate('dd', d);
		date2 = $.datepicker.formatDate('dd', nextSun);
		mont1 = $.datepicker.formatDate('mm', d);
		mont2 = $.datepicker.formatDate('mm', nextSun);
		month1 = $.datepicker.formatDate('MM', d);
		month2 = $.datepicker.formatDate('MM', nextSun);
		year1 = $.datepicker.formatDate('yy', d);
		year2 = $.datepicker.formatDate('yy', nextSun);
		$(".chosenDate, .today").html($.datepicker.formatDate('d', d) + " " + $.datepicker.formatDate('M', d) + " " + $.datepicker.formatDate('yy', d) +" - "+ $.datepicker.formatDate('d', nextSun) + " " + $.datepicker.formatDate('M', nextSun) + " " + $.datepicker.formatDate('yy', nextSun));
		$(".todTom").html("");
		wazaap.updateStatus();
	});

	$(".change-when").click(function() {
		$(".toda, .tomo, .wend, .cal-icon, .tweek").toggle();
		//$(this).html("Cancel");
		if(wazaap.isWC){
			$(this).html("Cancel");
		}
		else{
			$(this).html("Change");
		}
		if($('.cal-icon').css("display") == "inline") {
			$('#date-range-thing').dateRange({
				selected: function(dates) {
					var from = dates[0];
					var to = dates[1];
					if(to == undefined) {
						$(".chosenDate, .today").html($.datepicker.formatDate('d', from) + " " + $.datepicker.formatDate('M', from) + " " + $.datepicker.formatDate('yy', from));
						$(".todTom").html("");
						date1 = $.datepicker.formatDate('dd', from);
						date2 = $.datepicker.formatDate('dd', from);
						day1 = $.datepicker.formatDate('DD', from);
						day2 = $.datepicker.formatDate('DD', from);
						mont1 = $.datepicker.formatDate('mm', from);
						mont2 = $.datepicker.formatDate('mm', from);
						month1 = $.datepicker.formatDate('MM', from);
						month2 = $.datepicker.formatDate('MM', from);
						year1 = $.datepicker.formatDate('yy', from);
						year2 = $.datepicker.formatDate('yy', from);
					}
					else {
						$(".chosenDate, .today").html($.datepicker.formatDate('d', from) + " " + $.datepicker.formatDate('M', from) + " " + $.datepicker.formatDate('yy', from) +" - "+ $.datepicker.formatDate('d', to) + " " + $.datepicker.formatDate('M', to) + " " + $.datepicker.formatDate('yy', to));
						$(".todTom").html("");
						date1 = $.datepicker.formatDate('dd', from);
						date2 = $.datepicker.formatDate('dd', to);
						day1 = $.datepicker.formatDate('DD', from);
						Allday2 = $.datepicker.formatDate('DD', to);
						mont1 = $.datepicker.formatDate('mm', from);
						mont2 = $.datepicker.formatDate('mm', to);
						month1 = $.datepicker.formatDate('MM', from);
						month2 = $.datepicker.formatDate('MM', to);
						year1 = $.datepicker.formatDate('yy', from);
						year2 = $.datepicker.formatDate('yy', to);
					}
					wazaap.updateStatus();
				}
			});
		
			var offset = $( "#datepicker" ).position();
			//$(".ui-datepicker").css({'position':'absolute','left':(offset.left-0)+'px','top':(offset.top+20)+'px','display':'none'});
		}
		wazaap.isWC = !wazaap.isWC;
	})
	
	$("#datepicker").live('click' ,function() {
		$(".ui-datepicker").toggle("slow");
		$(document).not('.ui-datepicker').bind('click', abc)
	})
	
	$(".toda, .tomo, .wend, .chosenDate, .tweek").click(function() {
		var str = $(this).text();
		str = str.substr(2);
		wazaap.date = str;
		wazaap.updateStatus();
		$(".change-when").click();
	})
// **********************************************************************
// END: WHEN? part of the Zaap-Bar
// **********************************************************************
	
// **********************************************************************
// FUNCTION: Custom Alert Message
// **********************************************************************
	$(".tooltip-close").live('click', function() {
		$(this).parent().parent().remove();
	})
	
	$("#login-tooltip").live('click', function(){
		$("a.fb_button").click();
		$(this).parent().parent().parent().parent().remove();
	})
	
	function tooltipMsgShow(msg) {
		var msg_temp = $('<div class="tooltip-container"><div class="tooltip "><a class="tooltip-close"></a><p class="tooltip-header">You must login to wazaap.</p><div class="tooltip-body">'+msg+'</div><ul class="tooltip-actions group"><li><a class="btn btn-primary" href="javascript:void(0)">Join Wazaap!</a></li><li><a class="btn btn-default" id="login-tooltip" href="javascript:void(0)">Login</a></li><li class="clear fnone"></li></ul></div></div>');
		$('body').append(msg_temp);
		$(msg_temp).show();
		//hide_this = false;
	}
	
	
// **********************************************************************
// FUNCTION: Check if "Post to FB" is true of false. Flag
// **********************************************************************
	$(".checkbox, .post-fb").toggle(
		function(){
			$(".checkbox").css({'background-position':'-13px 0'});
			fbchecked = true;
		},
		function() {
			$(".checkbox").css({'background-position':'0 0'});
			fbchecked = false;
		}
	)


	if($(".categories").children().length == 0) {
		$(".add-new").css({'margin-left':'0px'})
	}

	











	
	
	
		
	$.fn.center = function (notop) {
		this.css("position", "absolute");
		if(notop=="notop") {
			this.css("top", "0 px");
		}else{
			this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
		}
		this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
		return this;
	}

	
	$(".brand").center("notop");
	$(window).resize(function() {
	  	$(".brand").center("notop");	
	});
	wazaap.hoverEffects();
	if($(".box2").length){
		wazaap.generateMenu();
	}
	
	if($(".box1").length){
		wazaap.loadContents();
	}
	
	wazaap.indiBox();
	wazaap.zaapExpand();
	wazaap.addnew();
	//wazaap.addToTop();
	wazaap.removeSubs();
	wazaap.done();
	wazaap.statusVars();
	wazaap.the_title();
	//wazaap.addcategories();
	
	//Remove the image if it has any errors
	

	
	
	$(".sidebar-category a img").error(function(){
		$(this).parent().remove();
	})
	//$(".tag-line h2").click();
	
// **********************************************************************
// FUNCTION: Cancel button on WHEN?
// **********************************************************************
	$(".cancel-loc").click(function() {
		
		//~ $(".whereis span:eq(1), .whereis span:eq(2), button").toggle();
		$("button.ui-multiselect").toggle();
		$(this).css("display","inline");
		if(wazaap.isWhC){
			$(this).html("Cancel");
		}
		else{
			$(this).html("Change");
		}
		wazaap.isWhC = !wazaap.isWhC;
	})
// **********************************************************************

// **********************************************************************
// FUNCTION: When Zaap-It Button is clicked on Zaap-bar
// **********************************************************************
	$(".zaap-it").click(function(e) {
		//Incomplete
		//windows.location.replace("http://wazaap/");
		
		//When I click on Zaap-It Button, first thing to check is
		//If the zaap button itself is disabled, DO NOTHING
		if(!zaapButton) {
			//Disable the zaap button
			e.preventDefault();
		}
		//Do everything else only if the Zaap Button is enabled
		else {
			
			// **********************************************************************
			// FUNCTION: Selection of Sub Category IDs based on what the user has selectedsessionData
			// **********************************************************************		
			//Check if any category is selected

			if($(".categories").children().length == 0) {
//If nothing is selected at all.
				noCatsSelected = true;
				//Assign the default Parent Cat IDs to selectedSubCatIDs i.e. all
				//Since, it would be selected via the Parent Cat directly
				selectedSubCatIDs = new Array();				
				$.each(defaultAllParentCats, function(i, v) {
					selectedSubCatIDs.push(i);
				})
			}
			if($(".categories").children().length == 1) {
//Just 1 Parent Category
				noCatsSelected = false;
				//~ goToCategoryPage = true;
				//~ Take them to the Category Page
				//We have already defined this variable but we need to empty them and thus, creating them again.
				selectedSubCatIDs = new Array();
				
				//We have already defined this variable but we need to empty them and thus, creating them again.
				selectedParentCatIDs = new Array();
				
				$.each($(".categories").children(), function(i, v) {
					
					//Here we check for the 1st sub category selected for this particular parent category.
					alll = $(v).children(".cats-up").children("span").eq(0);
					if(alll.html() == "All") {
						//If the 1st element selected is "All" then...
						//Simply store this parent ID into selectedSubCatIDs variable
						selectedSubCatIDs.push($(v).children().eq(0).attr("id").substr(4));
					}
					else {
						//If the 1st element selected is NOT "All" then...
						//Store the parent Category ID into selectedParentCatIDs variable
						selectedParentCatIDs.push($(v).children().eq(0).attr("id").substr(4));
						
						//Simply take the IDs of the sub category IDs of each selected one's and store it in selectedSubCatIDs variable
						$.each($(this).children().eq(1).children(), function(i, v) {
							//alert(1)
							sscid = $(v).attr("id").substr(8, $(v).attr("id").length);
							//alert(2)
							selectedSubCatIDs.push(sscid);
						})
					}
				})
			}
			if($(".categories").children().length > 1) {
//More than 1 Parent Category
				noCatsSelected = false;
				selectedSubCatIDs = new Array();
				selectedParentCatIDs = new Array();
				$.each($(".categories").children(), function(i, v) {
					
					//Also store the Parent Category ID into selectedParentCats variable
					selectedParentCatIDs.push($(v).children().eq(0).attr("id").substr(4));
					
					alll = $(v).children(".cats-up").children("span").eq(0);
					if(alll.html() == "All") {
						//If the 1st element selected is "All" then...
						//Simply store this parent ID into selectedSubCatIDs variable
						selectedSubCatIDs.push($(v).children().eq(0).attr("id").substr(4));
					}
					else {
						//If the 1st element selected is NOT "All" then...
						//Take the IDs of each Parent Category's Sub Category and store it in selectedSubCatIDs variable
						$.each($(v).children(), function(i, v) {
							if(i != 0) {				
								$.each($(v).children(), function(i, v) {
									sscid = $(v).attr("id").substr(8, $(v).attr("id").length);
									selectedSubCatIDs.push(sscid);
								})
							}
						})
					}
				})
			}

			
			// **********************************************************************
			// END: Selection of Sub Category IDs based on what the user has selected
			// **********************************************************************
			$.ajax({
				url: TEMPLATE_URL+'/../../plugins/theme_actions/ajaxUrl.php',
				type: 'POST',
				dataType: 'JSON',
				data: {
					'action' 					: 'showHomePosts',
					'selectedDate1'			: date1,
					'selectedDate2'			: date2,
					//~ 'selectedDayName1'		: day1,
					//~ 'selectedDayName2'		: day2,
					'selectedMonthNum1'		: mont1,
					'selectedMonthNum2'		: mont2,
					//~ 'selectedMonthName1'	: month1,
					//~ 'selectedMonthName2'	: month2,
					'selectedYear1'			: year1,
					'selectedYear2'			: year2,
					//~ 'selectedParentCatIDs'	: selectedParentCatIDs,
					'selectedSubCatIDs'			: selectedSubCatIDs,
					//~ 'selectedSubCats'		: selectedSubCats,
					//~ 'chosenDate'			: $(".chosenDate").text(),
					//~ 'user'					: wazaap.user,
					//~ 'currentDate'			: wazaap.date,
					//~ 'currentMonth'			: wazaap.month,
					//~ 'currentYear'			: wazaap.year,
					//~ 'currentDateEnd'		: wazaap.dateEnd,
					//~ 'currentMonthEnd'		: wazaap.monthEnd,
					//~ 'currentYearEnd'		: wazaap.yearEnd,
					//~ 'currentTime'			:
					//~ 'currentTimeZone'		: 
					'currentCity'			: $(".curr-city").text(),
					'neighbourhoods'		: checkedValues,
					'statusMsg'				: $(".statusmsg").val(),
					'postToFB'				: fbchecked
				},
				error: function(a, b, c) {
					//alert(a.responseText);
					//alert(b);
					//alert(c);
				},
				success: function(data) {
					//categories_selected=''
					//status_text = "interested in "+ categories_selected + "";
					
					
					var messgs = $(".statusmsg").val().split("is");					
					$("div.tag-line h2").text(messgs[1].substr(0,40) + "...");
					
					//$("div.tag-line h2").text(status_text);
					
					if(typeof sessionData.page!='undefined' && (sessionData.page=='category' || sessionData.page=='single')){
						window.location=HOME_URL
					}

					//Once you get the data from theme_actions, populate the home page.

					var messgs = $(".statusmsg").val().split("is");					
					$("div.tag-line h2").text(messgs[1].substr(0,40) + "...");

					if(data == "") {
						//alert("No events available for the current selection");
						tooltipMsgShow("No events available for the current selection");
					}
					for(contents in data) {

//Successful till here
						if(data[contents].blockID == 1) {
							
							if(data[contents].boxID == 1) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 24);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 33);								
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 33);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 33);
								$(".sq1-1 h4").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq1-1 span.loc").text(data[contents].wz_address);
								$(".sq1-1 span.time").text(data[contents].wz_date);
								$(".sq1-1 span.price").text(data[contents].wz_cost);
								//$(".f-img-1").css({'background':'url('+data[contents].img_arr+') no-repeat transparent'});								
								$(".f-img-1").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b1" />');
								//alert('<img src="'+data[contents].img_arr+'" class="homepage-title-img" />')
							}
							if(data[contents].boxID == 2) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 20);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 13);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 13);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 13);
								$(".sq1-2 h5").html(data[contents].postTitle);
								$(".sq1-2 span.loc").text(data[contents].wz_address);
								$(".sq1-2 span.time").text(data[contents].wz_date);
								$(".sq1-2 span.price").text(data[contents].wz_cost);
								$(".f-img-2").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b1" />');
								
							}
							if(data[contents].boxID == 3) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 14);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 22);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 22);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 22);
								$(".sq1-3 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq1-3 span.loc").text(data[contents].wz_address);
								$(".sq1-3 span.time").text(data[contents].wz_date);
								$(".sq1-3 span.price").text(data[contents].wz_cost);
								$(".f-img-3").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b1" />');
								
							}
							if(data[contents].boxID == 4) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 26);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 16);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 16);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 16);
								$(".sq1-4 h3").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq1-4 span.loc").text(data[contents].wz_address);
								$(".sq1-4 span.time").text(data[contents].wz_date);
								$(".sq1-4 span.price").text(data[contents].wz_cost);
								$(".f-img-4").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b1" />');
							}
							
							if(data[contents].boxID == 5) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 10);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 16);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 16);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 16);
								$(".sq2-1 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-1 span.loc").text(data[contents].wz_address);
								$(".sq2-1 span.time").text(data[contents].wz_date);
								$(".sq2-1 span.price").text(data[contents].wz_cost);
								$(".f-img-5").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b1" />');
							}
							
							$(".img-b1").parent().show();
						} // End of Block 1
						
						if(data[contents].blockID == 2) {
							
							if(data[contents].boxID == 1) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 38);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 22);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 22);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 22);
								$(".sq2-7 h4").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-7 span.loc").text(data[contents].wz_address);
								$(".sq2-7 span.time").text(data[contents].wz_date);
								$(".sq2-7 span.price").text(data[contents].wz_cost);
								$(".f-img-6").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b2" />');
							}
							
							if(data[contents].boxID == 2) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 15);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 12);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 12);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 12);
								$(".sq2-9 h4").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-9 span.loc").text(data[contents].wz_address);
								$(".sq2-9 span.time").text(data[contents].wz_date);
								$(".sq2-9 span.price").text(data[contents].wz_cost);
								$(".f-img-8").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b2" />');
							}
							
							if(data[contents].boxID == 3) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 35);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 14);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 14);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 14);
								$(".sq2-8 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-8 span.loc").text(data[contents].wz_address);
								$(".sq2-8 span.time").text(data[contents].wz_date);
								$(".sq2-8 span.price").text(data[contents].wz_cost);
								$(".f-img-7").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b2" />');
							}
							
							if(data[contents].boxID == 4) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 35);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 22);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 22);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 22);
								$(".sq2-10 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-10 span.loc").text(data[contents].wz_address);
								$(".sq2-10 span.time").text(data[contents].wz_date);
								$(".sq2-10 span.price").text(data[contents].wz_cost);
								$(".f-img-9").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b2" />');
							}
							
							$(".img-b2").parent().show();
						} //End of Block 2
						
						if(data[contents].blockID == 3) {
							
							if(data[contents].boxID == 1) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 20);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 22);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 22);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 22);
								$(".sq2-11 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-11 span.loc").text(data[contents].wz_address);
								$(".sq2-11 span.time").text(data[contents].wz_date);
								$(".sq2-11 span.price").text(data[contents].wz_cost);
								$(".f-img-19").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b3" />');
							}
							
							if(data[contents].boxID == 2) {
								data[contents].postTitle	= (data[contents].postTitle).substr(0, 31);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 14);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 14);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 14);
								$(".sq2-12 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq2-12 span.loc").text(data[contents].wz_address);
								$(".sq2-12 span.time").text(data[contents].wz_date);
								$(".sq2-12 span.price").text(data[contents].wz_cost);
								$(".f-img-20").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b3" />');
							}
							
							if(data[contents].boxID == 3) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 28);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 14);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 14);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 14);
								$(".sq5-3 h3").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-3 span.loc").text(data[contents].wz_address);
								$(".sq5-3 span.time").text(data[contents].wz_date);
								$(".sq5-3 span.price").text(data[contents].wz_cost);
								$(".f-img-17").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b3" />');
							}
							
							if(data[contents].boxID == 4) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 15);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 20);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 20);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 20);
								$(".sq5-6 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-6 span.loc").text(data[contents].wz_address);
								$(".sq5-6 span.time").text(data[contents].wz_date);
								$(".sq5-6 span.price").text(data[contents].wz_cost);
								$(".f-img-18").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b3" />');
								
								
							}
							
							$(".img-b3").parent().show();
							
							
						} // End of Block 3
						
						if(data[contents].blockID == 4) {
							
							if(data[contents].boxID == 1) {
								data[contents].postTitle	= (data[contents].postTitle).substr(0, 41);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 25);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 25);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 25);
								$(".sq3-1 h3").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq3-1 span.loc").text(data[contents].wz_address);
								$(".sq3-1 span.time").text(data[contents].wz_date);
								$(".sq3-1 span.price").text(data[contents].wz_cost);
								$(".f-img-10").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b4" />');
							}
							
							if(data[contents].boxID == 2) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 25);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 12);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 12);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 12);
								$(".sq3-2 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq3-2 span.loc").text(data[contents].wz_address);
								$(".sq3-2 span.time").text(data[contents].wz_date);
								$(".sq3-2 span.price").text(data[contents].wz_cost);
								$(".f-img-11").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b4" />');
							}
							
							if(data[contents].boxID == 3) {
								data[contents].postTitle	= (data[contents].postTitle).substr(0, 24);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 11);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 11);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 11);
								$(".box4 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".box4 span.loc").text(data[contents].wz_address);
								$(".box4 span.time").text(data[contents].wz_date);
								$(".box4 span.price").text(data[contents].wz_cost);
								$(".f-img-12").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b4" />');
							}
							
							$(".img-b4").parent().show();
						} // End of Block 4
						
						if(data[contents].blockID == 5) {
							
							if(data[contents].boxID == 1) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 20);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 18);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 18);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 18);
								$(".sq5-1 h3").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-1 span.loc").text(data[contents].wz_address);
								$(".sq5-1 span.time").text(data[contents].wz_date);
								$(".sq5-1 span.price").text(data[contents].wz_cost);
								$(".f-img-13").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b5" />');
							}
							
							if(data[contents].boxID == 2) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 16);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 12);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 12);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 12);
								$(".sq5-2 h4").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-2 span.loc").text(data[contents].wz_address);
								$(".sq5-2 span.time").text(data[contents].wz_date);
								$(".sq5-2 span.price").text(data[contents].wz_cost);
								$(".f-img-15").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b5" />');
							}
							
							if(data[contents].boxID == 3) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 12);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 12);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 12);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 12);
								$(".sq5-4 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-4 span.loc").text(data[contents].wz_address);
								$(".sq5-4 span.time").text(data[contents].wz_date);
								$(".sq5-4 span.price").text(data[contents].wz_cost);
								$(".f-img-14").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b5" />');
							}
							
							if(data[contents].boxID == 4) {
								data[contents].postTitle 	= (data[contents].postTitle).substr(0, 25);
								data[contents].wz_address 	= (data[contents].wz_address).substr(0, 23);
								data[contents].wz_date 		= (data[contents].wz_date_display).substr(0, 23);
								data[contents].wz_cost 		= (data[contents].wz_cost).substr(0, 23);
								$(".sq5-5 h5").html('<a href="'+data[contents].permalink+'">'+ data[contents].postTitle+'</a>');
								$(".sq5-5 span.loc").text(data[contents].wz_address);
								$(".sq5-5 span.time").text(data[contents].wz_date);
								$(".sq5-5 span.price").text(data[contents].wz_cost);
								$(".f-img-16").html('<img src="'+data[contents].img_arr+'" class="homepage-title-img img-b5" />');
							}
							
							$(".img-b5").parent().show();
						} // End of Block 5
						
					} // End for (contents in data)
					homepageImageHandler();
				} // End success:
				
			}) // End Ajax call
		}
		
	})
	
	$(".hide-this").click(function() {
		var elem = $(this);
		var post_id = $(this).attr('id').substr(5);
		var hide_this = true;
		
		$.ajax({
			url: TEMPLATE_URL+'/../../plugins/theme_actions/ajaxUrl.php',
			data: { 'post_id' : post_id, 'hide_this' : hide_this, 'action' : 'hide' },
			type: 'POST',
			dataType: 'json',
			
			success: function(data) {
				if(data.loggedIn) {
					if(hide_this) {
						//This means, yes you can hide this post, so go ahead and hide it
						elem.parent().parent().slideUp();
					}
				}
				else {
					//~ alert(data.reason);
					$(".tooltip-container").css("display", "block");
					$(".tooltip-container").show();
					hide_this = false;
					tooltipMsgShow("");
				}
			}	
		})
	})
	
	
	$(".indiv").click(function(){
			var loca = $(this).children().eq(0).children('.desc').children().eq(0).children('a').attr('href');
			window.location = loca;
	})
	

	// check if images are not there then remove the img div from blocks.
	
	/*for(img_count=1;img_count<=18;img_count++)
	{
		img = $('.f-img-'+img_count).css('background-image');
		//console.log('url:'+img);
		img = img.substring(5,(img.length-2));
		//console.log('url:'+img);

		if(img.length)
		{
			$.ajax({url:img,type:'HEAD',context:$('.f-img-'+img_count),error:function(a,b,c){
		
				//console.log('a='+a+' b='+b+' c='+c);
				if(c=='Not Found')
				{
					//console.log('hide .f-img-'+img_count);
					//$('.f-img-'+img_count).hide();
					$(this).hide();
					$(this).siblings().css('width','100%');
				}
		
			}});
		}	
	}*/
 })
 
 
abc = function() {
	$(".ui-datepicker").hide("slow");
	$(document).unbind('click', abc)
}
 
 
 
 
 var wazaap = {
	
	handleBrokenImages : function(a){
		$(a).parent().parent().remove()
	},
	handleBrokenSingleImage : function(a){
			$(a).parent().parent().remove();
	},
	
	hoverEffects : function(){
	
	$(".sq2-2").hover(function(){
		$("div.yellow").add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/yellow-ro.png) repeat transparent'});
	},
	function() {
		$("div.yellow").add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/yellow.png) repeat transparent'});
	})
	

	$(".sq2-3").hover(function(){
		$("div.blue").add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/blue-ro.png) repeat transparent'});
	},
	function() {
		$("div.blue").add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/blue.png) repeat transparent'});
	})
	
	
	$(".sq2-4").mouseover(function(){
		$(".sq2-11, .sq2-12, .sq5-3, .sq5-6, .sq2-4").css({'background':'url('+TEMPLATE_URL+'/images/red-ro.png) repeat transparent'});
	})
	
	$(".sq2-4").mouseout(function(){
		$(".sq2-11, .sq2-12, .sq5-3, .sq5-6, .sq2-4").css({'background':'url('+TEMPLATE_URL+'/images/red.png) repeat transparent'});
	})
	
	
	$(".sq2-5").mouseover(function(){
		$(".box4, .sq3-1, .sq3-2, .sq2-5").css({'background':'url('+TEMPLATE_URL+'/images/purple-ro.png) repeat transparent'});
	})
	
	$(".sq2-5").mouseout(function(){
		$(".box4, .sq3-1, .sq3-2, .sq2-5").css({'background':'url('+TEMPLATE_URL+'/images/purple.png) repeat transparent'});
	})	
	
	
	$(".sq2-6").mouseover(function(){
		$(".sq2-6, .sq5-1, .sq5-2, .sq5-4, .sq5-5").css({'background':'url('+TEMPLATE_URL+'/images/green-ro.png) repeat transparent'});
	})
	
	$(".sq2-6").mouseout(function(){
		$(".sq2-6, .sq5-1, .sq5-2, .sq5-4, .sq5-5").css({'background':'url('+TEMPLATE_URL+'/images/green.png) repeat transparent'});
	})
	},
	
	
	//This function has been re-written in the success: part of the ajax call. See Above
	loadContents : function(){
		if(typeof(block1) != "undefined")
		{
			
			$(".sq1-1 h4").html('<a href="'+block1.box1[0].permalink+'">'+ block1.box1[0].title+'</a>');
			$(".sq1-1 span.loc").text(block1.box1[0].loc);
			$(".sq1-1 span.time").text(block1.box1[0].display_time);
			$(".sq1-1 span.price").text(block1.box1[0].price);
			//$(".f-img-1").css({'background':'url('+block1.box1[0].image+') no-repeat transparent'});
			$(".f-img-1").html('<img src="'+block1.box1[0].image+'" class="homepage-title-img img-b1"/>');
		
		
			$(".sq1-2 h5").html('<a href="'+block1.box2[0].permalink+'">'+ block1.box2[0].title+'</a>');
			$(".sq1-2 span.loc").text(block1.box2[0].loc);
			$(".sq1-2 span.time").text(block1.box2[0].display_time);
			$(".sq1-2 span.price").text(block1.box2[0].price);
			$(".f-img-2").html('<img src="'+block1.box2[0].image+'" class="homepage-title-img img-b1"/>');
			
			$(".sq1-3 h5").html('<a href="'+block1.box4[0].permalink+'">'+ block1.box4[0].title+'</a>');
			$(".sq1-3 span.loc").text(block1.box4[0].loc);
			$(".sq1-3 span.time").text(block1.box4[0].display_time);
			$(".sq1-3 span.price").text(block1.box4[0].price);
			$(".f-img-4").html('<img src="'+block1.box4[0].image+'" class="homepage-title-img img-b1"/>');
			
			$(".sq1-4 h3").html('<a href="'+block1.box5[0].permalink+'">'+ block1.box5[0].title+'</a>');
			$(".sq1-4 span.loc").text(block1.box5[0].loc);
			$(".sq1-4 span.time").text(block1.box5[0].display_time);
			$(".sq1-4 span.price").text(block1.box5[0].price);
			$(".f-img-5").html('<img src="'+block1.box5[0].image+'" class="homepage-title-img img-b1"/>');
			
			$(".sq2-1 h5").html('<a href="'+block1.box3[0].permalink+'">'+ block1.box3[0].title+'</a>');
			$(".sq2-1 span.loc").text(block1.box3[0].loc);
			$(".sq2-1 span.time").text(block1.box3[0].display_time);//block1.box3[0].time
			$(".sq2-1 span.price").text(block1.box3[0].price);
			$(".f-img-3").html('<img src="'+block1.box3[0].image+'" class="homepage-title-img img-b1"/>');
		}	
/* End Block 1 */
/* Old Block 2 */
		
		if(typeof(block2) != "undefined")
		{
			
			$(".sq2-7 h4").html('<a href="'+block2.box1[0].permalink+'">'+ block2.box1[0].title+'</a>');
			$(".sq2-7 span.loc").text(block2.box1[0].loc);
			$(".sq2-7 span.time").text(block2.box1[0].display_time);
			$(".sq2-7 span.price").text(block2.box1[0].price);
			$(".f-img-6").html('<img src="'+block2.box1[0].image+'" class="homepage-title-img img-b2"/>');
			
			$(".sq2-8 h5").html('<a href="'+block2.box3[0].permalink+'">'+ block2.box3[0].title+'</a>');
			$(".sq2-8 span.loc").text(block2.box3[0].loc);
			$(".sq2-8 span.time").text(block2.box3[0].display_time);
			$(".sq2-8 span.price").text(block2.box3[0].price);
			$(".f-img-7").html('<img src="'+block2.box3[0].image+'" class="homepage-title-img img-b2"/>');
			
			$(".sq2-9 h4").html('<a href="'+block2.box2[0].permalink+'">'+ block2.box2[0].title+'</a>');
			$(".sq2-9 span.loc").text(block2.box2[0].loc);
			$(".sq2-9 span.time").text(block2.box2[0].display_time);
			$(".sq2-9 span.price").text(block2.box2[0].price);
			$(".f-img-8").html('<img src="'+block2.box2[0].image+'" class="homepage-title-img img-b2"/>');
			
			$(".sq2-10 h5").html('<a href="'+block2.box4[0].permalink+'">'+ block2.box4[0].title+'</a>');
			$(".sq2-10 span.loc").text(block2.box4[0].loc);
			$(".sq2-10 span.time").text(block2.box4[0].display_time);
			$(".sq2-10 span.price").text(block2.box4[0].price);
			$(".f-img-9").html('<img src="'+block2.box4[0].image+'" class="homepage-title-img img-b2"/>');
		}	
/* End Block 2 */
/* Old Block 3 */
		if(typeof(block4) != "undefined")
		{	
			$(".sq3-1 h3").html('<a href="'+block4.box1[0].permalink+'">'+ block4.box1[0].title+'</a>');
			$(".sq3-1 span.loc").text(block4.box1[0].loc);
			$(".sq3-1 span.time").text(block4.box1[0].display_time);
			$(".sq3-1 span.price").text(block4.box1[0].price);
			$(".f-img-10").html('<img src="'+block4.box1[0].image+'" class="homepage-title-img img-b4"/>');
			
			$(".sq3-2 h5").html('<a href="'+block4.box2[0].permalink+'">'+ block4.box2[0].title+'</a>');
			$(".sq3-2 span.loc").text(block4.box2[0].loc);
			$(".sq3-2 span.time").text(block4.box2[0].display_time);
			$(".sq3-2 span.price").text(block4.box2[0].price);
			$(".f-img-11").html('<img src="'+block4.box2[0].image+'" class="homepage-title-img img-b4"/>');
		}	
/* End Block 3 */
/* Old Block 5 */
		
		if(typeof(block3) != "undefined")
		{	
			$(".sq2-11 h5").html('<a href="'+block3.box1[0].permalink+'">'+ block3.box1[0].title+'</a>');
			$(".sq2-11 span.loc").text(block3.box1[0].loc);
			$(".sq2-11 span.time").text(block3.box1[0].display_time);
			$(".sq2-11 span.price").text(block3.box1[0].price);
			$(".f-img-19").html('<img src="'+block3.box1[0].image+'" class="homepage-title-img img-b3"/>');
			
			$(".sq2-12 h5").html('<a href="'+block3.box2[0].permalink+'">'+ block3.box2[0].title+'</a>');
			$(".sq2-12 span.loc").text(block3.box2[0].loc);
			$(".sq2-12 span.time").text(block3.box2[0].display_time);
			$(".sq2-12 span.price").text(block3.box2[0].price);
			$(".f-img-20").html('<img src="'+block3.box2[0].image+'" class="homepage-title-img img-b3"/>');
		}
/* End Block 5 */
/* Old Block 4 */
		if(typeof(block5) != "undefined")
		{	
			$(".sq5-1 h3").html('<a href="'+block5.box1[0].permalink+'">'+ block5.box1[0].title+'</a>');
			$(".sq5-1 span.loc").text(block5.box1[0].loc);
			$(".sq5-1 span.time").text(block5.box1[0].display_time);
			$(".sq5-1 span.price").text(block5.box1[0].price);
			$(".f-img-13").html('<img src="'+block5.box1[0].image+'" class="homepage-title-img img-b5"/>');
			
			$(".sq5-4 h5").html('<a href="'+block5.box3[0].permalink+'">'+ block5.box3[0].title+'</a>');
			$(".sq5-4 span.loc").text(block5.box3[0].loc);
			$(".sq5-4 span.time").text(block5.box3[0].display_time);
			$(".sq5-4 span.price").text(block5.box3[0].price);
			$(".f-img-14").html('<img src="'+block5.box3[0].image+'" class="homepage-title-img img-b5"/>');
			
			$(".sq5-2 h4").html('<a href="'+block5.box2[0].permalink+'">'+ block5.box2[0].title+'</a>');
			$(".sq5-2 span.loc").text(block5.box2[0].loc);
			$(".sq5-2 span.time").text(block5.box2[0].display_time);
			$(".sq5-2 span.price").text(block5.box2[0].price);
			$(".f-img-15").html('<img src="'+block5.box2[0].image+'" class="homepage-title-img img-b5"/>');
			
			$(".sq5-5 h5").html('<a href="'+block5.box4[0].permalink+'">'+ block5.box4[0].title+'</a>');
			$(".sq5-5 span.loc").text(block5.box4[0].loc);
			$(".sq5-5 span.time").text(block5.box4[0].display_time);
			$(".sq5-5 span.price").text(block5.box4[0].price);
			$(".f-img-16").html('<img src="'+block5.box4[0].image+'" class="homepage-title-img img-b5"/>');
		}	
/* End Block 4 */
/* Old Block 5 */
		if(typeof(block3) != "undefined")
		{	
			$(".sq5-3 h3").html('<a href="'+block3.box3[0].permalink+'">'+ block3.box3[0].title+'</a>');
			$(".sq5-3 span.loc").text(block3.box3[0].loc);
			$(".sq5-3 span.time").text(block3.box3[0].display_time);
			$(".sq5-3 span.price").text(block3.box3[0].price);
			$(".f-img-17").html('<img src="'+block3.box3[0].image+'" class="homepage-title-img img-b3"/>');
			
			$(".sq5-6 h5").html('<a href="'+block3.box4[0].permalink+'">'+ block3.box4[0].title+'</a>');
			$(".sq5-6 span.loc").text(block3.box4[0].loc);
			$(".sq5-6 span.time").text(block3.box4[0].display_time);
			$(".sq5-6 span.price").text(block3.box4[0].price);
			$(".f-img-18").html('<img src="'+block3.box4[0].image+'" class="homepage-title-img img-b3"/>');
			
/* End Block 5 */
/* Old Block 3 */
		}	
		
		if(typeof(block4) != "undefined")
		{
			$(".box4 h5").html('<a href="'+block4.box3[0].permalink+'">'+ block4.box3[0].title+'</a>');
			$(".box4 span.loc").text(block4.box3[0].loc);
			$(".box4 span.time").text(block4.box3[0].display_time);
			$(".box4 span.price").text(block4.box3[0].price);
			$(".f-img-12").html('<img src="'+block4.box3[0].image+'" class="homepage-title-img img-b4"/>');
		}
		homepageImageHandler();
	},
	
	generateMenu : function(){
		for(i=0;i<=5;i++){
			$(".sq2-"+parseInt(i+2)+" a").text(menu[i]);
		}
	},
	
	indiBox: function(){		
		$("div.yellow").hover(
			function(){					
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/yellow-ro.png) repeat transparent'});
			},
			function(){
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/yellow.png) repeat transparent'});
			}
		)	
		
		$("div.blue").hover(
			function(){					
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/blue-ro.png) repeat transparent'});
			},
			function(){
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/blue.png) repeat transparent'});
			}
		)	
		
		$("div.red").hover(
			function(){					
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/red-ro.png) repeat transparent'});
			},
			function(){
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/red.png) repeat transparent'});
			}
		)	
		
		$("div.green").hover(
			function(){					
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/green-ro.png) repeat transparent'});
			},
			function(){
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/green.png) repeat transparent'});
			}
		)	
		
		$("div.purple").hover(
			function(){					
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/purple-ro.png) repeat transparent'});
			},
			function(){
				$(this).css({'background':'url('+TEMPLATE_URL+'/images/purple.png) repeat transparent'});
			}
		)			
	},
	
	zaapExpand : function(){
		var zaapbar_toggle = 0;
		$(".drop-down a, .tag-line h2, .close, .zaap-it").click(function(){
			if(!zaapbar_toggle) {
				$(".tag-line").hide("fast");
				if(wazaap.default_height){
					$(".brand").animate({'height':wazaap.default_height+'px'},700, function(){
						$(".zaap-bar-hide").show();
					});
				}
				else
				{
					$(".brand").animate({'height':'400px'},700, function(){
						$(".zaap-bar-hide").show();
					});
				}
				$(".drop-down img").attr("src",TEMPLATE_URL+"/images/pull-up.png");
			} else {				
				$(".zaap-bar-hide").hide();
				$(".brand").animate({'height':'96px'},700);
				$(".drop-down img").attr("src",TEMPLATE_URL+"/images/pull-down.png");
				$(".tag-line").show("fast");
			}
				
			zaapbar_toggle = !zaapbar_toggle; 
		})
		
		$("body").click(function(d,h){	
			if(d.target== this){
				if(zaapbar_toggle){
					$(".drop-down a").click();
					//zaapbar_toggle = !zaapbar_toggle; 
				}
 			}
 		})
	},
	
	addnew : function(){
	
		$(".add-new .menu li").click(function(){
			
			//This is to store the parent category id
			wazaap.cat_id = $(this).attr("id");
			cat_id = $(this).attr('className').substr(4);
			wazaap.currList = $(this);

			var before = '<div class="left fixup">\
						<div class="top-ctrl">\
							<div class="ctrls">\
							<span class="cancel">Cancel</span>\
							<span class="done"> | Done</span>\
						</div>';

			
			wazaap.data = '';
			//categoriz
			for(i in subCats[cat_id]) {
				wazaap.data += '<li class="'+ subCats[cat_id][i].id +'" class="allnone">'+subCats[cat_id][i].name+'</li>'
			}
			
			//Change in the below block to identify whether it is 'All' or something else.
			var after = '<div class="clear"></div>\
			</div>\
			<div class="clear"></div>\
				<div class="subs">\
					<ul class="cat-type">\
						<li id="the_title_'+cat_id+'" class="all">All</li>'
							+wazaap.data+
					'</ul>\
				</div>\
			</div>';

			var added = '<ul class="cats-up"></ul>';
			col = $(this).css("background-color");
			$(".add-new").css({'visibility':'hidden'});
			if(wazaap.new_width>=470){
				$(".categories").append("<br>");
			}
			$(".categories").append(before + "<div class='left cats real-title' style='background-color:"+col+" !important;)'><div class='left the_title' id='"+wazaap.cat_id+"'>"+$(this).text()+"</div><div class='left cats-up'></div></div>" + after);
			wazaap.fixup = false;
			$(".subs .cat-type li").css({'background-color':col});
			
			w=0
			if($(this).parent().parent().parent().parent().children("div:eq(0)").children("div:last-child"))
			{
				w=$(this).parent().parent().parent().parent().children("div:eq(0)").children("div:last-child").prev().outerWidth()
				//w=0
				w2=$(this).parent().parent().parent().parent().children("div:eq(0)").children("div:last-child").prev().position();
				//w2 = null
				if(w2 == null)
					w2=0
				else
					w2 = w2.left
				
				w=w+w2
				
				if(w==0)
					w=w+150
				//alert(1)
				var multit = parseInt($(".real-title").length - 1)*15;
					w = w + multit;
				//alert(2)
			}
			
			$(this).parent().parent().parent().parent().children("div:eq(0)").children("div:last-child").css({'left':w});
			if(wazaap.new_width >= 620){
				$(this).parent().parent().parent().parent().children("div:eq(0)").children("div:last-child").css({'left':'150px','top':'165px'});
			}
			
			//console.log($(this).parent().parent().parent().parent().children("div:eq(0)").children().length);
			
			var upper = $(this).parent().parent().parent().parent().children("div:eq(0)").children().children("div.top-ctrl").children().eq(1).children().eq(1);
			wazaap.upper = upper;
			$(this).parent().parent().parent().parent().children("div:eq(0)").children().children("div.subs").children("ul.cat-type").children("li").click(function(){

				tmp_id = '';
				if($(this).attr('className') != 'all'){
					tmp_id =$(this).attr('className')
				}else{
					tmp_id =$(this).attr('id').substr(10)
				}
				//~ wazaap.selected.push(tmp_id)

				
				if($(this).hasClass("all")){
					var asas = $(this);
					var sum = $(this).parent().parent().parent().children().eq(0).children().eq(1).children().eq(1).children();
					
					var color = asas.parent().parent().parent().children().eq(0).children().eq(1).css("background-color");
					//~ console.log(color)
					$.each(sum, function(i, val){
						var a  = $(val);
						$(val).remove();
						var lolo = $("<li class='' style='background-color:"+color+"'>"+a.text()+"</li>");						
						asas.parent().append(lolo);	
					})
				}

				upper.append("<span id='cat_sel_"+tmp_id+"'>"+$(this).text()+"</span>");

				$(this).remove();			
				if($(".cat-type li").length == 0) {
					$(".subs").hide();
				}
				
			});
			
			$(".real-title").css("margin-left","10px !important;");
			
			$(".the_title").unbind('click');
			$(this).css("display","none");
			
		})


		$(".add-new").click(function(){	
			$(".add-new .menu").toggle("fast");
			var arr = wazaap.repush;
			//console.log(wazaap.repush)
			for(var x in arr) {
				//console.log(x)
				if($("div#" + x).css("display") != "block"){
					$(".menu ul li#" + x).css("display","block");
				}
			}
		})
		
		$(".cancel").live('click', function(){
			$(".fixup").remove();
			$(".adup").remove();
			$(".add-new").css({'visibility':'visible'});			
			wazaap.currList.css("display", "block");
			return false;
		})
		
	},
	
	
	the_title : function(){
		$(".the_title").live('click', function(){
				var sss = $(this).parent();
				var color = sss.css('background-color');
//				console.log(color);
				sss = sss.html();
				wazaap.data = '';
				cat_id = $(this).attr('id').substr(4)				
				for(i in subCats[cat_id]){
					wazaap.data += '<li style="background-color:'+color+'" class="'+ subCats[cat_id][i].id +'">'+subCats[cat_id][i].name+'</li>'
				}
				
				if(wazaap.fixup){
					wazaap.fixup = false;
					$(this).parent().replaceWith('<div class="left fixup">\
					<div class="top-ctrl">\
					<div class="ctrls">\
					<span class="cancel">Cancel</span><span class="done"> | Done</span>\
					</div>\
					<div style="background-color: '+color+' ! important; margin-top: 5px;" class="left cats real-title">' + sss + '</div><div class="clear"></div></div><div class="clear"></div><div class="subs"><ul class="cat-type"><li style="background-color:'+color+'">All</li>'+wazaap.data+'</ul></div></div>');
					
					$(".add-new").css({'visibility':'hidden'});	
					
				}else{
					wazaap.fixup = true;
					$(".add-new").css({'visibility':'visible'});		
					$(this).parent().parent().parent(".fixup").replaceWith('<div style="background-color: '+color+' ! important; margin-top: 0pt; margin-bottom: 10px; margin-left: 10px;" class="left cats real-title">' + sss + '</div>');
				}
			})
		}, 

	
	removeSubs : function(){
		$(".cats-up span").live('click', function(){
//			console.log("clicked")
			
			
			tmp_id =$(this).attr('id').substr(8)
			wazaap.selected.pop(tmp_id)
			
			
			if($(this).parent().children().length == 1){
//				console.log("no child")
				//means this is the last item you are removing.
				var lkl = $(this);
				
				//I think it should be cats-up instead of fixup
				if($(this).parent().parent().parent().parent().hasClass("fixup")) {
				}
				else {
					
					//alert("this removed")
					lkl.parent().parent().remove();
					
					wazaap.get_cat_id = $(this).parent().parent().children().eq(0).attr('id');
					//console.log($(this).parent().prev().text())
					wazaap.repush[wazaap.get_cat_id] = $(this).parent().parent().children().eq(0).html();
					
					//console.log($(this));
					//$(".cat-type").append("<li>"+$(this).html()+"</li>")
					//wazaap.data += "<li>"+$(this).html()+"</li>";
					//Once I remove it, add it to the sub list again. Or instead of removing it, you can hide it.
				}
			}
			
			var the_parent_name = $(this).parent().parent().children().eq(0).html();
			//alert(the_parent_name);
			
			var unselect_items = $(".cat-type").parent().parent(".fixup").children().eq(0).children().eq(1).children().eq(0).html();//.parent().children().eq(0).children().eq(1).children().eq(0).html();
			
			
			//console.log(unselect_items)
			$(".subs").show();
			
			if(the_parent_name == unselect_items){
			
//			console.log("did match")
			x = $("<li>"+$(this).text()+"</li>")
			
			$(".cat-type").append(x)
			x.css("background-color",x.parent().parent().parent().children().eq(0).children().eq(1).css("background-color"));
			x.click(function(){
				wazaap.upper.append("<span>"+$(this).text()+"</span>");
				$(this).remove();			
				if($(".cat-type li").length == 0){
					$(".subs").hide();
				}
			});
		}
			
			$(this).remove();
			wazaap.updateStatus()
		})
	},
	
	done : function(){
		$(".done").live('click', function(){
			
			wazaap.selected = []
			
			$('.real-title .cats-up span').each(function()
			{
				tmp_id =$(this).attr('id').substr(8)
				wazaap.selected.push(tmp_id)
			})
			
			if($(this).parent().parent().children().eq(1).children().eq(1).children().length == 0){
				$(".cat-type li.all").click();
				//$(this).parent().parent().parent().remove();
				$(".add-new").css({'visibility':'visible'});							
			}
			
			var lol = $(this).parent().parent().children().eq(1).clone().css("margin-top","0");
			$(this).parent().parent().parent().remove();
			$(".categories").append(lol);
			$(".add-new").css("visibility","visible");
			
			if($(".categories").children().length == 1){
				//$(".real-title").css({'margin-left':'0px'})
			}else{			
				//$(".real-title").css({'margin-left':'15px'})
				//$(".real-title:first-child").css({'margin-left':'0'})
			}
			
			
			if($(".categories").children().length > 0){
				//alert($(".categories").children().length);
				$(".add-new").css({'margin-left':'15px'})
			}
			
			if(typeof wazaap.currList != 'undefined'){
				wazaap.currList.css("display","none");
			}
			//delete wazaap.currList;

			//return false;
			wazaap.updateStatus();
			var new_height = $(".zaap-bar-hide").outerHeight();
			new_height = parseInt(155 + parseInt(new_height));
			$(".brand").css({'height': new_height+ 'px'},700);
			wazaap.default_height = new_height;
			//$(".categories real-title").
			wazaap.new_width = 0;
			$('.categories .real-title').each(function(){
				wazaap.new_width += $(this).outerWidth();
			}
			)
			//alert(wazaap.new_width);
			if(wazaap.new_width >= 490){
				$(".add-new").css("margin-top","10px");
				//$(".add-new").css("margin-left","0px");
			}
			
				$(".real-title").css("margin-bottom","10px");
				$(".real-title").css("margin-left","10px");
		})
		wazaap.fixup = true;
	},
	
	statusVars : function() {
		wazaap.name = user_details.name;
		wazaap.place = user_details.place;
		wazaap.month = $.datepicker.formatDate('M', d);
		wazaap.date = $.datepicker.formatDate('d', d);
		wazaap.year = $.datepicker.formatDate('yy', d);
		wazaap.events = user_details.events;
	},
	
	updateStatus : function(){
		
		var ill = $(".categories").children().length;

		var elem = $(".categories").children();
		wazaap.events = "";
		for(i=1; i <= ill; i++){
			if(i == 1 && i == ill){
				wazaap.events = (elem.eq((i-1)).children().eq(0).text());
				break;
			}
			
			if(i == ill){
				wazaap.events += " and " +(elem.eq((i-1)).children().eq(0).text());
			}else if(i == (ill-1)){
				wazaap.events += (elem.eq((i-1)).children().eq(0).text());
			}else{
				wazaap.events += (elem.eq((i-1)).children().eq(0).text()) + ", ";
			}
		}
		wazaap.events=$.trim(wazaap.events)
		if(wazaap.events==''){
			wazaap.events = 'All'
		}
		$(".statusmsg").val(wazaap.user + " is interested in " + wazaap.events + " @ " + wazaap.place + " for this " + $(".chosenDate").text());
	}
 }
