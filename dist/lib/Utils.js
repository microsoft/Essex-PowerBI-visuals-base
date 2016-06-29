"use strict";
/* tslint:disable */
var debug = require("debug");
debug.save = function () { };
// TODO: #IF DEBUG
if (process.env.DEBUG) {
    debug.enable(process.env.DEBUG);
}
else {
    debug.enabled = function () { return false; };
}
/* tslint:enable */
var _ = require("lodash");
/**
 * A logger factory function
 */
var logWriters = [consoleLogWriter()];
exports.logger = (function (name) {
    var newLogger = debug(name);
    newLogger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        logWriters.forEach(function (n) {
            n.apply(this, args);
        });
    };
    return newLogger;
});
exports.logger.addWriter = function (writer) {
    logWriters.push(writer);
};
var log = exports.logger("essex:widget:Utils");
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
function Mixin(ctor) {
    return function (me) {
        applyMixins(me, ctor);
    };
}
/**
 * Registers a visual in the power bi system
 */
function Visual(config) {
    return function (ctor) {
        (function (powerbi) {
            var visuals;
            (function (visuals) {
                var plugins;
                (function (plugins) {
                    var name = config.visualName + config.projectId;
                    plugins[name] = {
                        name: name,
                        class: name,
                        capabilities: ctor.capabilities,
                        custom: true,
                        create: function () {
                            return new ctor();
                        }
                    };
                })(plugins = visuals.plugins || (visuals.plugins = {}));
            })(visuals = powerbi.visuals || (powerbi.visuals = {}));
        })(window['powerbi'] || (window['powerbi'] = {}));
    };
}
exports.Visual = Visual;
/**
 * A collection of utils
 */
var Utils = (function () {
    function Utils() {
    }
    /**
     * Returns if there is any more or less data in the new data
     * @param idEquality Returns true if a and b are referring to the same object, not necessarily if it has changed
     */
    Utils.hasDataChanged = function (newData, oldData, equality) {
        // If the are identical, either same array or undefined, nothing has changed
        if (oldData === newData) {
            return false;
        }
        // If only one of them is undefined or if they differ in length, then its changed
        if (!oldData || !newData || oldData.length !== newData.length) {
            return true;
        }
        // If there are any elements in newdata that arent in the old data
        return _.some(newData, function (n) { return !_.some(oldData, function (m) { return equality(m, n); }); });
    };
    /**
     * Diffs the two given lists
     * @param existingItems The current list of items
     * @param newItems The new set of items
     * @param differ The interface for comparing items and add/remove events
     * @param <M>
     */
    // TODO: Think about a param that indicates if should be merged into 
    /// existingItems should be modified, or if only the differ should be called
    Utils.listDiff = function (existingItems, newItems, differ) {
        existingItems = existingItems || [];
        newItems = newItems || [];
        var existing;
        var found;
        var curr;
        var foundItem;
        // Go backwards so we can remove without screwing up the index
        for (var i = existingItems.length - 1; i >= 0; i--) {
            var existing = existingItems[i];
            var found = false;
            for (var j = 0; j < newItems.length; j++) {
                var curr = newItems[j];
                if (differ.equals(curr, existing)) {
                    found = true;
                }
            }
            if (!found) {
                existingItems.splice(i, 1);
                if (differ.onRemove) {
                    differ.onRemove(existing);
                }
            }
        }
        existing = undefined;
        // Go through the existing ones and add the missing ones
        for (var i = 0; i < newItems.length; i++) {
            curr = newItems[i];
            foundItem = undefined;
            for (var j = 0; j < existingItems.length; j++) {
                existing = existingItems[j];
                if (differ.equals(curr, existing)) {
                    foundItem = existing;
                }
            }
            if (!foundItem) {
                existingItems.push(curr);
                if (differ.onAdd) {
                    differ.onAdd(curr);
                }
            }
            else if (differ.onUpdate) {
                differ.onUpdate(foundItem, curr);
            }
        }
    };
    return Utils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;
/**
 * Creates an update watcher for a visual
 */
// TODO: This would be SOOO much better as a mixin, just don't want all that extra code that it requires right now.
function updateTypeGetter(obj) {
    var currUpdateType = UpdateType.Unknown;
    if (obj && obj.update) {
        var oldUpdate_1 = obj.update;
        var prevOptions_1;
        obj.update = function (options) {
            var updateType = calcUpdateType(prevOptions_1, options);
            currUpdateType = updateType;
            prevOptions_1 = options;
            log("Update -- Type: " + UpdateType[updateType]);
            return oldUpdate_1.call(this, options);
        };
    }
    return function () {
        return currUpdateType;
    };
}
exports.updateTypeGetter = updateTypeGetter;
/**
 * Calculates the updates that have occurred between the two updates
 */
function calcUpdateType(oldOpts, newOpts) {
    var updateType = UpdateType.Unknown;
    if (hasResized(oldOpts, newOpts)) {
        updateType ^= UpdateType.Resize;
    }
    if (hasDataChanged(oldOpts, newOpts)) {
        updateType ^= UpdateType.Data;
    }
    if (hasSettingsChanged(oldOpts, newOpts)) {
        updateType ^= UpdateType.Settings;
    }
    if (!oldOpts) {
        updateType ^= UpdateType.Initial;
    }
    return updateType;
}
exports.calcUpdateType = calcUpdateType;
/**
 * Creates html from the given things to log, supports chrome log style coloring (%c)
 * See: https://developer.chrome.com/devtools/docs/console-api#consolelogobject-object
 */
function colorizedLog() {
    var toLog = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        toLog[_i - 0] = arguments[_i];
    }
    var logStr;
    // logEle.css({ display: "block" });
    if (toLog && toLog.length > 1) {
        logStr = "<span>" + toLog[0] + "</span>";
        for (var i = 1; i < toLog.length; i++) {
            var value = toLog[i];
            var cIdx = logStr.indexOf("%c");
            if (cIdx >= 0) {
                var beginningPart = logStr.substring(0, cIdx);
                logStr = beginningPart + "</span><span style=\"" + value + "\">" + logStr.substring(cIdx + 2);
            }
            else {
                logStr += value;
            }
        }
    }
    else {
        logStr = toLog.join("");
    }
    return logStr;
}
exports.colorizedLog = colorizedLog;
/**
 * Adds logging to an element
 */
function elementLogWriter(getElement) {
    var _this = this;
    //logger: Logger, 
    // const oldLog = logger.log;
    return function () {
        var toLog = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            toLog[_i - 0] = arguments[_i];
        }
        var ele = getElement();
        if (ele) {
            getElement().prepend($("<div>" + colorizedLog.apply(_this, toLog) + "</div>"));
        }
        console.log.apply(console, toLog);
    };
}
exports.elementLogWriter = elementLogWriter;
;
/**
 * Adds logging to an element
 */
