import * as models from "powerbi-models";
/**
 * Builds a "contains" filter from the given search value, and the given dataView
 * If text will do an actual contains, otherwise it defaults to equality.
 * @param source The column to create a contains filter for
 * @param searchVal The value to create the filter for
 */
export default function buildContainsFilter(source: powerbi.DataViewMetadataColumn, searchVal: any): models.AdvancedFilter;
