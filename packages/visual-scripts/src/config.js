const path = require('path');
const CWD = process.env.INIT_CWD;

const pbivizJson = require(path.join(CWD, 'pbiviz.json'));
const packageJson = require(path.join(CWD, 'package.json'));
const outputFile = path.join(CWD, pbivizJson.output || 'dist/Visual.pbiviz');
const outputDir = path.parse(outputFile).dir;
const dropFolder = path.join(CWD, ".tmp/drop");

const capabilitiesPath = path.join(CWD, pbivizJson.capabilities);

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
    build: {
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
    },
    dist: {
        outputDir,
        outputFile,
    },
    pbivizJson,
};
