import { some } from "lodash";

/**
 * Returns if there is any more or less data in the new data
 * @param idEquality Returns true if a and b are referring to the same object, not necessarily if it has changed
 */
export default function hasDataChanged<T>(newData: T[], oldData: T[], equality: (a: T, b: T) => boolean) {
    "use strict";
    // If the are identical, either same array or undefined, nothing has changed
    if (oldData === newData) {
        return false;
    }

    // If only one of them is undefined or if they differ in length, then its changed
    if (!oldData || !newData || oldData.length !== newData.length) {
        return true;
    }

    // If there are any elements in newdata that arent in the old data
    return some(newData, (n: T) => !_.some(oldData, (m: T) => equality(m, n)));
}
