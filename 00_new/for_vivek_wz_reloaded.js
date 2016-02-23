rezapp={}

rezapp.set_hover=function(slug, color){
  jQuery("."+slug).hover( function(){
			       jQuery(this).css({'background':'url('+TEMPLATE_URL+'/images/'+color+'-ro.png) repeat transparent'});
			  },
			  function(){
			       jQuery(this).css({'background':'url('+TEMPLATE_URL+'/images/'+color+'.png) repeat transparent'});
			  }
			)

	jQuery("#"+slug).hover(function(){
				 jQuery("."+slug).add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/'+color+'-ro.png) repeat transparent'});
			       },
			       function(){
				 jQuery("."+slug).add($(this)).css({'background':'url('+TEMPLATE_URL+'/images/'+color+'.png) repeat transparent'});
			       }
			     )

}

rezapp.display_event=function(events_list){
  for(category in events_list){
    for(event in events_list[category]){
      ele='#'+category+'-'+event;
      html='<div class="m-9">\
	     <div></div>\
	     <div class="desc">\
	     <h3>'+(events_list[category][event].title)+'</h3>\
	     <div class="metaContent">\
		<span class="loc">loc</span>\
		<span class="time">'+(events_list[category][event].date)+'</span>\
		<span class="price">price</span>\
	     </div>\
	  </div>';	
      var link=events_list[category][event].permalink
      jQuery(ele).attr('permalink', link)
      jQuery(ele).html(html)
      jQuery(ele).click(function(){window.location=jQuery(this).attr('permalink')})
    }
  }
}

rezapp.set_date_label=function(from_date, to_date){
  if(from_date.getTime()==to_date.getTime()){
    time_label=jQuery.datepicker.formatDate('d MM yy', from_date)
  }else{
    time_label=jQuery.datepicker.formatDate('d MM yy', from_date)+' - '+jQuery.datepicker.formatDate('d MM yy', to_date)
  }
  rezapp.start_date=from_date;
  rezapp.end_date=to_date;
  jQuery(".chosenDate").html(time_label);
  jQuery("span.today").html(time_label);
  rezapp.update_status()
}

rezapp.bar_height=jQuery(".brand").eq(0).outerHeight();
rezapp.bar_expanded_height=parseInt(305 + parseInt(rezapp.bar_height));
rezapp.today=new Date();
rezapp.tomorrow=new Date().add(1).day()
rezapp.saturday=(rezapp.today.getDay() == 6)?(new Date()):(Date.today().next().saturday());
rezapp.sunday=Date.today().next().sunday();
rezapp.bar_init=function(){
  jQuery('.drop-down a').click(function(){
      if(jQuery('.brand').hasClass('expanded')){
	jQuery('.zaap-bar-hide').hide()
	jQuery('.brand').removeClass('expanded').animate({'height':(rezapp.bar_height)+'px'}, 700)
	jQuery('.brand .drop-down img').attr('src', TEMPLATE_URL+'/images/pull-down.png')
	jQuery(".tag-line").show("fast");
      }else{
	jQuery('.brand').addClass('expanded').animate({'height':(rezapp.bar_expanded_height)+'px'}, 700, function(){ jQuery('.zaap-bar-hide').show() })
        jQuery('.brand .drop-down img').attr('src', TEMPLATE_URL+'/images/pull-up.png')
	jQuery(".tag-line").hide("fast");
      }
  })
  rezapp.set_date_label(rezapp.start_date, rezapp.end_date);
  jQuery(".change-when").click(function() {
      jQuery(".toda, .tomo, .wend, .cal-icon, .tweek").toggle();
  })
  jQuery('#date-range-thing').dateRange({
    'selected':function(dae){
	if(dae[1]==undefined){
	  dae[1]=dae[0]
	}
	rezapp.set_date_label(dae[0], dae[1])
     }
  })
  jQuery('.toda').click(function(){
      rezapp.set_date_label(rezapp.today, rezapp.today)
  })
  jQuery('.tomo').click(function(){
      rezapp.set_date_label(rezapp.tomorrow, rezapp.tomorrow)
  })
  jQuery('.wend').click(function(){
      rezapp.set_date_label(rezapp.saturday, rezapp.sunday)
  })
  jQuery('.tweek').click(function(){
      rezapp.set_date_label(rezapp.today, rezapp.sunday)
  })
  jQuery('.tag-line h2').click(function(){
      jQuery('.drop-down a').click()
  })
  rezapp.create_category_menu(rezapp.cat_menu)
  rezapp.update_status()

  jQuery(".statusmsg").keyup(function(){
     if($(this).val().length == 0) {
       jQuery(".zaap-it img").attr("src", TEMPLATE_URL+"/images/zaap-it-disabled.png").addClass('inactive')
     }
     else{
       jQuery(".zaap-it img").attr("src", TEMPLATE_URL+"/images/zaap-it.png").removeClass('inactive')
     }
  })
  jQuery('.zaap-it').click(function(e){
    e.preventDefault()
    if(jQuery('.zaap-it img').hasClass('inactive')){
      return 
    }
    interest_cats=[]
    jQuery('.categories div').each(function(){
      interest_cats.push($(this).attr('slug'))
    })
    jQuery.ajax({
	   'url':rezapp.ajax_url,
	   'type':'POST',
	   'data':{'action':'get_events', 'home_page':(rezapp.page=='home')?true:false, 'interest_cats':interest_cats, 'from_date':$.datepicker.formatDate('yy-m-d', rezapp.start_date), 'to_date':$.datepicker.formatDate('yy-m-d', rezapp.end_date)},
	   'dataType':'JSON',
	   'success':function(data){
	     if(data.success){
	       if(data.redirect){
	         window.location=HOME_URL;
	       }else{
	         rezapp.display_event(data.events);
	       }
	     }
	   }
    })
    jQuery('.drop-down a').click()
  })
}

