import React from 'react';
import { Text, TextProps, StyleSheet, View, ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export interface NeonTextProps extends TextProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function NeonText({ children, style, containerStyle, ...rest }: NeonTextProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* LAYER 1: The Neon Glow (Back layer) */}
      {/* We render simple text with a shadow to create the 'bloom' */}
      <Text {...rest} style={[styles.textBase, style, styles.glowLayer]}>
        {children}
      </Text>

      {/* LAYER 2: The Gradient Text (Front layer) */}
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Text {...rest} style={[styles.textBase, style]}>
            {children}
          </Text>
        }
      >
        <LinearGradient
          colors={['#ff33cc', '#a64dff', '#00e5ff']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // This is important to stack the two layers
    position: 'relative',
    alignSelf: 'center', // Or 'flex-start' depending on your layout
  },
  textBase: {
    fontSize: 40, // Adjust size as needed
    lineHeight: 40, // Extra height so descenders like 'y' are not clipped
    textAlign: 'center',
    paddingVertical: 6,
  },
  // This creates the fuzzy neon backlight
  glowLayer: {
    color: '#a64dff', // The base color of the glow (purple)
    textShadowColor: 'rgba(255, 51, 204, 0.9)', // Pinkish glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15, // High radius for the 'neon' look
    opacity: 0.8,
  },
  maskedView: {
    // Position absolute allows this to sit exactly on top of the glow layer
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
});

export default NeonText;
