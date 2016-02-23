<?php
	get_header();
?>

<?php
/*This should always be at top, commented by Aman and added to header.php*/
	//session_start();
?>
<?php
	#Gets the 5 Parent Category Names
	$args = array(
		'type'			=>'post',
		'orderby'		=>'id',
		'exclude'		=>'1',
		'parent'		=>'0',
	);
	$parentCategories = get_categories( $args );
	
	#For storing Parent Category Names
	foreach($parentCategories as $parentCategory) {
		$cats[] = $parentCategory->name;
	}
	#Array with parentID -> array of child IDs it's an Associative Array
	foreach($parentCategories as $parentCategory) {
		$temp = array();
		$childCats = get_categories(array( 'child_of' => $parentCategory->cat_ID ));
		foreach($childCats as $childCat) {
			array_push($temp, $childCat->cat_ID);
		}
		$parentChild[$parentCategory->cat_ID] = $temp;		
	}
	//$limit_post stores the number of posts needed to be retrieved for each category.
	$limit_post = array(
		'3' => '5',
		'4' => '4',
		'5' => '4',
		'6' => '4',
		'7' => '4'
	);

	$title_count = array(	
		0 => array(1=>24,2=>20,3=>14,4=>26,5=>10),
		1 => array(1=>25,2=>15,3=>35,4=>30),	
		2 => array(1=>20,2=>31,3=>28,4=>15),
		3 => array(1=>41,2=>25,3=>14,4=>14),
		4 => array(1=>20,2=>16,3=>12,4=>25)
	);
	$address_length = array(
		0 => array(1=>33,2=>13,3=>22,4=>16,5=>16),
		1 => array(1=>22,2=>12,3=>14,4=>22),
		2 => array(1=>19,2=>14,3=>14,4=>20),
		3 => array(1=>25,2=>12,3=>11,4=>30),
		4 => array(1=>18,2=>12,3=>12,4=>23)
	);	
	$imgsizes = array(
		1 => array(
					1 => array(0 => 104, 1 => 153),
					2 => array(0 => 155, 1 => 73),
					3 => array(0 => 161, 1 => 125),
					4 => array(0 => 155, 1 => 71),
					5 => array(0 => 99, 1 => 184),
				),
		2 => array(
					1 => array(0 => 181, 1 => 83),
					2 => array(0 => 48, 1 => 105),
					3 => array(0 => 71, 1 => 120),
					4 => array(0 => 152, 1 => 98),
				),
		4 => array(
					1 => array(0 => 250, 1 => 132),
					2 => array(0 => 126, 1 => 112),
					3 => array(0 => 55, 1 => 77),
				),
		5 => array(
					1 => array(0 => 190, 1 => 74),
					2 => array(0 => 77, 1 => 123),
					3 => array(0 => 67, 1 => 84),
					4 => array(0 => 193, 1 => 60),
				),
		3 => array(
					1 => array(0 => 153, 1 => 44),
					2 => array(0 => 71, 1 => 122),
					3 => array(0 => 116, 1 => 168),
					4 => array(0 => 115, 1 => 97),
				),
	);
