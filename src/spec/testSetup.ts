/* tslint:disable */
let myGlobal: any;
if (typeof window === "undefined" || typeof document === "undefined") {
    let jsdom = require("jsdom").jsdom;
    let myDoc = jsdom("<html></html>", {});
    global["window"] = myDoc.defaultView;
    global["document"] = myDoc;
    myGlobal = global;
} else {
    myGlobal = window;
}

// Some typical deps
myGlobal["$"] = require("jquery");
myGlobal["d3"] = require("d3");
myGlobal["_"] = require("lodash");
