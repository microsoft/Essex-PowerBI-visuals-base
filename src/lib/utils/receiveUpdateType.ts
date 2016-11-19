import "powerbi-visuals/lib/powerbi-visuals";
import UpdateType from "./UpdateType";
import { default as calcUpdateType, ICalcUpdateTypeOptions } from "./calcUpdateType";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

/**
 * Decorator indicating that a given visual is stateful
 */
export function receiveUpdateType(addlOptions: ICalcUpdateTypeOptions|boolean = false) {
    "use strict";
    return function decorateReceiveUpdateType(target: UpdateTypeReceiverClass<any>): any {
        "use strict";
        class ReceivesUpdateType extends (target as UpdateTypeReceiverClass<IUpdateTypeReceiver>) {
            private __prevOptions: VisualUpdateOptions;
            public update(options: VisualUpdateOptions) {
                if (super.update) {
                    super.update(options);
                }
                let updateType = calcUpdateType(this.__prevOptions, options, addlOptions);
                this.updateWithType(options, updateType);
                this.__prevOptions = options;
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
