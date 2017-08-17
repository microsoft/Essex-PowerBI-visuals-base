import { ISettingDescriptor } from "../interfaces";
/**
 * A decorator for colored objects.
 */
export declare function coloredObjectsSettings<T>(config?: ISettingDescriptor<T>): (target: any, key: string) => any;
