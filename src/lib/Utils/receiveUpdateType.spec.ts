import "mocha";
import "powerbi-visuals/lib/powerbi-visuals";
import { expect } from "chai";
import { IUpdateTypeReceiver } from "./receiveUpdateType";
import UpdateType from "./UpdateType";
import * as mock from "mock-require";

class BaseMockVisual implements IUpdateTypeReceiver, powerbi.IVisual {
    public isInitCalled: boolean = false;
    public isUpdateWithTypeCalled: boolean = false;

    public init(options: powerbi.VisualInitOptions) {
        this.isInitCalled = true;
    }

    public updateWithType(update: powerbi.VisualUpdateOptions, updateType: UpdateType) {
        this.isUpdateWithTypeCalled = true;
        expect(updateType).to.deep.equal(10);
    }
}

const mockSut = (calcUpdateType: Function) => {
    mock("./calcUpdateType", { default:  calcUpdateType } );
    const mod = mock.reRequire("./receiveUpdateType");
    return mod["receiveUpdateType"];
};

describe("receiveUpdateType", () => {
    it("can decorate a visual class", () => {
        let isCalcUpdateTypeCalled = false;
        const receiveUpdateType = mockSut((prevOptions: any, options: any, boolArg: boolean) => {
            isCalcUpdateTypeCalled = true;
            expect(boolArg).to.be.false;
            expect(prevOptions).to.equal(undefined);
            expect(options).to.deep.equal({});
            return 10;
        });

        @receiveUpdateType()
        class MockVisual extends BaseMockVisual {}
        const visual = new MockVisual();

        expect(visual instanceof MockVisual).to.be.true;
        expect(visual instanceof BaseMockVisual).to.be.true;

        visual["update"]({});
        expect(visual.isUpdateWithTypeCalled).to.be.true;
        expect(isCalcUpdateTypeCalled).to.be.true;
    });

    it("can decorate a visual class with arguments", () => {
        let isCalcUpdateTypeCalled = false;
        const receiveUpdateType = mockSut((prevOptions: any, options: any, boolArg: boolean) => {
            isCalcUpdateTypeCalled = true;
            expect(boolArg).to.be.true;
            expect(prevOptions).to.deep.equal(undefined);
            expect(options).to.deep.equal({});
            return 10;
        });

        @receiveUpdateType(true)
        class MockVisual extends BaseMockVisual {}

        const visual = new MockVisual();
        visual["update"]({});
        expect(visual.isUpdateWithTypeCalled).to.be.true;
        expect(isCalcUpdateTypeCalled).to.equal(true);
    });

    it("invokes calcUpdateType with (prevOptions, options) on the second invocation", () => {
        let numReceiveUpdateInvocations = 0;
        const receiveUpdateType = mockSut((prevOptions: any, options: any, boolArg: boolean) => {
            if (numReceiveUpdateInvocations === 0) {
                expect(boolArg).to.be.true;
                expect(prevOptions).to.deep.equal(undefined);
                expect(options).to.deep.equal({x: 1});
            } else {
                expect(boolArg).to.be.true;
                expect(prevOptions).to.deep.equal({ x: 1 });
                expect(options).to.deep.equal({x: 2});
            }
            numReceiveUpdateInvocations += 1;
            return 10;
        });

        @receiveUpdateType(true)
        class MockVisual extends BaseMockVisual {}

        const visual = new MockVisual();
        visual["update"]({ x: 1 });
        visual["update"]({ x: 2 });
        expect(visual.isUpdateWithTypeCalled).to.be.true;
        expect(numReceiveUpdateInvocations).to.equal(2);
    });
});
