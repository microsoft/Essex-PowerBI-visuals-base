import { ISetting, ISettingDescriptor, ISettingsClass } from "./interfaces";
export declare const METADATA_KEY = "__settings__";
/**
 * Parses settings from powerbi dataview objects
 * @param settingsClass The class type of the class with the settings
 * @param dv The dataview to construct the settings from
 * @param props Any additional properties to merge into the settings object
 * @param propsHavePrecedence If true, the additional properties passed in should override any that are retrieved from PBI
 * @param coerceNullAsUndefined If true, the props that are 'null' will get converted to `undefined`
 */
export declare function parseSettingsFromPBI<T>(settingClass: ISettingsClass<T>, dv?: powerbi.DataView, props?: {}, propsHavePrecedence?: boolean, coerceNullAsUndefined?: boolean): T;
/**
 * Builds a set of persistance objects to be persisted from the current set of settings.  Can be used with IVisualHost.persistProperties
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export declare function buildPersistObjects<T>(settingsClass: ISettingsClass<T>, settingsObj: T, dataView: powerbi.DataView, includeHidden?: boolean): powerbi.VisualObjectInstancesToPersist;
/**
 * Builds the enumeration objects for the given settings object
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param objectName The objectName being requested from enumerateObjectInstances
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export declare function buildEnumerationObjects<T>(settingsClass: ISettingsClass<T>, settingsObj: T, objectName: string, dataView: powerbi.DataView, includeHidden?: boolean): powerbi.VisualObjectInstance[];
/**
 * Builds the capabilities objects dynamically from a settings class
 * @param settingsClass The settings class type to generate the capabilities object from
 */
export declare function buildCapabilitiesObjects<T>(settingsClass: ISettingsClass<T>): any;
/**
 * Converts the given settings object into a JSON object
 * @param settingsClass The settings class type to generate the JSON object for
 * @param instance The instance of settingsClass to get the values from
 */
export declare function toJSON<T>(settingsClass: ISettingsClass<T>, instance: any): any;
/**
 * Gets the settings metadata from the given object
 * @param obj The object to get the setting from
 * @param key The name of the setting
 */
export declare function getSetting(obj: any, key: string): ISettingDescriptor<any>;
/**
 * Gets the appropriate object name and property name for powerbi from the given setting
 * @param setting The setting to get the powerbi objectName and property name for.
 */
export declare function getPBIObjectNameAndPropertyName(setting: ISetting): {
    objName: string;
    propName: string;
};
/**
 * Converts the value of the given setting on the object to a powerbi compatible value
 * @param settingsObj The instance of a settings object
 * @param setting The setting to get the value for
 * @param dataView The dataView to pass to the setting
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export declare function convertValueToPBI(settingsObj: any, setting: ISetting, dataView: powerbi.DataView, includeHidden?: boolean): {
    adaptedValue: any;
};
/**
 * Converts the value for the given setting in PBI to a regular setting value
 * @param setting The setting to get the value for
 * @param dv The dataView to pass to the setting
 */
export declare function convertValueFromPBI(setting: ISetting, dv: powerbi.DataView): {
    adaptedValue: any;
};
/**
 * Composes an object instance with the given values
 */
export declare function composeInstance(setting: ISetting, selector?: powerbi.data.Selector, displayName?: string, value?: any): {
    objectName: string;
    selector: powerbi.data.Selector;
    displayName: string;
    properties: {
        [x: string]: any;
    };
};
/**
 * Gets all of the objects for the given column, if an id is specified, it looks for the specific instance with the given id
 */
export declare function getObjectsForColumn(column: powerbi.DataViewMetadataColumn, setting: ISetting, id?: string): any;
/**
 * Creates a selector for PBI that is for a specific column, and an optional unique user defined id
 * Having an id allows for storing multiple instances of objects under a single objectName/propertyName in VisualObjectInstancesToPersist
 */
export declare function createObjectSelectorForColumn(column: powerbi.DataViewMetadataColumn, id?: string): powerbi.data.Selector;
