import { setting } from "./settingDecorator";
import { ISettingDescriptor, IDefaultInstanceColor, IDefaultColor } from "./interfaces";
import { colorParser, colorCategoricalInstanceObjectParser } from "./parsers";
import { coloredObjectInstanceComposer, colorComposer } from "./composers";

/**
 * Defines a setting to be used with powerBI
 */
export function colorSetting(config?: IColorSettingDescriptor) {
    "use strict";
    config = _.merge({}, {
        category: "Data Point",
        config: {
            type: powerbi.visuals.StandardObjectProperties.fill.type,
        },
        compose: colorComposer(config ? config.defaultValue : "#ccc"),
        parse: colorParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return setting(config);
}

/**
 * Defines a setting to be used with powerBI
 */
export function instanceColorSetting(config?: IColorInstanceSettingDescriptor, categorical?: boolean) {
    "use strict";
    config = _.merge({}, {
        category: "Data Point",
        config: {
            type: powerbi.visuals.StandardObjectProperties.fill.type,
        },
        compose: coloredObjectInstanceComposer(config ? config.defaultValue : "#ccc"),
        parse: colorCategoricalInstanceObjectParser(config ? config.defaultValue : "#ccc"),
    }, config);
    return setting(config);
}

export interface IColorSettingDescriptor extends ISettingDescriptor {
    defaultValue?: IDefaultColor;
}

export interface IColorInstanceSettingDescriptor extends ISettingDescriptor {
    defaultValue?: IDefaultInstanceColor;
}
