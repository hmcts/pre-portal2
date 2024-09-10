const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve(__dirname, '../src/main/assets');
const images = path.resolve(root, 'images');

const loadingSpinner = path.resolve(images, 'loading-spinner.gif');

const copyCustomAssets = new CopyWebpackPlugin({
  patterns: [{ from: loadingSpinner, to: 'assets/images' }],
});

module.exports = {
  paths: { template: root },
  plugins: [copyCustomAssets],
};