?>
	<script type="text/javascript">

	<?php
			
			if(isset($_SESSION['user_filter_details']))
			{
				$data['ajax_selectedSubCatIDs'] = isset($_SESSION['user_filter_details']['sub_cat_id'])?$_SESSION['user_filter_details']['sub_cat_id']:$homepage_categories;
				$data['ajax_selectedDate1'] = $_SESSION['user_filter_details']['start_date'];
				//echo 'session is set';
				//echo $data['ajax_selectedDate1'];
				$data['ajax_selectedMonthNum1'] = $_SESSION['user_filter_details']['start_month'];
				$data['ajax_selectedYear1'] = $_SESSION['user_filter_details']['start_year'];
				$data['ajax_selectedDate2'] = $_SESSION['user_filter_details']['end_date'];
				$data['ajax_selectedMonthNum2'] = $_SESSION['user_filter_details']['end_month'];
				$data['ajax_selectedYear2'] = $_SESSION['user_filter_details']['end_year'];
				
				if(($data['ajax_selectedYear1'].'-'.$data['ajax_selectedMonthNum1'].'-'
				.$data['ajax_selectedDate1']) < date('Y-m-d'))
				{
					$data['ajax_selectedDate1'] = date('d');
					//echo 'date is session is less than current date';
					//echo $data['ajax_selectedDate1'];
					
					$data['ajax_selectedMonthNum1'] = date('m');
					$data['ajax_selectedYear1'] = date('Y');
					$data['ajax_selectedDate2'] = date('d', strtotime('next Saturday'));
					$data['ajax_selectedMonthNum2'] = date('m', strtotime('next Saturday'));
					$data['ajax_selectedYear2'] = date('Y', strtotime('next Saturday'));
				}
			}else{
				
				$data['ajax_selectedSubCatIDs'] = $homepage_categories;
				$data['ajax_selectedDate1'] = date('d');
				//echo 'No Session ';
				//echo date('d');
				$data['ajax_selectedMonthNum1'] = date('m');
				$data['ajax_selectedYear1'] = date('Y');
				$data['ajax_selectedDate2'] = date('d', strtotime('next Saturday'));
				$data['ajax_selectedMonthNum2'] = date('m', strtotime('next Saturday'));
				$data['ajax_selectedYear2'] = date('Y', strtotime('next Saturday'));
			}			
			//Now need to set these values in the session
			$_SESSION['user_filter_details']['sub_cat_id'] = $data['ajax_selectedSubCatIDs']; 
			$_SESSION['user_filter_details']['start_date'] = $data['ajax_selectedDate1'];
			$_SESSION['user_filter_details']['start_month'] = $data['ajax_selectedMonthNum1'];
			$_SESSION['user_filter_details']['start_year'] = $data['ajax_selectedYear1'];
			$_SESSION['user_filter_details']['end_date'] = $data['ajax_selectedDate2'];
			$_SESSION['user_filter_details']['end_month'] = $data['ajax_selectedMonthNum2'];
			$_SESSION['user_filter_details']['end_year'] = $data['ajax_selectedYear2'];
			
			?>

		sessionData.page='home';
		sessionData.catIDs = <?php echo json_encode($data['ajax_selectedSubCatIDs']); ?>;
		sessionData.startDate = <?php echo $data['ajax_selectedDate1']; ?>;
		sessionData.startMonth = <?php echo $data['ajax_selectedMonthNum1']; ?>;
		sessionData.startYear = <?php echo $data['ajax_selectedYear1']; ?>;
		sessionData.endDate = <?php echo $data['ajax_selectedDate2']; ?>;
		sessionData.endMonth = <?php echo $data['ajax_selectedMonthNum2']; ?>;
		sessionData.endYear = <?php echo $data['ajax_selectedYear2']; ?>;
		
		var wazaaprepush=[];
		<?php
			$diff=array_diff($homepage_categories, $data['ajax_selectedSubCatIDs']);
			foreach($diff as $val){
				echo " wazaaprepush['cat-{$val}']='' \n";
			}
		?>
		

