# Essex PBI Base -- Visual Settings

A library to parse/enumerate PowerBI formatting pane settings in a simple way.

# Building
See the root [README](/README.md) on how to build this project.

# Usage

Create a Visual Settings class that extends from the visual-settings/HasSettings class, and mark each of your settings that you want to persist into powerbi, with an appropriate setting decorator.

```
import { HasSettings, boolSetting, numberSetting, textSetting, colorSetting } from "visual-settings";
class MyVisualSettings extends HasSettings {

    @boolSetting({ // Represents a boolean setting (a toggle switch)
        category: "Formatting", // This is the top level grouping within PowerBI's formatting pane
        displayName: "My Bool Setting", // This is the text that gets displayed in the formatting pane for this setting
        description: "Who's setting is it?", // This is the description of this setting, it will be displayed to the users.
        defaultValue: true, // *Optional* This is the default value for this setting if the user hits the reset button.
        enumerable: true, // *Optional* (default: true) If true, the setting will be displayed in the formatting pane, and the user can modify it. If false, it will be a hidden setting that your visual can update, but the user cannot
        persist: true, // *Optional* (default: true) If true, when this settings value has changed, it will be persisted to powerbi.  This config option is handy if you only want to read setting values from PowerBI but not update them.
    })
    public bool myBoolSetting = true;

    @numberSetting({ // Represents a numeric setting
        ...
    })
    public number myNumberSetting;

    @textSetting({ // Represents a text/string setting
        ...
    })
    public string myTextSetting;

    @colorSetting({ // Represents a color setting (shows a color pallette)
        ...
    })
    public string myColorSetting; // This is a hex code string i.e. #cfcfcf
}

```

Instantiate your settings class within your visual, and store the current dataView

```
import MyVisualSettings from "./visualSettings";

class MyVisual implements IVisual {
    private dataView: powerbi.DataView;
    private visualSettings: MyVisualSettings;

    constructor() {
        this.visualSettings = MyVisualSettings.create<MyVisualSettings>();
    }

    public update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews[0]) {
            this.dataView = options.dataViews[0];
        }

        const oldSettings = this.visualSettings; // A reference to the old settings
        this.visualSettings = this.visualSettings.receiveFromPBI(this.dataView); // Parse the new settings from PowerBI
    }
}
```

Update your enumerateObjectInstances to return the values from your settings.

```
import MyVisualSettings from "./visualSettings";

class MyVisual implements IVisual {

    private dataView: powerbi.DataView;
    private visualSettings: MyVisualSettings;

     * The IVisual.enumerateObjectInstances function
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
        return this.visualSettings.buildEnumerationObjects(options.objectName, this.dataView, false);
    }
}
```

If you change a settings value and want to persist it back to powerbi

```
import MyVisualSettings from "./visualSettings";

class MyVisual implements IVisual {
    private visualSettings: MyVisualSettings;
    private host: IVisualHost;
    private dataView: powerbi.DataView;

    public void onUpdateSettingValue(value: string) {
        this.visualSettings.myTextSetting = value;

        const pbiObjects = this.visualSettings.buildPersistObjects(this.dataView);
        this.host.persistProperties(pbiObjects); // Persist them off to powerbi
    }
}

```