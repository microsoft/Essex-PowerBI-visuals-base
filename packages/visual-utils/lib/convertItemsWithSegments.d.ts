import { IColorSettings, ItemWithValueSegments } from "./interfaces";
import ISelectionIdBuilder = powerbi.visuals.ISelectionIdBuilder;
/**
 * Converts the dataView into a set of items that have a name, and a set of value segments.
 * Value segments being the grouped values from the dataView mapped to a color
 * *Note* This will only work with dataViews/dataViewMappings configured a certain way
 * @param dataView The dataView to convert
 * @param onCreateItem A function that gets called when an item is created
 * @param settings The color settings to use when converting
 */
export declare function convertItemsWithSegments(dataView: powerbi.DataView, onCreateItem: any, settings?: IColorSettings, createIdBuilder?: () => ISelectionIdBuilder): {
    items: ItemWithValueSegments[];
    segmentInfo: {
        name: any;
        identity: any;
        color: string;
    }[];
};
/**
 * Computes the rendered values for the given set of items
 * @param items The set of items to compute for
 */
export declare function computeRenderedValues(items: ItemWithValueSegments[]): void;
/**
 * True if the given dataview supports multiple value segments
 * @param dv The dataView to check
 */
export declare function dataSupportsValueSegments(dv: powerbi.DataView): boolean;
/**
 * Returns true if the data supports default colors
 * @param dv The dataView to check
 */
export declare function dataSupportsDefaultColor(dv: powerbi.DataView): boolean;
/**
 * Returns true if gradients can be used with the data
 * @param dv The dataView to check
 */
export declare function dataSupportsGradients(dv: powerbi.DataView): boolean;
/**
 * Returns true if individiual instances of the dataset can be uniquely colored
 * @param dv The dataView to check
 */
export declare function dataSupportsColorizedInstances(dv: powerbi.DataView): boolean;
/**
 * Represents a domain of some value
 */
export interface IDomain {
    min: number;
    max: number;
}
