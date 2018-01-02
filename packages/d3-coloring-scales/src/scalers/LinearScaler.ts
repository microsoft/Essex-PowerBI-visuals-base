import * as d3 from 'd3-scale'
import { Scaler } from './Scaler'

/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const MIN = 0.000001
const MAX = 1

export default class LinearScaler implements Scaler {
	private valueSanitizer: d3.ScaleLinear<number, number>
	private logScaler: d3.ScaleLogarithmic<number, number>

	constructor(
		valueMin: number,
		valueMax: number,
		private isLogScaled: boolean = false
	) {
		this.valueSanitizer = d3
			.scaleLinear()
			.domain([valueMin, valueMax])
			.range([MIN, MAX])
			.clamp(true)
		this.logScaler = d3
			.scaleLog()
			.domain([MIN, MAX])
			.range([MIN, MAX])
	}

	public scale(value: number) {
		if (value === null || value === undefined) {
			return value
		}
		const sanitized = this.valueSanitizer(value)
		return this.isLogScaled ? this.logScaler(sanitized) : sanitized
	}
}
