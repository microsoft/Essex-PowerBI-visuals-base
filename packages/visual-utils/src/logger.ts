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

const debug = require('debug') // tslint:disable-line

const logWriters: LogWriter[] = [consoleLogWriter()]

export interface LogWriter {
	/**
	 * Writes the given log
	 */
	(...args: any[]): void
}

export interface LoggerFactory {
	/**
	 * Creates a new logger
	 */
	(name: string): Logger

	/**
	 * Adds a log writer
	 */
	addWriter(writer: LogWriter): void
}

export interface Logger {
	/**
	 * Adds a log entry
	 */
	(...args: any[]): void

	/**
	 * The function that gets called when a log entry is added
	 */
	log(...args: any[]): void
}

export const logger: LoggerFactory = <any>((name: string) => {
	const newLogger = debug(name) as Logger
	newLogger.log = function(...args) {
		logWriters.forEach(function(n) {
			n.apply(this, args)
		})
	}
	return newLogger
})

logger.addWriter = (writer: LogWriter) => {
	logWriters.push(writer)
}

/**
 * Adds logging to an element
 */
export function consoleLogWriter() {
	'use strict'
	return (...toLog: any[]) => {
		// tslint:disable-next-line no-console
		console.log.apply(console, toLog)
	}
}
