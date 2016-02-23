<?php get_header(); ?>

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

		sessionData.page='category';
		sessionData.catIDs = <?php echo json_encode($data['ajax_selectedSubCatIDs']); ?>;
		sessionData.startDate = <?php echo $data['ajax_selectedDate1']; ?>;
		sessionData.startMonth = <?php echo $data['ajax_selectedMonthNum1']; ?>;
		sessionData.startYear = <?php echo $data['ajax_selectedYear1']; ?>;
		sessionData.endDate = <?php echo $data['ajax_selectedDate2']; ?>;
		sessionData.endMonth = <?php echo $data['ajax_selectedMonthNum2']; ?>;
		sessionData.endYear = <?php echo $data['ajax_selectedYear2']; ?>;
		
		
		var wazaaprepush=[];
		<?php
			$diff=array_diff($homepage_categories, $data['ajax_selectedSubCatIDs']);
			foreach($diff as $val){
				echo " wazaaprepush['cat-{$val}']='' \n";
			}
		?>
		
		
</script>

<?php 
	// Gets the Current Category
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
<div class="main">
		<div class="container">
			<div class="inner-page">
				<div class="top-bar-<?php echo $ccParentID; ?>">
					<a class="eventLogo" href="<?php echo bloginfo('home'); ?>"></a>
					<h2><?php echo single_cat_title('', false ); ?></h2>
					<div class="clear"></div>
				</div>
				
<?php
	$allUserPostIDs = array();
	global$wpdb;
	//Get all the distinct post_ids where starts_on>= userfilter date
	$userPostIDs = $wpdb->get_results("SELECT DISTINCT post_id FROM wp_lookup WHERE starts_on>='".$userStartYear.'-'.$userStartMonth.'-'.$userStartDay."' AND term_taxonomy_id=".$ccParentID." ORDER BY starts_on" );
	foreach($userPostIDs as $pids) {
		array_push($allUserPostIDs, $pids->post_id);
	}
?>

<?php
		$wp_query = new WP_Query();
		$wp_query->query(array('post__in'=>$allUserPostIDs, 'showposts'=>10, 'paged'=>$_GET['paged']));
