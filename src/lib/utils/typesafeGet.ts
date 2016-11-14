const ldget = require("lodash/get"); // tslint:disable-line
const pathFinder = /return\s+([^\;\}]+)/;
export default function get<T, J>(obj: T, getter: (obj: T) => J, defaultValue?: any): J {
    "use strict";
    const path = pathFinder.exec(getter.toString())[1];
    return ldget(obj, path.split(".").slice(1).join("."), defaultValue) as J;
}
