// Import Node.js' built-in 'path' module to handle file paths in a cross-platform way
const path = require("path");

// Import the HtmlWebpackPlugin which automatically generates an HTML file with the bundled JS included
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Entry point of your application (Webpack starts bundling from here)
  entry: "./src/index.ts",

  // Configuration for how different types of files are handled
  module: {
    rules: [
      {
        // Apply this rule to all files ending in .ts
        test: /\.ts$/,

        // Use 'ts-loader' to transpile TypeScript into JavaScript
        use: "ts-loader",

        // Ignore node_modules to speed up the build and avoid unnecessary transpilation
        exclude: /node_modules/,
      },
    ],
  },

  // Tell Webpack which file extensions to resolve automatically
  resolve: {
    extensions: [".ts", ".js"], // So you can import files without specifying these extensions
  },

  // Configuration for the output bundle
  output: {
    // Name of the output bundle
    filename: "bundle.js",

    // Directory where Webpack will emit the files
    path: path.resolve(__dirname, "dist"),

    // Clean the 'dist' folder before each build
    clean: true,
  },

  // Plugins to extend Webpack functionality
  plugins: [
    // Automatically generates an index.html and injects the bundle script tag into it
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"), // Serve content from 'dist'
    },
    compress: true, // Enable gzip compression
    port: 5500, // You can use any port
    open: true, // Automatically open browser
  },

  // Mode of Webpack build: 'development' for readable output and fast builds, 'production' for minified output
  mode: "production",
  devtool: false,
};
