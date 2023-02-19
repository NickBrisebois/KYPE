const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "KYPE Translator",
      template: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CopyPlugin({
        patterns: [
            { from: "src/images/interfaces/", to: "images/interfaces" },
            { from: "src/images/letters/", to: "images/letters" },
            { from: "src/images/numbers/", to: "images/numbers" },
        ]
    }),
  ],

  devServer: {
    static: path.join(__dirname, "build"),
    compress: true,
    port: 8080,
  },
};
