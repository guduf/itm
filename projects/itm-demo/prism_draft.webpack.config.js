const { join } = require('path');

module.exports = {
  resolve: {
    extensions: ['.js']
  },
  entry: join(__dirname, 'prism_draft.js'),
  output: {
    filename: 'prism_draft.js',
    path: join(__dirname, 'tmp')
  },
  mode: 'development',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
