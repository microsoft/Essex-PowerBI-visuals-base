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
import UpdateType from "./UpdateType";
import { default as calcUpdateType, ICalcUpdateTypeOptions } from "./calcUpdateType";
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

/**
 * Decorator indicating that a given visual is stateful
 */
export function receiveUpdateType(addlOptions: ICalcUpdateTypeOptions|boolean = false) {
    "use strict";
    return function decorateReceiveUpdateType(target: UpdateTypeReceiverClass<any>): any {
        "use strict";
        class ReceivesUpdateType extends (target as UpdateTypeReceiverClass<IUpdateTypeReceiver>) {
            private __prevOptions: VisualUpdateOptions; // tslint:disable-line
            private __receivingUpdateType = false; // tslint:disable-line
            public update(options: VisualUpdateOptions) {
                const doUpdateType = !this.__receivingUpdateType;
                this.__receivingUpdateType = true;
                if (super.update) {
                    super.update(options);
                }
                if (doUpdateType) {
                    this.__receivingUpdateType = true;
                    let updateType = calcUpdateType(this.__prevOptions, options, addlOptions);
                    this.updateWithType(options, updateType);
                    this.__prevOptions = options;
                    this.__receivingUpdateType = false;
                }
            }
        }
        return ReceivesUpdateType as any;
    };
}

/**
 * Represents a class that implements a IStateful interface
 */
export interface UpdateTypeReceiverClass<T> {
    new (...args: any[]): IUpdateTypeReceiver;
}

export interface IUpdateTypeReceiver extends powerbi.IVisual {
    updateWithType(update: VisualUpdateOptions, updateType: UpdateType): void;
}
