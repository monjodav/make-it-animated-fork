import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { ViewStyle } from "react-native";

interface AdidasLogoProps {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

/**
 * Adidas logo SVG component
 * Official Adidas logo with three stripes
 */
export const AdidasLogo: React.FC<AdidasLogoProps> = ({ width = 74, height = 44, style }) => (
  <Svg width={width} height={height} viewBox="0 0 74.4 44" fill="none" style={style}>
    <Path
      fill="#FFFFFF"
      d="M0,39l2.9,5h19.6l-7.8-13.5L0,39z M48.4,44L31.9,15.5l-14.7,8.4L28.8,44H48.4z M54.7,44h19.7L48.9,0L34.2,8.5L54.7,44z"
    />
  </Svg>
);
