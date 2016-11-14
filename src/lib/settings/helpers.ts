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
export function parseSettingsFromPBI<T>(
    settingClass: ISettingsClass<T>,
    dv?: powerbi.DataView,
    additionalProps?: any,
    addPropsAfter = true): T {
    "use strict";
    const settingsMetadata = getSettingsMetadata(settingClass);
    const newSettings = new settingClass();
    const mixin = () => additionalProps ? assignIn(newSettings, additionalProps) : 0;
    if (!addPropsAfter) {
        mixin();
    }
    if (settingsMetadata) {
        Object.keys(settingsMetadata).forEach(n => {
            const setting = settingsMetadata[n];
            let value: any;
            if (setting.isChildSettings) {
                value = parseSettingsFromPBI(setting.childClassType as any, dv);
            } else {
                const adapted = convertValueFromPBI(setting, dv);
                value = adapted.adaptedValue;
            }
            newSettings[setting.propertyName] = value;
        });
    }

    if (addPropsAfter) {
        mixin();
    }
    return newSettings;
}

/**
 * Builds persist objects from a given settings object
 */
export function buildPersistObjects<T>(
    settingsClass: ISettingsClass<T>,
    settingsObj: T,
    dataView: powerbi.DataView,
    includeHidden = true): powerbi.VisualObjectInstancesToPersist {
    "use strict";
    if (settingsObj) {
        settingsObj = parseSettingsFromPBI(settingsClass, undefined, settingsObj); // Just in case they pass in a JSON version
        const settingsMetadata = getSettingsMetadata(settingsObj);
        if (settingsMetadata) {
            const builder = createPersistObjectBuilder();
            Object.keys(settingsMetadata).forEach(key => {
                const setting = settingsMetadata[key];
                if (setting.isChildSettings) {
                    const childSettingValue = settingsObj[setting.propertyName];
                    if (childSettingValue && shouldPersist(setting.descriptor) !== false) {
                        const childSettings = buildPersistObjects(
                            setting.childClassType as any,
                            settingsObj[setting.propertyName],
                            dataView,
                            includeHidden);
                        builder.mergePersistObjects(childSettings);
                    }
                } else {
                    buildPersistObject(setting, settingsObj, dataView, includeHidden, builder);
                }
            });
            return builder.build();
        }
    }
}

/**
 * Builds a single persist object
 */
function buildPersistObject(
    setting: ISetting,
    settingsObj: any,
    dataView: powerbi.DataView,
    includeHidden = true,
    builder: any) {
    "use strict";
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
}

/**
 * Builds the enumeration objects for the given settings object
 */
