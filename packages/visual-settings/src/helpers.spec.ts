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

import * as helpers from './helpers'
import { ISetting } from './interfaces'
import { expect } from 'chai'
import * as _ from 'lodash'

describe('Helpers', () => {
	describe('buildPersistObjects', () => {
		it("should not crash if a 'setting' returns undefined from compose", () => {
			const { settings, classType } = createClassWithSettings()
			helpers.buildPersistObjects(classType, new classType(), undefined)
		})
		it('should correctly persist settings that return a set of VisualObjectInstances', () => {
			const { settings, classType } = createClassWithSettings()
			const result = helpers.buildPersistObjects(
				classType,
				new classType(),
				undefined
			)
			expect(result.merge.length).to.be.eq(3) // There are 3 settings with actual values in `createClassWithSettings`.

			const misettingsObjects = result.merge.filter(
				n => n.objectName === 'misettings'
			)
			expect(misettingsObjects.length).to.be.equal(2) // There are two instances in this setting

			expect(misettingsObjects).to.be.deep.equal([
				{
					objectName: 'misettings',
					selector: 'A',
					properties: {
						settingThatReturnsMultipleInstances: true,
						someOtherValue: '5'
					}
				},
				{
					objectName: 'misettings',
					selector: 'B',
					properties: {
						settingThatReturnsMultipleInstances: false,
						someOtherValue: '12'
					}
				}
			])
		})
		it('should not return a persist:false setting', () => {
			const { settings, classType } = createClassWithSettings()
			const objs = helpers.buildPersistObjects(
				classType,
				new classType(),
				undefined
			)
			const toCheck = (objs.merge || []).concat(objs.remove || [])

			console.log(JSON.stringify(objs, null, 2)) // tslint:disable-line

			expect(
				toCheck.filter(
					n =>
						// It should return NO objects with this setting name
						Object.keys(n.properties).indexOf(
							'persistFalseSetting'
						) >= 0
				).length
			).to.be.eq(0)
		})
		it('should not return a readOnly:true setting', () => {
			const { settings, classType } = createClassWithSettings()
			const objs = helpers.buildPersistObjects(
				classType,
				new classType(),
				undefined
			)
			const toCheck = (objs.merge || []).concat(objs.remove || [])

			expect(
				toCheck.filter(
					n =>
						// It should return NO objects with this setting name
						Object.keys(n.properties).indexOf('readOnlySetting') >=
						0
				).length
			).to.be.eq(0)
		})
	})

	describe('buildEnumerationObjects', () => {
		it('should not return an enumerable:false', () => {
			const { settings, classType } = createClassWithSettings()
			const objs = helpers.buildEnumerationObjects(
				classType,
				new classType(),
				'fakecategory',
				{} as any
			)

			expect(
				objs.filter(
					n =>
						Object.keys(n.properties).indexOf(
							'enumerableFalseSetting'
						) >= 0
				).length
			).to.be.eq(0)
		})
		it('should return persist:false setting', () => {
			const { settings, classType } = createClassWithSettings()
			const objs = helpers.buildEnumerationObjects(
				classType,
				new classType(),
				'fakecategory',
				{} as any
			)

			expect(
				objs.filter(
					n =>
						Object.keys(n.properties).indexOf(
							'persistFalseSetting'
						) >= 0
				).length
			).to.be.eq(1)
		})
		it('should not return a readOnly:true setting', () => {
			const { settings, classType } = createClassWithSettings()
			const objs = helpers.buildEnumerationObjects(
				classType,
				new classType(),
				'fakecategory',
				{} as any
			)

			expect(
				objs.filter(
					n =>
						Object.keys(n.properties).indexOf('readOnlySetting') >=
						0
				).length
			).to.be.eq(0)
		})
	})

	describe('parseSettingsFromPBI', () => {
		describe('without a dataView', () => {
			it("should not fail when passed a class that isn't a settings class", () => {
				const settings = helpers.parseSettingsFromPBI(
					ClassWithNoSettings,
					undefined,
					{
						anotherSetting: true
					}
				)
				expect(settings).to.be.ok
			})
			function settingsMergeTest(
				props: any,
				propsHasPrecedence: boolean,
				coerceNull = false
			) {
				const { settings, classType } = createClassWithSettings()
				const result = helpers.parseSettingsFromPBI(
					classType,
					undefined,
					props,
					propsHasPrecedence,
					coerceNull
				)

				// Make sure all of the values returned from parse settings are equal to the settings default values
				Object.keys(settings).forEach(n => {
					const s: ISetting = settings[n]
					let valueToCheck = s.descriptor.defaultValue
					if (props && props.hasOwnProperty(s.propertyName)) {
						valueToCheck = propsHasPrecedence
							? props[s.propertyName]
							: valueToCheck
						delete props[s.propertyName]
						valueToCheck =
							coerceNull && valueToCheck === null
								? undefined
								: valueToCheck // tslint:disable-line
					}
					expect(result[s.propertyName]).to.be.equal(valueToCheck) //tslint:disable-line
				})

				// Make sure that any prop passed that isn't a setting is also in the result
				Object.keys(props).forEach(p => {
					expect(result[p]).to.be.equal(
						coerceNull && props[p] === null ? undefined : props[p]
					) // tslint:disable-line
				})
			}
			it('should return all the default values of a settings class if there is no dataView', () => {
				settingsMergeTest({}, false)
			})
			it('should apply the addtional props on top of the values parsed from PBI if props has precedence', () => {
				settingsMergeTest(
					{
						textSetting: 'SOME OTHER VALUE'
					},
					true
				)
			})
			it("should apply props with 'undefined' on top of the values parsed from PBI if props has precedence", () => {
				settingsMergeTest(
					{
						textSetting: undefined
					},
					true
				)
			})
			it("should apply props with 'null' as undefined on top of the values parsed from PBI if props has precedence, and coerce is true", () => {
				// tslint:disable-line
				settingsMergeTest(
					{
						textSetting: null // tslint:disable-line
					},
					true,
					true
				)
			})
			it("should apply props with 'null' as 'null' on top of the values parsed from PBI if props has precedence, and coerce is false", () => {
				// tslint:disable-line
				settingsMergeTest(
					{
						textSetting: null // tslint:disable-line
					},
					true,
					false
				)
			})
			it("should add any additional props that aren't settings if props has precedence", () => {
				settingsMergeTest(
					{
						notASetting: 'ShouldBeHere' // tslint:disable-line
					},
					true
				)
			})
			it("should apply the addtional props before the values parsed from PBI if props doesn't have precedence", () => {
				settingsMergeTest(
					{
						textSetting: 'SOME OTHER VALUE'
					},
					false
				)
			})
			it("should apply props with 'undefined' before the values parsed from PBI if props doesn't have precedence", () => {
				settingsMergeTest(
					{
						textSetting: undefined
					},
					false
				)
			})
			it("should apply props with 'null' before the values parsed from PBI if props doesn't have precedence", () => {
				settingsMergeTest(
					{
						textSetting: null // tslint:disable-line
					},
					false
				)
			})
			it("should add any additional props that aren't settings if props does not have precedence", () => {
				settingsMergeTest(
					{
						notASetting: 'ShouldBeHere' // tslint:disable-line
					},
					false
				)
			})
		})

		describe('with a dataView', () => {
			it('should load values from a dataView', () => {
				const { settings, classType } = createClassWithSettings()
				let dv: powerbi.DataView = <any>{}
				dv = defineFakeSettingValueOnDataView(
					settings.numberSetting,
					1234,
					dv
				)

				const result = helpers.parseSettingsFromPBI(classType, dv)

				expect(result['numberSetting']).to.be.equal(1234)
			})
			it('should override values from the dataView with the props if props has precedence', () => {
				const { settings, classType } = createClassWithSettings()
				let dv: powerbi.DataView = <any>{}
				dv = defineFakeSettingValueOnDataView(
					settings.numberSetting,
					1234,
					dv
				)

				const result = helpers.parseSettingsFromPBI(
					classType,
					dv,
					{
						numberSetting: 54321 // this will take precedence
					},
					true
				)

				expect(result['numberSetting']).to.be.equal(54321)
			})
			it('should return values from the dataView if the props does not have precedence', () => {
				const { settings, classType } = createClassWithSettings()
				let dv: powerbi.DataView = <any>{}
				dv = defineFakeSettingValueOnDataView(
					settings.numberSetting,
					1234,
					dv
				)

				const result = helpers.parseSettingsFromPBI(
					classType,
					dv,
					{
						numberSetting: 54321 // this will take precedence
					},
					false
				)

				expect(result['numberSetting']).to.be.equal(1234)
			})
			it('should return the defaultValues if the dataView has undefined values and the props does not have precedence', () => {
				const { settings, classType } = createClassWithSettings()
				let dv: powerbi.DataView = <any>{}
				dv = defineFakeSettingValueOnDataView(
					settings.numberSetting,
					undefined,
					dv
				)

				const result = helpers.parseSettingsFromPBI(
					classType,
					dv,
					{
						numberSetting: 54321 // this will take precedence
					},
					false
				)

				expect(result['numberSetting']).to.be.eq(0)
			})
			it('should return the defaultValues if the dataView has null values and the props does not have precedence', () => {
				const { settings, classType } = createClassWithSettings()
				let dv: powerbi.DataView = <any>{}
				dv = defineFakeSettingValueOnDataView(
					settings.numberSetting,
					null,
					dv
				) // tslint:disable-line

				const result = helpers.parseSettingsFromPBI(
					classType,
					dv,
					{
						numberSetting: 54321 // this will take precedence
					},
					false
				)

				expect(result['numberSetting']).to.be.eq(0)
			})
		})
	})

	describe('toJSON', () => {
		it('should convert settings that have no/undefined values to null', () => {
			const json = helpers.toJSON(ClassWithNoSettings, {
				test: undefined,
				test2: 3,
				nested: {
					nestedTest: undefined,
					nestedTest2: null, // tslint:disable-line
					nestedTest3: 0
				}
			})
			expect(json).to.be.deep.equal({
				test: null, // tslint:disable-line
				test2: 3,
				nested: {
					nestedTest: null, // tslint:disable-line
					nestedTest2: null, // tslint:disable-line
					nestedTest3: 0
				}
			})
		})
	})

	describe('convertValueFromPBI', () => {
		// it("should return 'null' for settings that do not have a value or a defaultValue", () => {
		//     const fakeSetting = createFakeSetting();
		//     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
		//     expect(result).to.be.ok;
		//     expect(result.adaptedValue).to.be.null;
		// });

		it("should return '3' for a setting that has the default value of '3'", () => {
			const fakeSetting = createFakeSetting(3)
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(3)
		})

		it("should return '0' for a setting that has the default value of '0'", () => {
			const fakeSetting = createFakeSetting(0)
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(0)
		})

		it("should return '0' for a setting that has the default value of '5' but the dataView has a value of '0'", () => {
			const fakeSetting = createFakeSetting(5)
			const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 0, {})
			const result = helpers.convertValueFromPBI(fakeSetting, fakeDV)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(0)
		})

		it("should return '5' for a setting that has the default value of '1' but the dataView has a value of '5'", () => {
			const fakeSetting = createFakeSetting(1)
			const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {})
			const result = helpers.convertValueFromPBI(fakeSetting, fakeDV)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(5)
		})

		it('should return undefined for a setting that has the default value of undefined', () => {
			const fakeSetting = createFakeSetting(1)
			const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {})
			const result = helpers.convertValueFromPBI(fakeSetting, fakeDV)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(5)
		})

		it('should return null for a setting that has the default value of null', () => {
			const fakeSetting = createFakeSetting(null) // tslint:disable-line
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.null
		})

		it('should call parse to parse a value from pbi', () => {
			const fakeSetting = createFakeSetting(1)
			let called = false
			fakeSetting.descriptor.parse = () => (called = true)
			helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(called).to.be.true
		})

		it('should call parse to parse with the correct settings, dataView, pbiValue, descriptor', () => {
			const fakeSetting = createFakeSetting(1)
			const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {})

			fakeSetting.descriptor.parse = (
				pbiValue: any,
				descriptor: any,
				dataView: any,
				setting: any
			) => {
				expect(pbiValue).to.be.equal(5)
				expect(descriptor).to.be.equal(fakeSetting.descriptor)
				expect(dataView).to.be.equal(fakeDV)
				expect(setting).to.be.equal(fakeSetting)
			}

			helpers.convertValueFromPBI(fakeSetting, fakeDV)
		})

		it("should return '5' for a setting that has the default value of '5' and setting.parse returns undefined", () => {
			const fakeSetting = createFakeSetting(5)
			fakeSetting.descriptor.parse = () => <any>undefined
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(5)
		})

		it("should return '5' for a setting that has the default value of '5' and setting.parse returns null", () => {
			const fakeSetting = createFakeSetting(5)
			fakeSetting.descriptor.parse = () => <any>null // tslint:disable-line
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(5)
		})

		it("should return '10' for a setting that has the default value of '5' and setting.parse returns '10'", () => {
			const fakeSetting = createFakeSetting(5)
			fakeSetting.descriptor.parse = () => <any>10 // tslint:disable-line
			const result = helpers.convertValueFromPBI(fakeSetting, undefined)
			expect(result).to.be.ok
			expect(result.adaptedValue).to.be.equal(10)
		})

		// it("should return null for a setting that does not have a default value and setting.parse returns null", () => {
		//     const fakeSetting = createFakeSetting();
		//     fakeSetting.descriptor.parse = () => <any>null; // tslint:disable-line
		//     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
		//     expect(result).to.be.ok;
		//     expect(result.adaptedValue).to.be.null;
		// });

		// it("should return null for a setting that does not have a default value and setting.parse returns undefined", () => {
		//     const fakeSetting = createFakeSetting();
		//     fakeSetting.descriptor.parse = () => <any>undefined; // tslint:disable-line
		//     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
		//     expect(result).to.be.ok;
		//     expect(result.adaptedValue).to.be.null;
		// });
	})

	describe('convertValueToPBI', () => {
		it("should not crash if a 'setting' returns undefined", () => {
			const fakeSetting = createFakeSetting()
			const result = helpers.convertValueToPBI({}, fakeSetting, undefined)
			expect(result).to.be.ok
		})
	})
})

