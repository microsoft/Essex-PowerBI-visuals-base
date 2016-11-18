import { ISettingsComposer, IDefaultInstanceColor, IDefaultValue, IDefaultColor } from "./interfaces";
import { HasIdentity } from "../utils/interfaces";
import { getPBIObjectNameAndPropertyName } from "./helpers";
const ldset = require("lodash/set"); //tslint:disable-line

/**
 * Creates a composer which composes IColoredObjects into PBI instances
 */
export function coloredObjectInstanceComposer(defaultColor: IDefaultInstanceColor = "#ccc") {
    "use strict";
    return ((val, desc, dv, setting) => {
        if (val) {
            const { propName } = getPBIObjectNameAndPropertyName(setting);
            return (((<any>val).forEach ? val : [val]) as IColoredObject[]).map((n, i) => {
                const instanceColor = typeof defaultColor === "function" ? defaultColor(i, dv, n.identity) : defaultColor;
                return {
                    displayName: n.name,
                    selector: n.identity ? powerbi.visuals.ColorHelper.normalizeSelector(
                        powerbi.visuals.SelectionId.createWithId(n.identity).getSelector(), // Not sure if all of this is necessary
                    false) : undefined,
                    properties: {
                        [propName]: {
                            solid: { color: n.color || instanceColor },
                        },
                    },
                };
            });
        }
    }) as ISettingsComposer<IColoredObject[]|IColoredObject>;
}

/**
 * Creates a composer which composes IColoredObjects into PBI instances
 */
export function basicObjectComposer(path?: string, defaultValue?: IDefaultValue<any>) {
    "use strict";
    return ((val, desc, dv, setting) => {
        defaultValue = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        if (val) {
            if (path) {
                const obj = { };
                ldset(obj, path, val || defaultValue);
                return obj;
            }
            return val || defaultValue;
        }
    }) as ISettingsComposer<any>;
}

/**
 * Provides a basic color composer
 */
export function colorComposer(defaultColor: IDefaultColor = "#ccc") {
    "use strict";
    return basicObjectComposer(undefined, defaultColor) as ISettingsComposer<string>;
}

/**
 * Represents an object that that has both a color and an identity.
 */
export interface IColoredObject extends HasIdentity {
    /**
     * The name of the colored object
     */
    name: string;

    /**
     * The color of the object
     */
    color: string;
}
