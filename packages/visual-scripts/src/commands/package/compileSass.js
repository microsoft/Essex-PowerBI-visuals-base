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

const sass = require('node-sass')
const CleanCSS = require('clean-css')

module.exports = config => {
	const { build: { entry: { sass: sassEntry }, pbivizJson } } = config
	if (pbivizJson.style) {
		return render(sassEntry).then(renderOutput =>
			cleanup(renderOutput.css.toString())
		)
	}
	return Promise.resolve('')
}

const render = file =>
	new Promise((resolve, reject) =>
		sass.render({ file }, (err, res) => (err ? reject(err) : resolve(res)))
	)

const cleanup = output => {
	const options = {
		level: {
			2: {
				all: true,
				mergeNonAdjacentRules: false
			}
		}
	}
	return new CleanCSS(options).minify(output).styles
}
