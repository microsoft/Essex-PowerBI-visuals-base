
/**
 * Registers a visual in the power bi system
 */
export default function Visual(config: { visualName: string; projectId: string }) {
    "use strict";
    return function (ctor: any) {
        (function (powerbi: any) {
            let visuals: any;
            (function (visuals: any) { // tslint:disable-line
                let plugins: any;
                (function (plugins: any) { // tslint:disable-line
                    let name = config.visualName + config.projectId;
                    plugins[name] = {
                        name: name,
                        class: name,
                        capabilities: ctor.capabilities,
                        custom: true,
                        create: function () {
                            return new ctor();
                        },
                    };
                })(plugins = visuals.plugins || (visuals.plugins = {}));
            })(visuals = powerbi.visuals || (powerbi.visuals = {}));
        })(window["powerbi"] || (window["powerbi"] = {}));
    };
}
