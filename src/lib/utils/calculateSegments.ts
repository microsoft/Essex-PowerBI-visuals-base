import * as d3 from "d3";
import * as _ from "lodash";
import { fullColors } from "../colors";
import "powerbi-visuals/lib/powerbi-visuals";

/**
 * Calculates the segments that are required to represent the pbi values
 * Colorizing operation: "#ccc" < defaultColor < gradient < segmentColors
 */
export default function calculateSegments(
    values: powerbi.DataViewValueColumns,
    defaultColor?: string,
    gradient?: IGradient, // The gradient used to color the individual segments
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
        const { startValue, endValue, startColor, endColor } = gradient;
        const minValue = typeof startValue !== "undefined" ? startValue : d3.min(segmentInfo.map(n => n.name));
        const maxValue = typeof endValue !== "undefined" ? endValue : d3.max(segmentInfo.map(n => n.name));
        gradientScale = d3.scale.linear<string, number>()
                .domain([minValue, maxValue])
                .interpolate(d3.interpolateRgb as any)
                .range([startColor as any, endColor as any]);
    }

    return _.sortBy(segmentInfo, ["name"]).map((v, i) => {
        let color = fullColors[i];
        if (segmentColors && segmentColors[i]) {
            color = segmentColors[i].color;
        } else if (gradientScale) {
            color = gradientScale(v.name) as any;
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

export interface IGradient {
    startColor: string;
    endColor: string;
    startValue?: any;
    endValue?: any;
}
