import "powerbi-visuals/lib/powerbi-visuals";
import { HasSerializedIdentity, HasIdentity } from "../interfaces";
import { deserializeIdentity } from "./deserializeIdentity";

/**
 * Serializes a list of objects that have identities
 */
export function deserializeObjectWithIdentity<T>(hasIdentity: (T & HasSerializedIdentity)): (T & HasIdentity) {
    "use strict";
    if (hasIdentity) {
        hasIdentity.identity = <any>deserializeIdentity(hasIdentity.identity);
        return <any>hasIdentity;
    }
}