rezapp.create_category_menu=function(list){
  jQuery('#cat-menu ul li').remove() 
  for(slug in list){
    jQuery('#cat-menu ul').append('<li slug="'+slug+'" class="cat-item cat-'+(slug)+'" id="cat-'+(slug)+'">'+(list[slug].label)+'</li>')
  }
  jQuery('.add-new').click(function(){
      jQuery('#cat-menu').toggle('fast')
  })
  jQuery('.cat-item').click(function(){
      jQuery(this).hide()
      var slug=jQuery(this).attr('slug')
      jQuery('.categories').append('<div slug="'+slug+'" class="left option real-title cat-'+jQuery(this).attr('slug')+'">'+jQuery(this).html()+'<span class="handel">&nbsp;</span></div>')
      rezapp.update_status()
  })
  jQuery('.categories .option .handel').live('click', function(){
      var slug=jQuery(this).parent().attr('slug')
      jQuery('#cat-menu ul li.cat-'+slug).show()
      jQuery(this).parent().remove()
      rezapp.update_status()
  })
  for(count in rezapp.selected_cat_item){
      slug=rezapp.selected_cat_item[count]
      label=jQuery('#cat-'+slug).html()
      jQuery('#cat-'+slug).hide()
      jQuery('.categories').append('<div slug="'+slug+'" class="left option real-title cat-'+slug+'">'+label+'<span class="handel">&nbsp;</span></div>')
      rezapp.update_status()
  }
}

rezapp.update_status=function(){
  var user_is=(user_details.user=='')?('I am'):((user_details.user)+" is")
  var interested_in = ''
  if(jQuery('.categories div').length==0){
    interested_in='all events'
  }else{
    eles=jQuery('.categories div.option')
    for(counter=0; counter<eles.length; counter++){
      interested_in += jQuery(eles[counter]).text()+((counter==(eles.length-2))?" and ":", ")
    }
    interested_in=interested_in.substr(0, (interested_in.length)-2)
  }
  var at=(user_details.place=='')?(''):('@ '+user_details.place)
  var when=jQuery('.chosenDate').text()
  var sentance = 'interested in '+interested_in+' '+at+' for this '+when
  jQuery('.statusmsg').val(user_is+' '+sentance)
  jQuery('.tag-line h2').html(sentance.substr(0, 40)+'...')
}


