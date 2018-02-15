module.exports = function pbivizPluginTemplate(pbiviz, packageJson) {
	return `(function (powerbi) {
        var visuals;
        (function (visuals) {
            var plugins;
            (function (plugins) {
                plugins['${pbiviz.visual.guid}'] = {
                    name: '${pbiviz.visual.guid}',
                    displayName: '${pbiviz.visual.name}',
                    class: '${pbiviz.visual.visualClassName}',
                    version: '${packageJson.version}',
                    apiVersion: '${pbiviz.apiVersion}',
                    create: function (/*options*/) {
                        var instance = Object.create(${
							pbiviz.visual.visualClassName
						}.prototype);
                        ${
							pbiviz.visual.visualClassName
						}.apply(instance, arguments);
                        return instance;
                    },
                    custom: true
                };
            })(plugins = visuals.plugins || (visuals.plugins = {}));
        })(visuals = powerbi.visuals || (powerbi.visuals = {}));
    })(window['powerbi'] || (window['powerbi'] = {}));`
}
