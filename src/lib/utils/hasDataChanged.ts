/*
 * MIT License
 *
 * Copyright (c) 2016 Microsoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { some } from "lodash";

/**
 * Returns if there is any more or less data in the new data
 * @param newData The new set of data
 * @param oldData The old set of data
 * @param equality Returns true if a and b are referring to the same object, not necessarily if it has changed
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
