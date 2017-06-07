<?php

// ToDo slider width? Multiple sliders on page? Direction?


// Create Post Type
function horizontal_slider_post_types() {
    $labels = array(
        'name'               => 'Horizontal sliders',
        'singular_name'      => 'Horizontal slider',
        'menu_name'          => 'Horizontal slider',
        'name_admin_bar'     => 'Horizontal slider',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Horizontal slider',
        'new_item'           => 'New Horizontal slider',
        'edit_item'          => 'Edit Horizontal slider',
        'view_item'          => 'View Horizontal slider',
        'all_items'          => 'All Horizontal sliders',
        'search_items'       => 'Search Horizontal sliders',
        'parent_item_colon'  => 'Parent Horizontal sliders:',
        'not_found'          => 'No Horizontal sliders found.',
        'not_found_in_trash' => 'No Horizontal sliders found in Trash.'
    );

    $args = array(
        'public'      => true,
        'labels'      => $labels,
        'description' => 'Horizontal sliders post type',
        'label'       => 'Horizontal sliders',
        'supports'            => array( 'title', 'editor', ),
        'taxonomies'          => array(),
        'hierarchical'        => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => false,
        'show_in_admin_bar'   => true,
        'menu_position'       => 77,
        'has_archive'         => false,
        'exclude_from_search' => true,
    );
    register_post_type( 'hor_slider', $args );
}
add_action( 'init', 'horizontal_slider_post_types' );

//Enqueue js and css
add_action( 'wp_enqueue_scripts', 'horizontal_slider_styles' );
function horizontal_slider_styles(){
    wp_enqueue_style( 'hor_slider_style', get_stylesheet_directory_uri() . '/inc/css/horizontal_slider.css'  );
}
add_action( 'wp_enqueue_scripts', 'horizontal_slider_scripts' );
function horizontal_slider_scripts(){
    wp_enqueue_script('horizontal_slider_script', get_stylesheet_directory_uri() . '/inc/js/horizontal_slider.js', array( 'jquery'));
}

// Shortcode to display slider
// [horslider id="155" direction="right to left / left to right"]
function horizontal_slider_shortcode( $atts ){
    extract(shortcode_atts(array(
        'id' => '',
        'direction' => 'left',
    ), $atts));
    return get_horizontal_slider($id, $direction);
}
add_shortcode( 'horslider', 'horizontal_slider_shortcode' );

function get_horizontal_slider( $slider_id = null, $direction = null ) {
    if ($direction) $direction = ($direction!='right')?'left':'right';
    $args = array(
        'posts_per_page' => 1,
        'post_type' => 'hor_slider',
        'no_found_rows' => true,
    );
    if ( $slider_id ) $args['post__in'] = array( $slider_id );
    $query = new WP_Query( $args  );
    $slider = '';
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) : $query->the_post();
            $id = get_the_ID();
            $content = get_the_content();
            // we need a expression to match things
            $regex = '/src="([^"]*)"/';
            // we want all matches
            preg_match_all( $regex, $content, $matches );
            if(sizeof($matches)){
                if($imgNum=sizeof($matches[0])) {
                    $matches = $matches[0];// $matches = array_reverse($matches[0]);// reversing the matches array
                    $slider .= "<div data-direction=\"{$direction}\" class=\"hslider-holder\" id=\"hslider-{$id}\"><div class=\"hslider-wrapper hslider-{$id}\"><div class=\"hslider-container hslider-{$id}\">";
                    foreach ($matches as $imgurl) {
                        $slider .= "<div class=\"hslider-slide\"><img {$imgurl} /></div>";
                    }
                    $slider .= "</div><div class=\"swipe\">Swipe</div></div></div>";
                    break;
                }
            }
        endwhile;
        wp_reset_postdata();
    }
    return $slider;
}

// Add fake metabox above editing pane
function horizontal_slider_text_after_title( $post_type ) {
    $screen = get_current_screen();
    $edit_post_type = $screen->post_type;
    if ( $edit_post_type != 'hor_slider' )
        return;
    ?>
    <div class="after-title-help postbox">
        <h3>Using Horizontal slider</h3>
        <div class="inside">
            <p>Use full image size. No linking.<br />Use shotrcode: [horslider id="{post id}" direction="right/left(default)"]</p>
        </div><!-- .inside -->
    </div><!-- .postbox -->
<?php }
add_action( 'edit_form_after_title', 'horizontal_slider_text_after_title' );