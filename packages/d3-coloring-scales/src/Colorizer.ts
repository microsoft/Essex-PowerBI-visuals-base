import { scaleOrdinal, scaleSequential } from 'd3'
import * as scaleChromatic from 'd3-scale-chromatic'
import { Scaler } from './scalers/Scaler'

const CATEGORICAL = {
	Accent: true,
	Dark2: true,
	Paired: true,
	Pastel1: true,
	Pastel2: true,
	Set1: true,
	Set2: true,
	Set3: true
}

// NOTE: The coloring uses the "Diverging" HCL Pattern described here
// http://hclwizard.org:64230/hclwizard/
export default class Colorizer {
	private colorScale: any

	constructor(private scaler: Scaler, private colorScheme: string = 'Reds') {
		// Set up the color scale
		if (CATEGORICAL[colorScheme]) {
			const interpolator = `scheme${colorScheme}`
			this.colorScale = scaleOrdinal(scaleChromatic[interpolator])
		} else {
			const interpolator = `interpolate${colorScheme}`
			this.colorScale = scaleSequential(scaleChromatic[interpolator])
		}
	}

	public color(value: number) {
		const scaled = this.scaler.scale(value)
		return this.colorScale(scaled)
	}
}
