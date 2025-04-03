<?php
/**
 * Plugin Name: Remote Post Slideshow Block
 * Author: Adrian Sticea
 * Description: This custom Gutenberg block displays a responsive slideshow of the latest blog posts from any WordPress website using the WP REST API. By default, it fetches posts from WPTavern, but users can input any site URL to dynamically load content from that site. Each slide showcases the post title, featured image, author, and publish date, with full styling controls for borders, colors, typography, spacing, and auto-scroll behavior.
 */

function wp_slideshow_block_register() {
    wp_register_script(
        'wp-slideshow-block-editor',
        plugins_url('editor.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-editor'],
        filemtime(plugin_dir_path(__FILE__) . 'editor.js')
    );

    wp_register_script(
        'wp-slideshow-block-frontend',
        plugins_url('frontend.js', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'frontend.js'),
        true
    );

    wp_register_style(
        'wp-slideshow-block-style',
        plugins_url('style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );

    register_block_type('custom/slideshow-block', [
        'editor_script' => 'wp-slideshow-block-editor',
        'script' => 'wp-slideshow-block-frontend',
        'style' => 'wp-slideshow-block-style',
        'render_callback' => 'wp_slideshow_block_render',
        'attributes' => [
            'siteUrl' => ['type' => 'string', 'default' => 'https://wptavern.com'],
            'showDate' => ['type' => 'boolean', 'default' => true],
            'showAuthor' => ['type' => 'boolean', 'default' => true],
            'autoScroll' => ['type' => 'boolean', 'default' => false],
            'interval' => ['type' => 'number', 'default' => 5],
    
            'borderStyle' => ['type' => 'string', 'default' => 'solid'],
            'borderColor' => ['type' => 'string', 'default' => '#000000'],
            'borderWidth' => ['type' => 'number', 'default' => 1],
            'borderRadius' => ['type' => 'number', 'default' => 10],
            'backgroundColor' => ['type' => 'string', 'default' => '#ffffff'],
            'contentPadding' => ['type' => 'number', 'default' => 10],
    
            'titleColor' => ['type' => 'string', 'default' => '#000000'],
            'titleAlign' => ['type' => 'string', 'default' => 'left'],
            'titleSize' => ['type' => 'number', 'default' => 18],
            'titleMargin' => ['type' => 'object', 'default' => ['top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0]],
    
            'authorColor' => ['type' => 'string', 'default' => '#333333'],
            'authorAlign' => ['type' => 'string', 'default' => 'left'],
            'authorSize' => ['type' => 'number', 'default' => 14],
            'authorMargin' => ['type' => 'object', 'default' => ['top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0]],
    
            'dateColor' => ['type' => 'string', 'default' => '#666666'],
            'dateAlign' => ['type' => 'string', 'default' => 'left'],
            'dateSize' => ['type' => 'number', 'default' => 14],
            'dateMargin' => ['type' => 'object', 'default' => ['top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0]]
        ]
    ]);
    
}
add_action('init', 'wp_slideshow_block_register');

function wp_slideshow_block_render($attributes) {
    ob_start();
    ?>
    <div class="wp-slideshow-container"
        <?php foreach ($attributes as $key => $value): ?>
            <?php
                $data_key = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $key));
                // Encode arrays/objects (like margins)
                if (is_array($value) || is_object($value)) {
                    $data_val = wp_json_encode($value);
                } elseif (is_bool($value)) {
                    $data_val = $value ? '1' : '0';
                } else {
                    $data_val = strval($value);
                }
            ?>
            data-<?php echo esc_attr($data_key); ?>="<?php echo esc_attr($data_val); ?>"
        <?php endforeach; ?>
    ></div>
    <?php
    return ob_get_clean();
}

