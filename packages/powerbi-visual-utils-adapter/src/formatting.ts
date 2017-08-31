/// <reference path="../../../node_modules/powerbi-visuals-utils-formattingutils/lib/index.d.ts" />

import "./type";
import "./svg";
import "./dataview";

// tslint:disable no-unused-variable no-var-requires
const Globalize = require("expose-loader?Globalize!globalize");
require("globalize/lib/cultures/globalize.culture.en-US.js");
// tslint:enable no-unused-variable no-var-requires

import "script-loader!powerbi-visuals-utils-formattingutils/lib/index";

export = powerbi.extensibility.utils.formatting;
