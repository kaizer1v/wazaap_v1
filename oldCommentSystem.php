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
									<p class="ver"><?php echo $c->comment_author /* . " - " . $c->comment_date; */ ?></p>
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