function consoleLogWriter() {
    //logger: Logger, 
    // const oldLog = logger.log;
    return function () {
        var toLog = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            toLog[_i - 0] = arguments[_i];
        }
        console.log.apply(console, toLog);
    };
}
exports.consoleLogWriter = consoleLogWriter;
;
function hasArrayChanged(a1, a2, isEqual) {
    // If the same array, shortcut (also works for undefined/null)
    if (a1 === a2) {
        return false;
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
var colProps = ['queryName', 'roles', 'sort'];
function hasDataViewChanged(dv1, dv2) {
    var cats1 = (dv1.categorical && dv1.categorical.categories) || [];
    var cats2 = (dv2.categorical && dv2.categorical.categories) || [];
    var cols1 = (dv1.metadata && dv1.metadata.columns) || [];
    var cols2 = (dv2.metadata && dv2.metadata.columns) || [];
    if (cats1.length !== cats2.length ||
        cols1.length !== cols2.length) {
        return true;
    }
    cols1 = cols1.sort(function (a, b) { return a.queryName.localeCompare(b.queryName); });
    cols2 = cols2.sort(function (a, b) { return a.queryName.localeCompare(b.queryName); });
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
    return false;
}
function hasDataChanged(oldOptions, newOptions) {
    var oldDvs = (oldOptions && oldOptions.dataViews) || [];
    var dvs = newOptions.dataViews || [];
    if (oldDvs.length !== dvs.length) {
        return true;
    }
    for (var i = 0; i < oldDvs.length; i++) {
        if (hasDataViewChanged(oldDvs[i], dvs[i])) {
            return true;
        }
    }
    return false;
}
function hasSettingsChanged(oldOptions, newOptions) {
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
function hasResized(oldOptions, newOptions) {
    return !oldOptions || newOptions.resizeMode;
}
/**
 * Represents an update type for a visual
 */
(function (UpdateType) {
    UpdateType[UpdateType["Unknown"] = 0] = "Unknown";
    UpdateType[UpdateType["Data"] = 1] = "Data";
    UpdateType[UpdateType["Resize"] = 2] = "Resize";
    UpdateType[UpdateType["Settings"] = 4] = "Settings";
    UpdateType[UpdateType["Initial"] = 8] = "Initial";
    // Some utility keys for debugging
    /* tslint:disable */
    UpdateType[UpdateType["DataAndResize"] = 3] = "DataAndResize";
    UpdateType[UpdateType["DataAndSettings"] = 5] = "DataAndSettings";
    UpdateType[UpdateType["SettingsAndResize"] = 6] = "SettingsAndResize";
    UpdateType[UpdateType["All"] = 7] = "All";
})(exports.UpdateType || (exports.UpdateType = {}));
var UpdateType = exports.UpdateType;
//# sourceMappingURL=Utils.js.map