<?php			
			//print_r($_SESSION['user_filter_details']);
			//echo '..';
			$required='';
			$k=$homepage_categories;
			
			$selectedDate= 	intval($data['ajax_selectedYear1'])
				.'-'.intval($data['ajax_selectedMonthNum1'])
				.'-'.intval($data['ajax_selectedDate1']);			
			foreach($k as $key => $value){
				$value=intval($value);
				$required.="(SELECT DISTINCT post_id, starts_on, "
				."term_taxonomy_id FROM wp_lookup WHERE "
				."(starts_on>='{$selectedDate}' OR "
				."ends_on>='{$selectedDate}')"
				." AND term_taxonomy_id = {$value} "
				."ORDER BY starts_on LIMIT ".$homepage_categories_count[$value].") union all";
				
				//echo $required;
			}
			$required = substr($required, 0, -10);
			//print_r($required);
			global $wpdb;				
			$postIDs=$wpdb->get_results($required, ARRAY_A);
			//print_r($postIDs);
			/*
			$retrived_count=array(
							3 => 0,
							4 => 0,
							5 => 0,
							6 => 0,
							7 => 0,													
			);*/
			foreach($homepage_categories as $catrgoriestocount){
				$retrived_count[$catrgoriestocount]=0;
			}
			
			 //For counting the no of records fetched for each category			
			$postIDsArray=array(); //Getting all post id, so that we can fetch all data in one query
			//print_r($retrived_count);
			$postdatesarray=array(); //Storing Post Dates, so that it doesnot reads from meta data ?? can meta data and this be different?
			$postcategories=array(); //Let's cache the categories, why get_category again?			
			$postincategories=array(); //caching posts according to categories, required for next block, since the end date has come
			foreach($postIDs as $postID){
				
				if(!isset($postincategories[$postID['term_taxonomy_id']])){
					$postincategories[$postID['term_taxonomy_id']]=array();
				}
				$postincategories[$postID['term_taxonomy_id']][]=$postID['post_id'];
				
				$retrived_count[$postID['term_taxonomy_id']]=
				isset($retrived_count[$postID['term_taxonomy_id']])?
				($retrived_count[$postID['term_taxonomy_id']]+1):1;
				array_push($postIDsArray, $postID['post_id']);
				$postcategories[$postID['post_id']]=$postID['term_taxonomy_id'];
				$postdatesarray[$postID['post_id']]=$postID['starts_on'];
			}
			
			//var_dump($retrived_count);
			
			//print_r($retrived_count);
			//echo "after..";						
			//var_dump($postIDsArray);
			//Checking for deficit no for posts for each categories, IF less then 5.. pull ONLY remaining number
			foreach($retrived_count as $requiredcatid=>$fetchedcount){
				if($fetchedcount<$homepage_categories_count[$value]){
					//echo $requiredcatid;
					
					
					
					$query="SELECT DISTINCT post_id, starts_on FROM wp_lookup "
					."WHERE starts_on<='{$selectedDate}' "
					."AND term_taxonomy_id = {$requiredcatid} ".(($fetchedcount==0)?'':' and post_id not in ('.implode(',', $postincategories[$requiredcatid]).') ')
					." ORDER BY starts_on DESC "
					."LIMIT ".($homepage_categories_count[$value]-$fetchedcount+1);
					//echo $query,"\n\n"; 
					//print_r($query);
					$postIDs=$wpdb->get_results($query, ARRAY_A);
					foreach($postIDs as $postID){
						array_push($postIDsArray, $postID['post_id']);
						$postcategories[$postID['post_id']]="$requiredcatid";
					}
				}
			}
			//die();
			$posts=get_posts(array('post__in'=>$postIDsArray, 'numberposts'=>25));
			//print_r($posts); die();
			$toSend=array();
			$boxidcounts=array();						
			$senditem=array();			
			//print_r($posts); die();
			foreach($posts as $post){
				$boxidcount=isset($boxidcounts[$postcategories[$post->ID]])?($boxidcounts[$postcategories[$post->ID]]+1):0;
				$boxidcounts[$postcategories[$post->ID]]=$boxidcount;
				$custom_fields=get_post_custom($post->ID);
				if(!isset($toSend[($postcategories[$post->ID]-2)])){
					$toSend[($postcategories[$post->ID]-2)]=array();
				}
				$imageid=get_post_thumbnail_id($post->ID);
				$image=wp_get_attachment_image_src($imageid);
				$toSend[($postcategories[$post->ID]-2)]["box".($boxidcount+1)][]=array(
								'title'=>$post->post_title,
								'loc'=>is_null($custom_fields['WZ_venue'][0])?'':$custom_fields['WZ_venue'][0],
								'wz_date'=>$custom_fields['WZ_date'][0],
								'display_time'=>is_null($postdatesarray[$post->ID])?'':(date('D M d', strtotime($postdatesarray[$post->ID]))),
								'price'=>is_null($custom_fields['WZ_cost'][0])?'':$custom_fields['WZ_cost'][0],
								'permalink'=> get_post_permalink($post->ID),
								'img_id'=>$imageid,
								'image'=>(is_null($image[0]) || $image[0]=='')?'':(get_bloginfo('template_url').'/timthumb.php?src='.urlencode($image[0]).'&w='.($imgsizes[($postcategories[$post->ID]-2)][$boxidcount+1][0].'&h='.($imgsizes[($postcategories[$post->ID]-2)][$boxidcount+1][1])))
								
							);
			}
			
			foreach($toSend as $blockid=>$boxes)
			{
				?>
				
				var block<?php echo $blockid; ?> = <?php echo json_encode($boxes), ";\n"; ?>
				
				<?php
			}			
?>


	
	</script>
<?php
	
	$str_cat = '"'.implode("\",\"", $cats).'"';
	
