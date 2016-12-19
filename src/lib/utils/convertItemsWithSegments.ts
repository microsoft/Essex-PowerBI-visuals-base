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

import get from "./typesafeGet";
import { fullColors as full } from "../colors";
import SelectionId = powerbi.visuals.SelectionId;
import { default as calculateSegmentData } from "./calculateSegments";
import { IColorSettings, ItemWithValueSegments, ColorMode, IValueSegment, IColoredObject } from "./interfaces";

const ldget = require("lodash/get"); //tslint:disable-line

/**
 * Converts the dataView into a set of items that have a name, and a set of value segments.
 * Value segments being the grouped values from the dataView mapped to a color
 * *Note* This will only work with dataViews/dataViewMappings configured a certain way
 * @param dataView The dataView to convert
 * @param onSegmentCreated A function that gets called when a segment is created
 * @param onCreateItem A function that gets called when an item is created
 * @param settings The color settings to use when converting
 */
export function convertItemsWithSegments(
    dataView: powerbi.DataView,
    onSegmentCreated: any,
    onCreateItem: any,
    settings?: IColorSettings) {
    "use strict";
    let items: ItemWithValueSegments[];
    const dvCats = get(dataView, x => x.categorical.categories);
    const categories = get(dataView, x => x.categorical.categories[0].values);
    const identities = get(dataView, x => x.categorical.categories[0].identity);
    const values = get(dataView, x => x.categorical.values);
    if (categories) {
        settings = <any>settings || {};

        // Whether or not the gradient coloring mode should be used
        const shouldUseGradient = settings.colorMode === ColorMode.Gradient;

        // We should only add gradients if the data supports gradients, and the user has gradients enabled
        const shouldAddGradients = dataSupportsGradients(dataView) && shouldUseGradient;

        // If the data supports default color, then use id.
        const defaultColor = dataSupportsDefaultColor(dataView) ? full[0] : undefined;

        // We should only colorize instances if the data supports colorized instances and the user isn't
        // trying to use gradients
        const shouldAddInstanceColors = dataSupportsColorizedInstances(dataView) && !shouldUseGradient;

        // Calculate the segments
        const segmentInfo = calculateSegmentData(
            values,
            defaultColor,
            shouldAddGradients ? settings.gradient : undefined,
            shouldAddInstanceColors ? settings.instanceColors : undefined);

        items = categories.map((category, catIdx) => {
            let id = SelectionId.createWithId(identities[catIdx]);
            let total = 0;
            let segments: any;
            if (values) {
                const result = createSegments(values, segmentInfo, catIdx);
                total = result.total;
                segments = result.segments;

                if (settings && settings.reverseOrder) {
                    segments.reverse();
                }
            }
            const item = onCreateItem(dvCats, catIdx, total, id);
            item.valueSegments = segments;
            return item;
        });

        // Computes the rendered values for each of the items
        computeRenderedValues(items);

        return { items, segmentInfo };
    }
}

/**
 * Computes the rendered values for the given set of items
 * @param items The set of items to compute for
 * @param minMax The min and max values
 */
export function computeRenderedValues(items: ItemWithValueSegments[], minMax?: { min: number, max: number; }) {
    "use strict";
    const { min, max } = minMax || computeMinMaxes(items);
    const range = max - min;
    items.forEach((c) => {
        if (c.value) {
            let renderedValue = 100;
            if (range > 0) {
                const offset = min > 0 ? 10 : 0;
                renderedValue = (((c.value - min) / range) * (100 - offset)) + offset;
            }
            c.renderedValue = renderedValue;
        }
    });
}

/**
 * Computes the minimum and maximum values for the given set of items
 */
export function computeMinMaxes(items: ItemWithValueSegments[]) {
    "use strict";
    let maxValue: number;
    let minValue: number;
    items.forEach((c) => {
        if (typeof maxValue === "undefined" || c.value > maxValue) {
            maxValue = c.value;
        }
        if (typeof minValue === "undefined" || c.value < minValue) {
            minValue = c.value;
        }
    });
    return {
        min: minValue,
        max: maxValue,
    };
}

/**
 * True if the given dataview supports multiple value segments
 * @param dv The dataView to check
 */
export function dataSupportsValueSegments(dv: powerbi.DataView) {
    "use strict";
    return ldget(dv, "categorical.values.length", 0) > 0;
}

/**
 * Returns true if the data supports default colors
 * @param dv The dataView to check
 */
export function dataSupportsDefaultColor(dv: powerbi.DataView) {
    "use strict";

    // Default color only works on a single value instance
    if (dataSupportsValueSegments(dv)) {
        return get(dv, v => v.categorical.values.length, 0) === 1;
    }

    return false;
}

/**
 * Returns true if gradients can be used with the data
 * @param dv The dataView to check
 */
export function dataSupportsGradients(dv: powerbi.DataView) {
    "use strict";

    // We can use gradients on ANY data that has more than one value, otherwise it doesn't make sense
    if (dataSupportsValueSegments(dv)) {
        return get(dv, v => v.categorical.values.length, 0) > 0;
    }
    return false;
}

/**
 * Returns true if individiual instances of the dataset can be uniquely colored
 * @param dv The dataView to check
 */
export function dataSupportsColorizedInstances(dv: powerbi.DataView) {
    "use strict";

    // If there are no value segments, then there is definitely going to be no instances
    if (dataSupportsValueSegments(dv)) {
        // We can uniquely color items that have an identity associated with it
        const grouped = dv.categorical.values.grouped();
        return grouped.filter(n => !!n.identity).length > 0;
    }
    return false;
}

/**
 * Creates segments for the given values, and the information on how the value is segmented
 * @param columns The columns to create segment for
 * @param segmentData The data for the segments
 * @param column The column to generate the segment for
 */
function createSegments(
    columns: powerbi.DataViewValueColumns,
    segmentData: IColoredObject[],
    column: number) {
    "use strict";
    let total = 0;
    const segments = segmentData.map((segmentInfo, j) => {
        // Highlight here is a numerical value, the # of highlighted items in the total
        const highlights = (columns[j].highlights || []);
        const highlight = highlights[column];
        const value = columns[j].values[column];
        if (typeof value === "number") {
            total += <number>value;
        }
        const { color, name } = segmentInfo;

        // There is some sort of highlighting going on
        const segment = {
            name: name,
            color: color,
            value: value,
            displayValue: value,
            width: 0,
        } as IValueSegment;

        if (highlights && highlights.length) {
            let highlightWidth = 0;
            if (value && typeof value === "number" && highlight) {
                highlightWidth = (<number>highlight / value) * 100;
            }
            segment.highlightWidth = highlightWidth;
        }

        return segment;
    });
    segments.forEach((s: any) => {
        s.width = (s.value / total) * 100;
    });
    return { segments, total };
}