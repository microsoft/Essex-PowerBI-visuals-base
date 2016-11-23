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

import "powerbi-visuals/lib/powerbi-visuals";
import { getSelectionIdsFromSelectors } from "./getSelectionIdsFromSelectors";
import SelectionId = powerbi.visuals.SelectionId;
const ldget = require("lodash/get"); // tslint:disable-line

/**
 * Parses the list of selection ids from PBI
 * @param objects The objects to parse selection ids from
 * @param selectionObjectPath The path to the selection data within the objects
 * @param filterObjectPath The path to the filter within the objects.
 */
export default function parseSelectionIds(
    objects: powerbi.DataViewObjects,
    selectionObjectPath = "general.selection",
    filterObjectPath = "general.filter") {
    "use strict";
    const serializedSelection = ldget(objects, selectionObjectPath);
    const serializedSelectedItems: { selector: any }[] = serializedSelection ? JSON.parse(serializedSelection) : [];
    let selectionIds: powerbi.visuals.SelectionId[]  = [];
    if (serializedSelectedItems && serializedSelectedItems.length) {
        // Relic of applying a raw filter to filter other visuals
        let condition = ldget(objects, `${filterObjectPath}.whereItems[0].condition`);
        let values = ldget(condition, "values");
        let args = ldget(condition, "args");
        if (values && args && values.length && args.length) {
            let sourceExpr = args[0];
            selectionIds = values.map((n: any) => {
                return SelectionId.createWithId(powerbi.data.createDataViewScopeIdentity(
                    powerbi.data.SQExprBuilder.compare(0, sourceExpr, n[0])
                ));
            });
        } else {
            selectionIds = getSelectionIdsFromSelectors(serializedSelectedItems.filter(n => !!n.selector).map(n => n.selector));
        }
    }
    return selectionIds;
}
