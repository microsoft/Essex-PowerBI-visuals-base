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
const webpack = require('webpack')
const chokidar = require('chokidar')
const conf = require('../../config')
const updateStatus = require('./updateStatus')
const pbiResource = require('./pbiResource')
const compileSass = require('./compileSass')
const emitPbivizJson = require('./emitPbivizJson')

const runWatchTask = (task, isSass) => {
	try {
		task()
	} catch (e) {
		isSass
			? console.info(
					`ERROR: ${e.message}\n    at ${e.file}:${e.line}:${
						e.column
					}`
			  )
			: console.info(`ERROR: ${e.message}`)
	}
}

//
// Watch the Webpack BUndle
//
const watchWebpackBundle = () => {
	// watch script change and re-compile
	const compiler = webpack(
		Object.assign(conf.webpackConfig, {
			output: {
				path: conf.build.dropFolder,
				filename: 'visual.js'
			}
		})
	)
	compiler.watch({}, (err, stats) => {
		let log = stats.toString({
			chunks: false,
			color: true
		})
		// log = log.split('\n\n').filter(msg => msg.indexOf('node_module') === -1 ).join('\n\n');
		console.info(log)
	})
}

//
// watch for pbiviz.json or capabilities.json change
//
const watchJson = () => {
	const watchFiles = []
	if (conf.build.pbivizJsonPath) {
		watchFiles.push(conf.build.pbivizJsonPath)
	}
	if (conf.build.capabilitiesJsonPath) {
		watchFiles.push(conf.build.capabilitiesJsonPath)
	}
	chokidar
		.watch(watchFiles)
		.on('change', path => runWatchTask(emitPbivizJson))
}

//
// Watch Sass Files
//
const watchSass = () => {
	chokidar
		.watch(['**/*.scss', '**/*.sass'])
		.on('change', path => runWatchTask(compileSass, true))
}

//
// watch pbi resource change and update status to trigger debug visual update
//
const watchResources = () => {
	chokidar
		.watch([
			pbiResource.jsFile,
			pbiResource.cssFile,
			pbiResource.pbivizJsonFile
		])
		.on('change', path => runWatchTask(updateStatus))
}

module.exports = () => {
	watchWebpackBundle()
	watchJson()
	watchSass()
	watchResources()
}
