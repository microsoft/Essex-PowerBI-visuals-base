import PropertyPersister from "./PropertyPersister";

/**
 * Creates a property persister to ensure that all property changes are persisted in bulk
 */
export default function createPropertyPersister(host: powerbi.IVisualHostServices, delay: number) {
    "use strict";
    return new PropertyPersister(host, delay);
}
