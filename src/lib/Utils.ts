/* tslint:disable */
const debug = require("debug");
debug.save = function() { };

// TODO: #IF DEBUG
if (process.env.DEBUG) {
    debug.enable(process.env.DEBUG);
} else {
    debug.enabled = function() { return false; };
}
/* tslint:enable */

import * as _ from "lodash";
import IVisual = powerbi.IVisual;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

/**
 * A logger factory function
 */
const logWriters: LogWriter[] = [consoleLogWriter()];
export let logger: LoggerFactory = <any>((name: string) => {
    const newLogger = debug(name) as Logger;
    newLogger.log = function(...args) {
        logWriters.forEach(function(n) {
            n.apply(this, args);
        });
    };
    return newLogger;
});
logger.addWriter = (writer: LogWriter) => {
    logWriters.push(writer);
};
const log = logger("essex:widget:Utils");

function applyMixins(derivedCtor:any, baseCtors:any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

function Mixin(ctor:any) {
    return function (me:Function) {
        applyMixins(me, ctor);
    };
}

/**
 * Registers a visual in the power bi system
 */
export function Visual(config:{ visualName: string; projectId: string }) {
    return function (ctor:any) {
        (function (powerbi:any) {
            let visuals:any;
            (function (visuals:any) {
                let plugins:any;
                (function (plugins:any) {
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


/**
 * A collection of utils
 */
export default class Utils {

    /**
     * Returns if there is any more or less data in the new data
     * @param idEquality Returns true if a and b are referring to the same object, not necessarily if it has changed
     */
    public static hasDataChanged<T>(newData:T[], oldData:T[], equality:(a:T, b:T) => boolean) {
        // If the are identical, either same array or undefined, nothing has changed
        if (oldData === newData) {
            return false;
        }

        // If only one of them is undefined or if they differ in length, then its changed
        if (!oldData || !newData || oldData.length !== newData.length) {
            return true;
        }

        // If there are any elements in newdata that arent in the old data
        return _.some(newData, (n: T) => !_.some(oldData, (m: T) => equality(m, n)));
    }


    /**
     * Diffs the two given lists
     * @param existingItems The current list of items
     * @param newItems The new set of items
     * @param differ The interface for comparing items and add/remove events
     * @param <M>
     */
    // TODO: Think about a param that indicates if should be merged into 
    /// existingItems should be modified, or if only the differ should be called
    public static listDiff<M>(existingItems: M[], newItems: M[], differ: IDiffProcessor<M>) {
        existingItems = existingItems || [];
        newItems = newItems || [];

        var existing: M;
        var found: boolean;
        var curr: M;
        var foundItem: M;

        // Go backwards so we can remove without screwing up the index
        for (var i = existingItems.length - 1; i >= 0; i--) {
            var existing:M = existingItems[i];
            var found = false;
            for (var j = 0; j < newItems.length; j++) {
                var curr:M = newItems[j];
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
            } else if (differ.onUpdate) {
                differ.onUpdate(foundItem, curr);
            }
        }
    }
}

/**
 * Creates an update watcher for a visual
 */
// TODO: This would be SOOO much better as a mixin, just don't want all that extra code that it requires right now.
export function updateTypeGetter(obj: IVisual) {
    let currUpdateType = UpdateType.Unknown;
    if (obj && obj.update) {
        const oldUpdate = obj.update;
        let prevOptions: VisualUpdateOptions;
        obj.update = function(options: VisualUpdateOptions) {
            let updateType = calcUpdateType(prevOptions, options);
            currUpdateType = updateType;
            prevOptions = options;
            log(`Update -- Type: ${UpdateType[updateType]}`);
            return oldUpdate.call(this, options);
        };
    }
    return function() {
        return currUpdateType;
    };
}

/**
 * Calculates the updates that have occurred between the two updates
 */
export function calcUpdateType(oldOpts: VisualUpdateOptions, newOpts: VisualUpdateOptions) {
    let updateType = UpdateType.Unknown;

    if (hasResized(oldOpts, newOpts)) {
        updateType ^= UpdateType.Resize;
    }

    if (hasDataChanged(oldOpts, newOpts)) {
        updateType ^= UpdateType.Data;
    }

    if (hasSettingsChanged(oldOpts, newOpts)) {
        updateType ^= UpdateType.Settings;
    }
    return updateType;
}

/**
 * Creates html from the given things to log, supports chrome log style coloring (%c)
 * See: https://developer.chrome.com/devtools/docs/console-api#consolelogobject-object
 */
export function colorizedLog(...toLog: any[]): string {
    let logStr: string;
        // logEle.css({ display: "block" });
    if (toLog && toLog.length > 1) {
        logStr = `<span>${toLog[0]}</span>`;
        for (let i = 1; i < toLog.length; i++) {
            let value = toLog[i];
            let cIdx = logStr.indexOf("%c");
            if (cIdx >= 0) {
                let beginningPart = logStr.substring(0, cIdx);
                logStr = `${beginningPart}</span><span style="${value}">${logStr.substring(cIdx + 2)}`;
            }  else {
                logStr += value;
            }
        }
    } else {
        logStr = toLog.join("");
    }
    return logStr;
}

/**
 * Adds logging to an element
 */
export function elementLogWriter(getElement: () => JQuery) {
    //logger: Logger, 
    // const oldLog = logger.log;
    return (...toLog: any[]) => {
        const ele = getElement();
        if (ele) {
            getElement().prepend($(`<div>${colorizedLog.apply(this, toLog)}</div>`));
        }
        console.log.apply(console, toLog);
    };
};

/**
 * Adds logging to an element
 */
export function consoleLogWriter() {
    //logger: Logger, 
    // const oldLog = logger.log;
    return (...toLog: any[]) => {
        console.log.apply(console, toLog);
    };
};

function hasArrayChanged<T>(a1: T[], a2: T[], isEqual: (a: T, b: T) => boolean) {
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
    return hasArrayChanged<powerbi.DataViewScopeIdentity>(dc1.identity, dc2.identity, (a, b) => a.key === b.key);
}

const colProps = ['queryName', 'roles', 'sort'];
function hasDataViewChanged(dv1: powerbi.DataView, dv2: powerbi.DataView) {
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

function hasDataChanged(oldOptions: VisualUpdateOptions, newOptions: VisualUpdateOptions) {
    const oldDvs = (oldOptions && oldOptions.dataViews) || [];
    const dvs = newOptions.dataViews || [];
    if (oldDvs.length !== dvs.length) {
        return true;
    }
    for (let i = 0; i < oldDvs.length; i++) {
        if (hasDataViewChanged(oldDvs[i], dvs[i])) {
            return true;
        }
    }
    return false;
}

function hasSettingsChanged(oldOptions: VisualUpdateOptions, newOptions: VisualUpdateOptions) {
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
    return newOptions.resizeMode;
}

/**
 * Represents an update type for a visual
 */
export enum UpdateType {
    Unknown = 0,
    Data = 1 << 0,
    Resize = 1 << 1,
    Settings = 1 << 2,

    // Some utility keys for debugging
    /* tslint:disable */
    DataAndResize = UpdateType.Data | UpdateType.Resize,
    DataAndSettings = UpdateType.Data | UpdateType.Settings,
    SettingsAndResize = UpdateType.Settings | UpdateType.Resize,
    All = UpdateType.Data | UpdateType.Resize | UpdateType.Settings
    /* tslint:enable */
}

/**
 * Processes a difference found in a list
 */
export interface IDiffProcessor<M> {

    /**
     * Returns true if item one equals item two
     */
    equals(one:M, two:M) : boolean;

    /**
     * Gets called when the given item was removed
     */
    onRemove?(item:M) : void;

    /**
     * Gets called when the given item was added
     */
    onAdd?(item:M) : void;

    /**
     * Gets called when the given item was updated
     */
    onUpdate?(oldVersion:M, newVersion:M) : void;
}

export interface LogWriter {
    /**
     * Writes the given log 
     */
    (...args: any[]): void;
}

export interface LoggerFactory {
    /**
     * Creates a new logger
     */
    (name: string): Logger;

    /**
     * Adds a log writer
     */
    addWriter(writer: LogWriter): void;
}

export interface Logger {
    /**
     * Adds a log entry
     */
    (...args: any[]): void;

    /**
     * The function that gets called when a log entry is added
     */
    log(...args: any[]): void;
}