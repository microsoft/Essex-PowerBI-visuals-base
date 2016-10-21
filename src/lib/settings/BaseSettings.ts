import {
    fromJSON,
    toJSON,
    buildCapabilitiesObjects,
    buildPersistObjects,
    buildEnumerationObjects,
    parseSettingsFromPBI,
} from "./helpers";

/**
 * A simple class with methods to handle the basic settings manipulation
 */
export class BaseSettings {

    /**
     * Rehydrates this settings class from the given object
     */
    public static fromJSON<T extends BaseSettings>(obj: any): T {
        return fromJSON<any>(this, obj);
    }

    /**
     * Builds the capability objects for this settings class
     */
    public static fromPBI<T extends BaseSettings>(dv: powerbi.DataView): T {
        return parseSettingsFromPBI(this, dv) as T;
    }

    /**
     * Builds the capability objects for this settings class
     */
    public static buildCapabilitiesObjects() {
        return buildCapabilitiesObjects(this);
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
     * Rehydrates this settings class from the given object
     */
    public toJSONObject() { // Important that this is not called "toJSON" otherwise infinite loops
        return toJSON(this.constructor as any, this);
    }
}
