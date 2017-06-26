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

import { ISerializedIdentity } from "../interfaces";
import { serializeExpr } from "./serializeExpr";

/**
 * Serializes the given identity object
 * @param identity The identity to serialize
 */
export function serializeIdentity(identity: powerbi.DataViewScopeIdentity|ISerializedIdentity): ISerializedIdentity {
    "use strict";
    const se = <ISerializedIdentity>identity;
    // If it is not undefined, and it isn't already serialized
    if (se && !se.serializedIdentity) {
        return {
            serializedIdentity: {
                expr: serializeExpr((<any>identity).expr),
            },
        };
    }
    return se;
}
