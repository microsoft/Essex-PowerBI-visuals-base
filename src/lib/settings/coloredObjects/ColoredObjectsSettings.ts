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

import { IColorSettings, ColorMode, IColoredObject } from "../../utils/interfaces";
import { dataSupportsValueSegments, dataSupportsColorizedInstances, dataSupportsGradients } from "../../utils/convertItemsWithSegments";
import { instanceColorSetting, enumSetting } from "../decorators";
import { setting } from "../settingDecorator";
import { HasSettings } from "../HasSettings";
import { GradientSettings, gradientSetting } from "../gradient";
import { fullColors } from "../../colors";

/**
 * A set of color settings which control how objects are colored
 */
export class ColoredObjectsSettings extends HasSettings implements IColorSettings {

    /**
     * The colors to use for individual instances in the dataSet
     */
    @instanceColorSetting<ColoredObjectsSettings>({
        name: "fill",
        defaultValue: (idx) => fullColors[idx] || "#ccc",
        enumerable: (s, dv) => dataSupportsColorizedInstances(dv) && !(s.colorMode === ColorMode.Gradient),
    })
    public instanceColors: IColoredObject[];

    /**
     * The mode of colorization to use
     */
    @enumSetting(ColorMode, {
        displayName: "Color Mode",
        defaultValue: ColorMode.Instance,
        description: "Determines how the individual bars within the time brush are colored",
    })
    public colorMode: ColorMode;

    /**
     * The set of gradient settings
     */
    @gradientSetting<ColoredObjectsSettings>({
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && (s.colorMode === ColorMode.Gradient),
    })
    public gradient: GradientSettings;

    /**
     * If the order of the bars should be reversed
     */
    @setting<ColoredObjectsSettings>({
        displayName: "Reverse Order",
        description: "If enabled, the order of the bars will be reversed",
        defaultValue: false,
        hidden: (settings, dataView) => !dataSupportsValueSegments(dataView),
    })
    public reverseOrder?: boolean;

    /**
     * Determines if this color settings is equal to another
     */
    public equals(other: ColoredObjectsSettings) {
        if (other) {
            const otherGradient = other.gradient || undefined;
            const gradient = this.gradient || undefined;
            if (gradient && !otherGradient ||
                otherGradient && !gradient) {
                return false;
            }

            const otherInstances = other.instanceColors || [];
            const instanceColors = this.instanceColors || [];
            if (otherInstances.length !== instanceColors.length) {
                return false;
            }

            const anyInstanceChanges = instanceColors.some((n, j) => {
                const otherInstance = otherInstances[j];
                // TODO: Id Check
                return otherInstance.name !== n.name || otherInstance.color !== n.color;
            });

            return !anyInstanceChanges &&
                (gradient === otherGradient || gradient.equals(otherGradient)) &&
                this.reverseOrder === other.reverseOrder &&
                this.colorMode === other.colorMode;
        }
        return false;
    }
}
