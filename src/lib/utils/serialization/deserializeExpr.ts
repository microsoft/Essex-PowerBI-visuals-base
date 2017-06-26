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
import { ISerializedExpr } from "../interfaces";
const ldget = require("lodash/get"); //tslint:disable-line

/**
 * Deserializes the given expression
 * @param expr The expression to deserialize
 * @returns The deserialized expression
 */
export function deserializeExpr(expr: ISerializedExpr): powerbi.data.SQExpr {
    "use strict";
    if (expr) {
        const serializedExpr = expr.serializedExpr;
        if (serializedExpr) {
            const deserializer = ldget(powerbi, "data.services.SemanticQuerySerializer", { deserializeExpr: JSON.parse });
            const deserializedExpr = deserializer.deserializeExpr(serializedExpr);
            // For some reason, "schema" comes out null from the deserializer, and PBI can't handle that
            // It was causing filtering to fail for the Attribute Slicer
            const source = ldget(deserializedExpr, "left.source");
            if (source && !source.schema) {
                source.schema = undefined;
            }
            return deserializedExpr;
        } else {
            throw new Error("Not a valid serialized expression");
        }
    }
}
