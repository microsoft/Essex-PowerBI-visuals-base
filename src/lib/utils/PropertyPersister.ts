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

declare var _: any;

/**
 * A class that provides a way to easily persist multiple objects at the same time without multiple calls to host.persistProperties
 */
export default class PropertyPersister {
    constructor(
        private host: powerbi.extensibility.visual.IVisualHost, // tslint:disable-line
        private delay: number = 100 // tslint:disable-line
    ) {}

    /**
     * Queues the given property changes
     */
    private propsToUpdate: { changes: powerbi.VisualObjectInstancesToPersist[], selection: boolean }[] = []; // tslint:disable-line
    private propUpdater = _.debounce(() => {
        if (this.propsToUpdate && this.propsToUpdate.length) {
            const toUpdate = this.propsToUpdate.slice(0);
            this.propsToUpdate.length = 0;
            const final: powerbi.VisualObjectInstancesToPersist = {};
            let isSelection: boolean;
            toUpdate.forEach(n => {
                n.changes.forEach(m => {
                    Object.keys(m).forEach(operation => {
                        if (!final[operation]) {
                            final[operation] = [];
                        }
                        final[operation].push(...m[operation]);
                    });
                });
                if (n.selection) {
                    isSelection = true;
                }

            });

            // // SUPER important that these guys happen together, otherwise the selection does not update properly
            // if (isSelection) {
            //     this.host.onSelect({ data: [] } as any); // TODO: Change this to visualObjects: []?
            // }
            this.host.persistProperties(final);
        }
    }, this.delay);

    /**
     * Queues a set of property changes for the next update
     * @param selection True if the properties contains selection
     */
    public persist(selection: boolean, ...changes: powerbi.VisualObjectInstancesToPersist[]) {
        this.propsToUpdate.push({
            changes,
            selection,
        });
        this.propUpdater();
    }
}
