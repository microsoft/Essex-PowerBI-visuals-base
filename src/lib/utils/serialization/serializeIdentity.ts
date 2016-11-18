import "powerbi-visuals/lib/powerbi-visuals";
import { ISerializedIdentity } from "../interfaces";
import { serializeExpr } from "./serializeExpr";

/**
 * Serializes the given identity object
 */
export function serializeIdentity(identity: powerbi.DataViewScopeIdentity|ISerializedIdentity): ISerializedIdentity {
    "use strict";
    const se = <ISerializedIdentity>identity;
    // If it is not undefined, and it isn't already serialized
    if (se && !se.serializedIdentity) {
        return {
            serializedIdentity: {
                expr: serializeExpr((<any>identity).expr),
            },
        };
    }
    return se;
}
