
// This order is important
import "./type";
import "./svg";
import "./dataview";

// tslint:disable no-unused-variable no-var-requires
const Globalize = require("expose-loader?Globalize!globalize");
require("globalize/lib/cultures/globalize.culture.en-US.js");
// tslint:enable no-unused-variable no-var-requires

import "powerbi-visuals-utils-formattingutils/lib/index.d";
import "script-loader!powerbi-visuals-utils-formattingutils";

export = powerbi.extensibility.utils.formatting;
