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

import { setting } from "./settingDecorator";
import { ISettingDescriptor, IDefaultInstanceColor, IDefaultColor } from "./interfaces";
import { colorParser, colorCategoricalInstanceObjectParser } from "./parsers";
import { coloredObjectInstanceComposer, colorComposer } from "./composers";

/**
 * Defines a text setting to be used with powerBI
 */
export function textSetting<T>(config?: ISettingDescriptor<T>) {
    "use strict";
    return typedSetting<T>({ text: {} }, config);
}

/**
 * Defines a bool setting to be used with powerBI
 */
export function boolSetting<T>(config?: ISettingDescriptor<T>) {
    "use strict";
    return typedSetting<T>({ bool: true }, config);
}

/**
 * Defines a number setting to be used with powerBI
 */
export function numberSetting<T>(config?: ISettingDescriptor<T>) {
    "use strict";
    return typedSetting<T>({ numeric: true }, config);
}

/**
 * Defines a setting to be used with powerBI
 */
export function colorSetting<T>(config?: IColorSettingDescriptor<T>) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: powerbi.visuals.StandardObjectProperties.fill.type,
        },
        compose: colorComposer(config ? config.defaultValue : "#ccc"),
        parse: colorParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return setting(config);
}

/**
 * Defines a setting to be used with powerBI
 */
export function instanceColorSetting<T>(config?: IColorInstanceSettingDescriptor<T>, categorical?: boolean) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: powerbi.visuals.StandardObjectProperties.fill.type,
        },
        compose: coloredObjectInstanceComposer(config ? config.defaultValue : "#ccc"),
        parse: colorCategoricalInstanceObjectParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return setting(config);
}

/**
 * Defines a setting that is an enumeration
 */
export function enumSetting<T>(enumType: any, config?: ISettingDescriptor<T>) {
    "use strict";
    return typedSetting({
        enumeration: {
            members(validMembers?: powerbi.EnumMemberValue[]): powerbi.IEnumMember[] {
                const objValues = Object.keys(enumType).map(k => enumType[k]);
                const names = objValues.filter(v => typeof v === "string") as string[];
                return names.map(n => ({
                    value: enumType[n],
                    displayName: n,
                }));
            },
        },
    }, config);
}

/**
 * A setting that has a type associated with it
 */
function typedSetting<T>(type: any, config?: ISettingDescriptor<T>) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: type,
        },
    }, config);
    return setting<T>(config);
}

export interface IColorSettingDescriptor<T> extends ISettingDescriptor<T> {
    defaultValue?: IDefaultColor;
}

export interface IColorInstanceSettingDescriptor<T> extends ISettingDescriptor<T> {
    defaultValue?: IDefaultInstanceColor;
}
