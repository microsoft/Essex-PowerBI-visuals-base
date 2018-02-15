const fs = require('fs')
const sass = require('node-sass')
const conf = require('../../config')
const pbiResource = require('./pbiResource')

module.exports = () => {
	console.info('Building Sass...')
	const cssContent = sass.renderSync({ file: conf.build.entry.sass }).css
	fs.writeFileSync(pbiResource.cssFile, cssContent)
}
