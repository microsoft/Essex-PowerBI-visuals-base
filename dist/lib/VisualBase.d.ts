/// <reference path="../../typings/powerbi.d.ts" />
import VisualCapabilities = powerbi.VisualCapabilities;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
export default class VisualBase implements powerbi.IVisual {
    protected element: JQuery;
    protected container: JQuery;
    private parent;
    private _sandboxed;
    private width;
    private height;
    private cssModule;
    static EXPERIMENTAL_ENABLED: boolean;
    /**
     * True if the sandbox is enabled by default
     */
    static DEFAULT_SANDBOX_ENABLED: boolean;
    template: string;
    /**
     * The set of capabilities for the visual
     */
    static capabilities: VisualCapabilities;
    /**
     * Constructor for the Visual
     * @param logger The logger used for logging, if provided, the logger will log events to the log element contained in this visual
     */
    constructor(noCss?: boolean);
    /** This is called once when the visual is initialially created */
    init(options: powerbi.VisualInitOptions): void;
    /**
     * Notifies the IVisual of an update (data, viewmode, size change).
     */
    update(options: powerbi.VisualUpdateOptions): void;
    /**
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
    /**
     *
     */
    /**
     * Sets the sandboxed state
     */
    sandboxed: boolean;
    /**
     * Gets the inline css used for this element
     */
    protected getCss(): string[];
    /**
     * Builds the link for the given external css resource
     */
    protected buildExternalCssLink(resource: ExternalCssResource): JQueryPromise<string>;
    /**
     * Gets the external css paths used for this visualization
     */
    protected getExternalCssResources(): ExternalCssResource[];
    private HACK_fonts();
    private HACK_getFontFaces(obj?);
}
/**
 * Specifies an external css resource
 */
export interface ExternalCssResource {
    /**
     * The url of the resource
     */
    url: string;
    /**
     * The integrity string of the resource
     */
    integrity?: string;
    /**
     * The cross origin of the resource
     */
    crossorigin?: string;
}
