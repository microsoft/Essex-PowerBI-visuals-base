import "powerbi-visuals/lib/powerbi-visuals";
import UpdateType from "./UpdateType";
import calcUpdateType from "./calcUpdateType";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

/**
 * Decorator indicating that a given visual is stateful
 */
export function receiveUpdateType(defaultUnknownToData: boolean = false) {
    "use strict";
    return function decorateReceiveUpdateType(target: UpdateTypeReceiverClass<any>) {
        "use strict";
        const original = target;

        const newConstructor: any = function (...args: any[]) {
            let instance: IUpdateTypeReceiver = new target(args);
            let { update: originalUpdate } = instance;
            let prevOptions: VisualUpdateOptions;

            instance.update = function (options: VisualUpdateOptions) {
                if (originalUpdate) {
                    originalUpdate(options);
                }
                let updateType = calcUpdateType(prevOptions, options, defaultUnknownToData);
                instance.updateWithType(options, updateType);
                prevOptions = options;
            }.bind(instance);

            return instance;
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}

/**
 * Represents a class that implements a IStateful interface
 */
export interface UpdateTypeReceiverClass<T> {
    new (...args: any[]): IUpdateTypeReceiver;
}

export interface IUpdateTypeReceiver extends powerbi.IVisual {
    updateWithType(update: VisualUpdateOptions, updateType: UpdateType): void;
}
