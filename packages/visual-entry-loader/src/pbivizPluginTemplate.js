const patchCapabilities = require('./patchCapabilities')
const userHash = require('./userHash')
const patchApi = require('./patchApi')

function pbivizPluginTemplate(pbiviz, packageJson, capabilitiesJson) {
	return `(function (powerbi) {
        var visuals;
        (function (visuals) {
            var plugins;
            (function (plugins) {
                /* ESSEX Capabilities Patcher */
                var patchCapabilities = ${patchCapabilities.toString()};

                plugins['${pbiviz.visual.guid}'] = {
                    name: '${pbiviz.visual.guid}',
                    displayName: '${pbiviz.visual.name}',
                    class: '${pbiviz.visual.visualClassName}',
                    version: '${packageJson.version}',
                    apiVersion: ${
						pbiviz.apiVersion ? `'${pbiviz.apiVersion}'` : undefined
					},
                    capabilities: ${
						pbiviz.apiVersion
							? '{}'
							: 'patchCapabilities(' +
								`${JSON.stringify(capabilitiesJson)}` +
								')'
					},
                    create: function (/*options*/) {
                        var instance = Object.create(${
							pbiviz.visual.visualClassName
						}.prototype);
                        ${
							pbiviz.apiVersion
								? `${
										pbiviz.visual.visualClassName
									}.apply(instance, arguments);`
								: `var oldInit = instance.init;
                            instance.init = function(options) {
                                instance.init = oldInit;
                                var adaptedOptions = {
                                    host: {
                                        createSelectionManager: function() {
                                            return new powerbi.visuals.utility.SelectionManager({hostServices: options.host});
                                        },
                                        colors: options.style.colorPalette.dataColors.getAllColors(),
                                        persistProperties: options.host.persistProperties.bind(options.host),
                                        onSelect: options.host.onSelect.bind(options.host),
                                    },
                                    element: options.element.get(0),
                                    viewport: {width: 500, height: 500},
                                };
                                ${
									pbiviz.visual.visualClassName
								}.call(instance, false, adaptedOptions);

                                instance.update = function(options) {
                                    options.type = powerbi.extensibility.v100.convertLegacyUpdateType(options);
                                    ${
										pbiviz.visual.visualClassName
									}.prototype.update.call(instance, options);
                                }
                            }`
						}
                        return instance;
                    },
                    custom: true
                };

                /* save version number to visual */
                ${pbiviz.visual.visualClassName}.__essex_build_info__ = '${
		packageJson.version
	} ${Date.now()} [${userHash}]';
                Object.defineProperty(${
					pbiviz.visual.visualClassName
				}.prototype, '__essex_build_info__', { get: function() { return ${
		pbiviz.visual.visualClassName
	}.__essex_build_info__; } } );

                /* ESSEX API Patcher */
                ${
					pbiviz.visual.visualClassName
				}.prototype.__essex_visual__ = true;
                (${patchApi.toString()})(${
		pbiviz.apiVersion ? `'${pbiviz.apiVersion}'` : `''`
	})
            })(plugins = visuals.plugins || (visuals.plugins = {}));
        })(visuals = powerbi.visuals || (powerbi.visuals = {}));
    })(window['powerbi'] || (window['powerbi'] = {}));`
}

module.exports = pbivizPluginTemplate
