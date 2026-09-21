const path = require('path');

module.exports = {
  entry: './src/react-whatsmarked.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'react-whatsmarked.js',
    library: {
      name: 'ReactWhatsmarked',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
           use: ['style-loader', 'css-loader']
         }
       ]
     },
     externals: {
       react: 'react',
       'react-dom': 'react-dom'
     },
     mode: 'production'
   };
