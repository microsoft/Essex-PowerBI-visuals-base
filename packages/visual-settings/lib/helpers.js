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
var visual_utils_1 = require("@essex/visual-utils");
/* tslint:disable */
var ldget = require("lodash.get");
var merge = require("lodash.merge");
var assignIn = require("lodash.assignin");
var stringify = require("json-stringify-safe");
/* tslint:enable */
exports.METADATA_KEY = "__settings__";
/**
 * Parses settings from powerbi dataview objects
 * @param settingsClass The class type of the class with the settings
 * @param dv The dataview to construct the settings from
 * @param props Any additional properties to merge into the settings object
 * @param propsHavePrecedence If true, the additional properties passed in should override any that are retrieved from PBI
 * @param coerceNullAsUndefined If true, the props that are 'null' will get converted to `undefined`
 */
function parseSettingsFromPBI(settingClass, dv, props, propsHavePrecedence, coerceNullAsUndefined) {
    "use strict";
    if (props === void 0) { props = {}; }
    if (propsHavePrecedence === void 0) { propsHavePrecedence = true; }
    if (coerceNullAsUndefined === void 0) { coerceNullAsUndefined = true; }
    var settingsMetadata = getSettingsMetadata(settingClass);
    var newSettings = new settingClass();
    // Merge the additional props in the beginning, cause the PBI parsed settings will override these
    // if necessary.
    assignIn(newSettings, props);
    if (settingsMetadata) {
        Object.keys(settingsMetadata).forEach(function (n) {
            var setting = settingsMetadata[n];
            var propertyName = setting.propertyName;
            var addlProp = props[propertyName];
            var value;
            if (setting.isChildSettings) {
                value = parseSettingsFromPBI(setting.childClassType, dv, addlProp, propsHavePrecedence);
            }
            else {
                if (propsHavePrecedence && (addlProp || props.hasOwnProperty(propertyName))) {
                    value = coerceNullAsUndefined && addlProp === null ? undefined : addlProp; // tslint:disable-line
                }
                else {
                    var adapted = convertValueFromPBI(setting, dv);
                    value = adapted.adaptedValue;
                }
            }
            newSettings[propertyName] = value;
        });
    }
    return newSettings;
}
exports.parseSettingsFromPBI = parseSettingsFromPBI;
/**
 * Builds a set of persistance objects to be persisted from the current set of settings.  Can be used with IVisualHost.persistProperties
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
function buildPersistObjects(settingsClass, settingsObj, dataView, includeHidden) {
    "use strict";
    if (includeHidden === void 0) { includeHidden = true; }
    if (settingsObj) {
        settingsObj = parseSettingsFromPBI(settingsClass, undefined, settingsObj); // Just in case they pass in a JSON version
        var settingsMetadata_1 = getSettingsMetadata(settingsClass);
        if (settingsMetadata_1) {
            var builder_1 = visual_utils_1.createPersistObjectBuilder();
            Object.keys(settingsMetadata_1).forEach(function (key) {
                var setting = settingsMetadata_1[key];
                if (setting.isChildSettings) {
                    var childSettingValue = settingsObj[setting.propertyName];
                    if (childSettingValue && shouldPersist(setting.descriptor) !== false) {
                        var childSettings = buildPersistObjects(setting.childClassType, settingsObj[setting.propertyName], dataView, includeHidden);
                        builder_1.mergePersistObjects(childSettings);
                    }
                }
                else {
                    buildPersistObject(setting, settingsObj, dataView, includeHidden, builder_1);
                }
            });
            return builder_1.build();
        }
    }
}
exports.buildPersistObjects = buildPersistObjects;
/**
 * Builds a single persist object for the given setting
 * @param setting The setting to persist the value for
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 * @param builder The persist object builder to add the setting value to
 */
