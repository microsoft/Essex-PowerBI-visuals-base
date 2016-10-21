import createPersistObjectBuilder from "../utils/persistObjectBuilder";
import { ISetting, ISettingDescriptor, ISettingsClass } from "./interfaces";

/* tslint:disable */
const ldget = require("lodash/get");
const merge = require("lodash/merge");
const stringify = require("json-stringify-safe");
/* tslint:enable */

export const METADATA_KEY = "__settings__";

/**
 * Parses settings from powerbi dataview objects
 */
export function parseSettingsFromPBI<T>(ctor: ISettingsClass<T>, dv: powerbi.DataView): T {
    "use strict";
    const settingsMetadata = getSettingsMetadata(ctor);
    if (settingsMetadata) {
        const newSettings = new ctor();
        Object.keys(settingsMetadata).forEach(n => {
            const setting = settingsMetadata[n];
            const adapted = convertValueFromPBI(setting, dv);
            newSettings[setting.propertyName] = adapted.adaptedValue;
        });
        return newSettings;
    }
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
            Object.keys(settingsObj).forEach(key => {
                const setting = settingsMetadata[key];
                const adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
                if (adapted) {
                    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
                    builder.persist(objName, propName, adapted.adaptedValue);
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
            Object.keys(settingsObj).forEach(key => {
                const setting = settingsMetadata[key];
                const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
                const isSameCategory = objName === requestedObjectName;
                if (isSameCategory) {
                    const adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
                    if (adapted) {
                        instances[0].properties[propName] = adapted.adaptedValue;
                    }
                }
            });
        }
    }

    // If there are no settings, then return no instances
    return Object.keys(instances[0].properties).length === 0 ? [] : instances;
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
                const { descriptor, propertyName } = settingsMetadata[key];
                const { objName, propName } = getPBIObjectNameAndPropertyName(settingsMetadata[key]);
                let { category, name, displayName, defaultValue, config, description, persist } = descriptor;
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
export function fromJSON<T>(ctor: ISettingsClass<T>, json: any) {
    "use strict";
    const instance = (new ctor());
    merge(instance, json);
    return instance;
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
function getPBIObjectNameAndPropertyName(setting: ISetting) {
    "use strict";
    const { propertyName, descriptor: { name, category } } = setting;
    return {
        objName: camelize(category || "General"),
        propName: camelize(name ? name.toLowerCase() : propertyName),
    };
}

/**
 * Converts the value for the given setting on the object to a powerbi compatible value
 */
function convertValueToPBI(settingsObj: any, setting: ISetting, dataView: powerbi.DataView, includeHidden: boolean = false) {
    "use strict";
    const { descriptor, propertyName: fieldName } = setting;
    const { hidden, persist, compose } = descriptor;
    // Ignore ones that are "hidden" and ones that shouldn't be "persisted"
    const isHidden = typeof hidden === "function" ? hidden(settingsObj, dataView) : !!hidden;
    if ((includeHidden || !isHidden) && persist !== false) {
        let value = settingsObj[fieldName];
        if (compose) {
            value = compose(value, descriptor);
        }
        return {
            adaptedValue: value,
        };
    }
}

/**
 * Converts the value for the given setting in PBI to a regular setting value
 */
function convertValueFromPBI(setting: ISetting, dv: powerbi.DataView) {
    "use strict";
    const objects: powerbi.DataViewObjects = ldget(dv, `metadata.objects`);
    const { descriptor, descriptor: { defaultValue, parse }, propertyName } = setting;
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    let value = ldget(objects, `${objName}.${propName}`);
    value = parse ? parse(value, descriptor, dv) : value;
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
