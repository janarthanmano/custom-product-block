# Custom WooCommerce Gutenberg Product Block

This plugin provides a custom Gutenberg block for WordPress that allows editors to select WooCommerce products and display them dynamically on the frontend with images, titles, and prices.

## Features

- **Dynamic Product Selection**: Choose WooCommerce products directly within the Gutenberg editor.
- **Customizable Block Heading**: Set a unique heading for each block instance.
- **Frontend Product Display**: Dynamically loads selected product data (image, title, price) for display on the frontend.

## Requirements

- **WordPress** 5.0 or higher
- **WooCommerce** plugin (must be installed and active)
- **Node.js** and **npm** for development
- **PHP** 7.4 or higher

## Installation

### Step 1: Clone the Plugin Repository

Clone this plugin into the `wp-content/plugins/` directory of your WordPress site.

```bash
cd /path/to/your/wordpress/wp-content/plugins
mkdir gutenberg-product-block
cd gutenberg-product-block
git clone https://github.com/janarthanmano/custom-product-block.git .
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Block
Run the following command to build the block JavaScript. You can stop the watcher after generating the build if it is not for development.
```bash
npm run build
```

## Usage
**1. Activate the Plugin:** Go to the WordPress admin dashboard, then navigate to **Plugins > Installed Plugins** and activate **Gutenberg Product Block**.

**2. Add the Block:**
- In the Gutenberg editor, add the "Product Block" to any post or page.
- Use the Inspector controls to select products, add a heading, and configure the display.

**3. Render Products on the Frontend:**
- The block will render the selected products on the frontend by fetching data dynamically from the WordPress REST API.
- Ensure the WooCommerce products are published to see them in the editor.

## Troubleshooting
- **Product Data Not Loading:** Ensure WooCommerce is activated and products are published.
- **REST API Not Found:** Confirm that WordPress permalinks are set up correctly. The plugin relies on the REST API endpoint /wp-json/wp/v2/product.
- **wpApiSettings Undefined:** This may occur if the wp-api script is not loaded. See enqueue_product_fetcher_script in the plugin’s PHP file for correct setup.


