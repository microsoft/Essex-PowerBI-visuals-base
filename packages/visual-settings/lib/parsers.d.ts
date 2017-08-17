import { ISettingsParser, IDefaultInstanceColor, IDefaultValue, IDefaultColor } from "./interfaces";
/**
 * A parser which parses colors for each instance in a categorical dataset
 * @param defaultColor The color to use if an instance doesn't have a color
 */
export declare function colorCategoricalInstanceObjectParser<T>(defaultColor?: IDefaultInstanceColor): ISettingsParser<T, {
    name: string;
    color: string;
    identity: any;
}[]>;
/**
 * A basic color object parser which parses colors per some instance, using the instancesGetter
 * @param defaultColor The color to use if an instance doesn't have a color
 * @param instancesGetter A getter function which returns the set of instances to iterate
 */
export declare function coloredInstanceObjectParser<T>(defaultColor: IDefaultInstanceColor, instancesGetter: (dv: powerbi.DataView) => {
    objects?: any;
    name?: any;
    identity?: any;
}[]): ISettingsParser<T, {
    name: string;
    color: string;
    identity: any;
}[]>;
/**
 * Provides a basic parser for PBI settings
 * @param path The path within the pbi object to look for the value
 * @param defaultValue The default value to use if PBI doesn't have a value
 */
export declare function basicParser<T, J>(path: string, defaultValue?: IDefaultValue<any>): ISettingsParser<T, J>;
/**
 * Provides a color parser for PBI settings
 * @param defaultColor The default color to use if PBI doesn't have a value
 */
export declare function colorParser<T>(defaultColor?: IDefaultColor): ISettingsParser<T, string>;
