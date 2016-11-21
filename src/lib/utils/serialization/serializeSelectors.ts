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

import "powerbi-visuals/lib/powerbi-visuals";
import { serializeExpr } from "./serializeExpr";

/**
 * Serializes a list of selectors, will ONLY work with selectors that are DataViewScopeIdentity
 */
export function serializeSelectors(selectors: powerbi.data.Selector[]): any[] {
    "use strict";
    return (selectors || []).map(n => {
        return {
            id: n.id,
            metadata: n.metadata,
            data: n.data.map((data: any) => {
                const expr: powerbi.data.SQExpr = data["expr"] || data["_expr"];
                if (expr) {
                    return serializeExpr(expr);
                } else {
                    throw new Error(`serializeSelectors requires a selector built from a DataViewScopeIdentity`);
                }
            }),
        };
    });
}
