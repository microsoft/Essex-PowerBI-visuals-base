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
var settingDecorator_1 = require("./settingDecorator");
var parsers_1 = require("./parsers");
var composers_1 = require("./composers");
var _ = require("lodash");
/**
 * Defines the type for a color in powerbi
 */
var FILL_TYPE = {
    fill: {
        solid: {
            color: true,
        },
    },
};
/**
 * Defines a text setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function textSetting(config) {
    "use strict";
    return typedSetting({ text: {} }, config);
}
exports.textSetting = textSetting;
/**
 * Defines a bool setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function boolSetting(config) {
    "use strict";
    return typedSetting({ bool: true }, config);
}
exports.boolSetting = boolSetting;
/**
 * Defines a number setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function numberSetting(config) {
    "use strict";
    return typedSetting({ numeric: true }, config);
}
exports.numberSetting = numberSetting;
/**
 * Defines a JSON setting to be used with PowerBI
 * @param config The additional configuration to control how a setting operates
 */
function jsonSetting(config) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: {
                text: true,
            },
        },
        compose: function (val) { return val && JSON.stringify(val); },
        parse: function (val) { return val && JSON.parse(val); },
    }, config);
    return settingDecorator_1.setting(config);
}
exports.jsonSetting = jsonSetting;
/**
 * Defines a selection setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function selectionSetting(config) {
    "use strict";
    return jsonSetting(config);
}
exports.selectionSetting = selectionSetting;
/**
 * Defines a setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function colorSetting(config) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: FILL_TYPE,
        },
        compose: composers_1.colorComposer(config ? config.defaultValue : "#ccc"),
        parse: parsers_1.colorParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return settingDecorator_1.setting(config);
}
exports.colorSetting = colorSetting;
/**
 * Defines a setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
function instanceColorSetting(config) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: FILL_TYPE,
        },
        compose: composers_1.coloredObjectInstanceComposer(config ? config.defaultValue : "#ccc"),
        parse: parsers_1.colorCategoricalInstanceObjectParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return settingDecorator_1.setting(config);
}
exports.instanceColorSetting = instanceColorSetting;
/**
 * Defines a setting that is an enumeration
 * @param enumType The enumeration to create a setting for
 * @param config The additional configuration to control how a setting operates
 */
function enumSetting(enumType, config) {
    "use strict";
    return typedSetting({
        enumeration: {
            members: function (validMembers) {
                var objValues = Object.keys(enumType).map(function (k) { return enumType[k]; });
                var names = objValues.filter(function (v) { return typeof v === "string"; });
                return names.map(function (n) { return ({
                    value: enumType[n],
                    displayName: n,
                }); });
            },
        },
    }, config);
}
exports.enumSetting = enumSetting;
/**
 * A setting that has a type associated with it
 * @param type The powerbi type
 * @param config The additional configuration to control how a setting operates
 */
function typedSetting(type, config) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: type,
        },
    }, config);
    return settingDecorator_1.setting(config);
}
//# sourceMappingURL=decorators.js.map