?>
	<script type="text/javascript">

		var menu = [<?php echo $str_cat ?>];
	</script>	
	<div class="main">
		<div class="box1">
			<div class="sq1-1 yellow indiv">
				<div class="m-9">
					<div class="left f-img-1"></div>
					<div class="left desc">
						<h4></h4>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
			</div>
			<div class="sq1-2 yellow indiv">
				<div class="m-9">
					<div class="f-img-2"></div>
					
					<div class="desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
			</div>
			<div class="sq1-3 yellow indiv">
					<div class="m-9">
						<div class="f-img-4"></div>
						<div class="desc">
							<h5></h5>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>
					</div>	
			</div>
			<div class="sq1-4 yellow indiv">
					<div class="m-9">
						<div class="left f-img-5"></div>
						
						<div class="left desc">
							<h3></h3>
							<div class="metaContent">

								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
			</div>
		</div>
		
		<div class="box2">
			<div class="left" style="width:184px;">
				<div class="sq2-1 yellow indiv">
					<div class="m-9">
						<div class="f-img-3"></div>
						
						<div class="desc">
							<h5></h5>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>				
				</div>
				<?php
				$link_cnt = 1;
				foreach($parentCategories as $key=>$category) {
					$link_cnt++;
					?>
					<div class="sq2-<?php echo $link_cnt ?>">
						<a href="<?php echo get_option('siteurl')."/?category_name=".$category->slug ?>"></a>
					</div>	
				<?php
				}
				?>

			</div>
			
			<div class="left" style="width:198px;height:329px;">
				<div class="sq2-7 blue  indiv">
					<div class="m-9">
						<div class="f-img-6"></div>
						
						<div class="desc">
							<h4></h4>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
				</div>
				<div class="sq2-8 blue indiv">
					<div class="m-9">
						<div class="left f-img-7"></div>
						
						<div class="left desc">
							<h5></h5>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
				</div>
			</div>
			
			<div class="left" style="width:171px;height:329px;">
				<div class="sq2-9 blue indiv">
					<div class="m-9">
						<div class="left f-img-8"></div>
						
						<div class="left desc">
							<h4></h4>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
				</div>
				<div class="sq2-10 blue indiv">
					<div class="m-9">
						<div class="f-img-9"></div>
						
						<div class="desc">
							<h5></h5>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
				</div>				
			</div>
			
			<div style="width:370px;height:140px;float:left;">
				<div class="sq2-11 red indiv">
				<div class="m-9">
					<div class="f-img-19"></div>
					
					<div class="desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>				
				
				<div class="sq2-12 red indiv">
					<div class="m-9">
						<div class="left f-img-20"></div>
						
						<div class="left desc">
							<h5></h5>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>
				</div>				
			</div>
		</div>
		
		<div class="box3">
			<div class="sq3-1 purple indiv">
					<div class="m-9">
						<div class="f-img-10"></div>
						
						<div class="desc">
							<h3></h3>
							<div class="metaContent">
								<span class="loc"></span>
								<span class="time"></span>
								<span class="price"></span>
							</div>
						</div>					
					</div>			
			</div>
			<div class="sq3-2 purple indiv">
				<div class="m-9">
					<div class="left f-img-11"></div>
					
					<div class="left desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
			</div>
		</div>
		

		<div class="box4 purple  indiv">
				<div class="m-9">
					<div class="left f-img-12"></div>
					
					<div class="left desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
		</div>
		
		<div class="box5">
			<div class="left">
				<div class="sq5-1 green indiv">
				<div class="m-9">
					<div class="f-img-13"></div>
					
					<div class="desc">
						<h3></h3>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
				<div class="sq5-4 green indiv">
				<div class="m-9">
					<div class="left f-img-14"></div>
					
					<div class="left desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
			</div>
			<div class="left"> 
				<div class="sq5-2 green indiv">
				<div class="m-9">
					<div class="left f-img-15"></div>
					
					<div class="left desc">
						<h4></h4>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
				<div class="sq5-5 green indiv">
				<div class="m-9">
					<div class="f-img-16"></div>
					
					<div class="desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
			</div>
			
			<div class="left">
				<div class="sq5-3 red indiv">
				<div class="m-9">
					<div class="left f-img-17"></div>
					
					<div class="left desc">
						<h3></h3>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
				
				<div class="sq5-6 red indiv">
				<div class="m-9">
					<div class="left f-img-18"></div>
					
					<div class="left desc">
						<h5></h5>
						<div class="metaContent">
							<span class="loc"></span>
							<span class="time"></span>
							<span class="price"></span>
						</div>
					</div>					
				</div>
				</div>
			</div>
			
		</div>		
		
		<div class="clear">
			
		</div>
	</div>
<div style="margin-top: 20px;"><?php get_footer(); ?>
