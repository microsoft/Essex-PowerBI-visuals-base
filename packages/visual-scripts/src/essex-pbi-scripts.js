#!/usr/bin/env node

'use strict';

process.title = 'essex-pbi-scripts';
const metadata = require('../package.json');
const program = require('commander');
process.env.INIT_CWD = process.cwd();
const commands = require('./commands');


program
    .version(metadata.version)
    .on('--version', () => console.log(metadata.version));

program
    .command('install-certificate')
    .description('Install Development Certificate')
    .action(() => commands.installCertificate());


program.command('package')
    .description('Construct a .pbiviz custom visual file')
    .action(() => commands.package());

program
    .command('report')
    .description('Build Reports')
    .action((env, options) => {
        console.log("Build Reports");
    });

program
    .command('compile')
    .description('Compile project assets')
    .action((env, options) => {
        console.log("Compile Assets");
    });

program
    .command('verify')
    .description('Compile project assets')
    .action((env, options) => {
        console.log("Compile Assets");
    });

program.command('test')
    .description('Performs compilation, verification, packaging, and reporting steps')
    .action((env, options) => {
        console.log("Package visual");
    });

program.command('start')
    .description('Starts the PowerBI Visual Development Server')
    .action((env, options) => commands.start());

program.command('*').action(() => program.outputHelp());

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
