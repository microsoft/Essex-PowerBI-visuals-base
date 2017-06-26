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
import data = powerbi.data;

/**
 * Builds a "contains" filter from the given search value, and the given dataView
 * If text will do an actual contains, otherwise it defaults to equality.
 * @param source The column to create a contains filter for
 * @param searchVal The value to create the filter for
 */
export default function buildContainsFilter(source: powerbi.DataViewMetadataColumn, searchVal: any) {
    "use strict";
    let filterExpr: data.SQExpr;
    let filter: data.SemanticFilter;
    if (source) {
        const sourceType = source.type;
        // Only support "contains" with text columns
        // if (sourceType.extendedType === powerbi.ValueType.fromDescriptor({ text: true }).extendedType) {
        if (searchVal) {
            if (sourceType.text) {
                let containsTextExpr = data.SQExprBuilder.text(searchVal);
                filterExpr = data.SQExprBuilder.contains(<any>source["expr"], containsTextExpr);
            } else {
                let rightExpr: data.SQExpr;
                if (sourceType.numeric) {
                    rightExpr = data.SQExprBuilder.typedConstant(parseFloat(searchVal), sourceType);
                } else if (sourceType.bool) {
                    rightExpr = data.SQExprBuilder.boolean(searchVal === "1" || searchVal === "true");
                }
                if (rightExpr) {
                    filterExpr = data.SQExprBuilder.equal(<any>source["expr"], rightExpr);
                }
            }
        }
        if (filterExpr) {
            filter = data.SemanticFilter.fromSQExpr(filterExpr);
        }
    }
    return filter;
}