rezapp.show_post_attributes=function(attrs){
  if(attrs.i_voted){
	jQuery('.thumb').addClass('i_voted')
  }else{
	jQuery('.thumb').removeClass('i_voted')
  }

  if(attrs.like_count && attrs.like_count!='0' && attrs.like_count > 0){
        jQuery('.thumbsup-count').text(attrs.like_count)
  }else{
	jQuery('.thumbsup-count').text('')
  }
  
  if(attrs.rsvp && attrs.rsvp!='0' && attrs.rsvp > 0){
        jQuery('.countMeIn').text('Count Me In ('+(attrs.rsvp)+')')
  }else{
	jQuery('.countMeIn').text('Count Me In')
  }

  if(attrs.i_shared && attrs.i_shared!='0' && attrs.i_shared > 0){
    jQuery('.share').text('Share ('+(attrs.i_shared)+')')
  }else{
        jQuery('.share').text('Share')
  }
}
rezapp.single_page_init=function(){
  rezapp.show_post_attributes(wz_data.post_attributes)
  jQuery('.thumb').click(function(){
    data={}
    data.do=(jQuery(this).hasClass('i_voted'))?'unvote':'vote'
    data.action='voting'
    data.post_id=jQuery(this).attr('data')
    
    jQuery.ajax({
	url:rezapp.ajax_url,
	data:data,
	type:'POST',
	dataType:'JSON',
	success:function(data){
		if(data.success){
			rezapp.show_post_attributes(data.data)
		}else{
			alert(data.reason)
		}
	}
    })
  })

  jQuery('.zapper').click(function(){
  })

  jQuery('.share').click(function(){
    jQuery('.shareBox').show()
  })

  jQuery('.countMeIn').click(function(){
    data={}
    data.action='rsvp'
    data.post_id=jQuery(this).attr('data')
    jQuery.ajax({
	url:rezapp.ajax_url,
	data:data,
	type:'POST',
	dataType:'JSON',
	success:function(data){
		if(data.success){
			rezapp.show_post_attributes(data.data)
		}else{
			alert(data.reason)
		}
	}
    })

  })

  jQuery('.addEmail').click(function(){
    jQuery('.addEmail').before('<div class="emailboxwrapper"><input type="text" class="emailbox"/> <img class="removemailbox" src="'+TEMPLATE_URL+'/images/remove.png"/></div>')
    jQuery('.removemailbox').unbind('click').click(function(){
	jQuery(this).parent().remove()
    })
  })

  jQuery('.cancelShare').click(function(){
    jQuery('.shareBox').hide()
    jQuery('.emailboxwrapper').remove()
    jQuery('.emailbox').val('')
  })

  jQuery('.sendEmail').click(function(){
    var all_correct=true;
    var email_addresses=[]
    jQuery('.emailbox').each(function(){
	if(!rezapp.validEmail(jQuery(this).val())){
	  all_correct=false;
	  jQuery(this).css('borderColor', 'red')
	}else{
	  email_addresses.push(jQuery(this).val())
  	  jQuery(this).css('borderColor', '#919191')
	}
    })
    if(!all_correct){
	alert('Please enter valid email addresses.')
    }else{
	jQuery.ajax({
	url:rezapp.ajax_url,
	data:{'emails':email_addresses, 'action':'email', 'post_id':jQuery('.share').attr('data')},
	type:'POST',
	dataType:'JSON',
	success:function(data){
	if(data.success){
		rezapp.show_post_attributes(data.data)
		jQuery('.cancelShare').click()
	}else{
		alert(data.reason)
	}
	}
    	})	
    }		
  })
}

rezapp.validEmail=function(email){
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if(emailPattern.test(email)) {
    return true;
  }else {
    return false;
  }
}

rezapp.init=function(){
    rezapp.ajax_url=TEMPLATE_URL+'/../../plugins/wz_reloaded/action.php';
    rezapp.selected_cat_item=wz_data.selected_cat_item;
    rezapp.start_date=wz_data.from_date;
    rezapp.end_date=wz_data.to_date;
    rezapp.cat_menu=wz_data.cat_menu;
    rezapp.page=wz_data.page;
    rezapp.bar_init();	
    if(wz_data.page=='home'){
      for(slug in wz_data.cat_menu){
        rezapp.set_hover(slug, wz_data.cat_menu[slug]['color'])
      }
      rezapp.display_event(wz_data.events);
    }else if(wz_data.page='single'){
      rezapp.post_attributes=wz_data.post_attributes;
      rezapp.single_page_init();
    }
}

jQuery(document).ready(rezapp.init)