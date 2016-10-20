import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Represents a class that handles the persistance of properties
 */
export default class PropertyPersister {
    constructor(
        private host: powerbi.IVisualHostServices, // tslint:disable-line
        private delay: number = 100 // tslint:disable-line
    ) {}

    /* tslint:disable */
    /**
     * Queues the given property changes
     */
    private propsToUpdate: { changes: powerbi.VisualObjectInstancesToPersist[], selection: boolean }[] = [];
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

            // SUPER important that these guys happen together, otherwise the selection does not update properly
            if (isSelection) {
                this.host.onSelect({ data: [] } as any); // TODO: Change this to visualObjects: []?
            }
            this.host.persistProperties(final);
        }
    }, this.delay);

    /**
     * Queues a set of property changes for the next update
     */
    public persist(selection: boolean, ...changes: powerbi.VisualObjectInstancesToPersist[]) {
        this.propsToUpdate.push({
            changes,
            selection
        });
        this.propUpdater();
    }
    /* tslint:enable */
}
