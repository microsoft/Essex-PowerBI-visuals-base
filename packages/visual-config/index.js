const path = require('path')
const validatePbivizJson = require('./validatePbivizJson')

const cwd = process.cwd()

const packageJsonPath = path.join(cwd, 'package.json')
const packageJson = require(packageJsonPath)

const isPbivizJsonInline = !!packageJson.pbiviz
const pbivizJsonPath = isPbivizJsonInline
	? undefined
	: path.join(CWD, 'pbiviz.json')
const pbivizJson = isPbivizJsonInline
	? packageJson.pbiviz
	: require(pbivizJsonPath)

const capabilitiesJsonPath = path.join(
	cwd,
	pbivizJson.capabilities || 'capabilities.json'
)
const capabilitiesJson = require(capabilitiesJsonPath)

if (!packageJson.main) {
	throw new Error(
		'packageJson.main should be defined as the visual entry point'
	)
}

module.exports = {
	packageJsonPath,
	pbivizJsonPath,
	capabilitiesJsonPath,
	packageJson,
	pbivizJson,
	capabilitiesJson
}
