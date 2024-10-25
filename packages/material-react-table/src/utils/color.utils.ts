import tinycolor from 'tinycolor2';

/**
 * Adjusts the opacity of a color.
 * @param color - The color to adjust.
 * @param alpha - The opacity value (0 to 1).
 * @returns The color with adjusted alpha.
 */
export const alpha = (color: string, alpha: number): string => {
  return tinycolor(color).setAlpha(alpha).toRgbString();
};

/**
 * Darkens a color by the given amount.
 * @param color - The color to darken.
 * @param amount - Amount to darken (0 to 1).
 * @returns The darkened color.
 */
export const darken = (color: string, amount: number): string => {
  return tinycolor(color)
    .darken(amount * 100)
    .toString();
};

/**
 * Lightens a color by the given amount.
 * @param color - The color to lighten.
 * @param amount - Amount to lighten (0 to 1).
 * @returns The lightened color.
 */
export const lighten = (color: string, amount: number): string => {
  return tinycolor(color)
    .lighten(amount * 100)
    .toString();
};