function buildPersistObject(setting, settingsObj, dataView, includeHidden, builder) {
    "use strict";
    if (includeHidden === void 0) { includeHidden = true; }
    var adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
    if (adapted) {
        var _a = getPBIObjectNameAndPropertyName(setting), objName_1 = _a.objName, propName_1 = _a.propName;
        var value = adapted.adaptedValue;
        value = value && value.forEach ? value : [value];
        value.forEach(function (n) {
            var isVisualInstance = !!(n && n.properties);
            var instance = n;
            builder.persist(objName_1, propName_1, n, undefined, instance && instance.selector, instance && instance.displayName, isVisualInstance);
        });
    }
}
/**
 * Builds the enumeration objects for the given settings object
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param objectName The objectName being requested from enumerateObjectInstances
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
function buildEnumerationObjects(settingsClass, settingsObj, objectName, dataView, includeHidden) {
    "use strict";
    if (includeHidden === void 0) { includeHidden = false; }
    var instances = [{
            selector: null,
            objectName: objectName,
            properties: {},
        }];
    if (settingsObj) {
        settingsObj = parseSettingsFromPBI(settingsClass, undefined, settingsObj); // Just in case they pass in a JSON version
        var settingsMetadata_2 = getSettingsMetadata(settingsClass);
        if (settingsMetadata_2) {
            Object.keys(settingsMetadata_2).forEach(function (key) {
                var setting = settingsMetadata_2[key];
                if (setting.isChildSettings) {
                    var childSettings = settingsObj[setting.propertyName];
                    if (childSettings && shouldEnumerate(settingsObj, setting.descriptor, dataView)) {
                        instances = instances.concat(buildEnumerationObjects(setting.childClassType, childSettings, objectName, dataView, includeHidden));
                    }
                }
                else {
                    var objName = getPBIObjectNameAndPropertyName(setting).objName;
                    var isSameCategory = objName === objectName;
                    if (isSameCategory) {
                        buildEnumerationObject(setting, settingsObj, dataView, includeHidden, instances);
                    }
                }
            });
        }
    }
    // If there are no settings, then return no instances
    instances = instances.filter(function (n) { return Object.keys(n.properties).length > 0; });
    return instances;
}
exports.buildEnumerationObjects = buildEnumerationObjects;
/**
 * Builds a single enumeration object for the given setting and adds it to the list of instances
 * TODO: Think about removing the `instances` param, and just returning an instance and making the caller
 * deal with how to add it
 * @param setting The setting to get the enumeration object for
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 * @param instances The set of instances to add to
 */
function buildEnumerationObject(setting, settingsObj, dataView, includeHidden, instances) {
    "use strict";
    if (includeHidden === void 0) { includeHidden = false; }
    var adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
    if (adapted) {
        var _a = getPBIObjectNameAndPropertyName(setting), objName_2 = _a.objName, propName_2 = _a.propName;
        var value = adapted.adaptedValue;
        value = value && value.forEach ? value : [value];
        value.forEach(function (n) {
            var isVisualInstance = !!(n && n.properties);
            var instance = n;
            if (isVisualInstance) {
                instance = merge(instance, {
                    objectName: objName_2,
                });
                if (typeof instance.displayName === "undefined" || instance.displayName === null) {
                    instance.displayName = "(Blank)";
                }
                instance.displayName = instance.displayName + ""; // Some times there are numbers
                instances.push(instance);
            }
            else {
                instances[0].properties[propName_2] = adapted.adaptedValue;
            }
        });
    }
}
/**
 * Builds the capabilities objects dynamically from a settings class
 * @param settingsClass The settings class type to generate the capabilities object from
 */
function buildCapabilitiesObjects(settingsClass) {
    "use strict";
    var objects;
    if (settingsClass) {
        var settingsMetadata_3 = getSettingsMetadata(settingsClass);
        if (settingsMetadata_3) {
            objects = {};
            Object.keys(settingsMetadata_3).map(function (key) {
                var setting = settingsMetadata_3[key];
                var isChildSettings = setting.isChildSettings, childClassType = setting.childClassType;
                if (isChildSettings) {
                    if (shouldPersist(setting.descriptor) !== false) {
                        merge(objects, buildCapabilitiesObjects(childClassType));
                    }
                }
                else {
                    var catObj = buildCapabilitiesObject(setting);
                    // TODO: Test.  This can fail if setting.persist is false
                    if (catObj) {
                        var objectName = catObj.objectName;
                        var finalObj = objects[objectName] || catObj;
                        // This ensures all properties are merged into the final capabilities object
                        // otherwise if we did assignIn at the "object" level, then the last
                        // settings objects will prevail.  We also cannot use merge, cause it loses
                        // functions
                        assignIn(finalObj.properties, catObj.properties);
                        objects[objectName] = finalObj;
                    }
                }
            });
        }
    }
    return objects;
}
exports.buildCapabilitiesObjects = buildCapabilitiesObjects;
/**
 * Builds a single capabilities object for the given setting
 * @param setting The setting to generate the capabilities object from
 */
