/// <reference types="jquery" />
import "./mockPBI";
export declare var Utils: {
    FAKE_TABLE_DATA_ONE_COLUMN: powerbi.DataView;
    FAKE_TABLE_DATA_TWO_COLUMN: powerbi.DataView;
    createElement: () => JQuery;
    createUpdateOptionsWithSmallData: () => powerbi.extensibility.visual.VisualUpdateOptions;
    createUpdateOptionsWithData: () => powerbi.extensibility.visual.VisualUpdateOptions;
    createFakeHost: () => powerbi.extensibility.visual.IVisualHost;
    createFakeConstructorOptions: () => powerbi.extensibility.visual.VisualConstructorOptions;
};
