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

import * as fs from "fs";
import * as path from "path";
import { Gulp } from "gulp";
import makeProjectConfig from "../../project";

const del = require("del"); // tslint:disable-line
const zip = require("gulp-zip"); // tslint:disable-line
const gutil = require("gulp-util"); // tslint:disable-line
const webpack = require("gulp-webpack"); // tslint:disable-line
const replace = require("gulp-replace"); // tslint:disable-line
const concat = require("gulp-concat"); // tslint:disable-line
const modify = require("gulp-modify"); // tslint:disable-line

function string_src(filename: string, text: string) {
    "use strict";
    const src = require("stream").Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(text) }));
        this.push(null); // tslint:disable-line
    };
    return src;
}

/**
 * Defines all of the tasks
 */
export default function powerbiTasks(gulp: Gulp, baseDir: string) {
    "use strict";
    const sequence = require("gulp-sequence").use(gulp);
    const projectConfig = makeProjectConfig(baseDir);
    const project = projectConfig.name;
    const config = projectConfig.buildConfig;
    const paths = projectConfig.paths;
    const projectVersion = projectConfig.version;
    const task = (name: string) => `build:powerbi:${name}`;

    /**
     * Builds the css for the visual
     */
    gulp.task(task("package_css"), function () {
        const output = config.output.PowerBI;
        if (output && output.icon) {
            const base64Contents = new Buffer(fs.readFileSync(path.join(paths.projectDir, output.icon), "binary")).toString("base64");
            let mimeType = "image/png";
            if (output.icon.indexOf(".svg") >= 0) {
                mimeType = "image/svg+xml";
            }

            return string_src("project.css", `
            .visual-icon.${output.visualName + output.projectId}{
                background-image: url(data:${mimeType};base64,${base64Contents});
            }
            `.trim())
                .pipe(gulp.dest(paths.buildDirPowerBiResources));

        }
    });

    /**
     * Builds the scripts for use for with powerbi
     */
    gulp.task(task("scripts"), [task("package_css")], function () {
        const output = config.output.PowerBI;
        const webpackConfig = require(path.join(baseDir, "webpack.config"));
        webpackConfig.entry = path.join(baseDir, "src", output.entry.replace(".ts", ".js"));
        return gulp.src(paths.scripts)
            .pipe(webpack(webpackConfig))
            .pipe(concat("project.js"))
            .pipe(gulp.dest(paths.buildDirPowerBiResources));
    });

    /**
     * Creates the package.json
     */
    gulp.task(task("package_json"), function () {
        const output = config.output.PowerBI;
        const packageFile = path.join(__dirname, "package.json");
        return gulp.src([packageFile])
            .pipe(replace("%PROJECT_NAME%", output.visualName))
            .pipe(replace("%PROJECT_DISPLAY_NAME%", output.displayName || output.visualName))
            .pipe(replace("%PROJECT_ID%", output.projectId))
            .pipe(replace("%PROJECT_DESCRIPTION%", output.description))
            .pipe(replace("%PROJECT_VERSION%", projectVersion))
            .pipe(modify({
                fileModifier: function (file: string, contents: string) {
                    const pkg = JSON.parse(contents.toString());
                    if (output.icon) {
                        pkg.images = pkg.images || {};
                        pkg.images.icon = {
                            "resourceId": "rId3",
                        };
                        pkg.resources.push({
                            resourceId: "rId3",
                            sourceType: 3,
                            file: "resources/" + path.basename(output.icon),
                        });
                    }

                    if (output.thumbnail) {
                        pkg.images = pkg.images || {};
                        pkg.images.thumbnail = {
                            "resourceId": "rId4",
                        };
                        pkg.resources.push({
                            resourceId: "rId4",
                            sourceType: 6,
                            file: "resources/" + path.basename(output.thumbnail),
                        });
                    }

                    if (output.screenshot) {
                        pkg.images = pkg.images || {};
                        pkg.images.screenshots = [{
                            "resourceId": "rId5",
                        }];
                        pkg.resources.push({
                            resourceId: "rId5",
                            sourceType: 2,
                            file: "resources/" + path.basename(output.screenshot),
                        });
                    }
                    return JSON.stringify(pkg, null, 4); // tslint:disable-line
                },
            }))
            .pipe(gulp.dest(paths.buildDirPowerBI));
    });

    /**
     * Packages the icon
     */
    gulp.task(task("package_images"), function () {
        const output = config.output.PowerBI;
        const imagePaths: string[] = [];
        if (output.icon) {
            imagePaths.push(output.icon);
        }
        if (output.screenshot) {
            imagePaths.push(output.screenshot);
        }
        if (output.thumbnail) {
            imagePaths.push(output.thumbnail);
        }
        return gulp.src(imagePaths.map(function (img) { return paths.projectDir + "/" + img; }))
            .pipe(gulp.dest(paths.buildDirPowerBiResources));
    });

    /**
     * Zips up the visual
     */
    gulp.task(task("zip"), function () {
        return gulp.src([paths.buildDirPowerBI + "/**/*"])
            .pipe(zip(`${project}.pbiviz`))
            .pipe(gulp.dest(paths.buildDirPowerBI));
    });

    /**
     * Task to create an empty ts file
     */
    gulp.task(task("create_empty_ts"), function (cb: Function) {
        const content = "/** See project.js **/";
        return string_src("project.ts", content)
        .pipe(gulp.dest(paths.buildDirPowerBiResources));
    });

    /**
     * Task to create an empty ts file
     */
    gulp.task(task("pre_clean"), function (cb: Function) {
        // You can use multiple globbing patterns as you would with `gulp.src`
        del.sync([paths.buildDirPowerBI]);
        cb();
    });


    /**
     * Task to create an empty ts file
     */
    gulp.task(task("post_clean"), function (cb: Function) {
        // You can use multiple globbing patterns as you would with `gulp.src`
        del.sync([
            paths.buildDirPowerBI + "/css",
            paths.buildDirPowerBI + "/package.json",
            paths.buildDirPowerBiResources]);
        cb();
    });

    /**
     * Packages the visualization in a pbiviz
     */
    gulp.task("build:powerbi", (cb: Function) => {
        sequence.use(gulp);
        return sequence(
            task("pre_clean"),
            task("scripts"),
            task("package_json"),
            task("package_images"),
            task("create_empty_ts"),
            task("zip"),
            task("post_clean"),
            cb
        );
    });
}
