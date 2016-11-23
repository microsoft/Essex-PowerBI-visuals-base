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

import { colorSetting as color, numberSetting as num } from "../decorators";
import { HasSettings } from "../HasSettings";
import { IGradient } from "../../utils/interfaces";

/**
 * A set of gradient settings
 */
export class GradientSettings extends HasSettings implements IGradient {

    /**
     * The start color for the gradient
     */
    @color({
        displayName: "Start color",
        description: "The start color of the gradient",
        defaultValue: "#bac2ff",
    })
    public startColor?: string;

    /**
     * The end color for the gradient
     */
    @color({
        displayName: "End color",
        description: "The end color of the gradient",
        defaultValue: "#0229bf",
    })
    public endColor?: string;

    /**
     * The start value of the gradient
     */
    @num({
        displayName: "Start Value",
        description: "The value to use as the start value",
    })
    public startValue?: number;

    /**
     * The end value of the gradient
     */
    @num({
        displayName: "End Value",
        description: "The value to use as the end value",
    })
    public endValue?: number;

    /**
     * Determines if this color settings is equal to another
     */
    public equals(other: GradientSettings) {
        if (other) {
            return (this.startColor || undefined) === (other.startColor || undefined) &&
                (this.endColor || undefined) === (other.endColor || undefined) &&
                (this.endValue || undefined) === (other.endValue || undefined) &&
                (this.startValue || undefined) === (other.startValue || undefined);
        }
        return false;
    }
}
