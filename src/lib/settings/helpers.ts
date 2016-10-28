import createPersistObjectBuilder from "../utils/persistObjectBuilder";
import { ISetting, ISettingDescriptor, ISettingsClass, IComposeResult } from "./interfaces";

/* tslint:disable */
const ldget = require("lodash/get");
const merge = require("lodash/merge");
const assignIn = require("lodash/assignIn");
const stringify = require("json-stringify-safe");
/* tslint:enable */

export const METADATA_KEY = "__settings__";

/**
 * Parses settings from powerbi dataview objects
 */
export function parseSettingsFromPBI<T>(ctor: ISettingsClass<T>, dv?: powerbi.DataView, additionalProps?: any): T {
    "use strict";
    const settingsMetadata = getSettingsMetadata(ctor);
    const newSettings = new ctor();
    if (settingsMetadata) {
        Object.keys(settingsMetadata).forEach(n => {
            const setting = settingsMetadata[n];
            const adapted = convertValueFromPBI(setting, dv);
            newSettings[setting.propertyName] = adapted.adaptedValue;
        });
    }
    if (additionalProps) {
        assignIn(newSettings, additionalProps);
    }
    return newSettings;
}

/**
 * Builds persist objects from a given settings object
 */
export function buildPersistObjects<T>(
    ctor: ISettingsClass<T>,
    settingsObj: T,
    dataView: powerbi.DataView,
    includeHidden = true): powerbi.VisualObjectInstancesToPersist {
    "use strict";
    if (settingsObj) {
        settingsObj = fromJSON(ctor, settingsObj); // Just in case they pass in a JSON version
        const settingsMetadata = getSettingsMetadata(settingsObj);
        if (settingsMetadata) {
            const builder = createPersistObjectBuilder();
            Object.keys(settingsMetadata).forEach(key => {
                const setting = settingsMetadata[key];
                const adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
                if (adapted) {
                    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
                    let value = adapted.adaptedValue;
                    value = value && value.forEach ? value : [value];
                    value.forEach((n: any) => {
                        const isVisualInstance = !!(n && n.selector);
                        const instance = n as powerbi.VisualObjectInstance;
                        builder.persist(
                            objName,
                            propName,
                            isVisualInstance ? instance.properties : n,
                            undefined,
                            instance.selector,
                            instance.displayName,
                            isVisualInstance);
                    });
                }
            });
            return builder.build();
        }
    }
}

/**
 * Builds the enumeration objects for the given settings object
 */
export function buildEnumerationObjects<T>(
    ctor: ISettingsClass<T>,
    settingsObj: T,
    requestedObjectName: string,
    dataView: powerbi.DataView,
    includeHidden = false): powerbi.VisualObjectInstance[] {
    "use strict";
    let instances = [{
        selector: null, // tslint:disable-line
        objectName: requestedObjectName,
        properties: {},
    }] as powerbi.VisualObjectInstance[];
    if (settingsObj) {
        settingsObj = fromJSON(ctor, settingsObj); // Just in case they pass in a JSON version
        const settingsMetadata = getSettingsMetadata(settingsObj);
        if (settingsMetadata) {
            Object.keys(settingsMetadata).forEach(key => {
                const setting = settingsMetadata[key];
                const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
                const isSameCategory = objName === requestedObjectName;
                if (isSameCategory) {
                    const adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
                    if (adapted) {
                        let value = adapted.adaptedValue;
                        value = value && value.forEach ? value : [value];
                        value.forEach((n: any) => {
                            const isVisualInstance = !!(n && n.selector);
                            let instance = n as powerbi.VisualObjectInstance;
                            if (isVisualInstance) {
                                instance = merge(instance, {
                                    objectName: objName,
                                });
                                if (typeof instance.displayName === "undefined" || instance.displayName === null) { // tslint:disable-line
                                    instance.displayName = "(Blank)";
                                }
                                instance.displayName = instance.displayName + ""; // Some times there are numbers
                                instances.push(instance);
                            } else {
                                instances[0].properties[propName] = adapted.adaptedValue;
                            }
                        });
                    }
                }
            });
        }
    }

    // If there are no settings, then return no instances
    instances = instances.filter(n => Object.keys(n.properties).length > 0);
    return instances;
}

/**
 * Builds the capabilities objects dynamically from a settings class
 */
