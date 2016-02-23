<div id="page-wrap">
<?php get_header();?>
<?php

?>
	
		<div class="main events">
			<div class="top-bar-4">
				<a href="<?php echo bloginfo('home'); ?>"><img src="<?php echo bloginfo('template_url'); ?>/images/event-logo.png" alt="" style="float:left;margin-left:5px;margin-top:5px;"/></a>
				<h2 class="left">
				<?php the_title(); ?>
				</h2>

				<div class="clear"></div>
			</div>

				<div class="single-post">

					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
					
					
					<div class="single-post-data">
						
						<p class="mt10"><?php the_content(); ?>
						</p>
					
					</div><!--end .single-post-data-->
					<div class="clear"></div>

					<?php endwhile; endif; ?>

				</div>
				
		</div>
		<div class="clear"></div>
		
	<?php get_footer(); ?>
</div>

