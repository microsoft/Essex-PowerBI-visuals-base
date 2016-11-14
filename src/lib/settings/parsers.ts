import { ISettingsParser, IDefaultInstanceColor, IDefaultValue, IDefaultColor, ISettingDescriptor, ISetting } from "./interfaces"; // tslint:disable-line
import get from "../utils/typesafeGet";
import { getPBIObjectNameAndPropertyName } from "./helpers";
const ldget = require("lodash/get"); // tslint:disable-line

/**
 * A parser which parses colors for each instance in a categorical dataset
 */
export function colorCategoricalInstanceObjectParser<T>(defaultColor: IDefaultInstanceColor = "#ccc") {
    "use strict";
    return coloredInstanceObjectParser<T>(defaultColor, (dv: powerbi.DataView) => {
        const values = get(dv, (v) => v.categorical.values, []);
        return (values && values.grouped && values.grouped()) || [];
    });
}

/**
 * A basic color object parser which parses colors per some instance, using the valuesGetter
 */
export function coloredInstanceObjectParser<T>(
    defaultColor: IDefaultInstanceColor = "#ccc",
    valuesGetter: (dv: powerbi.DataView) => {
        objects?: any,
        name?: any,
        identity?: any,
    }[]) {
    "use strict";
    return ((val, desc, dataView, setting) => {
        const values = valuesGetter(dataView);
        const { objName, propName } = getPBIObjectNameAndPropertyName(setting);
        if (values && values.forEach) {
            return values.map((n, i) => {
                const objs = n.objects;
                const obj = objs && objs[objName];
                const prop = obj && obj[propName];
                const defaultValColor = typeof defaultColor === "function" ? defaultColor(i) : defaultColor;
                return {
                    name: n.name,
                    color: get<any, string>(prop, (o: any) => o.solid.color, defaultValColor),
                    identity: n.identity,
                };
            });
        }
    }) as ISettingsParser<T, { name: string; color: string; identity: any }[]>;
}

/**
 * Provides a basic parser for PBI settings
 */
export function basicParser<T, J>(path: string, defaultValue?: IDefaultValue<any>) {
    "use strict";
    return ((val) => {
        let result = ldget(val, path);
        if ((typeof result === "undefined" || result === null) && defaultValue) { // tslint:disable-line
            result = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        }
        return result;
    }) as ISettingsParser<T, J>;
}

/**
 * Provides a basic parser for PBI settings
 */
export function colorParser<T>(defaultColor?: IDefaultColor) {
    "use strict";
    return basicParser<T, string>("solid.color", defaultColor);
}

