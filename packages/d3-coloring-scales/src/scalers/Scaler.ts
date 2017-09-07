export interface Scaler {
    /**
     * Scales a value on an input range into a value domain of [0-1]
     */
    scale(value: number): number;
}
