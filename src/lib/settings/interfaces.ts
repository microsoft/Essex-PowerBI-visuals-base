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
 * The setting descriptor
 */
export interface ISettingDescriptor {

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
     */
    hidden?: boolean | IHiddenFn;

    /**
     * Whether or not this setting should be persisted to powerbi
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
    parse?: (
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
        dataView?: powerbi.DataView) => any; // Controls how the value is parsed from pbi

    /**
     * A helper to convert the setting value into a powerbi value
     */
    compose?: (value: any, descriptor?: ISettingDescriptor) => any; // Controls how the value is returned to pbi
}

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
