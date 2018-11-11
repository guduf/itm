var path = require('path');
var webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: {
		'runtime': path.resolve(__dirname, 'src/monaco.js'),
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'tmp/monaco'),
    publicPath: 'monaco/'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': path.resolve(__dirname, 'promise.shim')
    })
  ]
};
