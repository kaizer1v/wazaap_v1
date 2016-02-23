<?php
	define('DOING_AJAX', true);
	/* Assuming you will put this file in your plugin's directory */
	require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'wp-load.php');
	if(!isset($_REQUEST['action']) || trim($_REQUEST['action'])=='') {
		die('-1');
	}
	
	@header('Content-Type: text/html; charset='.get_option('blog_charset'));
	/* Including your plugin's main file where ajax actions are defined */
	
	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'theme_actions.php');
	send_nosniff_header();
	if(has_action('wp_ajax_'.$_REQUEST['action'])) {
		do_action('wp_ajax_'.$_REQUEST['action']);
		exit;
	}
	status_header(404);
	
