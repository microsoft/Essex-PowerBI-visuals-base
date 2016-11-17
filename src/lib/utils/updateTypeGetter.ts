import "powerbi-visuals/lib/powerbi-visuals";
import IVisual = powerbi.IVisual;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import UpdateType from "./UpdateType";
import { default as calcUpdateType, ICalcUpdateTypeOptions } from "./calcUpdateType";
import log from "./log";

/**
 * Creates an update watcher for a visual
 */
// TODO: This would be SOOO much better as a mixin, just don't want all that extra code that it requires right now.
export default function updateTypeGetter(obj: IVisual, addlOptions?: ICalcUpdateTypeOptions|boolean) {
    "use strict";
    let currUpdateType = UpdateType.Unknown;
    if (obj && obj.update) {
        const oldUpdate = obj.update;
        let prevOptions: VisualUpdateOptions;
        obj.update = function(options: VisualUpdateOptions) {
            let updateType = calcUpdateType(prevOptions, options, addlOptions);
            currUpdateType = updateType;
            prevOptions = options;
            log(`Update -- Type: ${UpdateType[updateType]}`);
            return oldUpdate.call(this, options);
        };
    }
    return function() {
        return currUpdateType;
    };
}
