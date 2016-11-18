import "powerbi-visuals/lib/powerbi-visuals";
import { ISerializedExpr } from "./interfaces";
import { deserializeExpr } from "./serialization";

/**
 * Returns a list of selection ids from a list of selectors
 */
export function getSelectionIdsFromSelectors(selectors: powerbi.data.Selector[]) {
    "use strict";
    return (selectors || []).map(n => {
        const newCompare = buildSQExprFromSerializedSelection(n);
        return powerbi.visuals.SelectionId.createWithId(powerbi.data.createDataViewScopeIdentity(newCompare));
    });
}

/**
 * Builds a SQExpr from a serialized version of a selected item
 */
function buildSQExprFromSerializedSelection(n: powerbi.data.Selector) {
    "use strict";
    const firstItem = n.data[0] as any;
    if (firstItem) {
        const compareExpr = (firstItem.expr || firstItem["_expr"]) as powerbi.data.SQCompareExpr;

        // If it is a "serialized expr", then deserialize it
        if ((<ISerializedExpr>firstItem).serializedExpr) {
            return deserializeExpr(<any>firstItem);

        // We only need to parse the compare expr if it is a POJO, otherwise it should already be a PBI object
        } else if (compareExpr && ((!compareExpr.constructor || compareExpr.constructor === Object))) {
            const left = compareExpr.left as powerbi.data.SQColumnRefExpr;
            const leftEntity = left.source as powerbi.data.SQEntityExpr;
            const right = compareExpr.right as powerbi.data.SQConstantExpr;
            if (right.type) {
                // Create the OO version
                const valueType = new powerbi.ValueType(right.type["underlyingType"], right.type["category"]);
                const newRight = new powerbi.data.SQConstantExpr(valueType, right.value, right.valueEncoded);
                const newLeftEntity = new powerbi.data.SQEntityExpr(leftEntity.schema, leftEntity.entity, leftEntity.variable);
                const newLeft = new powerbi.data.SQColumnRefExpr(newLeftEntity, left.ref);
                const newCompare = new powerbi.data.SQCompareExpr(compareExpr.comparison, newLeft, newRight);
                return newCompare;
            }
        }
        return compareExpr;
    }
}
