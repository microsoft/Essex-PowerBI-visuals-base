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

/* tslint:disable */
const debug = require("debug");
debug.save = function() { };
if (process.env.DEBUG) {
    debug.enable(process.env.DEBUG);
}
/* tslint:enable */

export { default as calcUpdateType } from "./calcUpdateType";
// export * from "./capabilities";
// export { default as colorizedLog } from "./colorizedLog";
export { default as createPropertyPersister } from "./createPropertyPersister";
// export { default as elementLogWriter } from "./elementLogWriter";
// export { default as hasDataChanged } from "./hasDataChanged";
// export { default as listDiff } from "./listDiff";
export * from "./logger";
export { default as PropertyPersister } from "./PropertyPersister";
// export * from "./receiveUpdateType";
export * from "./receiveDimensions";
export { default as UpdateType } from "./UpdateType";
// export { default as updateTypeGetter } from "./updateTypeGetter";
// export { default as Visual } from "./Visual";
// export { IDiffProcessor } from "./IDiffProcessor";
export { default as buildContainsFilter } from "./buildContainsFilter";
// export { default as parseSelectionIds } from "./parseSelectionIds";
export { default as createPersistObjectBuilder } from "./persistObjectBuilder";
// export * from "./getSelectionIdsFromSelectors";
// export { default as get } from "./typesafeGet";
// export { default as calculateSegments } from "./calculateSegments";
// export * from "./serialization";
export * from "./convertItemsWithSegments";
export * from "./interfaces";
