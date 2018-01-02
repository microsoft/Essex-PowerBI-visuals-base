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

import {
	createPersistObjectBuilder,
	IPersistObjectBuilder
} from '@essex/visual-utils'
import {
	ISetting,
	ISettingDescriptor,
	ISettingsClass,
	IComposeResult
} from './interfaces'

/* tslint:disable */
const ldget = require('lodash.get')
const merge = require('lodash.merge')
const assignIn = require('lodash.assignin')
const stringify = require('json-stringify-safe')
/* tslint:enable */

export const METADATA_KEY = '__settings__'

/**
 * Parses settings from powerbi dataview objects
 * @param settingsClass The class type of the class with the settings
 * @param dv The dataview to construct the settings from
 * @param props Any additional properties to merge into the settings object
 * @param propsHavePrecedence If true, the additional properties passed in should override any that are retrieved from PBI
 * @param coerceNullAsUndefined If true, the props that are 'null' will get converted to `undefined`
 */
export function parseSettingsFromPBI<T>(
	settingClass: ISettingsClass<T>,
	dv?: powerbi.DataView,
	props = {},
	propsHavePrecedence = true,
	coerceNullAsUndefined = true
): T {
	'use strict'
	const settingsMetadata = getSettingsMetadata(settingClass)
	const newSettings = new settingClass()

	// Merge the additional props in the beginning, cause the PBI parsed settings will override these
	// if necessary.
	assignIn(newSettings, props)

	if (settingsMetadata) {
		Object.keys(settingsMetadata).forEach(n => {
			const setting = settingsMetadata[n]
			const propertyName = setting.propertyName
			const addlProp = props[propertyName]
			let value: any
			if (setting.isChildSettings) {
				value = parseSettingsFromPBI(
					setting.childClassType as any,
					dv,
					addlProp,
					propsHavePrecedence
				)
			} else {
				if (
					propsHavePrecedence &&
					(addlProp || props.hasOwnProperty(propertyName))
				) {
					value =
						coerceNullAsUndefined && addlProp === null
							? undefined
							: addlProp // tslint:disable-line
				} else {
					const adapted = convertValueFromPBI(setting, dv)
					value = adapted.adaptedValue
				}
			}
			newSettings[propertyName] = value
		})
	}

	return newSettings
}

/**
 * Builds a set of persistance objects to be persisted from the current set of settings.  Can be used with IVisualHost.persistProperties
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export function buildPersistObjects<T>(
	settingsClass: ISettingsClass<T>,
	settingsObj: T,
	dataView: powerbi.DataView,
	includeHidden = true
): powerbi.VisualObjectInstancesToPersist {
	'use strict'
	if (settingsObj) {
		settingsObj = parseSettingsFromPBI(
			settingsClass,
			undefined,
			settingsObj
		) // Just in case they pass in a JSON version
		const settingsMetadata = getSettingsMetadata(settingsClass)
		if (settingsMetadata) {
			const builder = createPersistObjectBuilder()
			Object.keys(settingsMetadata).forEach(key => {
				const setting = settingsMetadata[key]
				const { readOnly, persist } = setting.descriptor
				if (setting.isChildSettings) {
					const childSettingValue = settingsObj[setting.propertyName]
					if (
						childSettingValue &&
						persist !== false &&
						readOnly !== true
					) {
						const childSettings = buildPersistObjects(
							setting.childClassType as any,
							settingsObj[setting.propertyName],
							dataView,
							includeHidden
						)
						builder.mergePersistObjects(childSettings)
					}
				} else {
					buildPersistObject(
						setting,
						settingsObj,
						dataView,
						includeHidden,
						builder
					)
				}
			})
			return builder.build()
		}
	}
}

/**
 * Builds a single persist object for the given setting
 * @param setting The setting to persist the value for
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 * @param builder The persist object builder to add the setting value to
 */
