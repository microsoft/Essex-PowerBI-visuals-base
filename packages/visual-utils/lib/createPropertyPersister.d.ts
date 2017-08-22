import PropertyPersister from "./PropertyPersister";
/**
 * Creates a property persister to ensure that all property changes are persisted in bulk
 * @param host The host to persist properties for
 * @param delay The debounce delay to use before calling host.persistProperties
 */
export default function createPropertyPersister(host: powerbi.extensibility.visual.IVisualHost, delay: number): PropertyPersister;
