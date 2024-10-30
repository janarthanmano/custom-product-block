const { registerBlockType } = wp.blocks;
const { useSelect } = wp.data;
const { useState, useEffect } = wp.element;
const { TextControl, SelectControl, PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor;

registerBlockType('custom/product-block', {
    title: 'Product Block',
    icon: 'cart',
    category: 'widgets',
    attributes: {
        heading: { type: 'string', default: 'Featured Products' },
        selectedProducts: { type: 'array', default: [] }
    },
    edit: ({ attributes, setAttributes }) => {
        const { heading, selectedProducts } = attributes;

        // Local state for product options
        const [productOptions, setProductOptions] = useState([]);

        // Fetching products using useSelect and manage loading state
        const { products, isLoading } = useSelect((select) => {
            const query = { per_page: -1 };
            const products = select('core').getEntityRecords('postType', 'product', query);

            return {
                products,
                isLoading: !products,
            };
        }, []);

        // Update products attribute only if it's empty and products are fetched
        useEffect(() => {
                if (products && products.length > 0) {
                    const options = products.map((product) => ({
                        value: product.id,
                        label: product.title.rendered,
                        imageUrl: product.featured_media_url || '',
                        price: product.price || 'Price not available',
                        link: product.link
                    }));
                    setProductOptions(options);
                }
        }, [products]);


        // Handle product selection for multi-select
        const handleProductSelection = (newProductIds) => {
            setAttributes({ selectedProducts: newProductIds });
        };

        return (
        <>
            <InspectorControls>
                <PanelBody title="Product Block Settings">
                    <TextControl
                        label="Block Heading"
                        value={heading}
                        onChange={(value) => setAttributes({ heading: value })}
                    />
                    <h4>Select Products to Display</h4>
                    {isLoading ? (
                        <p>Loading products...</p> // Display loading text while fetching
                    ) : (
                    <SelectControl
                        multiple
                        label="Products"
                        value={selectedProducts}
                        onChange={handleProductSelection}
                        options={productOptions}
                    />)}
                </PanelBody>
            </InspectorControls>
            <div className="product-block">
                <h2>{heading}</h2>
                <div className="product-list">
                    {selectedProducts.map((productId) => {
                        const product = productOptions.find((p) => p.value == productId);
                        return product ? (
                            <div key={product.value} className="product-item">
                                <img src={product.imageUrl} alt={product.label} />
                                <h3>{product.label}</h3>
                                <p>{product.price}</p>
                            </div>
                        ) : (<div>Loading...</div>);
                    })}
                </div>
            </div>
        </>
        );
    },
    save: ({ attributes }) => {
        const { heading, selectedProducts } = attributes;
        return (
            <div className="product-block" data-product-ids={selectedProducts.join(',')}>
                <div className="product-list">
                    <h2>{heading}</h2>
                </div>
            </div>
        );
    },
});