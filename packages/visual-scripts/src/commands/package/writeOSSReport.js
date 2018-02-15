const fs = require('fs')
const path = require('path')
const buildOSSReport = require('@essex/oss-report-builder')
const config = require('../../config')

const OSS_REPORT_PATH = path.join(
	config.build.output.dir,
	`${config.metadata.name}_${config.metadata.version}_OSS_Report.csv`
)

const getReport = jsonStats =>
	new Promise(resolve => {
		buildOSSReport(jsonStats.modules, ossReport => {
			console.log(
				'Reading File Content from ',
				config.build.js,
				JSON.stringify(config.webpackConfig.output)
			)
			resolve(ossReport)
		})
	})

module.exports = stats =>
	getReport(stats).then(ossReport =>
		fs.writeFileSync(OSS_REPORT_PATH, ossReport)
	)
