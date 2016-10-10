const ENABLE_DEBUG_WRITER = !!process.env.VISUAL_DEBUG;
import colorizedLog from "./colorizedLog";
/**
 * Adds logging to an element
 */
export default function elementLogWriter(getElement: () => JQuery) {
    "use strict";
    return (...toLog: any[]) => {
        if (ENABLE_DEBUG_WRITER) {
            const ele = getElement();
            if (ele) {
                getElement().prepend($(`<div>${colorizedLog.apply(this, toLog)}</div>`));
            }
        }
    };
};
