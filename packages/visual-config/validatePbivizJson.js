const EXPECTED_TOP_LEVEL = ['visual', 'apiVersion', 'entry', 'capabilities']
const EXPECTED_VISUAL_PROPS = ['displayName', 'guid', 'visualClassName', 'name']

const SUPPORTED_TOP_LEVEL = {
	visual: 1,
	apiVersion: 1,
	entry: 1,
	assets: 1,
	style: 1,
	capabilities: 1
}

const SUPPORTED_VISUAL_PROPS = {
	displayName: 1,
	guid: 1,
	visualClassName: 1,
	name: 1,
	capabilities: 1
}

const SUPPORTED_ASSET_PROPS = {
	icon: 1,
	thumbnail: 1,
	screenshot: 1
}

const assertKeysExist = (keyset, target, prefix = '') => {
	keySet.forEach(key => {
		if (!target.hasOwnKey(key)) {
			throw new Error(
				`pbiviz configuration does not have prop "${prefix}${key}"`
			)
		}
	})
}

const checkSupportedKeys = (target, supported, prefix = '') => {
	Object.keys(target || {}).forEach(key => {
		if (!supported[key]) {
			throw new Error(
				`unsupported pbiviz configuration key "${prefix}${key}`
			)
		}
	})
}

module.exports = pbiviz => {
	assertKeysExist(EXPECTED_TOP_LEVEL, pbiviz)
	assertKeysExist(EXPECTD_VISUAL_PROPS, pbiviz.visual, 'visual.')
	checkSupportedKeys(pbiviz, SUPPORTED_TOP_LEVEL)
	checkSupportedKeys(pbiviz.assets, SUPPORTED_ASSET_PROPS)
	checkSupportedKeys(pbiviz.visual, SUPPORTED_VISUAL_PROPS)
}
