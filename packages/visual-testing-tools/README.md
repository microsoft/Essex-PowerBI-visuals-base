# Essex PBI Base -- Visual Testing Tools

A collection of testing tools for unit testing powerbi custom visuals.

# Building
See the root [README](/README.md) on how to build this project.

# Usage
The library is broken into a couple of parts:

## mockPBI
This provides a mock global powerbi instance for usage within unit testing, to use mockPBI just require it.
```
import "@essex/visual-testing-tools/lib/mockPBI"; // or require()
// The powerbi global is now defined
```

## visualHelpers
This provides a set of testing tools to mock powerbi API objects, such as IVisual.update option objects or dataViews.
```
import { Utils } from "@essex/visual-testing-tools"; // or require()
const myVisual = createVisual();
const updateOptions = Utils.createUpdateOptionsWithData();
myVisual.update(updateOptions);
```
See the API docs for more details.