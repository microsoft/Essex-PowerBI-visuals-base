const fs = require('fs')
const compileSass = require('./compileSass')

const readFile = file =>
	new Promise((resolve, reject) =>
		fs.readFile(file, (err, res) => (err ? reject(err) : resolve(res)))
	)

module.exports = (js, config) => {
	const { build: { pbivizJson, capabilitiesJson } } = config
	const iconType = config.assets.icon.indexOf('.svg') >= 0 ? 'svg+xml' : 'png'

	return Promise.all([
		readFile(config.assets.icon),
		compileSass(config)
	]).then(([icon, css]) => {
		const iconBase64 =
			`data:image/${iconType};base64,` + icon.toString('base64')
		const result = {
			visual: pbivizJson.visual,
			apiVersion: pbivizJson.apiVersion,
			assets: pbivizJson.assets,
			capabilities: capabilitiesJson,
			content: {
				js,
				css,
				iconBase64
			}
		}
		return result
	})
}
