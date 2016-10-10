import * as path from "path";

export default function getPaths(rootDir: string) {
    "use strict";
    const srcDir = path.join(rootDir, "src");
    const distDir = path.join(rootDir, "dist");
    const pbiDir = path.join(distDir, "powerbi");

    return  {
        projectDir: srcDir,
        scripts: [`${srcDir}/**/*\.{js,ts}`],
        styles: [`${srcDir}/**/*\.{scss,sass}`],
        test: [`${srcDir}/**/*\.spec\.{ts,js}`],
        buildDir:  distDir,
        buildArtifacts: `${distDir}/**/*.*`,
        getBuildDir: (type = "") => path.join(distDir, type),
        buildDirPowerBI: pbiDir,
        buildDirPowerBiResources: path.join(pbiDir, "resources"),
        packageDir: [path.join(__dirname, "build/package")],
    };
}
