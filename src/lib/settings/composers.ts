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


import { ISettingsComposer, IDefaultInstanceColor, IDefaultValue, IDefaultColor, ISetting, ISettingDescriptor } from "./interfaces"; // tslint:disable-line
import { IColoredObject, IPersistObjectBuilder } from "../utils/interfaces"; // tslint:disable-line
import { getPBIObjectNameAndPropertyName } from "./helpers";
const ldset = require("lodash/set"); //tslint:disable-line

/**
 * Creates a composer which composes IColoredObjects into PBI
 * @param defaultColor The default color to use if a color instance is not found
 */
export function coloredObjectInstanceComposer(defaultColor: IDefaultInstanceColor = "#ccc") {
    "use strict";
    return ((val, desc, dv, setting, b) => {
        if (val) {
            const { propName } = getPBIObjectNameAndPropertyName(setting);
            return (((<any>val).forEach ? val : [val]) as IColoredObject[]).map((n, i) => {
                const instanceColor = typeof defaultColor === "function" ? defaultColor(i, dv, n.identity) : defaultColor;
                const finalColor = n.color || instanceColor;
                return {
                    displayName: n.name,
                    selector: n.identity ? powerbi.visuals.ColorHelper.normalizeSelector(
                        powerbi.visuals.SelectionId.createWithId(n.identity).getSelector(), // Not sure if all of this is necessary
                    false) : undefined,
                    properties: {
                        [propName]: finalColor,
                    },
                };
            });
        }
    }) as ISettingsComposer<IColoredObject[]|IColoredObject>;
}

/**
 * Creates a basic composer which takes a path and a default value, and returns the powerbi value or the default value
 * @param path The path in the object to return
 * @param defaultValue The default value to return if the powerbi value is undefined
 */
export function basicObjectComposer(path?: string, defaultValue?: IDefaultValue<any>) {
    "use strict";
    return ((val, desc, dv, setting) => {
        defaultValue = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        if (val) {
            if (path) {
                const obj = { };
                ldset(obj, path, val || defaultValue);
                return obj;
            }
            return val || defaultValue;
        }
    }) as ISettingsComposer<any>;
}

/**
 * Provides a basic color composer
 * @param defaultColor The default color to use if the powerbi value is undefined.
 */
export function colorComposer(defaultColor: IDefaultColor = "#ccc") {
    "use strict";
    return basicObjectComposer(undefined, defaultColor) as ISettingsComposer<string>;
}
