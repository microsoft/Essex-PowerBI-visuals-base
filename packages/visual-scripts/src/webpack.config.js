/*
 * Copyright (c) Microsoft
 * All rights reserved.
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const INIT_CWD = process.env.INIT_CWD;

const modulesPaths = [
  "node_modules",
  path.join(process.env.INIT_CWD, "node_modules"),
  path.join(__dirname, "../node_modules"),
  path.join(process.env.INIT_CWD, "../../node_modules") // Lerna Monorepos
];

module.exports = buildConfig => {
  const webpackConf = {
    entry: buildConfig.entry.js,
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      modules: modulesPaths
    },
    output: {
      filename: "visual.js",
      path: buildConfig.dropFolder
    },
    resolveLoader: {
      modules: modulesPaths
    },
    module: {
      loaders: [
        {
          test: new RegExp(regex),
          loader: path.join(__dirname, "util/pbiPluginLoader")
        },
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.json$/,
          loader: "json-loader"
        },
        {
          test: /\.ts(x|)$/,
          loader: "ts-loader",
          options: {
            configFile: path.join(INIT_CWD, "tsconfig.json")
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          DEBUG: '"' + (process.env.DEBUG || "") + '"',
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
        }
      })
    ]
  };

  if (process.env.NODE_ENV !== "production") {
    webpackConf.devtool = "eval";
  } else {
    var banner = new webpack.BannerPlugin(
      fs.readFileSync("LICENSE").toString()
    );
    var uglify = new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      minimize: true,
      compress: false,
      beautify: false,
      output: {
        ascii_only: true, // Necessary, otherwise it messes up the unicode characters that lineup is using for font-awesome
        comments: false
      }
    });
    webpackConf.plugins.push(uglify);
    webpackConf.plugins.push(banner);
  }

  return webpackConf
};
