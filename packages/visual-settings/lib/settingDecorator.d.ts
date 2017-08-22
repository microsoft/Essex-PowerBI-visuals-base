/**
 * The key used to store settings metadata on the settings class
 */
import { ISetting, ISettingDescriptor, ISettingsClass } from "./interfaces";
/**
 * Defines a setting to be used with powerBI
 * @param config The configuration used to control how a setting operates
 */
export declare function setting<T>(config: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines a setting that has a set of nested child settings
 * @param config The child setting class type
 * @param descriptor The additional set of configuration settings to control how a setting operates
 */
export declare function settings<T>(config: Function, descriptor?: ISettingDescriptor<T>): (target: any, key: string) => any;
/**
 * Defines the given setting on the given class
 * @param target The target to define the metadata on
 * @param propName The name of the metadata to add
 * @param value The value of the metadata to add.
 */
export declare function defineSetting<T>(target: ISettingsClass<T>, propName: string, value: ISetting): void;
