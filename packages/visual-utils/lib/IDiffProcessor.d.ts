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
