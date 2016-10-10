import defineBuildTasks from "./tasks/build";
import { Gulp } from "gulp";

export default function configure(gulp: Gulp, baseDir: string) {
    "use strict";
    defineBuildTasks(gulp, baseDir);

    gulp.task("default", ["build"]);
}
