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
var typesafeGet_1 = require("../utils/typesafeGet");
var helpers_1 = require("./helpers");
var ldget = require("lodash/get"); // tslint:disable-line
/**
 * A parser which parses colors for each instance in a categorical dataset
 * @param defaultColor The color to use if an instance doesn't have a color
 */
function colorCategoricalInstanceObjectParser(defaultColor) {
    "use strict";
    if (defaultColor === void 0) { defaultColor = "#ccc"; }
    return coloredInstanceObjectParser(defaultColor, function (dv) {
        var values = typesafeGet_1.default(dv, function (v) { return v.categorical.values; }, []);
        return (values && values.grouped && values.grouped()) || [];
    });
}
exports.colorCategoricalInstanceObjectParser = colorCategoricalInstanceObjectParser;
/**
 * A basic color object parser which parses colors per some instance, using the instancesGetter
 * @param defaultColor The color to use if an instance doesn't have a color
 * @param instancesGetter A getter function which returns the set of instances to iterate
 */
function coloredInstanceObjectParser(defaultColor, instancesGetter) {
    "use strict";
    if (defaultColor === void 0) { defaultColor = "#ccc"; }
    return (function (val, desc, dataView, setting) {
        var values = instancesGetter(dataView);
        var _a = helpers_1.getPBIObjectNameAndPropertyName(setting), objName = _a.objName, propName = _a.propName;
        if (values && values.forEach) {
            return values.map(function (n, i) {
                var objs = n.objects;
                var obj = objs && objs[objName];
                var prop = obj && obj[propName];
                var defaultValColor = typeof defaultColor === "function" ? defaultColor(i) : defaultColor;
                return {
                    name: n.name,
                    color: typesafeGet_1.default(prop, function (o) { return o.solid.color; }, defaultValColor),
                    identity: n.identity,
                };
            });
        }
    });
}
exports.coloredInstanceObjectParser = coloredInstanceObjectParser;
/**
 * Provides a basic parser for PBI settings
 * @param path The path within the pbi object to look for the value
 * @param defaultValue The default value to use if PBI doesn't have a value
 */
function basicParser(path, defaultValue) {
    "use strict";
    return (function (val) {
        var result = ldget(val, path);
        if ((typeof result === "undefined" || result === null) && defaultValue) {
            result = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        }
        return result;
    });
}
exports.basicParser = basicParser;
/**
 * Provides a color parser for PBI settings
 * @param defaultColor The default color to use if PBI doesn't have a value
 */
function colorParser(defaultColor) {
    "use strict";
    return basicParser("solid.color", defaultColor);
}
exports.colorParser = colorParser;
//# sourceMappingURL=parsers.js.map