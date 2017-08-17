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
var typesafeGet_1 = require("./typesafeGet");
var colors_1 = require("./colors");
var calculateSegments_1 = require("./calculateSegments");
var interfaces_1 = require("./interfaces");
var ldget = require("lodash.get"); //tslint:disable-line
/**
 * Converts the dataView into a set of items that have a name, and a set of value segments.
 * Value segments being the grouped values from the dataView mapped to a color
 * *Note* This will only work with dataViews/dataViewMappings configured a certain way
 * @param dataView The dataView to convert
 * @param onCreateItem A function that gets called when an item is created
 * @param settings The color settings to use when converting
 */
function convertItemsWithSegments(dataView, onCreateItem, settings, createIdBuilder) {
    "use strict";
    var items;
    var dvCats = typesafeGet_1.default(dataView, function (x) { return x.categorical.categories; });
    var categories = typesafeGet_1.default(dataView, function (x) { return x.categorical.categories[0].values; });
    var values = typesafeGet_1.default(dataView, function (x) { return x.categorical.values; });
    if (categories) {
        settings = settings || {};
        // Whether or not the gradient coloring mode should be used
        var shouldUseGradient = settings.colorMode === interfaces_1.ColorMode.Gradient;
        // We should only add gradients if the data supports gradients, and the user has gradients enabled
        var shouldAddGradients = dataSupportsGradients(dataView) && shouldUseGradient;
        // If the data supports default color, then use id.
        var defaultColor = dataSupportsDefaultColor(dataView) ? colors_1.fullColors[0] : undefined;
        // We should only colorize instances if the data supports colorized instances and the user isn't
        // trying to use gradients
        var shouldAddInstanceColors = dataSupportsColorizedInstances(dataView) && !shouldUseGradient;
        // Calculate the segments
        // Segment info is the list of segments that each row should contain, with the colors of the segements.
        // i.e. [<Sum of Id: Color Blue>, <Average Grade: Color Red>]
        var segmentInfo_1 = calculateSegments_1.default(values, defaultColor, shouldAddGradients ? settings.gradient : undefined, shouldAddInstanceColors ? settings.instanceColors : undefined);
        // Iterate through each of the rows (or categories)
        items = categories.map(function (category, rowIdx) {
            var id = createIdBuilder ?
                createIdBuilder()
                    .withCategory(dvCats[0], rowIdx)
                    .createSelectionId()
                : rowIdx;
            var rowTotal = 0;
            var segments;
            // If we have bars
            if (values) {
                var segmentData = createSegments(values, segmentInfo_1, rowIdx);
                segments = segmentData.segments;
                rowTotal = segmentData.total;
                if (settings && settings.reverseOrder) {
                    segments.reverse();
                }
            }
            var item = onCreateItem(dvCats, rowIdx, rowTotal, id, segments);
            item.valueSegments = segments;
            return item;
        });
        // Computes the rendered values for each of the items
        computeRenderedValues(items);
        return { items: items, segmentInfo: segmentInfo_1 };
    }
}
exports.convertItemsWithSegments = convertItemsWithSegments;
/**
 * Computes the rendered values for the given set of items
 * @param items The set of items to compute for
 */
function computeRenderedValues(items) {
    "use strict";
    if (items && items.length) {
        var range_1 = computeRange(items);
        var maxWidth_1 = 0;
        items.forEach(function (item) {
            var segments = (item.valueSegments || []);
            var rowWidth = 0;
            segments.forEach(function (segment, segmentIdx) {
                segment.width = (Math.abs(segment.value) / range_1.max / segments.length) * 100;
                rowWidth += segment.width;
            });
            if (rowWidth > maxWidth_1) {
                maxWidth_1 = rowWidth;
            }
        });
        if (maxWidth_1 > 0) {
            items.forEach(function (item) {
                item.renderedValue = 100 * (100 / maxWidth_1);
            });
        }
    }
}
exports.computeRenderedValues = computeRenderedValues;
/**
 * Computes the range of all of the value segments
 */
function computeRange(items) {
    "use strict";
    // const segmentDomains: IDomain[] = [];
    var max = 0;
    if (items && items.length) {
        items.forEach(function (item) {
            (item.valueSegments || []).forEach(function (segment, colIdx) {
                var segmentValue = segment.value;
                if (typeof segmentValue === "number") {
                    var absVal = Math.abs(segmentValue);
                    if (absVal > max) {
                        max = absVal;
                    }
                }
            });
        });
    }
    return { min: 0, max: max };
}
/**
 * True if the given dataview supports multiple value segments
 * @param dv The dataView to check
 */
function dataSupportsValueSegments(dv) {
    "use strict";
    return ldget(dv, "categorical.values.length", 0) > 0;
}
exports.dataSupportsValueSegments = dataSupportsValueSegments;
/**
 * Returns true if the data supports default colors
 * @param dv The dataView to check
 */
function dataSupportsDefaultColor(dv) {
    "use strict";
    // Default color only works on a single value instance
    if (dataSupportsValueSegments(dv)) {
        return typesafeGet_1.default(dv, function (v) { return v.categorical.values.length; }, 0) === 1;
    }
    return false;
}
exports.dataSupportsDefaultColor = dataSupportsDefaultColor;
/**
 * Returns true if gradients can be used with the data
 * @param dv The dataView to check
 */
function dataSupportsGradients(dv) {
    "use strict";
    // We can use gradients on ANY data that has more than one value, otherwise it doesn't make sense
    if (dataSupportsValueSegments(dv)) {
        return typesafeGet_1.default(dv, function (v) { return v.categorical.values.length; }, 0) > 0;
    }
    return false;
}
exports.dataSupportsGradients = dataSupportsGradients;
/**
 * Returns true if individiual instances of the dataset can be uniquely colored
 * @param dv The dataView to check
 */
function dataSupportsColorizedInstances(dv) {
    "use strict";
    // If there are no value segments, then there is definitely going to be no instances
    if (dataSupportsValueSegments(dv) && dv.categorical.values.grouped) {
        // We can uniquely color items that have an identity associated with it
        var grouped = dv.categorical.values.grouped();
        return grouped.filter(function (n) { return !!n.identity; }).length > 0;
    }
    return false;
}
exports.dataSupportsColorizedInstances = dataSupportsColorizedInstances;
/**
 * Creates segments for the given values, and the information on how the value is segmented
 * @param columns The columns to create segment for
 * @param segmentData The data for the segments
 * @param rowIdx The row to generate the segment for
 */
function createSegments(columns, segmentData, rowIdx) {
    "use strict";
    var total = 0;
    var segments = segmentData.map(function (si, colIdx) {
        var highlights = (columns[colIdx].highlights || []);
        var highlight = highlights[rowIdx];
        var segmentValue = columns[colIdx].values[rowIdx];
        if (typeof segmentValue === "number") {
            total += segmentValue;
        }
        var color = si.color, name = si.name;
        // There is some sort of highlighting going on
        var segment = {
            name: name,
            color: color,
            value: segmentValue,
            displayValue: segmentValue,
            width: 0,
        };
        if (highlights && highlights.length) {
            var highlightWidth = 0;
            if (segmentValue && typeof segmentValue === "number" && highlight) {
                highlightWidth = (highlight / segmentValue) * 100;
            }
            segment.highlightWidth = highlightWidth;
        }
        return segment;
    });
    return { segments: segments, total: total };
}
//# sourceMappingURL=convertItemsWithSegments.js.map