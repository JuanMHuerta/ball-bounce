const path = require('path');

module.exports = {
  entry: {
    app: './js/bounce.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/bounce.js',
  },
};
