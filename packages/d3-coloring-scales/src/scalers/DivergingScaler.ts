import { ScaleLinear, ScaleLogarithmic, scaleLinear, scaleLog } from 'd3-scale'
import { Scaler } from './Scaler'

/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const MIN = 0.000001
const MID = 0.5
const MAX = 1

export default class DivergingScaler implements Scaler {
	private valueSanitizerPos: ScaleLinear<number, number>
	private valueSanitizerNeg: ScaleLinear<number, number>
	private logScalerPos: ScaleLogarithmic<number, number>
	private logScalerNeg: ScaleLogarithmic<number, number>
	private linearScalerPos: ScaleLinear<number, number>
	private linearScalerNeg: ScaleLinear<number, number>

	constructor(
		/**
		 * The minimum value in the input range. These values are colored as "negative"
		 */
		valueMin: number,
		/**
		 * The midpoint value in the input range, at which point to switch color schemes.
		 */
		private valueMid: number,
		/**
		 * The maximum value in the input range. These values are colored as "positive"
		 */
		valueMax: number,
		/**
		 * Whether to log-scale the coloration. If true, colors will be more vibrant, exposing subtle variances
		 * in homogenous data.
		 */
		private isLogScaled = false
	) {
		// Sanitizes incoming positive values onto a range of 0-1
		this.valueSanitizerPos = scaleLinear()
			.domain([valueMid, valueMax])
			.range([MIN, MAX])
			.clamp(true)
		// Sanitizes incoming negative values to a range of 0-1 (lowest value correstponds to 1)
		this.valueSanitizerNeg = scaleLinear()
			.domain([valueMin, valueMid])
			.range([MAX, MIN])
			.clamp(true)

		// Log scales sanitized values onto a domain from 0-1
		this.logScalerPos = scaleLog()
			.domain([MIN, MAX])
			.range([MID, MAX])
		this.logScalerNeg = scaleLog()
			.domain([MIN, MAX])
			.range([MID, MIN])

		// Linearly scales sanitized values ont a domain from 0-1.
		this.linearScalerPos = scaleLinear()
			.domain([MIN, MAX])
			.range([MID, MAX])
		this.linearScalerNeg = scaleLinear()
			.domain([MIN, MAX])
			.range([MID, MIN])
	}

	public scale(value: number) {
		if (value === null) {
			return value
		}
		const isPos = value > this.valueMid
		return isPos ? this.scalePos(value) : this.scaleNeg(value)
	}

	private scalePos(value: number) {
		const sanitized = this.valueSanitizerPos(value)
		return this.isLogScaled
			? this.logScalerPos(sanitized)
			: this.linearScalerPos(sanitized)
	}

	private scaleNeg(value: number) {
		const sanitized = this.valueSanitizerNeg(value)
		return this.isLogScaled
			? this.logScalerNeg(sanitized)
			: this.linearScalerNeg(sanitized)
	}
}
