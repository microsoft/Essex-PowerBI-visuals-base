import { ISettingsComposer, IDefaultInstanceColor, IDefaultValue, IDefaultColor } from "./interfaces";
/**
 * Creates a composer which composes IColoredObjects into PBI
 * @param defaultColor The default color to use if a color instance is not found
 */
export declare function coloredObjectInstanceComposer(defaultColor?: IDefaultInstanceColor): ISettingsComposer<any>;
/**
 * Creates a basic composer which takes a path and a default value, and returns the powerbi value or the default value
 * @param path The path in the object to return
 * @param defaultValue The default value to return if the powerbi value is undefined
 */
export declare function basicObjectComposer(path?: string, defaultValue?: IDefaultValue<any>): ISettingsComposer<any>;
/**
 * Provides a basic color composer
 * @param defaultColor The default color to use if the powerbi value is undefined.
 */
export declare function colorComposer(defaultColor?: IDefaultColor): ISettingsComposer<string>;
