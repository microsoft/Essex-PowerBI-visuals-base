import { IColorSettings, ColorMode, IColoredObject } from "@essex/visual-utils";
import { HasSettings } from "../HasSettings";
import { GradientSettings } from "../gradient";
/**
 * A set of color settings which control how objects are colored
 */
export declare class ColoredObjectsSettings extends HasSettings implements IColorSettings {
    /**
     * The colors to use for individual instances in the dataSet
     */
    instanceColors: IColoredObject[];
    /**
     * The mode of colorization to use
     */
    colorMode: ColorMode;
    /**
     * The set of gradient settings
     */
    gradient: GradientSettings;
    /**
     * If the order of the bars should be reversed
     */
    reverseOrder?: boolean;
    /**
     * Determines if this color settings is equal to another
     */
    equals(other: ColoredObjectsSettings): boolean;
}
