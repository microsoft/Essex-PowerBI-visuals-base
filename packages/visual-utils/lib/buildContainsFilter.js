"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var models = require("powerbi-models");
/**
 * Builds a "contains" filter from the given search value, and the given dataView
 * If text will do an actual contains, otherwise it defaults to equality.
 * @param source The column to create a contains filter for
 * @param searchVal The value to create the filter for
 */
function buildContainsFilter(source, searchVal) {
    "use strict";
    var filter;
    if (source) {
        var sourceType = source.type;
        // Only support "contains" with text columns
        var target = {
            table: source.queryName.substr(0, source.queryName.indexOf(".")),
            column: source.displayName,
        };
        if (searchVal) {
            if (sourceType.text) {
                filter = new models.AdvancedFilter(target, "And", {
                    operator: "Contains",
                    value: searchVal,
                });
            }
            else {
                if (sourceType.numeric) {
                    filter = new models.AdvancedFilter(target, "And", {
                        operator: "Is",
                        value: searchVal,
                    });
                }
                else if (sourceType.bool) {
                    filter = new models.AdvancedFilter(target, "Or", [{
                            operator: "Is",
                            value: "1",
                        }, {
                            operator: "Is",
                            value: "true",
                        }]);
                }
            }
        }
    }
    return filter;
}
exports.default = buildContainsFilter;
//# sourceMappingURL=buildContainsFilter.js.map