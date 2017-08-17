"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var assignIn = require("lodash/assignIn"); // tslint:disable-line
/**
 * Creates a builder that will build a set of VisualObjectInstancesToPersist using a fluent style syntax
 */
function createPersistObjectBuilder() {
    "use strict";
    var pbiState = {};
    var maps = {
        merge: {},
        remove: {},
    };
    var me = {
        /**
         * Persists the given value
         * @param objectName The object name to use
         * @param property The property to use
         * @param value The value to persist
         * @param operation The operation to use (merge/remove)
         * @param selector The selector for the persist object
         * @param displayName The display name for the persist object
         * @param asOwnInstance If true, this value will be persisted as it's own instance
         */
        persist: function addToPersist(objectName, property, value, operation, selector, displayName, asOwnInstance) {
            "use strict";
            operation = operation || (typeof value === "undefined" ? "remove" : "merge");
            var obj = maps[operation][objectName];
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
            }
            else {
                obj.properties[property] = value;
            }
            return me;
        },
        /**
         * Merges another set of persist objects into this builder
         * @param objects The set of objects to merge
         */
        mergePersistObjects: function (objects) {
            if (objects) {
                var operations = ["merge", "remove"];
                operations.forEach(function (operation) {
                    (objects[operation] || []).forEach(function (po) {
                        var props = Object.keys(po.properties);
                        props.forEach(function (prop) {
                            me.persist(po.objectName, prop, po.properties[prop], operation, po.selector, po.displayName, props.length <= 1);
                        });
                    });
                });
            }
        },
        /**
         * Builds the final persist object
         */
        build: function () { return pbiState; },
    };
    return me;
}
exports.default = createPersistObjectBuilder;
//# sourceMappingURL=persistObjectBuilder.js.map