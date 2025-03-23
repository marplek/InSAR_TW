import { Color } from 'cesium';

export function getColorFromValue(value) {
    if (value <= -20) return Color.BLUE;
    if (value >= 20) return Color.RED;
    if (value < 0) {
        const blueToWhiteRatio = (value + 20) / 20; 
        return Color.lerp(Color.BLUE, Color.WHITE, blueToWhiteRatio, new Color());
    } else {
        const whiteToRedRatio = value / 20; 
        return Color.lerp(Color.WHITE, Color.RED, whiteToRedRatio, new Color());
    }
}