<?php
	session_start();
	global $homepage_categories, $homepage_categories_count;
	$homepage_categories = array(3, 4, 5, 6, 7);
	$homepage_categories_count = array('3'=>'5', '4'=>'4', '5'=>'3', '6'=>'4', '7'=>'4');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>" charset=<?php bloginfo('charset'); ?>" />
	
	<?php if (is_search()) { ?>
	   <meta name="robots" content="noindex, nofollow" /> 
	<?php } ?>

	<title>
	   <?php
		  if (function_exists('is_tag') && is_tag()) {
			 single_tag_title("Tag Archive for &quot;"); echo '&quot; - '; }
		  elseif (is_archive()) {
			 wp_title(''); echo ' Archive - '; }
		  elseif (is_search()) {
			 echo 'Search for &quot;'.wp_specialchars($s).'&quot; - '; }
		  elseif (!(is_404()) && (is_single()) || (is_page())) {
			 wp_title(''); echo ' - '; }
		  elseif (is_404()) {
			 echo 'Not Found - '; }
		  if (is_home()) {
			 bloginfo('name'); echo ' - '; bloginfo('description'); }
		  else {
			  bloginfo('name'); }
		  if ($paged>1) {
			 echo ' - page '. $paged; }
	   ?>
	</title>
	
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	
	<link rel="stylesheet" href="<?php echo bloginfo('template_url') ?>/style.zaap.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo bloginfo('template_url') ?>/category.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo bloginfo('template_url') ?>/css/dateRange.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo bloginfo('template_url') ?>/css/ui-lightness/jquery-ui-1.8.9.custom.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo bloginfo('template_url') ?>/css/multiselect.css" type="text/css" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	
	<?php
		global $current_user;
		get_currentuserinfo();
	?>
	<script type="text/javascript" >
		var sessionData = {};
		var TEMPLATE_URL = '<?php echo bloginfo('template_url') ?>';
		var HOME_URL = '<?php echo bloginfo('home') ?>';
		var d = new Date();
		var wazaap = {};
		<?php
			if (is_user_logged_in()) {
				//echo get_user_meta($current_user->ID, 'first_name', true);
				$userName = get_user_meta($current_user->ID, 'first_name', true);
			}
			else {
				$userName = "Guest";
			}
		?>
			var user_details = <?php echo json_encode(array(
				'user' 		=> $userName,
				'place'		=> 'San Francisco',
			)), "\n";
		?>
		user_details.date = new Date();
		
	</script>

	<?php if ( is_singular() ) wp_enqueue_script( 'comment-reply' ); ?>

	<?php wp_head(); ?>
	
	</head>

<body>
	
<!--<div id="page-wrap">-->
<div id="header">