function buildPersistObject(
	setting: ISetting,
	settingsObj: any,
	dataView: powerbi.DataView,
	includeHidden = true,
	builder: IPersistObjectBuilder
) {
	'use strict'
	const { readOnly, persist } = setting.descriptor
	// There is no reason to run the setting conversion if it shouldn't even be persisted
	if (persist !== false && readOnly !== true) {
		const adapted = convertValueToPBI(
			settingsObj,
			setting,
			dataView,
			includeHidden
		)
		if (adapted) {
			const { objName, propName } = getPBIObjectNameAndPropertyName(
				setting
			)
			let value = adapted.adaptedValue
			value = value && value.forEach ? value : [value]
			value.forEach((n: any) => {
				const isVisualInstance = !!(n && n.properties)
				const instance = n as powerbi.VisualObjectInstance
				builder.persist(
					objName,
					propName,
					n,
					undefined,
					instance && instance.selector,
					instance && instance.displayName,
					isVisualInstance
				)
			})
		}
	}
}

/**
 * Builds the enumeration objects for the given settings object
 * @param settingsClass The class type of the class with the settings
 * @param settingsObj The instance of the class to read the current setting values from
 * @param objectName The objectName being requested from enumerateObjectInstances
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export function buildEnumerationObjects<T>(
	settingsClass: ISettingsClass<T>,
	settingsObj: T,
	objectName: string,
	dataView: powerbi.DataView,
	includeHidden = false
): powerbi.VisualObjectInstance[] {
	'use strict'
	let instances = [
		{
			selector: null, // tslint:disable-line
			objectName: objectName,
			properties: {}
		}
	] as powerbi.VisualObjectInstance[]
	if (settingsObj) {
		settingsObj = parseSettingsFromPBI(
			settingsClass,
			undefined,
			settingsObj
		) // Just in case they pass in a JSON version
		const settingsMetadata = getSettingsMetadata(settingsClass)
		if (settingsMetadata) {
			Object.keys(settingsMetadata).forEach(key => {
				const setting = settingsMetadata[key]
				if (setting.isChildSettings) {
					const childSettings = settingsObj[setting.propertyName]
					if (
						childSettings &&
						shouldEnumerate(
							settingsObj,
							setting.descriptor,
							dataView
						)
					) {
						instances = instances.concat(
							buildEnumerationObjects(
								setting.childClassType as any,
								childSettings,
								objectName,
								dataView,
								includeHidden
							)
						)
					}
				} else {
					const { objName } = getPBIObjectNameAndPropertyName(setting)
					const isSameCategory = objName === objectName
					if (isSameCategory) {
						buildEnumerationObject(
							setting,
							settingsObj,
							dataView,
							includeHidden,
							instances
						)
					}
				}
			})
		}
	}

	// If there are no settings, then return no instances
	instances = instances.filter(n => Object.keys(n.properties).length > 0)
	return instances
}

/**
 * Builds a single enumeration object for the given setting and adds it to the list of instances
 * TODO: Think about removing the `instances` param, and just returning an instance and making the caller
 * deal with how to add it
 * @param setting The setting to get the enumeration object for
 * @param settingsObj The instance of the class to read the current setting values from
 * @param dataView The dataview to construct the settings from
 * @param includeHidden If True, 'hidden' settings will be returned
 * @param instances The set of instances to add to
 */
function buildEnumerationObject(
	setting: ISetting,
	settingsObj: any,
	dataView: powerbi.DataView,
	includeHidden = false,
	instances: powerbi.VisualObjectInstance[]
) {
	'use strict'
	const { readOnly, enumerable } = setting.descriptor
	if (readOnly !== true && enumerable !== false) {
		const adapted = convertValueToPBI(
			settingsObj,
			setting,
			dataView,
			includeHidden
		)
		// There is no reason to run the setting conversion if it shouldn't even be enumerated
		if (adapted) {
			const { objName, propName } = getPBIObjectNameAndPropertyName(
				setting
			)
			let value = adapted.adaptedValue
			value = value && value.forEach ? value : [value]
			value.forEach((n: any) => {
				const isVisualInstance = !!(n && n.properties)
				let instance = n as powerbi.VisualObjectInstance
				if (isVisualInstance) {
					instance = merge(instance, {
						objectName: objName
					})
					if (
						typeof instance.displayName === 'undefined' ||
						instance.displayName === null
					) {
						// tslint:disable-line
						instance.displayName = '(Blank)'
					}
					instance.displayName = instance.displayName + '' // Some times there are numbers
					instances.push(instance)
				} else {
					instances[0].properties[propName] = adapted.adaptedValue
				}
			})
		}
	}
}

/**
 * Builds the capabilities objects dynamically from a settings class
 * @param settingsClass The settings class type to generate the capabilities object from
 */
