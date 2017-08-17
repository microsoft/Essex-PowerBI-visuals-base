/**
 * A class that provides a way to easily persist multiple objects at the same time without multiple calls to host.persistProperties
 */
export default class PropertyPersister {
    private host;
    private delay;
    constructor(host: powerbi.extensibility.visual.IVisualHost, delay?: number);
    /**
     * Queues the given property changes
     */
    private propsToUpdate;
    private propUpdater;
    /**
     * Queues a set of property changes for the next update
     * @param selection True if the properties contains selection
     */
    persist(selection: boolean, ...changes: powerbi.VisualObjectInstancesToPersist[]): void;
}
