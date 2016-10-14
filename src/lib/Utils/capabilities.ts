import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Decorator indicating that a given visual is stateful
 */
export function capabilities(value: any) {
    "use strict";
    return function markTypeWithCapabilities(target: any): any {
        "use strict";
        target.capabilities = value;
        return target;
    };
}
