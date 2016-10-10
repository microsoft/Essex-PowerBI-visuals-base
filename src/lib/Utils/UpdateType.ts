
/**
 * Represents an update type for a visual
 */
enum UpdateType {
    Unknown = 0,
    Data = 1 << 0,
    Resize = 1 << 1,
    Settings = 1 << 2,
    Initial = 1 << 3,

    // Some utility keys for debugging
    /* tslint:disable */
    DataAndResize = UpdateType.Data | UpdateType.Resize,
    DataAndSettings = UpdateType.Data | UpdateType.Settings,
    SettingsAndResize = UpdateType.Settings | UpdateType.Resize,
    All = UpdateType.Data | UpdateType.Resize | UpdateType.Settings
    /* tslint:enable */
}
export default UpdateType;
