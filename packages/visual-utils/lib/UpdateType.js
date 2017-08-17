"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an update type for a visual
 */
var UpdateType;
(function (UpdateType) {
    /**
     * This is an unknown update type
     */
    UpdateType[UpdateType["Unknown"] = 0] = "Unknown";
    /**
     * This is a data update
     */
    UpdateType[UpdateType["Data"] = 1] = "Data";
    /**
     * This is a resize operation
     */
    UpdateType[UpdateType["Resize"] = 2] = "Resize";
    /**
     * This has some settings that have been changed
     */
    UpdateType[UpdateType["Settings"] = 4] = "Settings";
    /**
     * This is the initial update
     */
    UpdateType[UpdateType["Initial"] = 8] = "Initial";
    // Some utility keys for debugging
    UpdateType[UpdateType["DataAndResize"] = 3] = "DataAndResize";
    UpdateType[UpdateType["DataAndSettings"] = 5] = "DataAndSettings";
    UpdateType[UpdateType["SettingsAndResize"] = 6] = "SettingsAndResize";
    UpdateType[UpdateType["All"] = 7] = "All";
})(UpdateType || (UpdateType = {}));
exports.default = UpdateType;
//# sourceMappingURL=UpdateType.js.map