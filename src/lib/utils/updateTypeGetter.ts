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

import IVisual = powerbi.IVisual;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import UpdateType from "./UpdateType";
import { default as calcUpdateType, ICalcUpdateTypeOptions } from "./calcUpdateType";
import log from "./log";

/**
 * Creates an update watcher for a visual
 */
// TODO: This would be SOOO much better as a mixin, just don't want all that extra code that it requires right now.
export default function updateTypeGetter(obj: IVisual, addlOptions?: ICalcUpdateTypeOptions|boolean) {
    "use strict";
    let currUpdateType = UpdateType.Unknown;
    if (obj && obj.update) {
        const oldUpdate = obj.update;
        let prevOptions: VisualUpdateOptions;
        obj.update = function(options: VisualUpdateOptions) {
            let updateType = calcUpdateType(prevOptions, options, addlOptions);
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
