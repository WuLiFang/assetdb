const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './lib/assetdb/static'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader'
                            + '?indentedSyntax',
                    },
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: new RegExp('\\.(png|jpg|jpeg|gif|eot|ttf'
                    + '|woff|woff2|svg|svgz)(\\?.+)?$'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                }],
            },

        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', '.css'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    devServer: {
        contentBase: path.join(__dirname, 'lib/assetdb/templates'),
        proxy: {
            '/api': 'http://localhost:6001',
        },
        publicPath: '/static/',
    },
};
