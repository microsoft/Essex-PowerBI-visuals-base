/**
 * A simple class with utility methods to facilitate settings parsing.
 */
export declare class HasSettings {
    /**
     * Creates a new instance of this class
     * @param props A set of additional properties to mixin to this settings class
     */
    static create<T extends HasSettings>(props?: any): T;
    /**
     * Creates a new instance of this class with the data from powerbi and the additional properties.
     * @param dv The dataview to create the settings from
     * @param additionalProps The additional set of properties to mixin to this settings class
     */
    static createFromPBI<T extends HasSettings>(dv?: powerbi.DataView, additionalProps?: any): T;
    /**
     * Builds the capability objects for this settings class
     */
    static buildCapabilitiesObjects(): any;
    /**
     * Receives the given object and returns a new state with the object overlayed with the this set of settings
     * @param props The properties to mixin to the resulting class
     */
    receive(props?: any): this;
    /**
     * Receives the given pbi settings and returns a new state with the new pbi settings overlayed with the this state
     * @param dv The dataView to receive
     */
    receiveFromPBI(dv?: powerbi.DataView): this;
    /**
     * Builds the enumeration objects
     * @param objectName The objectName being requested from enumerateObjectInstances
     * @param dataView The currently loaded dataView
     * @param includeHidden If true, 'hidden' settings will be returned
     */
    buildEnumerationObjects(objectName: string, dataView: powerbi.DataView, includeHidden?: boolean): powerbi.VisualObjectInstance[];
    /**
     * Builds a set of persistance objects to be persisted from the current set of settings.
     * @param dataView The currently loaded dataView
     * @param includeHidden If true, 'hidden' settings will be returned
     */
    buildPersistObjects(dataView: powerbi.DataView, includeHidden?: boolean): powerbi.VisualObjectInstancesToPersist;
    /**
     * Converts this class into a json object.
     */
    toJSONObject(): any;
}
