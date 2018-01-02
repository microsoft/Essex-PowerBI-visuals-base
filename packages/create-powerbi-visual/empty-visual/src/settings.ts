/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

//
// This is pretty hacky. The PowerBI utils use Typescript namespaces, which are awkward to use here.
//
/// <reference path="../node_modules/powerbi-visuals-utils-typeutils/lib/index.d.ts" />
/// <reference path="../node_modules/powerbi-visuals-utils-svgutils/lib/index.d.ts" />
/// <reference path="../node_modules/powerbi-visuals-utils-dataviewutils/lib/index.d.ts" />
import 'script-loader!powerbi-visuals-utils-typeutils/lib/index'
import 'script-loader!powerbi-visuals-utils-svgutils/lib/index'
import 'script-loader!powerbi-visuals-utils-dataviewutils/lib/index'

export class VisualSettings extends powerbi.extensibility.utils.dataview
	.DataViewObjectsParser {
	public dataPoint: DataPointSettings = new DataPointSettings()
}

export class DataPointSettings {
	// Default color
	public defaultColor: string = ''
	// Show all
	public showAllDataPoints: boolean = true
	// Fill
	public fill: string = ''
	// Color saturation
	public fillRule: string = ''
	// Text Size
	public fontSize: number = 12
}
