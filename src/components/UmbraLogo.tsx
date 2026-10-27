import React from 'react';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../lib/theme';

/** Logotipo Umbra: un círculo parcialmente eclipsado por otro del color de fondo (media luna). */
export function UmbraLogo({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" accessibilityLabel="logotipo de Umbra">
      <Circle cx={100} cy={100} r={70} fill={colors.alarm} />
      <Circle cx={124} cy={81} r={61} fill={colors.ink} />
    </Svg>
  );
}
