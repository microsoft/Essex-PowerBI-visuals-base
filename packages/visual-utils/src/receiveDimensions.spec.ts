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
/// <reference path="../../../node_modules/powerbi-visuals-tools/templates/visuals/.api/v1.3.0/PowerBI-visuals.d.ts"/>
import 'mocha'
import { expect } from 'chai'
import {
	IDimensions,
	IReceiveDimensions,
	receiveDimensions
} from './receiveDimensions'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

class BaseRawDimensional implements IReceiveDimensions {
	public dimensions: IDimensions
	public updateOptions: VisualUpdateOptions

	public setDimensions(dimensions: IDimensions) {
		this.dimensions = dimensions
	}

	public update(options: VisualUpdateOptions) {
		this.updateOptions = options
	}
}

class BasePBIDimensional extends BaseRawDimensional
	implements powerbi.extensibility.visual.IVisual {
	public updateOptions: VisualUpdateOptions

	public update(options: VisualUpdateOptions) {
		this.updateOptions = options
	}
}

describe('receiveDimensions', () => {
	it('will can decorate class, and not interfere with reflection', () => {
		@receiveDimensions
		class Test extends BaseRawDimensional {}

		const instance = new Test()
		expect(instance instanceof Test).to.be.true
		expect(instance instanceof BaseRawDimensional).to.be.true
	})

	it('will set dimensions on init and update', () => {
		@receiveDimensions
		class Test extends BasePBIDimensional {}

		const instance = new Test()
		expect(instance instanceof Test).to.be.true
		expect(instance instanceof BaseRawDimensional).to.be.true
		expect(instance instanceof BasePBIDimensional).to.be.true

		instance.update({
			viewport: { width: 30, height: 40 }
		} as VisualUpdateOptions)
		expect(instance.dimensions).to.deep.equal({ width: 30, height: 40 })

		expect(instance.updateOptions).to.be.ok
	})
})
