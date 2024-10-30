document.addEventListener("DOMContentLoaded", () => {
    // Select the DOM element with the product IDs in the custom attribute
    const productBlocks = document.querySelectorAll(".product-block");

    // wp-api script is loaded in the main plugin file
    const apiBaseUrl = wpApiSettings.root + 'wp/v2/product?include=';

    productBlocks.forEach((block) => {
        const productIds = JSON.parse('['+block.getAttribute("data-product-ids")+']');

        // If no products are selected in the editor
        if (!productIds || productIds.length === 0) {
            block.innerHTML += "<p>No products selected.</p>";
            return;
        }

        // Fetch product data from the WordPress REST API
        fetch(`${apiBaseUrl}${productIds.join(",")}`)
            .then((response) => response.json())
            .then((products) => {
                const productList = document.createElement("div");
                productList.classList.add("product-list");

                products.forEach((product) => {
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");

                    const productImage = product.featured_media_url
                        ? `<img src="${product.featured_media_url}" alt="${product.title.rendered}" />`
                        : "";
                    const productTitle = `<a href="${product.link}" target="_blank"><h3>${product.title.rendered}</h3></a>`;
                    const productPrice = product.priceHTML
                        ? `<p>${product.priceHTML}</p>`
                        : "<p>Price not available</p>";

                    productItem.innerHTML = `${productImage}${productTitle}${productPrice}`;
                    productList.appendChild(productItem);
                });

                block.appendChild(productList);
            })
            .catch((error) => {
                block.innerHTML += "<p>Failed to load products.</p>";
                console.error("Error fetching products:", error);
            });
    });
});
