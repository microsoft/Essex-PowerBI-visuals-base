/**
 * Registers a visual in the power bi system
 */
export declare function Visual(config: {
    visualName: string;
    projectId: string;
}): (ctor: any) => void;
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
