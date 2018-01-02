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

import * as $ from 'jquery'
import global from './testSetup' // tslint:disable-line
import './mockPBI'

const noop = <any>function() {} // tslint:disable-line

global['$'] = $
export const Utils = {
	// tslint:disable-line
	FAKE_TABLE_DATA_ONE_COLUMN: <powerbi.DataView>{
		metadata: <powerbi.DataViewMetadata>{},
		table: {
			columns: <powerbi.DataViewMetadataColumn[]>[
				{
					displayName: 'COLUMN_1',
					type: <any>{
						text: true
					}
				}
			],
			rows: [['COLUMN_1_ROW_1'], ['COLUMN_1_ROW_2']]
		}
	},

	FAKE_TABLE_DATA_TWO_COLUMN: <powerbi.DataView>{
		metadata: <powerbi.DataViewMetadata>{},
		table: {
			columns: <powerbi.DataViewMetadataColumn[]>[
				{
					displayName: 'COLUMN_1',
					type: <any>{
						text: true
					}
				},
				{
					displayName: 'COLUMN_2',
					type: <any>{
						numeric: true
					}
				}
			],
			rows: [['COLUMN_1_ROW_1', 1], ['COLUMN_1_ROW_2', 2]]
		}
	},

	createElement: () => {
		return $('<div>')
	},

	createUpdateOptionsWithSmallData: () => {
		return <powerbi.extensibility.visual.VisualUpdateOptions>{
			viewport: {
				width: 100,
				height: 100
			},
			dataViews: [Utils.FAKE_TABLE_DATA_ONE_COLUMN]
		}
	},

	createUpdateOptionsWithData: () => {
		return <powerbi.extensibility.visual.VisualUpdateOptions>{
			viewport: {
				width: 100,
				height: 100
			},
			dataViews: [Utils.FAKE_TABLE_DATA_TWO_COLUMN]
		}
	},

	createFakeHost: () => {
		return <powerbi.extensibility.visual.IVisualHost>{
			createSelectionIdBuilder: noop,
			persistProperties: noop,
			createSelectionManager: () => ({
				getSelectionIds: () => <any[]>[]
			})
		}
	},

	createFakeConstructorOptions: () => {
		return <powerbi.extensibility.visual.VisualConstructorOptions>{
			element: Utils.createElement()[0],
			host: Utils.createFakeHost()
			// viewport: {
			//     width: 100,
			//     height: 100,
			// },
		}
	}
}
