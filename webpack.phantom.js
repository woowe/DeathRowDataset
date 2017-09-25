const path = require('path');

module.exports = {
    entry: './traverse_page.js',
    // rules: [
    //     {
    //         test: /\.js$/,
    //         use: 'babel-loader',
    //     }
    // ],
    output: {
        filename: 'traverse_page.js',
        path: path.resolve(__dirname, 'dist')
    }
};