import * as helpers from "./helpers";
import { ISetting } from "./interfaces";
// import { defineSetting } from "./settingDecorator";
import { expect } from "chai";
import * as _ from "lodash";

describe("Helpers", () => {
    // describe("buildPersistObjects", () => {
    //     it("should not crash if a 'setting' returns undefined");
    // });

    describe("parseSettingsFromPBI", () => {
        describe("without a dataView", () => {
            it("should not fail when passed a class that isn't a settings class", () => {
                const settings = helpers.parseSettingsFromPBI(ClassWithNoSettings, undefined, {
                    anotherSetting: true,
                });
                expect(settings).to.be.ok;
            });
            function settingsMergeTest(props: any, propsHasPrecedence: boolean) {
                const { settings, classType } = createClassWithSettings();
                const result = helpers.parseSettingsFromPBI(classType, undefined, props, propsHasPrecedence);

                // Make sure all of the values returned from parse settings are equal to the settings default values
                Object.keys(settings).forEach(n => {
                    const s: ISetting = settings[n];
                    let valueToCheck = (s.descriptor.defaultValue);
                    if (props && props.hasOwnProperty(s.propertyName)) {
                        valueToCheck = propsHasPrecedence ? props[s.propertyName] : valueToCheck;
                        delete props[s.propertyName];
                    }
                    expect(result[s.propertyName]).to.be.equal(valueToCheck);
                });

                // Make sure that any prop passed that isn't a setting is also in the result
                Object.keys(props).forEach(p => {
                    expect(result[p]).to.be.equal(props[p]);
                });
            }
            it("should return all the default values of a settings class if there is no dataView", () => {
                settingsMergeTest({}, false);
            });
            it("should apply the addtional props on top of the values parsed from PBI if props has precedence", () => {
                settingsMergeTest({
                    textSetting: "SOME OTHER VALUE",
                }, true);
            });
            it("should apply props with 'undefined' on top of the values parsed from PBI if props has precedence", () => {
                settingsMergeTest({
                    textSetting: undefined,
                }, true);
            });
            it("should apply props with 'null' on top of the values parsed from PBI if props has precedence", () => {
                settingsMergeTest({
                    textSetting: null, // tslint:disable-line
                }, true);
            });
            it("should add any additional props that aren't settings if props has precedence", () => {
                settingsMergeTest({
                    notASetting: "ShouldBeHere", // tslint:disable-line
                }, true);
            });
            it("should apply the addtional props before the values parsed from PBI if props doesn't have precedence", () => {
                settingsMergeTest({
                    textSetting: "SOME OTHER VALUE",
                }, false);
            });
            it("should apply props with 'undefined' before the values parsed from PBI if props doesn't have precedence", () => {
                settingsMergeTest({
                    textSetting: undefined,
                }, false);
            });
            it("should apply props with 'null' before the values parsed from PBI if props doesn't have precedence", () => {
                settingsMergeTest({
                    textSetting: null, // tslint:disable-line
                }, false);
            });
            it("should add any additional props that aren't settings if props does not have precedence", () => {
                settingsMergeTest({
                    notASetting: "ShouldBeHere", // tslint:disable-line
                }, false);
            });
        });

        describe("with a dataView", () => {
            it("should load values from a dataView", () => {
                const { settings, classType } = createClassWithSettings();
                let dv: powerbi.DataView = <any>{};
                dv = defineFakeSettingValueOnDataView(settings.numberSetting, 1234, dv);

                const result = helpers.parseSettingsFromPBI(classType, dv);

                expect(result["numberSetting"]).to.be.equal(1234);
            });
            it("should override values from the dataView with the props if props has precedence", () => {
                const { settings, classType } = createClassWithSettings();
                let dv: powerbi.DataView = <any>{};
                dv = defineFakeSettingValueOnDataView(settings.numberSetting, 1234, dv);

                const result = helpers.parseSettingsFromPBI(classType, dv, {
                    numberSetting: 54321, // this will take precedence
                }, true);

                expect(result["numberSetting"]).to.be.equal(54321);
            });
            it("should return values from the dataView if the props does not have precedence", () => {
                const { settings, classType } = createClassWithSettings();
                let dv: powerbi.DataView = <any>{};
                dv = defineFakeSettingValueOnDataView(settings.numberSetting, 1234, dv);

                const result = helpers.parseSettingsFromPBI(classType, dv, {
                    numberSetting: 54321, // this will take precedence
                }, false);

                expect(result["numberSetting"]).to.be.equal(1234);
            });
            it("should return the defaultValues if the dataView has undefined values and the props does not have precedence", () => {
                const { settings, classType } = createClassWithSettings();
                let dv: powerbi.DataView = <any>{};
                dv = defineFakeSettingValueOnDataView(settings.numberSetting, undefined, dv);

                const result = helpers.parseSettingsFromPBI(classType, dv, {
                    numberSetting: 54321, // this will take precedence
                }, false);

                expect(result["numberSetting"]).to.be.eq(0);
            });
            it("should return the defaultValues if the dataView has null values and the props does not have precedence", () => {
                const { settings, classType } = createClassWithSettings();
                let dv: powerbi.DataView = <any>{};
                dv = defineFakeSettingValueOnDataView(settings.numberSetting, null, dv); // tslint:disable-line

                const result = helpers.parseSettingsFromPBI(classType, dv, {
                    numberSetting: 54321, // this will take precedence
                }, false);

                expect(result["numberSetting"]).to.be.eq(0);
            });
        });
    });

    describe("toJSON", () => {
        it("should convert settings that have no/undefined values to null", () => {
            const json = helpers.toJSON(ClassWithNoSettings, {
                test: undefined,
                test2: 3,
                nested: {
                    nestedTest: undefined,
                    nestedTest2: null, // tslint:disable-line
                    nestedTest3: 0,
                },
            });
            expect(json).to.be.deep.equal({
                test: null, // tslint:disable-line
                test2: 3,
                nested: {
                    nestedTest: null, // tslint:disable-line
                    nestedTest2: null, // tslint:disable-line
                    nestedTest3: 0,
                },
            });
        });
    });

    describe("convertValueFromPBI", () => {

        // it("should return 'null' for settings that do not have a value or a defaultValue", () => {
        //     const fakeSetting = createFakeSetting();
        //     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
        //     expect(result).to.be.ok;
        //     expect(result.adaptedValue).to.be.null;
        // });

        it("should return '3' for a setting that has the default value of '3'", () => {
            const fakeSetting = createFakeSetting(3);
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(3);
        });

        it("should return '0' for a setting that has the default value of '0'", () => {
            const fakeSetting = createFakeSetting(0);
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(0);
        });

        it("should return '0' for a setting that has the default value of '5' but the dataView has a value of '0'", () => {
            const fakeSetting = createFakeSetting(5);
            const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 0, {});
            const result = helpers.convertValueFromPBI(fakeSetting, fakeDV);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(0);
        });

        it("should return '5' for a setting that has the default value of '1' but the dataView has a value of '5'", () => {
            const fakeSetting = createFakeSetting(1);
            const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {});
            const result = helpers.convertValueFromPBI(fakeSetting, fakeDV);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(5);
        });

        it("should return undefined for a setting that has the default value of undefined", () => {
            const fakeSetting = createFakeSetting(1);
            const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {});
            const result = helpers.convertValueFromPBI(fakeSetting, fakeDV);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(5);
        });

        it("should return null for a setting that has the default value of null", () => {
            const fakeSetting = createFakeSetting(null); // tslint:disable-line
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.null;
        });

        it("should call parse to parse a value from pbi", () => {
            const fakeSetting = createFakeSetting(1);
            let called = false;
            fakeSetting.descriptor.parse = () => called = true;
            helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(called).to.be.true;
        });

        it("should call parse to parse with the correct settings, dataView, pbiValue, descriptor", () => {
            const fakeSetting = createFakeSetting(1);
            const fakeDV = defineFakeSettingValueOnDataView(fakeSetting, 5, {});

            fakeSetting.descriptor.parse = (pbiValue: any, descriptor: any, dataView: any, setting: any) => {
                expect(pbiValue).to.be.equal(5);
                expect(descriptor).to.be.equal(fakeSetting.descriptor);
                expect(dataView).to.be.equal(fakeDV);
                expect(setting).to.be.equal(fakeSetting);
            };

            helpers.convertValueFromPBI(fakeSetting, fakeDV);
        });

        it("should return '5' for a setting that has the default value of '5' and setting.parse returns undefined", () => {
            const fakeSetting = createFakeSetting(5);
            fakeSetting.descriptor.parse = () => <any>undefined;
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(5);
        });

        it("should return '5' for a setting that has the default value of '5' and setting.parse returns null", () => {
            const fakeSetting = createFakeSetting(5);
            fakeSetting.descriptor.parse = () => <any>null; // tslint:disable-line
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(5);
        });

        it("should return '10' for a setting that has the default value of '5' and setting.parse returns '10'", () => {
            const fakeSetting = createFakeSetting(5);
            fakeSetting.descriptor.parse = () => <any>10; // tslint:disable-line
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.equal(10);
        });

        // it("should return null for a setting that does not have a default value and setting.parse returns null", () => {
        //     const fakeSetting = createFakeSetting();
        //     fakeSetting.descriptor.parse = () => <any>null; // tslint:disable-line
        //     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
        //     expect(result).to.be.ok;
        //     expect(result.adaptedValue).to.be.null;
        // });

        // it("should return null for a setting that does not have a default value and setting.parse returns undefined", () => {
        //     const fakeSetting = createFakeSetting();
        //     fakeSetting.descriptor.parse = () => <any>undefined; // tslint:disable-line
        //     const result = helpers.convertValueFromPBI(fakeSetting, undefined);
        //     expect(result).to.be.ok;
        //     expect(result.adaptedValue).to.be.null;
        // });
    });

    describe("convertValueToPBI", () => {

        it("should not crash if a 'setting' returns undefined", () => {
            const fakeSetting = createFakeSetting();
            const result = helpers.convertValueToPBI({}, fakeSetting, undefined);
            expect(result).to.be.ok;
        });
    });
});


