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

/**
 * Diffs the two given lists
 * @param existingItems The current list of items
 * @param newItems The new set of items
 * @param differ The interface for comparing items and add/remove events
 * @param <M>
 */
// TODO: Think about a param that indicates if should be merged into
/// existingItems should be modified, or if only the differ should be called
import { IDiffProcessor } from './IDiffProcessor'

export default function listDiff<M>(
	existingItems: M[],
	newItems: M[],
	differ: IDiffProcessor<M>
) {
	'use strict'
	existingItems = existingItems || []
	newItems = newItems || []

	let existing: M
	let found: boolean = false
	let curr: M
	let foundItem: M

	// Go backwards so we can remove without screwing up the index
	for (let i = existingItems.length - 1; i >= 0; i--) {
		existing = existingItems[i]
		found = false
		for (let j = 0; j < newItems.length; j++) {
			curr = newItems[j]
			if (differ.equals(curr, existing)) {
				found = true
			}
		}
		if (!found) {
			existingItems.splice(i, 1)

			if (differ.onRemove) {
				differ.onRemove(existing)
			}
		}
	}

	existing = undefined

	// Go through the existing ones and add the missing ones
	for (let i = 0; i < newItems.length; i++) {
		curr = newItems[i]
		foundItem = undefined

		for (let j = 0; j < existingItems.length; j++) {
			existing = existingItems[j]
			if (differ.equals(curr, existing)) {
				foundItem = existing
			}
		}
		if (!foundItem) {
			existingItems.push(curr)
			if (differ.onAdd) {
				differ.onAdd(curr)
			}
		} else if (differ.onUpdate) {
			differ.onUpdate(foundItem, curr)
		}
	}
}
