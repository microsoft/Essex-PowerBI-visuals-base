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

import global from "./testSetup"; // tslint:disable-line
import * as jquery from "jquery";
global["powerbi"] = jquery.extend(true, {
    VisualUpdateType: {},
    visuals: {
        utility: {
            SelectionManager: () => {
                return {
                    getSelectionIds: () => <any[]>[],
                };
            },
        },
        StandardObjectProperties: {
            fill: {
                type: {},
            },
        },
        valueFormatter: {
            create: function () {
                return {
                    format: function () { }, // tslint:disable-line
                };
            },
        },
        SelectionId: {
            createWithId: function () {
                return {
                    getKey() {
                        return 1;
                    },
                    getSelector() {
                        return {
                            data: [{
                                expr: {},
                            }],
                        };
                    },
                };
            },
        },
    },
    VisualDataRoleKind: {
    },
    data: {
        createDisplayNameGetter: () => ({}),
        createDataViewScopeIdentity: (expr: any) => ({ expr: expr }),
        SQExprBuilder: {
            compare: () => { }, // tslint:disable-line
        },
    },
}, global["powerbi"] || {});

global["jsCommon"] = $.extend(true, {
    PixelConverter: {
        fromPointToPixel: function (value: any) { return value; },
        toPoint: function (value: any) { return value; },
    },
}, global["jsCommon"] || {});
