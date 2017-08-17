/**
 * Diffs the two given lists
 * @param existingItems The current list of items
 * @param newItems The new set of items
 * @param differ The interface for comparing items and add/remove events
 * @param <M>
 */
import { IDiffProcessor } from "./IDiffProcessor";
export default function listDiff<M>(existingItems: M[], newItems: M[], differ: IDiffProcessor<M>): void;
