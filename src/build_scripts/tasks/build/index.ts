import { Gulp } from "gulp";
import powerBiTasks from "./powerbi";

export default function buildTasks(gulp: Gulp, baseDir: string) {
    "use strict";
    const sequence = require("gulp-sequence").use(gulp);
    powerBiTasks(gulp, baseDir);

    /**
     * Build task for a given component
     */
    gulp.task(`build`, function(callback: Function) {
        return sequence("build:powerbi", callback);
    });
};
