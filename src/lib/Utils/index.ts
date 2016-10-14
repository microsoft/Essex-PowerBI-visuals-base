/* tslint:disable */
const debug = require("debug");
debug.save = function() { };
if (process.env.DEBUG) {
    debug.enable(process.env.DEBUG);
}
/* tslint:enable */

export { default as calcUpdateType } from "./calcUpdateType";
export { default as colorizedLog } from "./colorizedLog";
export { default as createPropertyPersister } from "./createPropertyPersister";
export { default as elementLogWriter } from "./elementLogWriter";
export { default as hasDataChanged } from "./hasDataChanged";
export { default as listDiff } from "./listDiff";
export * from "./logger";
export { default as PropertyPersister } from "./PropertyPersister";
export * from "./receiveUpdateType";
export * from "./receiveDimensions";
export { default as UpdateType } from "./UpdateType";
export { default as updateTypeGetter } from "./updateTypeGetter";
export { default as Visual } from "./Visual";
export { IDiffProcessor } from "./IDiffProcessor";
