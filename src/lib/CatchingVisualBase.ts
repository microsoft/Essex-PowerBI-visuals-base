import "powerbi-visuals/lib/powerbi-visuals";

/**
 * A base implementation of IVisual that adds try/catch hooks around common lifecycle methods.
 * 
 * Optional functions in the interfaces have an empty default delegate implementation. 
 * Required methods have abstract delegates. 
 */
export abstract class CatchingVisualBase implements powerbi.IVisual {
    constructor(protected visualName: string) { // tslint:disable-line
    }

    /**
     * Initializes an instance of the IVisual.
     *
     * @param options Initialization options for the visual.
     */
    public init(options: powerbi.VisualInitOptions) {
        try {
            this.doInit(options);
        } catch (err) {
            console.log("%s::init error", this.visualName, err);
        }
    }

    protected abstract doInit(options: powerbi.VisualInitOptions): void;

    /** 
     * Notifies the visual that it is being destroyed, and to do any cleanup necessary 
     * (such as unsubscribing event handlers). 
     */
    public destroy() {
        try {
            this.doDestroy();
        } catch (err) {
            console.log("%s::destroy error", this.visualName, err);
        }
    }

    protected doDestroy() {
        // extend this method if necessary        
    }

    /**
     * Notifies the IVisual of an update (data, viewmode, size change).
     */
    public update(options: powerbi.VisualUpdateOptions) {
        try {
            this.doUpdate(options);
        } catch (err) {
            console.log("%s:update error", this.visualName, err);
        }
    }

    protected doUpdate(options: powerbi.VisualUpdateOptions) {
        // extend this method if necessary
    }

    /**
     * Notifies the IVisual to resize.
     *
     * @param finalViewport This is the viewport that the visual will eventually be resized to.
     * @param resized true on on final call when resizing is complete.
     */
    public onResizing(finalViewport: powerbi.IViewport, resizeMode?: powerbi.ResizeMode) {
        try {
            this.doOnResizing(finalViewport, resizeMode);
        } catch (err) {
            console.log("%s:onResizing error", this.visualName, err);
        }
    }

    protected doOnResizing(finalViewport: powerbi.IViewport, resizeMode?: powerbi.ResizeMode) {
        // extend this method if necessary
    }

    /**
     * Notifies the IVisual of new data being provided.
     * This is an optional method that can be omitted if the visual is in charge of providing its own data.
     */
    public onDataChanged?(options: powerbi.VisualDataChangedOptions) {
        try {
            this.handleOnDataChanged(options);
        } catch (err) {
            console.log("%s:onDataChanged error", this.visualName, err);
        }
    }

    protected handleOnDataChanged(options: powerbi.VisualDataChangedOptions) {
        // extend this method if necessary
    }

    /** 
     * Notifies the IVisual to change view mode if applicable. 
     */
    public onViewModeChanged?(viewMode: powerbi.ViewMode) {
        try {
            this.handleOnViewModeChanged(viewMode);
        } catch (err) {
            console.log("%s:onDataChanged error", this.visualName, err);
        }
    }

    protected handleOnViewModeChanged(viewMode: powerbi.ViewMode) {
        // extend this method if necessary
    }

    /** 
     * Notifies the IVisual to clear any selection. 
     */
    public onClearSelection() {
        try {
            this.handleOnClearSelection();
        } catch (err) {
            console.log("%s:onClearSelection error", this.visualName, err);
        }
    }

    protected handleOnClearSelection() {
        // extend this method if necessary
    }

    /** 
     * Gets a value indicating whether the IVisual can be resized to the given viewport. 
     */
    public canResizeTo(viewport: powerbi.IViewport): boolean {
        try {
            return this.handleCanResizeTo(viewport);
        } catch (err) {
            console.log("%s:onResizeTo error", this.visualName, err);
        }
    }

    protected handleCanResizeTo(viewport: powerbi.IViewport) {
        // extend this method if necessary
        return true;
    }

    /** 
     * Gets the set of objects that the visual is currently displaying. 
     */
    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
        try {
            return this.handleEnumerateObjectInstances(options);
        } catch (err) {
            console.log("%s:enumerateObjectInstances error", err);
        }
    }

    protected handleEnumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
        // extend this method if necessary
        return undefined;
    }

    /** 
     * Gets the set of object repetitions that the visual can display. 
     */
    public enumerateObjectRepetition(): powerbi.VisualObjectRepetition[] {
        try {
            return this.handleEnumerateObjectRepetition();
        } catch (err) {
            console.log("%s:enumerateObjectRepetition error", err);
        }
    }

    protected handleEnumerateObjectRepetition(): powerbi.VisualObjectRepetition[] {
        return undefined;
    }
}
