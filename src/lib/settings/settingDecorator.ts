/**
 * The key used to store settings metadata on the settings class
 */
import "powerbi-visuals/lib/powerbi-visuals";

import { ISetting, ISettingDescriptor } from "./interfaces";
import { METADATA_KEY } from "./helpers";

/**
 * Defines a setting to be used with powerBI
 */
export function setting(config: ISettingDescriptor) {
    "use strict";
    return function (target: any, key: string) {
        target.constructor[METADATA_KEY] = target.constructor[METADATA_KEY] || {};
        let setting = {
            propertyName: key,
            descriptor: config,
        } as ISetting;
        if (Object.freeze) {
            setting = Object.freeze(setting);
        }
        target.constructor[METADATA_KEY][key] = setting;
        Object.defineProperty(target, key, {
            writable: true,
            enumerable: true,
        });
        return target;
    };
}
