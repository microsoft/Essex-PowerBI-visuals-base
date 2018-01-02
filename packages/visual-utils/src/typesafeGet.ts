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

const ldget = require('lodash.get') // tslint:disable-line
const pathFinder = /return\s+([^\;\}]+)/

/**
 * A simple function that wraps _.get to add type safety to it
 * * Note * The getter function does not support scope varibles (i.e. you cannot use external variables from within the getter)
 * @param obj The object to get a property on
 * @param getter The getter for the path
 */
export default function get<T, J>(
	obj: T,
	getter: (obj: T) => J,
	defaultValue?: any
): J {
	'use strict'
	const path = pathFinder.exec(getter.toString())[1]
	return ldget(
		obj,
		path
			.split('.')
			.slice(1)
			.join('.'),
		defaultValue
	) as J
}
