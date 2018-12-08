const path = require('path');
const webpack = require('webpack');
const VirtualModulesPlugin = require('webpack-virtual-modules');

const runtime = `
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') return './monaco/json.worker.js';
      if (label === 'typescript' || label === 'javascript') return './monaco/ts.worker.js';
      return './monaco/editor.worker.js';
    }
  };

  self.initMonaco = function initMonaco() {
    return import('monaco-editor').then(() => self.monaco);
  };
`;

const promiseShim = `
  const Promise = require('core-js/es6/promise');

  module.exports = class PromiseShim extends Promise {
    constructor(executor) {
      super(executor);
    }
  }
`;

module.exports = {
	mode: process.argv.indexOf('--prod') >= 0 ? 'production' : 'development',
	entry: {
		'runtime': '.runtime',
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
    rules: [{test: /\.css$/, use: ['style-loader', 'css-loader']}]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': '.promise.shim'
    }),
    new VirtualModulesPlugin({
      'node_modules/.runtime': runtime,
      'node_modules/.promise.shim': promiseShim
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 10})
  ]
};
