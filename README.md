[![CircleCI](https://circleci.com/gh/Microsoft/Essex-PowerBI-visuals-base/tree/master.svg?style=svg)](https://circleci.com/gh/Microsoft/Essex-PowerBI-visuals-base/tree/master)

# Essex PBI Base

A collection of utilities for creating custom visuals.

# Notes
## Bundling
Implementers should mark powerbi as an externally loaded resource so that the PowerBI client codebase
is not bundled into custom visuals.

```
externals: {
  "powerbi-visuals/lib/powerbi-visuals": "powerbi"
}
```

## Build Support
To use the bundling tasks, add the following to your gulpfile.js

```javascript
// gulpfile.js
const gulp = require('gulp');
const configure = require("essex.powerbi.base/dist/build_scripts").default;
configure(gulp, __dirname);
```
