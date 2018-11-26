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
const mkdirp = require('mkdirp')
const chalk = require('chalk')
const conf = require('../../config')
const compileSass = require('./compileSass')
const emitPbivizJson = require('./emitPbivizJson')
const updateStatus = require('./updateStatus')
const startServer = require('./startServer')
const startWatchers = require('./startWatchers')

const start = () => {
	console.log(chalk.green('creating drop folder'))
	mkdirp.sync(conf.build.dropFolder)
	console.log(chalk.green('compilings sass'))
	compileSass()
	console.log(chalk.green('constructing pbiviz.json'))
	emitPbivizJson()
	console.log(chalk.green('update statusfile'))
	updateStatus()
	console.log(chalk.green('beginning watchers'))
	startWatchers()
	console.log(chalk.green('starting server'))
	startServer()
}

module.exports = start
