const fs = require('fs')
const chalk = require('chalk')
const sass = require('node-sass')
const conf = require('../../config')
const pbiResource = require('./pbiResource')

module.exports = () => {
	console.info(chalk.green('building sass'))
	const cssContent = sass.renderSync({ file: conf.build.entry.sass }).css
	fs.writeFileSync(pbiResource.cssFile, cssContent)
}
