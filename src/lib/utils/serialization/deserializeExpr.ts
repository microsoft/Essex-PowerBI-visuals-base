import "powerbi-visuals/lib/powerbi-visuals";
import { PBIServices, ISerializedExpr } from "../interfaces";

/**
 * Deserializes the given expression
 */
export function deserializeExpr(expr: ISerializedExpr): powerbi.data.SQExpr {
    "use strict";
    if (expr) {
        const serializedExpr = expr.serializedExpr;
        if (serializedExpr) {
            return (powerbi.data["services"] as PBIServices).SemanticQuerySerializer.deserializeExpr(serializedExpr);
        } else {
            throw new Error("Not a valid serialized expression");
        }
    }
}
