<?php get_header(); $my_custom_field_address; ?>

<script>


	<?php
			
			if(isset($_SESSION['user_filter_details']))
			{
				$data['ajax_selectedSubCatIDs'] = isset($_SESSION['user_filter_details']['sub_cat_id'])?$_SESSION['user_filter_details']['sub_cat_id']:$homepage_categories;
				$data['ajax_selectedDate1'] = $_SESSION['user_filter_details']['start_date'];
				//echo 'session is set';
				//echo $data['ajax_selectedDate1'];
				$data['ajax_selectedMonthNum1'] = $_SESSION['user_filter_details']['start_month'];
				$data['ajax_selectedYear1'] = $_SESSION['user_filter_details']['start_year'];
				$data['ajax_selectedDate2'] = $_SESSION['user_filter_details']['end_date'];
				$data['ajax_selectedMonthNum2'] = $_SESSION['user_filter_details']['end_month'];
				$data['ajax_selectedYear2'] = $_SESSION['user_filter_details']['end_year'];
				
				if(($data['ajax_selectedYear1'].'-'.$data['ajax_selectedMonthNum1'].'-'
				.$data['ajax_selectedDate1']) < date('Y-m-d'))
				{
					$data['ajax_selectedDate1'] = date('d');
					//echo 'date is session is less than current date';
					//echo $data['ajax_selectedDate1'];
					
					$data['ajax_selectedMonthNum1'] = date('m');
					$data['ajax_selectedYear1'] = date('Y');
					$data['ajax_selectedDate2'] = date('d', strtotime('next Saturday'));
					$data['ajax_selectedMonthNum2'] = date('m', strtotime('next Saturday'));
					$data['ajax_selectedYear2'] = date('Y', strtotime('next Saturday'));
				}
			}else{
				
				$data['ajax_selectedSubCatIDs'] = $homepage_categories;
				$data['ajax_selectedDate1'] = date('d');
				//echo 'No Session ';
				//echo date('d');
				$data['ajax_selectedMonthNum1'] = date('m');
				$data['ajax_selectedYear1'] = date('Y');
				$data['ajax_selectedDate2'] = date('d', strtotime('next Saturday'));
				$data['ajax_selectedMonthNum2'] = date('m', strtotime('next Saturday'));
				$data['ajax_selectedYear2'] = date('Y', strtotime('next Saturday'));
			}			
			//Now need to set these values in the session
			$_SESSION['user_filter_details']['sub_cat_id'] = $data['ajax_selectedSubCatIDs']; 
			$_SESSION['user_filter_details']['start_date'] = $data['ajax_selectedDate1'];
			$_SESSION['user_filter_details']['start_month'] = $data['ajax_selectedMonthNum1'];
			$_SESSION['user_filter_details']['start_year'] = $data['ajax_selectedYear1'];
			$_SESSION['user_filter_details']['end_date'] = $data['ajax_selectedDate2'];
			$_SESSION['user_filter_details']['end_month'] = $data['ajax_selectedMonthNum2'];
			$_SESSION['user_filter_details']['end_year'] = $data['ajax_selectedYear2'];
			
			?>

		sessionData.page='single';
		sessionData.catIDs = <?php echo json_encode($data['ajax_selectedSubCatIDs']); ?>;
		sessionData.startDate = <?php echo $data['ajax_selectedDate1']; ?>;
		sessionData.startMonth = <?php echo $data['ajax_selectedMonthNum1']; ?>;
		sessionData.startYear = <?php echo $data['ajax_selectedYear1']; ?>;
		sessionData.endDate = <?php echo $data['ajax_selectedDate2']; ?>;
		sessionData.endMonth = <?php echo $data['ajax_selectedMonthNum2']; ?>;
		sessionData.endYear = <?php echo $data['ajax_selectedYear2']; ?>;
		sessionData.removed = <?php echo json_encode(array_diff($homepage_categories, $data['ajax_selectedSubCatIDs'])); ?>

		var wazaaprepush=[];
		<?php
			$diff=array_diff($homepage_categories, $data['ajax_selectedSubCatIDs']);
			foreach($diff as $val){
				echo " wazaaprepush['cat-{$val}']='' \n";
			}
		?>
		
		function hh(a){
			$(a).remove();
			$(".single-post-data").css("width","95%");
		}		
		
</script>
<?php
	// Get the current category
	$currentCategory = get_the_category();
	foreach($currentCategory as $cc) {
		if($cc->category_parent == 0) {
			$ccParentID = $cc->cat_ID;
			$ccParentName = $cc->name;
		}
		else {
			$ccChildID = $cc->cat_ID;
			$ccChildName = $cc->name;
		}
	}