<div class="brand">
	<div class="left-img"></div>
	<div class="mid-img">
		<div class="logo">
			<a href="<?php echo bloginfo('home'); ?>">
				<img alt="Wazaap" src="<?php echo bloginfo('template_url'); ?>/images/logo.png">
			</a>
		</div>
		<div class="image-frame">

		
		<?php if (is_user_logged_in()) { ?>
			<div class="profile-image">
				<img src="<?php echo 'http://graph.facebook.com/'. get_user_meta($current_user->ID, 'fb_uid', true). '/picture'; ?>"/>
			</div>
			<div class="profile-name"><?php echo get_user_meta($current_user->ID, 'first_name', true); ?></div>
		<?php } else { ?>
			<div class="profile-image">
				<img src="<?php echo bloginfo('template_url'); ?>/images/guest-dp.gif" />
			</div>
			<div class="profile-name">Guest</div>
		<?php } ?>
		
		</div>
	
		<div class="tag-line">
			<span>in San Francisco</span> | <span class="today"></span>
			<h2></h2>
		</div>
		
		<div class="profile-controls">
			<ul>
				<li>
					<?php if(is_user_logged_in()) { ?>
						<a href="<?php echo bloginfo('home'); ?>/wp-admin/profile.php">Account</a>
					<?php } else { ?>
						<a href="">Account</a>
					<?php } ?>
				|</li>
				<!--<li><a href="">Help | </a></li>-->
				<li><?php do_shortcode("[fb_login size='small' connect_text='Sign In' login_text='Sign In' logout_text='Sign Out']"); ?></li>
			</ul>
		</div>
	
		<div class="drop-down">
			<a href="javascript:void(0);">
				<img alt="" src="<?php echo bloginfo('template_url'); ?>/images/pull-down.png">
			</a>
		</div>
		<div class="clear"></div>
		
		<div class="zaap-bar-hide">
			<div class="top-div">
				<div class="left ques ques-1">What?</div>
				<div class="left choice">
					
					<div class="categories">
						
					</div>
					
					<div class="left add-new" style="margin-left: 0px;">
						<span class="add">Add</span>
						<div class="menu">
							<ul>
							<?php
								$all = array();
								$parentCategories = get_categories(array('exclude'=>'1', 'parent' => '0', 'hide_empty' => '0'));

								$parCat = array();
								foreach($parentCategories as $pc) {
									$parCat[$pc->cat_ID] = $pc->name;
								}
							?>
								<li id="cat-<?php echo $parentCategories[1]->cat_ID; ?>" class="cat-<?php echo $parentCategories[1]->cat_ID; ?>"><?php echo $parentCategories[1]->name; 
									$subCategories = get_categories(array('exclude' => '1', 'parent' => $parentCategories[1]->cat_ID, 'hide_empty' => '0'));
									$data = array();
									foreach($subCategories as $subCat) {
										$data[] = array('id' => $subCat->cat_ID, 'name' => $subCat->name);
									}
									$all[$parentCategories[1]->cat_ID] = $data;
								?></li>
								
								<li id="cat-<?php echo $parentCategories[3]->cat_ID; ?>" class="cat-<?php echo $parentCategories[3]->cat_ID; ?>"><?php echo $parentCategories[3]->name;
									$subCategories = get_categories(array('exclude' => '1', 'parent' => $parentCategories[3]->cat_ID, 'hide_empty' => '0'));
									$data = array();
									foreach($subCategories as $subCat) {
										$data[] = array('id' => $subCat->cat_ID, 'name' => $subCat->name);
									}
									$all[$parentCategories[3]->cat_ID] = $data;
								?></li>
								
								<li id="cat-<?php echo $parentCategories[4]->cat_ID; ?>" class="cat-<?php echo $parentCategories[4]->cat_ID; ?>"><?php echo $parentCategories[4]->name;
									$subCategories = get_categories(array('exclude' => '1', 'parent' => $parentCategories[4]->cat_ID, 'hide_empty' => '0'));
									$data = array();
									foreach($subCategories as $subCat) {
										$data[] = array('id' => $subCat->cat_ID, 'name' => $subCat->name);
									}
									$all[$parentCategories[4]->cat_ID] = $data;
								?></li>
								
								<li id="cat-<?php echo $parentCategories[0]->cat_ID; ?>" class="cat-<?php echo $parentCategories[0]->cat_ID; ?>"><?php echo $parentCategories[0]->name;
									$subCategories = get_categories(array('exclude' => '1', 'parent' => $parentCategories[0]->cat_ID, 'hide_empty' => '0'));
									$data = array();
									foreach($subCategories as $subCat) {
										$data[] = array('id' => $subCat->cat_ID, 'name' => $subCat->name);
									}
									$all[$parentCategories[0]->cat_ID] = $data;
								?></li>
								
								<li id="cat-<?php echo $parentCategories[2]->cat_ID; ?>" class="cat-<?php echo $parentCategories[2]->cat_ID; ?>"><?php echo $parentCategories[2]->name;
									$subCategories = get_categories(array('exclude' => '1', 'parent' => $parentCategories[2]->cat_ID, 'hide_empty' => '0'));
									$data = array();
									foreach($subCategories as $subCat) {
										$data[] = array('id' => $subCat->cat_ID, 'name' => $subCat->name);
									}
									$all[$parentCategories[2]->cat_ID] = $data;
								?></li>
								<script>
									//var subCats = <?php echo json_encode($all); ?>;
									var everything = <?php echo json_encode(array($all, $parCat)); ?>;
								</script>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="clear"></div>
			
			<div>
				<div class="left ques">When?</div>
				<div class="left choice whenopt">
					<span class="todTom"></span>
					<span class="chosenDate"></span>
					<span class="toda">| Today</span>
					<span class="tomo">| Tomorrow</span>
					<span class="wend">| This Weekend</span>
					<span class="tweek">| This Week</span>
					<span class="cal-icon">| <input id="date-range-thing"  value="" type="text" style="display:inline;width:16px;height:14px;border:0;background-image:url(<?php echo bloginfo('template_url'); ?>/images/calender-icon.png)"> 
										<!--<img alt="" src="/images/calender-icon.png" id="datepicker">-->
					</span>
					<span class="smaller change-when">Change</span>
				</div>
			</div>
			
			<div class="clear"></div>
			
			<div>
				<div class="left ques">Where?</div>
				<div class="left choice lastr whereis">
					<span class="curr-city">San Francisco</span>
					<!--<span class="neighbor">|  Neighbourhoods</span>-->
					<!--
					<select id="example" name="example" multiple="multiple">
						<option>SOMA / south beach</option>
						<option>USF / panhandle</option>
						<option>alamo square / nopa</option>
						<option>bayview</option>
						<option>bernal heights</option>
						<option>castro / upper market</option>
						<option>cole valley / ashbury hts</option>
						<option>downtown / civic / van ness</option>
						<option>excelsior / outer mission</option>
						<option>financial district</option>
						<option>glen park</option>
						<option>haight ashbury</option>
						<option>hayes valley</option>
						<option>ingleside / SFSU / CCSF</option>
						<option>inner richmond</option>
						<option>inner sunset / UCSF</option>
						<option>laurel hts / presidio</option>
						<option>lower haight</option>
						<option>lower nob hill</option>
						<option>lower pac hts</option>
						<option>marina / cow hollow</option>
						<option>mission district</option>
						<option>nob hill</option>
						<option>noe valley</option>
						<option>north beach / telegraph hill</option>
						<option>pacific heights</option>
						<option>portola district</option>
						<option>potrero hill</option>
						<option>richmond / seacliff</option>
						<option>russian hill</option>
						<option>sunset / parkside</option>
						<option>tenderloin</option>
						<option>treasure island</option>
						<option>twin peaks / diamond hts</option>
						<option>visitacion valley</option>
						<option>west portal / forest hill</option>
						<option>western addition</option>
					</select>
					-->
					<!--<span class="more-cities">|  More cities</span>-->
					<!--<span class="smaller cancel-loc">Change</span>-->
				</div>
			</div>
			<div class="clear"></div>
			
			
			<div>
				<div class="left ques char">	
					<span>Add your custom message (optional, 140  characters )</span>
				</div>

				<div class="left">

					<?php if (is_user_logged_in()) { ?>
						<textarea class="big-input statusmsg" maxlength="140"><?php echo get_user_meta($current_user->ID, 'first_name', true); ?></textarea>
					<?php } else { ?>
						<textarea class="big-input statusmsg" maxlength="140">Guest is interested in Culture and entertainment @ SOMA neighborhood in San Francisco for this weekend.</textarea>
					<?php } ?>

				</div>
				
				<div class="left abs">
					<a class="zaap-it"><img alt="" src="<?php echo bloginfo('template_url')?>/images/zaap-it.png"></a>
					<span class="smaller close">Close</span>
					<div class="clear"></div>
					
					<div class="fb">
						<div class="left checkbox"></div>
						<span class="left post-fb">Post to Facebook</span>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div><div class="right-img"></div>
</div>
</div><!--end #header-->
