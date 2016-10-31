import * as jquery from "jquery";
global["powerbi"] = jquery.extend(true, {
    VisualUpdateType: {},
    visuals: {
        utility: {
            SelectionManager: () => {
                return {
                    getSelectionIds: () => <any[]>[],
                };
            },
        },
        StandardObjectProperties: {
            fill: {
                type: {},
            },
        },
        valueFormatter: {
            create: function () {
                return {
                    format: function () { }, // tslint:disable-line
                };
            },
        },
        SelectionId: {
            createWithId: function () {
                return {
                    getKey() {
                        return 1;
                    },
                    getSelector() {
                        return 1;
                    },
                };
            },
        },
    },
    VisualDataRoleKind: {
    },
    data: {
        createDisplayNameGetter: () => ({}),
        createDataViewScopeIdentity: (expr: any) => ({ expr: expr }),
        SQExprBuilder: {
            compare: () => { }, // tslint:disable-line
        },
    },
}, global["powerbi"] || {});

global["jsCommon"] = $.extend(true, {
    PixelConverter: {
        toPoint: function (value: any) { return value; },
    },
}, global["jsCommon"] || {});