export function buildCapabilitiesObjects<T>(settingsCtor: any): powerbi.data.DataViewObjectDescriptors {
    "use strict";
    let objects: powerbi.data.DataViewObjectDescriptors;
    if (settingsCtor) {
        const settingsMetadata = getSettingsMetadata(settingsCtor);
        if (settingsMetadata) {
            objects = {};
            Object.keys(settingsMetadata).map(key => {
                const { descriptor } = settingsMetadata[key];
                const { objName, propName } = getPBIObjectNameAndPropertyName(settingsMetadata[key]);
                let { category, displayName, defaultValue, config, description, persist } = descriptor;
                if (persist !== false) {
                    const catObj = objects[objName] = objects[objName] || {
                        displayName: category || "General",
                        properties: {},
                    };
                    let type: powerbi.data.DataViewObjectPropertyTypeDescriptor;
                    if (typeof defaultValue === "number") {
                        type = { numeric: true };
                    } else if (typeof defaultValue === "boolean") {
                        type = { bool: true };
                    } else if (typeof defaultValue === "string") {
                        type = { text: {} };
                    }
                    config = config || <any>{};
                    const finalObj: powerbi.data.DataViewObjectPropertyDescriptor = {
                        displayName: config.displayName || displayName || propName,
                        description: config.description || description,
                        type: config.type || type,
                    };
                    if (config.rule) {
                        finalObj.rule = config.rule;
                    }

                    // debug.assert(!!finalObj.type, `Could not infer type property for ${propertyName}, manually add it via \`config\``);

                    catObj.properties[propName] = finalObj;
                }
            });
        }
    }
    return objects;
}

/**
 * Converts the given settings object into a JSON object
 */
export function toJSON<T>(ctor: ISettingsClass<T>, instance: any) {
    "use strict";
    return JSON.parse(stringify(instance));
}

/**
 * Gets the settings metadata from the given object
 */
function getSettingsMetadata(obj: any): { [key: string]: ISetting } {
    "use strict";
    let metadata: any;
    if (obj) {
        metadata = obj[METADATA_KEY];
        if (!metadata && obj.constructor) {
            metadata = obj.constructor[METADATA_KEY];
        }
    }
    return metadata;
}

/**
 * Gets the settings metadata from the given object
 */
export function getSetting(obj: any, key: string): ISettingDescriptor {
    "use strict";
    let metadata = getSettingsMetadata(obj);
    if (metadata && metadata[key]) {
        return metadata[key].descriptor;
    }
}

/**
 * Gets the appropriate object name and property name for powerbi from the given descriptor
 */
export function getPBIObjectNameAndPropertyName(setting: ISetting) {
    "use strict";
    const { propertyName, descriptor: { name, category } } = setting;
    return {
        objName: camelize(category || "General"),
        propName: (name || propertyName).replace(/\s/g, "_"),
    };
}

/**
 * Converts the value for the given setting on the object to a powerbi compatible value
 */
function convertValueToPBI(settingsObj: any, setting: ISetting, dataView: powerbi.DataView, includeHidden: boolean = false) {
    "use strict";
    const { descriptor, propertyName: fieldName } = setting;
    const { persist, compose } = descriptor;
    const enumerate = shouldEnumerate(settingsObj, descriptor, dataView);
    if ((includeHidden || enumerate) && persist !== false) {
        let value: IComposeResult = settingsObj[fieldName];
        if (compose) {
            value = compose(value, descriptor, dataView, setting);
        }
        return {
            adaptedValue: value as IComposeResult|any,
        };
    }
}

/**
 * Converts the value for the given setting in PBI to a regular setting value
 */
function convertValueFromPBI(setting: ISetting, dv: powerbi.DataView) {
    "use strict";
    const objects: powerbi.DataViewObjects = ldget(dv, `metadata.objects`);
    const { descriptor, descriptor: { defaultValue, parse } } = setting;
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    let value = ldget(objects, `${objName}.${propName}`);
    value = parse ? parse(value, descriptor, dv, setting) : value;
    if (typeof value === "undefined") {
        value = defaultValue;
    }
    return {
        adaptedValue: value,
    };
}

/**
 * Converts any string into a camel cased string
 */
function camelize(str: string) {
    "use strict";
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, "");
}

/**
 * Determines if the given descriptor should be enumerated
 */
function shouldEnumerate(settingsObj: any, descriptor: ISettingDescriptor, dataView: powerbi.DataView) {
    "use strict";
    const { hidden, enumerable } = descriptor;
    if (typeof enumerable !== "undefined") {
        return !!(typeof enumerable === "function" ? enumerable(settingsObj, dataView) : enumerable);
    }
    return !(typeof hidden === "function" ? hidden(settingsObj, dataView) : hidden);
}
