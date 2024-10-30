const path = require('path');

module.exports = {
    entry: './gutenberg-product-block.js', // Entry file for your block
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'gutenberg-product-block-build.js', // Output compiled file
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    mode: 'production',
    watch: true
};
