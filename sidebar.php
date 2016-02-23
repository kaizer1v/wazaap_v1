<?php global $mappress;?>
<?php
	global $current_user;
	$currentCategory = get_the_category(get_the_ID());
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
		<div class="single-sidebar">
			<span class="hide-thiss">
				<img src="<?php echo bloginfo('template_url'); ?>/images/close.png" alt="" />
			</span>
			
			<div style="margin-top:15px;">
				<div class="thumb <?php echo $like_class; ?>" id="th_<?php echo $post->ID; ?>"></div>
				<?php
					$like_class='';
					if(is_user_logged_in()) {
						$postsUserLikes = get_user_meta($current_user->ID, 'post_id_like', false);
						foreach($postsUserLikes as $pul) {
							if($post->ID == $pul) {
								$like_class = 'i_voted';
								break;
							}
						}
						echo "<div class='thumb-text-" . $ccParentID . "'><span id='count_{$post->ID}'>".get_post_meta($post->ID, 'like_count', true) . "</span> Thumbs Up</div>";
					}
					else {
						echo "<div class='thumb-text-" . $ccParentID . "'><span id='count_{$post->ID}'>".get_post_meta($post->ID, 'like_count', true) . "</span> Thumbs Up</div>";
					}
				?>
			</div>
			<div class="clear"></div>
			<div style="margin-top:10px;">
				<div class="zaaper"></div>
				<div class="zaap-text-<?php echo $ccParentID; ?>" style="width:245px;">
					<ul class="zaaper-list">
						<li id="zaaper-countedin" style="display:none;">
							<img src="<?php echo 'http://graph.facebook.com/'. get_user_meta($current_user->ID, 'fb_uid', true). '/picture'; ?>"/>
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/333.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/444.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/555.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/666.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
						<li>
							<img src="<?php echo bloginfo('template_url'); ?>/images/111.png" alt="" />
						</li>
					</ul>
					<span class="left" style="margin-left:10px;"><?php #Number of zaapers ?></span>
				</div>
			</div>
			<div class="clear"></div>
			<div class="respond" style="margin-left:35px;margin-top:10px !important">
				<div id="share-<?php echo $post->ID; ?>" class="share">Share&nbsp;<?php 
				
				$shareCount = get_user_meta($current_user->ID, 'share_count', true);
				$count = unserialize($shareCount);
				if($count && $count != '') {
					echo "(". $count[$post->ID].")";
				}
				?></div>
				<!--<div class="rsvp">RSVP</div>-->
				<div id="rsvp-<?php echo $post->ID; ?>" class="countMeIn">Count Me In
					<?php
						global $post;
						$countMeIn = get_post_meta($post->ID, 'rsvp_count', true);
						echo $countMeIn;
					?>
				</div>
			</div>
			<div class="clear"></div>
		 	
		 	
		 	<div class="google-maps" style="margin-top:20px;margin-left:30px;">
				<?php
					global $my_custom_field_address;
					//$add="http://www.google.com/maps?q=".$my_custom_field_address;
				?>
				<!-- <iframe width="245" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="<?php echo $add; ?>&amp;output=embed">
				</iframe>
				<br />-->
				<?php
				$mymap = new Mappress_Map(array("width" => 245, "height" => 250, "autocenter" => "true", "zoom" => 15));
				$mypoi_1 = new Mappress_Poi(array("address" => $my_custom_field_address)); 
				$mypoi_1->geocode();
				$mymap->pois = array($mypoi_1);
				echo $mymap->display(array("directions" => "none"));
				?>
				<small>
					<a href="<?php echo $add; ?>" style="color:#0000FF;text-align:left">
					View Larger Map</a>
				</small>
			</div><!--end .google-maps-->
			
			<!--Voting on Tags-->
			<div style="margin:10px 5px; width: 255px; float: right;">
				<h4 style="font:15px verdana, sans-serif;margin:5px 0;">Vote on tags</h4>
				<p class="ver">It will be great if you can vote on tags or add a new tag. This will help us serve you better</p>
				<ul class="voting-list">
					<li class="ver"><a href="javascript:void(0)" class="chkbox"></a>Culture</li>
					<li class="ver"><a href="javascript:void(0)" class="chkbox"></a>Art</li>
					<li class="ver"><a href="javascript:void(0)" class="chkbox"></a>Exhibition</li>
				</ul>
				<!--wp_set_object_terms( 1, array(‘my new tag’), ‘post_tag’, true );-->
				<input type="text" class="left"/><div class="add-more">Add</div>
			</div>
			<div class="clear"></div>
			<!--End Voting on Tags-->
			
	</div>
	<div class="clear"></div>


	<?php if (function_exists('dynamic_sidebar') && dynamic_sidebar('Sidebar Widgets')) : else : ?>   
	<?php endif; ?>
