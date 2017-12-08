/**
 * Copyright (c) 2016 Uncharted Software Inc.
 * http://www.uncharted.software/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
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

"use strict";

const fs = require('fs');
const zip = require('node-zip')();
const path = require('path');
const sass = require('node-sass');
const CleanCSS = require('clean-css');
const mkdirp = require('mkdirp');
const webpack = require("webpack");
const MemoryFS = require("memory-fs");
const buildOSSReport = require('../util/buildOSSReport.js');
const config = require('../config');
const { pbivizJson } = config;

const _buildLegacyPackageJson = () => {
    const pack = {
        version: config.metadata.version,
        author: config.metadata.author,
        licenseTerms: config.metadata.license,
        privacyTerms: config.metadata.privacyTerms,
        resources: [
            {
                "resourceId": "rId0",
                "sourceType": 5,
                "file": `resources/${ config.metadata.guid }.ts`
            },
            {
                "resourceId": "rId1",
                "sourceType": 0,
                "file": `resources/${ config.metadata.guid }.js`
            },
            {
                "resourceId": "rId2",
                "sourceType": 1,
                "file": `resources/${ config.metadata.guid }.css`
            },
            {
                "resourceId": "rId3",
                "sourceType": 3,
                "file": `resources/${path.basename(config.assets.icon)}`
            },
            {
                "resourceId": "rId4",
                "sourceType": 6,
                "file": `resources/${path.basename(config.assets.thumbnail)}`
            },
            {
                "resourceId": "rId5",
                "sourceType": 2,
                "file": `resources/${path.basename(config.assets.screenshot)}`
            }
        ],
        visual: Object.assign({ version: config.metadata.version }, pbivizJson.visual),
        "code": {
            "typeScript": {
                "resourceId": "rId0"
            },
            "javaScript": {
                "resourceId": "rId1"
            },
            "css": {
                "resourceId": "rId2"
            }
        },
        "images": {
            "icon": {
                "resourceId": "rId3"
            },
            "thumbnail": {
                "resourceId": "rId4"
            },
            "screenshots": [
                {
                    "resourceId": "rId5"
                }
            ]
        }
    };

    delete pack.visual.visualClassName;

    const date = new Date();
    pack.build = date.getUTCFullYear().toString().substring(2) + '.' + (date.getUTCMonth() + 1) + '.' + date.getUTCDate() + '.' + ((date.getUTCHours() * 3600) + (date.getUTCMinutes() * 60) + date.getUTCSeconds());
    return pack;
};

const _buildPackageJson = () => {
    return {
        version: config.metadata.version,
        author: config.metadata.author,
        licenseTerms: config.metadata.license,
        privacyTerms: config.metadata.privacyTerms,
        resources: [
            {
                resourceId: 'rId0',
                sourceType: 5,
                file: `resources/${ config.metadata.guid }.pbiviz.json`,
            }
        ],
        visual: Object.assign({ version: config.metadata.version }, pbivizJson.visual),
        metadata: {
            pbivizjson: {
                resourceId: 'rId0',
            },
        },
    };
};

const buildPackageJson = pbivizJson.apiVersion ? _buildPackageJson() : _buildLegacyPackageJson();

const compileSass = () => {
    if (pbivizJson.style) {
        const sassOutput = sass.renderSync({ file: config.build.entry.sass }).css.toString();
        const options = { 
            level: { 
                2: {
                    all: true,
                    mergeNonAdjacentRules: false,
                },
            },
        };
        const cssContent = new CleanCSS(options).minify(sassOutput).styles;
        return cssContent;
    }
    return '';
};

const compileScripts = (callback) => {
    const fs = new MemoryFS();
    const compiler = webpack(config.webpackConfig);
    compiler.outputFileSystem = fs;
    compiler.run((err, stats) => {
        if (err) throw err;
        const jsonStats = stats.toJson(true);
        console.info('Time:', jsonStats.time);
        console.info('Hash:', jsonStats.hash);
        console.info('%s Warnings, %s Errors', jsonStats.warnings.length, jsonStats.errors.length);
        jsonStats.warnings.forEach(warning => console.warn('WARNING:', warning));
        jsonStats.errors.forEach(error => console.error('ERROR:', error));
        const hasRealErrors = jsonStats.errors.some(e => e.indexOf("node_modules") === -1);
        if (hasRealErrors) {
            return process.exit(1);
        }
        buildOSSReport(jsonStats.modules, ossReport => {
            console.log("Reading File Content from ", config.build.js, JSON.stringify(config.webpackConfig.output));
            const fileContent = fs.readFileSync(config.build.js).toString();
            callback(err, fileContent, ossReport);
        });
    });
};

const _buildLegacyPackage = (fileContent) => {
    const icon = fs.readFileSync(config.assets.icon);
    const thumbnail = fs.readFileSync(config.assets.thumbnail);
    const screenshot = fs.readFileSync(config.assets.screenshot);
    const iconType = config.assets.icon.indexOf('.svg') >= 0 ? 'svg+xml' : 'png';
    const iconBase64 = `data:image/${iconType};base64,` + icon.toString('base64');
    const cssContent = compileSass() + `\n.visual-icon.${config.metadata.guid} {background-image: url(${iconBase64});}`;
    zip.file('package.json', JSON.stringify(buildPackageJson, null, 2));
    zip.file(`resources/${config.metadata.guid}.js`, fileContent);
    zip.file(`resources/${config.metadata.guid}.ts`, `/** See ${config.metadata.guid}.js **/`);
    zip.file(`resources/${config.metadata.guid}.css`, cssContent + `\n`);
    zip.file(`resources/${path.basename(config.assets.icon)}`, icon);
    zip.file(`resources/${path.basename(config.assets.thumbnail)}`, thumbnail);
    zip.file(`resources/${path.basename(config.assets.screenshot)}`, screenshot);
    fs.writeFileSync(config.dist.outputFile, zip.generate({ base64:false,compression:'DEFLATE' }), 'binary');
};

const _buildPackage = (fileContent) => {
    const js = fileContent;
    const { capabilities } = config;
    const css = compileSass();
    const icon = fs.readFileSync(config.assets.icon);
    const iconType = config.assets.icon.indexOf('.svg') >= 0 ? 'svg+xml' : 'png';
    const iconBase64 = `data:image/${iconType};base64,` + icon.toString('base64');

    const constructedPbiViz = Object.assign({}, pbivizJson, {
        capabilities,
        content: {
            js,
            css,
            iconBase64,
        },
    });
    zip.file('package.json', JSON.stringify(buildPackageJson, null, 2));
    zip.file(`resources/${config.metadata.guid}.pbiviz.json`, JSON.stringify(constructedPbiViz, null, 2));
    fs.writeFileSync(config.dist.outputFile, zip.generate({ base64:false, compression:'DEFLATE' }), 'binary');
};

module.exports = function buildPackage() {
    mkdirp.sync(config.build.output.dir);
    compileScripts((err, result, ossReport) => {
        if (err) throw err;

        if (!pbivizJson.apiVersion) {
            _buildLegacyPackage(result);
        } else {
            _buildPackage(result);
        }

        const ossReportFile = path.join(
            config.build.output.dir, 
            `${config.metadata.name}_${config.metadata.version}_OSS_Report.csv`
        );
        console.log("Writing OSS License Report to ", ossReportFile);
        fs.writeFileSync(ossReportFile, ossReport);
    });
};
