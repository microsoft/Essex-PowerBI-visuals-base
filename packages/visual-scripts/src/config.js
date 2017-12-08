const path = require('path');
const fs = require('fs');
const CWD = process.env.INIT_CWD;

const pbivizJson = require(path.join(CWD, 'pbiviz.json'));
const packageJson = require(path.join(CWD, 'package.json'));
const webpackExtend = fs.existsSync(path.join(CWD, 'webpack.extend.js')) ? require(path.join(CWD, 'package.json')) : t => t;
const outputFile = path.join(CWD, pbivizJson.output || 'dist/Visual.pbiviz');
const outputDir = path.parse(outputFile).dir;
const dropFolder = path.join(CWD, ".tmp/drop");
const webpackBase = require('./webpack.config');
const capabilitiesPath = path.join(CWD, pbivizJson.capabilities);

const buildConfig = {
    entry: {
        sass: path.join(CWD, pbivizJson.style),
        js: path.join(CWD, pbivizJson.visual.entry || "src/Visual.ts"),
        capabilities: capabilitiesPath,
    },
    precompileFolder: path.join(CWD, ".tmp/precompile"),
    dropFolder,
    js: path.join(dropFolder, "visual.js"),
    css: path.join(dropFolder, "visual.css"),
    output: {
        dir: outputDir,
        file: outputFile,
    },
};

if (!pbivizJson.visual.version) {
    pbivizJson.visual.version = packageJson.version
}

module.exports = {
    server: {
        port: 8080,
        privateKey: path.join(__dirname, "../certs/PowerBICustomVisualTest_private.key"),
        certificate: path.join(__dirname, "../certs/PowerBICustomVisualTest_public.crt"),
        routes: {
            assets: "/assets",
        },
    },
    metadata: {
        version: packageJson.version,
        author: packageJson.author,
        license: packageJson.license,
        privacy: packageJson.privacy,
        guid: pbivizJson.visual.guid,
        name: pbivizJson.visual.name,
    },
    assets: pbivizJson.assets,
    capabilities: require(capabilitiesPath),
    build: buildConfig,
    dist: {
        outputDir,
        outputFile,
    },
    pbivizJson,
    webpackConfig: webpackExtend(webpackBase(buildConfig)),
};
