const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const conf = {
    entry: ["@babel/polyfill", __dirname + '/src/start.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    performance: {
        hints: false
    },
    mode: require.main == module ? 'production' : 'development',
    optimization: require.main == module ? {
        minimizer: [
            new UglifyJsPlugin({})
        ]
    } : {},
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                use: { loader: 'ts-loader' },
                exclude: /node_modules/
            },
            { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" }
        ]
    },
    devtool: "source-map"
};

if (require.main == module) {
    webpack(conf, function(err, info) {
        if (err) {
            console.log(err);
        }
        if (info && info.compilation.errors.length) {
            console.log(info.compilation.errors);
        }
    });
} else {
    module.exports = require('webpack-dev-middleware')(webpack(conf), {
        watchOptions: {
            aggregateTimeout: 300
        },
        publicPath: '/'
    });
}
