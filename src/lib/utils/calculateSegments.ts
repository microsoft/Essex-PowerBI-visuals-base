import * as d3 from "d3";
import * as _ from "lodash";
import { fullColors } from "../colors";
import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Calculates the segments that are required to represent the pbi values
 */
export default function calculateSegments(
    values: powerbi.DataViewValueColumns,
    defaultColor: string = "#ccc",
    gradient?: { startColor: string; endColor: string; }, // The gradient used to color the individual segments
    segmentColors?: { color: string; identity?: any }[]) {  /* The colors for each segment */
    "use strict";
    let segmentInfo: { name: any, identity?: any }[] = [];
    if (values && values.length) {
        const isSeriesData = !!(values.source && values.source.roles["Series"]);
        segmentInfo =
            (isSeriesData ?
                <any>values.grouped() :
                values.map((n, i) => ({ name: (i + 1) + "", identity: n.identity })));
    }

    let gradientScale: d3.scale.Linear<string, number>;
    if (gradient) {
        gradientScale = d3.scale.linear<string, number>()
                .domain([0, segmentInfo.length])
                .interpolate(d3.interpolateRgb as any)
                .range([gradient.startColor as any, gradient.endColor as any]);
    }

    return _.sortBy(segmentInfo, ["name"]).map((v, i) => {
        let color = fullColors[i];
        if (segmentInfo.length > 1) {
            if (gradientScale) {
                color = gradientScale(i) as any;
            } else if (segmentColors && segmentColors[i]) {
                color = segmentColors[i].color;
            }
        } else {
            color = defaultColor || fullColors[i];
        }
        color = color || "#ccc";
        return {
            name: v.name,
            identity: v.identity,
            color,
        };
    });
}
