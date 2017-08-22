import { ISettingDescriptor, IDefaultInstanceColor, IDefaultColor } from "./interfaces";
/**
 * Defines a text setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function textSetting<T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a bool setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function boolSetting<T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a number setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function numberSetting<T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a JSON setting to be used with PowerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function jsonSetting<J, T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a selection setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function selectionSetting<J, T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function colorSetting<T>(config?: IColorSettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a setting to be used with powerBI
 * @param config The additional configuration to control how a setting operates
 */
export declare function instanceColorSetting<T>(config?: IColorInstanceSettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a setting that is an enumeration
 * @param enumType The enumeration to create a setting for
 * @param config The additional configuration to control how a setting operates
 */
export declare function enumSetting<T>(enumType: any, config?: ISettingDescriptor<T>): (target: any, key: string) => any;
export interface IColorSettingDescriptor<T> extends ISettingDescriptor<T> {
    defaultValue?: IDefaultColor;
}
export interface IColorInstanceSettingDescriptor<T> extends ISettingDescriptor<T> {
    defaultValue?: IDefaultInstanceColor;
}
