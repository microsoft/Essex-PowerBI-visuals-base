/// <reference path="../../../node_modules/powerbi-visuals-tools/templates/visuals/.api/v1.3.0/PowerBI-visuals.d.ts"/>

import calcUpdateType from './calcUpdateType'
import { expect } from 'chai'
import UpdateType from './UpdateType'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

describe('calcUpdateType', () => {
	const VALUES_ONLY_UPDATE = () =>
		<any>{
			viewport: {},
			dataViews: [
				{
					categorical: {
						values: [
							{
								values: [0],
								highlights: [null] // tslint:disable-line
							}
						]
					}
				}
			]
		}
	const VALUES_ONLY_UPDATE_WITH_HIGHLIGHTS = () =>
		<any>{
			viewport: {},
			dataViews: [
				{
					categorical: {
						values: [
							{
								values: [0],
								highlights: [123456]
							}
						]
					}
				}
			]
		}
	it("should return 'Unknown' if the highlights have not changed and checkHighlights is true", () => {
		const updateType = calcUpdateType(
			VALUES_ONLY_UPDATE_WITH_HIGHLIGHTS(),
			VALUES_ONLY_UPDATE_WITH_HIGHLIGHTS(),
			{
				checkHighlights: true
			}
		)

		expect(updateType).to.be.equal(UpdateType.Unknown)
	})
	it("should return 'Data' if the highlights have changed and checkHighlights is true", () => {
		const updateType = calcUpdateType(
			VALUES_ONLY_UPDATE(),
			VALUES_ONLY_UPDATE_WITH_HIGHLIGHTS(),
			{
				checkHighlights: true
			}
		)

		expect(updateType).to.be.equal(UpdateType.Data)
	})
	it("should return 'Unknown' if the highlights have changed but checkHighlights is false", () => {
		const updateType = calcUpdateType(
			VALUES_ONLY_UPDATE(),
			VALUES_ONLY_UPDATE_WITH_HIGHLIGHTS(),
			{
				checkHighlights: false
			}
		)

		expect(updateType).to.be.equal(UpdateType.Unknown)
	})

	/**
	 * Runs a update test that validates that the given update options returns the given update type
	 */
	const runUpdateTest = (
		options: VisualUpdateOptions,
		updateType: UpdateType,
		directCompare = false
	) => {
		if (options) {
			options.viewport = <any>{}
		}
		let expected = calcUpdateType(undefined, options)
		if (!directCompare) {
			expected &= updateType
		}
		expect(expected).to.eq(updateType)
	}
	const runMultipleUpdateTests = (
		o1: VisualUpdateOptions,
		o2: VisualUpdateOptions,
		updateType: UpdateType,
		directCompare = false
	) => {
		if (o1 && !o1.viewport) {
			o1.viewport = <any>{}
		}
		if (o2 && !o2.viewport) {
			o2.viewport = <any>{}
		}
		calcUpdateType(undefined, o1)
		let expected = calcUpdateType(o1, o2)
		if (!directCompare) {
			expected &= updateType
		}
		expect(expected).to.eq(updateType)
	}

	const resizeAndDataUpdateOptions = ({
		dataViews: [{}],
		resizeMode: 1
	} as any) as VisualUpdateOptions

	const simpleSettingsUpdateOptions = ({
		dataViews: [
			{
				metadata: {
					objects: {
						whatever: 'whatever'
					}
				}
			}
		]
	} as any) as VisualUpdateOptions

	const dataRoleTest = (
		role1: string,
		role2: string,
		type: UpdateType,
		directCompare = false
	) => {
		runMultipleUpdateTests(
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									roles: {
										[role1]: true
									}
								}
							]
						}
					}
				]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									roles: {
										[role2]: true
									}
								}
							]
						}
					}
				]
			} as any,
			type,
			directCompare
		)
	}

	const sortTest = (
		sort1: boolean,
		sort2: boolean,
		type: UpdateType,
		directCompare = false
	) => {
		runMultipleUpdateTests(
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									sort: sort1
								}
							]
						}
					}
				]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									sort: sort2
								}
							]
						}
					}
				]
			} as any,
			type,
			directCompare
		)
	}

	interface IAggregate {
		minLocal?: number
		maxLocal?: number
	}

	const aggregatesTest = (
		aggregatesOne: IAggregate,
		aggregatesTwo: IAggregate,
		type: UpdateType,
		directCompare = false
	) => {
		runMultipleUpdateTests(
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									aggregates: aggregatesOne
								}
							]
						}
					}
				]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							columns: [
								{
									queryName: 'MyQuery',
									aggregates: aggregatesTwo
								}
							]
						}
					}
				]
			} as any,
			type,
			directCompare
		)
	}

	const identityTest = (
		identities1: any[],
		identities2: any[],
		type: UpdateType,
		directCompare = false
	) => {
		runMultipleUpdateTests(
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: identities1
								}
							]
						}
					}
				]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: identities2
								}
							]
						}
					}
				]
			} as any,
			type,
			directCompare
		)
	}

	const settingsTest = (
		sn1: string,
		sn2: string,
		type: UpdateType,
		directCompare = false
	) => {
		runMultipleUpdateTests(
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							objects: {
								whatever: sn1
							}
						}
					}
				]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [
								{
									identity: [
										{
											key: 'KEY'
										}
									]
								}
							]
						},
						metadata: {
							objects: {
								whatever: sn2
							}
						}
					}
				]
			} as any,
			type,
			directCompare
		)
	}

	it('should return Initial on first run', () =>
		runUpdateTest(<any>{}, UpdateType.Initial))
	it('should return Unknown when nothing has changed twice', () => {
		runMultipleUpdateTests(<any>{}, <any>{}, UpdateType.Unknown, true)
	})
	it('should return Resize initially cause it was invisible before', () =>
		runUpdateTest(<any>{}, UpdateType.Resize))
	it('should return Resize when resizing', () =>
		runUpdateTest(<any>{ resizeMode: 1 }, UpdateType.Resize))
	it('should return Resize when resizing and data has changed initially', () =>
		runUpdateTest(resizeAndDataUpdateOptions, UpdateType.Resize))
	it('should return Data when resizing and data has changed initially', () =>
		runUpdateTest(resizeAndDataUpdateOptions, UpdateType.Data))
	it('should return Settings when settings have changed intially', () =>
		runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Settings))
	it('should return Settings when settings have changed and data has changed intially', () =>
		runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Data))
	it('should return Settings when settings have changed', () =>
		settingsTest('setting1', 'diff_setting', UpdateType.Settings))
	it('should NOT return Settings when settings have NOT changed', () =>
		settingsTest('setting1', 'setting1', UpdateType.Unknown, true))
	it('should return Settings when settings have changed twice and data has changed initially', () => {
		runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Data)
	})
	it('should return Data when the number of categories changed', () => {
		runMultipleUpdateTests(
			{
				dataViews: [{}]
			} as any,
			{
				dataViews: [
					{
						categorical: {
							categories: [{}]
						}
					}
				]
			} as any,
			UpdateType.Data
		)
	})
	it('should NOT return Data when the number of categories has not changed', () =>
		identityTest(
			[{ key: 'KEY1' }],
			[{ key: 'KEY1' }],
			UpdateType.Unknown,
			true
		))
	it('should return Data when the number of categories has not changed, but the underlying data has', () =>
		identityTest(
			[{ key: 'KEY1' }],
			[{ key: 'DIFFERENT_KEY' }],
			UpdateType.Data
		))
	it('should return Data when the number of categories has changed, and the underlying data has changed', () =>
		identityTest(
			[{ key: 'KEY1' }],
			[{ key: 'KEY1' }, { key: 'KEY2' }],
			UpdateType.Data
		))
	it('should return Unknown when undefined is passed to it', () =>
		identityTest(undefined, undefined, UpdateType.Unknown, true))
	it('should return Data when undefined is passed to one of the data sets', () =>
		identityTest([{ key: 'KEY1' }], undefined, UpdateType.Data))
	it('should return Data when undefined is passed to the other one of the data sets', () =>
		identityTest(undefined, [{ key: 'KEY1' }], UpdateType.Data))
	it('should return Data when the same identity array is mutated', () => {
		const identities = [{ key: 'KEY1' }]
		const arr = {
			viewport: {},
			dataViews: [
				{
					categorical: {
						categories: [
							{
								identity: identities
							}
						]
					}
				}
			]
		} as any

		calcUpdateType(undefined, arr)

		identities.push({
			key: 'KEY2'
		})

		expect(calcUpdateType(arr, arr)).to.eq(UpdateType.Data)
	})
	it('should return Data when the number of categories has changed, and the underlying data has changed not in the first, middle or last position', () =>
		// tslint:disable-line
		identityTest(
			[
				{ key: 'KEY1' },
				{ key: 'KEY2' },
				{ key: 'KEY3' },
				{ key: 'KEY4' }
			],
			[
				{ key: 'KEY1' },
				{ key: 'KEY2' },
				{ key: 'DIFF KEY' },
				{ key: 'KEY4' }
			],
			UpdateType.Data
		))

	it('should return Data when the metadata columns have changed data roles', () =>
		dataRoleTest('ROLE_1', 'ROLE_2', UpdateType.Data))
	it('should NOT return Data when the metadata columns have NOT changed data roles', () =>
		dataRoleTest('ROLE_1', 'ROLE_1', UpdateType.Unknown, true))

	it('should return Data when the metadata columns have changed sort', () => {
		sortTest(true, false, UpdateType.Data)
		sortTest(undefined, false, UpdateType.Data)
		sortTest(undefined, true, UpdateType.Data)
		sortTest(false, true, UpdateType.Data)
		sortTest(false, undefined, UpdateType.Data)
	})
	it('should NOT return Data when the metadata columns have NOT changed sort', () =>
		sortTest(true, true, UpdateType.Unknown, true))
	it('should NOT return Data when the metadata columns have NOT changed sort', () =>
		sortTest(undefined, undefined, UpdateType.Unknown, true))

	it('should return Data when the metadata columns have changed aggregates', () => {
		const a1 = { minLocal: 0, maxLocal: 0 }
		const a2 = { minLocal: 10, maxLocal: 20 }
		aggregatesTest(a1, a2, UpdateType.Data)
		aggregatesTest(undefined, a2, UpdateType.Data)
		aggregatesTest(undefined, a1, UpdateType.Data)
		aggregatesTest(a1, undefined, UpdateType.Data)
		aggregatesTest(a2, undefined, UpdateType.Data)
	})
	it('should NOT return Data when the metadata columns have NOT changed aggregates', () =>
		aggregatesTest(
			{ minLocal: 10, maxLocal: 20 },
			{ minLocal: 10, maxLocal: 20 },
			UpdateType.Unknown,
			true
		))
	it('should NOT return Data when the metadata columns have changed and then a resize occurs', () => {
		const dvs = [
			{
				categorical: {
					categories: [
						{
							identity: [
								{
									key: 'KEY'
								}
							]
						}
					]
				}
			}
		]
		runMultipleUpdateTests(
			{
				dataViews: dvs
			} as any,
			{
				dataViews: dvs,
				viewport: {
					width: 200,
					height: 200
				}
			} as any,
			UpdateType.Resize,
			true
		)
	})
})
