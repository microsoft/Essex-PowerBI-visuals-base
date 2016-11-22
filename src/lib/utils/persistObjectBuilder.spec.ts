import createPersistObjectBuilder from "./persistObjectBuilder";
import { expect } from "chai";

describe("persistObjectBuilder", () => {
    const createInstance = () => {
        return {
            instance: createPersistObjectBuilder(),
        };
    };

    describe("addToPersist", () => {
        it("should create a single 'merge' persist object", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SOME_PROPERTY", 1);

            const merge = instance.build().merge;
            expect(merge).to.be.ok;
            expect(merge).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY": 1,
                },
            }]);
        });
        it("should create a merged 'merge' persist object, when there are multiple properties with a single objectName", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SOME_PROPERTY", 1);
            instance.persist("SOME_OBJECT", "SOME_PROPERTY_2", 12);

            const merge = instance.build().merge;
            expect(merge).to.be.ok;
            expect(merge).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY": 1,
                    "SOME_PROPERTY_2": 12,
                },
            }]);
        });
        it("should create an additional 'merge' persist object, if it is marked as 'asOwnInstance'", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SOME_PROPERTY", 1);
            instance.persist("SOME_OBJECT", "SOME_PROPERTY_2", 12, undefined, undefined, undefined, true);

            const merge = instance.build().merge;
            expect(merge).to.be.ok;
            expect(merge).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY": 1,
                },
            }, {
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY_2": 12,
                },
            }]);
        });
        it("should persist values that are 'VisualObjectInstances' if it is marked as 'asOwnInstance'", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SOME_PROPERTY", 1);
            instance.persist("SOME_OBJECT", "SOME_PROPERTY_2", {
                properties: {
                    additional1: "Hello",
                    additional2: "Hello2",
                },
            }, undefined, undefined, undefined, true);

            const merge = instance.build().merge;
            expect(merge).to.be.ok;
            expect(merge).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY": 1,
                },
            }, {
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    additional1: "Hello",
                    additional2: "Hello2",
                },
            }]);
        });
        it("should create a single 'remove' persist object, if the object is undefined", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SOME_PROPERTY", undefined);
            const remove = instance.build().remove;
            expect(remove).to.be.ok;
            expect(remove).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SOME_PROPERTY": undefined,
                },
            }]);
        });
        it("should create a single 'remove' and a 'merge' persist object, if there is an undefined object and a defined one", () => {
            const { instance } = createInstance();
            instance.persist("SOME_OBJECT", "SHOULD_BE_REMOVED", undefined);
            instance.persist("SOME_OBJECT", "SHOULD_BE_MERGED", 12);
            const { merge, remove } = instance.build();
            expect(remove).to.be.ok;
            expect(merge).to.be.ok;

            expect(merge).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SHOULD_BE_MERGED": 12,
                },
            }]);

            expect(remove).to.be.deep.equal([{
                objectName: "SOME_OBJECT",
                selector: undefined,
                properties: {
                    "SHOULD_BE_REMOVED": undefined,
                },
            }]);
        });
    });
});
