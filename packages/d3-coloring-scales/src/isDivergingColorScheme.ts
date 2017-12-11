/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const DIVERGING_SCHEMES = {
	BrBG: true,
	PRGn: true,
	PiYG: true,
	PuOr: true,
	RdBu: true,
	RdGy: true,
	RdYlBu: true,
	RdYlGn: true,
	Spectral: true
}

export default function isDivergingColorScheme(scheme: string): boolean {
	return DIVERGING_SCHEMES[scheme] || false
}
