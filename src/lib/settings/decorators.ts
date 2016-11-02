import { setting } from "./settingDecorator";
import { ISettingDescriptor, IDefaultInstanceColor, IDefaultColor } from "./interfaces";
import { colorParser, colorCategoricalInstanceObjectParser } from "./parsers";
import { coloredObjectInstanceComposer, colorComposer } from "./composers";

/**
 * Defines a text setting to be used with powerBI
 */
export function textSetting(config?: ISettingDescriptor) {
    "use strict";
    return typedSetting({ text: {} }, config);
}

/**
 * Defines a bool setting to be used with powerBI
 */
export function boolSetting(config?: ISettingDescriptor) {
    "use strict";
    return typedSetting({ bool: true }, config);
}

/**
 * Defines a number setting to be used with powerBI
 */
export function numberSetting(config?: ISettingDescriptor) {
    "use strict";
    return typedSetting({ numeric: true }, config);
}

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

/**
 * A setting that has a type associated with it
 */
function typedSetting(type: any, config?: ISettingDescriptor) {
    "use strict";
    config = _.merge({}, {
        config: {
            type: type,
        },
    }, config);
    return setting(config);
}

export interface IColorSettingDescriptor extends ISettingDescriptor {
    defaultValue?: IDefaultColor;
}

export interface IColorInstanceSettingDescriptor extends ISettingDescriptor {
    defaultValue?: IDefaultInstanceColor;
}
