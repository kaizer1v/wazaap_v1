	<div class="footer">
		<div class="footer-left left"></div>
		<div class="footer-mid left">
			<div class="left">
				<span class="copy">&copy; 2011 Wazaap</span>
			</div>
			<div class="right">
				<?php
					$args = array (
						'menu' => 'Footer Menu'
					);
					wp_nav_menu($args);
				?>
			</div>
		</div>
		<div class="footer-right left"></div>
	</div>
	</div><!--Ending from Home.php To close the div that has margin-top:20-->
	
	<!-- Don't forget analytics -->
	<?php wp_footer();?>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ?>/js/jquery.min.js"></script>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ?>/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ?>/js/jquery.dateRange.js"></script>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ?>/js/date.js"></script>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ; ?>/js/main.js"></script>
	<script type="text/javascript" src="<?php echo bloginfo('template_url') ?>/js/multiselect.js"></script>
	<!--<script type="text/javascript" src="<?php echo bloginfo('template_url') ; ?>/js/thumbsUp.js"></script>-->
	<script type="text/javascript">
	  (function() {
		var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
		uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/yGKPx7i6O7LlYwTL8jVQ.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
	  })();
	</script>
</body>

</html>
