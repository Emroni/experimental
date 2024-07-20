const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvFlow = require('dotenv-flow-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            '@/components': path.resolve(__dirname, 'src/components/'),
            '@/constants': path.resolve(__dirname, 'src/constants/'),
            '@/experiments': path.resolve(__dirname, 'src/experiments/'),
            '@/helpers': path.resolve(__dirname, 'src/helpers/'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].[fullhash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        client: {
            logging: 'none',
        },
        historyApiFallback: true,
        hot: true,
        open: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DotenvFlow(),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
        }),
    ],
};