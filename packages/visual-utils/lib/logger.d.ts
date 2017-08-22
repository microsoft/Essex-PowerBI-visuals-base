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
export declare const logger: LoggerFactory;
/**
 * Adds logging to an element
 */
export declare function consoleLogWriter(): (...toLog: any[]) => void;
