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
            original.apply(this, args);
            let { update: originalUpdate } = this;
            let prevOptions: VisualUpdateOptions;

            this.update = function (options: VisualUpdateOptions) {
                if (originalUpdate) {
                    originalUpdate.call(this, options);
                }
                let updateType = calcUpdateType(prevOptions, options, defaultUnknownToData);
                this.updateWithType(options, updateType);
                prevOptions = options;
            }.bind(this);
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    };
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
