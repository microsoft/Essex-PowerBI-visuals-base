import { ISettingDescriptor } from "../interfaces";
/**
 * A setting for a gradient
 */
export declare function gradientSetting<T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
