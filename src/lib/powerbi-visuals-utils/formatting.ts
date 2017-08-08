
/* tslint:disable */
// This order is important
import "./type";
import "./svg";
import "./dataview";

let Globalize = require("expose?Globalize!globalize");

require("globalize/lib/cultures/globalize.culture.en-US.js");

import "powerbi-visuals-utils-formattingutils/lib/index.d";
import "script-loader!powerbi-visuals-utils-formattingutils";

export = powerbi.extensibility.utils.formatting;
