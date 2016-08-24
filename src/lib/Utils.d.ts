import IVisual = powerbi.IVisual;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
export declare let logger: LoggerFactory;
/**
 * Registers a visual in the power bi system
 */
export declare function Visual(config: {
    visualName: string;
    projectId: string;
}): (ctor: any) => void;
/**
 * Represents a class that handles the persistance of properties
 */
export declare class PropertyPersister {
    private host;
    private delay;
    constructor(host: powerbi.IVisualHostServices, delay?: number);
    /**
     * Queues the given property changes
     */
    private propsToUpdate;
    private propUpdater;
    /**
     * Queues a set of property changes for the next update
     */
    persist(selection: boolean, ...changes: powerbi.VisualObjectInstancesToPersist[]): void;
}
/**
 * Creates a property persister to ensure that all property changes are persisted in bulk
 */
export declare function createPropertyPersister(host: powerbi.IVisualHostServices, delay: number): PropertyPersister;
/**
 * A collection of utils
 */
export default class Utils {
    /**
     * Returns if there is any more or less data in the new data
     * @param idEquality Returns true if a and b are referring to the same object, not necessarily if it has changed
     */
    static hasDataChanged<T>(newData: T[], oldData: T[], equality: (a: T, b: T) => boolean): boolean;
    /**
     * Diffs the two given lists
     * @param existingItems The current list of items
     * @param newItems The new set of items
     * @param differ The interface for comparing items and add/remove events
     * @param <M>
     */
    static listDiff<M>(existingItems: M[], newItems: M[], differ: IDiffProcessor<M>): void;
}
/**
 * Creates an update watcher for a visual
 */
export declare function updateTypeGetter(obj: IVisual): () => UpdateType;
/**
 * Calculates the updates that have occurred between the two updates
 */
export declare function calcUpdateType(oldOpts: VisualUpdateOptions, newOpts: VisualUpdateOptions): UpdateType;
/**
 * Creates html from the given things to log, supports chrome log style coloring (%c)
 * See: https://developer.chrome.com/devtools/docs/console-api#consolelogobject-object
 */
export declare function colorizedLog(...toLog: any[]): string;
/**
 * Adds logging to an element
 */
export declare function elementLogWriter(getElement: () => JQuery): (...toLog: any[]) => void;
/**
 * Adds logging to an element
 */
export declare function consoleLogWriter(): (...toLog: any[]) => void;
/**
 * Represents an update type for a visual
 */
export declare enum UpdateType {
    Unknown = 0,
    Data = 1,
    Resize = 2,
    Settings = 4,
    Initial = 8,
    DataAndResize = 3,
    DataAndSettings = 5,
    SettingsAndResize = 6,
    All = 7,
}
/**
 * Processes a difference found in a list
 */
export interface IDiffProcessor<M> {
    /**
     * Returns true if item one equals item two
     */
    equals(one: M, two: M): boolean;
    /**
     * Gets called when the given item was removed
     */
    onRemove?(item: M): void;
    /**
     * Gets called when the given item was added
     */
    onAdd?(item: M): void;
    /**
     * Gets called when the given item was updated
     */
    onUpdate?(oldVersion: M, newVersion: M): void;
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
