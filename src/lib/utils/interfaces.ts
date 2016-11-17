import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Represents an object that can build persistence objects
 */
export interface IPersistObjectBuilder {

    /**
     * Persists the given value into PBI
     */
    persist(
        objectName: string,
        property: string,
        value: any,
        operation?: string,
        selector?: any,
        displayName?: string,
        asOwnInstance?: boolean): void;

    /**
     * Merges another set of persist objects into this builder
     */
    mergePersistObjects(objects: powerbi.VisualObjectInstancesToPersist): void;

    /**
     * Builds the final persist object
     */
    build(): powerbi.VisualObjectInstancesToPersist;
}

export interface PBIServices  {
    SemanticQuerySerializer: {
        serializeExpr(expr: powerbi.data.SQExpr): ISerializedExpr;
        deserializeExpr(expr: ISerializedExpr): powerbi.data.SQExpr;
    };
}

export interface ISerializedExpr {
    serializedExpr: any;
};