function createClassWithSettings() {
    "use strict";
    class ClassWithSettings {

    }
    const settings = {
        textSetting: createFakeSetting("TEST", "textSetting", ClassWithSettings),
        numberSetting: createFakeSetting(0, "numberSetting", ClassWithSettings),
        boolSetting: createFakeSetting(false, "boolSetting", ClassWithSettings),
        settingWithNullDefaultValue: createFakeSetting(null, "settingWithNullDefaultValue", ClassWithSettings), // tslint:disable-line
        settingWithNoDefaultValue: createFakeSetting(undefined, "settingWithNoDefaultValue", ClassWithSettings),
    };
    ClassWithSettings.constructor[helpers.METADATA_KEY] = {
        settings,
    };

    return {
        settings,
        classType: ClassWithSettings
    };
};


class ClassWithNoSettings { }
function createFakeSetting(defaultValue?: any, name?: string, classType?: any) {
    "use strict";
    return {
        propertyName: name || "fakeprop",
        descriptor: {
            category: "fakecategory",
            name: name || "fakename",
            defaultValue: defaultValue,
        },
        classType: classType || ClassWithNoSettings,
        isChildSettings: false,
    } as ISetting;
}


function defineFakeSettingValueOnDataView(setting: any, value: any, dataView: any) {
    "use strict";
    _.merge(dataView || {}, {
        metadata: <any>{
            objects: <any>{
                [setting.descriptor.category]: {
                    [setting.descriptor.name]: value,
                },
            },
        },
    });
    return dataView;
}
