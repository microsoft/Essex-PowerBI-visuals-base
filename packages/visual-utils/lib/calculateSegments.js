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
var d3 = require("d3");
var _ = require("lodash");
var colors_1 = require("./colors");
/**
 * A utility method that takes a dataView, and breaks down the values into named segments with colors
 * Colorizing prority: "#ccc" < defaultColor < gradient < segmentColors
 * @param columns The set of columns in the dataView
 * @param defaultColor The default color to use
 * @param gradient The gradient to use
 * @param segmentColors The colors for the individual instances of segments to use
 */
function calculateSegments(columns, defaultColor, gradient, // The gradient used to color the individual segments
    segmentColors) {
    "use strict";
    var segmentInfo = [];
    if (columns && columns.length) {
        var isSeriesData = !!(columns.source && columns.source.roles["Series"]);
        segmentInfo =
            (isSeriesData ?
                columns.grouped() :
                columns.map(function (n, i) { return ({ name: (i + 1) + "", identity: n.identity }); }));
    }
    var gradientScale;
    if (gradient) {
        var startValue = gradient.startValue, endValue = gradient.endValue, startColor = gradient.startColor, endColor = gradient.endColor;
        var minValue = typeof startValue !== "undefined" ? startValue : d3.min(segmentInfo.map(function (n) { return n.name; }));
        var maxValue = typeof endValue !== "undefined" ? endValue : d3.max(segmentInfo.map(function (n) { return n.name; }));
        gradientScale = d3.scale.linear()
            .domain([isNaN(minValue) ? 0 : minValue, isNaN(maxValue) ? segmentInfo.length - 1 : maxValue])
            .interpolate(d3.interpolateRgb)
            .range([startColor, endColor]);
    }
    return _.sortBy(segmentInfo, ["name"]).map(function (v, i) {
        var color = colors_1.fullColors[i];
        if (segmentColors && segmentColors[i]) {
            color = segmentColors[i].color;
        }
        else if (gradientScale) {
            color = gradientScale(isNaN(v.name) ? i : v.name);
        }
        else {
            color = defaultColor || colors_1.fullColors[i];
        }
        color = color || "#ccc";
        return {
            name: v.name,
            identity: v.identity,
            color: color,
        };
    });
}
exports.default = calculateSegments;
//# sourceMappingURL=calculateSegments.js.map