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
