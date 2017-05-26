import { convertItemsWithSegments } from "./convertItemsWithSegments";
import { expect } from "chai";

describe("convertItemsWithSegments", () => {
    describe("valueSegments", () => {
        const createDataViewForData = (data: { cat: string; values: number[] }[]) => {
            return <powerbi.DataView><any>{
                categorical: {
                    categories: [{
                        identity: data.map((n, i) => i),
                        values: data.map(n => n.cat),
                    }],

                    // data[0].values is mostly to get the # of segments, cause "values:" here is a list of segments
                    values: data[0].values.map((whatever, segmentIdx) => {
                        return {
                            values: data.map(n => n.values[segmentIdx]),
                        };
                    }),
                },
            };
        };

        it("should use the same width for the same segment value", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [10, 5],
            }, {
                cat: "Cat B",
                values: [10, 60],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));
            expect(items[0].valueSegments[0].width).to.be.equal(items[1].valueSegments[0].width);
        });

        it("should return correct widths for negative numbers", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [-10],
            }, {
                cat: "Cat B",
                values: [10],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            // The first rows bar should be full width, since it is -10, and the abs(values) is 10 (-10 & 10)
            expect(items[0].valueSegments[0].width).to.be.equal(100);
        });

        it("should return correct widths for positive numbers", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [-10],
            }, {
                cat: "Cat B",
                values: [10],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            // The first rows bar should be full width, since it is -10, and the abs(values) is 10 (-10 & 10)
            expect(items[1].valueSegments[0].width).to.be.equal(100);
        });

        it("should scale the overall width, if the sum of the segment/column widths never reach 100%", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [0, 30],
            }, {
                cat: "Cat B",
                values: [0, 60],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            // Since column[0] max value is 0 (0, 0), then the width of all the rows column[0] will be 0.
            // Since there are two columns, they will each take up 50% of the of the overall width of the entire stacked bar
            // and since the first column is 0 width for both rows, this means that the whole row will only ever take up at most
            // 50% of the available area, so we scale the overall bar to fill the remaining space.
            expect(items[0].renderedValue).to.be.equal(200);
            expect(items[1].renderedValue).to.be.equal(200);
        });

        it("should scale a mixture of negative and positive bars correctly", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [-10, 20],
            }, {
                cat: "Cat B",
                values: [5, -30],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            expect(items[0].valueSegments[0].width).to.be.closeTo(16.66, 0.02);
            expect(items[0].valueSegments[1].width).to.be.closeTo(33.33, 0.02);

            expect(items[1].valueSegments[0].width).to.be.closeTo(8.33, 0.02);
            expect(items[1].valueSegments[1].width).to.be.equal(50);
        });

        it("should scale a mixture of negative and positive bars correctly", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [-10, 20],
            }, {
                cat: "Cat B",
                values: [5, -30],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            expect(items[0].valueSegments[0].width).to.be.closeTo(16.66, 0.02);
            expect(items[0].valueSegments[1].width).to.be.closeTo(33.33, 0.02);

            expect(items[1].valueSegments[0].width).to.be.closeTo(8.33, 0.02);
            expect(items[1].valueSegments[1].width).to.be.equal(50);
        });

        it("should scale a positive bars correctly", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [10, 20],
            }, {
                cat: "Cat B",
                values: [5, 30],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            expect(items[0].valueSegments[0].width).to.be.closeTo(16.66, 0.02);
            expect(items[0].valueSegments[1].width).to.be.closeTo(33.33, 0.02);

            expect(items[1].valueSegments[0].width).to.be.closeTo(8.33, 0.02);
            expect(items[1].valueSegments[1].width).to.be.equal(50);
        });

        it("should scale bars with zeros correctly", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [10, 0],
            }, {
                cat: "Cat B",
                values: [0, 30],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            expect(items[0].valueSegments[0].width).to.be.closeTo(16.66, 0.02);
            expect(items[0].valueSegments[1].width).to.be.equal(0);

            expect(items[1].valueSegments[0].width).to.be.equal(0);
            expect(items[1].valueSegments[1].width).to.be.equal(50);
        });

        it("should scale bars with one row with all zeros correctly", () => {
            const dv = createDataViewForData([{
                cat: "Cat A",
                values: [0, 0],
            }, {
                cat: "Cat B",
                values: [10, 30],
            }]);
            const { items } = convertItemsWithSegments(dv, () => ({}));

            expect(items[0].valueSegments[0].width).to.be.equal(0);
            expect(items[0].valueSegments[1].width).to.be.equal(0);

            expect(items[1].valueSegments[0].width).to.be.closeTo(16.66, 0.02);
            expect(items[1].valueSegments[1].width).to.be.equal(50);
        });
    });
});
