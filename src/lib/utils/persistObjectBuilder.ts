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

import { IPersistObjectBuilder } from "./interfaces";
const assignIn = require("lodash/assignIn"); // tslint:disable-line
``
/**
 * Creates a persistence object builder
 */
export default function createPersistObjectBuilder() {
    "use strict";
    const pbiState = {};
    const maps = {
        merge: {},
        remove: {},
    };
    const me: IPersistObjectBuilder = {
        persist: function addToPersist(
            objectName: string,
            property: string,
            value: any,
            operation?: string,
            selector?: any,
            displayName?: string,
            asOwnInstance?: boolean) {
            "use strict";
            operation = operation || (typeof value === "undefined" ? "remove" : "merge");
            let obj = maps[operation][objectName];
            if (asOwnInstance || !obj) {
                obj = {
                    objectName: objectName,
                    selector: selector,
                    properties: {},
                };
                if (!asOwnInstance) {
                    maps[operation][objectName] = obj;
                }
                pbiState[operation] = pbiState[operation] || [];
                pbiState[operation].push(obj);
                if (displayName) {
                    obj["displayName"] = displayName;
                }
            }

            // If it is a persist object, then just mix it into the object
            if (value && value.hasOwnProperty("properties")) {
                assignIn(obj, value);
            } else {
                obj.properties[property] = value;
            }
            return me;
        },
        mergePersistObjects: (objects: powerbi.VisualObjectInstancesToPersist) => {
            if (objects) {
                const operations = ["merge", "remove"];
                operations.forEach(operation => {
                    (objects[operation] || []).forEach((po: powerbi.VisualObjectInstance) => {
                        const props = Object.keys(po.properties);
                        props.forEach(prop => {
                            me.persist(
                                po.objectName,
                                prop,
                                po.properties[prop],
                                operation,
                                po.selector,
                                po.displayName,
                                props.length <= 1);
                        });
                    });
                });
            }
        },
        build: () => pbiState as powerbi.VisualObjectInstancesToPersist,
    };
    return me;
}
