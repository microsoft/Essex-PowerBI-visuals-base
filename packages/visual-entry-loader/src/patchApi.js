module.exports = function(version) {
	/* source code must be ES 5 */
	var essexAPIPatcherVersion = '0.0.1'
	var essexAPIPatcherKey = '__essex_patcher__'

	var fetchAPIObject = function(version) {
		var apiVersions = powerbi.extensibility.visualApiVersions
		for (var i = 0, n = apiVersions.length; i < n; ++i) {
			if (apiVersions[i].version === version) {
				return apiVersions[i]
			}
		}
		return null
	}

	var isAPIObjectPatched = function(api) {
		return !!(api.overloads && api.overloads[essexAPIPatcherKey])
	}

	var isESSEXVisual = function(visual) {
		return !!visual.__essex_visual__
	}

	var patchAPIObject = function(api) {
		var overloads = api.overloads
		api.overloads = function(visual, host) {
			if (!isESSEXVisual(visual)) {
				return overloads ? overloads(visual, host) : visual
			}

			var proxy = {
				update: function(/*...*/) {
					var args = Array.prototype.slice.call(arguments)

					if (proxy.options) {
						var apiOptions = args[0]
						for (var key in proxy.options) {
							if (
								proxy.options.hasOwnProperty(key) &&
								!apiOptions.hasOwnProperty(key)
							) {
								apiOptions[key] = proxy.options[key]
							}
						}

						proxy.options = null
					}

					visual.update.apply(visual, args)
				},

				options: null
			}
			var overloadedProxy = overloads ? overloads(proxy, host) : proxy

			return {
				update: function(options) {
					if (visual.update) {
						proxy.options = options
						overloadedProxy.update(options)
					}
				}
			}
		}

		api.overloads[essexAPIPatcherKey] = essexAPIPatcherVersion

		return api
	}

	var api = fetchAPIObject(version)
	if (api && !isAPIObjectPatched(api)) {
		patchAPIObject(api)
	}
}
