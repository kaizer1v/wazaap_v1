<?php
session_start();
global $homepage_categories_count, $homepage_categories;
$homepage_categories = array(3, 4, 5, 6, 7);
$homepage_categories_count = array('3'=>'5', '4'=>'4', '5'=>'4', '6'=>'3', '7'=>'4');
if(!class_exists('theme_actions')) {
	
	class theme_actions {
		function vote() {
			
			/* Function: Will Vote if a user hasn't liked a post
			 * 
			 * 
			 * 1.1 - First we check if the User is logged in. Proceed only if he is logged in.
			 * 		1.1.1 - This variable will h$postsUserLikeselp understand that the user's request has successfully reached the backend.
			 * 		1.1.2 - Set a flag to false. (Will be used later). To check if this user has already liked this post.
			 * 1.2 - If the user is not logged in, return a message
			 * Now, there are 2 important information that we need.
			 * 1.1.3 - Now, get the list of all posts that this user already likes and store it
			 * 1.1.4 - Get the total number of votes on this particular post
			 * 1.1.5 - Check for all the post that the user has liked against this chosen post.
			 * 		1.1.5.1 - If this post is the post that the user has already liked, set a flag to true. (See 1.1.2)
			 * 1.1.6 - If user has already liked the post, as on the records from the DB, then proceed
			 * 		1.1.6.1 - Now check if this was the post I just clicked. If yes, then you already like the post
			 * 
			 * 
			 * 1.1.7 - Means, I haven't liked this post before as on the records from the DB
			 * 
			 */
			
			global $current_user;
			
			$data = array();
			
			#Step 1.1
			if(is_user_logged_in()) {			
				
				#Step 1.1.1
				$data['success'] = true;
				
				#Step 1.1.2
				$exists = false;
				
				#Step 1.1.3
				$postsUserLikes = get_user_meta($current_user->ID, 'post_id_like', true);

				$usp = unserialize($postsUserLikes);
				#If $usp is not array, then usp = array
				if(!is_array($usp))
					$usp = array();

				#Step 1.1.4
				$data['total_votes'] = get_post_meta($_POST['post_id'], 'like_count', true);
				if(!$data['total_votes']) {
					$data['total_votes'] = 0;
				}

				#Step 1.1.5
				foreach($usp as $pul) {
					if($_POST['post_id'] == $pul) {
						#Step 1.1.5.1
						$exists = true;
						break;
					}
				}
				
				#Step 1.1.6
				if($exists) {
					#Step 1.1.6.1
					if($_POST['i_voted'] == 'true') {
						$data['reason'] = "You already like this event";
					}
					
					elseif($_POST['i_voted'] == 'false') {
						#Remove my Vote
						foreach($usp as $key => $value) {
							if($value == $_POST['post_id'])
								unset($usp[$key]);
						}
						$sp = serialize($usp);
						#If my vote already exists, delete my vote from this particular post since I clicked on it
						update_user_meta($current_user->ID, 'post_id_like', $sp);
						
						$data['total_votes']--;
						update_post_meta($_POST['post_id'], 'like_count', $data['total_votes']);
					}
				}
				#Step 1.1.7
				if(!$exists) {
					if($_POST['i_voted'] == 'true') {
						#Add my vote
						array_push($usp, $_POST['post_id']);
						$sp = serialize($usp);
						update_user_meta($current_user->ID, 'post_id_like', $sp);
						
						$data['total_votes']++;
						update_post_meta($_POST['post_id'], 'like_count', $data['total_votes']);
					}
					
					elseif($_POST['i_voted'] == 'false') {
						$data['reason'] = "You cannot unlike this event.";
					}
				}
			} #End (if user is logged in)
			
			#Step 1.2
			else {
				$data['success'] = false;
				$data['reason'] = "You must log in to do this action.";
			}
			echo json_encode($data);
		}
		
		#RSVP is for "Count Me In" Functionality
		function rsvp() {
			
			global $current_user;
			
			$data = array();
			
			if(is_user_logged_in()) {
			
				$data['success'] = true;
				$exists = false;
				$postsUserRsvp = get_user_meta($current_user->ID, 'post_id_rsvp', true);
				
				#Unserialize the array of posts that the user has rsvp-ed
				$usp = unserialize($postsUserRsvp);

				#If $usp is not array, then usp = array
				if(!is_array($usp))
					$usp = array();

				$data['total_rsvp'] = get_post_meta($_POST['post_id'], 'rsvp_count', true);

				if(!$data['total_rsvp']) {
					$data['total_rsvp'] = 0;
				}

				foreach($usp as $pul) {
					if($_POST['post_id'] == $pul) {
						$exists = true;
						break;
					}
				}

				if($exists) {
					if($_POST['i_rsvp'] == 'true') {
						$data['reason'] = "You are already counted in this event";
					}

					elseif($_POST['i_rsvp'] == 'false') {
						#Remove my rsvp
						foreach($usp as $key => $value) {
							if($value == $_POST['post_id'])
								unset($usp[$key]);
						}
						$sp = serialize($usp);
						#If my rsvp already exists, delete my rsvp from this particular post since I clicked on it
						update_user_meta($current_user->ID, 'post_id_rsvp', $sp);

						$data['total_rsvp']--;
						update_post_meta($_POST['post_id'], 'rsvp_count', $data['total_rsvp']);
					}
				}
				if(!$exists) {
					if($_POST['i_rsvp'] == 'true') {
						#Add my rsvp
						array_push($usp, $_POST['post_id']);
						$sp = serialize($usp);
						update_user_meta($current_user->ID, 'post_id_rsvp', $sp);
						
						$data['total_rsvp']++;
						update_post_meta($_POST['post_id'], 'rsvp_count', $data['total_rsvp']);
					}
					
					elseif($_POST['i_rsvp'] == 'false') {
						$data['reason'] = "You cannot be counted in this event.";
					}
				}
			} #End (if user is logged in)			
			else {
				$data['success'] = false;
				$data['reason'] = "You must log in to do this action.";
			}
			echo json_encode($data);
		}
		
		
		function sendEmail() {			
			#Get Information of this Post ID
			$postID = $_POST['sharePostID'];
			$data['sharePostID'] = $_POST['sharePostID'];
			$postToShare = get_post($postID);
			$customFields = get_post_custom($postID);
			
			#We need the current user's email address thus we need to use the global variable
			global $current_user;
			#Perform this action only when the user is logged in, else don't
			if(is_user_logged_in()) {
				$data['loggedin'] = true;
				$to = $_POST['emailIDs'];
				$totalEmails = count($_POST['emailIDs']);
				$subject = $postToShare->post_title ." at ". $customFields['WZ_address'][0] ." on ". $customFields['WZ_date'][0];
				$body = "Wazaap!\n Are you interested in checking out ".$postToShare->post_title." happening at ".$customFields['WZ_address'][0]." at ".$customFields['WZ_time_start'][0].", ".$customFields['WZ_date'][0]." ".$customFields['WZ_website'][0]." ? Lemme know!\n";
				$headers = "From: ". $current_user->first_name . " <" . $current_user->user_email . ">\r\n";
				
				if(wp_mail($to, $subject, $body, $headers)) {
					$data['msg'] = "Email sent successfully";
					
					#Get the total count of the shares for this post, add it by the number to be sent to and update it again.
					$shareCount = get_user_meta($current_user->ID, 'share_count', true);
					if($shareCount) {
					
						$unserShareCount = unserialize($shareCount);
						if(array_key_exists($data['sharePostID'], $unserShareCount)) {
							$unserShareCount[$data['sharePostID']] += $totalEmails;
							$data['emailSentCount'] = $unserShareCount[$data['sharePostID']];
						}
						else {
							$unserShareCount[$data['sharePostID']] = 0;
							$unserShareCount[$data['sharePostID']] += $totalEmails;
							$data['emailSentCount'] = $unserShareCount[$data['sharePostID']];
						}
						$serShareCount = serialize($unserShareCount);
						update_user_meta($current_user->ID, 'share_count', $serShareCount);
					}
					else {
						$unserShareCount[$data['sharePostID']] = $totalEmails;
						$serShareCount = serialize($unserShareCount);
						update_user_meta($current_user->ID, 'share_count', $serShareCount);
					}
					
					#Also update the user_meta table for storing the email addresses sent for a particular post_id
					#Serialize the array of email IDs to store in DB
					$serEmailIDs = serialize($to);
					update_user_meta($current_user->ID, 'share_emails', $serEmailIDs);
				}
				else {
					$data['msg'] = "Email could not be sent";
				}
			}
			else {
				$data['loggedin'] = false;
				$data['msg'] = "You must log in to do this action";
			}
			echo json_encode($data);
		}
		
		function hide() {
			global $current_user;
			$data = array();
			#By default, we assume that all the posts are hidden
			$hidden = true;
			
			if(is_user_logged_in()) {
				$data['loggedIn'] = true;
				
				$hiddenPosts = get_user_meta($current_user->ID, 'hidden_posts', false);
				$unh = unserialize($hiddenPosts[0]);

				foreach($unh as $hp) {
					if($_POST['post_id'] != $hp) {
						#This means, this particular post is hidden, so you can hide it
						$hidden = false;
						break;
					}
					else {
						$hidden = true;
						break;
					}
				}
				
				if($_POST['hide_this'] == true && $hidden == false) {
					#Yes you can hide this particular post, so add this do your DB
					array_push($unh, $_POST['post_id']);
					$sh = serialize($unh);
					update_user_meta($current_user->ID, 'hidden_posts', $sh);
				}
				else {
					#This condition will only run for the first time, when a user has no posts that are hidden.
					array_push($hiddenPosts, $_POST['post_id']);
					$sh = serialize($hiddenPosts);
					add_user_meta($current_user->ID, 'hidden_posts', $sh);
				}
			}
			else {
				$data['loggedIn'] = false;
				$data['reason'] = 'You must log in to do this action.';
			}
			echo json_encode($data);
		}
		
		function showHomePosts() {
			
				global $homepage_categories_count, $homepage_categories;
				//print_r($homepage_categories_count); die();
				
				$imgsizes = array(
				1 => array(
							1 => array(0 => 104, 1 => 153),
							2 => array(0 => 155, 1 => 73),
							3 => array(0 => 161, 1 => 125),
							4 => array(0 => 155, 1 => 71),
							5 => array(0 => 99, 1 => 184),
						),
				2 => array(
							1 => array(0 => 181, 1 => 83),
							2 => array(0 => 48, 1 => 105),
							3 => array(0 => 71, 1 => 120),
							4 => array(0 => 152, 1 => 98),
						),
				4 => array(
							1 => array(0 => 250, 1 => 132),
							2 => array(0 => 126, 1 => 112),
							3 => array(0 => 55, 1 => 77),
						),
				5 => array(
							1 => array(0 => 190, 1 => 74),
							2 => array(0 => 77, 1 => 123),
							3 => array(0 => 67, 1 => 84),
							4 => array(0 => 193, 1 => 60),
						),
				3 => array(
							1 => array(0 => 153, 1 => 44),
							2 => array(0 => 71, 1 => 122),
							3 => array(0 => 116, 1 => 168),
							4 => array(0 => 115, 1 => 97),
						),
			);													
			/* Now that we have the category ID, let us match which category belongs to which block on the home page */
			/* The IDs are static (Big Dependency) so simply match it with a switch case */

			/* ====================================================================================================
			 * 
			 * 
			 * Category ID	Category Name	Colour - Name		Old Category	Block ID
			 * -----------	-------------	-------------		------------	--------
			 * 			 7	My|Box			#99cc99 - Green		Entertainment	5
			 * 			 3	Loot!			#ffff66 - Yellow	Culture			1
			 * 			 4	Nightlife		#66cccc - Blue		Nightlife		2
			 * 			 5	Offbeat			#ff9966 - Red		Activity		3
			 * 			 6	Challenges		#ffccff - Purple	Community		4
			 */
			
			
			$senditem = array();
			#$data['ajax_selectedParentCats'] = $_POST['selectedParentCats'];
			$data['ajax_selectedSubCatIDs'] = $_POST['selectedSubCatIDs'];			
			
			#Start DD/MM/YYYY - All in numeric format
			$data['ajax_selectedDate1'] = $_POST['selectedDate1'];
			$data['ajax_selectedMonthNum1'] = $_POST['selectedMonthNum1'];
			$data['ajax_selectedYear1'] = $_POST['selectedYear1'];
			#End DD/MM/YYYY - All in numeric format
			$data['ajax_selectedDate2'] = $_POST['selectedDate2'];
			$data['ajax_selectedMonthNum2'] = $_POST['selectedMonthNum2'];
			$data['ajax_selectedYear2'] = $_POST['selectedYear2'];
			#Current City
			$data['ajax_currentCity'] = $_POST['currentCity'];
		
			//print_r($data);
			
			$required='';
			$selectedDate=intval($data['ajax_selectedYear1'])
				.'-'.intval($data['ajax_selectedMonthNum1'])
				.'-'.intval($data['ajax_selectedDate1']);
				
				
			foreach($data['ajax_selectedSubCatIDs'] as $key => $value){
				$value=intval($value);
				$required.="(SELECT DISTINCT post_id, starts_on, "
				."term_taxonomy_id FROM wp_lookup WHERE "
				."(starts_on>='{$selectedDate}' OR "
				."ends_on>='{$selectedDate}')"
				." AND term_taxonomy_id = {$value} "
				."ORDER BY starts_on LIMIT  ".$homepage_categories_count[$value].") union all";
			}
			$required = substr($required, 0, -10);
			//echo $required;die();
			//echo $required;
			global $wpdb;				
			$postIDs=$wpdb->get_results($required, ARRAY_A);
			
			/*
			$retrived_count=array(
							3 => 0,
							4 => 0,
							5 => 0,
							6 => 0,
							7 => 0,													
			); */
			//print_r($postIDs);die();
			$retrived_count=array();
			//print_r($homepage_categories); die();
			//print_r($homepage_categories); die();
			global $homepage_categories;
			foreach($data['ajax_selectedSubCatIDs'] as $catrgoriestocount){
				$retrived_count[$catrgoriestocount]=0;
			}
			//For counting the no of records fetched for each category
			$postIDsArray=array(); //Getting all post id, so that we can fetch all data in one query
			$postdatesarray=array(); //Storing Post Dates, so that it doesnot reads from meta data ?? can meta data and this be different?
			$postcategories=array(); //Let's cache the categories, why get_category again?
			$postincategories=array(); //caching posts according to categories, required for next block, since the end date has come			
			foreach($postIDs as $postID){
			
				if(!isset($postincategories[$postID['term_taxonomy_id']])){
					$postincategories[$postID['term_taxonomy_id']]=array();
				}
				$postincategories[$postID['term_taxonomy_id']][]=$postID['post_id'];
				
			
				$retrived_count[$postID['term_taxonomy_id']]=isset($retrived_count[$postID['term_taxonomy_id']])?
				($retrived_count[$postID['term_taxonomy_id']]+1):1;
				array_push($postIDsArray, $postID['post_id']);
				$postcategories[$postID['post_id']]=$postID['term_taxonomy_id'];
				$postdatesarray[$postID['post_id']]=$postID['starts_on'];
			}
			
			//Checking for deficit no for posts for each categories, IF less then 5.. pull ONLY remaining number
			foreach($retrived_count as $requiredcatid=>$fetchedcount){
				if($fetchedcount<5){
					$query="SELECT DISTINCT post_id, starts_on FROM wp_lookup "
					."WHERE starts_on<='{$selectedDate}' "
					."AND term_taxonomy_id = {$requiredcatid} ".(($fetchedcount==0)?'':' and post_id not in ('.implode(',', $postincategories[$requiredcatid]).') ')
					." ORDER BY starts_on DESC "
					."LIMIT ".($homepage_categories_count[$value]-$fetchedcount);
					$postIDs=$wpdb->get_results($query, ARRAY_A);
					//echo $query;die();
					foreach($postIDs as $postID){
						array_push($postIDsArray, $postID['post_id']);
						$postcategories[$postID['post_id']]="$requiredcatid";
						$postdatesarray[$postID['post_id']]=$postID['starts_on'];
						//$retrived_count[$requiredcatid]++; //Not actually of any use further
					}
				}
			}
			//print_r($postcategories);die();
			//print_r($postIDsArray);
			$posts=get_posts(array(
			'numberposts'	=> 25,			
			'post__in'=>$postIDsArray));
			//print_r($posts);
			$toSend=array();
			$boxidcounts=array();
			$senditem=array();
			foreach($posts as $post){
				$boxidcount=isset($boxidcounts[$postcategories[$post->ID]])?($boxidcounts[$postcategories[$post->ID]]+1):0;
				$boxidcounts[$postcategories[$post->ID]]=$boxidcount;
				$custom_fields=get_post_custom($post->ID);
				$imageid=get_post_thumbnail_id($post->ID);
				$toSend=array(
								'boxID'=>$boxidcount+1,
								'blockID'=>($postcategories[$post->ID]-2),
								'postTitle'=>$post->post_title,
								'wz_address'=>is_null($custom_fields['WZ_venue'][0])?'':$custom_fields['WZ_venue'][0],
								//'wz_date'=>$custom_fields['WZ_date'][0],
								'wz_date'=>is_null($postdatesarray[$post->ID])?'':$postdatesarray[$post->ID],
								'wz_date_display'=>is_null($postdatesarray[$post->ID])?'':(date('D M d', strtotime($postdatesarray[$post->ID]))),
								'wz_cost'=>is_null($custom_fields['WZ_cost'][0])?'':$custom_fields['WZ_cost'][0],
								'permalink'=>$post->post_permalink,
								'img_id'=>get_post_thumbnail_id($post->ID)
							);
							
				//$imgData = wp_get_attachment_image_src($toSend['img_id'],'block'.$toSend['blockID'].'-box'.$toSend['boxID'].'');
				//echo $imgData[0];
				//$toSend['img_arr'] = $imgData[0];
				$image=wp_get_attachment_image_src($imageid);
				//$toSend['img_arr'] = get_bloginfo('template_url').'/timthumb.php?src='
				//.$image[0].'&w='.($imgsizes[($postcategories[$post->ID]-2)]
				//[$boxidcount+1][0].'&h='.($imgsizes[($postcategories[$post->ID]-2)]
				//[$boxidcount+1][1]));
				
				$toSend['img_arr']=(is_null($image[0]) || $image[0]=='')?'':(
										get_bloginfo('template_url')
										.'/timthumb.php?src='
										.urlencode($image[0])
										.'&w='.($imgsizes[($postcategories[$post->ID]-2)][$boxidcount+1][0]
										.'&h='.($imgsizes[($postcategories[$post->ID]-2)][$boxidcount+1][1])));
				
				//print_r($toSend['img_arr']);
				$senditem[]=$toSend;
			}
			//print_r($senditem);
			echo json_encode($senditem);
			
			#Now store the selections for this particular user
			$info = array(
					'sub_cat_id'	=> $data['ajax_selectedSubCatIDs'],
					'start_date' 	=> $data['ajax_selectedDate1'],
					'start_month' 	=> $data['ajax_selectedMonthNum1'],
					'start_year' 	=> $data['ajax_selectedYear1'],
					'end_date' 		=> $data['ajax_selectedDate2'],
					'end_month' 	=> $data['ajax_selectedMonthNum2'],
					'end_year' 		=> $data['ajax_selectedYear2'],
			);
			
			$_SESSION['user_filter_details']=$info;
			if(is_user_logged_in()) {
				global $current_user;
				$serInfo = serialize($info);
				#Now update this filter criteria in user_meta table against the user_filter meta_key where UserID = current User ID
				update_user_meta($current_user->ID, 'user_filter', $serInfo);
			} 
			
		}
	}
}

$theme_actions = new theme_actions();
add_action('wp_ajax_thumbsup', array(&$theme_actions, 'vote'));
add_action('wp_ajax_rsvp', array(&$theme_actions, 'rsvp'));
add_action('wp_ajax_sendEmail', array(&$theme_actions, 'sendEmail'));
add_action('wp_ajax_hide', array(&$theme_actions, 'hide'));
add_action('wp_ajax_showHomePosts', array(&$theme_actions, 'showHomePosts'));
