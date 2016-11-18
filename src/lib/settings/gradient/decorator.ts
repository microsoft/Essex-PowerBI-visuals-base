import { ISettingDescriptor } from "../interfaces";
import { settings } from "../settingDecorator";
import { GradientSettings } from "./GradientSettings";

/**
 * A setting for a gradient
 */
export function gradientSetting<T>(config?: ISettingDescriptor<T>) {
    "use strict";
    return settings<T>(GradientSettings, config);
}
