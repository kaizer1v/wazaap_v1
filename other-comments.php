<?php
	$comments = get_comments(array('post_id' => $currentPostID));
	foreach($comments as $c) {
?>
	<?php
		#$cuser = get_userdatabylogin($c->comment_author);
		#$userName = get_user_meta($cuser->ID, 'first_name', true);
		$fb_uid = get_user_meta($c->user_id, 'fb_uid', true);
	?>
		<div class="singleEventCommented">
			<img src="<?php echo 'http://graph.facebook.com/'. $fb_uid . '/picture'; ?>"/>
			<div class="commentContent">
				<span class="ver"><?php echo $c->comment_author /* . " - " . $c->comment_date; */ ?></span>
				<p><?php echo $c->comment_content; ?></p>
			</div>
		</div>
		<div class="clear"></div>
		<hr class="commentedLine" />
	<?php } ?>

	<?php
		if (is_user_logged_in()) {
			global $current_user;
	?>
		<div class="singleEventCommented">
			<img style="margin-right: 10px;" src="<?php echo 'http://graph.facebook.com/'. get_user_meta($current_user->ID, 'fb_uid', true) . '/picture'; ?>"/>
			<div class="commentContent">
				<p class="ver"><?php echo get_user_meta($current_user->ID, 'first_name', true); ?></p>
				<?php include 'comments.php'; ?>
			</div>
		</div>
		<div class="clear"></div>
<?php
	}
	#comment_form();
?>
<!-- END OLD Commenting system -->

<?php
/*
	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		This post is password protected. Enter the password to view comments.
	<?php
		return;
	}
*/
?>

<!-- Comment Form -->
<!--
<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">

	<table border="0" cellpadding="0" cellspacing="0">
-->
		<!--<p>You can use these tags: <code><?php echo allowed_tags(); ?></code></p>-->
<!--
		<tr>
			<td>
				<textarea name="comment" id="comment" cols="70" rows="3" tabindex="1"></textarea>
			</td>
			<td>
				<input class="post-comment" name="submit" type="submit" id="submit" tabindex="2" value="Post" />
				<?php comment_id_fields(); ?>
			</td>
		</tr>	
		<?php do_action('comment_form', $post->ID); ?>
		
	</table>
	
</form>

-->

<!--
##############################################################################################################
ABOVE COMMENTING SYSTEM IS NOT THE ONE BEING USED.
BELOW COMMENTING SYSTEM IS THE CUSTOM COMMENTING SYSTEM WRITTEN BY AMIWORKS
##############################################################################################################
-->
