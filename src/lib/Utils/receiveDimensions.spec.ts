import "powerbi-visuals/lib/powerbi-visuals";
import "mocha";
import { expect } from "chai";
import {
    IDimensions,
    IReceiveDimensions,
    receiveDimensions,
} from "./receiveDimensions";


class BaseRawDimensional implements IReceiveDimensions {
    public dimensions: IDimensions;
    public initOptions: powerbi.VisualInitOptions;

    public setDimensions(dimensions: IDimensions) {
        this.dimensions = dimensions;
    }
    public init(options: powerbi.VisualInitOptions) {
        this.initOptions = options;
    }
}


class BasePBIDimensional extends BaseRawDimensional implements powerbi.IVisual {
    public updateOptions: powerbi.VisualUpdateOptions;

    public init(options: powerbi.VisualInitOptions) {
        this.initOptions = options;
    }
    public update(options: powerbi.VisualUpdateOptions) {
        this.updateOptions = options;
    }
}

describe("receiveDimensions", () => {
    it("will can decorate class, and not interfere with reflection", () => {
        @receiveDimensions
        class Test extends BaseRawDimensional {}

        const instance = new Test();
        expect(instance instanceof Test).to.be.true;
        expect(instance instanceof BaseRawDimensional).to.be.true;
    });

    it("will set dimensions on init and update", () => {
        @receiveDimensions
        class Test extends BasePBIDimensional {}

        const instance = new Test();
        expect(instance instanceof Test).to.be.true;
        expect(instance instanceof BaseRawDimensional).to.be.true;
        expect(instance instanceof BasePBIDimensional).to.be.true;

        instance.init({ viewport: {width: 10, height: 100} } as powerbi.VisualInitOptions);
        expect(instance.dimensions).to.deep.equal({width: 10, height: 100});
        instance.update({ viewport: {width: 30, height: 40} } as powerbi.VisualUpdateOptions);
        expect(instance.dimensions).to.deep.equal({width: 30, height: 40});

        expect(instance.initOptions).to.be.ok;
        expect(instance.updateOptions).to.be.ok;
    });
});
