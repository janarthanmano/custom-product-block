<?php
/*
Plugin Name: Gutenberg Product Block
Description: A custom Gutenberg block to display WooCommerce products with a customizable heading.
Version: 1.0
Author: Jana
*/

// Register the custom block as a plugin, no validation is done to check if WooCommerce is already installed
function gutenberg_product_block_assets() {
    // Register the block script
    wp_register_script(
        'gutenberg-product-block-js',
        plugins_url( 'gutenberg-product-block-build.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'gutenberg-product-block-build.js' )
    );

    // Register the block editor style
    wp_register_style(
        'gutenberg-product-block-css',
        plugins_url( 'style.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
    );

    register_block_type( 'custom/product-block', array(
        'editor_script' => 'gutenberg-product-block-js',
        'style' => 'gutenberg-product-block-css',
    ) );
}
add_action( 'init', 'gutenberg_product_block_assets' );

// Add custom REST API fields to access in the block script.
add_action('rest_api_init', function() {
    // Add the product image field
    register_rest_field('product', 'featured_media_url', [
        'get_callback' => function($product) {
            $image_id = $product['featured_media'];
            if ($image_id) {
                return wp_get_attachment_image_url($image_id, 'full');
            }
            return null;
        },
        'schema' => null,
    ]);

    // Add the product price field for editor rendering
    register_rest_field('product', 'price', [
        'get_callback' => function($product) {
            $currency = get_option('woocommerce_currency');
            $currencySymbol = html_entity_decode(get_woocommerce_currency_symbol($currency));
            return $currencySymbol.get_post_meta($product['id'], '_sale_price', true); // WooCommerce stores price in _price meta field
        },
        'schema' => null,
    ]);

    // Add the product price field in HTML for front end rendering
    register_rest_field('product', 'priceHTML', [
        'get_callback' => function($product) {
            $pro = wc_get_product( $product['id'] );
            return $pro->get_price_html(); // WooCommerce stores price in _price meta field
        },
        'schema' => null,
    ]);

});


// Add the frontend product fetcher js script, so the products are dynamically pulled using the selected product IDs in the editor.
function enqueue_product_fetcher_script() {
    if ( has_block( 'custom/product-block' ) ) {
        // Enqueue the WordPress REST API
        wp_enqueue_script('wp-api');

        wp_enqueue_script(
            'frontend-product-fetcher',
            plugins_url( 'frontend-product-fetcher.js', __FILE__ ),
            array(),
            null,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_product_fetcher_script' );


