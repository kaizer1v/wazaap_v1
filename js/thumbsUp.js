$(document).ready(function() {

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
					alert(data.reason)
			}
		})
	})
})
