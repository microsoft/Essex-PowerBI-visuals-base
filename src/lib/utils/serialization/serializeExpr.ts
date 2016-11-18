import { ISerializedExpr, PBIServices } from "../interfaces";

/**
 * Serializes the given expression
 */
export function serializeExpr(expr: powerbi.data.SQExpr): ISerializedExpr {
    "use strict";
    return {
        serializedExpr: (powerbi.data["services"] as PBIServices).SemanticQuerySerializer.serializeExpr(expr),
    };
}
