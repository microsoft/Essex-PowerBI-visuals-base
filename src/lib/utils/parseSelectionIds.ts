import "powerbi-visuals/lib/powerbi-visuals";
import getSelectionIdsFromSelectors from "./getSelectionIdsFromSelectors";
import SelectionId = powerbi.visuals.SelectionId;
const ldget = require("lodash/get"); // tslint:disable-line

/**
 * Parses the list of selection ids from PBI
 */
export default function parseSelectionIds(
    objects: powerbi.DataViewObjects,
    selectionObjectPath = "general.selection",
    filterObjectPath = "general.filter") {
    "use strict";
    const serializedSelection = ldget(objects, selectionObjectPath);
    const serializedSelectedItems: { selector: any }[] = serializedSelection ? JSON.parse(serializedSelection) : [];
    let selectionIds: powerbi.visuals.SelectionId[]  = [];
    if (serializedSelectedItems && serializedSelectedItems.length) {
        // Relic of applying a raw filter to filter other visuals
        let condition = ldget(objects, `${filterObjectPath}.whereItems[0].condition`);
        let values = ldget(condition, "values");
        let args = ldget(condition, "args");
        if (values && args && values.length && args.length) {
            let sourceExpr = args[0];
            selectionIds = values.map((n: any) => {
                return SelectionId.createWithId(powerbi.data.createDataViewScopeIdentity(
                    powerbi.data.SQExprBuilder.compare(0, sourceExpr, n[0])
                ));
            });
        } else {
            selectionIds = getSelectionIdsFromSelectors(serializedSelectedItems.filter(n => !!n.selector).map(n => n.selector));
        }
    }
    return selectionIds;
}
