var path     = require('path')
var pathRoot = process.cwd()
var webpack  = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

console.log(`pathRoot: ${pathRoot}`)

module.exports = {
	entry: path.resolve('./src/index.js'),
	// output: {
	// 	libraryTarget: 'var',
	// 	path: path.resolve(pathRoot, './dist/'),
	// 	publicPath: '/',
	// 	filename: '[name]_[hash:8].js',
	// 	chunkFilename: '[name]_[hash:8].js'
	// },
	
	plugins: [
		new CopyWebpackPlugin([
			// { from: './src/static/svg.js', to: 'static/svg.js' },
			// { from: './src/static/svg.draggable.js', to: 'static/svg.draggable.js' },
			// { from: './src/static/zepto.min.js', to: 'static/zepto.js' }
		]),

		new HtmlWebpackPlugin({
			inject: 'body',
			template: './static/index.html',
			filename: 'index.html',
			// chunksSortMode: 'dependency'
		}),

		// new webpack.NoErrorsPlugin()
	],

	module: {},

	resolve: {
		modules: [
			'node_modules',
			path.resolve(pathRoot)
		],
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'@comp':   'src/component',
			'@store':  'src/store',
			'@utils':  'src/utils',
			'@pages':  'src/pages',
			'actions': 'src/store/actions',
			'assets':  'src/assets',
			'@state':  'src/state',
			'@var':    'src/state/var',
			'@node':   'src/state/node',
		}
	},

	optimization: {
		runtimeChunk: true,
		splitChunks: {
			chunks: 'all'
		}
	}
}