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
var visual_utils_1 = require("@essex/visual-utils");
var visual_styling_1 = require("@essex/visual-styling");
var decorators_1 = require("../decorators");
var settingDecorator_1 = require("../settingDecorator");
var HasSettings_1 = require("../HasSettings");
var gradient_1 = require("../gradient");
/**
 * A set of color settings which control how objects are colored
 */
var ColoredObjectsSettings = (function (_super) {
    __extends(ColoredObjectsSettings, _super);
    function ColoredObjectsSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Determines if this color settings is equal to another
     */
    ColoredObjectsSettings.prototype.equals = function (other) {
        if (other) {
            var otherGradient = other.gradient || undefined;
            var gradient = this.gradient || undefined;
            if (gradient && !otherGradient ||
                otherGradient && !gradient) {
                return false;
            }
            var otherInstances_1 = other.instanceColors || [];
            var instanceColors = this.instanceColors || [];
            if (otherInstances_1.length !== instanceColors.length) {
                return false;
            }
            var anyInstanceChanges = instanceColors.some(function (n, j) {
                var otherInstance = otherInstances_1[j];
                // TODO: Id Check
                return otherInstance.name !== n.name || otherInstance.color !== n.color;
            });
            return !anyInstanceChanges &&
                (gradient === otherGradient || gradient.equals(otherGradient)) &&
                this.reverseOrder === other.reverseOrder &&
                this.colorMode === other.colorMode;
        }
        return false;
    };
    return ColoredObjectsSettings;
}(HasSettings_1.HasSettings));
__decorate([
    decorators_1.instanceColorSetting({
        name: "fill",
        defaultValue: function (idx) { return visual_styling_1.fullColors[idx] || "#ccc"; },
        enumerable: function (s, dv) { return visual_utils_1.dataSupportsColorizedInstances(dv) && !(s.colorMode === visual_utils_1.ColorMode.Gradient); },
    })
], ColoredObjectsSettings.prototype, "instanceColors", void 0);
__decorate([
    decorators_1.enumSetting(visual_utils_1.ColorMode, {
        displayName: "Color Mode",
        defaultValue: visual_utils_1.ColorMode.Instance,
        description: "Determines how the individual bars within the time brush are colored",
    })
], ColoredObjectsSettings.prototype, "colorMode", void 0);
__decorate([
    gradient_1.gradientSetting({
        enumerable: function (s, dataView) { return visual_utils_1.dataSupportsGradients(dataView) && (s.colorMode === visual_utils_1.ColorMode.Gradient); },
    })
], ColoredObjectsSettings.prototype, "gradient", void 0);
__decorate([
    settingDecorator_1.setting({
        displayName: "Reverse Order",
        description: "If enabled, the order of the bars will be reversed",
        defaultValue: false,
        hidden: function (settings, dataView) { return !visual_utils_1.dataSupportsValueSegments(dataView); },
    })
], ColoredObjectsSettings.prototype, "reverseOrder", void 0);
exports.ColoredObjectsSettings = ColoredObjectsSettings;
//# sourceMappingURL=ColoredObjectsSettings.js.map