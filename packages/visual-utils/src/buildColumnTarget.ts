/*
 * Copyright (c) Microsoft
 * All rights reserved.
 * MIT License
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

import * as models from 'powerbi-models'
/**
 * Builds a filter column target for use with the AdvancedFilter API
 * @param source The column to create a filter target for
 */
export default function buildColumnTarget(
	source: powerbi.DataViewMetadataColumn
): models.IFilterColumnTarget {
	'use strict'
	if (source) {
		const categoryExpr: any =
			source && source.expr ? (source.expr as any) : null
		const filteringColumn: string =
			categoryExpr &&
			categoryExpr.arg &&
			categoryExpr.arg.arg &&
			categoryExpr.arg.arg.property
				? categoryExpr.arg.arg.property
				: source.displayName
		// source.queryName contains wrong table name in case when table was renamed! source.expr.source.entity contains correct table name.
		// source.displayName contains wrong column name in case when Hierarchy mode of showing date was chosen
		return {
			table:
				categoryExpr &&
				categoryExpr.source &&
				categoryExpr.source.entity
					? categoryExpr.source.entity
					: source.queryName.substr(0, source.queryName.indexOf('.')),
			column: filteringColumn
		}
	}
}
