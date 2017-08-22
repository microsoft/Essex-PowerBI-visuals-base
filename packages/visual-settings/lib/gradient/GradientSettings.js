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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var HasSettings_1 = require("../HasSettings");
/**
 * A set of gradient settings
 */
var GradientSettings = (function (_super) {
    __extends(GradientSettings, _super);
    function GradientSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Determines if this color settings is equal to another
     */
    GradientSettings.prototype.equals = function (other) {
        if (other) {
            return (this.startColor || undefined) === (other.startColor || undefined) &&
                (this.endColor || undefined) === (other.endColor || undefined) &&
                (this.endValue || undefined) === (other.endValue || undefined) &&
                (this.startValue || undefined) === (other.startValue || undefined);
        }
        return false;
    };
    return GradientSettings;
}(HasSettings_1.HasSettings));
__decorate([
    decorators_1.colorSetting({
        displayName: "Start color",
        description: "The start color of the gradient",
        defaultValue: "#bac2ff",
    })
], GradientSettings.prototype, "startColor", void 0);
__decorate([
    decorators_1.colorSetting({
        displayName: "End color",
        description: "The end color of the gradient",
        defaultValue: "#0229bf",
    })
], GradientSettings.prototype, "endColor", void 0);
__decorate([
    decorators_1.numberSetting({
        displayName: "Start Value",
        description: "The value to use as the start value",
    })
], GradientSettings.prototype, "startValue", void 0);
__decorate([
    decorators_1.numberSetting({
        displayName: "End Value",
        description: "The value to use as the end value",
    })
], GradientSettings.prototype, "endValue", void 0);
exports.GradientSettings = GradientSettings;
//# sourceMappingURL=GradientSettings.js.map