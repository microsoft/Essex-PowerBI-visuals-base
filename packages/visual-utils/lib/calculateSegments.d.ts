import { IGradient } from "./interfaces";
/**
 * A utility method that takes a dataView, and breaks down the values into named segments with colors
 * Colorizing prority: "#ccc" < defaultColor < gradient < segmentColors
 * @param columns The set of columns in the dataView
 * @param defaultColor The default color to use
 * @param gradient The gradient to use
 * @param segmentColors The colors for the individual instances of segments to use
 */
export default function calculateSegments(columns: powerbi.DataViewValueColumns, defaultColor?: string, gradient?: IGradient, segmentColors?: {
    color: string;
    identity?: any;
}[]): {
    name: any;
    identity: any;
    color: any;
}[];
