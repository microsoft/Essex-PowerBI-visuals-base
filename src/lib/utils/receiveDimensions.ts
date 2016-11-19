export interface IDimensions {
    width: number;
    height: number;
};

export interface IReceiveDimensions extends powerbi.IVisual {
    setDimensions(dimensions: IDimensions): void;
}

/**
 * Represents a class that implements a IStateful interface
 */
export interface DimensionReceiverClass<T extends IReceiveDimensions>{
    new (...args: any[]): T;
}

export function receiveDimensions<T extends IReceiveDimensions>(target: DimensionReceiverClass<T>): any {
    "use strict";
    class ReceivesUpdateClass extends (target as DimensionReceiverClass<IReceiveDimensions>) {
        constructor(...args: any[]) {
            args = args || [];
            super(...args);
        }
        public init(options: powerbi.VisualInitOptions) {
            super.init(options);
            const { width, height } = options.viewport;
            this.setDimensions({ width, height });
        }

        public update(options: powerbi.VisualUpdateOptions) {
            const { width, height } = options.viewport;
            this.setDimensions({ width, height });
            if (super.update) {
                super.update(options);
            }
        }
    }
    return ReceivesUpdateClass as any;
}
