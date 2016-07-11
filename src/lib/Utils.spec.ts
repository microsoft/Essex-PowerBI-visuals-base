import { colorizedLog, updateTypeGetter, UpdateType } from "./Utils";
import VisualBase from "./VisualBase";
import { expect } from "chai";
import * as _ from "lodash";

describe("Utils", () => {
    describe("updateTypeGetter", () => {
        /**
         * Runs a update test that validates that the given update options returns the given update type
         */
        const runUpdateTest = (options: powerbi.VisualUpdateOptions, updateType: UpdateType, directCompare = false) => {
            const fakeVisual = {
                update: () => 0
            } as any as VisualBase;
            const getter = updateTypeGetter(fakeVisual);
            fakeVisual.update(options);
            let expected = getter();
            if (!directCompare) {
                expected &= updateType;
            }
            expect(expected).to.eq(updateType);
        };
        const runMultipleUpdateTests = (
            o1: powerbi.VisualUpdateOptions,
            o2: powerbi.VisualUpdateOptions,
            updateType: UpdateType, directCompare = false) => {
            const fakeVisual = {
                update: () => 0
            } as any as VisualBase;
            const getter = updateTypeGetter(fakeVisual);
            fakeVisual.update(o1);
            fakeVisual.update(o2);
            let expected = getter();
            if (!directCompare) {
                expected &= updateType;
            }
            expect(expected).to.eq(updateType);
        };

        const resizeAndDataUpdateOptions = {
            dataViews: [{}],
            resizeMode: 1
        } as any as powerbi.VisualUpdateOptions;

        const simpleSettingsUpdateOptions = {
            dataViews: [{
                metadata: {
                    objects: {
                        whatever: "whatever"
                    }
                }
            }, ]
        } as any as powerbi.VisualUpdateOptions;

        const dataRoleTest = (role1: string, role2: string, type: UpdateType, directCompare = false) => {
            runMultipleUpdateTests({
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        columns: [{
                            queryName: "MyQuery",
                            roles: {
                                [role1]: true
                            }
                        }, ]
                    }
                }, ]
            } as any, {
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        columns: [{
                            queryName: "MyQuery",
                            roles: {
                                [role2]: true
                            }
                        }, ]
                    }
                }, ]
            } as any,
            type,
            directCompare);
        };

        const sortTest = (sort1: boolean, sort2: boolean, type: UpdateType, directCompare = false) => {
            runMultipleUpdateTests({
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        columns: [{
                            queryName: "MyQuery",
                            sort: sort1
                        }, ]
                    }
                }, ]
            } as any, {
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        columns: [{
                            queryName: "MyQuery",
                            sort: sort2
                        }, ]
                    }
                }, ]
            } as any,
            type,
            directCompare);
        };

        const identityTest = (identities1: any[], identities2: any[], type: UpdateType, directCompare = false) => {
            runMultipleUpdateTests({
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: identities1
                        }, ]
                    }
                }, ]
            } as any, {
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: identities2
                        }, ]
                    }
                }, ]
            } as any,
            type,
            directCompare);
        };

        const settingsTest = (sn1: string, sn2: string, type: UpdateType, directCompare = false) => {
            runMultipleUpdateTests({
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        objects: {
                            whatever: sn1
                        }
                    }
                }, ]
            } as any, {
                dataViews: [{
                    categorical: {
                        categories: [{
                            identity: [{
                                key: "KEY"
                            }, ]
                        }, ]
                    },
                    metadata: {
                        objects: {
                            whatever: sn2
                        }
                    }
                }, ]
            } as any,
            type,
            directCompare);
        };

        it("should return Initial on first run", () => runUpdateTest(<any>{}, UpdateType.Initial));
        it("should return Unknown when nothing has changed twice", () => {
            runMultipleUpdateTests(<any>{}, <any>{}, UpdateType.Unknown, true);
        });
        it("should return Resize initially cause it was invisible before", () => runUpdateTest(<any>{}, UpdateType.Resize));
        it("should return Resize when resizing", () => runUpdateTest(<any>{ resizeMode: 1 }, UpdateType.Resize));
        it("should return Resize when resizing and data has changed initially",
            () => runUpdateTest(resizeAndDataUpdateOptions, UpdateType.Resize));
        it("should return Data when resizing and data has changed initially",
             () => runUpdateTest(resizeAndDataUpdateOptions, UpdateType.Data));
        it("should return Settings when settings have changed intially",
            () => runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Settings));
        it("should return Settings when settings have changed and data has changed intially",
            () => runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Data)
        );
        it("should return Settings when settings have changed",
            () => settingsTest("setting1", "diff_setting", UpdateType.Settings)
        );
        it("should NOT return Settings when settings have NOT changed",
            () => settingsTest("setting1", "setting1", UpdateType.Unknown, true)
        );
        it("should return Settings when settings have changed twice and data has changed initially", () => {
            runUpdateTest(simpleSettingsUpdateOptions, UpdateType.Data);
        });
        it ("should return Data when the number of categories changed", () => {
            runMultipleUpdateTests({
                dataViews: [{}]
            } as any, {
                dataViews: [{
                    categorical: {
                        categories: [{}]
                    }
                }, ]
            } as any,
            UpdateType.Data);
        });
        it ("should NOT return Data when the number of categories has not changed",
            () => identityTest([{ key: "KEY1" }], [{ key: "KEY1" }], UpdateType.Unknown, true)
        );
        it ("should return Data when the number of categories has not changed, but the underlying data has",
            () => identityTest([{ key: "KEY1" }], [{ key: "DIFFERENT_KEY" }], UpdateType.Data)
        );
        it ("should return Data when the number of categories has changed, and the underlying data has changed",
            () => identityTest([{ key: "KEY1" }], [{ key: "KEY1" }, { key: "KEY2" }], UpdateType.Data)
        );
        it ("should return Unknown when undefined is passed to it",
            () => identityTest(undefined, undefined, UpdateType.Unknown, true)
        );
        it ("should return Data when undefined is passed to one of the data sets",
            () => identityTest([{ key: "KEY1" }], undefined, UpdateType.Data)
        );
        it ("should return Data when undefined is passed to the other one of the data sets",
            () => identityTest(undefined, [{ key: "KEY1" }], UpdateType.Data)
        );
        it ("should return Data when the same identity array is mutated",
            () => {
                const identities = [{ key: "KEY1" }];
                const arr = {
                    dataViews: [{
                        categorical: {
                            categories: [{
                                identity: identities
                            }, ]
                        }
                    }, ]
                } as any;
                const fakeVisual = {
                    update: () => 0
                } as any as VisualBase;
                const getter = updateTypeGetter(fakeVisual);
                fakeVisual.update(<any>_.assign({}, arr));
                identities.push({
                    key: "KEY2"
                });
                fakeVisual.update(<any>_.assign({}, arr));
                let result = getter();
                expect(result).to.eq(UpdateType.Data);
            }
        );
        it ("should return Data when the number of categories has changed, and the underlying data has changed not in the first, middle or last position",
            () => identityTest(
                [{ key: "KEY1" }, { key: "KEY2" }, { key: "KEY3"}, { key: "KEY4"}],
                [{ key: "KEY1" }, { key: "KEY2" }, { key: "DIFF KEY"}, { key: "KEY4"}],
            UpdateType.Data)
        );

        it ("should return Data when the metadata columns have changed data roles",
            () => dataRoleTest("ROLE_1", "ROLE_2", UpdateType.Data)
        );
        it ("should NOT return Data when the metadata columns have NOT changed data roles", 
            () => dataRoleTest("ROLE_1", "ROLE_1", UpdateType.Unknown, true)
        );

        it ("should return Data when the metadata columns have changed sort", () => {
            sortTest(true, false, UpdateType.Data);
            sortTest(undefined, false, UpdateType.Data);
            sortTest(undefined, true, UpdateType.Data);
            sortTest(false, true, UpdateType.Data);
            sortTest(false, undefined, UpdateType.Data);
        });
        it ("should NOT return Data when the metadata columns have NOT changed sort", 
            () => sortTest(true, true, UpdateType.Unknown, true)
        );
        it ("should NOT return Data when the metadata columns have NOT changed sort", 
            () => sortTest(undefined, undefined, UpdateType.Unknown, true)
        );
    });

    describe("colorizedLog", () => {
        it("Simple", () => {
            expect(colorizedLog("%cRed", "color:red")).to.equal(
                '<span></span><span style="color:red">Red</span>');
        });
        it("Simple -- No Color", () => {
            expect(colorizedLog("No Color")).to.equal("No Color");
        });
        it("Complex", () => {
            expect(colorizedLog("AAs aas%cRed%cGreen", "color:red", "color:green")).to.equal(
                '<span>AAs aas</span><span style="color:red">Red</span><span style="color:green">Green</span>');
        });
    });
});
