import * as path from "path";
import paths from "./paths";

export default function project(baseDir: string) {
    "use strict";
    const buildConfig = require(path.join(baseDir, "src/build"));
    const { name, version } = require(path.join(baseDir, "package.json"));
    return {
        name,
        buildConfig,
        paths: paths(baseDir),
        version,
    };
}
