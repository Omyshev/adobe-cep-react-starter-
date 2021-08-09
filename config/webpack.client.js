const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pluginConfig = require("../pluginrc");
const buildFolder = path.join(
  pluginConfig.destinationFolder,
  pluginConfig.extensionBundleId
);
const client_output = path.resolve(buildFolder, "client");
const client_entry = path.resolve(__dirname, "../client/index.js");
const html_template = path.join(
  __dirname,
  "./assets/templates/index.template.html"
);

module.exports = {
  entry: {
    main: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        client_entry
    ],
},
  target: "web",
  module: {
    rules: [
      {
        test: /\.(tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
        }
      },
    {
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader',
        options: {
            name: 'fonts/[name].[ext]'
        },
    },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".scss",  ".svg"],
  },
  output: {
    path: client_output,
    publicPath: "",
    filename: "bundle.js",
  },
  // devtool: "source-map",
  devServer: {
    contentBase: client_output,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: html_template,
      filename: "index.html",
      inject: "body",
      title: "HTML Webpack Plugin",
      bar: "bar",
    }),
  ],
};
