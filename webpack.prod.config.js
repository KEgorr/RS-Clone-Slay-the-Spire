const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',

  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
};
