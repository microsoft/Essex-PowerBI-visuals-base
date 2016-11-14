import "powerbi-visuals/lib/powerbi-visuals";
import { IPersistObjectBuilder } from "../utils/interfaces";

/**
 * Represents a setting
 */
export interface ISetting {
    /**
     * The property name within the class that this setting is for
     */
    propertyName: string;

    /**
     * The setting descriptor
     */
    descriptor: ISettingDescriptor<any>;

    /**
     * The owner of this setting
     */
    classType: ISettingsClass<any>;

    /**
     * The parent setting
     */
    parentSetting?: ISetting;

    /**
     * Is a child settings object
     */
    isChildSettings?: boolean;

    /**
     * The child settings constructor
     */
    childClassType?: ISettingsClass<any>;
}

/**
 * Represents a setting descriptor that has a numerical value
 */
export interface INumericalSettingDescriptor {
    /**
     * The minimum value for this setting
     */
    min?: number;

    /**
     * The maximum value for this setting
     */
    max?: number;
}

/**
 * The setting descriptor
 */
export interface ISettingDescriptor<T> extends INumericalSettingDescriptor {

    /**
     * The display name of the setting
     */
    displayName?: string;

    /**
     * The settings description
     */
    description?: string;

    /**
     * The category of the setting
     * @default "General"
     */
    category?: string;

    /**
     * The default value for this setting
     */
    defaultValue?: any;

    /**
     * If hidden, the setting will not show up in powerbi's formatting pane
     * @default false
     * @deprecated
     */
    hidden?: boolean | IHiddenFn<T>;

    /**
     * If enumerable is false, then it will not show up in the formatting pane
     * @default true
     */
    enumerable?: boolean | IHiddenFn<T>;

    /**
     * Whether or not this setting should be persisted to powerbi
     * @default true
     */
    persist?: boolean;

    /**
     * Additional configuration options
     */
    config?: powerbi.data.DataViewObjectPropertyDescriptor;

    /**
     * The name of the setting
     */
    name?: string;

    /**
     * A helper to parse the powerbi value into a setting value
     */
    parse?: ISettingsParser<T, any>; // Controls how the value is parsed from pbi

    /**
     * A helper to convert the setting value into a powerbi value
     */
    compose?: ISettingsComposer<any>;
}

/**
 * Represents a settings parser
 */
export type ISettingsParser<T, J> = (

    /**
     * The PowerBI version of the value
     */
    pbiValue: any,

    /**
     * The descriptor that is requesting the value
     */
    descriptor?: ISettingDescriptor<T>,

    /**
     * The options used for parsing
     */
    dataView?: powerbi.DataView,

    /**
     * The setting for this parser
     */
    setting?: ISetting) => J;

/**
 * Represents a settings composer
 */
export type ISettingsComposer<T> = (
        value: T,
        descriptor?: ISettingDescriptor<T>,
        dataView?: powerbi.DataView,
        setting?: ISetting,
        builder?: IPersistObjectBuilder) => IComposeResult;

/**
 * Represents a compose call result
 */
export type IComposeResult = powerbi.VisualObjectInstance|powerbi.VisualObjectInstance[]|any;

/**
 * Represents a hidden function
 */
export interface IHiddenFn<T> {
    (settingObj: T, dataView?: powerbi.DataView): boolean;
}

/**
 * Represents a class that is a settings class
 */
export interface ISettingsClass<T> {
    new (): T;
    constructor: Function;
}

export type IDefaultValue<T> = T|(() => T);

export type IDefaultInstanceValue<T> = ((idx: number, dataView?: powerbi.DataView, identity?: powerbi.DataViewScopeIdentity) => T);

export type IDefaultInstanceColor = string|IDefaultInstanceValue<string>;

export type IDefaultColor = string|IDefaultValue<string>;
