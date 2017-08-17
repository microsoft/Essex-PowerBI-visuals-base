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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var debug = require("debug");
debug.save = function () { };
if (process.env.DEBUG) {
    debug.enable(process.env.DEBUG);
}
/* tslint:enable */
var calcUpdateType_1 = require("./calcUpdateType");
exports.calcUpdateType = calcUpdateType_1.default;
var createPropertyPersister_1 = require("./createPropertyPersister");
exports.createPropertyPersister = createPropertyPersister_1.default;
__export(require("./logger"));
var PropertyPersister_1 = require("./PropertyPersister");
exports.PropertyPersister = PropertyPersister_1.default;
__export(require("./receiveDimensions"));
var UpdateType_1 = require("./UpdateType");
exports.UpdateType = UpdateType_1.default;
var buildContainsFilter_1 = require("./buildContainsFilter");
exports.buildContainsFilter = buildContainsFilter_1.default;
var persistObjectBuilder_1 = require("./persistObjectBuilder");
exports.createPersistObjectBuilder = persistObjectBuilder_1.default;
var typesafeGet_1 = require("./typesafeGet");
exports.get = typesafeGet_1.default;
__export(require("./convertItemsWithSegments"));
__export(require("./interfaces"));
var calculateSegments_1 = require("./calculateSegments");
exports.calculateSegments = calculateSegments_1.default;
var listDiff_1 = require("./listDiff");
exports.listDiff = listDiff_1.default;
//# sourceMappingURL=index.js.map