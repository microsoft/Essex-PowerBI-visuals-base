/*
 * MIT License
 *
 * Copyright (c) 2016 Microsoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Represents an object that can build persistence objects
 */
export interface IPersistObjectBuilder {
	/**
	 * Persists the given value into PBI
	 */
	persist(
		objectName: string,
		property: string,
		value: any,
		operation?: string,
		selector?: any,
		displayName?: string,
		asOwnInstance?: boolean
	): void

	/**
	 * Merges another set of persist objects into this builder
	 */
	mergePersistObjects(objects: powerbi.VisualObjectInstancesToPersist): void

	/**
	 * Builds the final persist object
	 */
	build(): powerbi.VisualObjectInstancesToPersist
}

/**
 * Represents a expression that has been serialized.
 */
export interface ISerializedExpr {
	serializedExpr: any
}

/**
 * Indicates that a given object has a unique identity
 */
export interface HasIdentity {
	/**
	 * The identity of this object
	 */
	identity?: powerbi.visuals.ISelectionId
}

/**
 * Represents an DataViewScopeIdentity that has been serialized
 */
export interface ISerializedIdentity {
	serializedIdentity: {
		expr: ISerializedExpr
	}
}

/**
 * Represents an object that contains a serialized identity
 */
export interface HasSerializedIdentity {
	identity: ISerializedIdentity
}

/**
 * Represents an object that that has both a color and an identity.
 */
export interface IColoredObject extends HasIdentity {
	/**
	 * The name of the colored object
	 */
	name: string

	/**
	 * The color of the object
	 */
	color: string
}

/**
 * An item that has value segments
 */
export interface ItemWithValueSegments {
	/**
	 * The unique identifier for this item
	 */
	id: string

	/**
	 * The name of the item
	 * TODO: Better name, legacy naming right now
	 */
	match: any

	/**
	 * The color of the item
	 */
	color?: string

	/**
	 * The raw value of this item (the count of values in this item)
	 */
	value: any

	/**
	 * Returns true if this == b
	 */
	equals: (b: ItemWithValueSegments) => boolean

	/**
	 * The segments that make up this items value, the total of the widths must === 100
	 */
	valueSegments?: IValueSegment[]

	/**
	 * The percentage value that should be displayed (0 - 100)
	 * TODO: Better name, basically it is the value that should be displayed in the histogram
	 */
	renderedValue?: number
}

/**
 * An individual value segment
 */
export interface IValueSegment {
	/**
	 * The raw value of the segment
	 */
	value: any

	/**
	 * The display value of the segment
	 */
	displayValue: any

	/**
	 * The percentage width of this segment
	 */
	width: number

	/**
	 * The percentage of the width which should be highlighted
	 */
	highlightWidth?: number

	/**
	 * The color of this segment
	 */
	color: string
}

/**
 * A set of modes used to indicate how an object should be colored
 */
export enum ColorMode {
	/**
	 * Gradient coloring should be used
	 */
	Gradient,

	/**
	 * Instance specific coloring should be used
	 */
	Instance
}

/**
 * Interface represents the color related settings
 */
export interface IColorSettings {
	/**
	 * The mode of colorization
	 */
	colorMode: ColorMode

	/**
	 * The gradient to use
	 */
	gradient: IGradient

	/**
	 * The specific colors
	 */
	instanceColors: IColoredObject[]

	/**
	 * If true, the order of the bars will be reversed
	 */
	reverseOrder?: boolean
}

/**
 * Contains all of the info necessary to create a gradient
 */
export interface IGradient {
	/**
	 * The start color for the gradient
	 */
	startColor?: string

	/**
	 * The end color of the gradient
	 */
	endColor?: string

	/**
	 * The start value of the gradient
	 */
	startValue?: any

	/**
	 * The end value of the gradient
	 */
	endValue?: any
}