const u = undefined
function createClassWithSettings() {
	'use strict'
	class ClassWithSettings {}
	const settings = {
		textSetting: createFakeSetting(
			'TEST',
			'textSetting',
			ClassWithSettings
		),
		numberSetting: createFakeSetting(0, 'numberSetting', ClassWithSettings),
		boolSetting: createFakeSetting(false, 'boolSetting', ClassWithSettings),
		settingWithComposeReturningUndefined: createFakeSetting(
			null,
			'settingWithComposeReturningUndefined',
			ClassWithSettings,
			'undefinedsettings',
			() => {
				// tslint:disable-line
				return <any>undefined
			}
		),
		settingWithNullDefaultValue: createFakeSetting(
			null,
			'settingWithNullDefaultValue',
			ClassWithSettings
		), // tslint:disable-line
		settingWithNoDefaultValue: createFakeSetting(
			undefined,
			'settingWithNoDefaultValue',
			ClassWithSettings
		),
		settingThatReturnsMultipleInstances: createFakeSetting(
			undefined,
			'settingThatReturnsMultipleInstances',
			ClassWithSettings,
			'misettings',
			() => {
				return [
					{
						selector: 'A',
						properties: {
							settingThatReturnsMultipleInstances: true,
							someOtherValue: '5'
						}
					},
					{
						selector: 'B',
						properties: {
							settingThatReturnsMultipleInstances: false,
							someOtherValue: '12'
						}
					}
				]
			}
		),
		readOnlySetting: createFakeSetting(
			null,
			'readOnlySetting',
			ClassWithSettings,
			u,
			u,
			u,
			true
		),
		persistFalseSetting: createFakeSetting(
			null,
			'persistFalseSetting',
			ClassWithSettings,
			u,
			u,
			false
		),
		enumerableFalseSetting: createFakeSetting(
			null,
			'enumerableFalseSetting',
			ClassWithSettings,
			u,
			u,
			u,
			u,
			false
		)
	}
	ClassWithSettings.constructor[helpers.METADATA_KEY] = {
		settings
	}

	return {
		settings,
		classType: ClassWithSettings
	}
}

class ClassWithNoSettings {}
function createFakeSetting(
	defaultValue?: any,
	name?: string,
	classType?: any,
	category?: any,
	compose?: any,
	persist?: any,
	readOnly?: any,
	enumerable?: any
) {
	'use strict'
	return {
		propertyName: name || 'fakeprop',
		descriptor: {
			category: category || 'fakecategory',
			name: name || 'fakename',
			defaultValue: defaultValue,
			compose: compose,
			persist,
			readOnly,
			enumerable
		},
		classType: classType || ClassWithNoSettings,
		isChildSettings: false
	} as ISetting
}

function defineFakeSettingValueOnDataView(
	setting: any,
	value: any,
	dataView: any
) {
	'use strict'
	_.merge(dataView || {}, {
		metadata: <any>{
			objects: <any>{
				[setting.descriptor.category]: {
					[setting.descriptor.name]: value
				}
			}
		}
	})
	return dataView
}
