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
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const cwd = process.cwd()

const modulesPaths = [
	'node_modules',
	path.join(cwd, 'node_modules'),
	path.join(__dirname, '../node_modules')
]

const mode =
	process.env.NODE_ENV === 'production' ? 'production' : 'development'
const licenseText = fs.readFileSync(path.join(cwd, 'LICENSE')).toString()
const tsConfigFilePath = path.join(cwd, 'tsconfig.json')

module.exports = buildConfig => ({
	entry: buildConfig.entry.js,
	mode,
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
		modules: modulesPaths
	},
	output: {
		filename: 'visual.js',
		path: buildConfig.dropFolder
	},
	resolveLoader: {
		modules: modulesPaths
	},
	module: {
		rules: [
			{
				test: new RegExp(
					path
						.normalize(buildConfig.entry.js)
						.replace(/\\/g, '\\\\')
						.replace(/\./g, '\\.')
				),
				use: '@essex/visual-entry-loader'
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: tsConfigFilePath
						}
					}
				]
			}
		]
	},
	plugins: [new webpack.BannerPlugin(licenseText)]
})
