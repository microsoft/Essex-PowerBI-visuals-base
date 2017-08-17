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
var jquery = require("jquery");
var testSetup_1 = require("./testSetup"); // tslint:disable-line
require("./mockPBI");
var noop = function () { }; // tslint:disable-line
testSetup_1.default["$"] = jquery;
exports.Utils = {
    FAKE_TABLE_DATA_ONE_COLUMN: {
        metadata: {},
        table: {
            columns: [{
                    displayName: "COLUMN_1",
                    type: {
                        text: true,
                    },
                }],
            rows: [
                ["COLUMN_1_ROW_1"],
                ["COLUMN_1_ROW_2"],
            ],
        },
    },
    FAKE_TABLE_DATA_TWO_COLUMN: {
        metadata: {},
        table: {
            columns: [{
                    displayName: "COLUMN_1",
                    type: {
                        text: true,
                    },
                }, {
                    displayName: "COLUMN_2",
                    type: {
                        numeric: true,
                    },
                }],
            rows: [
                ["COLUMN_1_ROW_1", 1],
                ["COLUMN_1_ROW_2", 2],
            ],
        },
    },
    createElement: function () {
        return $("<div>");
    },
    createUpdateOptionsWithSmallData: function () {
        return {
            viewport: {
                width: 100,
                height: 100,
            },
            dataViews: [exports.Utils.FAKE_TABLE_DATA_ONE_COLUMN],
        };
    },
    createUpdateOptionsWithData: function () {
        return {
            viewport: {
                width: 100,
                height: 100,
            },
            dataViews: [exports.Utils.FAKE_TABLE_DATA_TWO_COLUMN],
        };
    },
    createFakeHost: function () {
        return {
            createSelectionIdBuilder: noop,
            persistProperties: noop,
            createSelectionManager: function () { return ({
                getSelectionIds: function () { return []; },
            }); },
        };
    },
    createFakeConstructorOptions: function () {
        return {
            element: exports.Utils.createElement()[0],
            host: exports.Utils.createFakeHost(),
        };
    },
};
//# sourceMappingURL=visualHelpers.js.map