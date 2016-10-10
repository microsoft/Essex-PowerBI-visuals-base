import "powerbi-visuals/lib/powerbi-visuals";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import UpdateType from "./UpdateType";

/**
 * Calculates the updates that have occurred between the two updates
 */
export default function calcUpdateType(oldOpts: VisualUpdateOptions, newOpts: VisualUpdateOptions, defaultUnkownToData = false) {
    "use strict";
    let updateType = UpdateType.Unknown;

    if (hasResized(oldOpts, newOpts)) {
        updateType ^= UpdateType.Resize;
    }

    if (hasDataChanged2(oldOpts, newOpts)) {
        updateType ^= UpdateType.Data;
    }

    if (hasSettingsChanged(oldOpts, newOpts)) {
        updateType ^= UpdateType.Settings;
    }

    if (!oldOpts) {
        updateType ^= UpdateType.Initial;
    }

    if (defaultUnkownToData && updateType === UpdateType.Unknown) {
        updateType = UpdateType.Data;
    }

    return updateType;
}

function hasDataChanged2(oldOptions: VisualUpdateOptions, newOptions: VisualUpdateOptions) {
    "use strict";
    const oldDvs = (oldOptions && oldOptions.dataViews) || [];
    const dvs = newOptions.dataViews || [];
    if (oldDvs.length !== dvs.length) {
        dvs.forEach(dv => markDataViewState(dv));
        return true;
    }
    for (let i = 0; i < oldDvs.length; i++) {
        if (hasDataViewChanged(oldDvs[i], dvs[i])) {
            dvs.forEach(dv => markDataViewState(dv));
            return true;
        }
    }
    dvs.forEach(dv => markDataViewState(dv));
    return false;
}


function hasSettingsChanged(oldOptions: VisualUpdateOptions, newOptions: VisualUpdateOptions) {
    "use strict";
    const oldDvs = (oldOptions && oldOptions.dataViews) || [];
    const dvs = newOptions.dataViews || [];

    // Is this correct?
    if (oldDvs.length !== dvs.length) {
        return true;
    }

    for (let i = 0; i < oldDvs.length; i++) {
        const oM: any = oldDvs[i].metadata || {};
        const nM: any = dvs[i].metadata || {};
        if (!_.isEqual(oM.objects, nM.objects)) {
            return true;
        }
    }
}

function hasResized(oldOptions: VisualUpdateOptions, newOptions: VisualUpdateOptions) {
    "use strict";
    return !oldOptions || newOptions.resizeMode;
}

function markDataViewState(dv: powerbi.DataView) {
    "use strict";
    if (dv) {
        let cats2 = (dv.categorical && dv.categorical.categories) || [];
        // set the length, so next go around, hasCategoryChanged can properly compare
        cats2.forEach(dc => {
            if (dc.identity) {
                dc.identity["$prevLength"] = dc.identity.length;
            }
        });
    }
}

const colProps = ["queryName", "roles", "sort", "aggregates"];


function hasArrayChanged<T>(a1: T[], a2: T[], isEqual: (a: T, b: T) => boolean) {
    "use strict";
    // If the same array, shortcut (also works for undefined/null)
    if (a1 === a2) {
        return false;

    // If one of them is null and the other one isn't
    } else if (!a1 || !a2) {
        return true;
    }

    if (a1.length !== a2.length) {
        return true;
    }

    if (a1.length > 0) {
        const last = a1.length - 1;

        // check first and last, initially, as it should find 99.95% of changed cases
        return (!isEqual(a1[0], a2[0])) ||
            (!isEqual(a1[last], a2[last])) ||

            // Check everything
            (_.some(a1, ((n, i) => !isEqual(n, a2[i]))));
    }
    return false;
}

function hasCategoryChanged(dc1: powerbi.DataViewCategoryColumn, dc2: powerbi.DataViewCategoryColumn) {
    "use strict";
    let changed = hasArrayChanged<powerbi.DataViewScopeIdentity>(dc1.identity, dc2.identity, (a, b) => a.key === b.key);
    // Samesees array, they reuse the array for appending items
    if (dc1.identity && dc2.identity && dc1.identity === dc2.identity) {
        // TODO: This will not catch the case they reuse the array, ie clear the array, add new items with the same amount as the old one.
        let prevLength = dc1.identity["$prevLength"];
        let newLength = dc1.identity.length;
        dc1.identity["$prevLength"] = newLength;
        return prevLength !== newLength;
    }
    return changed;
}

function hasDataViewChanged(dv1: powerbi.DataView, dv2: powerbi.DataView) {
    "use strict";
    let cats1 = (dv1.categorical && dv1.categorical.categories) || [];
    let cats2 = (dv2.categorical && dv2.categorical.categories) || [];
    let cols1 = (dv1.metadata && dv1.metadata.columns) || [];
    let cols2 = (dv2.metadata && dv2.metadata.columns) || [];
    if (cats1.length !== cats2.length ||
        cols1.length !== cols2.length) {
        return true;
    }
    cols1 = cols1.sort((a, b) => a.queryName.localeCompare(b.queryName));
    cols2 = cols2.sort((a, b) => a.queryName.localeCompare(b.queryName));

    for (let i = 0; i < cols1.length; i++) {
        // The underlying column has changed, or if the roles have changed
        if (!_.isEqual(_.pick(cols1[i], colProps), _.pick(cols2[i], colProps))) {
            return true;
        }
    }

    for (let i = 0; i < cats1.length; i++) {
        if (hasCategoryChanged(cats1[i], cats2[i])) {
            return true;
        }
    }
    return false;
}
