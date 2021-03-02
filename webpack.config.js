import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
      filename: 'index.html',
    }),
  ],
};
