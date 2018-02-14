const crypto = require('crypto')
const cp = require('child_process')
const userName = cp.execSync('whoami').toString()
const userHash = crypto
	.createHash('md5')
	.update(userName)
	.digest('hex')

module.exports = userHash
