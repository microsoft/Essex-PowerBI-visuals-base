import {
    toJSON,
    buildCapabilitiesObjects,
    buildPersistObjects,
    buildEnumerationObjects,
    parseSettingsFromPBI,
} from "./helpers";
const assignIn = require("lodash/assignIn"); // tslint:disable-line

/**
 * A simple class with methods to handle the basic settings manipulation
 */
export class HasSettings {

    /**
     * Creates a new instance of this class
     */
    public static create(initialProps?: any) {
        return HasSettings.createFromPBI(undefined, initialProps);
    }

    /**
     * Builds the capability objects for this settings class
     */
    public static createFromPBI<T extends HasSettings>(dv?: powerbi.DataView, additionalProps?: any): T {
        return parseSettingsFromPBI(this, dv, additionalProps) as T;
    }

    /**
     * Builds the capability objects for this settings class
     */
    public static buildCapabilitiesObjects() {
        return buildCapabilitiesObjects(this);
    }

    /**
     * Recieves the given object and returns a new state with the object overlayed with the this set of settings
     */
    public receive(newProps?: any) {
        return HasSettings.create(assignIn(this.toJSONObject(), newProps)) as this;
    }

    /**
     * Recieves the given pbi settings and returns a new state with the new pbi settings overlayed with the this state
     */
    public receiveFromPBI(dv?: powerbi.DataView) {
        return parseSettingsFromPBI(this.constructor as any, dv, this.toJSONObject()) as this;
    }

    /**
     * Builds the persist objects
     */
    public buildEnumerationObjects(objectName: string, dataView: powerbi.DataView, includeHidden = false) {
        return buildEnumerationObjects(this.constructor as any, this, objectName, dataView, includeHidden);
    }

    /**
     * Builds the persist objects
     */
    public buildPersistObjects(dataView: powerbi.DataView, includeHidden = false) {
        return buildPersistObjects(this.constructor as any, this, dataView, includeHidden);
    }

    /**
     * Converts this class into a json object.
     */
    public toJSONObject() { // Important that this is not called "toJSON" otherwise infinite loops
        return toJSON(this.constructor as any, this);
    }
}
