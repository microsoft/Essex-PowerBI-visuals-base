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
    toJSON,
    buildCapabilitiesObjects,
    buildPersistObjects,
    buildEnumerationObjects,
    parseSettingsFromPBI,
} from "./helpers";
const assignIn = require("lodash/assignIn"); // tslint:disable-line

/**
 * A simple class with methods to handle the basic settings manipulation
 */
export class HasSettings {

    /**
     * Creates a new instance of this class
     */
    public static create<T extends HasSettings>(initialProps?: any): T {
        return parseSettingsFromPBI(this, undefined, initialProps, true) as T;
    }

    /**
     * Creates a new instance of this class with the data from powerbi and the additional properties.
     */
    public static createFromPBI<T extends HasSettings>(dv?: powerbi.DataView, additionalProps?: any): T {
        return parseSettingsFromPBI(this, dv, additionalProps, false) as T;
    }

    /**
     * Builds the capability objects for this settings class
     */
    public static buildCapabilitiesObjects() {
        return buildCapabilitiesObjects(this);
    }

    /**
     * Recieves the given object and returns a new state with the object overlayed with the this set of settings
     */
    public receive(newProps?: any) {
        return (this.constructor as any).create(assignIn(this.toJSONObject(), newProps)) as this;
    }

    /**
     * Recieves the given pbi settings and returns a new state with the new pbi settings overlayed with the this state
     */
    public receiveFromPBI(dv?: powerbi.DataView) {
        return (this.constructor as any).createFromPBI(dv, this.toJSONObject()) as this;
    }

    /**
     * Builds the persist objects
     */
    public buildEnumerationObjects(objectName: string, dataView: powerbi.DataView, includeHidden = false) {
        return buildEnumerationObjects(this.constructor as any, this, objectName, dataView, includeHidden);
    }

    /**
     * Builds the persist objects
     */
    public buildPersistObjects(dataView: powerbi.DataView, includeHidden = false) {
        return buildPersistObjects(this.constructor as any, this, dataView, includeHidden);
    }

    /**
     * Converts this class into a json object.
     */
    public toJSONObject() { // Important that this is not called "toJSON" otherwise infinite loops
        return toJSON(this.constructor as any, this);
    }
}
