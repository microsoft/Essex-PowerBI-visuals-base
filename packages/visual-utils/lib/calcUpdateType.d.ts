import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import UpdateType from "./UpdateType";
export declare const DEFAULT_CALCULATE_SETTINGS: ICalcUpdateTypeOptions;
/**
 * Calculates the type of update that has occurred between two visual update options, this gives greater granularity than what
 * powerbi has.
 * @param oldOpts The old options
 * @param newOpts The new options
 * @param addlOptions The additional options to use when calculating the update type.
 */
export default function calcUpdateType(oldOpts: VisualUpdateOptions, newOpts: VisualUpdateOptions, addlOptions?: ICalcUpdateTypeOptions | boolean): UpdateType;
export interface ICalcUpdateTypeOptions {
    checkHighlights?: boolean;
    ignoreCategoryOrder?: boolean;
    defaultUnkownToData?: boolean;
}