?>				
	<?php if ($wp_query->have_posts()) : while ($wp_query->have_posts()) : $wp_query->the_post(); ?>
				<div class="category-post-<?php echo $ccParentID; ?>">
					<?php
						if (has_post_thumbnail()) { 
						$im = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ) );
					?>
						<div class="post-image sliderhw">
							<a href="<?php the_permalink(); ?>" class="post-title">
								<img src="<?php echo bloginfo('template_url'); ?>/timthumb.php?src=<?php echo $im[0]; ?>&w=129&h=180" class="singleAtt" onerror="javascript:wazaap.handleBrokenSingleImage(this);"/>
							</a>
						</div>					
					<?php } ?>
					
					<div class="post-data">
						<h4>
							<a href="<?php the_permalink(); ?>" class="post-title">
								<?php the_title(); ?>
							</a>
						</h4>
						<p><?php echo substr(get_the_content(), 0, 100); ?>...</p>
						<div class="categorylist-meta-cont">
						<?php $custom_fields = get_post_custom(get_the_ID()); ?>
						<?php
							if($custom_fields['WZ_venue'][0] != "" || $custom_fields['WZ_address'][0] != "") {
								echo "<span class='loc catlist-loc'>" . $custom_fields['WZ_venue'][0] ."<br><span style='text-indent:20px;margin:0 !important'>". $custom_fields['WZ_address'][0]. "</span></span>";
							}
							if($custom_fields['WZ_date'][0] != ""){
								//echo $custom_fields['WZ_date'][0];
								if($custom_fields['WZ_date'][0] == date('D n/d')){
									echo "<span class='time'>Today</span>";
								}else{
									echo "<span class='time'>" .date('D M d',strtotime($custom_fields['WZ_date'][0])) . "</span>";
								}
								
							}
							if($custom_fields['WZ_cost'][0] != "")
								echo "<span class='price'>" . $custom_fields['WZ_cost'][0] . "</span>";
						?>
					</div>
						
					</div>
					
					
					<div class="post-meta">
						<span class="hide-this" id="hide_<?php echo $post->ID; ?>">
							<img src="<?php echo bloginfo('template_url'); ?>/images/close.png" alt="" />
						</span>
						<div class="mt35">
						<div class="thumb <?php echo $like_class; ?>" id="th_<?php echo $post->ID; ?>"></div>
						<?php
							$like_class='';
							if(is_user_logged_in()) {
								echo "<div class='thumb-text-" . $ccParentID . "'><span id='count_{$post->ID}'>".get_post_meta($post->ID, 'like_count', true) . "</span> Thumbs Up</div>";
								$postsUserLikes = get_user_meta($current_user->ID, 'post_id_like', false);
								foreach($postsUserLikes as $pul) {
									if($post->ID == $pul) {
										$like_class = 'i_voted';
										break;
									}
								}	
							}
							else {
								echo "<div class='thumb-text-" . $ccParentID . "'><span id='count_{$post->ID}'>".get_post_meta($post->ID, 'like_count', true) . "</span> Thumbs Up</div>";
							}
						?>

						</div>
						<div class="clear"></div>
						<div class="zaaperDiv">
							<div class="zaaper"></div>
							<div class="zaap-text-<?php echo $ccParentID; ?>">45 Zappers</div>
						</div>
						<div class="clear"></div>
						<div class="respond">
							<div id="share-<?php echo $post->ID; ?>" class="share shareEventListing">
							<?php
								$shareCount = get_user_meta($current_user->ID, 'share_count', true);
								$count = unserialize($shareCount);
								if($count && $count != '') {
									echo "Share (". $count[$post->ID].")";
								}
								else {
									echo "Share";
								}
								
							?>
							</div>
							<div id="rsvp-<?php echo $post->ID; ?>" class="countMeIn">Count Me In
							<?php
								$countMeIn = get_post_meta($post->ID, 'rsvp_count', true);
								echo $countMeIn;
							?>
							</div>
						</div>
					</div>
					<div class="clear"></div>
					<p class="footnote">
						<?php
							$postDate = explode("/", get_the_time('m/j/Y/G/i'));$sysDate = getdate(get_the_time('m/j/Y/G/i'));echo "Posted " .timespan(get_the_time('U')) ." ago";
						/* 	if($postDate[1] == $sysDate['mday'] && $postDate[0] == $sysDate['mon'] && $postDate[2] == $sysDate['year']) {
								if($sysDate['hours'] > $postDate[3])
									$hrs = $sysDate['hours'] - $postDate[3];
								else
									$hrs = $postDate[3] - $sysDate['hours'];
								
								echo $hrs . " hours ago.";
							}
							else {
								echo "Posted on " . get_the_time('m/j/Y, G:i');
							} */
						?>
						</p>
				</div>

				<?php #endforeach; #END $allPostForThisCategory as $post ?>
				<?php endwhile; ?>
				<?php else : ?>

					<h2>Not Found</h2>

				<?php endif; ?>
			<!-- Successful till here -->				
			</div><!--end .inner-page-->
			
			<div class="pagination">
				<?php if(function_exists('wp_page_numbers')) : wp_page_numbers(); endif; ?>
			</div><!--end .pagination-->


		</div><!--end .container-->
		
		
		
		
		<div class="left">
			
			<?php
				$remainingCategories = get_categories('exclude=1,'.$ccParentID.'&parent=0&hide_empty=0&style=none&echo=0');
				foreach($remainingCategories as $rc) :
					$id = $rc->cat_ID;
					$twoPosts = get_posts(array('category' => $id, 'numberposts' => 2));
			?>
			
			
				
				<!-- First left Post -->
				<div class="left sidebar-category small-sized leftbg-<?php echo $rc->cat_ID; ?>">
				
					<?php $img = wp_get_attachment_image_src( get_post_thumbnail_id( $twoPosts[0]->ID ), 'catregory-left-thumb'); ?>
					<a href="<?php echo get_permalink( $twoPosts[0]->ID ); ?>"><img src="<?php echo bloginfo('template_url'); ?>/timthumb.php?src=<?php echo $img[0]; ?>&w=100&h=70" class="ml10 catAtt" /></a>
					
					<div class="desc" >
						<h5 style="height:100px;">
							<a href="<?php echo get_permalink( $twoPosts[0]->ID ); ?>">
								<?php echo substr($twoPosts[0]->post_title, 0, 10); ?>...
							</a>
						</h5>
						<div class="metaContent">
						<?php $custom_fields = get_post_custom($twoPosts[0]->ID); ?>
						<?php
							//Display the Custom Post Values
							if($custom_fields['WZ_address'][0] != "")
								echo "<span class='loc'>" . substr($custom_fields['WZ_address'][0], 0 , 10) . "</span>";

							if($custom_fields['WZ_date'][0] != "")
								echo "<span class='time'>" . substr($custom_fields['WZ_date'][0], 0 , 10) . "</span>";

							if($custom_fields['WZ_cost'][0] != "")
								echo "<span class='price'>" . substr($custom_fields['WZ_cost'][0], 0 , 10) . "</span>";
						?>
						</div>
					</div>
				</div>
				
				<!-- Second Right Post -->
				<div class="left sidebar-category big-sized rightbg-<?php echo $rc->cat_ID; ?>" >
				
					<!-- Category Title -->
					<span class="sideCatTitle">
						<a href="<?php echo get_category_link( $id ); ?>">
							<?php echo $rc->name; ?>
						</a>
					</span>
					<div class="clear"></div>
					
					<!-- Right Post Content -->
					<?php $img = wp_get_attachment_image_src( get_post_thumbnail_id( $twoPosts[1]->ID ),'block1-box2'); ?>
					<a href="<?php echo get_permalink( $twoPosts[1]->ID ); ?>"><img src="<?php echo bloginfo('template_url'); ?>/timthumb.php?src=<?php echo $img[0]; ?>&w=155&h=73"  class="f-img-2 ml10" /></a>
				
					<div class="desc">
						<h4>
							<a href="<?php echo get_permalink( $twoPosts[1]->ID ); ?>">
								<?php echo substr($twoPosts[1]->post_title, 0, 30); ?>...
							</a>
						</h4>
						<div class="metaContent">
						<?php $custom_fields = get_post_custom($twoPosts[1]->ID); ?>
						<?php
							if($custom_fields['WZ_address'][0] != "")
								echo "<span class='loc'>" . substr($my_custom_field_address[0], 0 , 10) . "</span>";
								
							if($custom_fields['WZ_date'][0] != "")
								echo "<span class='time'>" . substr($custom_fields['WZ_date'][0], 0 , 10) . "</span>";
								
							if($custom_fields['WZ_cost'][0] != "")
								echo "<span class='price'>" . substr($custom_fields['WZ_cost'][0], 0 , 10) . "</span>";
						?>
						</div>
					</div>
				</div>
				<div class="clear"></div>
				

			<?php
/*
					} #End If Condition
				} #End For Loop
*/
				
				endforeach; #END of remaining categories
			?>
						
		</div><!--end .left--><div class="clear"></div>
		
		<?php #comments_template(); ?>

	</div><div class="clear"></div>



<script type="text/javascript">
	$(document).ready(function(){
		
		$(".container").fadeIn(2000);
		
		$( ".slider" ).slider({
			value: 40,
			orientation: "horizontal",
			range: "min",
			animate: true
		});

	})
</script>

<div style="margin-top: 20px;"><?php get_footer(); ?>
