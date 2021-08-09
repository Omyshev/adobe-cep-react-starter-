const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const pluginConfig = require("../pluginrc");
const buildFolder = path.join(
  pluginConfig.destinationFolder,
  pluginConfig.extensionBundleId
);
const server_output = path.join(buildFolder, "server");
const server_entry = path.join(pluginConfig.root, "server/");
const server_file = path.join(server_entry, "index.js");

module.exports = {
  entry: server_file,
  target: "node",
  externals: [
    nodeExternals({ modulesDir: path.join(server_entry, "node_modules") }),
  ],
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
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  node: {
    global: true,
    __filename: true,
    __dirname: false,
  },
  output: {
    pathinfo: false,
    path: server_output,
    publicPath: "",
    filename: "bundle.js",
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(server_entry, "node_modules"),
          to: "../node_modules",
        },
      ],
    }),
  ],
};