export function buildEnumerationObjects<T>(
    settingsClass: ISettingsClass<T>,
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
        settingsObj = parseSettingsFromPBI(settingsClass, undefined, settingsObj); // Just in case they pass in a JSON version
        const settingsMetadata = getSettingsMetadata(settingsObj);
        if (settingsMetadata) {
            Object.keys(settingsMetadata).forEach(key => {
                const setting = settingsMetadata[key];
                if (setting.isChildSettings) {
                    const childSettings = settingsObj[setting.propertyName];
                    if (childSettings && shouldEnumerate(settingsObj, setting.descriptor, dataView)) {
                        instances = instances.concat(
                            buildEnumerationObjects(
                                setting.childClassType as any,
                                childSettings,
                                requestedObjectName,
                                dataView,
                                includeHidden)
                            );
                    }
                } else {
                    const { objName } = getPBIObjectNameAndPropertyName(setting);
                    const isSameCategory = objName === requestedObjectName;
                    if (isSameCategory) {
                        buildEnumerationObject(setting, settingsObj, dataView, includeHidden, instances);
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
 * Builds a single enumeration object for the give setting and adds it to the list of instances
 * TODO: Think about removing the `instances` param, and just returning an instance and making the caller
 * deal with how to add it
 */
function buildEnumerationObject(
    setting: ISetting,
    settingsObj: any,
    dataView: powerbi.DataView,
    includeHidden = false,
    instances: powerbi.VisualObjectInstance[]) {
        "use strict";
    const adapted = convertValueToPBI(settingsObj, setting, dataView, includeHidden);
    if (adapted) {
        const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
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

/**
 * Builds the capabilities objects dynamically from a settings class
 */
export function buildCapabilitiesObjects<T>(settingsClass: ISettingsClass<T>): powerbi.data.DataViewObjectDescriptors {
    "use strict";
    let objects: powerbi.data.DataViewObjectDescriptors;
    if (settingsClass) {
        const settingsMetadata = getSettingsMetadata(settingsClass);
        if (settingsMetadata) {
            objects = {};
            Object.keys(settingsMetadata).map(key => {
                const setting = settingsMetadata[key];
                const { isChildSettings, childClassType } = setting;
                if (isChildSettings) {
                    if (shouldPersist(setting.descriptor) !== false) {
                        merge(objects, buildCapabilitiesObjects(childClassType));
                    }
                } else {
                    const catObj = buildCapabilitiesObject(setting);
                    const { objectName } = catObj;
                    const finalObj = objects[objectName] || catObj;

                    // This ensures all properties are merged into the final capabilities object
                    // otherwise if we did assignIn at the "object" level, then the last
                    // settings objects will prevail.  We also cannot use merge, cause it loses
                    // functions
                    assignIn(finalObj.properties, catObj.properties);
                    objects[objectName] = finalObj;
                }
            });
        }
    }
    return objects;
}

/**
 * Builds a single capabilities object for the given setting
 */
function buildCapabilitiesObject(setting: ISetting) {
    "use strict";
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    let { category, displayName, defaultValue, config, description, persist } = setting.descriptor;
    const defaultCategory = "General";//ldget(setting, "parentSetting.descriptor.category", "General");
    if (persist !== false) {
        const catObj = {
            objectName: objName,
            displayName: category || defaultCategory,
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
 */
export function toJSON<T>(settingsClass: ISettingsClass<T>, instance: any) {
    "use strict";
    return JSON.parse(stringify(instance));
}

/**
 * Gets the settings metadata from the given object
 */
function getSettingsMetadata(obj: ISettingsClass<any>|any): { [key: string]: ISetting } {
    "use strict";
    let metadata: any;
    if (obj) {
        metadata = ldget(obj, `${METADATA_KEY}.settings`);
        if (!metadata && obj.constructor) {
            metadata = ldget(obj.constructor, `${METADATA_KEY}.settings`);
        }
    }
    return metadata;
}

/**
 * Gets the settings metadata from the given object
 */
export function getSetting(obj: any, key: string): ISettingDescriptor<any> {
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
    let { propertyName, descriptor: { name, category } } = setting;
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
    const { compose } = descriptor;
    const enumerate = shouldEnumerate(settingsObj, descriptor, dataView);
    const persist = shouldPersist(descriptor);
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
    const { descriptor, descriptor: { defaultValue, parse, min, max } } = setting;
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    let value = ldget(objects, `${objName}.${propName}`);
    value = parse ? parse(value, descriptor, dv, setting) : value;
    if (typeof value === "undefined") {
        value = defaultValue;
    }
    if (typeof min !== "undefined") {
        value = Math.max(min, value);
    }
    if (typeof max !== "undefined") {
        value = Math.min(max, value);
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
function shouldEnumerate(settingsObj: any, descriptor: ISettingDescriptor<any>, dataView: powerbi.DataView) {
    "use strict";
    const { hidden, enumerable } = descriptor;
    if (typeof enumerable !== "undefined") {
        return !!(typeof enumerable === "function" ? enumerable(settingsObj, dataView) : enumerable);
    }
    return !(typeof hidden === "function" ? hidden(settingsObj, dataView) : hidden);
}

/**
 * Determines if the given setting should be persisted
 */
function shouldPersist(descriptor: ISettingDescriptor<any>)  {
    "use strict";
    return descriptor.persist;
}

/**
 * Composes an object instance with the given values
 */
export function composeInstance(setting: ISetting, selector?: powerbi.data.Selector, displayName?: string, value?: any) {
    "use strict";
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    return {
        objectName: objName,
        selector: selector,
        displayName: displayName,
        properties: {
            [propName]: value,
        },
    };
}

/**
 * Gets all of the objects for the given column, if an id is specified, it looks for the specific instance with the given id
 */
export function getObjectsForColumn(column: powerbi.DataViewMetadataColumn, setting: ISetting, id?: string) {
    "use strict";
    const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
    const columnObjects = ldget(column, `objects.${objName}`);
    if (id) {
        return ldget(columnObjects, `$instances.${id}.${propName}`);
    } else {
        return ldget(columnObjects, `${propName}`);
    }
}

/**
 * Creates a selector for PBI that is for a specific column, and an optional unique user defined id
 * Having an id allows for storing multiple instances of objects under a single objectName/propertyName in VisualObjectInstancesToPersist
 */
export function createObjectSelectorForColumn(column: powerbi.DataViewMetadataColumn, id?: string): powerbi.data.Selector {
    "use strict";
    return {
        metadata: column.queryName,
        id: id,
    };
}
