import { HasSettings } from "../HasSettings";
import { IGradient } from "@essex/visual-utils";
/**
 * A set of gradient settings
 */
export declare class GradientSettings extends HasSettings implements IGradient {
    /**
     * The start color for the gradient
     */
    startColor?: string;
    /**
     * The end color for the gradient
     */
    endColor?: string;
    /**
     * The start value of the gradient
     */
    startValue?: number;
    /**
     * The end value of the gradient
     */
    endValue?: number;
    /**
     * Determines if this color settings is equal to another
     */
    equals(other: GradientSettings): boolean;
}
