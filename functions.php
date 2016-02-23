<?php
	
	// Add RSS links to <head> section
	add_theme_support( 'automatic-feed-links' );
	
	// Load jQuery
	if ( !is_admin() ) {
	   wp_deregister_script('jquery');
	   wp_register_script('jquery', ("http://code.jquery.com/jquery-1.6.1.min.js"), false);
	   wp_enqueue_script('jquery');
	}
	
	// Clean up the <head>
	function removeHeadLinks() {
    	remove_action('wp_head', 'rsd_link');
    	remove_action('wp_head', 'wlwmanifest_link');
    }
    add_action('init', 'removeHeadLinks');
    remove_action('wp_head', 'wp_generator');
    
    if (function_exists('register_sidebar')) {
    	register_sidebar(array(
    		'name' => 'Sidebar Widgets',
    		'id'   => 'sidebar-widgets',
    		'description'   => 'These are widgets for the sidebar.',
    		'before_widget' => '<div id="%1$s" class="sidebar-widget %2$s">',
    		'after_widget'  => '</div>',
    		'before_title'  => '<h2>',
    		'after_title'   => '</h2>'
    	));
    	
    	register_sidebar(array(
    		'name' 			=> 'Footer Widgets',
    		'id'   			=> 'footer-widgets',
    		'description'   => 'These are widgets for the Footer.',
    		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
    		'after_widget'  => '</div>',
    		'before_title'  => '<h2>',
    		'after_title'   => '</h2>'
    	));
    }  
    
    // Disable Admin Bar
    show_admin_bar(false);
    
    // Enable Posting Thumbnails to posts
    if ( function_exists( 'add_theme_support' ) ) { 
	  add_theme_support( 'post-thumbnails' ); 
	  //set_post_thumbnail_size( 50, 50 );
	  
	  /*
	  add_image_size('block1-box1', 104 , 153, true);
	  add_image_size('block1-box2', 155 , 73, true);
	  add_image_size('block1-box3', 161 , 125, true);
	  add_image_size('block1-box4', 155 , 71, true);
	  add_image_size('block1-box5', 99 , 184, true);
	  
	  add_image_size('block2-box1', 181 , 83, true);
	  add_image_size('block2-box2', 48 , 105, true);
	  add_image_size('block2-box3', 71 , 120, true);
	  add_image_size('block2-box4', 152 , 98, true);
	  
	  add_image_size('block4-box1', 250 , 132, true);
	  add_image_size('block4-box2', 126 , 112, true);
	  add_image_size('block4-box3', 55 , 77, true);
	  
	  add_image_size('block5-box1', 190 , 74, true);
	  add_image_size('block5-box2', 77 , 123, true);
	  add_image_size('block5-box3', 67 , 84, true);
	  
	  add_image_size('block3-box1', 153 , 44, true);
	  add_image_size('block3-box2', 71 , 122, true);
	  add_image_size('block3-box3', 116 , 168, true);
	  add_image_size('block3-box4', 115 , 97, true);
	  
	  add_image_size('catregory-thumb', 129 , 180, true);
	  add_image_size('catregory-left-thumb', 100 , 97, true);
	  */
	}
	
if ( ! function_exists('timespan'))
{
	function timespan($seconds = 1, $time = '')
	{
		

		if ( ! is_numeric($seconds))
		{
			$seconds = 1;
		}

		if ( ! is_numeric($time))
		{
			$time = time();
		}

		if ($time <= $seconds)
		{
			$seconds = 1;
		}
		else
		{
			$seconds = $time - $seconds;
		}

		$str = '';
		$years = floor($seconds / 31536000);

		if ($years > 0)
		{
			$str .= $years.' '.(($years	> 1) ? 'Years' : 'Year').', ';
		}

		$seconds -= $years * 31536000;
		$months = floor($seconds / 2628000);

		if ($years > 0 OR $months > 0)
		{
			if ($months > 0)
			{
				$str .= $months.' '.(($months	> 1) ? 'Months' : 'Month').', ';
			}

			$seconds -= $months * 2628000;
		}

		$weeks = floor($seconds / 604800);

		if ($years > 0 OR $months > 0 OR $weeks > 0)
		{
			if ($weeks > 0)
			{
				$str .= $weeks.' '.(($weeks	> 1) ? 'Weeks' : 'Week').', ';
			}

			$seconds -= $weeks * 604800;
		}

		$days = floor($seconds / 86400);

		if ($months > 0 OR $weeks > 0 OR $days > 0)
		{
			if ($days > 0)
			{
				$str .= $days.' '.(($days	> 1) ? 'Days' : 'Day').', ';
			}

			$seconds -= $days * 86400;
		}

		$hours = floor($seconds / 3600);

		if ($days > 0 OR $hours > 0)
		{
			if ($hours > 0)
			{
				$str .= $hours.' '.(($hours	> 1) ? 'Hours' : 'Hour').', ';
			}

			$seconds -= $hours * 3600;
		}

		$minutes = floor($seconds / 60);

		if ($days > 0 OR $hours > 0 OR $minutes > 0)
		{
			if ($minutes > 0)
			{
				$str .= $minutes.' '.(($minutes	> 1) ? 'Minutes' : 'Minute').', ';
			}

			$seconds -= $minutes * 60;
		}

		if ($str == '')
		{
			$str .= $seconds.' '.(($seconds	> 1) ? 'Seconds' : 'Second').', ';
		}

		return substr(trim($str), 0, -1);
	}
}
?>
