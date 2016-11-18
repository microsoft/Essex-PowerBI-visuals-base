import "powerbi-visuals/lib/powerbi-visuals";
import { HasSerializedIdentity, HasIdentity } from "../interfaces";
import { serializeIdentity } from "./serializeIdentity";

/**
 * Serializes a list of objects that have identities
 */
export function serializeObjectWithIdentity<T>(hasIdentity: (T & HasIdentity)): T & HasSerializedIdentity {
    "use strict";
    if (hasIdentity) {
        hasIdentity.identity = <any>serializeIdentity(hasIdentity.identity);
        return <any>hasIdentity;
    }
}
