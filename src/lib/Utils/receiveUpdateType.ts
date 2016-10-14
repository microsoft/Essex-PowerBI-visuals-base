import "powerbi-visuals/lib/powerbi-visuals";
import UpdateType from "./UpdateType";
import calcUpdateType from "./calcUpdateType";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

/**
 * Decorator indicating that a given visual is stateful
 */
export function receiveUpdateType(defaultUnknownToData: boolean = false) {
    "use strict";
    return function decorateReceiveUpdateType(target: UpdateTypeReceiverClass<any>): any {
        "use strict";
        let prevOptions: VisualUpdateOptions;
        class ReceivesUpdateType extends (target as UpdateTypeReceiverClass<IUpdateTypeReceiver>) {
            public update(options: VisualUpdateOptions) {
                if (super.update) {
                    super.update(options);
                }
                let updateType = calcUpdateType(prevOptions, options, defaultUnknownToData);
                this.updateWithType(options, updateType);
                prevOptions = options;
            }
        }
        return ReceivesUpdateType as any;
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
