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

export interface IDimensions {
    width: number;
    height: number;
};

export interface IReceiveDimensions extends powerbi.extensibility.visual.IVisual {
    setDimensions(dimensions: IDimensions): void;
}

/**
 * Represents a class that implements a IStateful interface
 */
export interface DimensionReceiverClass<T extends IReceiveDimensions>{
    new (...args: any[]): T;
}

export function receiveDimensions<T extends IReceiveDimensions>(target: DimensionReceiverClass<T>): any {
    "use strict";
    class ReceivesUpdateClass extends (target as DimensionReceiverClass<IReceiveDimensions>) {
        constructor(...args: any[]) {
            args = args || [];
            super(...args);
        }
        public update(options: powerbi.extensibility.visual.VisualUpdateOptions) {
            const { width, height } = options.viewport;
            this.setDimensions({ width, height });
            if (super.update) {
                super.update(options);
            }
        }
    }
    return ReceivesUpdateClass as any;
}
