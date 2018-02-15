const path = require('path')
const fs = require('fs')
const {
	packageJson,
	pbivizJson,
	capabilitiesJson,
	packageJsonPath,
	pbivizJsonPath,
	capabilitiesJsonPath
} = require('@essex/visual-config')

const CWD = process.cwd()

const webpackExtend = fs.existsSync(path.join(CWD, 'webpack.extend.js'))
	? require(path.join(CWD, 'webpack.extend.js'))
	: t => t
const outputFile = path.join(CWD, pbivizJson.output || 'dist/Visual.pbiviz')
const outputDir = path.parse(outputFile).dir
const dropFolder = path.join(CWD, '.tmp/drop')
const precompileFolder = path.join(CWD, '.tmp/precompile')
const webpackBase = require('./webpack.config')
const sassEntry = path.join(CWD, pbivizJson.style)
const scriptEntry = path.join(CWD, packageJson.main)

const buildConfig = {
	entry: {
		sass: sassEntry,
		js: scriptEntry,
		capabilities: capabilitiesJsonPath
	},
	precompileFolder,
	dropFolder,
	js: path.join(dropFolder, 'visual.js'),
	css: path.join(dropFolder, 'visual.css'),
	output: {
		dir: outputDir,
		file: outputFile
	},
	packageJson,
	pbivizJson,
	capabilitiesJson,
	packageJsonPath,
	pbivizJsonPath,
	capabilitiesJsonPath
}

module.exports = {
	server: {
		port: 8080,
		privateKey: path.join(
			__dirname,
			'../certs/PowerBICustomVisualTest_private.key'
		),
		certificate: path.join(
			__dirname,
			'../certs/PowerBICustomVisualTest_public.crt'
		),
		routes: {
			assets: '/assets'
		}
	},
	metadata: {
		name: pbivizJson.visual.name,
		description: packageJson.description,
		version: packageJson.version,
		author: packageJson.author,
		license: packageJson.license,
		privacy: packageJson.privacy,
		guid: pbivizJson.visual.guid
	},
	assets: pbivizJson.assets,
	build: buildConfig,
	dist: {
		outputDir,
		outputFile
	},
	webpackConfig: webpackExtend(webpackBase(buildConfig))
}
