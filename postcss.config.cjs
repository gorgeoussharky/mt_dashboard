module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-preset-env'),
    require('css-declaration-sorter'),
    require('postcss-pxtorem')({
      propList: ['*'],
      minPixelValue: 3,
    }),
  ],
};