export interface IDimensions {
    width: number;
    height: number;
}
export interface IReceiveDimensions extends powerbi.extensibility.visual.IVisual {
    setDimensions(dimensions: IDimensions): void;
}
/**
 * Represents a class that implements a IStateful interface
 */
export interface DimensionReceiverClass<T extends IReceiveDimensions> {
    new (...args: any[]): T;
}
export declare function receiveDimensions<T extends IReceiveDimensions>(target: DimensionReceiverClass<T>): any;
