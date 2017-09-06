# Essex PBI Base -- Visual Utilities

A collection of utilities the development of powerbi custom visuals.

# Building
See the root [README](/README.md) on how to build this project.

# Usage

## buildContainsFilter

Creates a "contains" AdvancedFilter for a set of conditions

```
import { buildContainsFilter } from "@essex/visual-utils";

public class MyVisual implements IVisual {

    private previousOptions: VisualUpdateOptions;

    public update(options: VisualUpdateOptions) {
        const dv = options.dataViews[0];
        const filter = buildContainsFilter(dv.categorical.categories[0].source, "ValueToFind");
        this.host.applyJsonFilter(filter);
    }
}

```

## calculateSegments

Primarily for use with bar chart based visuals that support displaying grouped data. For example the "Segmented By" option of AttributeSlicer. When a column is passed into the "Segmented By" bucket, Attribute Slicer will take the bars for each category and break them into segments with different colors, each of which represents a different group of data. The name and color of these segments can be calculated using calculateSegments.

```
import { calculateSegments } from "@essex/visual-utils";

public class MyVisual implements IVisual {

    private previousOptions: VisualUpdateOptions;

    public update(options: VisualUpdateOptions) {
        const dv = options.dataViews[0];
        const defaultColor = "#cdcdcd";
        const segmentInfo = calculateSegments(dv.categorical.values, defaultColor);
        segmentInfo.forEach((si) => {
            console.log("Segment Name", si.name);
            console.log("Segment Color", si.color);
        });
    }
}

```

## calcUpdateType

Calculates the type of update that was performed when your visual.update function is called

```
import { calcUpdateType, UpdateType } from "@essex/visual-utils";

public class MyVisual implements IVisual {

    private previousOptions: VisualUpdateOptions;

    public update(options: VisualUpdateOptions) {
        const updateType = calcUpdateType(options, this.previousOptions);
        if ((updateType & UpdateType.Settings) === UpdateType.Settings) {
            // Settings have been changed.
        }
    }
}

```

## convertItemsWithSegments
convertItemsWithSegments is primarily used with bar chart based visuals that support grouping, and utilizes calculateSegments. This function takes a dataView and returns an item for each "category" in the dataView, and each item containing a list of "valueSegments" which represent the bar segments which should be displayed.

```
import { convertItemsWithSegments } from "@essex/visual-utils";

public class MyVisual implements IVisual {

    public update(options: VisualUpdateOptions) {
        const converted = convertItemsWithSegments(
            dataView,
            (dvCats: any, catIdx: number, total: number, id: ISelectionId, valueSegments: IValueSegment[]) => {
                const newItem = {
                    id: id
                };
                return item;
            });

        converted.forEach(item => {
            console.log("Item Id", item.id);
            item.valueSegments.forEach(segment => {
                console.log("Segment Color", segment.color);
                console.log("Segment Percentage Width", segment.width);
                console.log("Segment Value (The value passed from PowerBI)", segment.value);
            });
        });
    }
}

```

## createPropertyPersister
Creates a wrapper around `host.persistProperties()`, which debounces the calls, but instead of using the last set of VisualObjectInstances passed to it, it instead keeps a list of changes to pass to persistProperties, and passes that to `host.persistProperties` when the timeout is complete.

```
import { createPropertyPersister, PropertyPersister } from "@essex/visual-utils";

public class MyVisual implements IVisual {

    private myPersister: PropertyPersister;
    constructor(options: VisualConstructorOptions) {
        this.myPersister = createPropertyPersister(options.host);
    }

    public update(options: VisualUpdateOptions) {
        this.myPersister.persist({
            objectName: "general",
            selector: undefined,
            properties: {
                prop1: true
            }
        });
        this.myPersister.persist({
            objectName: "general",
            selector: undefined,
            properties: {
                prop2: true
            }
        });

        // The above calls will get rolled up into a single call to host.persistProperties with prop1 and prop2
    }
}

```

## listDiff
A quick utility to diff two sets of lists based on object equality

```
    import { listDiff } from "@essex/visual-utils";

    "use strict";
    listDiff<any>(["A", "B"], ["B", "C"], {
        equals: (one, two) => one === two,

        onRemove: (item) => {
            console.log("Remove", item);
            // will log "A", because "A" does not exist in list two
        },

        /**
         * Gets called when the given item was added
         */
        onAdd: (item) => {
            console.log("Add", item);
            // will log "C", because "C" does not exist in list one
        },
    });
```

## logger
Creates a logger, uses the __debug__ library
```
import { logger } from "@essex/visual-utils";
const log = logger("MyApplication::Visual");
```

## receiveDimensions
A decorator for use on visuals, which calls a `setDimensions` function when the dimensions of the visual have changed.

```
import { receiveDimensions } from "@essex/visual-utils";

@receiveDimensions
public class MyVisual implements IVisual {

    public setDimensions(dims) {
        this.dims = dims;
        // dimensions have been updated
    }
}

```

## get
A quick utility that wraps `lodash.get`, and returns a typesafe fashion of it

```
    import { get } from "@essex/visual-utils";
    const host = get(window, w => w.location.host, "NO HOST");
```