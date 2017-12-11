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

import {
	ISettingsParser,
	IDefaultInstanceColor,
	IDefaultValue,
	IDefaultColor
} from './interfaces' // tslint:disable-line
import { get } from '@essex/visual-utils'
import { getPBIObjectNameAndPropertyName } from './helpers'
const ldget = require('lodash.get') // tslint:disable-line

/**
 * A parser which parses colors for each instance in a categorical dataset
 * @param defaultColor The color to use if an instance doesn't have a color
 */
export function colorCategoricalInstanceObjectParser<T>(
	defaultColor: IDefaultInstanceColor = '#ccc'
) {
	'use strict'
	return coloredInstanceObjectParser<T>(
		defaultColor,
		(dv: powerbi.DataView) => {
			const values = get(dv, v => v.categorical.values, [])
			return (values && values.grouped && values.grouped()) || []
		}
	)
}

/**
 * A basic color object parser which parses colors per some instance, using the instancesGetter
 * @param defaultColor The color to use if an instance doesn't have a color
 * @param instancesGetter A getter function which returns the set of instances to iterate
 */
export function coloredInstanceObjectParser<T>(
	defaultColor: IDefaultInstanceColor = '#ccc',
	instancesGetter: (
		dv: powerbi.DataView
	) => {
		objects?: any
		name?: any
		identity?: any
	}[]
) {
	'use strict'
	return ((val, desc, dataView, setting) => {
		const values = instancesGetter(dataView)
		const { objName, propName } = getPBIObjectNameAndPropertyName(setting)
		if (values && values.forEach) {
			return values.map((n, i) => {
				const objs = n.objects
				const obj = objs && objs[objName]
				const prop = obj && obj[propName]
				const defaultValColor =
					typeof defaultColor === 'function'
						? defaultColor(i)
						: defaultColor
				return {
					name: n.name,
					color: get<any, string>(
						prop,
						(o: any) => o.solid.color,
						defaultValColor
					),
					identity: n.identity
				}
			})
		}
	}) as ISettingsParser<T, { name: string; color: string; identity: any }[]>
}

/**
 * Provides a basic parser for PBI settings
 * @param path The path within the pbi object to look for the value
 * @param defaultValue The default value to use if PBI doesn't have a value
 */
export function basicParser<T, J>(
	path: string,
	defaultValue?: IDefaultValue<any>
) {
	'use strict'
	return (val => {
		let result = ldget(val, path)
		if (
			(typeof result === 'undefined' || result === null) &&
			defaultValue
		) {
			// tslint:disable-line
			result =
				typeof defaultValue === 'function'
					? defaultValue()
					: defaultValue
		}
		return result
	}) as ISettingsParser<T, J>
}

/**
 * Provides a color parser for PBI settings
 * @param defaultColor The default color to use if PBI doesn't have a value
 */
export function colorParser<T>(defaultColor?: IDefaultColor) {
	'use strict'
	return basicParser<T, string>('solid.color', defaultColor)
}
