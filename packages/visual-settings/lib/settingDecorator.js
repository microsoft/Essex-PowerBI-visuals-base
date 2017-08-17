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
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var assignIn = require("lodash/assignIn"); // tslint:disable-line
/**
 * Defines a setting to be used with powerBI
 * @param config The configuration used to control how a setting operates
 */
function setting(config) {
    "use strict";
    return function (target, key) {
        var setting = {
            propertyName: key,
            descriptor: config,
            isChildSettings: false,
            classType: target,
        };
        if (Object.freeze) {
            setting = Object.freeze(setting);
        }
        defineSetting(target, key, setting);
        Object.defineProperty(target, key, {
            writable: true,
            enumerable: true,
        });
        return target;
    };
}
exports.setting = setting;
/**
 * Defines a setting that has a set of nested child settings
 * @param config The child setting class type
 * @param descriptor The additional set of configuration settings to control how a setting operates
 */
function settings(config, descriptor) {
    "use strict";
    return function (target, key) {
        var childCtor = config;
        // Extend the class so we can add custom properties on it
        var augmentedChildClass = (function (_super) {
            __extends(ChildSettingsClass, _super);
            function ChildSettingsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ChildSettingsClass;
        }(childCtor));
        // Define the metadata object of the augmentedChildClass as the metadata on the actual child ctor
        var childMetadata = defineMetadata(childCtor);
        descriptor = descriptor || {};
        var setting = {
            propertyName: key,
            descriptor: descriptor,
            isChildSettings: true,
            childClassType: augmentedChildClass,
            classType: target,
        };
        // Extend from the child metadata, so we can add additional properties
        defineMetadata(augmentedChildClass, Object.create(childMetadata));
        // Sets up the child inheritance to point to this setting
        setupChildInheritance(setting);
        if (!config) {
            throw new Error("Could not find config for setting: " + key);
        }
        if (Object.freeze) {
            setting = Object.freeze(setting);
        }
        // Define the setting on the target
        defineSetting(target, key, setting);
        Object.defineProperty(target, key, {
            writable: true,
            enumerable: true,
        });
        return target;
    };
}
exports.settings = settings;
/**
 * Creates an inherited setting
 * @param parent The parent setting
 * @param child The child setting
 */
function inheritSetting(parent, child) {
    "use strict";
    var newSetting = Object.create(assignIn({}, child), {
        // Make the child setting inherit the parent
        descriptor: {
            value: Object.create({
                category: parent.descriptor.category,
            }, Object.keys(child.descriptor).reduce(function (a, b) {
                a[b] = {
                    enumerable: true,
                    value: child.descriptor[b],
                };
                return a;
            }, {})),
        },
    });
    newSetting.parentSetting = parent;
    newSetting.classType = parent.childClassType;
    // Update the children too, if necessary
    setupChildInheritance(newSetting);
    return newSetting;
}
/**
 * Sets up the child inheirtance for the given parent setting
 */
function setupChildInheritance(setting) {
    "use strict";
    if (setting.isChildSettings) {
        // Gets the metadata for the child class
        var metadata_1 = defineMetadata(setting.childClassType);
        // Update the child settings to point to ourselves
        metadata_1.settings =
            Object.keys(metadata_1.settings).reduce(function (map, name) {
                map[name] = inheritSetting(setting, metadata_1.settings[name]);
                return map;
            }, {});
    }
}
/**
 * Defines the metadata object for the given class
 * @param target The target to define the metadata on
 * @param metadata The metadata to add
 */
function defineMetadata(target, metadata) {
    "use strict";
    var metadataTarget = target.constructor === Function ? target : target.constructor;
    return metadataTarget[helpers_1.METADATA_KEY] = metadata || metadataTarget[helpers_1.METADATA_KEY] || {};
}
/**
 * Defines the settings metadata for the given class
 * @param target The target to define the metadata on
 */
function defineSettingsMetadata(target) {
    "use strict";
    var metadata = defineMetadata(target);
    return metadata.settings = metadata.settings || {};
}
/**
 * Defines the given setting on the given class
 * @param target The target to define the metadata on
 * @param propName The name of the metadata to add
 * @param value The value of the metadata to add.
 */
function defineSetting(target, propName, value) {
    "use strict";
    defineSettingsMetadata(target)[propName] = value;
}
exports.defineSetting = defineSetting;
//# sourceMappingURL=settingDecorator.js.map