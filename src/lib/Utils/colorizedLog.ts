
/**
 * Creates html from the given things to log, supports chrome log style coloring (%c)
 * See: https://developer.chrome.com/devtools/docs/console-api#consolelogobject-object
 */
export default function colorizedLog(...toLog: any[]): string {
    "use strict";
    let logStr: string;
    if (toLog && toLog.length > 1) {
        logStr = `<span>${toLog[0]}</span>`;
        for (let i = 1; i < toLog.length; i++) {
            let value = toLog[i];
            let cIdx = logStr.indexOf("%c");
            if (cIdx >= 0) {
                let beginningPart = logStr.substring(0, cIdx);
                logStr = `${beginningPart}</span><span style="${value}">${logStr.substring(cIdx + 2)}`;
            }  else {
                logStr += value;
            }
        }
    } else {
        logStr = toLog.join("");
    }
    return logStr;
}
