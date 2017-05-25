import { convertItemsWithSegments } from "./convertItemsWithSegments";
import { expect } from "chai";

describe("convertItemsWithSegments", () => {
    describe("valueSegments", () => {
        // it("should use a non-zero minimum width for the segment with the minimum value if the minimum value is negative", () => {
        //     const { items } = convertItemsWithSegments(<any>{
        //         categorical: {
        //             categories: [{
        //                 identity: [
        //                     0,
        //                     1,
        //                     2,
        //                 ],
        //                 values: [
        //                     "CatA",
        //                     "CatB",
        //                     "CatC",
        //                 ],
        //             }],
        //             values: [{
        //                 // Col 1
        //                 values: [
        //                     -10, // Row 1
        //                     0, // Row 2
        //                     0, // Row 3
        //                 ],
        //             }],
        //         },
        //     }, () => ({}));
        //     expect(items[0].valueSegments[0].width).to.be.greaterThan(0);
        // });
        // it("should use a non-zero minimum width for the segment with the minimum value if the minimum value is positive", () => {
        //     const { items } = convertItemsWithSegments(<any>{
        //         categorical: {
        //             categories: [{
        //                 identity: [
        //                     0,
        //                     1,
        //                     2,
        //                 ],
        //                 values: [
        //                     "CatA",
        //                     "CatB",
        //                     "CatC",
        //                 ],
        //             }],
        //             values: [{
        //                 // Col 1
        //                 values: [
        //                     10, // Row 1
        //                     0, // Row 2
        //                     0, // Row 3
        //                 ],
        //             }],
        //         },
        //     }, () => ({}));
        //     expect(items[0].valueSegments[0].width).to.be.greaterThan(0);
        // });
        // it("should use a 0 width for the segment with the minimum value if the minimum value is 0", () => {
        //     const { items } = convertItemsWithSegments(<any>{
        //         categorical: {
        //             categories: [{
        //                 identity: [
        //                     0,
        //                     1,
        //                     2,
        //                 ],
        //                 values: [
        //                     "CatA",
        //                     "CatB",
        //                     "CatC",
        //                 ],
        //             }],
        //             values: [{
        //                 // Col 1
        //                 values: [
        //                     0, // Row 1
        //                     0, // Row 2
        //                     0, // Row 3
        //                 ],
        //             }],
        //         },
        //     }, () => ({}));
        //     expect(items[0].valueSegments[0].width).to.be.equal(0);
        // });

        // it("should use a full width for all values in the segment if the range is 0, but it has non-zero values", () => {

        // });
        // it("should use a full width for all values in the segment if the range is 0, but it has negative values", () => {

        // });
        // it("should use a 0 width for all values in the segment if the range is 0, but it has all 0 values", () => {

        // });
    });
});
