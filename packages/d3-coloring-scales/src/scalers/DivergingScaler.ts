import * as d3 from "d3-scale";
import { Scaler } from "./Scaler";

/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const MIN = 0.000001;
const MID = 0.5;
const MAX = 1;

export default class DivergingScaler implements Scaler {
    private valueSanitizerPos: d3.ScaleLinear<number, number>;
    private valueSanitizerNeg: d3.ScaleLinear<number, number>;
    private logScalerPos: d3.ScaleLogarithmic<number, number>;
    private logScalerNeg: d3.ScaleLogarithmic<number, number>;
    private linearScalerPos: d3.ScaleLinear<number, number>;
    private linearScalerNeg: d3.ScaleLinear<number, number>;

    constructor(
        /**
         * The minimum value in the input range. These values are colored as "negative"
         */
        valueMin,

        /**
         * The midpoint value in the input range, at which point to switch color schemes.
         */
        private valueMid: number,

        /**
         * The maximum value in the input range. These values are colored as "positive"
         */
        valueMax,

        /**
         * Whether to log-scale the coloration. If true, colors will be more vibrant, exposing subtle variances
         * in homogenous data.
         */
        private isLogScaled: boolean = false,
    ) {
        // Sanitizes incoming positive values onto a range of 0-1
        this.valueSanitizerPos = d3.scaleLinear().domain([valueMid, valueMax]).range([MIN, MAX]).clamp(true);
        // Sanitizes incoming negative values to a range of 0-1 (lowest value correstponds to 1)
        this.valueSanitizerNeg = d3.scaleLinear().domain([valueMin, valueMid]).range([MAX, MIN]).clamp(true);

        // Log scales sanitized values onto a domain from 0-1
        this.logScalerPos = d3.scaleLog().domain([MIN, MAX]).range([MID, MAX]);
        this.logScalerNeg = d3.scaleLog().domain([MIN, MAX]).range([MID, MIN]);

        // Linearly scales sanitized values ont a domain from 0-1.
        this.linearScalerPos = d3.scaleLinear().domain([MIN, MAX]).range([MID, MAX]);
        this.linearScalerNeg = d3.scaleLinear().domain([MIN, MAX]).range([MID, MIN]);
    }

    public scale(value: number) {
        if (value === null) {
            return value;
        }
        const isPos = value > this.valueMid;
        return isPos ?
            this.scalePos(value) :
            this.scaleNeg(value);
    }

    private scalePos(value: number) {
        const sanitized = this.valueSanitizerPos(value);
        return this.isLogScaled ?
            this.logScalerPos(sanitized) :
            this.linearScalerPos(sanitized);
    }

    private scaleNeg(value: number) {
        const sanitized = this.valueSanitizerNeg(value);
        return this.isLogScaled ?
            this.logScalerNeg(sanitized) :
            this.linearScalerNeg(sanitized);
    }
}
