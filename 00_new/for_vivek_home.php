<?php get_header(); ?>
<div class="main">
  <div style="position:relative; height:776px;">
    <?php
       foreach($post_category as $slug=>$attrs){
         for($counter=0; $counter<$attrs['home_page_count']; $counter++){
         ?>
           <div class="<?php echo $slug; ?> pos_abs" id="<?php echo $slug, '-', $counter; ?>">
	   </div>
         <?php
       }  
    }
    ?>
    <div>
    <?php
    $top=235;
    foreach($post_category as $slug=>$attrs){
      ?>
      <div style="top:<?php echo $top; ?>px" class="pos_abs category_label" id="<?php echo $slug; ?>">
        <a href="<?php echo get_option('siteurl')."/?category_name=".$slug; ?>"><?php echo $attrs['label']; ?></a>
      </div>
     <?php
	$top=$top+47;																		     
    }
    ?>
    </div>
</div> 
</div>
<script>
<?php $events=$wzr->get_events(); ?>
wz_data={};
wz_data.from_date=new Date('<?php echo $events['from_date']; ?>');
wz_data.to_date=new Date('<?php echo $events['to_date']; ?>');
wz_data.events=<?php echo json_encode($events['events']); ?>;
wz_data.cat_menu=<?php echo json_encode($events['category_display']); ?>;
wz_data.selected_cat_item=<?php echo json_encode(isset($_SESSION['w_selected_cat_item'])?$_SESSION['w_selected_cat_item']:array()); ?>;
wz_data.page='home';
</script>
<div style="margin-top: 20px;"><?php get_footer(); ?>