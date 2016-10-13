import "powerbi-visuals/lib/powerbi-visuals";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

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
            update: originalUpdate,
        } = this;

        this.init = function receiveDimensionsInit(
            options: powerbi.VisualInitOptions
        ) {
            originalInit.call(this, options);
            this.setDemensions({
                width: options.viewport.width,
                height: options.viewport.height,
            });
        };

        this.update = function receiveDimensionsUpdate(options: VisualUpdateOptions) {
            if (options.dataViews && options.viewport) {
                const { width, height} = options.viewport;
                this.setDimensions(width, height);
            }
            originalUpdate.call(options);
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
export interface IReceiveDimensions {
    setDimensions(dimensions: IDimensions): void;
}
