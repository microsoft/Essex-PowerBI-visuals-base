export interface ColorsArray extends Array<string> {
    primary: string[];
    full: string[];
}

const colors: ColorsArray = <any>[
    "#01B8AA",
   // "#374649",
    "#FD625E",
    "#F2C80F",
  //  "#5F6B6D", // Remove dark colors for now, for the black text
    "#8AD4EB",
    "#FE9666", // Bethany's Mango
    "#A66999",
    "#3599B8",
    "#DFBFBF",
];

colors.primary = colors.slice(0);
colors.full = [
    "#01B8AA",
   // "#374649",
    "#FD625E",
    "#F2C80F",
  //  "#5F6B6D", // Remove dark colors for now, for the black text
    "#8AD4EB",
    "#FE9666", // Bethany's Mango
    "#A66999",
    "#3599B8",
    "#DFBFBF",

    // Second loop
    "#4AC5BB",
    "#5F6B6D",
    "#FB8281",
    "#F4D25A",
    "#7F898A",
    "#A4DDEE",
    "#FDAB89",
    "#B687AC",
    "#28738A",
    "#A78F8F",

    // Third loop
    "#168980",
    "#293537",
    "#BB4A4A",
    "#B59525",
    "#475052",
    "#6A9FB0",
    "#BD7150",
    "#7B4F71",
    "#1B4D5C",
    "#706060",

    // Fourth loop
    "#0F5C55",
    "#1C2325",
    "#7D3231",
    "#796419",
    "#303637",
    "#476A75",
    "#7E4B36",
    "#52354C",
    "#0D262E",
    "#544848",
];

export default colors;
export const fullColors = colors.full;
