/**
 * Copyright (c) 2016 Uncharted Software Inc.
 * http://www.uncharted.software/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
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

'use strict'

const webpack = require('webpack')
const MemoryFS = require('memory-fs')

module.exports = config => {
	return new Promise((resolve, reject) => {
		const fs = new MemoryFS()
		const compiler = webpack(config.webpackConfig)
		compiler.outputFileSystem = fs
		compiler.run((err, stats) => {
			if (err) throw err
			const jsonStats = stats.toJson(true)
			console.info('Time:', jsonStats.time)
			console.info('Hash:', jsonStats.hash)
			console.info(
				'%s Warnings, %s Errors',
				jsonStats.warnings.length,
				jsonStats.errors.length
			)
			jsonStats.warnings.forEach(warning =>
				console.warn('WARNING:', warning)
			)
			jsonStats.errors.forEach(error => console.error('ERROR:', error))
			const hasRealErrors = jsonStats.errors.some(
				e => e.indexOf('node_modules') === -1
			)
			if (hasRealErrors) {
				return reject(jsonStats.errors)
			} else {
				return resolve(jsonStats)
			}
		})
	})
}
