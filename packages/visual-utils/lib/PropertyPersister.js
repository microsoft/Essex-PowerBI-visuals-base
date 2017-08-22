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
 * A class that provides a way to easily persist multiple objects at the same time without multiple calls to host.persistProperties
 */
var PropertyPersister = (function () {
    function PropertyPersister(host, // tslint:disable-line
        delay // tslint:disable-line
    ) {
        if (delay === void 0) { delay = 100; } // tslint:disable-line
        var _this = this;
        this.host = host;
        this.delay = delay; // tslint:disable-line
        /**
         * Queues the given property changes
         */
        this.propsToUpdate = []; // tslint:disable-line
        this.propUpdater = _.debounce(function () {
            if (_this.propsToUpdate && _this.propsToUpdate.length) {
                var toUpdate = _this.propsToUpdate.slice(0);
                _this.propsToUpdate.length = 0;
                var final_1 = {};
                var isSelection_1;
                toUpdate.forEach(function (n) {
                    n.changes.forEach(function (m) {
                        Object.keys(m).forEach(function (operation) {
                            if (!final_1[operation]) {
                                final_1[operation] = [];
                            }
                            (_a = final_1[operation]).push.apply(_a, m[operation]);
                            var _a;
                        });
                    });
                    if (n.selection) {
                        isSelection_1 = true;
                    }
                });
                // // SUPER important that these guys happen together, otherwise the selection does not update properly
                // if (isSelection) {
                //     this.host.onSelect({ data: [] } as any); // TODO: Change this to visualObjects: []?
                // }
                _this.host.persistProperties(final_1);
            }
        }, this.delay);
    }
    /**
     * Queues a set of property changes for the next update
     * @param selection True if the properties contains selection
     */
    PropertyPersister.prototype.persist = function (selection) {
        var changes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            changes[_i - 1] = arguments[_i];
        }
        this.propsToUpdate.push({
            changes: changes,
            selection: selection,
        });
        this.propUpdater();
    };
    return PropertyPersister;
}());
exports.default = PropertyPersister;
//# sourceMappingURL=PropertyPersister.js.map