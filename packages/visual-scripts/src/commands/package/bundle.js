const fs = require('fs')
const buildPackageJson = require('./buildPackageJson')
const buildVisualJson = require('./buildVisualJson')
const nodeZip = require('node-zip')

module.exports = (js, config) =>
	getZipContents(js, config).then(zip =>
		writeFile(
			config.dist.outputFile,
			zip.generate({ base64: false, compression: 'DEFLATE' }),
			'binary'
		)
	)

const encode = v => JSON.stringify(v, null, 2)
const writeFile = (file, content, options) =>
	new Promise((resolve, reject) =>
		fs.writeFile(
			file,
			content,
			options,
			(err, res) => (err ? reject(err) : resolve(res))
		)
	)

const getZipContents = (js, config) => {
	return Promise.all([
		buildVisualJson(js, config),
		buildPackageJson(config)
	]).then(([constructedPbiViz, packageJsonData]) => {
		const vizResource = `resources/${config.metadata.guid}.pbiviz.json`
		const zip = nodeZip()
		zip.file('package.json', encode(packageJsonData))
		zip.file(vizResource, encode(constructedPbiViz))
		return zip
	})
}
