/// <reference path="../../../node_modules/powerbi-visuals-tools/templates/visuals/.api/v1.3.0/PowerBI-visuals.d.ts"/>

import buildColumnTarget from './buildColumnTarget'
import { expect } from 'chai'

// Taken straight from PBI, just modified the names
const BASIC_COLUMN = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"Field","queryName":"Table.Field","expr":{"_kind":2,"source":{"_kind":0,"entity":"Table"},"ref":"Field"}}`
const HIERARCHICAL_COLUMN = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"My Table.Customer Name Hierarchy.My Field 2","expr":{"_kind":7,"arg":{"_kind":6,"arg":{"_kind":0,"entity":"My Table"},"hierarchy":"Customer Name Hierarchy"},"level":"My Field 2"}}`
const RENAMED_VISUAL_FIELD_COLUMN = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"RenamedUser","queryName":"My Table.User","expr":{"_kind":2,"source":{"_kind":0,"entity":"My Table"},"ref":"User"}}`
const HIERARCHICAL_COLUMN_WITH_RENAMED_TABLE = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"Orders.Customer Name Hierarchy.Customer Name","expr":{"_kind":7,"arg":{"_kind":6,"arg":{"_kind":0,"entity":"My Table"},"hierarchy":"Customer Name Hierarchy"},"level":"My Field 2"}}`
const RENAMED_TABLE = `{"roles":{"Category":true},"type":{"underlyingType":1,"category":null},"displayName":"My Field 2","queryName":"Orders.Customer Name","expr":{"_kind":2,"source":{"_kind":0,"entity":"My Table"},"ref":"My Field 2"}}`

describe('buildColumnTarget', () => {
	it('should generate a correct target from a basic column', () => {
		const expected = {
			table: 'Table',
			column: 'Field'
		}
		const result = buildColumnTarget(JSON.parse(BASIC_COLUMN))
		expect(result).to.be.deep.equal(expected)
	})
	it('should generate a correct target from a field that has been renamed at the visual level', () => {
		const expected = {
			table: 'My Table',
			column: 'User'
		}
		const result = buildColumnTarget(
			JSON.parse(RENAMED_VISUAL_FIELD_COLUMN)
		)
		expect(result).to.be.deep.equal(expected)
	})

	it('should generate a correct target from a field that is in a hierarchy', () => {
		const expected = {
			table: 'My Table',
			column: 'My Field 2'
		}
		const result = buildColumnTarget(JSON.parse(HIERARCHICAL_COLUMN))
		expect(result).to.be.deep.equal(expected)
	})

	it('should generate a correct target from a field, when the table the field comes from has been renamed', () => {
		const expected = {
			table: 'My Table',
			column: 'My Field 2'
		}
		const result = buildColumnTarget(JSON.parse(RENAMED_TABLE))
		expect(result).to.be.deep.equal(expected)
	})

	// This happens if you create a hierarchical field, bind the first column within the field to the visual
	// then rename the table that the column came from.
	it('should generate a correct target from a field that is in a hierarchy, that has had the parent table renamed', () => {
		const expected = {
			table: 'My Table',
			column: 'My Field 2'
		}
		const result = buildColumnTarget(
			JSON.parse(HIERARCHICAL_COLUMN_WITH_RENAMED_TABLE)
		)
		expect(result).to.be.deep.equal(expected)
	})
})