?>
		<div class="main events">
		
			<div class="top-bar-<?php echo $ccParentID; ?>">
				<a class="eventLogo" href="<?php echo bloginfo('home'); ?>"></a>
				<h2 class="left">
					<?php
						echo "<a href='" . get_category_link($ccParentID) . "'>" . $ccParentName . "</a><a>" . $ccChildName . "</a>";
						// Store the post ID in a temporary variable. Used in relatedPosts.
						$currentPostID = get_the_ID();
					?>

				</h2>

				<span class="right prev"></span>
				<span class="right next"></span>
				<div class="clear"></div>
			</div>
			<div class="whitebg">
			
				<div class="single-post">
					<?php global $post; ?>
					<?php if (have_posts()) : while (have_posts()) : the_post();

					$im = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ) ); ?>

					<img src="<?php echo bloginfo('template_url'); ?>/timthumb.php?src=<?php echo $im[0]; ?>&w=129&h=180" class="singleAtt" id="single-post-image" onerror="javascript:hh(this);">
					<div class="single-post-data">
						
						<h4><?php the_title(); ?></h4>
						<p class="mt10"><?php echo substr(get_the_content(), 0, 150); ?>...
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom(get_the_ID());
								echo "<a class='moreLink' target='_blank' href='" . $custom_fields['WZ_web_url'][0] . "'>more</a>";
							?>
						</p>
						
						<div class="singleEventMeta">
							<?php $custom_fields = get_post_custom(get_the_ID()); ?>
							<?php
								//Display the Custom Post Values
								if($custom_fields['WZ_venue'][0] != "" || $custom_fields['WZ_address'][0] != "") {
									echo "<span class='loc eventdetail-loc'>". $custom_fields['WZ_venue'][0] . " - <br><span style='padding:0 !important; margin-top:0 !important;'>" . $custom_fields['WZ_address'][0] ."</span></span>";
									$my_custom_field_address = $custom_fields['WZ_address'][0];
								}
								if($custom_fields['WZ_date'][0] != "")
									echo "<span class='time'>". $custom_fields['WZ_date'][0] ."</span>";
								if($custom_fields['WZ_cost'][0] != "")
									echo "<span class='price'>". $custom_fields['WZ_cost'][0] ."</span>";
							?>
							<a class="zaap-it-singleEvent"></a>
						</div>
					</div><!--end .single-post-data-->
					<div class="clear"></div>
					<div>
						<p class="footnote">
							<?php
								$postDate = explode("/", get_the_time('m/j/Y/G/i'));
								$sysDate = getdate();

								if($postDate[1] == $sysDate['mday'] && $postDate[0] == $sysDate['mon'] && $postDate[2] == $sysDate['year']) {
									if($sysDate['hours'] > $postDate[3])
										$hrs = $sysDate['hours'] - $postDate[3];
									else
										$hrs = $postDate[3] - $sysDate['hours'];
							
									echo $hrs . " hours ago.";
								}
								else {
/*
									echo "Posted on " . get_the_time('m/j/Y, G:i');
*/
									$custom_fields = get_post_custom(get_the_ID());
									echo "Posted on " . get_the_time('m/j/Y, G:i') . " from " . substr($custom_fields['WZ_website'][0], 7);
								}
							?>
						</p>
						<div class="author">
							<h5><strong>Author of this Event</strong></h5>
							<?php $fb_uid = get_user_meta($post->post_author, 'fb_uid', true); ?>
							<div>
								<img class="authorPic" src="<?php echo 'http://graph.facebook.com/'. $fb_uid . '/picture'; ?>"/>
								<p class="authorName"><?php echo get_the_author(); ?></p>
							</div>
							<div class="clear"></div>
						</div>
					</div>

					<?php endwhile; endif; ?>

					<!-- Related Posts -->
				
				</div><!--END .single-post -->
				
				<?php #if(is_user_logged_in()) { ?>

					<div class="singleEventComments">
						<h4>Comments</h4>
						<!--
						<div id="fb-root"></div>
						<script src="http://connect.facebook.net/en_US/all.js#appId=7586b65d8b36a4f1ca12e8fcb53d8010&amp;xfbml=1 <http://connect.facebook.net/en_US/all.js#appId=124272674314585&amp;xfbml=1>"></script>
						<fb:comments href="<?php //echo get_permalink($post->ID); ?>" num_posts="15" width="500"></fb:comments>
						-->
						<!-- Uncomment for previous commenting system -->
						<?php include 'other-comments.php'; ?>
						<!-- Uncomment for previous commenting system -->
					</div><!--end comments-->

				<?php #} ?>

			</div>
			<?php get_sidebar(); ?>
			
		</div><!--END .whitebg -->


	<script type="text/javascript">	
		$(document).ready(function(){
			
			$("#single-post-image").error(function(){
				alert(10);
			})
			
			
			
			$('.listed li:first').before($('.listed li:last')); 
			
			   
			$('.nexxt').click(function(){
			var item_width = $('.listed li').outerWidth();
			var left_indent = parseInt($('.listed').css('margin-left')) - item_width;
			$('.listed:not(:animated)').animate({'margin-left' : left_indent},1000,function(){    
				$('.listed li:last').after($('.listed li:first')); 
				$('.listed').css({'margin-left' : '0px'});
			    }); 
			});
			
			$('.prrev').click(function(){
			    var item_width = $('.listed li').outerWidth();
			    var left_indent = parseInt($('.listed').css('margin-left')) + item_width;
			    $('.listed:not(:animated)').animate({'margin-left' : left_indent},1000,function(){    
				$('.listed li:first').before($('.listed li:last')); 
				$('.listed').css({'margin-left' : '0px'});
			    });		    
			});
			
			$(".chkbox").click(function(){
				$(".chkbox").css({'background':'url(<?php echo bloginfo('template_url') ?>/images/checkbox.png) no-repeat 0 0 transparent'})
				$(this).css({'background':'url(<?php echo bloginfo('template_url') ?>/images/checkbox.png) no-repeat scroll -13px 0 transparent'})
			})
		})
	</script>
	
	<div style="margin-top: 20px;"><?php get_footer(); ?>
