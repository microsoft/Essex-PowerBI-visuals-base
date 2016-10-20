const debug = require("debug");

const logWriters: LogWriter[] = [consoleLogWriter()];

export interface LogWriter {
    /**
     * Writes the given log
     */
    (...args: any[]): void;
}

export interface LoggerFactory {
    /**
     * Creates a new logger
     */
    (name: string): Logger;

    /**
     * Adds a log writer
     */
    addWriter(writer: LogWriter): void;
}

export interface Logger {
    /**
     * Adds a log entry
     */
    (...args: any[]): void;

    /**
     * The function that gets called when a log entry is added
     */
    log(...args: any[]): void;
}


export const logger: LoggerFactory = <any>((name: string) => {
    const newLogger = debug(name) as Logger;
    newLogger.log = function(...args) {
        logWriters.forEach(function(n) {
            n.apply(this, args);
        });
    };
    return newLogger;
});

logger.addWriter = (writer: LogWriter) => {
    logWriters.push(writer);
};

/**
 * Adds logging to an element
 */
export function consoleLogWriter() {
    "use strict";
    return (...toLog: any[]) => {
        console.log.apply(console, toLog);
    };
};
