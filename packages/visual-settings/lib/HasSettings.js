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
var helpers_1 = require("./helpers");
var assignIn = require("lodash.assignin"); // tslint:disable-line
/**
 * A simple class with utility methods to facilitate settings parsing.
 */
var HasSettings = (function () {
    function HasSettings() {
    }
    /**
     * Creates a new instance of this class
     * @param props A set of additional properties to mixin to this settings class
     */
    HasSettings.create = function (props) {
        return helpers_1.parseSettingsFromPBI(this, undefined, props, true);
    };
    /**
     * Creates a new instance of this class with the data from powerbi and the additional properties.
     * @param dv The dataview to create the settings from
     * @param additionalProps The additional set of properties to mixin to this settings class
     */
    HasSettings.createFromPBI = function (dv, additionalProps) {
        return helpers_1.parseSettingsFromPBI(this, dv, additionalProps, false);
    };
    /**
     * Builds the capability objects for this settings class
     */
    HasSettings.buildCapabilitiesObjects = function () {
        return helpers_1.buildCapabilitiesObjects(this);
    };
    /**
     * Receives the given object and returns a new state with the object overlayed with the this set of settings
     * @param props The properties to mixin to the resulting class
     */
    HasSettings.prototype.receive = function (props) {
        return this.constructor.create(assignIn(this.toJSONObject(), props));
    };
    /**
     * Receives the given pbi settings and returns a new state with the new pbi settings overlayed with the this state
     * @param dv The dataView to receive
     */
    HasSettings.prototype.receiveFromPBI = function (dv) {
        return this.constructor.createFromPBI(dv, this.toJSONObject());
    };
    /**
     * Builds the enumeration objects
     * @param objectName The objectName being requested from enumerateObjectInstances
     * @param dataView The currently loaded dataView
     * @param includeHidden If true, 'hidden' settings will be returned
     */
    HasSettings.prototype.buildEnumerationObjects = function (objectName, dataView, includeHidden) {
        if (includeHidden === void 0) { includeHidden = false; }
        return helpers_1.buildEnumerationObjects(this.constructor, this, objectName, dataView, includeHidden);
    };
    /**
     * Builds a set of persistance objects to be persisted from the current set of settings.
     * @param dataView The currently loaded dataView
     * @param includeHidden If true, 'hidden' settings will be returned
     */
    HasSettings.prototype.buildPersistObjects = function (dataView, includeHidden) {
        if (includeHidden === void 0) { includeHidden = false; }
        return helpers_1.buildPersistObjects(this.constructor, this, dataView, includeHidden);
    };
    /**
     * Converts this class into a json object.
     */
    HasSettings.prototype.toJSONObject = function () {
        return helpers_1.toJSON(this.constructor, this);
    };
    return HasSettings;
}());
exports.HasSettings = HasSettings;
//# sourceMappingURL=HasSettings.js.map