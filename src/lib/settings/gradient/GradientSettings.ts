import { colorSetting as color, numberSetting as num } from "../decorators";
import { HasSettings } from "../HasSettings";

/**
 * Represents a set of gradient settings
 */
export class GradientSettings extends HasSettings {

    /**
     * If the gradient color scheme should be used when coloring the values in the slicer
     */
    @color({
        displayName: "Start color",
        description: "The start color of the gradient",
        defaultValue: "#bac2ff",
    })
    public startColor?: string;

    /**
     * If the gradient color scheme should be used when coloring the values in the slicer
     */
    @color({
        displayName: "End color",
        description: "The end color of the gradient",
        defaultValue: "#0229bf",
    })
    public endColor?: string;

    /**
     * The value to use as the start color
     */
    @num({
        displayName: "Start Value",
        description: "The value to use as the start color",
    })
    public startValue?: number;

    /**
     * The value to use as the end color
     */
    @num({
        displayName: "End Value",
        description: "The value to use as the end color",
    })
    public endValue?: number;
}
