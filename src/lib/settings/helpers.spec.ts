import * as helpers from "./helpers";
// import { defineSetting } from "./settingDecorator";
import { expect } from "chai";
import * as _ from "lodash";

describe("Helpers", () => {
    // describe("buildPersistObjects", () => {
    //     it("should not crash if a 'setting' returns undefined");
    // });

    function createFakeSetting(defaultValue?: any) {
        return {
            propertyName: "fakeprop",
            descriptor: {
                category: "fakecategory",
                name: "fakename",
                defaultValue: defaultValue,
            },
            isChildSettings: false,
        } as any;
    }
    describe("convertValueFromPBI", () => {

        function defineFakeSettingValueOnDataView(setting: any, value: any, dataView: any) {
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

        it("should return 'null' for settings that do not have a value or a defaultValue", () => {
            const fakeSetting = createFakeSetting();
            const result = helpers.convertValueFromPBI(fakeSetting, undefined);
            expect(result).to.be.ok;
            expect(result.adaptedValue).to.be.null;
        });

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
    });

    describe("convertValueToPBI", () => {

        it("should not crash if a 'setting' returns undefined", () => {
            const fakeSetting = createFakeSetting();
            const result = helpers.convertValueToPBI({}, fakeSetting, undefined);
            expect(result).to.be.ok;
        });
    });
});
