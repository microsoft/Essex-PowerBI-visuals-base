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
const fs = require('fs')
const https = require('https')
const connect = require('connect')
const chalk = require('chalk')
const serveStatic = require('serve-static')
const conf = require('../../config')

module.exports = () => {
	const options = {
		key: fs.readFileSync(conf.server.privateKey),
		cert: fs.readFileSync(conf.server.certificate)
	}

	const app = connect()
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		next()
	})
	app.use('/assets', serveStatic(conf.build.dropFolder))

	https.createServer(options, app).listen(conf.server.port, err => {
		if (err) {
			console.error(chalk.red('Error starting server', err))
			process.exit(1)
		}
		console.info(
			chalk.green('server listening on port ') +
				chalk.blue.bold(conf.server.port) +
				chalk.blue('.')
		)
	})
}
