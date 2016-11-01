import "powerbi-visuals/lib/powerbi-visuals";

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
    descriptor: ISettingDescriptor;
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
export interface ISettingDescriptor extends INumericalSettingDescriptor {

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
    hidden?: boolean | IHiddenFn;

    /**
     * If enumerable is false, then it will not show up in the formatting pane
     * @default true
     */
    enumerable?: boolean | IHiddenFn;

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
    parse?: ISettingsParser; // Controls how the value is parsed from pbi

    /**
     * A helper to convert the setting value into a powerbi value
     */
    compose?: ISettingsComposer<any>;
}

/**
 * Represents a settings parser
 */
export type ISettingsParser = (
    /**
     * The PowerBI version of the value
     */
    pbiValue: any,

    /**
     * The descriptor that is requesting the value
     */
    descriptor?: ISettingDescriptor,

    /**
     * The options used for parsing
     */
    dataView?: powerbi.DataView,

    /**
     * The setting for this parser
     */
    setting?: ISetting) => any;

/**
 * Represents a settings composer
 */
export type ISettingsComposer<T> = (
        value: T,
        descriptor?: ISettingDescriptor,
        dataView?: powerbi.DataView,
        setting?: ISetting) => IComposeResult;

/**
 * Represents a compose call result
 */
export type IComposeResult = powerbi.VisualObjectInstance|powerbi.VisualObjectInstance[]|any;

/**
 * Represents a hidden function
 */
export interface IHiddenFn {
    (settingObj: any, dataView?: powerbi.DataView): boolean;
}

/**
 * Represents a class that is a settings class
 */
export interface ISettingsClass<T> {
    new (): T;
}

export type IDefaultValue<T> = T|(() => T);

export type IDefaultInstanceValue<T> = ((idx: number, dataView?: powerbi.DataView, identity?: powerbi.DataViewScopeIdentity) => T);

export type IDefaultInstanceColor = string|IDefaultInstanceValue<string>;

export type IDefaultColor = string|IDefaultValue<string>;
