import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Ícono de Material Design Icons a partir de su path (viewBox 24x24). */
export function Icon({ path, size = 24, color }: { path: string; size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={path} fill={color} />
    </Svg>
  );
}
