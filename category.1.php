<?php get_header(); ?>








<div class="main">
		<div class="container">
			
			
			<div class="inner-page">
			
			
				

				<div class="top-bar">
					<h2><?php echo single_cat_title( '', false ); ?></h2>
					
					<div class="left slides ml20">
						<span>Morning</span>
						<div class="slider" style="width:80px; margin-top:2px;"></div>
						<span>NIght</span>
					</div>
					<div class="left slides">
						<span>Underground</span>
						<div class="slider" style="width:80px; margin-top:2px;"></div>
						<span>Trendy</span>
					</div>
					<div class="left slides">
						<span>Chill</span>
						<div class="slider" style="width:80px; margin-top:2px;"></div>
						<span>Fit</span>
					</div>
				</div>
				
				
				
				
				
				
				<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
				
				
				<div class="category-post">
					<?php
						if (has_post_thumbnail()) { ?>
							<div class="post-image">
							<?php the_post_thumbnail(array(129, 180)); ?>
							</div>
					<?php } ?>
					
					
					<div class="post-data">
						<h4>
							<a href="<?php the_permalink(); ?>" class="post-title">
								<?php the_title(); ?>
							</a>
						</h4>
						<p><?php echo the_excerpt(); ?></p>
						<span class="loc">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom(get_the_ID());
								$my_custom_field = $custom_fields['WZ_address'];
								foreach ( $my_custom_field as $key => $value )
									echo $value . "<br />";
							?>
						</span>
						<span class="time">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom(get_the_ID());
								$my_custom_field = $custom_fields['WZ_date'];
								foreach ( $my_custom_field as $key => $value )
									echo $value . "<br />";
							?>
						</span>
						<span class="price">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom(get_the_ID());
								$my_custom_field = $custom_fields['WZ_cost'];
								foreach ( $my_custom_field as $key => $value )
									echo $value . "<br />";
							?>
						</span>
						
						
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
								echo "Posted on " . get_the_time('m/j/Y, G:i');
							}
						?>
						</p>
					</div>
					
					
					<div class="post-meta">
						<span class="hide-this">
							<img src="<?php echo bloginfo('template_url'); ?>/images/close.png" alt="" />
						</span>
						<div class="mt35">
							<div class="thumb"></div>
							<div class="thumb-text">72 Thumbsup</div>
						</div>
						<div class="clear"></div>
						<div style="margin-top:10px;">
							<div class="zaaper"></div>
							<div class="zaap-text">45 Zappers</div>
						</div>
						<div class="clear"></div>
						<div class="respond">
							<div class="share">Share</div>
							<div class="rsvp">RSVP</div>
						</div>
					</div>
				</div>
				
				<?php endwhile; ?>
				<?php else : ?>

					<h2>Not Found</h2>

				<?php endif; ?>
				
			</div><!--end .inner-page-->
			
			<div class="pagination">
				<?php if(function_exists('wp_page_numbers')) { wp_page_numbers(); } ?>
			</div><!--end .pagination-->
			
			
		</div><!--end .container-->
		
		
		
		
		<div class="left">
		
		
		
			<?php
				// Gets the Current Category
				$currentCategory = get_the_category();
				
				// Set of fixed categories
				$remainingCategories[] = "Nightlife";
				$remainingCategories[] = "Activities";
				$remainingCategories[] = "Culture";
				$remainingCategories[] = "Community";
				$remainingCategories[] = "Entertainment";								
			?>
			
			<?php
				//Run the loop 5 times for 5 categories
				for($i = 0; $i < 5; $i++) {
					//Check if the current category is not the same as the one in the loop
					if($remainingCategories[$i] != $currentCategory[0]->name) {
						//If not, then retrieve ID for this category
						$id = get_cat_ID( $remainingCategories[$i] );
						//After getting the ID, retrieve 2 Posts from this category
						$twoPosts = get_posts(array('category' => $id, 'numberposts' => 2));
						//And display them as below
			?>
			
			
				
				<!-- First left Post -->
				<div class="left sidebar-category bluebg small-sized">
				
					<?php $img = wp_get_attachment_image_src( get_post_thumbnail_id( $twoPosts[0]->ID )); ?>
					<img src="<?php echo $img[0]; ?>" class="ml10" style="background:#999;margin:10px;width:100px;height:70px;" />
					
					<div class="desc">
						<h5 style="line-height:12px;font-size:12px;">
							<a href="<?php echo get_permalink( $twoPosts[0]->ID ); ?>">
								<?php echo substr($twoPosts[0]->post_title, 0, 10); ?>...
							</a>
						</h5>
						<span class="loc">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[0]->ID);
								$my_custom_field_address = $custom_fields['WZ_address'];
								foreach ( $my_custom_field_address as $key => $value )
									echo substr($value, 0, 10);
							?>
						</span>
						<span class="time">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[0]->ID);
								$my_custom_field = $custom_fields['WZ_date'];
								foreach ( $my_custom_field as $key => $value )
									echo substr($value, 0, 10);
							?>
						</span>
						<span class="price">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[0]->ID);
								$my_custom_field = $custom_fields['WZ_cost'];
								foreach ( $my_custom_field as $key => $value )
									echo substr($value, 0, 10);
							?>
						</span>
					</div>
				</div>
				
				<!-- Second Right Post -->
				<div class="left sidebar-category bluebg big-sized">
				
					<!-- Category Title -->
					<span style="font:22px calibri,sans-serif;color:#fff;float:right;margin-right:8px;">
						<a style="color: #fff; text-decoration: none;" href="
							<?php echo get_category_link( $id ); ?>">
							<?php echo $remainingCategories[$i]; ?>
						</a>
					</span>
					<div class="clear"></div>
					
					<!-- Right Post Content -->
					<?php $img = wp_get_attachment_image_src( get_post_thumbnail_id( $twoPosts[1]->ID )); ?>
					<img src="<?php echo $img[0]; ?>"  class="f-img-2 ml10" />
				
					<div class="desc">
						<h4 style="line-height:16px;font-size:15px;">
							<a href="<?php echo get_permalink( $twoPosts[1]->ID ); ?>">
								<?php echo substr($twoPosts[1]->post_title, 0, 30); ?>...
							</a>
						</h4>
						<span class="loc">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[1]->ID);
							
								$my_custom_field_address = $custom_fields['WZ_address'];
								foreach ( $my_custom_field_address as $key => $value )
									echo substr($value, 0, 10) . "<br />";
							?>
						</span>
						<span class="time">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[1]->ID);
								$my_custom_field = $custom_fields['WZ_date'];
								foreach ( $my_custom_field as $key => $value )
									echo substr($value, 0, 10) . "<br />";
							?>
						</span>
						<span class="price">
							<?php
								//Display the Custom Post Values
								$custom_fields = get_post_custom($twoPosts[1]->ID);
								$my_custom_field = $custom_fields['WZ_cost'];
								foreach ( $my_custom_field as $key => $value )
									echo substr($value, 0, 10) . "<br />";
							?>
						</span>
					</div>
				</div>
				<div class="clear"></div>
				
				
				
				
			<?php
					} #End If Condition
				} #End For Loop
			?>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		</div><!--end .left--><div class="clear"></div>
		
		<?php comments_template(); ?>

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

<?php get_footer(); ?>