function buildCapabilitiesObject(setting) {
    "use strict";
    var _a = getPBIObjectNameAndPropertyName(setting), objName = _a.objName, propName = _a.propName;
    var _b = setting.descriptor, category = _b.category, displayName = _b.displayName, defaultValue = _b.defaultValue, config = _b.config, description = _b.description, persist = _b.persist;
    var defaultCategory = "General";
    if (persist !== false) {
        var catObj = {
            objectName: objName,
            displayName: category || defaultCategory,
            properties: {},
        };
        var type = void 0;
        if (typeof defaultValue === "number") {
            type = { numeric: true };
        }
        else if (typeof defaultValue === "boolean") {
            type = { bool: true };
        }
        else if (typeof defaultValue === "string") {
            type = { text: {} };
        }
        config = config || {};
        var finalObj = {
            displayName: config.displayName || displayName || propName,
            description: config.description || description,
            type: config.type || type,
        };
        if (config.rule) {
            finalObj.rule = config.rule;
        }
        /*
        debug.assert(!!finalObj.type,
            `Could not infer type property for ${propertyName}, manually add it via \`config\``);
        */
        catObj.properties[propName] = finalObj;
        return catObj;
    }
}
/**
 * Converts the given settings object into a JSON object
 * @param settingsClass The settings class type to generate the JSON object for
 * @param instance The instance of settingsClass to get the values from
 */
function toJSON(settingsClass, instance) {
    "use strict";
    // Preserve keys even though they are undefined.
    var newObj = JSON.parse(stringify(instance, function (k, v) { return v === undefined ? null : v; })); // tslint:disable-line
    return newObj;
}
exports.toJSON = toJSON;
/**
 * Gets the settings metadata from the given object
 * @param obj The object to attempt to get the settings from
 */
function getSettingsMetadata(obj) {
    "use strict";
    var metadata;
    if (obj) {
        metadata = ldget(obj, exports.METADATA_KEY + ".settings");
        if (!metadata && obj.constructor) {
            metadata = ldget(obj.constructor, exports.METADATA_KEY + ".settings");
        }
    }
    return metadata;
}
/**
 * Gets the settings metadata from the given object
 * @param obj The object to get the setting from
 * @param key The name of the setting
 */
function getSetting(obj, key) {
    "use strict";
    var metadata = getSettingsMetadata(obj);
    if (metadata && metadata[key]) {
        return metadata[key].descriptor;
    }
}
exports.getSetting = getSetting;
/**
 * Gets the appropriate object name and property name for powerbi from the given setting
 * @param setting The setting to get the powerbi objectName and property name for.
 */
function getPBIObjectNameAndPropertyName(setting) {
    "use strict";
    var propertyName = setting.propertyName, _a = setting.descriptor, name = _a.name, category = _a.category;
    return {
        objName: camelize(category || "General"),
        propName: (name || propertyName).replace(/\s/g, "_"),
    };
}
exports.getPBIObjectNameAndPropertyName = getPBIObjectNameAndPropertyName;
/**
 * Converts the value of the given setting on the object to a powerbi compatible value
 * @param settingsObj The instance of a settings object
 * @param setting The setting to get the value for
 * @param dataView The dataView to pass to the setting
 * @param includeHidden If True, 'hidden' settings will be returned
 */
