/**
 * Represents an update type for a visual
 */
declare enum UpdateType {
    /**
     * This is an unknown update type
     */
    Unknown = 0,
    /**
     * This is a data update
     */
    Data = 1,
    /**
     * This is a resize operation
     */
    Resize = 2,
    /**
     * This has some settings that have been changed
     */
    Settings = 4,
    /**
     * This is the initial update
     */
    Initial = 8,
    DataAndResize = 3,
    DataAndSettings = 5,
    SettingsAndResize = 6,
    All = 7,
}
export default UpdateType;
