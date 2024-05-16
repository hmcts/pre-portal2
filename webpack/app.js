const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve(__dirname, './../../');
const sass = path.resolve(root, './main/assets/scss');
const images = path.resolve(root, './main/assets/images');
const mkPlayer = require.resolve('@mediakind/mkplayer');

const copyLookAndFeelAssets = new CopyWebpackPlugin({
  patterns: [{ from: images, to: 'images' }],
});

const copyMediaKindAssets = new CopyWebpackPlugin({
  patterns: [{ from: mkPlayer, to: 'mkplayer' }],
});

module.exports = {
  paths: { root, sass },
  plugins: [copyLookAndFeelAssets, copyMediaKindAssets],
};
