const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	mode: 'development',
	entry: {
		'runtime': path.resolve(__dirname, 'src/monaco.ts'),
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
	},
	output: {
		globalObject: 'self',
		filename: '[name].js',
    path: path.resolve(__dirname, 'tmp/monaco'),
    publicPath: 'monaco/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: path.resolve(__dirname, 'tsconfig.monaco.json')
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': path.resolve(__dirname, 'promise.shim')
    }),
    new CheckerPlugin()
  ]
};
