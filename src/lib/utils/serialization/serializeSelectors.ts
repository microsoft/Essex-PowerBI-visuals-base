import "powerbi-visuals/lib/powerbi-visuals";
import { serializeExpr } from "./serializeExpr";

/**
 * Serializes a list of selectors, will ONLY work with selectors that are DataViewScopeIdentity
 */
export function serializeSelectors(selectors: powerbi.data.Selector[]): any[] {
    "use strict";
    return (selectors || []).map(n => {
        return {
            id: n.id,
            metadata: n.metadata,
            data: n.data.map((data: any) => {
                const expr: powerbi.data.SQExpr = data["expr"] || data["_expr"];
                if (expr) {
                    return serializeExpr(expr);
                } else {
                    throw new Error(`serializeSelectors requires a selector built from a DataViewScopeIdentity`);
                }
            }),
        };
    });
}
