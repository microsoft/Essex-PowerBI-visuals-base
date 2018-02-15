const fs = require('fs')
const pbiResource = require('./pbiResource')

module.exports = () => {
	fs.writeFileSync(pbiResource.statusFile, Date.now().toString())
	console.info('Visual updated')
}