function convertValueToPBI(settingsObj, setting, dataView, includeHidden) {
    "use strict";
    if (includeHidden === void 0) { includeHidden = false; }
    var descriptor = setting.descriptor, fieldName = setting.propertyName;
    var compose = descriptor.compose;
    var enumerate = shouldEnumerate(settingsObj, descriptor, dataView);
    var persist = shouldPersist(descriptor);
    if ((includeHidden || enumerate) && persist !== false) {
        var value = settingsObj[fieldName];
        if (compose) {
            value = compose(value, descriptor, dataView, setting);
        }
        return {
            adaptedValue: value,
        };
    }
}
exports.convertValueToPBI = convertValueToPBI;
/**
 * Converts the value for the given setting in PBI to a regular setting value
 * @param setting The setting to get the value for
 * @param dv The dataView to pass to the setting
 */
function convertValueFromPBI(setting, dv) {
    "use strict";
    var objects = ldget(dv, "metadata.objects");
    var descriptor = setting.descriptor, _a = setting.descriptor, defaultValue = _a.defaultValue, parse = _a.parse, min = _a.min, max = _a.max;
    var _b = getPBIObjectNameAndPropertyName(setting), objName = _b.objName, propName = _b.propName;
    var value = ldget(objects, objName + "." + propName);
    var hasDefaultValue = typeof defaultValue !== "undefined" || descriptor.hasOwnProperty("defaultValue");
    value = parse ? parse(value, descriptor, dv, setting) : value;
    if (hasDefaultValue && (value === null || typeof value === "undefined")) {
        value = defaultValue; // tslint:disable-line
    }
    if (typeof min !== "undefined") {
        value = Math.max(min, value);
    }
    if (typeof max !== "undefined") {
        value = Math.min(max, value);
    }
    return {
        adaptedValue: value /*typeof value === "undefined" ? null : value*/,
    };
}
exports.convertValueFromPBI = convertValueFromPBI;
/**
 * Converts any string into a camel cased string
 * @param str The string to conver to camel case
 */
function camelize(str) {
    "use strict";
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, "");
}
/**
 * Determines if the given descriptor should be enumerated
 * @param settingsObj The instance of the settings class
 * @param descriptor The descriptor to check
 * @param dataView The current dataView
 */
function shouldEnumerate(settingsObj, descriptor, dataView) {
    "use strict";
    var hidden = descriptor.hidden, enumerable = descriptor.enumerable;
    if (typeof enumerable !== "undefined") {
        return !!(typeof enumerable === "function" ? enumerable(settingsObj, dataView) : enumerable);
    }
    return !(typeof hidden === "function" ? hidden(settingsObj, dataView) : hidden);
}
/**
 * Determines if the given descriptor should be persisted
 * @param descriptor The descriptor to check
 */
function shouldPersist(descriptor) {
    "use strict";
    return descriptor.persist;
}
/**
 * Composes an object instance with the given values
 */
function composeInstance(setting, selector, displayName, value) {
    "use strict";
    var _a = getPBIObjectNameAndPropertyName(setting), objName = _a.objName, propName = _a.propName;
    return {
        objectName: objName,
        selector: selector,
        displayName: displayName,
        properties: (_b = {},
            _b[propName] = value,
            _b),
    };
    var _b;
}
exports.composeInstance = composeInstance;
/**
 * Gets all of the objects for the given column, if an id is specified, it looks for the specific instance with the given id
 */
function getObjectsForColumn(column, setting, id) {
    "use strict";
    var _a = getPBIObjectNameAndPropertyName(setting), objName = _a.objName, propName = _a.propName;
    var columnObjects = ldget(column, "objects." + objName);
    if (id) {
        return ldget(columnObjects, "$instances." + id + "." + propName);
    }
    else {
        return ldget(columnObjects, "" + propName);
    }
}
exports.getObjectsForColumn = getObjectsForColumn;
/**
 * Creates a selector for PBI that is for a specific column, and an optional unique user defined id
 * Having an id allows for storing multiple instances of objects under a single objectName/propertyName in VisualObjectInstancesToPersist
 */
function createObjectSelectorForColumn(column, id) {
    "use strict";
    return {
        metadata: column.queryName,
        id: id,
    };
}
exports.createObjectSelectorForColumn = createObjectSelectorForColumn;
//# sourceMappingURL=helpers.js.map