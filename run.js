const path = require("path");

const runArgs = process.argv.slice(2);
const commandToRun = runArgs[0];
const commandArgs = runArgs.slice(1).join(" ");
const resolvedPath = path.resolve(path.join(__dirname, "node_modules", ".bin", commandToRun));
const child = require("child_process").exec(resolvedPath + (commandArgs.length ? " " + commandArgs : ""));
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);