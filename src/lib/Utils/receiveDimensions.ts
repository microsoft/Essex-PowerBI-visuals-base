import "powerbi-visuals/lib/powerbi-visuals";
import UpdateType from "./UpdateType";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import { IUpdateTypeReceiver } from "./receiveUpdateType";

/**
 * Decorator indicating that a given visual is stateful
 */
export function receiveDimensions(target: IReceiveDimensionsClass) {
    "use strict";
    const original = target;

    const newConstructor: any = function (...args: any[]) {
        original.apply(this, args);
        const {
            init: originalInit,
            updateWithType: originalUpdateWithType,
        } = this;

        this.init = function receiveDimensionsInit(
            options: powerbi.VisualInitOptions
        ) {
            this.setDemensions({
                width: options.viewport.width,
                height: options.viewport.height,
            });
            originalInit.call(this, options);
        }

        this.updateWithType = function receiveDimensionsUpdate(
            options: VisualUpdateOptions,
            updateType: UpdateType
        ) {
            const isResize = updateType & UpdateType.Resize;
            if (isResize) {
                this.setDimensions({
                    width: options.viewport.width,
                    height: options.viewport.height,
                });
            }
            originalUpdateWithType.call(this, options, updateType);
        }.bind(this);
    };

    newConstructor.prototype = original.prototype;
    return newConstructor;
}

/**
 * Represents a class that implements a IStateful interface
 */
export interface IReceiveDimensionsClass {
    new (...args: any[]): IReceiveDimensions;
}

export interface IDimensions {
    height: number;
    width: number;
}
export interface IReceiveDimensions extends IUpdateTypeReceiver {
    setDimensions(dimensions: IDimensions): void;
}
