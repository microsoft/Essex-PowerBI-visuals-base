import "powerbi-visuals/lib/powerbi-visuals";
import { ISerializedIdentity } from "../interfaces";
import { deserializeExpr } from "./deserializeExpr";

/**
 * Serializes the given identity object
 */
export function deserializeIdentity(identity: powerbi.DataViewScopeIdentity|ISerializedIdentity): powerbi.DataViewScopeIdentity {
    "use strict";
    if (identity) {
        const serializedIdentity = (<ISerializedIdentity>identity).serializedIdentity;
        if (serializedIdentity) {
            const deserializedExpr = deserializeExpr(serializedIdentity.expr);
            return powerbi.data.createDataViewScopeIdentity(deserializedExpr);
        }
    }
    return <powerbi.DataViewScopeIdentity>identity;
}
