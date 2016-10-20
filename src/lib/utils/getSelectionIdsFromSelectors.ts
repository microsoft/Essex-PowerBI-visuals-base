import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Returns a list of selection ids from a list of selectors
 */
export default function getSelectionIdsFromSelectors(selectors: powerbi.data.Selector[]) {
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
    const firstItem = n.data[0] as powerbi.DataViewScopeIdentity;
    const compareExpr = (firstItem.expr || firstItem["_expr"]) as powerbi.data.SQCompareExpr;
    const left = compareExpr.left as powerbi.data.SQColumnRefExpr;
    const leftEntity = left.source as powerbi.data.SQEntityExpr;
    const right = compareExpr.right as powerbi.data.SQConstantExpr;

    // Create the OO version
    const valueType = new powerbi.ValueType(right.type["underlyingType"], right.type["category"]);
    const newRight = new powerbi.data.SQConstantExpr(valueType, right.value, right.valueEncoded);
    const newLeftEntity = new powerbi.data.SQEntityExpr(leftEntity.schema, leftEntity.entity, leftEntity.variable);
    const newLeft = new powerbi.data.SQColumnRefExpr(newLeftEntity, left.ref);
    const newCompare = new powerbi.data.SQCompareExpr(compareExpr.comparison, newLeft, newRight);
    return newCompare;
}
