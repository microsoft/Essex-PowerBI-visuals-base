"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var ldset = require("lodash.set"); // tslint:disable-line
/**
 * Creates a composer which composes IColoredObjects into PBI
 * @param defaultColor The default color to use if a color instance is not found
 */
function coloredObjectInstanceComposer(defaultColor) {
    "use strict";
    if (defaultColor === void 0) { defaultColor = "#ccc"; }
    return (function (val, desc, dv, setting, b) {
        if (val) {
            var propName_1 = helpers_1.getPBIObjectNameAndPropertyName(setting).propName;
            return (val.forEach ? val : [val]).map(function (n, i) {
                var instanceColor = typeof defaultColor === "function" ? defaultColor(i, dv, n.identity) : defaultColor;
                var finalColor = n.color || instanceColor;
                return {
                    displayName: n.name,
                    selector: {
                        data: [n.identity],
                    },
                    properties: (_a = {},
                        _a[propName_1] = finalColor,
                        _a),
                };
                var _a;
            });
        }
    });
}
exports.coloredObjectInstanceComposer = coloredObjectInstanceComposer;
/**
 * Creates a basic composer which takes a path and a default value, and returns the powerbi value or the default value
 * @param path The path in the object to return
 * @param defaultValue The default value to return if the powerbi value is undefined
 */
function basicObjectComposer(path, defaultValue) {
    "use strict";
    return (function (val, desc, dv, setting) {
        defaultValue = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        if (val) {
            if (path) {
                var obj = {};
                ldset(obj, path, val || defaultValue);
                return obj;
            }
            return val || defaultValue;
        }
    });
}
exports.basicObjectComposer = basicObjectComposer;
/**
 * Provides a basic color composer
 * @param defaultColor The default color to use if the powerbi value is undefined.
 */
function colorComposer(defaultColor) {
    "use strict";
    if (defaultColor === void 0) { defaultColor = "#ccc"; }
    return basicObjectComposer(undefined, defaultColor);
}
exports.colorComposer = colorComposer;
//# sourceMappingURL=composers.js.map