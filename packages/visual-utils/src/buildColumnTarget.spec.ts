/// <reference path="../../../node_modules/powerbi-visuals-tools/templates/visuals/.api/v1.3.0/PowerBI-visuals.d.ts"/>

import buildColumnTarget from './buildColumnTarget'
import { expect } from 'chai'
import { IFilterColumnTarget } from 'powerbi-models'

describe('buildColumnTarget', () => {
	const doColumnTargetTest = (testData: string) => {
		const result = buildColumnTarget(JSON.parse(testData))
		expect(result).to.be.deep.equal({
			table: 'My Table',
			column: 'My Field 2'
		})
	}

	it('should generate a correct target from a basic column', () => {
		const basic = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"My Table.My Field 2","expr":{"_kind":2,"source":{"_kind":0,"entity":"My Table"},"ref":"My Field 2"}}`
		doColumnTargetTest(basic)
	})
	it('should generate a correct target from a field that has been renamed at the visual level', () => {
		const renamed = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"RenamedField","queryName":"My Table.My Field 2","expr":{"_kind":2,"source":{"_kind":0,"entity":"My Table"},"ref":"My Field 2"}}`
		doColumnTargetTest(renamed)
	})

	it('should generate a correct target from a field that is in a hierarchy', () => {
		const hierarchical = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"My Table.Customer Name Hierarchy.My Field 2","expr":{"_kind":7,"arg":{"_kind":6,"arg":{"_kind":0,"entity":"My Table"},"hierarchy":"Customer Name Hierarchy"},"level":"My Field 2"}}`
		doColumnTargetTest(hierarchical)
	})

	it('should generate a correct target from a field, when the table the field comes from has been renamed', () => {
		const renamedTable = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"Orders.Customer Name","expr":{"_kind":2,"source":{"_kind":0,"entity":"My Table"},"ref":"My Field 2"}}`
		doColumnTargetTest(renamedTable)
	})

	// This happens if you create a hierarchical field, bind the first column within the field to the visual
	// then rename the table that the column came from.
	it('should generate a correct target from a field that is in a hierarchy, that has had the parent table renamed', () => {
		const hierarchicalRenamed = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"Orders.Customer Name Hierarchy.Customer Name","expr":{"_kind":7,"arg":{"_kind":6,"arg":{"_kind":0,"entity":"My Table"},"hierarchy":"Customer Name Hierarchy"},"level":"My Field 2"}}`
		doColumnTargetTest(hierarchicalRenamed)
	})
})
