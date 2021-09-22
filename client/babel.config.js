module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'], 
        plugins: ['babel-plugin-styled-components', 'react-native-reanimated/plugin']
    };
};
// const path = require('path');
// const pak = require('./package.json');

// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['module:metro-react-native-babel-preset'],
//     plugins: [
//       [
//         'module-resolver',
//         {
//           extensions: ['.tsx', '.ts', '.js', '.json'],
//           alias: {
//             [pak.name]: path.join(__dirname, '..', pak.source),
//           },
//         },
//       ],
//       'react-native-reanimated/plugin'
//     ]}
// };