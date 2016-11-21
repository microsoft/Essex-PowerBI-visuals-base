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
        asOwnInstance?: boolean): void;

    /**
     * Merges another set of persist objects into this builder
     */
    mergePersistObjects(objects: powerbi.VisualObjectInstancesToPersist): void;

    /**
     * Builds the final persist object
     */
    build(): powerbi.VisualObjectInstancesToPersist;
}

/**
 * PBI Services
 */
export interface PBIServices  {
    SemanticQuerySerializer: {
        serializeExpr(expr: powerbi.data.SQExpr): ISerializedExpr;
        deserializeExpr(expr: ISerializedExpr): powerbi.data.SQExpr;
    };
}

/**
 * Represents a expression that has been serialized.
 */
export interface ISerializedExpr {
    serializedExpr: any;
};

/**
 * Indicates that a given object has a unique identity
 */
export interface HasIdentity {

    /**
     * The identity of this object
     */
    identity?: powerbi.DataViewScopeIdentity;
}

/**
 * Represents an DataViewScopeIdentity that has been serialized
 */
export interface ISerializedIdentity {
    serializedIdentity: {
        expr: ISerializedExpr;
    };
}

/**
 * Represents an object that contains a serialized identity
 */
export interface HasSerializedIdentity {
    identity: ISerializedIdentity;
}