export function buildCapabilitiesObjects<T>(
	settingsClass: ISettingsClass<T>
): any {
	'use strict'
	let objects: any
	if (settingsClass) {
		const settingsMetadata = getSettingsMetadata(settingsClass)
		if (settingsMetadata) {
			objects = {}
			Object.keys(settingsMetadata).map(key => {
				const setting = settingsMetadata[key]
				const { isChildSettings, childClassType } = setting
				if (isChildSettings) {
					if (setting.descriptor.readOnly !== true) {
						merge(objects, buildCapabilitiesObjects(childClassType))
					}
				} else {
					const catObj = buildCapabilitiesObject(setting)
					if (catObj) {
						const { objectName } = catObj
						const finalObj = objects[objectName] || catObj

						// This ensures all properties are merged into the final capabilities object
						// otherwise if we did assignIn at the "object" level, then the last
						// settings objects will prevail.  We also cannot use merge, cause it loses
						// functions
						assignIn(finalObj.properties, catObj.properties)
						objects[objectName] = finalObj
					}
				}
			})
		}
	}
	return objects
}

/**
 * Builds a single capabilities object for the given setting
 * @param setting The setting to generate the capabilities object from
 */
function buildCapabilitiesObject(setting: ISetting) {
	'use strict'
	const { objName, propName } = getPBIObjectNameAndPropertyName(setting)
	const {
		category,
		displayName,
		defaultValue,
		description,
		readOnly
	} = setting.descriptor
	let config = setting.descriptor.config
	const defaultCategory = 'General'
	if (readOnly !== true) {
		const catObj = {
			objectName: objName,
			displayName: category || defaultCategory,
			properties: {}
		}
		let type: any
		if (typeof defaultValue === 'number') {
			type = { numeric: true }
		} else if (typeof defaultValue === 'boolean') {
			type = { bool: true }
		} else if (typeof defaultValue === 'string') {
			type = { text: {} }
		}
		config = config || <any>{}
		const finalObj: any = {
			displayName: config.displayName || displayName || propName,
			description: config.description || description,
			type: config.type || type
		}
		if (config.rule) {
			finalObj.rule = config.rule
		}

		/*
        debug.assert(!!finalObj.type,
            `Could not infer type property for ${propertyName}, manually add it via \`config\``);
        */

		catObj.properties[propName] = finalObj
		return catObj
	}
}

/**
 * Converts the given settings object into a JSON object
 * @param settingsClass The settings class type to generate the JSON object for
 * @param instance The instance of settingsClass to get the values from
 */
export function toJSON<T>(settingsClass: ISettingsClass<T>, instance: any) {
	'use strict'

	// Preserve keys even though they are undefined.
	const newObj = JSON.parse(
		stringify(instance, (k: any, v: any) => (v === undefined ? null : v))
	) // tslint:disable-line
	return newObj
}

/**
 * Gets the settings metadata from the given object
 * @param obj The object to attempt to get the settings from
 */
function getSettingsMetadata(
	obj: ISettingsClass<any> | any
): { [key: string]: ISetting } {
	'use strict'
	let metadata: any
	if (obj) {
		metadata = ldget(obj, `${METADATA_KEY}.settings`)
		if (!metadata && obj.constructor) {
			metadata = ldget(obj.constructor, `${METADATA_KEY}.settings`)
		}
	}
	return metadata
}

/**
 * Gets the settings metadata from the given object
 * @param obj The object to get the setting from
 * @param key The name of the setting
 */
export function getSetting(obj: any, key: string): ISettingDescriptor<any> {
	'use strict'
	const metadata = getSettingsMetadata(obj)
	if (metadata && metadata[key]) {
		return metadata[key].descriptor
	}
}

/**
 * Gets the appropriate object name and property name for powerbi from the given setting
 * @param setting The setting to get the powerbi objectName and property name for.
 */
export function getPBIObjectNameAndPropertyName(setting: ISetting) {
	'use strict'
	const { propertyName, descriptor: { name, category } } = setting
	return {
		objName: camelize(category || 'General'),
		propName: (name || propertyName).replace(/\s/g, '_')
	}
}

/**
 * Converts the value of the given setting on the object to a powerbi compatible value
 * @param settingsObj The instance of a settings object
 * @param setting The setting to get the value for
 * @param dataView The dataView to pass to the setting
 * @param includeHidden If True, 'hidden' settings will be returned
 */
