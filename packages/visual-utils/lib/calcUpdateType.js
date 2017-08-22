"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpdateType_1 = require("./UpdateType");
var assignIn = require("lodash.assignin"); // tslint:disable-line
var _ = require("lodash");
exports.DEFAULT_CALCULATE_SETTINGS = {
    checkHighlights: false,
    defaultUnkownToData: false,
    ignoreCategoryOrder: true,
};
Object.freeze(exports.DEFAULT_CALCULATE_SETTINGS);
/**
 * Calculates the type of update that has occurred between two visual update options, this gives greater granularity than what
 * powerbi has.
 * @param oldOpts The old options
 * @param newOpts The new options
 * @param addlOptions The additional options to use when calculating the update type.
 */
function calcUpdateType(oldOpts, newOpts, addlOptions) {
    "use strict";
    var updateType = UpdateType_1.default.Unknown;
    var options = assignIn({}, exports.DEFAULT_CALCULATE_SETTINGS, typeof addlOptions === "boolean" ?
        { defaultUnkownToData: addlOptions } : (addlOptions || {}));
    if (hasResized(oldOpts, newOpts, options)) {
        updateType ^= UpdateType_1.default.Resize;
    }
    if (hasDataChanged2(oldOpts, newOpts, options)) {
        updateType ^= UpdateType_1.default.Data;
    }
    if (hasSettingsChanged(oldOpts, newOpts, options)) {
        updateType ^= UpdateType_1.default.Settings;
    }
    if (!oldOpts) {
        updateType ^= UpdateType_1.default.Initial;
    }
    if (options.defaultUnkownToData && updateType === UpdateType_1.default.Unknown) {
        updateType = UpdateType_1.default.Data;
    }
    return updateType;
}
exports.default = calcUpdateType;
function hasDataChanged2(oldOptions, newOptions, options) {
    "use strict";
    var oldDvs = (oldOptions && oldOptions.dataViews) || [];
    var dvs = newOptions.dataViews || [];
    if (oldDvs.length !== dvs.length) {
        dvs.forEach(function (dv) { return markDataViewState(dv); });
        return true;
    }
    for (var i = 0; i < oldDvs.length; i++) {
        if (hasDataViewChanged(oldDvs[i], dvs[i], options)) {
            dvs.forEach(function (dv) { return markDataViewState(dv); });
            return true;
        }
    }
    dvs.forEach(function (dv) { return markDataViewState(dv); });
    return false;
}
function hasSettingsChanged(oldOptions, newOptions, options) {
    "use strict";
    var oldDvs = (oldOptions && oldOptions.dataViews) || [];
    var dvs = newOptions.dataViews || [];
    // Is this correct?
    if (oldDvs.length !== dvs.length) {
        return true;
    }
    for (var i = 0; i < oldDvs.length; i++) {
        var oM = oldDvs[i].metadata || {};
        var nM = dvs[i].metadata || {};
        if (!_.isEqual(oM.objects, nM.objects)) {
            return true;
        }
    }
}
function hasResized(oldOptions, newOptions, options) {
    "use strict";
    return !oldOptions ||
        newOptions.viewport.height !== oldOptions.viewport.height ||
        newOptions.viewport.width !== oldOptions.viewport.width;
}
function markDataViewState(dv) {
    "use strict";
    if (dv) {
        var cats2 = (dv.categorical && dv.categorical.categories) || [];
        // set the length, so next go around, hasCategoryChanged can properly compare
        cats2.forEach(function (dc) {
            if (dc.identity) {
                dc.identity["$prevLength"] = dc.identity.length;
            }
        });
    }
}
var colProps = ["queryName", "roles", "sort", "aggregates"];
function hasArrayChanged(a1, a2, isEqual) {
    "use strict";
    // If the same array, shortcut (also works for undefined/null)
    if (a1 === a2) {
        return false;
        // If one of them is null and the other one isn't
    }
    else if (!a1 || !a2) {
        return true;
    }
    if (a1.length !== a2.length) {
        return true;
    }
    if (a1.length > 0) {
        var last = a1.length - 1;
        // check first and last, initially, as it should find 99.95% of changed cases
        return (!isEqual(a1[0], a2[0])) ||
            (!isEqual(a1[last], a2[last])) ||
            // Check everything
            (_.some(a1, (function (n, i) { return !isEqual(n, a2[i]); })));
    }
    return false;
}
function hasCategoryChanged(dc1, dc2) {
    "use strict";
    var changed = hasArrayChanged(dc1.identity, dc2.identity, function (a, b) { return a.key === b.key; });
    // Samesees array, they reuse the array for appending items
    if (dc1.identity && dc2.identity && dc1.identity === dc2.identity) {
        // TODO: This will not catch the case they reuse the array, ie clear the array, add new items with the same amount as the old one.
        var prevLength = dc1.identity["$prevLength"];
        var newLength = dc1.identity.length;
        dc1.identity["$prevLength"] = newLength;
        return prevLength !== newLength;
    }
    return changed;
}
function hasDataViewChanged(dv1, dv2, options) {
    "use strict";
    var cats1 = (dv1.categorical && dv1.categorical.categories) || [];
    var cats2 = (dv2.categorical && dv2.categorical.categories) || [];
    var vals1 = (dv1.categorical && dv1.categorical.values) || [];
    var vals2 = (dv2.categorical && dv2.categorical.values) || [];
    var cols1 = (dv1.metadata && dv1.metadata.columns) || [];
    var cols2 = (dv2.metadata && dv2.metadata.columns) || [];
    if (cats1.length !== cats2.length ||
        cols1.length !== cols2.length ||
        vals1.length !== vals2.length) {
        return true;
    }
    if (options.ignoreCategoryOrder) {
        cols1 = cols1.sort(function (a, b) { return a.queryName.localeCompare(b.queryName); });
        cols2 = cols2.sort(function (a, b) { return a.queryName.localeCompare(b.queryName); });
    }
    for (var i = 0; i < cols1.length; i++) {
        // The underlying column has changed, or if the roles have changed
        if (!_.isEqual(_.pick(cols1[i], colProps), _.pick(cols2[i], colProps))) {
            return true;
        }
    }
    for (var i = 0; i < cats1.length; i++) {
        if (hasCategoryChanged(cats1[i], cats2[i])) {
            return true;
        }
    }
    if (options.checkHighlights) {
        for (var i = 0; i < vals1.length; i++) {
            if (hasHighlightsChanged(vals1[i], vals2[i])) {
                return true;
            }
        }
    }
    return false;
}
function hasHighlightsChanged(val1, val2) {
    "use strict";
    if (val1 && val2) {
        var h1 = val1.highlights || [];
        var h2_1 = val2.highlights || [];
        if (h1 === h2_1) {
            // TODO: This will not catch the case they reuse the array,
            // ie clear the array, add new items with the same amount as the old one.
            var prevLength = h1["$prevLength"];
            var newLength = h1.length;
            h1["$prevLength"] = newLength;
            return prevLength !== newLength;
        }
        if (h1.length !== h2_1.length) {
            return true;
        }
        // Check any highlights have changed.
        return h1.some(function (h, i) { return h !== h2_1[i]; });
    }
    return false;
}
//# sourceMappingURL=calcUpdateType.js.map