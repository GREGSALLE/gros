import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { logos } from '../lib/logos';
import { colors } from '../lib/theme';

/** Logo de marca sobre una baldosa clara, para que se vean los colores sobre el fondo oscuro. */
export function TechLogo({ name }: { name: string }) {
  const logo = logos[name];
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.bone,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {logo ? (
        <Svg width={30} height={30} viewBox="0 0 24 24" accessibilityLabel={`logo de ${name}`}>
          <Path d={logo.path} fill={logo.hex} />
        </Svg>
      ) : null}
    </View>
  );
}