export function convertValueToPBI(
	settingsObj: any,
	setting: ISetting,
	dataView: powerbi.DataView,
	includeHidden: boolean = false
) {
	'use strict'
	const { descriptor, propertyName: fieldName } = setting
	const { compose, readOnly } = descriptor
	const enumerate = shouldEnumerate(settingsObj, descriptor, dataView)
	if ((includeHidden || enumerate) && readOnly !== true) {
		let value: IComposeResult = settingsObj[fieldName]
		if (compose) {
			value = compose(value, descriptor, dataView, setting)
		}
		return {
			adaptedValue: value as IComposeResult | any
		}
	}
}

/**
 * Converts the value for the given setting in PBI to a regular setting value
 * @param setting The setting to get the value for
 * @param dv The dataView to pass to the setting
 */
export function convertValueFromPBI(setting: ISetting, dv: powerbi.DataView) {
	'use strict'
	const objects: powerbi.DataViewObjects = ldget(dv, `metadata.objects`)
	const {
		descriptor,
		descriptor: { defaultValue, parse, min, max }
	} = setting
	const { objName, propName } = getPBIObjectNameAndPropertyName(setting)
	let value = ldget(objects, `${objName}.${propName}`)
	const hasDefaultValue =
		typeof defaultValue !== 'undefined' ||
		descriptor.hasOwnProperty('defaultValue')
	value = parse ? parse(value, descriptor, dv, setting) : value
	if (hasDefaultValue && (value === null || typeof value === 'undefined')) {
		// tslint:disable-line
		value = defaultValue // tslint:disable-line
	}
	if (typeof min !== 'undefined') {
		value = Math.max(min, value)
	}
	if (typeof max !== 'undefined') {
		value = Math.min(max, value)
	}
	return {
		adaptedValue: value /*typeof value === "undefined" ? null : value*/ //tslint:disable-line
	}
}

/**
 * Converts any string into a camel cased string
 * @param str The string to conver to camel case
 */
function camelize(str: string) {
	'use strict'
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
		})
		.replace(/\s+/g, '')
}

/**
 * Determines if the given descriptor should be enumerated
 * @param settingsObj The instance of the settings class
 * @param descriptor The descriptor to check
 * @param dataView The current dataView
 */
function shouldEnumerate(
	settingsObj: any,
	descriptor: ISettingDescriptor<any>,
	dataView: powerbi.DataView
) {
	'use strict'
	const { hidden, enumerable, readOnly } = descriptor
	if (readOnly === true) {
		return false
	}

	if (typeof enumerable !== 'undefined') {
		return !!(typeof enumerable === 'function'
			? enumerable(settingsObj, dataView)
			: enumerable)
	}
	return !(typeof hidden === 'function'
		? hidden(settingsObj, dataView)
		: hidden)
}

/**
 * Composes an object instance with the given values
 */
export function composeInstance(
	setting: ISetting,
	selector?: powerbi.data.Selector,
	displayName?: string,
	value?: any
) {
	'use strict'
	const { objName, propName } = getPBIObjectNameAndPropertyName(setting)
	return {
		objectName: objName,
		selector: selector,
		displayName: displayName,
		properties: {
			[propName]: value
		}
	}
}

/**
 * Gets all of the objects for the given column, if an id is specified, it looks for the specific instance with the given id
 */
export function getObjectsForColumn(
	column: powerbi.DataViewMetadataColumn,
	setting: ISetting,
	id?: string
) {
	'use strict'
	const { objName, propName } = getPBIObjectNameAndPropertyName(setting)
	const columnObjects = ldget(column, `objects.${objName}`)
	if (id) {
		return ldget(columnObjects, `$instances.${id}.${propName}`)
	} else {
		return ldget(columnObjects, `${propName}`)
	}
}

/**
 * Creates a selector for PBI that is for a specific column, and an optional unique user defined id
 * Having an id allows for storing multiple instances of objects under a single objectName/propertyName in VisualObjectInstancesToPersist
 */
export function createObjectSelectorForColumn(
	column: powerbi.DataViewMetadataColumn,
	id?: string
): powerbi.data.Selector {
	'use strict'
	return {
		metadata: column.queryName,
		id: id
	}
}
