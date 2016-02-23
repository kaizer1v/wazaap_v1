<?php

	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		This post is password protected. Enter the password to view comments.
	<?php
		return;
	}
?>

<!-- Comment Form -->

<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">

	<table border="0" cellpadding="0" cellspacing="0">
	
		<!--<p>You can use these tags: <code><?php echo allowed_tags(); ?></code></p>-->

		<tr>
			<td>
				<textarea name="comment" id="comment" tabindex="1" style="width:500px;height:30px"></textarea>
			</td>
			<td>
				<input class="post-comment" name="submit" type="submit" id="submit" tabindex="2" value="Post" />
				<?php comment_id_fields(); ?>
			</td>
		</tr>	
		<?php do_action('comment_form', $post->ID); ?>
		
	</table>
	
</form>
