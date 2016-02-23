<?php
/*
Plugin Name:  Download an Image and set it as feature image
Plugin URI:   http://wpoid.com/
Description:  Outputs a fully customizable breadcrumb path.
Version:      0.0.1
Author:       Amit Singh
Author URI:   http://wpoid.com/
*/
define('DOING_CRON', true);
set_time_limit(0);
if ( !defined('ABSPATH') ) {
	/** Set up WordPress environment */
	require_once('../../../wp-load.php');
}
$offset=get_option( 'wpoid_waz_post_offset', 0 );
//get the option for offset to pick the post from. 
$query = new WP_Query( 'post_type=post&posts_per_page=-1&offset='.$offset.'&post_status => array( "publish", "draft")' );
$upload_dir = wp_upload_dir();
foreach( $query->posts as $post )
{
	echo 'ID is '.$post->ID.'<br>';
	// get all the post which does not have featured images
	if(has_post_thumbnail( $post->ID ))
	 continue;
	
	//this post does not have a thumbnail so let's download the image.
	$remote_url= get_post_meta($post->ID, 'WZ_image_urls', true);	
	echo $remote_url.'<br>';
	if(strlen($remote_url))
	{

		if(ini_get('allow_url_fopen'))
		{
			$ur=explode('/',$remote_url);
			
			$imt=$ur[count($ur)-1];
			$im =explode('?',$imt);
			
			$img_path = $upload_dir['path'].'/'.$im[0];
			//echo 'img path'.$img_path;
			file_put_contents($img_path, file_get_contents($remote_url));
			
			 $wp_filetype = wp_check_filetype(basename($img_path), null );
			  $attachment = array(
				 'post_mime_type' => $wp_filetype['type'],
				 'post_title' => preg_replace('/\.[^.]+$/', '', basename($img_path)),
				 'post_content' => '',
				 'post_status' => 'inherit'
			  );
			  $attach_id = wp_insert_attachment( $attachment, $img_path, $post->ID );
			  // you must first include the image.php file
			  // for the function wp_generate_attachment_metadata() to work
			  require_once(ABSPATH . "wp-admin" . '/includes/image.php');
			  $attach_data = wp_generate_attachment_metadata( $attach_id, $img_path );
			  wp_update_attachment_metadata( $attach_id,  $attach_data );
			  update_post_meta($post->ID, '_thumbnail_id', $attach_id);
		}
		else
		{
			echo 'Please set allow_url_fopen to true.';
		}
	}
}

echo 'total posts: '.count($query->posts);


//download the images from the server
//http://codex.wordpress.org/Function_Reference/wp_upload_dir
//attache that image as featured image
//add_post_meta($post_id, '_thumbnail_id', $attachment_id);
//crop the images to various sizes
//http://codex.wordpress.org/Function_Reference/wp_insert_attachment
// an

//add_action( 'init', 'rul_textdomain' );
